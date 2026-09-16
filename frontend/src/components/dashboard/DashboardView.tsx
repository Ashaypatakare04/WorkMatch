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
    <div className="space-y-6 pb-12">
      {/* Top Banner: Emergency alert if active or welcome demo seed if no jobs */}
      {automationSettings?.emergency_stop && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-sm font-bold text-red-300">EMERGENCY KILL SWITCH ENGAGED</h3>
              <p className="text-xs text-red-200/80">All automated applications and submissions have been forcefully paused.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('automation')}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
          >
            Review Automation Safety Controls
          </button>
        </div>
      )}

      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Universal Work Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discovering, scoring, and drafting truthful proposals across work platforms.
          </p>
        </div>

        {/* 1-Click Demo & Mode Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {jobs.length === 0 && (
            <button
              onClick={onLoadDemo}
              disabled={isLoadingDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/25 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoadingDemo ? 'Loading Demo...' : 'Load 1-Click Demo Dataset'}</span>
            </button>
          )}

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onUpdateMode('MANUAL')}
              className={`px-3 py-1 rounded font-medium transition ${
                automationSettings?.application_mode === 'MANUAL'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Alert Only: Inspect opportunities manually"
            >
              Alert Only (Manual)
            </button>
            <button
              onClick={() => onUpdateMode('ASSISTED')}
              className={`px-3 py-1 rounded font-medium transition ${
                automationSettings?.application_mode === 'ASSISTED'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Assisted: AI prepares proposal, human review required before submit"
            >
              Assisted
            </button>
            <button
              onClick={() => onUpdateMode('AUTOMATIC')}
              className={`px-3 py-1 rounded font-medium transition ${
                automationSettings?.application_mode === 'AUTOMATIC'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Automatic: Apply within strict configured safety bounds"
            >
              Automatic
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>High Matches</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.high_matches || highMatches.length}</div>
          <div className="text-[10px] text-amber-400/80 font-medium mt-1">Score ≥ 85%</div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Possible Matches</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.possible_matches || possibleMatches.length}</div>
          <div className="text-[10px] text-sky-400/80 font-medium mt-1">Score 70% – 84%</div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Discovered</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.jobs_discovered || jobs.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 3 platforms</div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Applications</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.applications || 0}</div>
          <div className="text-[10px] text-cyan-400/80 font-medium mt-1">In active tracking</div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Interviews</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.interviews || 0}</div>
          <div className="text-[10px] text-emerald-400/80 font-medium mt-1">{metrics?.hires || 0} hires won</div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Connects Spent</span>
            <Bot className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics?.total_connects_spent || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1">~${((metrics?.total_connects_spent || 0) * 0.15).toFixed(2)} USD</div>
        </div>
      </div>

      {/* Main Grid: Opportunities & Connected Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Match Opportunities */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Highest Match Opportunities</span>
              <span className="text-xs font-mono font-medium text-slate-400">({highMatches.length})</span>
            </h2>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <span>View all opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {highMatches.length === 0 ? (
            <div className="bg-slate-800/30 rounded-xl border border-slate-800 p-8 text-center space-y-3">
              <p className="text-sm text-slate-400">No high-match opportunities found yet.</p>
              <button
                onClick={onLoadDemo}
                disabled={isLoadingDemo}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
              >
                {isLoadingDemo ? 'Populating...' : 'Populate Sample Jobs & Analytics'}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {highMatches.slice(0, 5).map(job => {
                const score = job.score?.overall_score || 0;
                return (
                  <div
                    key={job.id}
                    onClick={() => onViewJob(job)}
                    className="group bg-slate-800/40 hover:bg-slate-800/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                          {job.platform}
                        </span>
                        <span className="text-[11px] text-slate-400">{job.category}</span>
                        {job.risk?.risk_level === 'High' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            High Risk
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="text-slate-200 font-semibold font-mono">
                          {job.budget.type === 'fixed'
                            ? `$${job.budget.max || job.budget.min || 0} Fixed`
                            : `$${job.budget.min}-$${job.budget.max}/hr`}
                        </span>
                        <span>•</span>
                        <span>Client: {job.client.rating ? `${job.client.rating}★ (${job.client.country})` : 'Unrated'}</span>
                        <span>•</span>
                        <span>{job.competition.proposal_count || 0} proposals</span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <Flame className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono font-bold text-sm">{score}</span>
                        <span className="text-[10px] text-emerald-500">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-sky-400 transition flex items-center gap-0.5">
                        Inspect & Draft <ArrowRight className="w-3 h-3" />
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
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Platform Connectors</h2>
              <button
                onClick={() => onNavigate('platforms')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {platforms.map(p => (
                <div key={p.platformId} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        p.mode === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : p.mode === 'MOCK'
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {p.mode}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {p.capabilities.applications ? '✓ Proposals supported' : '○ Review only'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      p.status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}></span>
                    <span className="text-[11px] text-slate-300">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Personalization Snapshot */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Learned Insights</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your feedback, WorkMatch prioritizes <span className="text-sky-300 font-semibold">Data Entry</span>, <span className="text-sky-300 font-semibold">Excel</span>, and <span className="text-sky-300 font-semibold">Web Research</span> tasks with low communication requirements.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Zero unverified claims policy</span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Tune Preferences →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
