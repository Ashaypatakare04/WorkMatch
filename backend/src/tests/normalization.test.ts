import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateJobHash, NormalizedJob } from '../models/NormalizedJob.js';

describe('Job Normalization and Deduplication', () => {
  test('should generate identical hashes for functionally identical jobs with different whitespace', () => {
    const jobA = {
      platform: 'upwork',
      platform_job_id: 'up_123',
      title: 'Data Entry Assistant Needed',
      description: 'Clean up spreadsheet rows and remove duplicates.',
      client: { name: 'Acme Corp' }
    };

    const jobB = {
      platform: 'upwork',
      platform_job_id: 'up_123',
      title: '  Data   Entry Assistant   Needed  ',
      description: 'Clean   up spreadsheet rows and remove duplicates.   ',
      client: { name: 'acme corp ' }
    };

    const hashA = generateJobHash(jobA);
    const hashB = generateJobHash(jobB);

    assert.strictEqual(hashA, hashB, 'Hashes should be identical despite whitespace or case differences');
  });

  test('should generate distinct hashes for different jobs', () => {
    const jobA = {
      platform: 'upwork',
      platform_job_id: 'up_123',
      title: 'Data Entry Assistant Needed',
      description: 'Clean up spreadsheet rows.',
      client: { name: 'Acme Corp' }
    };

    const jobB = {
      platform: 'fiverr',
      platform_job_id: 'fiv_456',
      title: 'Web Research for Real Estate',
      description: 'Find real estate agents in Florida.',
      client: { name: 'Beta LLC' }
    };

    assert.notStrictEqual(generateJobHash(jobA), generateJobHash(jobB));
  });
});
