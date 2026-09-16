import { test, describe } from 'node:test';
import assert from 'node:assert';
import { RiskScamSignalEngine } from '../ai/risk/RiskScamSignalEngine.js';
import { NormalizedJob } from '../models/NormalizedJob.js';

describe('Risk and Scam Signal Detection Engine', () => {
  test('should detect high risk and off-platform redirection flags', async () => {
    const suspiciousJob: NormalizedJob = {
      id: 'job_scam_01',
      platform: 'upwork',
      platform_job_id: 'up_scam_01',
      url: 'https://example.com/scam1',
      title: 'Data Entry - Contact us on Telegram immediately',
      description: 'Contact our hiring supervisor directly on Telegram @fast_money_hr to receive upfront payment and tasks. Do not message on Upwork.',
      category: 'Data Entry',
      skills: ['Data Entry'],
      budget: { type: 'fixed', min: 1000, max: 2000, currency: 'USD' },
      experience_level: 'Entry',
      estimated_duration: '1 day',
      deadline: 'Today',
      posted_at: new Date().toISOString(),
      client: { name: 'Scammer', country: 'US', rating: null, reviews: 0, jobs_posted: 1, jobs_hired: 0, hire_rate: 0 },
      competition: { proposal_count: 50 },
      communication_requirements: ['Telegram'],
      requirements: ['Data Entry'],
      external_links: ['https://t.me/fast_money_hr'],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const risk = await RiskScamSignalEngine.analyze(suspiciousJob);

    assert.strictEqual(risk.risk_level, 'High', 'Should flag job as High risk');
    assert.ok(
      risk.warning_signals.some(s => s.toLowerCase().includes('telegram')),
      'Warning signals must include Telegram redirection flag'
    );
    assert.ok(risk.risk_score >= 60, `Risk score should be elevated (>=60), got ${risk.risk_score}`);
  });

  test('should flag low risk for standard verified client jobs', async () => {
    const cleanJob: NormalizedJob = {
      id: 'job_clean_01',
      platform: 'upwork',
      platform_job_id: 'up_clean_01',
      url: 'https://example.com/clean1',
      title: 'Compile List of 50 Software Tools',
      description: 'We need help researching 50 developer tools and entering them into a shared Google Sheet. All communication stays on Upwork.',
      category: 'Web Research',
      skills: ['Web Research', 'Google Sheets'],
      budget: { type: 'fixed', min: 50, max: 70, currency: 'USD' },
      experience_level: 'Entry',
      estimated_duration: '3 days',
      deadline: 'Flexible',
      posted_at: new Date().toISOString(),
      client: { name: 'Verified Corp', country: 'Germany', rating: 4.9, reviews: 30, jobs_posted: 40, jobs_hired: 38, hire_rate: 95 },
      competition: { proposal_count: 8 },
      communication_requirements: ['On platform'],
      requirements: ['Web Research'],
      external_links: [],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const risk = await RiskScamSignalEngine.analyze(cleanJob);

    assert.strictEqual(risk.risk_level, 'Low', 'Standard client listing should be Low risk');
    assert.strictEqual(risk.warning_signals.length, 0, 'No warning signals should be flagged for clean jobs');
  });
});
