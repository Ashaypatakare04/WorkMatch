import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MatchingEngine } from '../ai/matching/MatchingEngine.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobAnalysis } from '../models/JobAnalysis.js';
import { JobRisk } from '../models/JobRisk.js';
import { UserCapabilityProfile, DEFAULT_DIFFICULTY_WEIGHTS, DEFAULT_SCORING_THRESHOLDS } from '../models/UserCapabilityProfile.js';

describe('Matching and Transparent Scoring Engine', () => {
  const profile: UserCapabilityProfile = {
    user_id: 'tester',
    headline: 'Web Researcher',
    bio: 'Experienced in online research and data extraction',
    years_experience: 3.0,
    hourly_rate: 25.0,
    availability_hours_per_day: 4,
    availability_days_per_week: 5,
    preferred_working_hours: 'Flexible',
    max_simultaneous_projects: 3,
    skills: [
      { skill_name: 'Web Research', category: 'Research', proficiency_level: 'Expert', years_experience: 3, verified: true },
      { skill_name: 'Excel', category: 'Data', proficiency_level: 'Advanced', years_experience: 3, verified: true }
    ],
    preferences: {
      preferred_categories: ['Web Research', 'Data Entry'],
      excluded_keywords: ['Cold calling', 'Sales calls'],
      preferred_difficulty: 'Easy + Moderate',
      min_budget: 20,
      preferred_max_workload: 'Part-time',
      preferred_duration: 'Short-term',
      preferred_deadline: 'Flexible',
      preferred_communication_level: 'Low',
      preferred_max_tasks: 5,
      difficulty_weights: DEFAULT_DIFFICULTY_WEIGHTS,
      scoring_thresholds: DEFAULT_SCORING_THRESHOLDS
    }
  };

  test('should generate high match score (>80) with transparent explanations for matching job', () => {
    const job: NormalizedJob = {
      id: 'job_good',
      platform: 'upwork',
      platform_job_id: 'up_match_01',
      url: 'https://example.com/match1',
      title: 'Web Research for Local Businesses',
      description: 'Looking for someone to do web research and put results into Excel.',
      category: 'Web Research',
      skills: ['Web Research', 'Excel'],
      budget: { type: 'fixed', min: 60, max: 80, currency: 'USD' },
      experience_level: 'Entry',
      estimated_duration: '2 days',
      deadline: 'Flexible',
      posted_at: new Date().toISOString(),
      client: { name: 'Acme', country: 'US', rating: 4.9, reviews: 20, jobs_posted: 25, jobs_hired: 23, hire_rate: 92 },
      competition: { proposal_count: 6 },
      communication_requirements: ['Low'],
      requirements: ['Web Research', 'Excel'],
      external_links: [],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const analysis: JobAnalysis = {
      job_id: 'job_good',
      required_skills: ['Web Research', 'Excel'],
      optional_skills: [],
      experience_requirement: 'Entry',
      technical_complexity: 'Low',
      estimated_hours: 3,
      step_count: 2,
      communication_level: 'Low',
      deadline_pressure: 'Low',
      budget_quality: 'Fair',
      client_expectations: 'Accurate research in spreadsheet',
      analyzed_at: new Date().toISOString()
    };

    const risk: JobRisk = {
      job_id: 'job_good',
      risk_level: 'Low',
      risk_score: 10,
      warning_signals: [],
      explanation: 'Pristine client reputation',
      analyzed_at: new Date().toISOString()
    };

    const score = MatchingEngine.match(job, analysis, risk, profile);

    assert.ok(score.overall_score >= 80, `Expected overall score >= 80, got ${score.overall_score}`);
    assert.strictEqual(score.skill_score, 100, 'Skill score should be 100% when all required skills match');
    assert.ok(score.explanation.why_matches.length > 0, 'Should provide human-readable why_matches');
  });

  test('should severely penalize score when job triggers user exclusion keyword', () => {
    const job: NormalizedJob = {
      id: 'job_excluded',
      platform: 'upwork',
      platform_job_id: 'up_excl_01',
      url: 'https://example.com/excl1',
      title: 'Cold Calling and Phone Sales Lead Generation',
      description: 'Make 50 cold calls a day for real estate sales.',
      category: 'Sales',
      skills: ['Cold calling'],
      budget: { type: 'fixed', min: 100, max: 150, currency: 'USD' },
      experience_level: 'Intermediate',
      estimated_duration: '1 week',
      deadline: 'ASAP',
      posted_at: new Date().toISOString(),
      client: { name: 'Seller', country: 'US', rating: 4.5, reviews: 2, jobs_posted: 3, jobs_hired: 2, hire_rate: 66 },
      competition: { proposal_count: 10 },
      communication_requirements: ['High'],
      requirements: ['Cold calling'],
      external_links: [],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const analysis: JobAnalysis = {
      job_id: 'job_excluded',
      required_skills: ['Cold calling'],
      optional_skills: [],
      experience_requirement: 'Intermediate',
      technical_complexity: 'Medium',
      estimated_hours: 15,
      step_count: 5,
      communication_level: 'High',
      deadline_pressure: 'High',
      budget_quality: 'Fair',
      client_expectations: 'Hit sales quotas',
      analyzed_at: new Date().toISOString()
    };

    const risk: JobRisk = {
      job_id: 'job_excluded',
      risk_level: 'Low',
      risk_score: 15,
      warning_signals: [],
      explanation: 'Legitimate posting',
      analyzed_at: new Date().toISOString()
    };

    const score = MatchingEngine.match(job, analysis, risk, profile);

    assert.ok(score.overall_score < 60, `Overall score should be penalized under 60, got ${score.overall_score}`);
    assert.ok(
      score.explanation.concerns.some(c => c.toLowerCase().includes('exclusion rule')),
      'Concerns list must flag exclusion keyword trigger'
    );
  });
});
