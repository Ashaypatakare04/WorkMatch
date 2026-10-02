import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AutomationView } from '../components/automation/AutomationView.js';
import { api } from '../services/api.js';
import { mockAutomationSettings } from './fixtures.js';

vi.mock('../services/api.js', () => ({
  api: {
    getAutomationAuditLogs: vi.fn()
  }
}));

describe('AutomationView Component & Safety Governance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getAutomationAuditLogs as any).mockResolvedValue([
      {
        id: 'log_1',
        timestamp: '2026-10-02T09:00:00Z',
        action: 'SUBMIT_PREPARED',
        job_id: 'job_standard_1',
        platform: 'upwork',
        status: 'PASSED',
        reason: 'Score 92% exceeds minimum 85% threshold'
      }
    ]);
  });

  it('renders automation modes, throttles, and triggers kill switch', () => {
    const handleUpdateSettings = vi.fn();
    const handleEmergencyStop = vi.fn();

    render(
      <AutomationView
        settings={mockAutomationSettings}
        onUpdateSettings={handleUpdateSettings}
        onEmergencyStop={handleEmergencyStop}
      />
    );

    expect(screen.getByText('Automation Safety & Boundaries')).toBeInTheDocument();
    expect(screen.getByText('Mode 1: Alert Only')).toBeInTheDocument();
    expect(screen.getByText('Mode 2: Assisted Pilot')).toBeInTheDocument();

    // Trigger emergency kill switch
    const killSwitch = screen.getByText('STOP AUTOMATION (KILL SWITCH)');
    fireEvent.click(killSwitch);
    expect(handleEmergencyStop).toHaveBeenCalledTimes(1);
  });

  it('allows switching operating mode and updating safety rate limits', async () => {
    const handleUpdateSettings = vi.fn();

    render(
      <AutomationView
        settings={mockAutomationSettings}
        onUpdateSettings={handleUpdateSettings}
        onEmergencyStop={vi.fn()}
      />
    );

    // Switch to Mode 1 (Alert Only)
    fireEvent.click(screen.getByText('Mode 1: Alert Only'));

    // Save settings
    const saveBtn = screen.getByRole('button', { name: /save safety limits/i });
    fireEvent.click(saveBtn);

    expect(handleUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        application_mode: 'MANUAL',
        is_active: false
      })
    );
  });

  it('loads and renders audit trail logs', async () => {
    render(
      <AutomationView
        settings={mockAutomationSettings}
        onUpdateSettings={vi.fn()}
        onEmergencyStop={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(api.getAutomationAuditLogs).toHaveBeenCalled();
      expect(screen.getByText(/Score 92% exceeds minimum 85% threshold/i)).toBeInTheDocument();
    });
  });
});
