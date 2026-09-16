import React, { useState, useEffect } from 'react';
import {
  Bot,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Save,
  Check,
  FileText
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Automation Engine & Hard Safety Controls
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict boundaries, user control, and emergency protections for autonomous operations.
          </p>
        </div>

        {/* Global Stop Automation Button */}
        <button
          onClick={onEmergencyStop}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 transition animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>STOP AUTOMATION (KILL SWITCH)</span>
        </button>
      </div>

      {/* Mode Selector Card */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Application Mode Selection</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Mode 1: Alert Only */}
          <div
            onClick={() => setMode('MANUAL')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              mode === 'MANUAL'
                ? 'bg-sky-600/15 border-sky-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>Mode 1: Alert Only</span>
              {mode === 'MANUAL' && <Check className="w-4 h-4 text-sky-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Finds and scores opportunities, sends notifications. Zero proposal submissions without explicit action.
            </p>
          </div>

          {/* Mode 2: Assisted */}
          <div
            onClick={() => setMode('ASSISTED')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              mode === 'ASSISTED'
                ? 'bg-sky-600/15 border-sky-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>Mode 2: Assisted Mode</span>
              {mode === 'ASSISTED' && <Check className="w-4 h-4 text-sky-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AI crafts proposal drafts and passes claim verification, but requires explicit human approval before submitting.
            </p>
          </div>

          {/* Mode 3: Automatic */}
          <div
            onClick={() => setMode('AUTOMATIC')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              mode === 'AUTOMATIC'
                ? 'bg-emerald-600/15 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>Mode 3: Automatic Mode</span>
              {mode === 'AUTOMATIC' && <Check className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Submits proposals automatically strictly when all safety limits and score thresholds below are satisfied.
            </p>
          </div>
        </div>
      </div>

      {/* Hard Safety Bounds Grid */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Hard Safety Controls & Guardrails</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Max Applications / Day:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxDaily}
              onChange={e => setMaxDaily(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Applied today: {settings.applications_today_count}
            </span>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Max Applications / Hour:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={maxHourly}
              onChange={e => setMaxHourly(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Minimum Match Score:</label>
            <input
              type="number"
              min="70"
              max="99"
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Max Connects / Application:</label>
            <input
              type="number"
              min="1"
              max="16"
              value={maxCost}
              onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={lowRiskOnly}
              onChange={e => setLowRiskOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="font-medium">Require Low-Risk jobs only (block Medium and High risk opportunities)</span>
          </label>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Saved!' : 'Save Safety Limits'}</span>
          </button>
        </div>
      </div>

      {/* Safety Audit Trail Table */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Automation Evaluation & Audit Log</span>
          </h3>
          <span className="text-xs text-slate-400">{auditLogs.length} audit records</span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-medium">Timestamp</th>
                <th className="py-2.5 px-4 font-medium">Action</th>
                <th className="py-2.5 px-4 font-medium">Evaluation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    No automated actions recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((l, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-4 font-mono text-slate-400">
                      {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white">{l.action}</td>
                    <td className="py-2.5 px-4 text-slate-400">{l.details?.message || JSON.stringify(l.details)}</td>
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
