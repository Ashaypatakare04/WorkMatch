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

const PIPELINE_COLUMNS: { id: Application['status']; label: string; color: string; dotColor: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-t-sky-500 text-sky-400', dotColor: 'bg-sky-400' },
  { id: 'viewed', label: 'Viewed', color: 'border-t-indigo-500 text-indigo-400', dotColor: 'bg-indigo-400' },
  { id: 'interview', label: 'Interviewing', color: 'border-t-amber-500 text-amber-400', dotColor: 'bg-amber-400' },
  { id: 'hired', label: 'Hired & Won', color: 'border-t-emerald-500 text-emerald-400', dotColor: 'bg-emerald-400' },
  { id: 'rejected', label: 'Unsuccessful', color: 'border-t-rose-500 text-rose-400', dotColor: 'bg-rose-400' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'border-t-slate-500 text-slate-400', dotColor: 'bg-slate-400' }
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
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
              Application Pipeline
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {applications.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end opportunity lifecycle tracking from customized submission through client interview and contract award.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl glass-card border border-white/[0.08] flex items-center gap-2">
            <span className="text-slate-400">In Flight: </span>
            <span className="font-extrabold text-white font-mono">{activeApps.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-glow-emerald">
            <span className="font-medium">Contracts Won: </span>
            <span className="font-extrabold font-mono text-emerald-300">{hiredApps.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl glass-card border border-white/[0.08] flex items-center gap-2">
            <span className="text-slate-400">Total Connects: </span>
            <span className="font-extrabold text-white font-mono">{totalConnects}</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 min-h-[520px]">
        {PIPELINE_COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div
              key={col.id}
              className={`glass-card rounded-3xl p-3.5 flex flex-col justify-between border border-white/[0.07] border-t-2 ${col.color}`}
            >
              <div className="space-y-3.5">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                    <span className="text-xs font-display font-bold text-white">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="glass-card glass-card-hover p-3.5 rounded-2xl border border-white/[0.08] cursor-pointer space-y-2.5 group transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-mono uppercase px-2 py-0.5 rounded-md font-bold tracking-wider text-[9px] border ${
                          app.platform === 'upwork' ? 'badge-upwork' : app.platform === 'fiverr' ? 'badge-fiverr' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                        }`}>
                          {app.platform || 'UPWORK'}
                        </span>
                        {app.overall_score && (
                          <span className="font-mono text-emerald-400 font-bold text-[10px]">
                            {app.overall_score}% match
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-display font-semibold text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {app.job_title || 'Opportunity Application'}
                      </h4>

                      <div className="text-[10.5px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.05]">
                        <span>Mode: <strong className="text-slate-200 capitalize">{app.mode}</strong></span>
                        <span className="font-mono text-slate-300">{app.connect_cost} connects</span>
                      </div>

                      {/* Status Transition Quick Actions */}
                      <div className="pt-2 flex items-center gap-1.5 border-t border-white/[0.06]">
                        {col.id === 'applied' && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onUpdateStatus(app.id, 'interview');
                            }}
                            className="w-full text-center py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase transition active:scale-95 shadow-glow-amber"
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
                            className="w-full text-center py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold tracking-wider uppercase transition active:scale-95 shadow-glow-emerald"
                          >
                            Mark Hired
                          </button>
                        )}
                        {col.id === 'hired' && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-center w-full gap-1.5 py-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Contract Won
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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="glass-card border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                {selectedApp.platform} Application Details
              </span>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-surface-800 transition"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-base font-display font-bold text-white leading-snug">{selectedApp.job_title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Applied on: {new Date(selectedApp.created_at).toLocaleDateString()} via <strong className="text-slate-200 capitalize">{selectedApp.mode}</strong> mode.
              </p>
            </div>

            {selectedApp.proposal_content && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-slate-400">Submitted Proposal Content:</span>
                <div className="p-4 rounded-2xl bg-surface-900/90 border border-white/[0.07] text-xs text-slate-200 leading-relaxed max-h-52 overflow-y-auto whitespace-pre-line font-sans shadow-inner">
                  {selectedApp.proposal_content}
                </div>
              </div>
            )}

            {/* Change Status Dropdown */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-mono uppercase text-slate-400">Update Pipeline Status:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['applied', 'viewed', 'interview', 'hired', 'rejected', 'withdrawn'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, st);
                      setSelectedApp({ ...selectedApp, status: st as any });
                    }}
                    className={`py-2 rounded-xl border text-[11px] font-medium transition-all capitalize active:scale-95 ${
                      selectedApp.status === st
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold border-transparent shadow-glow-emerald'
                        : 'bg-surface-800 border-white/[0.08] text-slate-300 hover:text-white hover:border-white/[0.18]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-surface-800 text-slate-200 text-xs font-semibold hover:bg-surface-750 transition"
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
