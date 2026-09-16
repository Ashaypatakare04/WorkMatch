import { NormalizedJob } from './NormalizedJob.js';

export interface ConnectorCapabilities {
  job_search: boolean;
  job_details: boolean;
  client_details: boolean;
  applications: boolean;
  application_status: boolean;
}

export type PlatformMode = 'LIVE' | 'MOCK' | 'UNAVAILABLE';
export type PlatformStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export interface PlatformConnectionState {
  platformId: string;
  name: string;
  status: PlatformStatus;
  mode: PlatformMode;
  capabilities: ConnectorCapabilities;
  lastSync?: string;
  error?: string;
}

export interface PlatformJobFilter {
  category?: string;
  query?: string;
  limit?: number;
  minBudget?: number;
}

export interface ApplicationSubmission {
  platformJobId: string;
  proposalText: string;
  rate?: number;
  estimatedDuration?: string;
  attachments?: string[];
}

export interface ApplicationSubmissionResult {
  success: boolean;
  platformApplicationId?: string;
  error?: string;
  requiresManualReview?: boolean;
}

export interface PlatformConnector {
  readonly platformId: string;
  readonly name: string;
  getCapabilities(): ConnectorCapabilities;
  getState(): Promise<PlatformConnectionState>;
  authenticate(credentials?: Record<string, unknown>): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getJobs(filter?: PlatformJobFilter): Promise<NormalizedJob[]>;
  getJobDetails(platformJobId: string): Promise<NormalizedJob>;
  getClientDetails(clientId: string): Promise<Record<string, unknown>>;
  getApplicationStatus(applicationId: string): Promise<string>;
  submitApplication(applicationData: ApplicationSubmission): Promise<ApplicationSubmissionResult>;
}
