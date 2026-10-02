import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { Database } from '../database/connection.js';
import { PG_SCHEMA_SQL } from '../database/pgSchema.js';
import { generateToken } from '../api/middleware/auth.js';

let server: http.Server;
let baseUrl: string;

function makeRequest(path: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any }> {
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
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

describe('Phase 1: Foundation, Persistence & Security Controls', () => {
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
      if (server) server.close(() => resolve());
      else resolve();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Zod Validation & Password Security
  // ─────────────────────────────────────────────────────────────
  describe('1. Zod Input Validation & Password Security', () => {
    test('rejects registration with short password (< 8 chars)', async () => {
      const res = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email: 'test_weak_pwd@example.com',
          password: 'short',
          full_name: 'Short Pwd User'
        }
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
      assert.ok(res.data.details.some((d: any) => d.field === 'password'));
    });

    test('rejects registration with password missing numbers or symbols', async () => {
      const res = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email: 'test_alpha_pwd@example.com',
          password: 'onlyletterslongpassword',
          full_name: 'Alpha User'
        }
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
      assert.ok(res.data.details.some((d: any) => d.field === 'password'));
    });

    test('rejects registration with malformed email', async () => {
      const res = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email: 'not-an-email',
          password: 'ValidPassword123!',
          full_name: 'Valid Name'
        }
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
      assert.ok(res.data.details.some((d: any) => d.field === 'email'));
    });

    test('registers successfully with strong password and sets HttpOnly cookie', async () => {
      const email = `phase1_user_${Date.now()}@example.com`;
      const res = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email,
          password: 'StrongPassword2026!',
          full_name: 'Phase1 Test User'
        }
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'Token must be present in body');

      const setCookie = res.headers['set-cookie'];
      assert.ok(setCookie && setCookie.length > 0, 'Set-Cookie header must be sent');
      const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
      assert.ok(cookieStr.includes('workmatch_token='), 'Cookie must contain workmatch_token');
      assert.ok(cookieStr.toLowerCase().includes('httponly'), 'Cookie must be HttpOnly');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. HttpOnly Cookie & Session Authentication
  // ─────────────────────────────────────────────────────────────
  describe('2. HttpOnly Cookie Authentication', () => {
    test('authenticates protected /auth/me via session cookie without Bearer header', async () => {
      const email = `cookie_user_${Date.now()}@example.com`;
      const reg = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email,
          password: 'CookiePassword2026!',
          full_name: 'Cookie User'
        }
      });
      assert.strictEqual(reg.status, 200);
      const token = reg.data.token;

      // Make request with Cookie header instead of Authorization header
      const meRes = await makeRequest('auth/me', {
        headers: {
          Cookie: `workmatch_token=${token}`
        }
      });
      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meRes.data.success, true);
      assert.strictEqual(meRes.data.user.email, email);
    });

    test('/auth/logout clears the session cookie', async () => {
      const res = await makeRequest('auth/logout', { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      const setCookie = res.headers['set-cookie'];
      assert.ok(setCookie && setCookie.length > 0, 'Set-Cookie must be returned on logout');
      const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
      assert.ok(cookieStr.includes('Expires=Thu, 01 Jan 1970'));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Password Reset & Recovery Lifecycle
  // ─────────────────────────────────────────────────────────────
  describe('3. Password Reset & Recovery Lifecycle', () => {
    const recoveryEmail = `recovery_${Date.now()}@example.com`;
    const oldPassword = 'OldPassword123!';
    const newPassword = 'NewSecretPassword456!';

    test('generates password reset token and completes password reset', async () => {
      // 1. Create user
      const reg = await makeRequest('auth/register', {
        method: 'POST',
        body: {
          email: recoveryEmail,
          password: oldPassword,
          full_name: 'Recovery Test User'
        }
      });
      assert.strictEqual(reg.status, 200);

      // 2. Request forgot password
      const forgotRes = await makeRequest('auth/forgot-password', {
        method: 'POST',
        body: { email: recoveryEmail }
      });
      assert.strictEqual(forgotRes.status, 200);
      assert.strictEqual(forgotRes.data.success, true);
      const resetToken = forgotRes.data.debugToken;
      assert.ok(resetToken, 'Debug token should be available in non-prod mode');

      // 3. Reset password using valid token
      const resetRes = await makeRequest('auth/reset-password', {
        method: 'POST',
        body: {
          token: resetToken,
          new_password: newPassword
        }
      });
      assert.strictEqual(resetRes.status, 200);
      assert.strictEqual(resetRes.data.success, true);

      // 4. Old password should now fail
      const oldLogin = await makeRequest('auth/login', {
        method: 'POST',
        body: { email: recoveryEmail, password: oldPassword }
      });
      assert.strictEqual(oldLogin.status, 401);

      // 5. New password should now succeed
      const newLogin = await makeRequest('auth/login', {
        method: 'POST',
        body: { email: recoveryEmail, password: newPassword }
      });
      assert.strictEqual(newLogin.status, 200);
      assert.strictEqual(newLogin.data.success, true);

      // 6. Token reuse should be rejected
      const reuseRes = await makeRequest('auth/reset-password', {
        method: 'POST',
        body: {
          token: resetToken,
          new_password: 'YetAnotherPassword789!'
        }
      });
      assert.strictEqual(reuseRes.status, 400);
      assert.ok(reuseRes.data.error.includes('Invalid, expired, or already used'));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. API Schema Validation on Applications & Automation
  // ─────────────────────────────────────────────────────────────
  describe('4. Zod Schema Validation on Core Endpoints', () => {
    test('POST /applications rejects missing job_id or invalid mode', async () => {
      const token = generateToken({
        userId: 'user_default',
        email: 'user@workmatch.local',
        isAdmin: true,
        planType: 'personal'
      });

      const res = await makeRequest('applications', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          // Missing job_id
          mode: 'unsupported_mode'
        }
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
    });

    test('PUT /automation rejects invalid min_match_score (>100)', async () => {
      const token = generateToken({
        userId: 'user_default',
        email: 'user@workmatch.local',
        isAdmin: true,
        planType: 'personal'
      });

      const res = await makeRequest('automation', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          min_match_score: 150 // Invalid: max 100
        }
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Database Health & Asynchronous Engine Capabilities
  // ─────────────────────────────────────────────────────────────
  describe('5. Database Health & Multi-Engine Async Pipeline', () => {
    test('Database.isHealthy returns HEALTHY and reports active engine', async () => {
      const health = await Database.isHealthy();
      assert.strictEqual(health.status, 'HEALTHY');
      assert.ok(['SQLite', 'PostgreSQL'].includes(health.engine));
      assert.ok(typeof health.latencyMs === 'number');
    });

    test('GET /health returns 200 with database diagnostic metadata', async () => {
      const res = await makeRequest('health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'HEALTHY');
      assert.ok(res.data.database);
      assert.strictEqual(res.data.database.status, 'HEALTHY');
    });

    test('Database.queryAsync, queryOneAsync, executeAsync and transactionAsync execute properly', async () => {
      const rows = await Database.queryAsync('SELECT 1 as num, ? as text', ['hello']);
      assert.strictEqual(rows.length, 1);
      assert.strictEqual(rows[0].text, 'hello');

      const single = await Database.queryOneAsync('SELECT ? as val', [42]);
      assert.ok(single);
      assert.strictEqual(single.val, 42);

      const transResult = await Database.transactionAsync(async () => {
        await Database.executeAsync('INSERT OR REPLACE INTO audit_logs (id, action, created_at) VALUES (?, ?, ?)', [
          'test_trans_audit',
          'TRANSACTION_ASYNC_VERIFY',
          new Date().toISOString()
        ]);
        const found = await Database.queryOneAsync('SELECT id, action FROM audit_logs WHERE id = ?', ['test_trans_audit']);
        return found;
      });
      assert.ok(transResult);
      assert.strictEqual(transResult.action, 'TRANSACTION_ASYNC_VERIFY');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. PostgreSQL Schema DDL Parity
  // ─────────────────────────────────────────────────────────────
  describe('6. PostgreSQL Schema DDL Parity Verification', () => {
    test('PostgreSQL DDL defines all 21 production tables with correct naming parity', () => {
      const requiredTables = [
        'users',
        'user_profiles',
        'user_skills',
        'user_preferences',
        'platform_connections',
        'jobs',
        'job_analyses',
        'job_scores',
        'job_risks',
        'saved_jobs',
        'proposals',
        'applications',
        'application_events',
        'user_feedback',
        'learned_preferences',
        'automation_settings',
        'notifications',
        'notification_preferences',
        'ai_usage_logs',
        'audit_logs',
        'password_resets'
      ];

      for (const table of requiredTables) {
        const regex = new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table}\\b`, 'i');
        assert.ok(
          regex.test(PG_SCHEMA_SQL),
          `PostgreSQL schema must define table '${table}' matching SQLite schema.sql`
        );
      }

      assert.ok(PG_SCHEMA_SQL.includes('hash VARCHAR(128) UNIQUE NOT NULL'), 'jobs table must use hash column');
      assert.ok(PG_SCHEMA_SQL.includes('client_reviews_count INTEGER'), 'jobs table must use client_reviews_count column');
      assert.ok(PG_SCHEMA_SQL.includes('required_skills TEXT'), 'job_analyses must use required_skills column');
    });
  });
});
