import crypto from 'node:crypto';

export interface JobBudget {
  type: 'fixed' | 'hourly';
  min: number | null;
  max: number | null;
  currency: string;
}

export interface JobClient {
  name: string;
  country: string;
  rating: number | null;
  reviews: number | null;
  jobs_posted: number | null;
  jobs_hired: number | null;
  hire_rate: number | null;
}

export interface JobCompetition {
  proposal_count: number | null;
}

export interface NormalizedJob {
  id: string;
  platform: string; // 'upwork', 'fiverr', 'freelancer', 'mock'
  platform_job_id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: JobBudget;
  experience_level: 'Entry' | 'Intermediate' | 'Expert' | string;
  estimated_duration: string;
  deadline: string;
  posted_at: string;
  client: JobClient;
  competition: JobCompetition;
  communication_requirements: string[];
  requirements: string[];
  external_links: string[];
  source_data: Record<string, unknown>;
  collected_at: string;
  hash?: string;
}

/**
 * Calculates a content deduplication hash based on platform, platform_job_id,
 * normalized title, description, and client.
 */
export function generateJobHash(job: {
  platform: string;
  platform_job_id: string;
  title: string;
  description: string;
  client?: { name?: string };
}): string {
  const normalizedTitle = job.title.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalizedDesc = job.description.trim().toLowerCase().substring(0, 300).replace(/\s+/g, ' ');
  const clientName = job.client?.name?.trim().toLowerCase() || '';

  const raw = `${job.platform}:${job.platform_job_id}:${normalizedTitle}:${normalizedDesc}:${clientName}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}
