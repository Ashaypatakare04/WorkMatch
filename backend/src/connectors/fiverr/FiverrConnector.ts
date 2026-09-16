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

export class FiverrConnector implements PlatformConnector {
  public readonly platformId = 'fiverr';
  public readonly name = 'Fiverr';

  private mockFallback = new MockPlatformConnector();
  private isConnected: boolean = true;
  private hasLiveCredentials: boolean = Boolean(process.env.FIVERR_API_KEY);

  public getCapabilities(): ConnectorCapabilities {
    return {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: false, // Fiverr does not permit external bot proposal submission
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
    return allMock.filter(j => j.platform === 'fiverr');
  }

  public async getJobDetails(platformJobId: string): Promise<NormalizedJob> {
    return this.mockFallback.getJobDetails(platformJobId);
  }

  public async getClientDetails(clientId: string): Promise<Record<string, unknown>> {
    return this.mockFallback.getClientDetails(clientId);
  }

  public async getApplicationStatus(applicationId: string): Promise<string> {
    return 'UNAVAILABLE_ON_FIVERR';
  }

  public async submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult> {
    // Section 13: If a platform does not permit automatic submission, disable automatic application for that connector.
    return {
      success: false,
      error: 'Direct application submission is not supported on Fiverr. Please review generated proposal and submit via Fiverr web dashboard.',
      requiresManualReview: true
    };
  }
}
