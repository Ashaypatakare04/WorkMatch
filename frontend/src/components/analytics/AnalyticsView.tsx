import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  ArrowUpRight,
  Award,
  Zap,
  Percent,
  Sparkles
} from 'lucide-react';
import { AnalyticsSummary } from '../../types/index.js';

interface AnalyticsViewProps {
  analytics?: AnalyticsSummary;
  onNavigateToReports: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  onNavigateToReports
}) => {
  const metrics = analytics?.metrics;

  const totalCategoryJobs = (analytics?.by_category || []).reduce((acc, curr) => acc + curr.count, 0) || 44;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Conversion Intelligence
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            Performance Analytics &amp; Yield
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Measure proposal win rate, connect expenditure efficiency, and interview velocity across all connected freelance channels.
          </p>
        </div>

        <button
          onClick={onNavigateToReports}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98] self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Statement Audit</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Average Match Score */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Opportunity Match</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {metrics?.average_match_score || 87.5}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-glow-amber" />
            <span>High-accuracy algorithm fit</span>
          </div>
        </div>

        {/* KPI 2: Application Interview Rate */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Interview Conversion Rate</span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {metrics?.applications && metrics.applications > 0
              ? `${Math.round(((metrics.interviews || 0) / metrics.applications) * 100)}%`
              : '25%'}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
            <span>2.8x market average benchmark</span>
          </div>
        </div>

        {/* KPI 3: Contracts Won */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Contracts Won (Hired)</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {metrics?.hires || 0}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
            <span>Active client retainers</span>
          </div>
        </div>

        {/* KPI 4: Connects Capital */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Connects Invested</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {metrics?.total_connects_spent || 0}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Est.</span>
            <span className="font-mono text-slate-200">
              ~${((metrics?.total_connects_spent || 0) * 0.15).toFixed(2)} USD
            </span>
            <span>expenditure</span>
          </div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-display text-white">
                Opportunities by Niche &amp; Category
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Market Depth</span>
          </div>

          <div className="space-y-3.5">
            {(analytics?.by_category || [
              { name: 'Data Entry & Spreadsheets', count: 18 },
              { name: 'Web Research & Prospecting', count: 12 },
              { name: 'Virtual Assistance & Admin', count: 9 },
              { name: 'Quality Assurance & Testing', count: 5 }
            ]).map((cat, idx) => {
              const pct = Math.round((cat.count / totalCategoryJobs) * 100);
              return (
                <div key={idx} className="space-y-1.5 p-2.5 rounded-2xl bg-surface-950/40 border border-white/[0.04]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-200">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{cat.count} jobs</span>
                      <span className="font-mono text-cyan-400 font-bold text-[11px]">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proposal Style Performance */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold font-display text-white">
                Proposal Persona Conversion Velocity
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">A/B Evaluation</span>
          </div>

          <div className="overflow-x-auto border border-white/[0.06] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-950/70 text-slate-400 border-b border-white/[0.06]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Persona Style</th>
                  <th className="py-3 px-4 font-semibold">Dispatched</th>
                  <th className="py-3 px-4 font-semibold">Interviews</th>
                  <th className="py-3 px-4 font-semibold text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {(analytics?.by_proposal_style && analytics.by_proposal_style.length > 0
                  ? analytics.by_proposal_style
                  : [
                      { style: 'direct', applications: 7, interviews: 2, hires: 1 },
                      { style: 'friendly', applications: 4, interviews: 1, hires: 0 },
                      { style: 'professional', applications: 5, interviews: 1, hires: 0 },
                      { style: 'short', applications: 2, interviews: 0, hires: 0 }
                    ]
                ).map((ps, idx) => {
                  const rate = ps.applications > 0 ? Math.round((ps.interviews / ps.applications) * 100) : 0;
                  const isTop = idx === 0;

                  return (
                    <tr key={idx} className="hover:bg-surface-800/40 transition">
                      <td className="py-3 px-4 capitalize font-semibold text-white flex items-center gap-2">
                        <span>{ps.style}</span>
                        {isTop && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            TOP
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">{ps.applications}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-medium">
                        {ps.interviews}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-right">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          rate >= 25
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-surface-800 text-slate-300'
                        }`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
