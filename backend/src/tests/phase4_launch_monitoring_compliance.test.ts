import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

describe('Phase 4: Launch Prep, Monitoring, CI/CD & Legal Compliance', () => {
  test('1. Structured Logger redacts sensitive credentials in log metadata', () => {
    let capturedLog = '';
    const originalLog = console.log;
    console.log = (msg: string) => {
      capturedLog = msg;
    };

    try {
      Logger.info('User authenticated successfully', {
        email: 'freelancer@test.com',
        password: 'SuperSecretPassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token',
        client_secret: 'whsec_999999',
        normal_field: 'valid_data'
      });

      assert.ok(capturedLog.includes('freelancer@test.com'));
      assert.ok(capturedLog.includes('valid_data'));
      assert.ok(!capturedLog.includes('SuperSecretPassword123!'), 'Plaintext password must never leak in logs');
      assert.ok(!capturedLog.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token'), 'JWT token must be redacted');
      assert.ok(!capturedLog.includes('whsec_999999'), 'Client secret must be redacted');
      assert.ok(capturedLog.includes('[REDACTED]'), 'Must contain [REDACTED] tag');
    } finally {
      console.log = originalLog;
    }
  });

  test('2. Structured Logger handles errors and warnings without crashing', () => {
    let capturedWarn = '';
    const originalWarn = console.warn;
    console.warn = (msg: string) => { capturedWarn = msg; };

    try {
      Logger.warn('Rate limit approaching', { count: 14, limit: 15 });
      assert.ok(capturedWarn.includes('Rate limit approaching'));
      assert.ok(capturedWarn.includes('14'));
    } finally {
      console.warn = originalWarn;
    }

    let capturedError = '';
    const originalError = console.error;
    console.error = (msg: string) => { capturedError = msg; };

    try {
      Logger.error('Database query failed', new Error('Connection timeout'), { retryCount: 3 });
      assert.ok(capturedError.includes('Database query failed'));
      assert.ok(capturedError.includes('Connection timeout'));
    } finally {
      console.error = originalError;
    }
  });

  test('3. CI/CD GitHub Actions workflow (.github/workflows/ci.yml) is configured', () => {
    const ciPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
    assert.ok(fs.existsSync(ciPath), 'CI workflow file must exist');

    const content = fs.readFileSync(ciPath, 'utf8');
    assert.ok(content.includes('name: WorkMatch AI CI/CD Pipeline'));
    assert.ok(content.includes('npm ci'));
    assert.ok(content.includes('npm test'));
    assert.ok(content.includes('npm run build'));
  });

  test('4. Production Dockerfile and .dockerignore are configured for deployment', () => {
    const dockerfilePath = path.join(rootDir, 'Dockerfile');
    const dockerignorePath = path.join(rootDir, '.dockerignore');

    assert.ok(fs.existsSync(dockerfilePath), 'Dockerfile must exist');
    assert.ok(fs.existsSync(dockerignorePath), '.dockerignore must exist');

    const dockerContent = fs.readFileSync(dockerfilePath, 'utf8');
    assert.ok(dockerContent.includes('FROM node:22-alpine AS builder'));
    assert.ok(dockerContent.includes('FROM node:22-alpine AS runner'));
    assert.ok(dockerContent.includes('HEALTHCHECK'));
    assert.ok(dockerContent.includes('CMD ["node", "api/index.js"]'));

    const ignoreContent = fs.readFileSync(dockerignorePath, 'utf8');
    assert.ok(ignoreContent.includes('node_modules'));
    assert.ok(ignoreContent.includes('.git'));
  });

  test('5. Legal & Compliance documents exist and contain required disclosures', () => {
    const tosPath = path.join(rootDir, 'docs', 'TERMS_OF_SERVICE.md');
    const privacyPath = path.join(rootDir, 'docs', 'PRIVACY_POLICY.md');
    const disclaimerPath = path.join(rootDir, 'docs', 'TRADEMARK_DISCLAIMER.md');

    assert.ok(fs.existsSync(tosPath), 'TERMS_OF_SERVICE.md must exist');
    assert.ok(fs.existsSync(privacyPath), 'PRIVACY_POLICY.md must exist');
    assert.ok(fs.existsSync(disclaimerPath), 'TRADEMARK_DISCLAIMER.md must exist');

    const tosContent = fs.readFileSync(tosPath, 'utf8');
    assert.ok(tosContent.includes('Terms of Service'));
    assert.ok(tosContent.includes('Human-in-the-Loop Obligation'));
    assert.ok(tosContent.includes('Personal (Free)'));
    assert.ok(tosContent.includes('Pro ($29/month)'));

    const privacyContent = fs.readFileSync(privacyPath, 'utf8');
    assert.ok(privacyContent.includes('Privacy Policy'));
    assert.ok(privacyContent.includes('Zero Sale of Personal Data'));
    assert.ok(privacyContent.includes('Zero-Training Guarantees'));

    const disclaimerContent = fs.readFileSync(disclaimerPath, 'utf8');
    assert.ok(disclaimerContent.includes('Trademark Non-Affiliation'));
    assert.ok(disclaimerContent.includes('Upwork Global Inc.'));
    assert.ok(disclaimerContent.includes('Fiverr International Ltd.'));
    assert.ok(disclaimerContent.includes('Assisted Copilot Paradigm'));
  });
});
