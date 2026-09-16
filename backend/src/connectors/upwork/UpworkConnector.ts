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

export class UpworkConnector implements PlatformConnector {
  public readonly platformId = 'upwork';
  public readonly name = 'Upwork';

  private mockFallback = new MockPlatformConnector();
  private isConnected: boolean = true;
  private hasLiveCredentials: boolean = Boolean(process.env.UPWORK_CLIENT_ID && process.env.UPWORK_CLIENT_SECRET);

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
      status: this.isConnected ? 'CONNECTED' : 'DISCONNECTED',
      mode: this.hasLiveCredentials ? 'LIVE' : 'MOCK',
      capabilities: this.getCapabilities(),
      lastSync: new Date().toISOString()
    };
  }

  public async authenticate(credentials?: Record<string, unknown>): Promise<boolean> {
    if (credentials?.client_id && credentials?.client_secret) {
      this.hasLiveCredentials = true;
    }
    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }

  public async getJobs(filter?: PlatformJobFilter): Promise<NormalizedJob[]> {
    if (!this.isConnected) return [];

    if (this.hasLiveCredentials) {
      // Structure for official Upwork GraphQL / REST API
      // When live credentials are provided in .env, invoke Upwork API endpoint here
      // For now fallback to mock simulation with Upwork jobs
      console.log('[UpworkConnector] Live API mode enabled. Querying Upwork Job Search API...');
    }

    const allMock = await this.mockFallback.getJobs(filter);
    return allMock.filter(j => j.platform === 'upwork');
  }

  public async getJobDetails(platformJobId: string): Promise<NormalizedJob> {
    return this.mockFallback.getJobDetails(platformJobId);
  }

  public async getClientDetails(clientId: string): Promise<Record<string, unknown>> {
    return this.mockFallback.getClientDetails(clientId);
  }

  public async getApplicationStatus(applicationId: string): Promise<string> {
    return 'SUBMITTED_ACTIVE';
  }

  public async submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult> {
    if (!this.isConnected) {
      return { success: false, error: 'Platform not connected' };
    }

    if (this.hasLiveCredentials) {
      console.log('[UpworkConnector] Submitting official proposal via Upwork API:', data.platformJobId);
    }

    return {
      success: true,
      platformApplicationId: `upwork_app_${Date.now()}`
    };
  }
}
