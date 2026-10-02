/**
 * ============================================================================
 * WORKMATCH FRONTEND APPLICATION ORCHESTRATOR
 * ============================================================================
 *
 * App.tsx serves as the central root component and state coordinator:
 *
 * 1. Global Navigation & Deep Linking:
 *    - Maps URL hash fragments (#dashboard, #jobs, #automation, etc.) to active views.
 *    - Defaults to the public interactive 'landing' page for new visitors.
 *
 * 2. Enterprise State Architecture:
 *    - Marketplace Opportunities: Normalized jobs, scores, risk flags, and platform feeds.
 *    - Applications Kanban: Tracks pipeline states (Saved, Applied, Interview, Offer, Rejected).
 *    - Automation & Safety: Real-time sync of rate limits, emergency stop, and operating modes.
 *    - User Capability Profile: Verified skills, experience ceiling, and criteria preferences.
 *    - Notifications: Real-time high-match alerts and channel delivery statuses.
 *
 * 3. Security & Safety Circuit Breakers:
 *    - Global Emergency Kill Switch: Halts all automated submissions instantaneously.
 *    - Multi-tenant Session Isolation: Authenticated JWT resolution via `api.getMe()`.
 *
 * 4. Interactive Simulation & Demo Mode:
 *    - 1-click sandbox seeding allowing complete testing without live API keys.
 *    - Real-time in-app Toast feedback system.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { MobileNav } from './components/layout/MobileNav.js';
import { JobDetailsModal } from './components/jobs/JobDetailsModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';
import { ToastProvider, useToast } from './components/common/Toast.js';

// Lazy-loaded views for optimal code-splitting and faster initial page loads
const DashboardView = React.lazy(() => import('./components/dashboard/DashboardView.js').then(m => ({ default: m.DashboardView })));
const JobsView = React.lazy(() => import('./components/jobs/JobsView.js').then(m => ({ default: m.JobsView })));
const ApplicationsView = React.lazy(() => import('./components/applications/ApplicationsView.js').then(m => ({ default: m.ApplicationsView })));
const AnalyticsView = React.lazy(() => import('./components/analytics/AnalyticsView.js').then(m => ({ default: m.AnalyticsView })));
const ReportsView = React.lazy(() => import('./components/reports/ReportsView.js').then(m => ({ default: m.ReportsView })));
const PlatformsView = React.lazy(() => import('./components/platforms/PlatformsView.js').then(m => ({ default: m.PlatformsView })));
const ProfileView = React.lazy(() => import('./components/profile/ProfileView.js').then(m => ({ default: m.ProfileView })));
const AutomationView = React.lazy(() => import('./components/automation/AutomationView.js').then(m => ({ default: m.AutomationView })));
const SettingsView = React.lazy(() => import('./components/settings/SettingsView.js').then(m => ({ default: m.SettingsView })));
const LandingPage = React.lazy(() => import('./components/landing/LandingPage.js').then(m => ({ default: m.LandingPage })));

import {
  NormalizedJob,
  PlatformConnectionState,
  AutomationSettings,
  AnalyticsSummary,
  UserCapabilityProfile,
  NotificationItem,
  Application
} from './types/index.js';
import { api } from './services/api.js';

/**
 * Loading spinner placeholder during asynchronous chunk fetching
 */
function ViewLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium tracking-wide">Loading view...</span>
      </div>
    </div>
  );
}

/**
 * Resolves the initial active tab from the browser window's hash fragment.
 */
const getInitialTab = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'jobs', 'saved', 'applications', 'analytics', 'reports', 'platforms', 'profile', 'automation', 'settings'].includes(hash)) {
      return hash;
    }
  }
  return 'landing';
};

function AppContent() {
  const { success, warning, error, info } = useToast();

  // Navigation & View Routing State
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);

  // Core Data Collections
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [platforms, setPlatforms] = useState<PlatformConnectionState[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings | undefined>(undefined);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | undefined>(undefined);
  const [profile, setProfile] = useState<UserCapabilityProfile | null>(null);
  const [learnedInsights, setLearnedInsights] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Selected job for modal inspection
  const [selectedJob, setSelectedJob] = useState<NormalizedJob | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      if (api.isAuthenticated()) {
        try {
          const user = await api.getMe();
          setCurrentUser(user);
        } catch (err) {
          console.warn('Failed to resolve authenticated session:', err);
          setCurrentUser(null);
        }
      }

      const [jobsRes, platformsRes, appsRes, autoRes, analyticsRes, profRes, learnedRes, notifsRes] =
        await Promise.all([
          api.getJobs({ limit: 50 }),
          api.getPlatforms(),
          api.getApplications(),
          api.getAutomationSettings(),
          api.getAnalytics(),
          api.getProfile(),
          api.getLearnedInsights(),
          api.getNotifications()
        ]);

      setJobs(jobsRes.jobs);
      setPlatforms(platformsRes);
      setApplications(appsRes);
      setAutomationSettings(autoRes);
      setAnalytics(analyticsRes);
      setProfile(profRes);
      setLearnedInsights(learnedRes);
      setNotifications(notifsRes);
    } catch (err) {
      console.error('Error loading initial WorkMatch data:', err);
    }
  };

  useEffect(() => {
    // Process OAuth callback token from query parameter if present
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const oauthToken = searchParams.get('token');
      if (oauthToken) {
        api.setAuthToken(oauthToken);
        const cleanPath = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanPath || '/');
      }
    }

    loadInitialData();

    const handleUnauthorized = () => {
      setCurrentUser(null);
      setIsAuthModalOpen(true);
    };
    window.addEventListener('workmatch:unauthorized', handleUnauthorized);

    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['landing', 'dashboard', 'jobs', 'saved', 'applications', 'analytics', 'reports', 'platforms', 'profile', 'automation', 'settings'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('workmatch:unauthorized', handleUnauthorized);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    success('Welcome to WorkMatch AI', `Signed in as ${user.full_name}`);
    loadInitialData();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    success('Signed Out', 'You have been successfully signed out.');
    loadInitialData();
  };

  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadDemoAndLaunch = async () => {
    await handleLoadDemo();
    handleNavigateTab('dashboard');
  };

  // 1-Click Demo Seed
  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      if (!api.isAuthenticated()) {
        try {
          const demoAuth = await api.demoLogin();
          setCurrentUser(demoAuth.user);
        } catch (err) {
          console.warn('Demo fast login bypass:', err);
        }
      }
      await api.triggerDemoSeed();
      await loadInitialData();
      success('Demo Dataset Seeded', '30 normalized jobs across Upwork, Fiverr, and Freelancer loaded.');
    } catch (err: any) {
      console.error('Failed to seed demo dataset:', err);
      error('Demo Seeding Failed', err.message);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  // Sync platforms
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.syncPlatforms();
      await loadInitialData();
      success('Platforms Synchronized', 'Ingestion feeds refreshed with latest opportunities.');
    } catch (err: any) {
      console.error('Failed to sync platforms:', err);
      error('Sync Failed', err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Global Emergency Stop
  const handleEmergencyStop = async () => {
    try {
      const res = await api.triggerEmergencyStop();
      setAutomationSettings(res.settings);
      warning('KILL SWITCH ENGAGED', 'Automated submissions halted immediately. Switched to manual mode.');
    } catch (err: any) {
      console.error('Failed to engage emergency stop:', err);
      error('Emergency Stop Failed', err.message);
    }
  };

  // Save Job
  const handleSaveJob = async (jobId: string) => {
    try {
      await api.saveJob(jobId);
      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, user_action: 'saved' } : j))
      );
      success('Opportunity Saved', 'Added to your bookmarked pipeline.');
    } catch (err: any) {
      console.error('Failed to save job:', err);
      error('Failed to save job', err.message);
    }
  };

  // Ignore Job
  const handleIgnoreJob = async (jobId: string, reason: string) => {
    try {
      await api.ignoreJob(jobId, reason);
      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, user_action: 'ignored', ignore_reason: reason } : j))
      );
      api.getLearnedInsights().then(res => setLearnedInsights(res));
      success('Feedback Logged', 'Preference weights adjusted based on your feedback.');
    } catch (err: any) {
      console.error('Failed to ignore job:', err);
      error('Failed to ignore job', err.message);
    }
  };

  // Remove Job Action
  const handleRemoveAction = async (jobId: string) => {
    try {
      await api.removeJobAction(jobId);
      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, user_action: null } : j))
      );
    } catch (err: any) {
      console.error('Failed to remove job action:', err);
    }
  };

  // Apply to Job
  const handleApply = async (jobId: string, proposalId?: string) => {
    try {
      await api.applyToJob(jobId, proposalId, automationSettings?.application_mode.toLowerCase() || 'manual');
      const updatedApps = await api.getApplications();
      setApplications(updatedApps);
      const updatedAnalytics = await api.getAnalytics();
      setAnalytics(updatedAnalytics);
      success('Application Tracked', 'Opportunity moved to Applied stage in Kanban.');
    } catch (err: any) {
      console.error('Failed to submit application:', err);
      error('Submission Failed', err.message);
    }
  };

  // Update Application status
  const handleUpdateAppStatus = async (appId: string, status: string, notes?: string, outcome?: string) => {
    try {
      await api.updateApplicationStatus(appId, status, notes, outcome);
      const updated = await api.getApplications();
      setApplications(updated);
      const updatedAnalytics = await api.getAnalytics();
      setAnalytics(updatedAnalytics);
      success('Pipeline Updated', `Application moved to ${status}.`);
    } catch (err: any) {
      console.error('Failed to update application status:', err);
      error('Update Failed', err.message);
    }
  };

  // Mode change
  const handleUpdateMode = async (newMode: 'MANUAL' | 'ASSISTED' | 'AUTOMATIC') => {
    try {
      const updated = await api.updateAutomationSettings({ application_mode: newMode, is_active: newMode === 'AUTOMATIC' });
      setAutomationSettings(updated);
      success('Mode Updated', `Operating mode set to ${newMode}.`);
    } catch (err: any) {
      console.error('Failed to update mode:', err);
      error('Mode Update Failed', err.message);
    }
  };

  const highMatchCount = jobs.filter(j => (j.score?.overall_score || 0) >= 85).length;
  const possibleMatchCount = jobs.filter(j => {
    const s = j.score?.overall_score || 0;
    return s >= 70 && s < 85;
  }).length;
  const activeAppCount = applications.filter(a => a.status !== 'rejected' && a.status !== 'withdrawn').length;

  if (currentTab === 'landing') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<ViewLoading />}>
          <LandingPage
            onLaunchApp={() => handleNavigateTab('dashboard')}
            onLoadDemoAndLaunch={handleLoadDemoAndLaunch}
            isLoadingDemo={isLoadingDemo}
          />
        </Suspense>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* Top Navigation */}
        <Navbar
          automationSettings={automationSettings}
          notifications={notifications}
          currentUser={currentUser}
          onEmergencyStop={handleEmergencyStop}
          onSync={handleSync}
          isSyncing={isSyncing}
          onNavigate={handleNavigateTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        {/* Main Container */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onTabChange={handleNavigateTab}
            highMatchCount={highMatchCount}
            possibleMatchCount={possibleMatchCount}
            activeAppCount={activeAppCount}
          />

          {/* Content View Area */}
          <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            <Suspense fallback={<ViewLoading />}>
              {currentTab === 'dashboard' && (
                <DashboardView
                  jobs={jobs}
                  platforms={platforms}
                  automationSettings={automationSettings}
                  analytics={analytics}
                  onViewJob={setSelectedJob}
                  onNavigate={handleNavigateTab}
                  onLoadDemo={handleLoadDemo}
                  onUpdateMode={handleUpdateMode}
                  isLoadingDemo={isLoadingDemo}
                />
              )}

              {currentTab === 'jobs' && (
                <JobsView
                  jobs={jobs}
                  onViewJob={setSelectedJob}
                  onSaveJob={handleSaveJob}
                  onIgnoreJob={handleIgnoreJob}
                  onRemoveAction={handleRemoveAction}
                  filterStatus="active"
                />
              )}

              {currentTab === 'saved' && (
                <JobsView
                  jobs={jobs}
                  onViewJob={setSelectedJob}
                  onSaveJob={handleSaveJob}
                  onIgnoreJob={handleIgnoreJob}
                  onRemoveAction={handleRemoveAction}
                  filterStatus="saved"
                />
              )}

              {currentTab === 'applications' && (
                <ApplicationsView
                  applications={applications}
                  onUpdateStatus={handleUpdateAppStatus}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  analytics={analytics}
                  onNavigateToReports={() => handleNavigateTab('reports')}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView />
              )}

              {currentTab === 'platforms' && (
                <PlatformsView
                  platforms={platforms}
                  onConnect={async (platformId, creds) => {
                    await api.connectPlatform(platformId, creds);
                    const p = await api.getPlatforms();
                    setPlatforms(p);
                    success('Platform Connected', `${platformId.toUpperCase()} settings saved.`);
                  }}
                  onDisconnect={async platformId => {
                    await api.disconnectPlatform(platformId);
                    const p = await api.getPlatforms();
                    setPlatforms(p);
                    info('Platform Disconnected', `${platformId.toUpperCase()} integration disabled.`);
                  }}
                />
              )}

              {currentTab === 'profile' && profile && (
                <ProfileView
                  profile={profile}
                  learnedInsights={learnedInsights}
                  onUpdateProfile={async updated => {
                    const res = await api.updateProfile(updated);
                    setProfile(res);
                    success('Profile Saved', 'Capability profile updated.');
                  }}
                  onUpdateSkills={async skills => {
                    const res = await api.updateSkills(skills);
                    setProfile(prev => (prev ? { ...prev, skills: res } : null));
                    success('Skills Saved', 'Verified skills inventory updated.');
                  }}
                  onUpdatePreferences={async prefs => {
                    const res = await api.updatePreferences(prefs);
                    setProfile(prev => (prev ? { ...prev, preferences: res } : null));
                    success('Preferences Saved', 'Matching criteria weights saved.');
                  }}
                  onRefreshLearned={async () => {
                    const res = await api.refreshLearnedInsights();
                    setLearnedInsights(res);
                    success('Insights Refreshed', 'Preference patterns updated.');
                  }}
                />
              )}

              {currentTab === 'automation' && automationSettings && (
                <AutomationView
                  settings={automationSettings}
                  onUpdateSettings={async updated => {
                    const res = await api.updateAutomationSettings(updated);
                    setAutomationSettings(res);
                    success('Safety Settings Saved', 'Automation rate limits updated.');
                  }}
                  onEmergencyStop={handleEmergencyStop}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView />
              )}
            </Suspense>
          </main>
        </div>

        {/* Global Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSaveJob={handleSaveJob}
            onApply={handleApply}
            applicationMode={automationSettings?.application_mode}
          />
        )}

        {/* Mobile Navigation Bar & Slide-out Drawer */}
        <MobileNav
          currentTab={currentTab}
          onTabChange={handleNavigateTab}
          highMatchCount={highMatchCount}
          activeAppCount={activeAppCount}
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onClose={() => setIsMobileMenuOpen(false)}
          automationSettings={automationSettings}
          onEmergencyStop={handleEmergencyStop}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </ErrorBoundary>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
