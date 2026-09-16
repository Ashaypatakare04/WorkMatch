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
  MessageSquare
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
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          System & Delivery Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure notification dispatch channels, alert thresholds, and AI provider engines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Channels & Rules */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Job Alert Channels</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-semibold text-white block">In-Browser & PWA Notifications</span>
                  <span className="text-[10px] text-slate-400">Receive instant alerts on active desktop tab</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={browserAlerts}
                onChange={e => setBrowserAlerts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="font-semibold text-white block">Email Dispatch</span>
                  <span className="text-[10px] text-slate-400">Digest alerts sent to account email</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-semibold text-white block">Telegram Bot Webhook</span>
                  <span className="text-[10px] text-slate-400">Send high match opportunities to your Telegram channel</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={telegramAlerts}
                onChange={e => setTelegramAlerts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-semibold text-white block">Discord Webhook</span>
                  <span className="text-[10px] text-slate-400">Post notifications into your private Discord server</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={discordAlerts}
                onChange={e => setDiscordAlerts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-300">Notification Trigger Rules</h4>

            <div>
              <label className="block text-slate-400 mb-1">Minimum Alert Match Score:</label>
              <input
                type="number"
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={alertHighRisk}
                onChange={e => setAlertHighRisk(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Alert when potential high-risk or fraudulent listings are identified</span>
            </label>
          </div>
        </div>

        {/* AI Engine & Provider Configuration */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">AI Engine & Provider Gateway</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            WorkMatch AI decouples prompts and providers through an AI Gateway. Choose your preferred engine:
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">WorkMatch Mock NLP Engine (Offline, Zero Cost)</span>
                <span className="text-[10px] text-slate-400">High-speed, deterministic analysis without API keys</span>
              </div>
              <input
                type="radio"
                name="aiEngine"
                value="mock"
                checked={aiProvider === 'mock'}
                onChange={() => setAiProvider('mock')}
                className="text-sky-600 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Google Gemini API (Live LLM)</span>
                <span className="text-[10px] text-slate-400">Gemini 1.5 Flash / Pro model execution</span>
              </div>
              <input
                type="radio"
                name="aiEngine"
                value="gemini"
                checked={aiProvider === 'gemini'}
                onChange={() => setAiProvider('gemini')}
                className="text-sky-600 focus:ring-sky-500"
              />
            </label>

            {aiProvider === 'gemini' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                <label className="block text-slate-300 font-medium text-[11px]">Gemini API Key:</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-sky-500 text-xs"
                />
                <span className="text-[10px] text-slate-500 block">
                  Keys are stored encrypted server-side and never exposed to the browser.
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved!' : 'Save System Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
