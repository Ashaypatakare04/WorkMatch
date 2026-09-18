import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { BankStatementReport } from '../../types/index.js';
import { api } from '../../services/api.js';

export const ReportsView: React.FC = () => {
  const [range, setRange] = useState<string>('30d');
  const [report, setReport] = useState<BankStatementReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReport = async (selectedRange: string) => {
    setIsLoading(true);
    try {
      const data = await api.getStatementReport(selectedRange);
      setReport(data);
    } catch (err) {
      console.error('Failed to load statement report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(range);
  }, [range]);

  const handleExportCsv = () => {
    window.location.href = `/api/reports/statement/csv?range=${range}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit &amp; Compliance
            </span>
            <span className="text-xs text-slate-500 font-mono">Immutable Ledger</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            Work Activity Statement
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Financial and operational transcript recording opportunities evaluated, connects invested, and proposal audit trails.
          </p>
        </div>

        {/* Date Filter Pills & Export CSV */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center bg-surface-900/90 p-1 rounded-2xl border border-white/10 text-xs shadow-sm overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl font-semibold transition whitespace-nowrap text-xs ${
                range === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 shadow-md shadow-emerald-500/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-slate-200 text-xs font-semibold border border-white/10 transition shadow-sm active:scale-[0.98] w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    {/* Statement Sheet Simulation */}
    {isLoading ? (
      <div className="glass-card rounded-3xl p-12 sm:p-16 text-center border border-white/10 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Compiling Statement Audit Transcript...</p>
      </div>
    ) : report ? (
      <div className="glass-card rounded-3xl p-4 sm:p-6 md:p-9 border border-white/10 space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-emerald-500/5 via-cyan-500/5 to-transparent pointer-events-none" />

          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                  WORKMATCH OFFICIAL LEDGER
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-800 text-slate-400 border border-white/[0.06]">
                  SERIES 2026-A
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-white mt-0.5">
                Statement Period: {report.period_label}
              </h2>
              <div className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{report.from_date}</span>
                <span className="text-slate-600">→</span>
                <span>{report.to_date}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-950/70 border border-emerald-500/20 space-y-1 sm:text-right">
              <span className="text-[11px] text-slate-400 font-medium">Total Connects Invested</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {report.spending_summary.total_connects} Connects
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Est. Direct Cost: ${report.spending_summary.estimated_usd_cost.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Statement Overview Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Jobs Discovered</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                {report.metrics.jobs_discovered}
              </div>
              <span className="text-[10px] text-slate-500">Cross-platform scans</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">High Match Opportunities</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tracking-tight">
                {report.metrics.high_matches}
              </div>
              <span className="text-[10px] text-amber-500/80">≥ 80% capability fit</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Proposals Dispatched</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tracking-tight">
                {report.metrics.applications}
              </div>
              <span className="text-[10px] text-cyan-500/80">Claim audit passed</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Interviews Secured</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                {report.metrics.interviews}
              </div>
              <span className="text-[10px] text-emerald-500/80">Direct client replies</span>
            </div>
          </div>

          {/* Qualitative Performance Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-surface-950/40 border border-white/[0.06] space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Platform Distribution
              </h4>
              <div className="space-y-2.5 text-xs">
                {report.platform_breakdown.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-surface-900/40 border border-white/[0.04]">
                    <span className="font-medium text-slate-200 capitalize">{p.name}</span>
                    <span className="font-mono text-white font-semibold">{p.count} applications</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-950/40 border border-white/[0.06] space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Proposal Performance Breakdown
              </h4>
              <div className="space-y-2.5 text-xs">
                {report.proposal_performance.map((ps, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-surface-900/40 border border-white/[0.04]">
                    <span className="font-medium text-slate-200 capitalize">{ps.style} Style</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {ps.applications} sent → {ps.interviews} interviews ({ps.conversion_rate})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chronological Event Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white">
                Chronological Activity Ledger
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {report.chronological_events.length} Recorded Events
              </span>
            </div>

            <div className="overflow-x-auto border border-white/[0.06] rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-950/70 text-slate-400 border-b border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Platform</th>
                    <th className="py-3 px-4 font-semibold">Job Title</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Score</th>
                    <th className="py-3 px-4 font-semibold text-right">Investment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300">
                  {report.chronological_events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                        No activity recorded in this time range.
                      </td>
                    </tr>
                  ) : (
                    report.chronological_events.map((evt, idx) => (
                      <tr key={idx} className="hover:bg-surface-800/40 transition">
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            evt.platform === 'upwork' ? 'badge-upwork' : 'badge-fiverr'
                          }`}>
                            {evt.platform}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                          {evt.job_title}
                        </td>
                        <td className="py-3 px-4 capitalize font-semibold text-cyan-400 whitespace-nowrap">
                          {evt.action}
                        </td>
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            evt.score >= 80
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {evt.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 text-right whitespace-nowrap">
                          {evt.cost} Connects
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
