import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ClaimVerifier } from '../ai/proposals/ClaimVerifier.js';
import { UserCapabilityProfile, DEFAULT_DIFFICULTY_WEIGHTS, DEFAULT_SCORING_THRESHOLDS } from '../models/UserCapabilityProfile.js';

describe('Proposal Claim Verification and Truthfulness Audit', () => {
  const profile: UserCapabilityProfile = {
    user_id: 'user_truth',
    headline: 'Junior Data Specialist',
    bio: 'Experienced in basic data entry and internet research',
    years_experience: 2.0,
    hourly_rate: 20.0,
    availability_hours_per_day: 4,
    availability_days_per_week: 5,
    preferred_working_hours: 'Flexible',
    max_simultaneous_projects: 3,
    skills: [
      { skill_name: 'Data Entry', category: 'Data', proficiency_level: 'Intermediate', years_experience: 2.0, verified: true },
      { skill_name: 'Google Sheets', category: 'Data', proficiency_level: 'Intermediate', years_experience: 1.5, verified: true }
    ],
    preferences: {
      preferred_categories: ['Data Entry'],
      excluded_keywords: [],
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

  test('should pass verification when proposal references verified skills within verified experience bounds', async () => {
    const honestProposal = `Hi there,\n\nI have 2 years of experience working with Data Entry and Google Sheets. I can organize your spreadsheet cleanly and complete it today.\n\nBest regards,`;

    const result = await ClaimVerifier.verify(honestProposal, profile);

    assert.strictEqual(result.verified, true, 'Truthful proposal must pass verification');
    assert.strictEqual(result.unsupported_claims.length, 0);
  });

  test('should flag and reject proposal claiming 8 years of experience when profile has only 2 years', async () => {
    const exaggeratedProposal = `Hi,\n\nI have 8 years of experience in enterprise data architecture and Fortune 500 analytics. Ready to begin.`;

    const result = await ClaimVerifier.verify(exaggeratedProposal, profile);

    assert.strictEqual(result.verified, false, 'Exaggerated proposal must be flagged as unverified');
    assert.ok(
      result.unsupported_claims.some(c => c.toLowerCase().includes('years experience')),
      'Unsupported claims must explicitly list inflated experience years'
    );
  });

  test('should sanitize inflated years back to truthful profile bounds', () => {
    const inflatedProposal = 'I bring 10 years of experience in spreadsheet formatting.';
    const sanitized = ClaimVerifier.sanitize(inflatedProposal, profile);

    assert.ok(
      sanitized.includes('2+ years of experience'),
      `Sanitized output should clamp to verified years, got: "${sanitized}"`
    );
    assert.ok(!sanitized.includes('10 years'));
  });
});
