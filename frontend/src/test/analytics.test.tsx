import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalyticsView } from '../components/analytics/AnalyticsView.js';
import { mockAnalytics } from './fixtures.js';

describe('AnalyticsView Component & Conversion Intelligence', () => {
  it('renders KPI cards, category breakdown, and persona performance table', () => {
    const handleNavigateToReports = vi.fn();

    render(
      <AnalyticsView
        analytics={mockAnalytics}
        onNavigateToReports={handleNavigateToReports}
      />
    );

    expect(screen.getByText('Performance Analytics & Yield')).toBeInTheDocument();
    expect(screen.getByText('Avg Opportunity Match')).toBeInTheDocument();
    expect(screen.getByText('87.5%')).toBeInTheDocument();

    expect(screen.getByText('Contracts Won (Hired)')).toBeInTheDocument();
    expect(screen.getByText('Opportunities by Niche & Category')).toBeInTheDocument();
    expect(screen.getByText('Proposal Persona Conversion Velocity')).toBeInTheDocument();

    // Persona rows
    expect(screen.getByText('direct')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();

    // Navigate to reports
    const reportBtn = screen.getByText('Generate Statement Audit');
    fireEvent.click(reportBtn);
    expect(handleNavigateToReports).toHaveBeenCalled();
  });
});
