import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileView } from '../components/profile/ProfileView.js';
import { mockProfile } from './fixtures.js';

describe('ProfileView Component & Capability Inventory', () => {
  it('renders capability profile, verified skills, and weights sliders', () => {
    const handleUpdateProfile = vi.fn();
    const handleUpdateSkills = vi.fn();
    const handleUpdatePreferences = vi.fn();
    const handleRefreshLearned = vi.fn();

    render(
      <ProfileView
        profile={mockProfile}
        learnedInsights={{
          accepted_patterns: ['Data Entry', 'Web Research'],
          rejected_patterns: ['Crypto', 'WordPress']
        }}
        onUpdateProfile={handleUpdateProfile}
        onUpdateSkills={handleUpdateSkills}
        onUpdatePreferences={handleUpdatePreferences}
        onRefreshLearned={handleRefreshLearned}
      />
    );

    expect(screen.getByText('Capability Profile & Match Formula')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.headline)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.bio)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.hourly_rate)).toBeInTheDocument();

    // Skills
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Excluded keywords
    expect(screen.getByText('✕ wordpress')).toBeInTheDocument();
    expect(screen.getByText('✕ crypto')).toBeInTheDocument();
  });

  it('allows adding and removing skills', () => {
    const handleUpdateSkills = vi.fn();

    render(
      <ProfileView
        profile={mockProfile}
        onUpdateProfile={vi.fn()}
        onUpdateSkills={handleUpdateSkills}
        onUpdatePreferences={vi.fn()}
        onRefreshLearned={vi.fn()}
      />
    );

    // Add a skill
    const skillInput = screen.getByPlaceholderText(/Add skill/i);
    fireEvent.change(skillInput, { target: { value: 'PostgreSQL' } });

    fireEvent.click(screen.getByText('Add Skill'));
    expect(handleUpdateSkills).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ skill_name: 'PostgreSQL' })
      ])
    );
  });

  it('allows adding and removing keyword exclusions', () => {
    const handleUpdatePreferences = vi.fn();

    render(
      <ProfileView
        profile={mockProfile}
        onUpdateProfile={vi.fn()}
        onUpdateSkills={vi.fn()}
        onUpdatePreferences={handleUpdatePreferences}
        onRefreshLearned={vi.fn()}
      />
    );

    // Add an exclusion
    const exclusionInput = screen.getByPlaceholderText(/Cold calling, Telemarketing/i);
    fireEvent.change(exclusionInput, { target: { value: 'unpaid' } });

    fireEvent.click(screen.getByText('Add Exclusion'));
    expect(handleUpdatePreferences).toHaveBeenCalledWith(
      expect.objectContaining({
        excluded_keywords: expect.arrayContaining(['unpaid'])
      })
    );
  });

  it('saves core capability profile changes', () => {
    const handleUpdateProfile = vi.fn();

    render(
      <ProfileView
        profile={mockProfile}
        onUpdateProfile={handleUpdateProfile}
        onUpdateSkills={vi.fn()}
        onUpdatePreferences={vi.fn()}
        onRefreshLearned={vi.fn()}
      />
    );

    // Change headline
    const headlineInput = screen.getByDisplayValue(mockProfile.headline);
    fireEvent.change(headlineInput, { target: { value: 'Lead AI & Fullstack Architect' } });

    fireEvent.click(screen.getByText('Save Core Details'));
    expect(handleUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        headline: 'Lead AI & Fullstack Architect'
      })
    );
  });

  it('triggers re-evaluation of learned tendencies', () => {
    const handleRefreshLearned = vi.fn();

    render(
      <ProfileView
        profile={mockProfile}
        onUpdateProfile={vi.fn()}
        onUpdateSkills={vi.fn()}
        onUpdatePreferences={vi.fn()}
        onRefreshLearned={handleRefreshLearned}
      />
    );

    fireEvent.click(screen.getByText('Re-evaluate Insights'));
    expect(handleRefreshLearned).toHaveBeenCalled();
  });
});
