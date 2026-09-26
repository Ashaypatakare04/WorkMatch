import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { Database } from '../database/connection.js';
import { AIGateway } from '../ai/gateway/AIGateway.js';
import { GeminiProvider } from '../ai/providers/GeminiProvider.js';
import { OpenAIProvider } from '../ai/providers/OpenAIProvider.js';
import { MockAIProvider } from '../ai/providers/MockAIProvider.js';
import { NotificationService } from '../notifications/NotificationService.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { generateToken } from '../api/middleware/auth.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';

let server: http.Server;
let baseUrl: string;
const testUserId = 'user_phase2_test';
const testToken = generateToken({
  userId: testUserId,
  email: 'phase2@workmatch.local',
  isAdmin: true,
  planType: 'pro'
});

function makeRequest(path: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = options.body ? JSON.stringify(options.body) : undefined;
    const reqHeaders: Record<string, string> = {
      Authorization: `Bearer ${testToken}`,
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
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

describe('Phase 2: Live AI Model & Multi-Channel Notification Integration', () => {
  before(() => {
    // Seed test user
    const existing = UserRepository.findById(testUserId);
    if (!existing) {
      UserRepository.create({
        id: testUserId,
        email: 'phase2@workmatch.local',
        password_hash: 'mock_hash_for_test',
        full_name: 'Phase 2 Tester',
        is_admin: true,
        plan_type: 'pro'
      });
    }

    server = app.listen(0);
    const addr = server.address() as any;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(() => {
    if (server) server.close();
    AIGateway.setProvider(new MockAIProvider());
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Google Gemini Provider Tests
  // ─────────────────────────────────────────────────────────────
  describe('1. Google Gemini Provider', () => {
    test('Throws error when API key is missing', async () => {
      const provider = new GeminiProvider('   ');
      await assert.rejects(
        async () => {
          await provider.generateText('Hello Gemini');
        },
        /Missing GEMINI_API_KEY/
      );
    });

    test('Handles mock HTTP responses and cleans code fences in structured output', async () => {
      // Create local mock server imitating Gemini REST API
      const mockGeminiServer = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '```json\n{"summary": "Live Gemini analysis successful", "confidence": 0.96}\n```'
                  }
                ]
              }
            }
          ],
          usageMetadata: {
            promptTokenCount: 42,
            candidatesTokenCount: 18
          }
        }));
      });

      await new Promise<void>((resolve) => mockGeminiServer.listen(0, resolve));
      const geminiPort = (mockGeminiServer.address() as any).port;

      try {
        const provider = new GeminiProvider('test-key', 'gemini-1.5-flash');
        // Override internal baseUrl to point to mock server
        (provider as any).baseUrl = `http://127.0.0.1:${geminiPort}`;

        const result = await provider.generateStructured<{ summary: string; confidence: number }>(
          'Analyze this job',
          'TestSchema'
        );

        assert.strictEqual(result.provider, 'google-gemini');
        assert.strictEqual(result.model, 'gemini-1.5-flash');
        assert.strictEqual(result.data.summary, 'Live Gemini analysis successful');
        assert.strictEqual(result.data.confidence, 0.96);
        assert.strictEqual(result.tokensIn, 42);
        assert.strictEqual(result.tokensOut, 18);
      } finally {
        mockGeminiServer.close();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. OpenAI Provider Tests
  // ─────────────────────────────────────────────────────────────
  describe('2. OpenAI Provider', () => {
    test('Throws error when API key is missing', async () => {
      const provider = new OpenAIProvider('');
      await assert.rejects(
        async () => {
          await provider.generateText('Hello GPT');
        },
        /Missing OPENAI_API_KEY/
      );
    });

    test('Handles mock HTTP responses and formats chat completions', async () => {
      const mockOpenAIServer = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          choices: [
            {
              message: {
                content: '{"proposal_angle": "direct", "fit_score": 92}'
              }
            }
          ],
          usage: {
            prompt_tokens: 35,
            completion_tokens: 15
          }
        }));
      });

      await new Promise<void>((resolve) => mockOpenAIServer.listen(0, resolve));
      const openAIPort = (mockOpenAIServer.address() as any).port;

      try {
        const provider = new OpenAIProvider('test-openai-key', 'gpt-4o-mini', `http://127.0.0.1:${openAIPort}`);
        const result = await provider.generateStructured<{ proposal_angle: string; fit_score: number }>(
          'Generate proposal',
          'ProposalAngleSchema'
        );

        assert.strictEqual(result.provider, 'openai');
        assert.strictEqual(result.model, 'gpt-4o-mini');
        assert.strictEqual(result.data.proposal_angle, 'direct');
        assert.strictEqual(result.data.fit_score, 92);
      } finally {
        mockOpenAIServer.close();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. AIGateway Dynamic Routing & Resilient Fallback
  // ─────────────────────────────────────────────────────────────
  describe('3. AIGateway Resilience & Usage Logging', () => {
    test('Resilient fallback to MockAIProvider when live provider fails', async () => {
      // Provider configured with invalid endpoint to trigger failure
      const brokenProvider = new GeminiProvider('invalid-key', 'gemini-1.5-flash');
      (brokenProvider as any).baseUrl = 'http://127.0.0.1:1'; // Unreachable port
      AIGateway.setProvider(brokenProvider);

      // Execute prompt - must NOT throw, should fall back to MockAIProvider
      const result = await AIGateway.executePrompt<{ proposals?: any[] }>({
        userId: testUserId,
        endpoint: '/ai/test-fallback',
        promptName: 'FALLBACK_TEST',
        promptVersion: '1.0',
        renderedPrompt: 'GENERATE_PROPOSALS for user',
        isStructured: true,
        schemaDescription: 'ProposalSchema'
      });

      assert.ok(result.data);
      assert.strictEqual(result.provider, 'mock-engine');

      // Verify usage log was written to database
      const log = Database.queryOne<any>(
        'SELECT * FROM ai_usage_logs WHERE user_id = ? AND prompt_name = ? ORDER BY created_at DESC LIMIT 1',
        [testUserId, 'FALLBACK_TEST']
      );
      assert.ok(log, 'Usage log must be written to SQLite');
      assert.strictEqual(log.prompt_name, 'FALLBACK_TEST');
    });

    test('Reports active provider configuration status', () => {
      AIGateway.setProvider(new MockAIProvider());
      const info = AIGateway.getActiveProviderInfo();
      assert.strictEqual(info.name, 'MockAIProvider');
      assert.strictEqual(info.isLive, false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Quiet Hours & Notification Thresholds
  // ─────────────────────────────────────────────────────────────
  describe('4. Quiet Hours & Notification Filtering', () => {
    test('isWithinQuietHours accurately evaluates across midnight', () => {
      // Midnight spanning: 22:00 to 08:00
      const nightDate = new Date('2026-09-26T23:30:00');
      const earlyMorning = new Date('2026-09-26T04:15:00');
      const noon = new Date('2026-09-26T12:00:00');
      const evening = new Date('2026-09-26T20:00:00');

      assert.strictEqual(NotificationService.isWithinQuietHours('22:00', '08:00', nightDate), true);
      assert.strictEqual(NotificationService.isWithinQuietHours('22:00', '08:00', earlyMorning), true);
      assert.strictEqual(NotificationService.isWithinQuietHours('22:00', '08:00', noon), false);
      assert.strictEqual(NotificationService.isWithinQuietHours('22:00', '08:00', evening), false);
    });

    test('isWithinQuietHours evaluates standard daytime range', () => {
      // Daytime: 09:00 to 17:00
      const morning = new Date('2026-09-26T10:00:00');
      const night = new Date('2026-09-26T21:00:00');

      assert.strictEqual(NotificationService.isWithinQuietHours('09:00', '17:00', morning), true);
      assert.strictEqual(NotificationService.isWithinQuietHours('09:00', '17:00', night), false);
    });

    test('dispatchJobAlert saves browser notification and respects minimum score threshold', async () => {
      // Set preferences
      NotificationRepository.updatePreferences(testUserId, {
        browser_enabled: true,
        email_enabled: false,
        min_score_threshold: 85,
        alert_high_risk: false
      });

      const lowScoreJob: NormalizedJob = {
        id: `job_low_${Date.now()}`,
        platform: 'upwork',
        platform_job_id: 'up_low',
        title: 'Low Match Job',
        description: 'Basic task',
        budget: { type: 'hourly', min: 15, max: 20 },
        client: { name: 'Client A', rating: 4.5, payment_verified: true, country: 'US', jobs_posted: 5 },
        skills: ['General'],
        published_at: new Date().toISOString(),
        url: 'https://upwork.com'
      };

      const lowScore: JobScore = {
        job_id: lowScoreJob.id,
        user_id: testUserId,
        overall_score: 60, // Below 85 threshold
        skill_score: 50,
        experience_score: 50,
        budget_score: 50,
        client_score: 50,
        difficulty_score: 50,
        preference_score: 50,
        velocity_score: 50,
        explanation: { why_matches: [], potential_concerns: [], tip: '' },
        calculated_at: new Date().toISOString()
      };

      const lowRisk: JobRisk = {
        job_id: lowScoreJob.id,
        risk_score: 10,
        risk_level: 'Low',
        warning_signals: [],
        red_flags: [],
        recommendation: 'Safe to apply'
      };

      // Dispatch alert - should be ignored due to score < 85
      const countBefore = NotificationRepository.listByUser(testUserId).length;
      await NotificationService.dispatchJobAlert({
        userId: testUserId,
        job: lowScoreJob,
        score: lowScore,
        risk: lowRisk
      });
      const countAfter = NotificationRepository.listByUser(testUserId).length;
      assert.strictEqual(countAfter, countBefore, 'Low match job must not generate alert');

      // Now dispatch high match job (score = 92)
      lowScore.overall_score = 92;
      lowScore.explanation.why_matches = ['Direct skill match in TypeScript'];
      await NotificationService.dispatchJobAlert({
        userId: testUserId,
        job: lowScoreJob,
        score: lowScore,
        risk: lowRisk
      });
      const countFinal = NotificationRepository.listByUser(testUserId).length;
      assert.strictEqual(countFinal, countBefore + 1, 'High match job must generate alert');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Multi-Channel Notification Dispatchers & Test API
  // ─────────────────────────────────────────────────────────────
  describe('5. Notification Channels & Dispatcher API', () => {
    test('POST /notifications/test triggers browser test alert', async () => {
      const res = await makeRequest('/notifications/test', {
        method: 'POST',
        body: { channel: 'browser' }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.delivered, true);
    });

    test('POST /notifications/test triggers email test alert', async () => {
      const res = await makeRequest('/notifications/test', {
        method: 'POST',
        body: { channel: 'email' }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.delivered, true);
    });

    test('POST /notifications/test triggers telegram test alert', async () => {
      const res = await makeRequest('/notifications/test', {
        method: 'POST',
        body: { channel: 'telegram' }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.delivered, true);
    });

    test('POST /notifications/test triggers discord test alert', async () => {
      const res = await makeRequest('/notifications/test', {
        method: 'POST',
        body: { channel: 'discord' }
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.delivered, true);
    });

    test('POST /notifications/test rejects invalid channel', async () => {
      const res = await makeRequest('/notifications/test', {
        method: 'POST',
        body: { channel: 'sms' }
      });

      assert.strictEqual(res.status, 400);
      assert.ok(res.data.error.includes('Valid channel required'));
    });

    test('GET /notifications/channels returns active channels status', async () => {
      const res = await makeRequest('/notifications/channels');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.channels.browser);
      assert.ok(res.data.channels.email);
      assert.ok(res.data.channels.telegram);
      assert.ok(res.data.channels.discord);
      assert.strictEqual(res.data.channels.browser.available, true);
    });
  });
});
