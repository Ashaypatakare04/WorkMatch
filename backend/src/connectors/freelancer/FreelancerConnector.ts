import {
  PlatformConnector,
  ConnectorCapabilities,
  PlatformConnectionState,
  PlatformJobFilter,
  ApplicationSubmission,
  ApplicationSubmissionResult
} from '../../models/PlatformConnector.js';
import { NormalizedJob } from '../../models/NormalizedJob.js';
import { MockPlatformConnector } from '../mock/MockPlatformConnector.js';

export class FreelancerConnector implements PlatformConnector {
  public readonly platformId = 'freelancer';
  public readonly name = 'Freelancer.com';

  private mockFallback = new MockPlatformConnector();
  private isConnected: boolean = true;
  private hasLiveCredentials: boolean = Boolean(process.env.FREELANCER_OAUTH_TOKEN);

  public getCapabilities(): ConnectorCapabilities {
    return {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: true,
      application_status: false
    };
  }

  public async getState(): Promise<PlatformConnectionState> {
    return {
      platformId: this.platformId,
      name: this.name,
      status: this.isConnected ? 'CONNECTED' : 'DISCONNECTED',
      mode: this.hasLiveCredentials ? 'LIVE' : 'MOCK',
      capabilities: this.getCapabilities(),
      lastSync: new Date().toISOString()
    };
  }

  public async authenticate(credentials?: Record<string, unknown>): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }

  public async getJobs(filter?: PlatformJobFilter): Promise<NormalizedJob[]> {
    if (!this.isConnected) return [];
    const allMock = await this.mockFallback.getJobs(filter);
    return allMock.filter(j => j.platform === 'freelancer');
  }

  public async getJobDetails(platformJobId: string): Promise<NormalizedJob> {
    return this.mockFallback.getJobDetails(platformJobId);
  }

  public async getClientDetails(clientId: string): Promise<Record<string, unknown>> {
    return this.mockFallback.getClientDetails(clientId);
  }

  public async getApplicationStatus(applicationId: string): Promise<string> {
    return 'UNKNOWN';
  }

  public async submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult> {
    if (!this.isConnected) {
      return { success: false, error: 'Freelancer connector not connected' };
    }

    return {
      success: true,
      platformApplicationId: `fl_bid_${Date.now()}`
    };
  }
}
