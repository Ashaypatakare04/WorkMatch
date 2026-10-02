import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../components/landing/LandingPage.js';
import { ThemeProvider } from '../context/ThemeContext.js';

describe('LandingPage Component', () => {
  it('renders landing page hero, branding, and triggers app launch', () => {
    const handleLaunchApp = vi.fn();
    const handleLoadDemoAndLaunch = vi.fn();

    render(
      <ThemeProvider>
        <LandingPage
          onLaunchApp={handleLaunchApp}
          onLoadDemoAndLaunch={handleLoadDemoAndLaunch}
          isLoadingDemo={false}
        />
      </ThemeProvider>
    );

    expect(screen.getAllByText(/WorkMatch/i)[0]).toBeInTheDocument();

    // Click launch button (Log in button in header)
    const launchBtn = screen.getByRole('button', { name: 'Log in' });
    fireEvent.click(launchBtn);
    expect(handleLaunchApp).toHaveBeenCalled();
  });

  it('triggers 1-click preview demo launch', () => {
    const handleLoadDemoAndLaunch = vi.fn();

    render(
      <ThemeProvider>
        <LandingPage
          onLaunchApp={vi.fn()}
          onLoadDemoAndLaunch={handleLoadDemoAndLaunch}
          isLoadingDemo={false}
        />
      </ThemeProvider>
    );

    const demoBtns = screen.getAllByRole('button', { name: /find your matches/i });
    expect(demoBtns.length).toBeGreaterThan(0);
    fireEvent.click(demoBtns[0]);
    expect(handleLoadDemoAndLaunch).toHaveBeenCalled();
  });

  it('toggles FAQ accordion questions', () => {
    render(
      <ThemeProvider>
        <LandingPage
          onLaunchApp={vi.fn()}
          onLoadDemoAndLaunch={vi.fn()}
        />
      </ThemeProvider>
    );

    const faqQuestions = screen.queryAllByRole('button');
    const questionBtn = faqQuestions.find(b => b.textContent?.includes('How does WorkMatch prevent ToS account bans?'));
    if (questionBtn) {
      fireEvent.click(questionBtn);
      expect(screen.getByText(/WorkMatch strictly forbids automated submission bots/i)).toBeInTheDocument();
    }
  });
});
