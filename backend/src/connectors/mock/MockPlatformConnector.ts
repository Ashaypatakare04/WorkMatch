import {
  PlatformConnector,
  ConnectorCapabilities,
  PlatformConnectionState,
  PlatformJobFilter,
  ApplicationSubmission,
  ApplicationSubmissionResult
} from '../../models/PlatformConnector.js';
import { NormalizedJob, generateJobHash } from '../../models/NormalizedJob.js';
import { SAMPLE_JOBS_DATA } from './sampleJobsData.js';

export class MockPlatformConnector implements PlatformConnector {
  public readonly platformId = 'mock';
  public readonly name = 'WorkMatch Mock Simulator';

  private connected: boolean = true;

  public getCapabilities(): ConnectorCapabilities {
    return {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: true,
      application_status: true
    };
  }

  public async getState(): Promise<PlatformConnectionState> {
    return {
      platformId: this.platformId,
      name: this.name,
      status: this.connected ? 'CONNECTED' : 'DISCONNECTED',
      mode: 'MOCK',
      capabilities: this.getCapabilities(),
      lastSync: new Date().toISOString()
    };
  }

  public async authenticate(credentials?: Record<string, unknown>): Promise<boolean> {
    this.connected = true;
    return true;
  }

  public async disconnect(): Promise<boolean> {
    this.connected = false;
    return true;
  }

  public async getJobs(filter?: PlatformJobFilter): Promise<NormalizedJob[]> {
    const now = new Date().toISOString();
    let jobs: NormalizedJob[] = SAMPLE_JOBS_DATA.map((item, idx) => {
      const id = `mock_job_${item.platform}_${idx + 1}`;
      const job: NormalizedJob = {
        id,
        ...item,
        collected_at: now
      };
      job.hash = generateJobHash(job);
      return job;
    });

    if (filter?.category && filter.category !== 'all') {
      jobs = jobs.filter(j => j.category.toLowerCase().includes(filter.category!.toLowerCase()));
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      jobs = jobs.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
    }

    if (filter?.minBudget) {
      jobs = jobs.filter(j => (j.budget.max || j.budget.min || 0) >= filter.minBudget!);
    }

    if (filter?.limit) {
      jobs = jobs.slice(0, filter.limit);
    }

    return jobs;
  }

  public async getJobDetails(platformJobId: string): Promise<NormalizedJob> {
    const jobs = await this.getJobs();
    const found = jobs.find(j => j.platform_job_id === platformJobId || j.id === platformJobId);
    if (!found) {
      throw new Error(`Mock job ${platformJobId} not found`);
    }
    return found;
  }

  public async getClientDetails(clientId: string): Promise<Record<string, unknown>> {
    return {
      id: clientId,
      verification_status: 'VERIFIED',
      payment_method_verified: true,
      total_spent: '$12,400',
      avg_hourly_paid: '$28.50',
      total_hires: 34
    };
  }

  public async getApplicationStatus(applicationId: string): Promise<string> {
    return 'SUBMITTED_ACTIVE';
  }

  public async submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult> {
    return {
      success: true,
      platformApplicationId: `mock_app_${Date.now()}`
    };
  }
}
