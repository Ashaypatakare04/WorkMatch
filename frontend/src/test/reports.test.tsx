import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportsView } from '../components/reports/ReportsView.js';
import { api } from '../services/api.js';
import { mockStatementReport } from './fixtures.js';

vi.mock('../services/api.js', () => ({
  api: {
    getStatementReport: vi.fn()
  }
}));

describe('ReportsView Component & Activity Ledger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getStatementReport as any).mockResolvedValue(mockStatementReport);
  });

  it('renders report overview, ledger table, and filters by time range', async () => {
    render(<ReportsView />);

    await waitFor(() => {
      expect(screen.getByText('Work Activity Statement')).toBeInTheDocument();
      expect(screen.getByText(/Statement Period: Last 30 Days/i)).toBeInTheDocument();
      expect(screen.getByText('56 Connects')).toBeInTheDocument();
      expect(screen.getByText('Chronological Activity Ledger')).toBeInTheDocument();
      expect(screen.getByText(mockStatementReport.chronological_events[0].job_title)).toBeInTheDocument();
    });

    // Switch to Last 7 Days
    fireEvent.click(screen.getByText('Last 7 Days'));
    await waitFor(() => {
      expect(api.getStatementReport).toHaveBeenCalledWith('7d');
    });

    // Export CSV button
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });
});
