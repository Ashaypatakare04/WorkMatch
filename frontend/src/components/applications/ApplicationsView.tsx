import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Send,
  Sparkles
} from 'lucide-react';
import { Application } from '../../types/index.js';

interface ApplicationsViewProps {
  applications: Application[];
  onUpdateStatus: (id: string, status: string, notes?: string, outcome?: string) => void;
}

const PIPELINE_COLUMNS: { id: Application['status']; label: string; color: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-sky-500/40 text-sky-400' },
  { id: 'viewed', label: 'Viewed by Client', color: 'border-indigo-500/40 text-indigo-400' },
  { id: 'interview', label: 'Interview Scheduled', color: 'border-amber-500/40 text-amber-400' },
  { id: 'hired', label: 'Hired & Won', color: 'border-emerald-500/40 text-emerald-400' },
  { id: 'rejected', label: 'Rejected / Lost', color: 'border-red-500/40 text-red-400' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'border-slate-500/40 text-slate-400' }
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onUpdateStatus
}) => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const totalConnects = applications.reduce((acc, a) => acc + (a.connect_cost || 0), 0);
  const activeApps = applications.filter(a => a.status === 'applied' || a.status === 'viewed' || a.status === 'interview');
  const hiredApps = applications.filter(a => a.status === 'hired');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Application Pipeline & History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking lifecycle from proposal submission through interview and contract award.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">In Flight: </span>
            <span className="font-bold text-white font-mono">{activeApps.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span>Hired: </span>
            <span className="font-bold font-mono">{hiredApps.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Connects: </span>
            <span className="font-bold text-white font-mono">{totalConnects}</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 min-h-[500px]">
        {PIPELINE_COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-800/25 rounded-2xl border border-slate-800 p-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-2 border-b ${col.color}`}>
                  <span className="text-xs font-bold">{col.label}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="group bg-slate-800/80 hover:bg-slate-700/80 p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold">
                          {app.platform || 'UPWORK'}
                        </span>
                        {app.overall_score && (
                          <span className="font-mono text-emerald-400 font-bold">
                            {app.overall_score}% match
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-sky-300 transition">
                        {app.job_title || 'Opportunity Application'}
                      </h4>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
                        <span>Mode: <strong className="text-slate-300">{app.mode}</strong></span>
                        <span>{app.connect_cost} connects</span>
                      </div>

                      {/* Status Transition Quick Actions */}
                      <div className="pt-2 flex items-center gap-1 border-t border-slate-700/40">
                        {col.id === 'applied' && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onUpdateStatus(app.id, 'interview');
                            }}
                            className="w-full text-center py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-semibold transition"
                          >
                            Mark Interview
                          </button>
                        )}
                        {col.id === 'interview' && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onUpdateStatus(app.id, 'hired', undefined, 'won');
                            }}
                            className="w-full text-center py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold transition"
                          >
                            Mark Hired
                          </button>
                        )}
                        {col.id === 'hired' && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center w-full gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Contract Won
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {selectedApp.platform} Application Details
              </span>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedApp.job_title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Applied on: {new Date(selectedApp.created_at).toLocaleDateString()} via {selectedApp.mode} mode.
              </p>
            </div>

            {selectedApp.proposal_content && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Submitted Proposal:</span>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-sans">
                  {selectedApp.proposal_content}
                </div>
              </div>
            )}

            {/* Change Status Dropdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Update Pipeline Status:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['applied', 'viewed', 'interview', 'hired', 'rejected', 'withdrawn'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, st);
                      setSelectedApp({ ...selectedApp, status: st as any });
                    }}
                    className={`py-1.5 rounded-lg border text-[11px] font-medium transition capitalize ${
                      selectedApp.status === st
                        ? 'bg-sky-600 text-white border-sky-500'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
