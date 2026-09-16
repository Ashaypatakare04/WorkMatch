import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AutomationController } from '../automation/AutomationController.js';
import { AutomationRepository } from '../repositories/AutomationRepository.js';
import { MockPlatformConnector } from '../connectors/mock/MockPlatformConnector.js';
import { FiverrConnector } from '../connectors/fiverr/FiverrConnector.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';
import { UserCapabilityProfile, DEFAULT_DIFFICULTY_WEIGHTS, DEFAULT_SCORING_THRESHOLDS } from '../models/UserCapabilityProfile.js';
import { UserRepository } from '../repositories/UserRepository.js';

describe('Automation Safety Controls and Emergency Kill Switch', () => {
  const userId = 'safety_test_user';

  beforeEach(() => {
    let user = UserRepository.findById(userId);
    if (!user) {
      user = UserRepository.create({
        id: userId,
        email: 'safety@workmatch.local',
        full_name: 'Safety Tester',
        is_admin: false,
        plan_type: 'personal'
      });
    }

    AutomationRepository.updateSettings(userId, {
      application_mode: 'AUTOMATIC',
      is_active: true,
      emergency_stop: false,
      max_daily_applications: 3,
      min_match_score: 80,
      require_low_risk_only: true
    });
  });

  const job: NormalizedJob = {
    id: 'safe_job_1',
    platform: 'mock',
    platform_job_id: 'mock_1',
    url: 'https://example.com/safe',
    title: 'Data Entry Assistant',
    description: 'Help format csv rows.',
    category: 'Data Entry',
    skills: ['Data Entry'],
    budget: { type: 'fixed', min: 40, max: 60, currency: 'USD' },
    experience_level: 'Entry',
    estimated_duration: '1 day',
    deadline: 'Flexible',
    posted_at: new Date().toISOString(),
    client: { name: 'Good Client', country: 'US', rating: 5.0, reviews: 10, jobs_posted: 10, jobs_hired: 10, hire_rate: 100 },
    competition: { proposal_count: 3 },
    communication_requirements: [],
    requirements: ['Data Entry'],
    external_links: [],
    source_data: { connects_required: 4 },
    collected_at: new Date().toISOString()
  };

  const goodScore: JobScore = {
    job_id: 'safe_job_1',
    user_id: userId,
    overall_score: 92,
    skill_score: 95,
    experience_score: 90,
    difficulty_score: 90,
    budget_score: 90,
    time_score: 90,
    communication_score: 95,
    preference_score: 95,
    client_quality_score: 95,
    matched_skills: ['Data Entry'],
    missing_skills: [],
    explanation: { why_matches: ['Great match'], why_not_matches: [], concerns: [], estimated_effort: '2h', potential_value: '$50' },
    scored_at: new Date().toISOString()
  };

  const lowRisk: JobRisk = {
    job_id: 'safe_job_1',
    risk_level: 'Low',
    risk_score: 10,
    warning_signals: [],
    explanation: 'Clean',
    analyzed_at: new Date().toISOString()
  };

  test('should BLOCK automated application when global emergency stop is activated', async () => {
    // Activate Emergency Kill Switch
    AutomationRepository.triggerEmergencyStop(userId);

    const connector = new MockPlatformConnector();
    const profile = UserRepository.getProfile(userId)!;

    const result = await AutomationController.evaluateAndApply({
      userId,
      job,
      score: goodScore,
      risk: lowRisk,
      profile,
      connector
    });

    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.applied, false);
    assert.ok(result.reason.includes('EMERGENCY_STOP_ACTIVE'), 'Reason must indicate emergency stop engaged');
  });

  test('should BLOCK automated application on platforms where applications are unsupported (e.g. Fiverr)', async () => {
    const fiverrConnector = new FiverrConnector();
    const profile = UserRepository.getProfile(userId)!;

    const result = await AutomationController.evaluateAndApply({
      userId,
      job: { ...job, platform: 'fiverr' },
      score: goodScore,
      risk: lowRisk,
      profile,
      connector: fiverrConnector
    });

    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.applied, false);
    assert.ok(result.reason.includes('PLATFORM_UNSUPPORTED'));
  });

  test('should BLOCK automated application when job risk level is High', async () => {
    const highRisk: JobRisk = {
      job_id: 'safe_job_1',
      risk_level: 'High',
      risk_score: 85,
      warning_signals: ['Telegram redirection detected'],
      explanation: 'Suspicious',
      analyzed_at: new Date().toISOString()
    };

    const connector = new MockPlatformConnector();
    const profile = UserRepository.getProfile(userId)!;

    const result = await AutomationController.evaluateAndApply({
      userId,
      job,
      score: goodScore,
      risk: highRisk,
      profile,
      connector
    });

    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.applied, false);
    assert.ok(result.reason.includes('RISK_TOO_HIGH'));
  });
});
