import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server.js';
import { Database } from '../database/connection.js';
import { UserRepository } from '../repositories/UserRepository.js';

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

describe('OAuth Social Authentication (Google & GitHub)', () => {
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

  test('1. GET /auth/google redirects to callback or provider in sandbox mode', async () => {
    const res = await makeRequest('auth/google');
    assert.strictEqual(res.status, 302, 'Should issue a 302 redirect');
    const location = res.headers.location || '';
    assert.ok(
      location.includes('google') || location.includes('accounts.google.com'),
      `Redirect target should reference google: ${location}`
    );
  });

  test('2. GET /auth/google/callback provisions user, session cookie, and redirect token', async () => {
    const res = await makeRequest('auth/google/callback?code=sandbox_demo_google_code');
    assert.strictEqual(res.status, 302, 'Callback should redirect to frontend');
    const location = res.headers.location || '';
    assert.ok(location.includes('token='), `Redirect location should contain JWT token: ${location}`);

    const setCookie = res.headers['set-cookie'];
    assert.ok(setCookie && setCookie.length > 0, 'Should set session cookie');
    assert.ok(setCookie[0].includes('workmatch_token='), 'Cookie should be workmatch_token');

    // Verify user in database
    const user = UserRepository.findByEmail('alex.google@workmatch.local');
    assert.ok(user, 'OAuth Google user should be stored in database');
    assert.strictEqual(user?.provider, 'google');
  });

  test('3. GET /auth/github redirects to callback or provider in sandbox mode', async () => {
    const res = await makeRequest('auth/github');
    assert.strictEqual(res.status, 302, 'Should issue a 302 redirect');
    const location = res.headers.location || '';
    assert.ok(
      location.includes('github') || location.includes('github.com/login/oauth'),
      `Redirect target should reference github: ${location}`
    );
  });

  test('4. GET /auth/github/callback provisions user, session cookie, and redirect token', async () => {
    const res = await makeRequest('auth/github/callback?code=sandbox_demo_github_code');
    assert.strictEqual(res.status, 302, 'Callback should redirect to frontend');
    const location = res.headers.location || '';
    assert.ok(location.includes('token='), `Redirect location should contain JWT token: ${location}`);

    // Verify user in database
    const user = UserRepository.findByEmail('dev.github@workmatch.local');
    assert.ok(user, 'OAuth GitHub user should be stored in database');
    assert.strictEqual(user?.provider, 'github');
  });

  test('5. POST /auth/oauth authenticates Google user via direct JSON exchange', async () => {
    const res = await makeRequest('auth/oauth', {
      method: 'POST',
      body: {
        provider: 'google',
        profile: {
          id: 'goog_direct_999',
          email: 'direct.google@example.com',
          name: 'Direct Google User',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
        }
      }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token, 'Should return JWT token');
    assert.strictEqual(res.data.user.email, 'direct.google@example.com');
    assert.strictEqual(res.data.user.provider, 'google');
  });

  test('6. POST /auth/oauth authenticates GitHub user via direct JSON exchange', async () => {
    const res = await makeRequest('auth/oauth', {
      method: 'POST',
      body: {
        provider: 'github',
        profile: {
          id: 'gh_direct_888',
          email: 'direct.github@example.com',
          name: 'Direct GitHub User'
        }
      }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token, 'Should return JWT token');
    assert.strictEqual(res.data.user.email, 'direct.github@example.com');
    assert.strictEqual(res.data.user.provider, 'github');
  });

  test('7. POST /auth/oauth rejects invalid or unsupported provider', async () => {
    const res = await makeRequest('auth/oauth', {
      method: 'POST',
      body: {
        provider: 'facebook'
      }
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.code, 'VALIDATION_ERROR');
  });

  test('8. Account linking: connects OAuth provider to existing email account without duplicating user', async () => {
    const timestamp = Date.now();
    const uniqueEmail = `link_test_${timestamp}@example.com`;
    const uniqueProviderId = `goog_linked_${timestamp}`;

    // 1. Create original user via register
    const regRes = await makeRequest('auth/register', {
      method: 'POST',
      body: {
        email: uniqueEmail,
        password: 'Password123!',
        full_name: 'Existing Member'
      }
    });
    assert.strictEqual(regRes.status, 200);
    const originalUserId = regRes.data.user.id;

    // 2. Log in with Google with same email
    const oauthRes = await makeRequest('auth/oauth', {
      method: 'POST',
      body: {
        provider: 'google',
        profile: {
          id: uniqueProviderId,
          email: uniqueEmail,
          name: 'Existing Member Google'
        }
      }
    });
    assert.strictEqual(oauthRes.status, 200);
    assert.strictEqual(oauthRes.data.user.id, originalUserId, 'User ID should remain same (linked)');
    assert.strictEqual(oauthRes.data.user.provider, 'google', 'Provider should be linked to google');
  });

  test('9. UserRepository.findByProvider locates user by provider & provider_id', () => {
    const user = UserRepository.findByProvider('google', 'goog_direct_999');
    assert.ok(user, 'Should locate user by provider credentials');
    assert.strictEqual(user?.email, 'direct.google@example.com');
  });
});
