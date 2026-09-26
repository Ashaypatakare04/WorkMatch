import {
  NormalizedJob,
  JobScore,
  Proposal,
  Application,
  UserCapabilityProfile,
  PlatformConnectionState,
  AutomationSettings,
  NotificationItem,
  AnalyticsSummary,
  BankStatementReport
} from '../types/index.js';

const BASE_URL = '/api';
const TOKEN_KEY = 'workmatch_jwt_token';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('workmatch:unauthorized'));
    }
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data;
}

export const api = {
  // Jobs
  async getJobs(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') query.append(k, String(v));
    }
    const res = await request<{ jobs: NormalizedJob[]; total: number }>(`/jobs?${query.toString()}`);
    return res;
  },

  async getJobDetails(id: string) {
    const res = await request<{ job: NormalizedJob; proposals: Proposal[] }>(`/jobs/${id}`);
    return res;
  },

  async saveJob(id: string) {
    return request(`/jobs/${id}/save`, { method: 'POST' });
  },

  async ignoreJob(id: string, reason: string) {
    return request(`/jobs/${id}/ignore`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  async removeJobAction(id: string) {
    return request(`/jobs/${id}/action`, { method: 'DELETE' });
  },

  async generateProposals(jobId: string) {
    const res = await request<{ proposals: Proposal[] }>(`/jobs/${jobId}/proposal`, { method: 'POST' });
    return res.proposals;
  },

  async syncPlatforms() {
    return request('/jobs/sync', { method: 'POST' });
  },

  // Applications
  async getApplications() {
    const res = await request<{ applications: Application[] }>('/applications');
    return res.applications;
  },

  async updateApplicationStatus(id: string, status: string, notes?: string, outcome?: string) {
    const res = await request<{ application: Application }>(`/applications/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes, outcome })
    });
    return res.application;
  },

  async applyToJob(jobId: string, proposalId?: string, mode: string = 'manual') {
    const res = await request<{ application: Application }>('/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, proposal_id: proposalId, mode })
    });
    return res.application;
  },

  // Platforms
  async getPlatforms() {
    const res = await request<{ platforms: PlatformConnectionState[] }>('/platforms');
    return res.platforms;
  },

  async connectPlatform(id: string, credentials: Record<string, any> = {}) {
    return request(`/platforms/${id}/connect`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async disconnectPlatform(id: string) {
    return request(`/platforms/${id}/disconnect`, { method: 'POST' });
  },

  // Profile & Personalization
  async getProfile() {
    const res = await request<{ profile: UserCapabilityProfile }>('/profile');
    return res.profile;
  },

  async updateProfile(profile: Partial<UserCapabilityProfile>) {
    const res = await request<{ profile: UserCapabilityProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
    return res.profile;
  },

  async updateSkills(skills: any[]) {
    const res = await request<{ skills: any[] }>('/profile/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills })
    });
    return res.skills;
  },

  async updatePreferences(preferences: any) {
    const res = await request<{ preferences: any }>('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
    return res.preferences;
  },

  async getLearnedInsights() {
    const res = await request<{ learned: any }>('/profile/learned');
    return res.learned;
  },

  async refreshLearnedInsights() {
    const res = await request<{ learned: any }>('/profile/learned/refresh', { method: 'POST' });
    return res.learned;
  },

  // Automation
  async getAutomationSettings() {
    const res = await request<{ settings: AutomationSettings }>('/automation');
    return res.settings;
  },

  async updateAutomationSettings(settings: Partial<AutomationSettings>) {
    const res = await request<{ settings: AutomationSettings }>('/automation', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    return res.settings;
  },

  async triggerEmergencyStop() {
    const res = await request<{ settings: AutomationSettings; message: string }>('/automation/stop', { method: 'POST' });
    return res;
  },

  async getAutomationAuditLogs() {
    const res = await request<{ logs: any[] }>('/automation/audit');
    return res.logs;
  },

  // Notifications
  async getNotifications() {
    const res = await request<{ notifications: NotificationItem[] }>('/notifications');
    return res.notifications;
  },

  async markNotificationRead(id?: string) {
    return request('/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Analytics & Reports
  async getAnalytics() {
    const res = await request<{ summary: AnalyticsSummary }>('/analytics');
    return res.summary;
  },

  async getStatementReport(range: string = '30d') {
    const res = await request<{ report: BankStatementReport }>(`/reports/statement?range=${range}`);
    return res.report;
  },

  // 1-Click Demo
  async triggerDemoSeed() {
    return request<{ message: string; syncSummary: any }>('/demo/seed', { method: 'POST' });
  },

  // Authentication
  async login(email: string, password: string) {
    const res = await request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) setAuthToken(res.token);
    return res;
  },

  async register(email: string, password: string, fullName: string) {
    const res = await request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName })
    });
    if (res.token) setAuthToken(res.token);
    return res;
  },

  async demoLogin() {
    const res = await request<{ success: boolean; token: string; user: any }>('/auth/demo', {
      method: 'POST'
    });
    if (res.token) setAuthToken(res.token);
    return res;
  },

  async getMe() {
    const res = await request<{ success: boolean; user: any }>('/auth/me');
    return res.user;
  },

  logout() {
    setAuthToken(null);
  },

  isAuthenticated(): boolean {
    return Boolean(getAuthToken());
  }
};
