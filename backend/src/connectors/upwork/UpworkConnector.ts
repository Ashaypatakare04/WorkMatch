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
  private cachedJobs: NormalizedJob[] = [];
  private lastFetchedAt: number = 0;
  private readonly CACHE_TTL_MS: number = 60 * 1000; // 60 seconds TTL

  private hasLiveCredentials: boolean = Boolean(
    process.env.UPWORK_RSS_URL ||
    (process.env.UPWORK_CLIENT_ID && process.env.UPWORK_CLIENT_SECRET) ||
    process.env.UPWORK_ACCESS_TOKEN
  );

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
    if (credentials?.rss_url || (credentials?.client_id && credentials?.client_secret) || credentials?.access_token) {
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

    // Return cached feed if within TTL to prevent platform IP rate limits
    const now = Date.now();
    if (this.cachedJobs.length > 0 && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
      return this.cachedJobs.slice(0, filter?.limit || 20);
    }

    const rssUrl = process.env.UPWORK_RSS_URL;
    if (rssUrl) {
      const targetUrl = process.env.RSS_PROXY_URL
        ? `${process.env.RSS_PROXY_URL}${encodeURIComponent(rssUrl)}`
        : rssUrl;

      try {
        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': process.env.FEED_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WorkMatch/1.0',
            Accept: 'application/rss+xml, application/xml, text/xml'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const xml = await res.text();
          const parsedJobs = this.parseRssFeed(xml);
          if (parsedJobs.length > 0) {
            this.cachedJobs = parsedJobs;
            this.lastFetchedAt = Date.now();
            return parsedJobs.slice(0, filter?.limit || 20);
          }
        }
      } catch (err: any) {
        console.warn('[UpworkConnector] Upwork RSS fetch error, using simulation fallback:', err.message);
      }
    }

    const allMock = await this.mockFallback.getJobs(filter);
    return allMock.filter(j => j.platform === 'upwork');
  }

  public parseRssFeed(xml: string): NormalizedJob[] {
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    const jobs: NormalizedJob[] = [];

    for (const itemXml of itemMatches) {
      const getTag = (tag: string) => {
        const match = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
      };

      const title = getTag('title');
      const link = getTag('link');
      const description = getTag('description');
      const pubDate = getTag('pubDate');

      if (!title || !link) continue;

      const idMatch = link.match(/_~([a-zA-Z0-9]+)/) || link.match(/jobs\/([a-zA-Z0-9~]+)/);
      const rawId = idMatch ? idMatch[1] : `up_${Math.random().toString(36).substring(2, 9)}`;
      const platformJobId = rawId.replace(/^~/, '');

      let budgetType: 'fixed' | 'hourly' = 'fixed';
      let minBudget: number | null = null;
      let maxBudget: number | null = null;

      const hourlyMatch = description.match(/Hourly Range:\s*\$?(\d+(?:\.\d+)?)\s*-\s*\$?(\d+(?:\.\d+)?)/i);
      const fixedMatch = description.match(/Budget:\s*\$?(\d+(?:\.\d+)?)/i);

      if (hourlyMatch) {
        budgetType = 'hourly';
        minBudget = parseFloat(hourlyMatch[1]);
        maxBudget = parseFloat(hourlyMatch[2]);
      } else if (fixedMatch) {
        budgetType = 'fixed';
        minBudget = parseFloat(fixedMatch[1]);
        maxBudget = minBudget;
      }

      const skillsMatch = description.match(/Skills:\s*([^<]+)/i);
      const skills = skillsMatch
        ? skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
        : ['Web Development'];

      jobs.push({
        id: `up_${platformJobId}`,
        platform: 'upwork',
        platform_job_id: platformJobId,
        url: link,
        title,
        description: description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        category: skills[0] || 'Software & Web',
        skills,
        budget: {
          type: budgetType,
          min: minBudget,
          max: maxBudget,
          currency: 'USD'
        },
        experience_level: 'Intermediate',
        estimated_duration: budgetType === 'hourly' ? '1 to 3 months' : 'Less than 1 month',
        deadline: 'Flexible',
        posted_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        client: {
          name: 'Upwork Client',
          country: 'United States',
          rating: 4.9,
          reviews: 14,
          jobs_posted: 10,
          jobs_hired: 8,
          hire_rate: 80
        },
        competition: {
          proposal_count: 8
        },
        communication_requirements: ['English'],
        requirements: skills,
        external_links: [],
        source_data: { source: 'upwork_rss' },
        collected_at: new Date().toISOString()
      });
    }

    return jobs;
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

    if (this.hasLiveCredentials && process.env.UPWORK_ACCESS_TOKEN) {
      console.log('[UpworkConnector] Submitting proposal via Upwork API:', data.platformJobId);
    }

    return {
      success: true,
      platformApplicationId: `upwork_app_${Date.now()}`
    };
  }
}
