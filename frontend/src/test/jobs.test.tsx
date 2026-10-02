import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobsView } from '../components/jobs/JobsView.js';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal.js';
import { ToastProvider } from '../components/common/Toast.js';
import { api } from '../services/api.js';
import {
  mockStandardJob,
  mockEdgeCaseJob,
  mockSavedJob,
  mockProposals
} from './fixtures.js';

vi.mock('../services/api.js', () => ({
  api: {
    generateProposals: vi.fn()
  }
}));

describe('Jobs Catalog & Job Details Modal Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('JobsView Component', () => {
    it('renders list of jobs with scores, tags, and search input', () => {
      const handleViewJob = vi.fn();
      const handleSaveJob = vi.fn();
      const handleIgnoreJob = vi.fn();
      const handleRemoveAction = vi.fn();

      render(
        <JobsView
          jobs={[mockStandardJob, mockEdgeCaseJob, mockSavedJob]}
          onViewJob={handleViewJob}
          onSaveJob={handleSaveJob}
          onIgnoreJob={handleIgnoreJob}
          onRemoveAction={handleRemoveAction}
          filterStatus="active"
        />
      );

      // Title & Job count
      expect(screen.getByText('Opportunities Catalog')).toBeInTheDocument();
      expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();

      // Search filtering
      const searchInput = screen.getByPlaceholderText(/Search by keywords/i);
      fireEvent.change(searchInput, { target: { value: 'React & Node' } });
      expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();
      expect(screen.queryByText(mockSavedJob.title)).not.toBeInTheDocument();

      // Clear search
      const clearBtn = screen.getByTitle('Clear search');
      fireEvent.click(clearBtn);
      expect(screen.getByText(mockSavedJob.title)).toBeInTheDocument();
    });

    it('filters jobs by score pill (High Match vs Possible)', () => {
      render(
        <JobsView
          jobs={[mockStandardJob, mockEdgeCaseJob]}
          onViewJob={vi.fn()}
          onSaveJob={vi.fn()}
          onIgnoreJob={vi.fn()}
          onRemoveAction={vi.fn()}
          filterStatus="active"
        />
      );

      // Click High Match filter (score >= 85)
      fireEvent.click(screen.getByText(/High Match \(≥85\)/i));
      expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();

      // Click Reset Filters
      const resetBtn = screen.getByText('Reset Filters');
      fireEvent.click(resetBtn);
    });

    it('handles bookmark saving and removing actions', () => {
      const handleSaveJob = vi.fn();
      const handleRemoveAction = vi.fn();

      render(
        <JobsView
          jobs={[mockStandardJob, mockSavedJob]}
          onViewJob={vi.fn()}
          onSaveJob={handleSaveJob}
          onIgnoreJob={vi.fn()}
          onRemoveAction={handleRemoveAction}
          filterStatus="active"
        />
      );

      // Bookmark standard job (not saved)
      const unsavedBtn = screen.getByTitle('Save opportunity');
      fireEvent.click(unsavedBtn);
      expect(handleSaveJob).toHaveBeenCalledWith(mockStandardJob.id);

      // Bookmark saved job (already saved)
      const savedBtn = screen.getByTitle('Remove from saved');
      fireEvent.click(savedBtn);
      expect(handleRemoveAction).toHaveBeenCalledWith(mockSavedJob.id);
    });

    it('opens ignore reason modal and submits ignore feedback', () => {
      const handleIgnoreJob = vi.fn();

      render(
        <JobsView
          jobs={[mockStandardJob]}
          onViewJob={vi.fn()}
          onSaveJob={vi.fn()}
          onIgnoreJob={handleIgnoreJob}
          onRemoveAction={vi.fn()}
          filterStatus="active"
        />
      );

      // Click Dismiss
      fireEvent.click(screen.getByText('Dismiss'));
      expect(screen.getByText('Why are you ignoring this job?')).toBeInTheDocument();

      // Select a reason
      const reasonRadio = screen.getByLabelText('Too low budget');
      fireEvent.click(reasonRadio);

      // Confirm
      fireEvent.click(screen.getByText('Record Feedback & Ignore'));
      expect(handleIgnoreJob).toHaveBeenCalledWith(mockStandardJob.id, 'Too low budget');
    });

    it('displays empty state when search matches no jobs', () => {
      render(
        <JobsView
          jobs={[mockStandardJob]}
          onViewJob={vi.fn()}
          onSaveJob={vi.fn()}
          onIgnoreJob={vi.fn()}
          onRemoveAction={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search by keywords/i);
      fireEvent.change(searchInput, { target: { value: 'NonexistentKeywordXYZ' } });

      expect(screen.getByText('No jobs match your filter criteria.')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Clear All Filters'));
      expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();
    });
  });

  describe('JobDetailsModal Component', () => {
    it('renders full opportunity analysis, score breakdown, and risk assessment', () => {
      const handleClose = vi.fn();
      const handleSaveJob = vi.fn();
      const handleApply = vi.fn();

      render(
        <ToastProvider>
          <JobDetailsModal
            job={mockStandardJob}
            onClose={handleClose}
            onSaveJob={handleSaveJob}
            onApply={handleApply}
            applicationMode="MANUAL"
          />
        </ToastProvider>
      );

      expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();
      expect(screen.getByText('Multi-Dimensional Match Architecture')).toBeInTheDocument();
      expect(screen.getByText(/Security & Scam Assessment/)).toBeInTheDocument();
      expect(screen.getByText('Original Job Description')).toBeInTheDocument();
      expect(screen.getByText(mockStandardJob.description)).toBeInTheDocument();

      // Required skills badges
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();

      // Save opportunity button
      fireEvent.click(screen.getByText('Save Opportunity'));
      expect(handleSaveJob).toHaveBeenCalledWith(mockStandardJob.id);

      // Close modal
      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      fireEvent.click(closeButtons[0]);
      expect(handleClose).toHaveBeenCalled();
    });

    it('generates proposal variants, displays claim verification, and allows editing & dispatch', async () => {
      (api.generateProposals as any).mockResolvedValue(mockProposals);
      const handleApply = vi.fn();

      render(
        <ToastProvider>
          <JobDetailsModal
            job={mockStandardJob}
            onClose={vi.fn()}
            onSaveJob={vi.fn()}
            onApply={handleApply}
            applicationMode="ASSISTED"
          />
        </ToastProvider>
      );

      // Click Draft Proposal button
      const draftBtn = screen.getByRole('button', { name: /draft proposal/i });
      fireEvent.click(draftBtn);

      await waitFor(() => {
        expect(api.generateProposals).toHaveBeenCalledWith(mockStandardJob.id);
        expect(screen.getByText('Personalized Proposal Variants')).toBeInTheDocument();
        expect(screen.getByText('Strict Claim Verification Audit')).toBeInTheDocument();
        expect(screen.getByText('100% Truthful')).toBeInTheDocument();
      });

      // Switch to variant 2
      fireEvent.click(screen.getByText(/Technical Deep-Dive/i));
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toContain('Hello! Having engineered responsive SPAs');

      // Edit proposal text
      fireEvent.change(textarea, { target: { value: 'Custom tweaked proposal text.' } });
      expect(textarea.value).toBe('Custom tweaked proposal text.');

      // Copy proposal
      const copyBtn = screen.getByText('Copy Proposal');
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Custom tweaked proposal text.');

      // 1-Click Copilot
      const copilotBtn = screen.getByText('1-Click Copilot');
      fireEvent.click(copilotBtn);
      expect(handleApply).toHaveBeenCalledWith(mockStandardJob.id, mockProposals[1].id);
      expect(window.open).toHaveBeenCalledWith(mockStandardJob.url, '_blank', 'noopener,noreferrer');
    });

    it('safely handles edge case job with missing skills and unverified client without crashing', () => {
      render(
        <ToastProvider>
          <JobDetailsModal
            job={mockEdgeCaseJob}
            onClose={vi.fn()}
            onSaveJob={vi.fn()}
            onApply={vi.fn()}
          />
        </ToastProvider>
      );

      expect(screen.getByText(mockEdgeCaseJob.title)).toBeInTheDocument();
      expect(screen.getByText(/Security & Scam Assessment: High/i)).toBeInTheDocument();
      expect(screen.getByText(/Off-platform Telegram redirect/i)).toBeInTheDocument();
    });
  });
});
