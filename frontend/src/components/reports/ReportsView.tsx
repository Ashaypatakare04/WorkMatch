import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowDown
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
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Work Activity Statement Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological audit ledger of work discovered, proposals, and connection expenditure.
          </p>
        </div>

        {/* Date Filter Pills & Export CSV */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRange(tab.id)}
                className={`px-3 py-1 rounded font-medium transition ${
                  range === tab.id ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Statement Sheet Simulation */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading Statement Ledger...</div>
      ) : report ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-sky-400 font-mono">
                WORKMATCH AI ACTIVITY STATEMENT
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Period: {report.period_label}</h2>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                {report.from_date} to {report.to_date}
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-1 sm:text-right">
              <span className="text-[11px] text-slate-400">Total Connects Invested</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {report.spending_summary.total_connects} Connects
              </div>
              <span className="text-[10px] text-slate-400">
                Est. Cost: ${report.spending_summary.estimated_usd_cost.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Statement Overview Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <span className="text-[11px] text-slate-400">Jobs Discovered</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{report.metrics.jobs_discovered}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <span className="text-[11px] text-slate-400">High Matches</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{report.metrics.high_matches}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <span className="text-[11px] text-slate-400">Applications Sent</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-0.5">{report.metrics.applications}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <span className="text-[11px] text-slate-400">Interviews Won</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{report.metrics.interviews}</div>
            </div>
          </div>

          {/* Qualitative Performance Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-800/20 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Platform Distribution
              </h4>
              <div className="space-y-2 text-xs">
                {report.platform_breakdown.map((p, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{p.name}</span>
                    <span className="font-mono text-white">{p.count} applications</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/20 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Proposal Performance
              </h4>
              <div className="space-y-2 text-xs">
                {report.proposal_performance.map((ps, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{ps.style} Style</span>
                    <span className="font-mono text-emerald-400">
                      {ps.applications} sent → {ps.interviews} interviews ({ps.conversion_rate})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chronological Event Log */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Chronological Activity Ledger</h3>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Timestamp</th>
                    <th className="py-2.5 px-4 font-medium">Platform</th>
                    <th className="py-2.5 px-4 font-medium">Job Title</th>
                    <th className="py-2.5 px-4 font-medium">Action</th>
                    <th className="py-2.5 px-4 font-medium">Match</th>
                    <th className="py-2.5 px-4 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {report.chronological_events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No activity recorded in this time range.
                      </td>
                    </tr>
                  ) : (
                    report.chronological_events.map((evt, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-4 font-mono text-slate-400">
                          {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-4 font-mono uppercase text-slate-300">{evt.platform}</td>
                        <td className="py-2.5 px-4 font-medium text-white max-w-xs truncate">{evt.job_title}</td>
                        <td className="py-2.5 px-4 capitalize font-semibold text-sky-400">{evt.action}</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400">{evt.score}%</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">{evt.cost} Connects</td>
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
