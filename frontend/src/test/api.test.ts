import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, getAuthToken, setAuthToken } from '../services/api.js';

describe('Frontend API Client Layer', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('manages JWT token in localStorage', () => {
    expect(getAuthToken()).toBeNull();
    expect(api.isAuthenticated()).toBe(false);

    setAuthToken('test_jwt_token_123');
    expect(getAuthToken()).toBe('test_jwt_token_123');
    expect(api.isAuthenticated()).toBe(true);

    api.logout();
    expect(getAuthToken()).toBeNull();
    expect(api.isAuthenticated()).toBe(false);
  });

  it('injects Authorization Bearer header when token is present', async () => {
    setAuthToken('bearer_token_xyz');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, jobs: [], total: 0 })
    });

    await api.getJobs({ limit: 10, platform: 'upwork' });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/jobs?limit=10&platform=upwork',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer bearer_token_xyz'
        })
      })
    );
  });

  it('dispatches workmatch:unauthorized event on 401 response', async () => {
    const unauthorizedSpy = vi.fn();
    window.addEventListener('workmatch:unauthorized', unauthorizedSpy);

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: 'Token expired' })
    });

    await expect(api.getMe()).rejects.toThrow('Token expired');
    expect(unauthorizedSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener('workmatch:unauthorized', unauthorizedSpy);
  });

  it('handles job actions: saveJob, ignoreJob, removeJobAction', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    await api.saveJob('job_1');
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/jobs/job_1/save', expect.objectContaining({ method: 'POST' }));

    await api.ignoreJob('job_1', 'Too difficult');
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/jobs/job_1/ignore', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ reason: 'Too difficult' })
    }));

    await api.removeJobAction('job_1');
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/jobs/job_1/action', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles applications: applyToJob and updateApplicationStatus', async () => {
    const mockApp = { id: 'app_1', status: 'applied' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, application: mockApp })
    });

    const res1 = await api.applyToJob('job_1', 'prop_1', 'assisted');
    expect(res1).toEqual(mockApp);

    const res2 = await api.updateApplicationStatus('app_1', 'interview');
    expect(res2).toEqual(mockApp);
  });

  it('handles automation settings and emergency kill switch', async () => {
    const mockSettings = { emergency_stop: true, application_mode: 'MANUAL' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, settings: mockSettings, message: 'Halted' })
    });

    const res = await api.triggerEmergencyStop();
    expect(res.settings.emergency_stop).toBe(true);
  });

  it('handles auth login, register, and demoLogin and persists token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, token: 'session_token_abc', user: { id: 'usr_1' } })
    });

    const res = await api.login('user@test.com', 'password');
    expect(res.token).toBe('session_token_abc');
    expect(getAuthToken()).toBe('session_token_abc');
  });
});
