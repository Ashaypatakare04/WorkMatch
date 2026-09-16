import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DifficultyCalculator } from '../ai/matching/DifficultyCalculator.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobAnalysis } from '../models/JobAnalysis.js';
import { UserCapabilityProfile, DEFAULT_DIFFICULTY_WEIGHTS, DEFAULT_SCORING_THRESHOLDS } from '../models/UserCapabilityProfile.js';

describe('Difficulty Assessment Engine', () => {
  const mockProfile: UserCapabilityProfile = {
    user_id: 'test_user',
    headline: 'Data Assistant',
    bio: 'Experienced in Excel and research',
    years_experience: 3.0,
    hourly_rate: 25.0,
    availability_hours_per_day: 5,
    availability_days_per_week: 5,
    preferred_working_hours: 'Flexible',
    max_simultaneous_projects: 3,
    skills: [
      { skill_name: 'Excel', category: 'Data', proficiency_level: 'Expert', years_experience: 4, verified: true },
      { skill_name: 'Data Entry', category: 'Data', proficiency_level: 'Advanced', years_experience: 3, verified: true }
    ],
    preferences: {
      preferred_categories: ['Data Entry'],
      excluded_keywords: ['Cold calling'],
      preferred_difficulty: 'Easy + Moderate',
      min_budget: 25,
      preferred_max_workload: 'Part-time',
      preferred_duration: 'Short-term',
      preferred_deadline: 'Flexible',
      preferred_communication_level: 'Low',
      preferred_max_tasks: 4,
      difficulty_weights: DEFAULT_DIFFICULTY_WEIGHTS,
      scoring_thresholds: DEFAULT_SCORING_THRESHOLDS
    }
  };

  test('should rate basic 2-hour low-complexity task as Easy', () => {
    const job: NormalizedJob = {
      id: 'job_easy',
      platform: 'upwork',
      platform_job_id: 'up_01',
      url: 'https://example.com/job1',
      title: 'Simple Excel Sheet Formatting',
      description: 'Format 50 lines in excel.',
      category: 'Data Entry',
      skills: ['Excel', 'Data Entry'],
      budget: { type: 'fixed', min: 40, max: 50, currency: 'USD' },
      experience_level: 'Entry',
      estimated_duration: '1 day',
      deadline: 'Flexible',
      posted_at: new Date().toISOString(),
      client: { name: 'Client A', country: 'US', rating: 4.9, reviews: 10, jobs_posted: 12, jobs_hired: 11, hire_rate: 91 },
      competition: { proposal_count: 5 },
      communication_requirements: ['Low'],
      requirements: ['Excel'],
      external_links: [],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const analysis: JobAnalysis = {
      job_id: 'job_easy',
      required_skills: ['Excel', 'Data Entry'],
      optional_skills: [],
      experience_requirement: 'Entry',
      technical_complexity: 'Low',
      estimated_hours: 2,
      step_count: 1,
      communication_level: 'Low',
      deadline_pressure: 'Low',
      budget_quality: 'Fair',
      client_expectations: 'Standard formatting',
      analyzed_at: new Date().toISOString()
    };

    const result = DifficultyCalculator.calculate(job, analysis, mockProfile);
    assert.strictEqual(result.label, 'Easy', 'Basic spreadsheet task should be labeled Easy');
    assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
  });

  test('should reflect changes in user custom difficulty weights', () => {
    const job: NormalizedJob = {
      id: 'job_urgent',
      platform: 'upwork',
      platform_job_id: 'up_02',
      url: 'https://example.com/job2',
      title: 'Urgent Data Entry with High Deadline Pressure',
      description: 'Need fast delivery in 3 hours.',
      category: 'Data Entry',
      skills: ['Excel'],
      budget: { type: 'fixed', min: 100, max: 150, currency: 'USD' },
      experience_level: 'Entry',
      estimated_duration: '3 hours',
      deadline: 'Urgent',
      posted_at: new Date().toISOString(),
      client: { name: 'Client B', country: 'US', rating: 4.5, reviews: 3, jobs_posted: 4, jobs_hired: 3, hire_rate: 75 },
      competition: { proposal_count: 10 },
      communication_requirements: [],
      requirements: ['Excel'],
      external_links: [],
      source_data: {},
      collected_at: new Date().toISOString()
    };

    const analysis: JobAnalysis = {
      job_id: 'job_urgent',
      required_skills: ['Excel'],
      optional_skills: [],
      experience_requirement: 'Entry',
      technical_complexity: 'Low',
      estimated_hours: 2,
      step_count: 2,
      communication_level: 'Low',
      deadline_pressure: 'High', // High deadline pressure
      budget_quality: 'High',
      client_expectations: 'Fast turnaround',
      analyzed_at: new Date().toISOString()
    };

    // Profile with heavy weight on deadline
    const deadlineSensitiveProfile: UserCapabilityProfile = {
      ...mockProfile,
      preferences: {
        ...mockProfile.preferences,
        difficulty_weights: {
          ...DEFAULT_DIFFICULTY_WEIGHTS,
          deadline: 50 // 50% weight on deadline
        }
      }
    };

    const normalResult = DifficultyCalculator.calculate(job, analysis, mockProfile);
    const deadlineResult = DifficultyCalculator.calculate(job, analysis, deadlineSensitiveProfile);

    assert.ok(
      deadlineResult.score < normalResult.score,
      'When user weights deadline heavily, high deadline pressure should significantly reduce ease score'
    );
  });
});
