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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/[0.08] relative overflow-hidden">
        {/* Subtle decorative ambient glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            DISCOVERY & APPLICATION INTELLIGENCE
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            Universal Work Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Multi-platform opportunity discovery, multi-criteria match scoring, and truthful proposal generation across Upwork, Fiverr, and Freelancer.
          </p>
        </div>

        {/* 1-Click Demo & Mode Selector */}
        <div className="flex items-center gap-3 flex-wrap relative z-10">
          {jobs.length === 0 && (
            <button
              onClick={onLoadDemo}
              disabled={isLoadingDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>{isLoadingDemo ? 'Populating Demo Data...' : 'Load 1-Click Demo Dataset'}</span>
            </button>
          )}

          {/* Mode Selector */}
          <div className="flex items-center bg-surface-900/90 p-1.5 rounded-2xl border border-white/[0.08] text-xs">
            <button
              onClick={() => onUpdateMode('MANUAL')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                automationSettings?.application_mode === 'MANUAL'
                  ? 'bg-surface-750 text-white font-semibold shadow-sm border border-white/[0.1]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Manual: Inspect opportunities and proposals yourself"
            >
              Manual (Review)
            </button>
            <button
              onClick={() => onUpdateMode('ASSISTED')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                automationSettings?.application_mode === 'ASSISTED'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Assisted: AI prepares proposal, human review required before submit"
            >
              Assisted
            </button>
            <button
              onClick={() => onUpdateMode('AUTOMATIC')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                automationSettings?.application_mode === 'AUTOMATIC'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Automatic: Apply within strict configured safety bounds"
            >
              Auto-Pilot
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>High Matches</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.high_matches || highMatches.length}</div>
          <div className="text-[10px] font-mono text-amber-400/90 font-medium mt-1">Score ≥ 85%</div>
        </div>

        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Possible</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.possible_matches || possibleMatches.length}</div>
          <div className="text-[10px] font-mono text-cyan-400/90 font-medium mt-1">Score 70% – 84%</div>
        </div>

        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Discovered</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.jobs_discovered || jobs.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">3 platforms live</div>
        </div>

        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Applications</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.applications || 0}</div>
          <div className="text-[10px] text-blue-400/90 font-medium mt-1">Active tracking</div>
        </div>

        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Interviews</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.interviews || 0}</div>
          <div className="text-[10px] text-emerald-400/90 font-medium mt-1">{metrics?.hires || 0} contracts won</div>
        </div>

        <div className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/[0.07]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Connects</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics?.total_connects_spent || 0}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">~${((metrics?.total_connects_spent || 0) * 0.15).toFixed(2)} USD</div>
        </div>
      </div>

      {/* Main Grid: Opportunities & Connected Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Match Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Recommended High-Match Opportunities</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {highMatches.length}
              </span>
            </h2>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
            >
              <span>Explore all opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {highMatches.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center space-y-4 border border-white/[0.07]">
              <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="text-sm font-display font-semibold text-white">No high-match opportunities loaded</p>
                <p className="text-xs text-slate-400 mt-1">Populate the realistic demo dataset with 30 diverse jobs, scores, risk flags, and proposal variants.</p>
              </div>
              <button
                onClick={onLoadDemo}
                disabled={isLoadingDemo}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoadingDemo ? 'Populating...' : 'Load 1-Click Demo Dataset'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {highMatches.slice(0, 5).map(job => {
                const score = job.score?.overall_score || 0;
                return (
                  <div
                    key={job.id}
                    onClick={() => onViewJob(job)}
                    className="glass-card glass-card-hover p-5 rounded-2xl border border-white/[0.07] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Platform & Risk Metadata Pill Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          job.platform === 'upwork'
                            ? 'badge-upwork'
                            : job.platform === 'fiverr'
                            ? 'badge-fiverr'
                            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                        }`}>
                          {job.platform}
                        </span>
                        <span className="text-[11px] text-slate-300 bg-surface-800/80 px-2.5 py-0.5 rounded-md border border-white/[0.06]">
                          {job.category}
                        </span>
                        {job.client?.payment_verified && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Payment Verified
                          </span>
                        )}
                        {job.risk?.risk_level === 'High' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> High Risk
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-sm font-display font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {job.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Upwork/Fiverr metadata footer */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 flex-wrap">
                        <span className="text-emerald-300 font-bold font-mono text-xs">
                          {job.budget.type === 'fixed'
                            ? `$${job.budget.max || job.budget.min || 0} Fixed`
                            : `$${job.budget.min}-$${job.budget.max}/hr`}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>Client: <strong className="text-slate-200">{job.client.rating ? `${job.client.rating}★` : 'Verified'}</strong> ({job.client.country || 'Worldwide'})</span>
                        <span className="text-slate-600">•</span>
                        <span>Proposals: <strong className="text-slate-200">{job.competition.proposal_count || 0}</strong></span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 border-t sm:border-t-0 border-white/[0.05] pt-2 sm:pt-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-glow-emerald/30">
                        <Flame className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono font-extrabold text-sm">{score}</span>
                        <span className="text-[10px] text-emerald-500/80">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium">
                        Draft Proposal <ArrowRight className="w-3 h-3" />
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
          <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-white">Platform Connectors</h2>
              <button
                onClick={() => onNavigate('platforms')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                Manage Platforms →
              </button>
            </div>

            <div className="space-y-2.5">
              {platforms.map(p => (
                <div key={p.platformId} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-900/80 border border-white/[0.05] hover:border-white/[0.1] transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white font-display">{p.name}</span>
                      <span className={`text-[9px] px-2 py-0.2 rounded-full font-mono font-bold tracking-wider ${
                        p.mode === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : p.mode === 'MOCK'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.mode}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {p.capabilities.applications ? '✓ Proposals & Bidding' : '○ Human-reviewed only'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      p.status === 'CONNECTED' ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-slate-500'
                    }`}></span>
                    <span className="text-[11px] text-slate-300 font-medium">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Personalization Snapshot */}
          <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Learned Alignment</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              WorkMatch continuously aligns opportunities with your verified skills: <strong className="text-emerald-300 font-medium">Data Operations</strong>, <strong className="text-cyan-300 font-medium">Productivity Tools</strong>, and <strong className="text-emerald-300 font-medium">Web Research</strong>.
            </p>
            <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Strict Truth Audit
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                Tune Weights →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
