import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { Database } from '../database/connection.js';
import { runMigrations } from '../database/migrate.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { SubscriptionService, PLAN_CONFIGS } from '../services/SubscriptionService.js';
import { AutomationController } from '../automation/AutomationController.js';
import { AutomationRepository } from '../repositories/AutomationRepository.js';
import { UpworkConnector } from '../connectors/upwork/UpworkConnector.js';
import { MockPlatformConnector } from '../connectors/mock/MockPlatformConnector.js';
import { generateToken } from '../api/middleware/auth.js';

let server: http.Server;
let baseUrl: string;

function makeRequest(path: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any; rawText: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = options.body ? JSON.stringify(options.body) : undefined;
    const reqHeaders: Record<string, string> = {
      ...(options.headers || {})
    };

    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = http.request(url, {
      method: options.method || 'GET',
      headers: reqHeaders
    }, (res) => {
      let rawText = '';
      res.on('data', chunk => rawText += chunk);
      res.on('end', () => {
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = rawText;
        }
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          data: parsed,
          rawText
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

describe('Phase 3: SaaS Monetization, Quota Enforcement & Streaming Proposals', () => {
  const testUserId = `tier_user_${Date.now()}`;
  let userToken: string;

  before(() => {
    return new Promise<void>((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const addr = server.address();
        const port = typeof addr === 'object' && addr ? addr.port : 4000;
        baseUrl = `http://localhost:${port}/api/`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(() => {
    runMigrations();

    // Create test user on personal (free) tier
    let user = UserRepository.findById(testUserId);
    if (!user) {
      user = UserRepository.create({
        id: testUserId,
        email: `tier_${Date.now()}@workmatch.local`,
        full_name: 'Tier Test User',
        is_admin: false,
        plan_type: 'personal'
      });
    } else {
      Database.execute('UPDATE users SET plan_type = ? WHERE id = ?', ['personal', testUserId]);
    }

    userToken = generateToken({
      userId: testUserId,
      email: user.email,
      isAdmin: false,
      planType: 'personal'
    });

    // Seed capability profile
    UserRepository.setSkills(testUserId, [
      { skill_name: 'Python', category: 'Backend', proficiency_level: 'Expert', years_experience: 4.0, verified: true },
      { skill_name: 'React', category: 'Frontend', proficiency_level: 'Advanced', years_experience: 3.0, verified: true }
    ]);

    // Seed a test job
    JobRepository.insertJob({
      id: 'tier_test_job_1',
      platform: 'upwork',
      platform_job_id: 'up_tier_1',
      url: 'https://upwork.com/jobs/tier1',
      title: 'Full Stack React & Python Engineer',
      description: 'Build modern SaaS web application with clean architecture.',
      category: 'Software & Web',
      skills: ['Python', 'React'],
      budget: { type: 'fixed', min: 1000, max: 2000, currency: 'USD' },
      experience_level: 'Intermediate',
      estimated_duration: '1 month',
      deadline: 'Flexible',
      posted_at: new Date().toISOString(),
      client: { name: 'Acme SaaS', country: 'US', rating: 5.0, reviews: 20, jobs_posted: 15, jobs_hired: 12, hire_rate: 80 },
      competition: { proposal_count: 5 },
      communication_requirements: ['English'],
      requirements: ['Python', 'React'],
      external_links: [],
      source_data: { connects_required: 4 },
      collected_at: new Date().toISOString()
    });
  });

  test('1. SubscriptionService correctly exports plans with tiered proposal quotas', () => {
    assert.strictEqual(PLAN_CONFIGS.personal.monthlyProposalsLimit, 10);
    assert.strictEqual(PLAN_CONFIGS.pro.monthlyProposalsLimit, 150);
    assert.strictEqual(PLAN_CONFIGS.team.monthlyProposalsLimit, 1000);

    const plans = SubscriptionService.getAllPlans();
    assert.strictEqual(plans.length, 3);
    assert.strictEqual(plans[0].planType, 'personal');
    assert.strictEqual(plans[1].planType, 'pro');
    assert.strictEqual(plans[2].planType, 'team');
  });

  test('2. GET /billing/plans returns public plan pricing and limits', async () => {
    const res = await makeRequest('billing/plans');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.plans));
    assert.strictEqual(res.data.plans.length, 3);
  });

  test('3. GET /billing/usage returns current monthly quota usage for user', async () => {
    const res = await makeRequest('billing/usage', {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.usage.plan.planType, 'personal');
    assert.strictEqual(res.data.usage.proposalsLimit, 10);
    assert.strictEqual(res.data.usage.canGenerateProposal, true);
  });

  test('4. POST /jobs/:id/proposal strictly enforces monthly quota when personal limit (10) is exhausted', async () => {
    // Fill up the user's monthly proposals table to reach the personal limit of 10
    const now = new Date().toISOString();
    for (let i = 0; i < 10; i++) {
      ApplicationRepository.saveProposal({
        id: `prop_quota_fill_${i}_${Date.now()}`,
        job_id: 'tier_test_job_1',
        user_id: testUserId,
        version_number: 1,
        style: 'direct',
        title: `Test Proposal ${i}`,
        content: 'I can deliver this project cleanly.',
        word_count: 7,
        claims_verification: { verified: true, skills_used: ['Python'], unsupported_claims: [], notes: '' },
        addressed_requirements: ['Python'],
        why_written: 'Quota test',
        created_at: now
      });
    }

    // Verify usage calculation
    const usage = SubscriptionService.getUserUsage(testUserId);
    assert.strictEqual(usage.proposalsUsedThisMonth >= 10, true);
    assert.strictEqual(usage.canGenerateProposal, false);

    // Attempt proposal generation - must be rejected with 403 QUOTA_EXCEEDED
    const res = await makeRequest('jobs/tier_test_job_1/proposal', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` }
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.error, 'QUOTA_EXCEEDED');
    assert.ok(res.data.message.includes('quota'));
  });

  test('5. POST /billing/upgrade upgrades user to Pro and expands quota to 150', async () => {
    const upgradeRes = await makeRequest('billing/upgrade', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { planType: 'pro', provider: 'stripe' }
    });

    assert.strictEqual(upgradeRes.status, 200);
    assert.strictEqual(upgradeRes.data.success, true);
    assert.strictEqual(upgradeRes.data.usage.plan.planType, 'pro');
    assert.strictEqual(upgradeRes.data.usage.proposalsLimit, 150);
    assert.strictEqual(upgradeRes.data.usage.canGenerateProposal, true);

    // Verify database record
    const user = UserRepository.findById(testUserId);
    assert.strictEqual(user?.plan_type, 'pro');

    // Generating proposals is now permitted because limit is 150
    const genRes = await makeRequest('jobs/tier_test_job_1/proposal', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` }
    });

    assert.strictEqual(genRes.status, 200);
    assert.strictEqual(genRes.data.success, true);
    assert.ok(genRes.data.proposals.length > 0);
  });

  test('6. POST /billing/webhook processes Stripe checkout.session.completed', async () => {
    const webhookRes = await makeRequest('billing/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test_123' },
      body: {
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: testUserId,
            subscription: 'sub_stripe_prod_999',
            customer: 'cus_stripe_prod_999',
            metadata: {
              userId: testUserId,
              planType: 'team'
            }
          }
        }
      }
    });

    assert.strictEqual(webhookRes.status, 200);
    assert.strictEqual(webhookRes.data.processed, true);

    const user = UserRepository.findById(testUserId);
    assert.strictEqual(user?.plan_type, 'team');
  });

  test('7. POST /billing/webhook processes Stripe customer.subscription.deleted', async () => {
    const testCustomerId = `cus_del_${Date.now()}`;
    const testSubId = `sub_del_${Date.now()}`;

    // First attach a subscription to the customer
    SubscriptionService.recordSubscription({
      userId: testUserId,
      provider: 'stripe',
      subscriptionId: testSubId,
      customerId: testCustomerId,
      planType: 'pro',
      status: 'active'
    });

    assert.strictEqual(UserRepository.findById(testUserId)?.plan_type, 'pro');

    // Send cancellation webhook
    const cancelRes = await makeRequest('billing/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test_123' },
      body: {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            customer: testCustomerId,
            id: testSubId
          }
        }
      }
    });

    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.data.processed, true);

    // Reverted to personal free tier
    const user = UserRepository.findById(testUserId);
    assert.strictEqual(user?.plan_type, 'personal');
  });

  test('8. GET /jobs/:id/proposal/stream returns Server-Sent Events stream with verified proposals', async () => {
    // Ensure user has quota
    Database.execute('UPDATE users SET plan_type = ? WHERE id = ?', ['pro', testUserId]);

    const res = await makeRequest('jobs/tier_test_job_1/proposal/stream', {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    assert.strictEqual(res.status, 200);
    const contentType = String(res.headers['content-type']);
    assert.ok(contentType.includes('text/event-stream'), 'Must return text/event-stream content type');
    assert.ok(res.rawText.includes('event: status'), 'Must emit status events');
    assert.ok(res.rawText.includes('event: variant'), 'Must emit variant events');
    assert.ok(res.rawText.includes('event: complete'), 'Must emit complete event');
  });

  test('9. UpworkConnector utilizes in-memory RSS feed cache with TTL to avoid rate-limiting', async () => {
    const connector = new UpworkConnector();
    assert.strictEqual(connector.platformId, 'upwork');

    const state = await connector.getState();
    assert.ok(state.status === 'CONNECTED');

    // First fetch
    const jobs1 = await connector.getJobs({ limit: 5 });
    assert.ok(Array.isArray(jobs1));

    // Rapid second fetch should utilize cache
    const jobs2 = await connector.getJobs({ limit: 5 });
    assert.strictEqual(jobs1.length, jobs2.length);
  });

  test('10. AutomationController Assisted Copilot creates proposal_generated application without direct submission', async () => {
    AutomationRepository.updateSettings(testUserId, {
      application_mode: 'ASSISTED',
      is_active: true,
      emergency_stop: false,
      min_match_score: 50,
      require_low_risk_only: false
    });

    const job = JobRepository.findById('tier_test_job_1')!;
    const profile = UserRepository.getProfile(testUserId)!;
    const connector = new MockPlatformConnector();

    const result = await AutomationController.evaluateAndApply({
      userId: testUserId,
      job,
      score: {
        job_id: job.id,
        user_id: testUserId,
        overall_score: 90,
        skill_score: 95,
        experience_score: 90,
        difficulty_score: 85,
        budget_score: 85,
        time_score: 90,
        communication_score: 95,
        preference_score: 95,
        client_quality_score: 95,
        matched_skills: ['Python', 'React'],
        missing_skills: [],
        explanation: { why_matches: ['Great match'], why_not_matches: [], concerns: [], estimated_effort: '10h', potential_value: '$1500' },
        scored_at: new Date().toISOString()
      },
      risk: {
        job_id: job.id,
        risk_level: 'Low',
        risk_score: 5,
        warning_signals: [],
        explanation: 'Safe client',
        analyzed_at: new Date().toISOString()
      },
      profile,
      connector
    });

    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.applied, false);
    assert.strictEqual(result.copilotReady, true);
    assert.ok(result.applicationId);

    // Verify application in database is in proposal_generated stage
    const appRecord = ApplicationRepository.getById(result.applicationId!);
    assert.strictEqual(appRecord?.status, 'proposal_generated');
    assert.strictEqual(appRecord?.mode, 'assisted');
  });
});
