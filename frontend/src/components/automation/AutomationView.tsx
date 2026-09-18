import React, { useState, useEffect } from 'react';
import {
  Bot,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Save,
  Check,
  FileText,
  Sliders,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AutomationSettings } from '../../types/index.js';
import { api } from '../../services/api.js';

interface AutomationViewProps {
  settings: AutomationSettings;
  onUpdateSettings: (settings: Partial<AutomationSettings>) => void;
  onEmergencyStop: () => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  settings,
  onUpdateSettings,
  onEmergencyStop
}) => {
  const [mode, setMode] = useState(settings.application_mode);
  const [maxDaily, setMaxDaily] = useState(settings.max_daily_applications);
  const [maxHourly, setMaxHourly] = useState(settings.max_hourly_applications);
  const [minScore, setMinScore] = useState(settings.min_match_score);
  const [maxCost, setMaxCost] = useState(settings.max_connect_cost);
  const [lowRiskOnly, setLowRiskOnly] = useState(settings.require_low_risk_only);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.getAutomationAuditLogs().then(logs => setAuditLogs(logs)).catch(() => {});
  }, []);

  const handleSave = () => {
    onUpdateSettings({
      application_mode: mode,
      is_active: mode === 'AUTOMATIC',
      max_daily_applications: Number(maxDaily),
      max_hourly_applications: Number(maxHourly),
      min_match_score: Number(minScore),
      max_connect_cost: Number(maxCost),
      require_low_risk_only: lowRiskOnly,
      emergency_stop: false
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Autonomous Governance
            </span>
            <span className="text-xs text-slate-500 font-mono">Fail-Safe Hard Limits</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            Automation Safety &amp; Boundaries
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Configure hard throttles, evaluation thresholds, and fail-safe tripwires. The system can never exceed your declared budgets.
          </p>
        </div>

        {/* Global Stop Automation Button */}
        <button
          onClick={onEmergencyStop}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all duration-200 active:scale-[0.98] border border-red-400/30 animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>STOP AUTOMATION (KILL SWITCH)</span>
        </button>
      </div>

      {/* Mode Selector Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Application Operating Mode
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Step-by-Step Approval Level</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Mode 1: Manual / Alert Only */}
          <div
            onClick={() => setMode('MANUAL')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
              mode === 'MANUAL'
                ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-glow-cyan'
                : 'bg-surface-950/60 border-white/[0.06] text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="font-display text-white text-sm">Mode 1: Alert Only</span>
              {mode === 'MANUAL' && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-surface-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scans 24/7, scores matching opportunities, and sends instant alerts. Zero proposal submissions without explicit human manual click.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-800 text-slate-300">
              100% Observer
            </span>
          </div>

          {/* Mode 2: Assisted */}
          <div
            onClick={() => setMode('ASSISTED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
              mode === 'ASSISTED'
                ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-glow-amber'
                : 'bg-surface-950/60 border-white/[0.06] text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="font-display text-white text-sm">Mode 2: Assisted Pilot</span>
              {mode === 'ASSISTED' && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-surface-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AI pre-drafts tailored proposals and runs truthfulness checks. You review the final text and click &ldquo;Confirm &amp; Send&rdquo;.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Co-Pilot (Recommended)
            </span>
          </div>

          {/* Mode 3: Automatic */}
          <div
            onClick={() => setMode('AUTOMATIC')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
              mode === 'AUTOMATIC'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-glow-emerald'
                : 'bg-surface-950/60 border-white/[0.06] text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="font-display text-white text-sm">Mode 3: Autonomous</span>
              {mode === 'AUTOMATIC' && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-surface-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Submits proposals automatically strictly when every hard safety limit, risk threshold, and budget rule below is fully satisfied.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Autonomous
            </span>
          </div>
        </div>
      </div>

      {/* Hard Safety Bounds Grid */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Hard Safety Guardrails &amp; Rate Limits
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Strict Circuit Breakers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-2">
            <label className="block text-slate-300 font-medium">Max Applications / Day:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxDaily}
              onChange={e => setMaxDaily(Number(e.target.value))}
              className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block font-mono">
              Applied today: {settings.applications_today_count}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-2">
            <label className="block text-slate-300 font-medium">Max Applications / Hour:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={maxHourly}
              onChange={e => setMaxHourly(Number(e.target.value))}
              className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block font-mono">
              Anti-spam throttle
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-2">
            <label className="block text-slate-300 font-medium">Minimum Match Score:</label>
            <input
              type="number"
              min="70"
              max="99"
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block font-mono">
              Threshold to qualify
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-950/50 border border-white/[0.06] space-y-2">
            <label className="block text-slate-300 font-medium">Max Connects / Application:</label>
            <input
              type="number"
              min="1"
              max="16"
              value={maxCost}
              onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full bg-surface-900 border border-white/10 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <span className="text-[10px] text-slate-500 block font-mono">
              Cost per proposal cap
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowRiskOnly}
              onChange={e => setLowRiskOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="font-medium">
              Require Low-Risk jobs only (strictly disqualify Medium and High risk opportunities)
            </span>
          </label>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Guardrails Saved!' : 'Save Safety Limits'}</span>
          </button>
        </div>
      </div>

      {/* Safety Audit Trail Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Automation Evaluation &amp; Safety Audit Log
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} audit records</span>
        </div>

        <div className="overflow-x-auto border border-white/[0.06] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-950/70 text-slate-400 border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Action Triggered</th>
                <th className="py-3 px-4 font-semibold">Evaluation Rationale &amp; Limits Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500 font-mono">
                    No automated safety incidents or actions recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((l, idx) => (
                  <tr key={idx} className="hover:bg-surface-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {l.details?.message || JSON.stringify(l.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
