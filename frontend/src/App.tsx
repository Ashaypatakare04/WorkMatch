import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { DashboardView } from './components/dashboard/DashboardView.js';
import { JobsView } from './components/jobs/JobsView.js';
import { ApplicationsView } from './components/applications/ApplicationsView.js';
import { AnalyticsView } from './components/analytics/AnalyticsView.js';
import { ReportsView } from './components/reports/ReportsView.js';
import { PlatformsView } from './components/platforms/PlatformsView.js';
import { ProfileView } from './components/profile/ProfileView.js';
import { AutomationView } from './components/automation/AutomationView.js';
import { SettingsView } from './components/settings/SettingsView.js';
import { JobDetailsModal } from './components/jobs/JobDetailsModal.js';

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

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [platforms, setPlatforms] = useState<PlatformConnectionState[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings | undefined>(undefined);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | undefined>(undefined);
  const [profile, setProfile] = useState<UserCapabilityProfile | null>(null);
  const [learnedInsights, setLearnedInsights] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Selected job for modal inspection
  const [selectedJob, setSelectedJob] = useState<NormalizedJob | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
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
    loadInitialData();
  }, []);

  // 1-Click Demo Seed
  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      await api.triggerDemoSeed();
      await loadInitialData();
    } catch (err) {
      console.error('Failed to seed demo dataset:', err);
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
    } catch (err) {
      console.error('Failed to sync platforms:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Global Emergency Stop
  const handleEmergencyStop = async () => {
    try {
      const res = await api.triggerEmergencyStop();
      setAutomationSettings(res.settings);
      alert('EMERGENCY KILL SWITCH ACTIVATED: Automated submissions halted.');
    } catch (err) {
      console.error('Failed to engage emergency stop:', err);
    }
  };

  // Save Job
  const handleSaveJob = async (jobId: string) => {
    try {
      await api.saveJob(jobId);
      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, user_action: 'saved' } : j))
      );
    } catch (err) {
      console.error('Failed to save job:', err);
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
    } catch (err) {
      console.error('Failed to ignore job:', err);
    }
  };

  // Remove Job Action
  const handleRemoveAction = async (jobId: string) => {
    try {
      await api.removeJobAction(jobId);
      setJobs(prev =>
        prev.map(j => (j.id === jobId ? { ...j, user_action: null } : j))
      );
    } catch (err) {
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
    } catch (err) {
      console.error('Failed to submit application:', err);
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
    } catch (err) {
      console.error('Failed to update application status:', err);
    }
  };

  // Mode change
  const handleUpdateMode = async (newMode: 'MANUAL' | 'ASSISTED' | 'AUTOMATIC') => {
    try {
      const updated = await api.updateAutomationSettings({ application_mode: newMode, is_active: newMode === 'AUTOMATIC' });
      setAutomationSettings(updated);
    } catch (err) {
      console.error('Failed to update mode:', err);
    }
  };

  const highMatchCount = jobs.filter(j => (j.score?.overall_score || 0) >= 85).length;
  const possibleMatchCount = jobs.filter(j => {
    const s = j.score?.overall_score || 0;
    return s >= 70 && s < 85;
  }).length;
  const activeAppCount = applications.filter(a => a.status !== 'rejected' && a.status !== 'withdrawn').length;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        automationSettings={automationSettings}
        notifications={notifications}
        onEmergencyStop={handleEmergencyStop}
        onSync={handleSync}
        isSyncing={isSyncing}
        onNavigate={setCurrentTab}
      />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          highMatchCount={highMatchCount}
          possibleMatchCount={possibleMatchCount}
          activeAppCount={activeAppCount}
        />

        {/* Content View Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              jobs={jobs}
              platforms={platforms}
              automationSettings={automationSettings}
              analytics={analytics}
              onViewJob={setSelectedJob}
              onNavigate={setCurrentTab}
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
              onNavigateToReports={() => setCurrentTab('reports')}
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
              }}
              onDisconnect={async platformId => {
                await api.disconnectPlatform(platformId);
                const p = await api.getPlatforms();
                setPlatforms(p);
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
              }}
              onUpdateSkills={async skills => {
                const res = await api.updateSkills(skills);
                setProfile(prev => (prev ? { ...prev, skills: res } : null));
              }}
              onUpdatePreferences={async prefs => {
                const res = await api.updatePreferences(prefs);
                setProfile(prev => (prev ? { ...prev, preferences: res } : null));
              }}
              onRefreshLearned={async () => {
                const res = await api.refreshLearnedInsights();
                setLearnedInsights(res);
              }}
            />
          )}

          {currentTab === 'automation' && automationSettings && (
            <AutomationView
              settings={automationSettings}
              onUpdateSettings={async updated => {
                const res = await api.updateAutomationSettings(updated);
                setAutomationSettings(res);
              }}
              onEmergencyStop={handleEmergencyStop}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
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
    </div>
  );
}

export default App;
