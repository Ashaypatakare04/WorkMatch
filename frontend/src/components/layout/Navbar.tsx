import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Bell, Sparkles, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { NotificationItem, AutomationSettings } from '../../types/index.js';

interface NavbarProps {
  automationSettings?: AutomationSettings;
  notifications: NotificationItem[];
  onEmergencyStop: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  automationSettings,
  notifications,
  onEmergencyStop,
  onSync,
  isSyncing,
  onNavigate
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur px-6 py-3 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
          WM
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">WorkMatch AI</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Universal MVP
            </span>
          </div>
          <p className="text-xs text-slate-400">AI Work Opportunity & Application Intelligence</p>
        </div>
      </div>

      {/* Center: Emergency Kill Switch & Automation State */}
      <div className="flex items-center gap-3">
        {automationSettings?.emergency_stop ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            EMERGENCY LOCKDOWN ENGAGED
          </div>
        ) : automationSettings?.application_mode === 'AUTOMATIC' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Auto Apply Active ({automationSettings.applications_today_count}/{automationSettings.max_daily_applications} today)
            </div>
            <button
              onClick={onEmergencyStop}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-red-600/30"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Stop Automation
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
            <span>Mode:</span>
            <span className="text-sky-400 font-semibold">{automationSettings?.application_mode || 'MANUAL'}</span>
          </div>
        )}
      </div>

      {/* Right: Sync, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Sync Platforms Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 disabled:opacity-50"
          title="Synchronize connected work platforms"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Platforms'}</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
            title="Notifications & Job Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-sm text-white">Job Alerts & Notifications</span>
                </div>
                <span className="text-xs text-slate-400">{notifications.length} alerts</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50 my-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No new notifications yet. High match opportunities will appear here.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-700/30 rounded transition text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{n.title}</span>
                        {n.match_score && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                            {n.match_score}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 mt-1 whitespace-pre-line text-[11px] leading-relaxed line-clamp-3">
                        {n.body}
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('notifications');
                }}
                className="w-full text-center text-xs text-sky-400 hover:text-sky-300 pt-2 border-t border-slate-700 block font-medium"
              >
                View all notifications & preferences →
              </button>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
        >
          <div className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 flex items-center justify-center font-bold">
            <User className="w-3.5 h-3.5" />
          </div>
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
