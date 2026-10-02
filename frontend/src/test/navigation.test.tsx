import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { MobileNav } from '../components/layout/MobileNav.js';
import { ThemeProvider } from '../context/ThemeContext.js';
import {
  mockAutomationSettings,
  mockNotifications
} from './fixtures.js';

describe('Navigation & Layout UI Components', () => {
  describe('Navbar Component', () => {
    it('renders logo, mode badge, sync button, and notification trigger', () => {
      const handleEmergencyStop = vi.fn();
      const handleSync = vi.fn();
      const handleNavigate = vi.fn();
      const handleOpenAuth = vi.fn();
      const handleLogout = vi.fn();

      render(
        <ThemeProvider>
          <Navbar
            automationSettings={mockAutomationSettings}
            notifications={mockNotifications}
            currentUser={null}
            onEmergencyStop={handleEmergencyStop}
            onSync={handleSync}
            isSyncing={false}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />
        </ThemeProvider>
      );

      // Verify Brand & Navigation
      expect(screen.getByText(/WorkMatch/i)).toBeInTheDocument();
      expect(screen.getByText(/Mode:/)).toBeInTheDocument();
      expect(screen.getByText('ASSISTED')).toBeInTheDocument();

      // Trigger platform sync
      const syncBtn = screen.getByTitle('Synchronize connected work platforms');
      fireEvent.click(syncBtn);
      expect(handleSync).toHaveBeenCalledTimes(1);

      // Check sign in button for guest user
      const signInBtn = screen.getByText('Sign In');
      fireEvent.click(signInBtn);
      expect(handleOpenAuth).toHaveBeenCalledWith('login');
    });

    it('renders emergency lockdown status and kill switch when active', () => {
      const handleEmergencyStop = vi.fn();

      // Automatic mode with Kill Switch button
      const { rerender } = render(
        <ThemeProvider>
          <Navbar
            automationSettings={{
              ...mockAutomationSettings,
              application_mode: 'AUTOMATIC'
            }}
            notifications={[]}
            onEmergencyStop={handleEmergencyStop}
            onSync={vi.fn()}
            isSyncing={false}
            onNavigate={vi.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText(/Auto Apply Active/)).toBeInTheDocument();
      const killSwitchBtn = screen.getByTitle('Activate Emergency Kill Switch');
      fireEvent.click(killSwitchBtn);
      expect(handleEmergencyStop).toHaveBeenCalledTimes(1);

      // Emergency stop engaged banner
      rerender(
        <ThemeProvider>
          <Navbar
            automationSettings={{
              ...mockAutomationSettings,
              emergency_stop: true
            }}
            notifications={[]}
            onEmergencyStop={handleEmergencyStop}
            onSync={vi.fn()}
            isSyncing={false}
            onNavigate={vi.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('EMERGENCY LOCKDOWN ENGAGED')).toBeInTheDocument();
    });

    it('opens notifications dropdown and displays alerts', () => {
      const handleNavigate = vi.fn();
      render(
        <ThemeProvider>
          <Navbar
            notifications={mockNotifications}
            onEmergencyStop={vi.fn()}
            onSync={vi.fn()}
            isSyncing={false}
            onNavigate={handleNavigate}
          />
        </ThemeProvider>
      );

      const notifBtn = screen.getByTitle('Notifications & Job Alerts');
      fireEvent.click(notifBtn);

      expect(screen.getByText('Job Alerts & Insights')).toBeInTheDocument();
      expect(screen.getByText('High Match Opportunity Discovered')).toBeInTheDocument();
      expect(screen.getAllByText(/94%/)[0]).toBeInTheDocument();

      // Navigate to profile criteria
      const viewProfileBtn = screen.getByText(/View capability profile & criteria/i);
      fireEvent.click(viewProfileBtn);
      expect(handleNavigate).toHaveBeenCalledWith('profile');
    });

    it('renders authenticated user menu and logout trigger', () => {
      const handleLogout = vi.fn();
      render(
        <ThemeProvider>
          <Navbar
            currentUser={{ id: 'usr_1', email: 'alex@workmatch.ai', full_name: 'Alex Mercer', is_admin: true }}
            notifications={[]}
            onEmergencyStop={vi.fn()}
            onSync={vi.fn()}
            isSyncing={false}
            onNavigate={vi.fn()}
            onLogout={handleLogout}
          />
        </ThemeProvider>
      );

      const accountBtn = screen.getByTitle('Account Menu');
      expect(accountBtn).toBeInTheDocument();
      expect(screen.getByText('Alex Mercer')).toBeInTheDocument();

      fireEvent.click(accountBtn);
      expect(screen.getByText('Admin')).toBeInTheDocument();

      const signOutBtn = screen.getByText('Sign Out');
      fireEvent.click(signOutBtn);
      expect(handleLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sidebar Component', () => {
    it('renders all navigation tabs and navigates on click', () => {
      const handleTabChange = vi.fn();
      render(
        <Sidebar
          currentTab="dashboard"
          onTabChange={handleTabChange}
          highMatchCount={12}
          possibleMatchCount={5}
          activeAppCount={3}
        />
      );

      expect(screen.getByText('Intelligence Workspace')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Opportunities')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      // Click on another tab
      fireEvent.click(screen.getByText('Activity Reports'));
      expect(handleTabChange).toHaveBeenCalledWith('reports');
    });
  });

  describe('MobileNav Component', () => {
    it('renders bottom mobile navigation bar and toggles drawer', () => {
      const handleTabChange = vi.fn();
      const handleToggle = vi.fn();
      const handleClose = vi.fn();

      render(
        <ThemeProvider>
          <MobileNav
            currentTab="dashboard"
            onTabChange={handleTabChange}
            highMatchCount={5}
            activeAppCount={2}
            isOpen={false}
            onToggle={handleToggle}
            onClose={handleClose}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Apps')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Jobs'));
      expect(handleTabChange).toHaveBeenCalledWith('jobs');

      fireEvent.click(screen.getByText('More'));
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('renders full mobile drawer when open and executes links', () => {
      const handleTabChange = vi.fn();
      const handleClose = vi.fn();
      const handleEmergencyStop = vi.fn();

      render(
        <ThemeProvider>
          <MobileNav
            currentTab="jobs"
            onTabChange={handleTabChange}
            highMatchCount={5}
            activeAppCount={2}
            isOpen={true}
            onToggle={vi.fn()}
            onClose={handleClose}
            automationSettings={mockAutomationSettings}
            onEmergencyStop={handleEmergencyStop}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Navigation Hub')).toBeInTheDocument();
      expect(screen.getByText('Performance Analytics')).toBeInTheDocument();

      // Click analytics inside drawer
      fireEvent.click(screen.getByText('Performance Analytics'));
      expect(handleTabChange).toHaveBeenCalledWith('analytics');
      expect(handleClose).toHaveBeenCalled();

      // Click emergency kill switch in drawer
      const killSwitch = screen.getByText('Stop Automation (Kill Switch)');
      fireEvent.click(killSwitch);
      expect(handleEmergencyStop).toHaveBeenCalledTimes(1);
    });
  });
});
