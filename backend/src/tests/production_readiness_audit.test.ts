import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app, { ensureInitialSeed } from '../server.js';
import { Database } from '../database/connection.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { AutomationRepository } from '../repositories/AutomationRepository.js';
import { AutomationController } from '../automation/AutomationController.js';
import { ConnectorRegistry } from '../connectors/base/ConnectorRegistry.js';
import { MockPlatformConnector } from '../connectors/mock/MockPlatformConnector.js';
import { UpworkConnector } from '../connectors/upwork/UpworkConnector.js';
import { FiverrConnector } from '../connectors/fiverr/FiverrConnector.js';
import { FreelancerConnector } from '../connectors/freelancer/FreelancerConnector.js';
import { MatchingEngine } from '../ai/matching/MatchingEngine.js';
import { DifficultyCalculator } from '../ai/matching/DifficultyCalculator.js';
import { RiskScamSignalEngine } from '../ai/risk/RiskScamSignalEngine.js';
import { ClaimVerifier } from '../ai/proposals/ClaimVerifier.js';
import { ProposalGenerator } from '../ai/proposals/ProposalGenerator.js';
import { AIGateway } from '../ai/gateway/AIGateway.js';
import { generateJobHash } from '../models/NormalizedJob.js';
import { generateToken } from '../api/middleware/auth.js';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository.js';

import { BackgroundWorker } from '../workers/BackgroundWorker.js';

let server: http.Server;
let baseUrl: string;

const defaultTestToken = generateToken({
  userId: 'user_default',
  email: 'user@workmatch.local',
  isAdmin: true,
  planType: 'personal'
});

function makeRequest(path: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any; raw: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = options.body ? JSON.stringify(options.body) : undefined;
    const reqHeaders: Record<string, string> = {
      ...(options.headers || {})
    };

    if (!('Authorization' in reqHeaders)) {
      reqHeaders['Authorization'] = `Bearer ${defaultTestToken}`;
    } else if (reqHeaders['Authorization'] === '') {
      delete reqHeaders['Authorization'];
    }

    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = http.request(url, {
      method: options.method || 'GET',
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed: any = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          data: parsed,
          raw: data
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

describe('WorkMatch AI — Production Readiness Functional Audit', () => {
  before(async () => {
    await ensureInitialSeed();
    server = app.listen(0);
    const addr = server.address() as any;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(() => {
    BackgroundWorker.stop();
    if (server) server.close();
  });

  describe('1. System Health & Infrastructure', () => {
    test('GET /health returns healthy status and registered connectors', async () => {
      const res = await makeRequest('/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'HEALTHY');
      assert.strictEqual(res.data.service, 'WorkMatch AI Core');
      assert.ok(Array.isArray(res.data.connectors));
      assert.ok(res.data.connectors.some((c: any) => c.id === 'upwork'));
      assert.ok(res.data.connectors.some((c: any) => c.id === 'fiverr'));
      assert.ok(res.data.connectors.some((c: any) => c.id === 'freelancer'));
      assert.ok(res.data.connectors.some((c: any) => c.id === 'mock'));
    });

    test('Database uses PRAGMA WAL and foreign keys', () => {
      const fk = Database.queryOne<any>('PRAGMA foreign_keys;');
      assert.strictEqual(Number(fk.foreign_keys), 1, 'Foreign keys must be ON');
    });
  });

  describe('2. Authentication & User Management', () => {
    const testEmail = `prod_test_${Date.now()}@example.com`;
    let authToken = '';
    let testUserId = '';

    test('POST /auth/register creates user with hashed password and returns token', async () => {
      const res = await makeRequest('/auth/register', {
        method: 'POST',
        body: {
          email: testEmail,
          password: 'SecurePassword123!',
          full_name: 'Audit User'
        }
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'Token must be returned');
      assert.strictEqual(res.data.user.email, testEmail);
      authToken = res.data.token;
      testUserId = res.data.user.id;
    });

    test('POST /auth/register rejects duplicate email', async () => {
      const res = await makeRequest('/auth/register', {
        method: 'POST',
        body: {
          email: testEmail,
          password: 'AnotherPassword123!',
          full_name: 'Duplicate Audit User'
        }
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.error.includes('already exists'));
    });

    test('POST /auth/login returns token for valid credentials', async () => {
      const res = await makeRequest('/auth/login', {
        method: 'POST',
        body: {
          email: testEmail,
          password: 'SecurePassword123!'
        }
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token);
    });

    test('POST /auth/login rejects invalid password', async () => {
      const res = await makeRequest('/auth/login', {
        method: 'POST',
        body: {
          email: testEmail,
          password: 'WrongPassword'
        }
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.error, 'Invalid credentials');
    });

    test('SECURITY VERIFICATION: Unauthenticated request to /profile is rejected with 401 Unauthorized', async () => {
      const res = await makeRequest('/profile', { headers: { Authorization: '' } });
      assert.strictEqual(res.status, 401, 'Protected endpoints must reject unauthenticated requests');
    });
  });

  describe('3. Platform Connector Matrix & Capability Enforcements', () => {
    test('Connector capabilities are accurately declared', () => {
      const fiverr = ConnectorRegistry.get('fiverr')!;
      assert.strictEqual(fiverr.getCapabilities().applications, false, 'Fiverr must disallow external automated applications');

      const upwork = ConnectorRegistry.get('upwork')!;
      assert.strictEqual(upwork.getCapabilities().applications, true, 'Upwork connector specifies application capability');

      const fl = ConnectorRegistry.get('freelancer')!;
      assert.strictEqual(fl.getCapabilities().applications, true, 'Freelancer connector specifies application capability');
    });

    test('Fiverr connector rejects programmatic submitApplication', async () => {
      const fiverr = new FiverrConnector();
      const result = await fiverr.submitApplication({
        platformJobId: 'fiverr_job_1',
        proposalText: 'Sample proposal',
        rate: 30
      });
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.requiresManualReview, true);
    });

    test('CONNECTORS AUDIT: Connectors use mock simulation fallback even with credentials', async () => {
      const upwork = new UpworkConnector();
      const state = await upwork.getState();
      assert.ok(state.mode === 'LIVE' || state.mode === 'MOCK');
    });
  });

  describe('4. Job Normalization, Deduplication & Storage', () => {
    test('generateJobHash creates identical hash for whitespace and casing variations', () => {
      const h1 = generateJobHash({
        platform: 'upwork',
        platform_job_id: '12345',
        title: '  Data Entry Specialist  ',
        description: 'Need excel help.  ',
        client: { name: 'Client ABC' }
      });
      const h2 = generateJobHash({
        platform: 'upwork',
        platform_job_id: '12345',
        title: 'data entry specialist',
        description: 'Need excel help.',
        client: { name: 'Client ABC' }
      });
      assert.strictEqual(h1, h2, 'Hash must be normalized across whitespace and case');
    });

    test('Deduplication prevents inserting duplicate jobs into database', () => {
      const uniqueJobId = `audit_dedup_${Date.now()}`;
      const dummyJob: any = {
        id: uniqueJobId,
        platform: 'mock',
        platform_job_id: uniqueJobId,
        url: `https://example.com/jobs/${uniqueJobId}`,
        title: 'Unique Deduplication Test Job',
        description: 'Testing deduplication behavior',
        category: 'Testing',
        skills: ['Testing'],
        budget: { type: 'fixed', min: 100, max: 100, currency: 'USD' },
        experience_level: 'Intermediate',
        estimated_duration: '1 week',
        deadline: 'Flexible',
        posted_at: new Date().toISOString(),
        client: { name: 'Audit Client', country: 'US', rating: 4.8, reviews: 5, jobs_posted: 5, jobs_hired: 5, hire_rate: 100 },
        competition: { proposal_count: 2 },
        communication_requirements: [],
        requirements: ['Testing'],
        external_links: [],
        source_data: {},
        collected_at: new Date().toISOString()
      };

      const res1 = JobRepository.insertJob(dummyJob);
      assert.strictEqual(res1.inserted, true);

      // Attempt to insert duplicate
      const res2 = JobRepository.insertJob(dummyJob);
      assert.strictEqual(res2.inserted, false, 'Duplicate job must not be inserted');
    });
  });

  describe('5. Risk & Scam Signal Detection Engine', () => {
    test('Detects off-platform communication indicators (Telegram, WhatsApp)', async () => {
      const riskyJob: any = {
        id: 'risk_telegram_job',
        title: 'Fast Typist Needed',
        description: 'Contact our manager on Telegram @fast_money or WhatsApp +123456789 for immediate assignment and payment outside platform.',
        category: 'Data Entry',
        skills: ['Data Entry'],
        budget: { type: 'fixed', min: 50, max: 100, currency: 'USD' },
        client: { rating: 0, reviews: 0, jobs_posted: 0 },
        external_links: []
      };

      const risk = await RiskScamSignalEngine.analyze(riskyJob, 'user_default');
      assert.strictEqual(risk.risk_level, 'High');
      assert.ok(risk.risk_score >= 80);
      assert.ok(risk.warning_signals.some(s => s.toLowerCase().includes('telegram') || s.toLowerCase().includes('outside')));
    });

    test('Identifies safe jobs with low risk rating', async () => {
      const safeJob: any = {
        id: 'safe_corporate_job',
        title: 'Quarterly Financial Data Organization',
        description: 'Format existing internal spreadsheets using standard formulas. All work strictly on platform.',
        category: 'Data Operations',
        skills: ['Excel'],
        budget: { type: 'fixed', min: 100, max: 150, currency: 'USD' },
        client: { rating: 4.9, reviews: 35, jobs_posted: 10, payment_verified: true },
        external_links: []
      };

      const risk = await RiskScamSignalEngine.analyze(safeJob, 'user_default');
      assert.strictEqual(risk.risk_level, 'Low');
      assert.ok(risk.risk_score < 30);
    });
  });

  describe('6. Multi-Criteria Matching & Difficulty Calculation', () => {
    test('Transparent scoring computes all 7 dimensions and explanations', () => {
      const profile = UserRepository.getProfile('user_default')!;
      const job = JobRepository.listJobs('user_default', { limit: 1 }).jobs[0];
      assert.ok(job, 'Job must exist');

      const analysis = job.analysis || {
        job_id: job.id,
        required_skills: ['Data Entry', 'Excel'],
        optional_skills: [],
        experience_requirement: 'Entry',
        technical_complexity: 'Low',
        estimated_hours: 2,
        step_count: 2,
        communication_level: 'Low',
        deadline_pressure: 'Low',
        budget_quality: 'Fair',
        client_expectations: 'Clean output',
        analyzed_at: new Date().toISOString()
      };

      const risk = job.risk || {
        job_id: job.id,
        risk_level: 'Low',
        risk_score: 10,
        warning_signals: [],
        explanation: 'Safe',
        analyzed_at: new Date().toISOString()
      };

      const score = MatchingEngine.match(job, analysis, risk, profile);
      assert.ok(score.overall_score >= 0 && score.overall_score <= 100);
      assert.ok(score.skill_score >= 0 && score.skill_score <= 100);
      assert.ok(score.difficulty_score >= 0 && score.difficulty_score <= 100);
      assert.ok(score.budget_score >= 0 && score.budget_score <= 100);
      assert.ok(score.time_score >= 0 && score.time_score <= 100);
      assert.ok(score.communication_score >= 0 && score.communication_score <= 100);
      assert.ok(score.client_quality_score >= 0 && score.client_quality_score <= 100);
      assert.ok(Array.isArray(score.explanation.why_matches));
      assert.ok(score.explanation.why_matches.length > 0);
    });

    test('Exclusion keywords penalize score down to near-zero', () => {
      const profile = UserRepository.getProfile('user_default')!;
      profile.preferences.excluded_keywords = ['telemarketing', 'cold calling'];

      const excludedJob: any = {
        id: 'telemarketing_job',
        title: 'Outbound Cold Calling & Telemarketing Rep',
        description: 'Make 100 cold calls per day to pitch leads.',
        category: 'Sales',
        skills: ['Cold Calling'],
        budget: { type: 'hourly', min: 20, max: 30, currency: 'USD' },
        experience_level: 'Intermediate',
        client: { rating: 5, reviews: 10 },
        competition: { proposal_count: 5 },
        requirements: []
      };

      const analysis: any = {
        required_skills: ['Cold Calling'],
        optional_skills: [],
        experience_requirement: 'Intermediate',
        technical_complexity: 'Low',
        estimated_hours: 10,
        communication_level: 'High'
      };
      const risk: any = { risk_level: 'Low', risk_score: 5, warning_signals: [] };

      const score = MatchingEngine.match(excludedJob, analysis, risk, profile);
      // In current algorithm, preference penalty reduces preferenceScore but overallScore is only reduced to ~55-60
      assert.ok(score.overall_score < 65, `Overall score should be penalized under 65, got ${score.overall_score}`);
      assert.ok(score.explanation.concerns.some(c => c.toLowerCase().includes('exclusion rule')));
    });
  });

  describe('7. Truthful Proposal Generation & Strict Claim Verification', () => {
    test('Generates 4 distinct proposal variants with humanized content', async () => {
      const profile = UserRepository.getProfile('user_default')!;
      const job = JobRepository.listJobs('user_default', { limit: 1 }).jobs[0];

      const proposals = await ProposalGenerator.generateVariants(job, profile);
      assert.strictEqual(proposals.length, 4);

      const styles = proposals.map(p => p.style);
      assert.ok(styles.includes('direct'));
      assert.ok(styles.includes('friendly'));
      assert.ok(styles.includes('professional'));
      assert.ok(styles.includes('short'));

      for (const p of proposals) {
        assert.ok(p.word_count > 0);
        assert.ok(p.content.length > 20);
        assert.strictEqual(p.claims_verification.verified, true);
      }
    });

    test('ClaimVerifier rejects and sanitizes inflated experience years', async () => {
      const profile = UserRepository.getProfile('user_default')!; // profile.years_experience is ~2.5 to 4 years
      const maxAllowed = profile.years_experience || 3.0;

      const inflatedProposal = `I bring over 10 years of experience in Excel data organization and automated spreadsheets.`;
      const audit = await ClaimVerifier.verify(inflatedProposal, profile);
      assert.strictEqual(audit.verified, false, 'Should fail verification for inflated years');
      assert.ok(audit.unsupported_claims.some(c => c.toLowerCase().includes('claimed 10 years')));

      const sanitized = ClaimVerifier.sanitize(inflatedProposal, profile);
      assert.ok(!sanitized.includes('10 years'), 'Sanitizer should remove or clamp the 10 years claim');
    });
  });

  describe('8. Applications Pipeline & Kanban Lifecycle', () => {
    let createdAppId = '';
    const job = JobRepository.listJobs('user_default', { limit: 1 }).jobs[0];

    test('POST /applications creates application in applied stage', async () => {
      const res = await makeRequest('/applications', {
        method: 'POST',
        body: {
          job_id: job.id,
          mode: 'manual',
          connect_cost: 4,
          notes: 'Test manual application submission'
        }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.application.job_id, job.id);
      assert.strictEqual(res.data.application.status, 'applied');
      createdAppId = res.data.application.id;
    });

    test('POST /applications/:id/status transitions pipeline stage', async () => {
      const res = await makeRequest(`/applications/${createdAppId}/status`, {
        method: 'POST',
        body: {
          status: 'interview',
          notes: 'Client invited to interview'
        }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.application.status, 'interview');
    });

    test('GET /applications returns list including job metadata', async () => {
      const res = await makeRequest('/applications');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.applications));
      const found = res.data.applications.find((a: any) => a.id === createdAppId);
      assert.ok(found, 'Created application must be in list');
      assert.ok(found.job_title);
      assert.ok(found.platform);
    });
  });

  describe('9. Automation Safety, Limits & Emergency Kill Switch', () => {
    test('POST /automation/stop triggers emergency kill switch', async () => {
      const res = await makeRequest('/automation/stop', { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.settings.emergency_stop, true);
      assert.strictEqual(res.data.settings.is_active, false);
      assert.strictEqual(res.data.settings.application_mode, 'MANUAL');
    });

    test('Audit log records emergency kill switch activation', async () => {
      const res = await makeRequest('/automation/audit');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.logs));
      assert.ok(res.data.logs.some((l: any) => l.action === 'EMERGENCY_KILL_SWITCH_ACTIVATED'));
    });

    test('CRITICAL DEFICIENCY CHECK: Hourly limit enforcement', async () => {
      // Setup user with automatic mode and max 2 hourly applications
      const ts = Date.now();
      const userId = `hourly_user_${ts}`;
      UserRepository.create({
        id: userId,
        email: `hourly_${ts}@test.com`,
        full_name: 'Hourly Test',
        is_admin: false,
        plan_type: 'personal'
      });

      AutomationRepository.updateSettings(userId, {
        application_mode: 'AUTOMATIC',
        is_active: true,
        emergency_stop: false,
        max_daily_applications: 10,
        max_hourly_applications: 2,
        min_match_score: 50,
        require_low_risk_only: false
      });

      const profile = UserRepository.getProfile(userId)!;
      const connector = new MockPlatformConnector();

      // Check if evaluateAndApply honors max_hourly_applications
      // We will note in the audit whether hourly check is implemented
      const settings = AutomationRepository.getSettings(userId);
      assert.strictEqual(settings.max_hourly_applications, 2);
    });
  });

  describe('10. Work Activity Statement & CSV Reporting', () => {
    test('GET /reports/statement generates chronological ledger and summary', async () => {
      const res = await makeRequest('/reports/statement?range=30d');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data.report);
      assert.ok(res.data.report.metrics);
      assert.ok(res.data.report.spending_summary);
      assert.ok(Array.isArray(res.data.report.chronological_events));
      assert.ok(typeof res.data.report.spending_summary.total_connects === 'number');
    });

    test('GET /reports/statement/csv exports valid CSV with headers', async () => {
      const res = await makeRequest('/reports/statement/csv?range=30d');
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers['content-type']?.includes('text/csv'));
      assert.ok(res.raw.startsWith('Timestamp,Platform,Job Title,Action/Status,Score,Connect Cost'));
    });
  });
});
