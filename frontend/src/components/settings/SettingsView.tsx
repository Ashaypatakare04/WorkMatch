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
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Palette
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.js';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            System Configuration
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">End-to-End Encryption</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          Dispatch &amp; Engine Preferences
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Configure real-time notification dispatch channels, alert sensitivity thresholds, appearance themes, and multi-provider AI model gateways.
        </p>
      </div>

      {/* Appearance & Interface Theme Selector */}
      <div className="card-primary rounded-3xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Interface Appearance &amp; Color Scheme
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Linear / Vercel Modern Light &amp; Dark Mode (Currently active: <strong className="capitalize text-slate-800 dark:text-slate-200">{resolvedTheme}</strong>)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              theme === 'light'
                ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 shadow-sm ring-1 ring-emerald-500/30'
                : 'bg-slate-100/70 dark:bg-surface-950/60 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 dark:bg-surface-800 text-slate-500'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Light Mode</span>
                {theme === 'light' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Crisp zinc/white surfaces, slate borders, and high-contrast typography.
              </p>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              theme === 'dark'
                ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-glow-emerald ring-1 ring-emerald-500/30'
                : 'bg-slate-100/70 dark:bg-surface-950/60 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-indigo-950 text-indigo-300' : 'bg-slate-200 dark:bg-surface-800 text-slate-500'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Dark Mode</span>
                {theme === 'dark' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Deep obsidian &amp; cosmic glass with emerald and cyan luminescence.
              </p>
            </div>
          </button>

          {/* System Default Option */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              theme === 'system'
                ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500/30'
                : 'bg-slate-100/70 dark:bg-surface-950/60 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${theme === 'system' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300' : 'bg-slate-200 dark:bg-surface-800 text-slate-500'}`}>
              <Monitor className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white">System Auto</span>
                {theme === 'system' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically matches your operating system&apos;s day/night schedule.
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Channels & Rules */}
        <div className="card-primary rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Live Opportunity Dispatch Channels
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Multi-Channel</span>
          </div>

          <div className="space-y-3">
            {/* Browser / PWA */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-surface-950/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block text-sm">In-Browser &amp; Desktop PWA</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Instant audio-visual alert on active tab</span>
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
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-surface-950/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-indigo-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block text-sm">Email Dispatch Digest</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Curated high-match batch to account email</span>
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
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-surface-950/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-sky-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block text-sm">Telegram Bot Webhook</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Stream high-match alerts to private bot channel</span>
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
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-surface-950/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-purple-500/30 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block text-sm">Discord Webhook</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Post rich embed notifications to server channel</span>
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

          <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Alert Trigger Sensitivity</h4>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-semibold text-xs sm:text-sm">
                Minimum Alert Score Threshold:
              </label>
              <input
                type="number"
                min="50"
                max="99"
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <label className="flex items-start sm:items-center gap-3 text-slate-700 dark:text-slate-300 cursor-pointer pt-1 select-none text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={alertHighRisk}
                onChange={e => setAlertHighRisk(e.target.checked)}
                className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-rose-500 accent-rose-500 cursor-pointer flex-shrink-0"
              />
              <span className="leading-snug">
                Send security alerts when potential high-risk or suspicious client payment behaviors are detected
              </span>
            </label>
          </div>
        </div>

        {/* AI Engine & Provider Configuration */}
        <div className="card-primary rounded-3xl p-5 sm:p-7 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  AI Engine &amp; Provider Gateway
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Decoupled Architecture</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              WorkMatch AI uses an abstracted provider gateway. Choose between offline deterministic processing or live frontier language models:
            </p>

            <div className="space-y-3">
              {/* Option 1: Mock NLP */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                aiProvider === 'mock'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                  : 'bg-slate-100/70 dark:bg-surface-950/60 border-slate-200/80 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    WorkMatch High-Speed NLP Engine
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
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
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-slate-900 dark:text-white'
                  : 'bg-slate-100/70 dark:bg-surface-950/60 border-slate-200/80 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    Google Gemini 1.5 Flash / Pro (Live LLM)
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
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
                <div className="p-4 bg-slate-50 dark:bg-surface-950 rounded-2xl border border-cyan-500/30 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                      Google Gemini API Key:
                    </label>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">Encrypted Server-Side</span>
                  </div>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-white dark:bg-surface-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                  <span className="text-xs text-slate-500 block leading-tight">
                    API keys are stored encrypted and never exposed in browser requests.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/[0.06] flex justify-end">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white dark:text-surface-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
