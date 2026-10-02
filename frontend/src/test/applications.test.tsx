import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationsView } from '../components/applications/ApplicationsView.js';
import { mockApplications } from './fixtures.js';

describe('ApplicationsView Component & Pipeline Kanban', () => {
  it('renders Kanban board with all columns and application cards', () => {
    const handleUpdateStatus = vi.fn();

    render(
      <ApplicationsView
        applications={mockApplications}
        onUpdateStatus={handleUpdateStatus}
      />
    );

    // Title & count
    expect(screen.getByText('Application Pipeline Kanban')).toBeInTheDocument();
    expect(screen.getByText('3 Tracked')).toBeInTheDocument();

    // Stats
    expect(screen.getByText('In Flight:')).toBeInTheDocument();
    expect(screen.getByText('Won:')).toBeInTheDocument();
    expect(screen.getByText('Connects:')).toBeInTheDocument();

    // Column headers
    expect(screen.getAllByText('Applied')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Interviewing')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Hired & Won')[0]).toBeInTheDocument();

    // Application cards
    expect(screen.getByText(mockApplications[0].job_title!)).toBeInTheDocument();
    expect(screen.getByText(mockApplications[1].job_title!)).toBeInTheDocument();
    expect(screen.getByText(mockApplications[2].job_title!)).toBeInTheDocument();
  });

  it('allows advancing status directly from card action buttons', () => {
    const handleUpdateStatus = vi.fn();

    render(
      <ApplicationsView
        applications={mockApplications}
        onUpdateStatus={handleUpdateStatus}
      />
    );

    // Click Advance to Interview on the applied card
    const advanceBtn = screen.getByText('Advance to Interview');
    fireEvent.click(advanceBtn);
    expect(handleUpdateStatus).toHaveBeenCalledWith(mockApplications[0].id, 'interview');

    // Click Mark Hired & Won on the interview card
    const markHiredBtn = screen.getByText('Mark Hired & Won');
    fireEvent.click(markHiredBtn);
    expect(handleUpdateStatus).toHaveBeenCalledWith(mockApplications[1].id, 'hired', undefined, 'won');
  });

  it('opens application details modal, allows copying proposal, and changing status', () => {
    const handleUpdateStatus = vi.fn();

    render(
      <ApplicationsView
        applications={mockApplications}
        onUpdateStatus={handleUpdateStatus}
      />
    );

    // Click on the first card to open modal
    fireEvent.click(screen.getByText(mockApplications[0].job_title!));

    expect(screen.getByText(/upwork Application Details/i)).toBeInTheDocument();
    expect(screen.getByText('Submitted Proposal:')).toBeInTheDocument();

    // Copy proposal
    const copyBtn = screen.getByText('Copy Proposal');
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockApplications[0].proposal_content);

    // Update status button inside modal
    const interviewBtn = screen.getByRole('button', { name: 'interview' });
    fireEvent.click(interviewBtn);
    expect(handleUpdateStatus).toHaveBeenCalledWith(mockApplications[0].id, 'interview');

    // Close modal
    fireEvent.click(screen.getByText('Done'));
    expect(screen.queryByText('UPWORK Application Details')).not.toBeInTheDocument();
  });

  it('filters by stage on mobile pill click', () => {
    render(
      <ApplicationsView
        applications={mockApplications}
        onUpdateStatus={vi.fn()}
      />
    );

    // Click on mobile pill for "Interviewing"
    const interviewPill = screen.getByRole('button', { name: /Interviewing/i });
    fireEvent.click(interviewPill);

    // Switch back to "All Stages"
    fireEvent.click(screen.getByRole('button', { name: /All Stages/i }));
  });
});
