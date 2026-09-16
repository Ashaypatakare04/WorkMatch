import { test, describe } from 'node:test';
import assert from 'node:assert';
import { UserRepository } from '../repositories/UserRepository.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { Proposal } from '../models/Proposal.js';

describe('Multi-User Architecture and Data Isolation', () => {
  test('should guarantee complete data isolation between separate users', () => {
    const timestamp = Date.now();
    const userA = `user_alpha_${timestamp}`;
    const userB = `user_beta_${timestamp}`;

    // 1. Create User A and User B
    UserRepository.create({
      id: userA,
      email: `alpha_${timestamp}@example.com`,
      full_name: 'Alice Alpha',
      is_admin: false,
      plan_type: 'personal'
    });

    UserRepository.create({
      id: userB,
      email: `beta_${timestamp}@example.com`,
      full_name: 'Bob Beta',
      is_admin: false,
      plan_type: 'personal'
    });

    // 2. Give User A and User B different skills
    UserRepository.setSkills(userA, [
      { skill_name: 'Python', category: 'Dev', proficiency_level: 'Expert', years_experience: 5, verified: true }
    ]);
    UserRepository.setSkills(userB, [
      { skill_name: 'Graphic Design', category: 'Design', proficiency_level: 'Intermediate', years_experience: 2, verified: true }
    ]);

    const profileA = UserRepository.getProfile(userA);
    const profileB = UserRepository.getProfile(userB);

    assert.strictEqual(profileA?.skills[0].skill_name, 'Python');
    assert.strictEqual(profileB?.skills[0].skill_name, 'Graphic Design');

    // 3. User A creates an application
    const job = JobRepository.listJobs(userA, { limit: 1 }).jobs[0];
    if (job) {
      ApplicationRepository.createOrUpdate({
        job_id: job.id,
        user_id: userA,
        status: 'applied',
        mode: 'manual',
        notes: 'Confidential proposal for User A'
      });

      // Query applications for User B
      const appsForUserB = ApplicationRepository.listByUser(userB);
      assert.ok(
        !appsForUserB.some(a => a.user_id === userA || a.notes.includes('User A')),
        'User B must never see User A applications'
      );
    }
  });
});
