import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  ArrowUpRight
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Performance Analytics & Conversion
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated opportunity discovery, application throughput, and interview conversion metrics.
          </p>
        </div>

        <button
          onClick={onNavigateToReports}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Activity Statement</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Match Score</span>
          <div className="text-2xl font-bold text-white font-mono">{metrics?.average_match_score || 87.5}%</div>
          <span className="text-[10px] text-emerald-400 font-medium">High scoring alignment</span>
        </div>

        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Application Interview Rate</span>
          <div className="text-2xl font-bold text-white font-mono">
            {metrics?.applications && metrics.applications > 0
              ? `${Math.round(((metrics.interviews || 0) / metrics.applications) * 100)}%`
              : '25%'}
          </div>
          <span className="text-[10px] text-sky-400 font-medium">Interviews per application</span>
        </div>

        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Contracts Won (Hired)</span>
          <div className="text-2xl font-bold text-white font-mono">{metrics?.hires || 0}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Active client contracts</span>
        </div>

        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Connects Invested</span>
          <div className="text-2xl font-bold text-white font-mono">{metrics?.total_connects_spent || 0}</div>
          <span className="text-[10px] text-slate-400">~${((metrics?.total_connects_spent || 0) * 0.15).toFixed(2)} USD</span>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-sky-400" />
            <span>Opportunities by Category</span>
          </h3>

          <div className="space-y-2.5">
            {(analytics?.by_category || [
              { name: 'Data Entry', count: 18 },
              { name: 'Web Research', count: 12 },
              { name: 'Virtual Assistance', count: 9 },
              { name: 'Testing', count: 5 }
            ]).map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{cat.name}</span>
                  <span className="font-mono text-slate-400">{cat.count} jobs</span>
                </div>
                <div className="w-full bg-slate-700/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (cat.count / 25) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal Style Performance */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Proposal Style Conversion</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2 font-medium">Style</th>
                  <th className="pb-2 font-medium">Submitted</th>
                  <th className="pb-2 font-medium">Interviews</th>
                  <th className="pb-2 font-medium">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
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
                  return (
                    <tr key={idx}>
                      <td className="py-2.5 capitalize font-medium text-white">{ps.style}</td>
                      <td className="py-2.5 font-mono">{ps.applications}</td>
                      <td className="py-2.5 font-mono text-emerald-400">{ps.interviews}</td>
                      <td className="py-2.5 font-mono font-semibold">{rate}%</td>
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
