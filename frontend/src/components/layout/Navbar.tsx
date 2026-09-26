import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Bell, Sparkles, CheckCircle2, AlertTriangle, User, Menu, Globe, LogIn, LogOut } from 'lucide-react';
import { NotificationItem, AutomationSettings } from '../../types/index.js';

interface NavbarProps {
  automationSettings?: AutomationSettings;
  notifications: NotificationItem[];
  currentUser?: { id: string; email: string; full_name?: string; is_admin?: boolean } | null;
  onEmergencyStop: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onNavigate: (tab: string) => void;
  onToggleMobileMenu?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  automationSettings,
  notifications,
  currentUser,
  onEmergencyStop,
  onSync,
  isSyncing,
  onNavigate,
  onToggleMobileMenu,
  onOpenAuth,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <header className="sticky top-0 z-40 glass-header px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => onNavigate('dashboard')}>
        <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-[1.5px] shadow-glow-emerald transition-transform duration-200 group-hover:scale-105 shrink-0">
          <div className="h-full w-full bg-[#0d1117] rounded-[10px] flex items-center justify-center overflow-hidden">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="23" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M15 20L22 44L28 28L32 36L36 28L42 44L49 20" stroke="url(#navWm)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="32" cy="18" r="3.5" fill="#10B981" />
              <defs>
                <linearGradient id="navWm" x1="15" y1="20" x2="49" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10B981" />
                  <stop offset="0.5" stopColor="#06B6D4" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              WorkMatch<span className="text-emerald-400 font-semibold ml-0.5">AI</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden lg:block tracking-wide">
            Multi-Platform Work Opportunity Discovery &amp; Proposal Suite
          </p>
        </div>
      </div>

      {/* Center: Emergency Kill Switch & Automation State (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-3">
        {automationSettings?.emergency_stop ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold animate-pulse shadow-lg shadow-red-950/50">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="tracking-wide uppercase text-[11px]">EMERGENCY LOCKDOWN ENGAGED</span>
          </div>
        ) : automationSettings?.application_mode === 'AUTOMATIC' ? (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Auto Apply Active ({automationSettings.applications_today_count}/{automationSettings.max_daily_applications})</span>
            </div>
            <button
              onClick={onEmergencyStop}
              className="px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-red-600/30 active:scale-95"
              title="Activate Emergency Kill Switch"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>KILL SWITCH</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-800/80 border border-white/[0.08] text-slate-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium text-slate-300">
              Mode: <span className="text-cyan-400 font-bold">{automationSettings?.application_mode || 'MANUAL'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Right: Sync, Notifications, Profile, and Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Landing Page Button */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-800/80 hover:bg-surface-750 text-slate-300 hover:text-white text-xs font-medium transition-all border border-white/[0.08] hover:border-cyan-500/30 active:scale-95"
          title="Return to Public Landing Page"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Landing Page</span>
        </button>

        {/* Sync Platforms Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-surface-800/80 hover:bg-surface-750 text-slate-200 text-xs font-medium transition-all border border-white/[0.08] hover:border-emerald-500/30 disabled:opacity-50 active:scale-95"
          title="Synchronize connected work platforms"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-surface-800/80 hover:bg-surface-750 text-slate-300 transition-all border border-white/[0.08] hover:border-white/[0.18] active:scale-95"
            title="Notifications &amp; Job Alerts"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-glow-emerald">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] glass-card rounded-2xl p-4 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-display font-bold text-sm text-white">Job Alerts &amp; Insights</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400">{notifications.length} alerts</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.05] my-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No new notifications yet. High match opportunities will appear here.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="py-2.5 px-2 hover:bg-white/[0.04] rounded-xl transition text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span className="line-clamp-1">{n.title}</span>
                        {n.match_score && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono border border-emerald-500/25 ml-2 shrink-0">
                            {n.match_score}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 mt-1 whitespace-pre-line text-[11px] leading-relaxed line-clamp-2">
                        {n.body}
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">
                        {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('profile');
                }}
                className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300 pt-2.5 border-t border-white/[0.08] block font-medium transition"
              >
                View capability profile &amp; criteria &rarr;
              </button>
            </div>
          )}
        </div>

        {/* User Account / Auth Button */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-surface-800/80 hover:bg-surface-750 text-slate-200 text-xs font-medium border border-white/[0.08] hover:border-emerald-500/30 transition-all active:scale-95"
              title="Account Menu"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0d1117] flex items-center justify-center font-bold text-[10px] text-emerald-400 uppercase">
                  {currentUser.full_name ? currentUser.full_name.charAt(0) : currentUser.email.charAt(0)}
                </div>
              </div>
              <span className="font-medium hidden md:inline max-w-[110px] truncate text-slate-200">
                {currentUser.full_name || currentUser.email.split('@')[0]}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2.5 w-60 glass-card rounded-2xl p-2 z-50 shadow-2xl border border-white/[0.1] animate-in fade-in duration-150">
                <div className="px-3 py-2.5 border-b border-white/[0.08]">
                  <p className="text-xs font-bold text-white truncate">{currentUser.full_name || 'WorkMatch User'}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                  {currentUser.is_admin && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-mono uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl flex items-center gap-2 transition"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Capability Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth?.('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
            title="Sign in to your account"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Mobile Drawer Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-surface-800/80 hover:bg-surface-750 text-slate-200 border border-white/[0.08] transition active:scale-95"
            aria-label="Open mobile menu"
          >
            <Menu className="w-4 h-4 text-emerald-400" />
          </button>
        )}
      </div>
    </header>
  );
};
