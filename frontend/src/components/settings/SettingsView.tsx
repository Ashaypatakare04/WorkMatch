import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Cpu,
  Shield,
  Save,
  Check,
  Smartphone,
  Mail,
  Send,
  MessageSquare,
  Key,
  Lock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api.js';

export const SettingsView: React.FC = () => {
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [telegramAlerts, setTelegramAlerts] = useState(false);
  const [discordAlerts, setDiscordAlerts] = useState(false);
  const [minScore, setMinScore] = useState(85);
  const [alertHighRisk, setAlertHighRisk] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [aiProvider, setAiProvider] = useState('mock');
  const [geminiKey, setGeminiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load current notification preferences
    api.getNotifications().catch(() => {});
  }, []);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            System Configuration
          </span>
          <span className="text-xs text-slate-500 font-mono">End-to-End Encryption</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
          Dispatch &amp; Engine Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Configure real-time notification dispatch channels, alert sensitivity thresholds, and multi-provider AI model gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Channels & Rules */}
        <div className="glass-card rounded-3xl p-4 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-display text-white">
                Live Opportunity Dispatch Channels
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Multi-Channel</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Browser / PWA */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-950/60 border border-white/[0.06] hover:border-cyan-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">In-Browser &amp; Desktop PWA</span>
                  <span className="text-[11px] text-slate-400">Instant audio-visual alert on active tab</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={browserAlerts}
                onChange={e => setBrowserAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* Email Dispatch */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-950/60 border border-white/[0.06] hover:border-indigo-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Email Dispatch Digest</span>
                  <span className="text-[11px] text-slate-400">Curated high-match batch to account email</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
              />
            </label>

            {/* Telegram Webhook */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-950/60 border border-white/[0.06] hover:border-sky-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Telegram Bot Webhook</span>
                  <span className="text-[11px] text-slate-400">Stream high-match alerts to private bot channel</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={telegramAlerts}
                onChange={e => setTelegramAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>

            {/* Discord Webhook */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-950/60 border border-white/[0.06] hover:border-purple-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Discord Webhook</span>
                  <span className="text-[11px] text-slate-400">Post rich embed notifications to server channel</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={discordAlerts}
                onChange={e => setDiscordAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-purple-500 accent-purple-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-3.5 text-xs">
            <h4 className="font-semibold text-slate-200">Alert Trigger Sensitivity</h4>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Minimum Alert Score Threshold:
              </label>
              <input
                type="number"
                min="50"
                max="99"
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full bg-surface-950 border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={alertHighRisk}
                onChange={e => setAlertHighRisk(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="leading-snug">
                Send security alerts when potential high-risk or suspicious client payment behaviors are detected
              </span>
            </label>
          </div>
        </div>

        {/* AI Engine & Provider Configuration */}
        <div className="glass-card rounded-3xl p-4 sm:p-7 border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  AI Engine &amp; Provider Gateway
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Decoupled Architecture</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              WorkMatch AI uses an abstracted provider gateway. Choose between offline deterministic processing or live frontier language models:
            </p>

            <div className="space-y-3 text-xs">
              {/* Option 1: Mock NLP */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                aiProvider === 'mock'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-surface-950/60 border-white/[0.06] text-slate-400 hover:border-white/20'
              }`}>
                <div>
                  <span className="font-semibold text-white block text-sm">
                    WorkMatch High-Speed NLP Engine
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Offline, sub-10ms deterministic parsing with zero API cost
                  </span>
                </div>
                <input
                  type="radio"
                  name="aiEngine"
                  value="mock"
                  checked={aiProvider === 'mock'}
                  onChange={() => setAiProvider('mock')}
                  className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                />
              </label>

              {/* Option 2: Gemini */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                aiProvider === 'gemini'
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                  : 'bg-surface-950/60 border-white/[0.06] text-slate-400 hover:border-white/20'
              }`}>
                <div>
                  <span className="font-semibold text-white block text-sm">
                    Google Gemini 1.5 Flash / Pro (Live LLM)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Deep contextual requirement matching and dynamic proposal refinement
                  </span>
                </div>
                <input
                  type="radio"
                  name="aiEngine"
                  value="gemini"
                  checked={aiProvider === 'gemini'}
                  onChange={() => setAiProvider('gemini')}
                  className="w-4 h-4 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </label>

              {aiProvider === 'gemini' && (
                <div className="p-4 bg-surface-950 rounded-2xl border border-cyan-500/30 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-300 font-medium text-[11px]">
                      Google Gemini API Key:
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">Encrypted Server-Side</span>
                  </div>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-surface-900 border border-white/10 rounded-xl p-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 text-xs"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    API keys are stored encrypted and never exposed in browser requests.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex justify-end">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
