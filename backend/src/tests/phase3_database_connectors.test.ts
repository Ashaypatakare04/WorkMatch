import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { Database } from '../database/connection.js';
import { FreelancerConnector } from '../connectors/freelancer/FreelancerConnector.js';
import { UpworkConnector } from '../connectors/upwork/UpworkConnector.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { generateToken } from '../api/middleware/auth.js';

let server: http.Server;
let baseUrl: string;
const testUserId = 'user_phase3_test';
const testToken = generateToken({
  userId: testUserId,
  email: 'phase3@workmatch.local',
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

describe('Phase 3: Persistent Database & Real Platform Connectors', () => {
  before(() => {
    const existing = UserRepository.findById(testUserId);
    if (!existing) {
      UserRepository.create({
        id: testUserId,
        email: 'phase3@workmatch.local',
        password_hash: 'phase3_hash',
        full_name: 'Phase 3 Tester',
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
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Live Freelancer Connector Tests
  // ─────────────────────────────────────────────────────────────
  describe('1. Live Freelancer Connector', () => {
    const connector = new FreelancerConnector();

    test('Accurately transforms Freelancer API project payload into NormalizedJob', () => {
      const mockProject = {
        id: 98765432,
        title: 'Full Stack React & Node Dashboard Development',
        preview_description: 'Need an experienced engineer to build responsive dashboards with realtime websockets.',
        type: 'hourly',
        budget: {
          minimum: 40,
          maximum: 70
        },
        currency: {
          code: 'USD'
        },
        jobs: [
          { name: 'React.js' },
          { name: 'Node.js' },
          { name: 'TypeScript' }
        ],
        submitdate: 1758960000,
        seo_url: 'react-js/Full-Stack-React-Dashboard-Development',
        owner_id: 1234567,
        bid_stats: {
          bid_count: 14
        }
      };

      const normalized = connector.mapToNormalizedJob(mockProject);

      assert.strictEqual(normalized.id, 'fl_98765432');
      assert.strictEqual(normalized.platform, 'freelancer');
      assert.strictEqual(normalized.platform_job_id, '98765432');
      assert.strictEqual(normalized.title, 'Full Stack React & Node Dashboard Development');
      assert.strictEqual(normalized.budget.type, 'hourly');
      assert.strictEqual(normalized.budget.min, 40);
      assert.strictEqual(normalized.budget.max, 70);
      assert.strictEqual(normalized.budget.currency, 'USD');
      assert.deepStrictEqual(normalized.skills, ['React.js', 'Node.js', 'TypeScript']);
      assert.strictEqual(normalized.url, 'https://www.freelancer.com/projects/react-js/Full-Stack-React-Dashboard-Development');
      assert.strictEqual(normalized.competition.proposal_count, 14);
    });

    test('getJobs returns non-empty list of jobs', async () => {
      const jobs = await connector.getJobs({ limit: 5 });
      assert.ok(Array.isArray(jobs));
      assert.ok(jobs.length > 0, 'Freelancer connector must return jobs');
      assert.strictEqual(jobs[0].platform, 'freelancer');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Upwork Connector RSS Parser Tests
  // ─────────────────────────────────────────────────────────────
  describe('2. Upwork Connector RSS Parser', () => {
    const connector = new UpworkConnector();

    test('Parses Upwork XML RSS feed item into NormalizedJob', () => {
      const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Upwork Saved Search</title>
    <item>
      <title><![CDATA[Senior TypeScript Architect - High Throughput Backend]]></title>
      <link>https://www.upwork.com/jobs/~01abc123456def789</link>
      <description><![CDATA[We are seeking a senior TypeScript architect. Hourly Range: $50.00 - $85.00. Posted On: 2026-09-27. Skills: TypeScript, Node.js, PostgreSQL, Docker]]></description>
      <pubDate>Sun, 27 Sep 2026 06:30:00 +0000</pubDate>
    </item>
    <item>
      <title><![CDATA[Build landing page in Next.js]]></title>
      <link>https://www.upwork.com/jobs/~01xyz9876543210</link>
      <description><![CDATA[Looking for a quick turnaround landing page. Budget: $1500. Skills: Next.js, Tailwind CSS]]></description>
      <pubDate>Sun, 27 Sep 2026 07:00:00 +0000</pubDate>
    </item>
  </channel>
</rss>`;

      const jobs = connector.parseRssFeed(sampleXml);

      assert.strictEqual(jobs.length, 2);

      // Hourly job checks
      assert.strictEqual(jobs[0].platform, 'upwork');
      assert.strictEqual(jobs[0].platform_job_id, '01abc123456def789');
      assert.strictEqual(jobs[0].budget.type, 'hourly');
      assert.strictEqual(jobs[0].budget.min, 50);
      assert.strictEqual(jobs[0].budget.max, 85);
      assert.deepStrictEqual(jobs[0].skills, ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker']);

      // Fixed budget job checks
      assert.strictEqual(jobs[1].platform_job_id, '01xyz9876543210');
      assert.strictEqual(jobs[1].budget.type, 'fixed');
      assert.strictEqual(jobs[1].budget.min, 1500);
      assert.strictEqual(jobs[1].budget.max, 1500);
      assert.deepStrictEqual(jobs[1].skills, ['Next.js', 'Tailwind CSS']);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. PostgreSQL Dialect Translation & Asynchronous Database
  // ─────────────────────────────────────────────────────────────
  describe('3. PostgreSQL Dialect & Asynchronous Database Methods', () => {
    test('toPostgresSql translates ? placeholders to indexed $1, $2, $3', () => {
      const sqliteSql = 'SELECT * FROM users WHERE email = ? AND is_admin = ? AND plan_type = ?';
      const pgSql = Database.toPostgresSql(sqliteSql);
      assert.strictEqual(pgSql, 'SELECT * FROM users WHERE email = $1 AND is_admin = $2 AND plan_type = $3');
    });

    test('queryAsync and queryOneAsync return valid typed rows', async () => {
      const user = await Database.queryOneAsync<any>('SELECT * FROM users WHERE id = ?', [testUserId]);
      assert.ok(user);
      assert.strictEqual(user.id, testUserId);
      assert.strictEqual(user.email, 'phase3@workmatch.local');

      const allUsers = await Database.queryAsync<any>('SELECT * FROM users WHERE plan_type = ?', ['pro']);
      assert.ok(Array.isArray(allUsers));
      assert.ok(allUsers.some(u => u.id === testUserId));
    });

    test('executeAsync updates rows and returns changes count', async () => {
      const res = await Database.executeAsync(
        'UPDATE users SET full_name = ? WHERE id = ?',
        ['Phase 3 Verified Tester', testUserId]
      );
      assert.strictEqual(res.changes, 1);

      const updated = await Database.queryOneAsync<any>('SELECT full_name FROM users WHERE id = ?', [testUserId]);
      assert.strictEqual(updated.full_name, 'Phase 3 Verified Tester');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Portable Database Backup & Restore
  // ─────────────────────────────────────────────────────────────
  describe('4. Database State Backup & Restore', () => {
    test('exportState dumps clean JSON state for user', () => {
      const state = Database.exportState(testUserId);
      assert.ok(state.users);
      assert.ok(state.user_profiles);
      assert.ok(state.user_preferences);
      assert.strictEqual(state.users[0].id, testUserId);
    });

    test('importState restores state into database cleanly', () => {
      const backupSnapshot = {
        user_skills: [
          {
            id: `skill_test_${Date.now()}`,
            user_id: testUserId,
            skill_name: 'Rust Development',
            category: 'Systems',
            proficiency_level: 'Expert',
            years_experience: 4.0,
            verified: 1,
            created_at: new Date().toISOString()
          }
        ]
      };

      Database.importState(backupSnapshot);

      const skill = Database.queryOne<any>(
        'SELECT * FROM user_skills WHERE user_id = ? AND skill_name = ?',
        [testUserId, 'Rust Development']
      );
      assert.ok(skill);
      assert.strictEqual(skill.proficiency_level, 'Expert');
      assert.strictEqual(Number(skill.years_experience), 4.0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Backup & Engine Diagnostics API Endpoints
  // ─────────────────────────────────────────────────────────────
  describe('5. Backup & Database Status API', () => {
    test('GET /backup/status returns database engine and metrics', async () => {
      const res = await makeRequest('/backup/status');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.engine);
      assert.ok(typeof res.data.is_postgres === 'boolean');
      assert.ok(typeof res.data.metrics.total_users === 'number');
      assert.ok(typeof res.data.metrics.total_jobs === 'number');
    });

    test('GET /backup/export exports user data snapshot', async () => {
      const res = await makeRequest('/backup/export');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.user_id, testUserId);
      assert.ok(res.data.data.users);
      assert.ok(res.data.data.user_profiles);
    });

    test('POST /backup/import validates input and imports data', async () => {
      const invalidRes = await makeRequest('/backup/import', {
        method: 'POST',
        body: { data: 'invalid_string' }
      });
      assert.strictEqual(invalidRes.status, 400);

      const validRes = await makeRequest('/backup/import', {
        method: 'POST',
        body: {
          data: {
            user_skills: [
              {
                id: `skill_api_${Date.now()}`,
                user_id: testUserId,
                skill_name: 'Go Microservices',
                category: 'Backend',
                proficiency_level: 'Advanced',
                years_experience: 3.5,
                verified: 1,
                created_at: new Date().toISOString()
              }
            ]
          }
        }
      });
      assert.strictEqual(validRes.status, 200);
      assert.strictEqual(validRes.data.success, true);
      assert.ok(validRes.data.tables_restored.includes('user_skills'));
    });
  });
});
