# Platform Connector Integration Guide

This guide explains how to extend **WorkMatch AI** with new work platforms (e.g., LinkedIn, Indeed, PeoplePerHour, Toptal) without modifying the AI core, scoring engine, or proposal systems.

---

## 1. The Connector Contract

Every platform connector must implement the `PlatformConnector` interface located in `/backend/src/models/PlatformConnector.ts`:

```typescript
export interface ConnectorCapabilities {
  job_search: boolean;
  job_details: boolean;
  client_details: boolean;
  applications: boolean;
  application_status: boolean;
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
  submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult>;
}
```

---

## 2. Step-by-Step Implementation Guide

### Step 1: Create a Connector Directory
Create a new directory under `/backend/src/connectors/<platform-name>/`:

```bash
mkdir backend/src/connectors/linkedin
```

### Step 2: Implement the Connector Class

```typescript
// backend/src/connectors/linkedin/LinkedInConnector.ts
import {
  PlatformConnector,
  ConnectorCapabilities,
  PlatformConnectionState,
  PlatformJobFilter,
  ApplicationSubmission,
  ApplicationSubmissionResult
} from '../../models/PlatformConnector.js';
import { NormalizedJob, generateJobHash } from '../../models/NormalizedJob.js';

export class LinkedInConnector implements PlatformConnector {
  public readonly platformId = 'linkedin';
  public readonly name = 'LinkedIn Jobs';

  private isConnected: boolean = false;

  public getCapabilities(): ConnectorCapabilities {
    return {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: false, // Declare false if platform disallows automated applications
      application_status: false
    };
  }

  public async getState(): Promise<PlatformConnectionState> {
    return {
      platformId: this.platformId,
      name: this.name,
      status: this.isConnected ? 'CONNECTED' : 'DISCONNECTED',
      mode: process.env.LINKEDIN_CLIENT_ID ? 'LIVE' : 'MOCK',
      capabilities: this.getCapabilities()
    };
  }

  public async authenticate(credentials?: Record<string, unknown>): Promise<boolean> {
    // Authenticate via OAuth 2.0 or store token securely
    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }

  public async getJobs(filter?: PlatformJobFilter): Promise<NormalizedJob[]> {
    // Fetch raw jobs from LinkedIn API, then normalize:
    const rawJobs = await this.fetchRawFromLinkedIn(filter);

    return rawJobs.map(raw => {
      const job: NormalizedJob = {
        id: `linkedin_${raw.id}`,
        platform: 'linkedin',
        platform_job_id: raw.id,
        url: raw.jobUrl,
        title: raw.title,
        description: raw.description,
        category: raw.industry || 'General',
        skills: raw.skills || [],
        budget: {
          type: raw.salaryType || 'fixed',
          min: raw.salaryMin,
          max: raw.salaryMax,
          currency: 'USD'
        },
        experience_level: raw.experienceLevel || 'Intermediate',
        estimated_duration: raw.duration || '',
        deadline: '',
        posted_at: raw.listedAt || new Date().toISOString(),
        client: {
          name: raw.companyName,
          country: raw.location,
          rating: null,
          reviews: null,
          jobs_posted: null,
          jobs_hired: null,
          hire_rate: null
        },
        competition: { proposal_count: raw.numApplicants || 0 },
        communication_requirements: [],
        requirements: raw.skills || [],
        external_links: [],
        source_data: raw,
        collected_at: new Date().toISOString()
      };
      job.hash = generateJobHash(job);
      return job;
    });
  }

  public async getJobDetails(platformJobId: string): Promise<NormalizedJob> {
    // Fetch single job details
    throw new Error('Not implemented');
  }

  public async getClientDetails(clientId: string): Promise<Record<string, unknown>> {
    return {};
  }

  public async getApplicationStatus(applicationId: string): Promise<string> {
    return 'UNKNOWN';
  }

  public async submitApplication(data: ApplicationSubmission): Promise<ApplicationSubmissionResult> {
    return {
      success: false,
      error: 'LinkedIn does not permit programmatic proposal submission. Please apply via web browser.',
      requiresManualReview: true
    };
  }

  private async fetchRawFromLinkedIn(filter?: PlatformJobFilter): Promise<any[]> {
    return [];
  }
}
```

### Step 3: Register in ConnectorRegistry

Open `/backend/src/server.ts` and register the new connector instance:

```typescript
import { LinkedInConnector } from './connectors/linkedin/LinkedInConnector.js';

// Register Connector
ConnectorRegistry.register(new LinkedInConnector());
```

The new platform is now instantly discoverable in the UI, synchronized by background workers, and analyzed by the AI core with zero changes to matching algorithms!
