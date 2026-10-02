import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardView } from '../components/dashboard/DashboardView.js';
import {
  mockStandardJob,
  mockEdgeCaseJob,
  mockPlatforms,
  mockAutomationSettings,
  mockAnalytics
} from './fixtures.js';

describe('DashboardView Component', () => {
  it('renders all metrics cards, high match opportunities, and connected platforms', () => {
    const handleViewJob = vi.fn();
    const handleNavigate = vi.fn();
    const handleLoadDemo = vi.fn();
    const handleUpdateMode = vi.fn();

    render(
      <DashboardView
        jobs={[mockStandardJob, mockEdgeCaseJob]}
        platforms={mockPlatforms}
        automationSettings={mockAutomationSettings}
        analytics={mockAnalytics}
        onViewJob={handleViewJob}
        onNavigate={handleNavigate}
        onLoadDemo={handleLoadDemo}
        onUpdateMode={handleUpdateMode}
        isLoadingDemo={false}
      />
    );

    // Title & Headlines
    expect(screen.getByText('Universal Work Intelligence')).toBeInTheDocument();

    // Mode Selector buttons
    const manualBtn = screen.getByText('Manual');
    const assistedBtn = screen.getByText('Assisted');
    const autoBtn = screen.getByText('Auto-Pilot');

    expect(manualBtn).toBeInTheDocument();
    expect(assistedBtn).toBeInTheDocument();
    expect(autoBtn).toBeInTheDocument();

    fireEvent.click(autoBtn);
    expect(handleUpdateMode).toHaveBeenCalledWith('AUTOMATIC');

    // Metrics cards
    expect(screen.getByText('High Matches')).toBeInTheDocument();
    expect(screen.getByText('Discovered')).toBeInTheDocument();
    expect(screen.getByText('Connects')).toBeInTheDocument();

    // High match opportunity card
    expect(screen.getByText(mockStandardJob.title)).toBeInTheDocument();

    // Clicking job card triggers onViewJob
    fireEvent.click(screen.getByText(mockStandardJob.title));
    expect(handleViewJob).toHaveBeenCalledWith(mockStandardJob);

    // Platforms list
    expect(screen.getByText('Platform Connectors')).toBeInTheDocument();
    expect(screen.getByText('Upwork')).toBeInTheDocument();
    expect(screen.getByText('Fiverr')).toBeInTheDocument();
    expect(screen.getByText('Freelancer')).toBeInTheDocument();
  });

  it('renders emergency stop lockdown banner when active', () => {
    const handleNavigate = vi.fn();
    render(
      <DashboardView
        jobs={[mockStandardJob]}
        platforms={mockPlatforms}
        automationSettings={{
          ...mockAutomationSettings,
          emergency_stop: true
        }}
        onViewJob={vi.fn()}
        onNavigate={handleNavigate}
        onLoadDemo={vi.fn()}
        onUpdateMode={vi.fn()}
        isLoadingDemo={false}
      />
    );

    expect(screen.getByText('EMERGENCY KILL SWITCH ENGAGED')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Review Safety Controls'));
    expect(handleNavigate).toHaveBeenCalledWith('automation');
  });

  it('renders empty high-match state and provides 1-click preview button', () => {
    const handleLoadDemo = vi.fn();
    const handleNavigate = vi.fn();

    render(
      <DashboardView
        jobs={[]} // Zero jobs
        platforms={mockPlatforms}
        automationSettings={mockAutomationSettings}
        onViewJob={vi.fn()}
        onNavigate={handleNavigate}
        onLoadDemo={handleLoadDemo}
        onUpdateMode={vi.fn()}
        isLoadingDemo={false}
      />
    );

    expect(screen.getByText('No high-match opportunities found yet')).toBeInTheDocument();
    expect(screen.getByText('Load 1-Click Demo Dataset')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Manage Platforms & Feeds'));
    expect(handleNavigate).toHaveBeenCalledWith('platforms');

    fireEvent.click(screen.getByText('Preview with Sample Data'));
    expect(handleLoadDemo).toHaveBeenCalled();
  });
});
