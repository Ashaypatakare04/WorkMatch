/**
 * ============================================================================
 * WORKMATCH UNIVERSAL DASHBOARD VIEW
 * ============================================================================
 *
 * DashboardView is the central cockpit for freelancers:
 * - Real-Time Operational KPIs: High match counts, conversion funnel, connects spent.
 * - Application Mode Switcher: One-click toggle between Manual, Assisted, and Auto-Pilot.
 * - Opportunity Radar: Filters and ranks incoming jobs by calculated match score (≥85%).
 * - Platform Health Monitors: Displays connection status across Upwork, Fiverr, and Freelancer.
 * - Emergency Safety Override: Unmistakable warning banner if kill switch is engaged.
 */

import React from 'react';
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Bot,
  ExternalLink,
  ChevronRight,
  Play
} from 'lucide-react';
import {
  NormalizedJob,
  PlatformConnectionState,
  AutomationSettings,
  AnalyticsSummary
} from '../../types/index.js';
import { MatchScore } from '../common/MatchScore.js';

interface DashboardViewProps {
  jobs: NormalizedJob[];
  platforms: PlatformConnectionState[];
  automationSettings?: AutomationSettings;
  analytics?: AnalyticsSummary;
  onViewJob: (job: NormalizedJob) => void;
  onNavigate: (tab: string) => void;
  onLoadDemo: () => void;
  onUpdateMode: (mode: 'MANUAL' | 'ASSISTED' | 'AUTOMATIC') => void;
  isLoadingDemo: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  platforms,
  automationSettings,
  analytics,
  onViewJob,
  onNavigate,
  onLoadDemo,
  onUpdateMode,
  isLoadingDemo
}) => {
  const metrics = analytics?.metrics;
  const highMatches = jobs.filter(j => (j.score?.overall_score || 0) >= 85);
  const possibleMatches = jobs.filter(j => {
    const s = j.score?.overall_score || 0;
    return s >= 70 && s < 85;
  });

  return (
    <div className="space-y-7 pb-12">
      {/* Top Banner: Emergency alert if active */}
      {automationSettings?.emergency_stop && (
        <div className="p-4.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-red-200">EMERGENCY KILL SWITCH ENGAGED</h3>
              <p className="text-xs text-red-300/75 mt-0.5">All automated applications and submissions have been forcefully paused.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('automation')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition active:scale-95"
          >
            Review Safety Controls
          </button>
        </div>
      )}

      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] relative overflow-hidden shadow-sm">
        {/* Subtle decorative ambient glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-mono font-bold tracking-wider text-[#20D3C2] uppercase mb-1">
            Good day · {jobs.length || 12} opportunities need your attention
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#20D3C2]/10 border border-[#20D3C2]/20 text-xs font-mono font-semibold text-[#20D3C2] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2] animate-pulse"></span>
            DISCOVERY &amp; APPLICATION INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Universal Work Intelligence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            Multi-platform opportunity discovery, multi-criteria match scoring, and truthful proposal generation across Upwork, Fiverr, and Freelancer.
          </p>
        </div>

        {/* 1-Click Demo & Mode Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
          {jobs.length === 0 && (
            <button
              onClick={onLoadDemo}
              disabled={isLoadingDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white dark:text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50 active:scale-95 text-center"
            >
              <Sparkles className="w-4 h-4 text-white dark:text-slate-950 fill-current" />
              <span>{isLoadingDemo ? 'Populating Demo Data...' : 'Load 1-Click Demo Dataset'}</span>
            </button>
          )}

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-surface-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] text-xs">
            <button
              onClick={() => onUpdateMode('MANUAL')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all text-center text-xs ${
                automationSettings?.application_mode === 'MANUAL'
                  ? 'bg-white dark:bg-surface-750 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200 dark:border-white/[0.1]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Manual: Inspect opportunities and proposals yourself"
            >
              Manual
            </button>
            <button
              onClick={() => onUpdateMode('ASSISTED')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all text-center text-xs ${
                automationSettings?.application_mode === 'ASSISTED'
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Assisted: AI prepares proposal, human review required before submit"
            >
              Assisted
            </button>
            <button
              onClick={() => onUpdateMode('AUTOMATIC')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all text-center text-xs ${
                automationSettings?.application_mode === 'AUTOMATIC'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Automatic: Apply within strict configured safety bounds"
            >
              Auto-Pilot
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>High Matches</span>
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.high_matches || highMatches.length}</div>
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold mt-1">Score ≥ 85%</div>
        </div>

        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>Possible</span>
            <div className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.possible_matches || possibleMatches.length}</div>
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold mt-1">Score 70% – 84%</div>
        </div>

        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>Discovered</span>
            <div className="p-1.5 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.jobs_discovered || jobs.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">3 platforms live</div>
        </div>

        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>Applications</span>
            <div className="p-1.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.applications || 0}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">Active tracking</div>
        </div>

        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>Interviews</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.interviews || 0}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{metrics?.hires || 0} contracts won</div>
        </div>

        <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>Connects</span>
            <div className="p-1.5 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5 font-mono">{metrics?.total_connects_spent || 0}</div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 font-medium">~${((metrics?.total_connects_spent || 0) * 0.15).toFixed(2)} USD</div>
        </div>
      </div>

      {/* Main Grid: Opportunities & Connected Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* Left 2 Cols: High Match Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span>Recommended High-Match Opportunities</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                {highMatches.length}
              </span>
            </h2>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Explore all opportunities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {highMatches.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 sm:p-12 text-center space-y-4 border border-slate-200/90 dark:border-white/[0.08]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-surface-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <p className="text-base font-display font-bold text-slate-900 dark:text-white">No high-match opportunities found yet</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect your marketplace accounts (Upwork, Fiverr, Freelancer) or sync live feeds to discover matching projects.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => onNavigate('platforms')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all active:scale-95"
                >
                  Manage Platforms & Feeds
                </button>
                <button
                  onClick={onLoadDemo}
                  disabled={isLoadingDemo}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-750 text-slate-700 dark:text-slate-300 font-display font-semibold text-xs border border-slate-200 dark:border-white/[0.08] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoadingDemo ? 'Loading...' : 'Preview with Sample Data'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {highMatches.slice(0, 5).map(job => {
                const score = job.score?.overall_score || 0;
                return (
                  <div
                    key={job.id}
                    onClick={() => onViewJob(job)}
                    className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2.5 flex-1">
                      {/* Platform & Risk Metadata Pill Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-lg border font-bold ${
                          job.platform === 'upwork'
                            ? 'badge-upwork'
                            : job.platform === 'fiverr'
                            ? 'badge-fiverr'
                            : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/25 font-bold'
                        }`}>
                          {job.platform}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-surface-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/[0.06] font-medium">
                          {job.category}
                        </span>
                        {job.client?.payment_verified && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
                          </span>
                        )}
                        {job.risk?.risk_level === 'High' && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> High Risk
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Upwork/Fiverr metadata footer */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap font-medium">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold font-mono text-sm">
                          {job.budget?.type === 'fixed'
                            ? `$${job.budget?.max || job.budget?.min || 0} Fixed`
                            : `$${job.budget?.min || 0}-$${job.budget?.max || 0}/hr`}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Client: <strong className="text-slate-800 dark:text-slate-200">{job.client?.rating ? `${job.client.rating}★` : 'Verified'}</strong> ({job.client?.country || 'Worldwide'})</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Proposals: <strong className="text-slate-800 dark:text-slate-200">{job.competition?.proposal_count || 0}</strong></span>
                      </div>
                    </div>

                    {/* Match Score Badge & CTA */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 border-slate-200 dark:border-[#22324F] pt-3 sm:pt-0">
                      <MatchScore score={score} breakdown={job.score} size="sm" />
                      <span className="text-xs font-semibold text-[#20D3C2] group-hover:text-[#5EE7DF] transition-colors flex items-center gap-1.5">
                        Draft Proposal <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Connected Platforms & AI Insights */}
        <div className="space-y-6">
          {/* Connected Platforms */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">Platform Connectors</h2>
              <button
                onClick={() => onNavigate('platforms')}
                className="text-xs text-[#20D3C2] hover:text-[#5EE7DF] font-semibold transition"
              >
                Manage Platforms →
              </button>
            </div>

            <div className="space-y-3">
              {platforms.map(p => (
                <div key={p.platformId} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/80 dark:border-[#22324F] hover:border-slate-300 dark:hover:border-[#20D3C2]/40 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-display">{p.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider ${
                        p.mode === 'LIVE'
                          ? 'bg-[#35D07F]/20 text-[#35D07F] border border-[#35D07F]/30'
                          : 'bg-[#20D3C2]/15 text-[#20D3C2] border border-[#20D3C2]/30'
                      }`}>
                        {p.mode === 'MOCK' ? 'Demo connection' : p.mode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {p.capabilities.applications ? '✓ Proposals & Bidding' : '○ Human-reviewed only'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      p.status === 'CONNECTED' ? 'bg-[#35D07F] shadow-sm' : 'bg-slate-400 dark:bg-slate-500'
                    }`}></span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights (Section 19) */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-3.5 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 text-[#20D3C2] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#20D3C2]" />
              <span>AI Insights</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You tend to prefer shorter projects. We're prioritizing opportunities under 10 hours this week.
            </p>
          </div>

          {/* Quick AI Personalization Snapshot & Learning Loop (Section 23) */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-3.5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>Preferences Learned</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#20D3C2]/15 text-[#20D3C2] border border-[#20D3C2]/30">Active</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-white">You usually prefer:</p>
              <p className="text-slate-500 dark:text-slate-400">Short projects · Low communication · Frontend work · Avoid fixed-price under $100</p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.07] flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#20D3C2]" /> Strict Truth Audit
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-[#20D3C2] hover:text-[#5EE7DF] font-semibold transition"
              >
                Review preferences →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
