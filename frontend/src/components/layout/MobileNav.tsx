import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  UserCheck,
  Menu,
  X,
  Bookmark,
  BarChart3,
  FileText,
  Network,
  Bot,
  Settings,
  ShieldAlert,
  Radio,
  Sparkles,
  Globe,
  LogIn,
  LogOut
} from 'lucide-react';
import { AutomationSettings } from '../../types/index.js';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  highMatchCount: number;
  activeAppCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  automationSettings?: AutomationSettings;
  onEmergencyStop?: () => void;
  currentUser?: { id: string; email: string; full_name?: string; is_admin?: boolean } | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  highMatchCount,
  activeAppCount,
  isOpen,
  onToggle,
  onClose,
  automationSettings,
  onEmergencyStop,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const primaryTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      badge: highMatchCount > 0 ? highMatchCount : undefined
    },
    {
      id: 'applications',
      label: 'Apps',
      icon: Layers,
      badge: activeAppCount > 0 ? activeAppCount : undefined
    },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'menu', label: 'More', icon: Menu, isMenuTrigger: true }
  ];

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'jobs',
      label: 'Opportunity Catalog',
      icon: Briefcase,
      badge: highMatchCount > 0 ? `${highMatchCount} new` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'applications',
      label: 'Applications Kanban',
      icon: Layers,
      badge: activeAppCount > 0 ? `${activeAppCount} active` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    { id: 'saved', label: 'Saved Opportunities', icon: Bookmark },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Activity Statement', icon: FileText },
    { id: 'platforms', label: 'Marketplace Connectors', icon: Network },
    { id: 'automation', label: 'Automation & Boundaries', icon: Bot },
    { id: 'profile', label: 'Capability Profile', icon: UserCheck },
    { id: 'settings', label: 'Dispatch & AI Engine', icon: Settings },
    { id: 'landing', label: 'Public Landing Page', icon: Globe }
  ];

  const handleSelectTab = (id: string) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {/* Bottom Fixed Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-950/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-around">
          {primaryTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = !tab.isMenuTrigger && currentTab === tab.id;
            const isMenuOpen = tab.isMenuTrigger && isOpen;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.isMenuTrigger) {
                    onToggle();
                  } else {
                    handleSelectTab(tab.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 select-none min-w-[54px] active:scale-95 ${
                  isActive || isMenuOpen
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-emerald-500 text-surface-950 shadow-glow-emerald">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-1">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-4 h-0.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Full Slide-out Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Sheet */}
          <div className="absolute right-0 top-0 bottom-0 w-5/6 max-w-sm bg-surface-950 border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slideLeft">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px] shadow-glow-emerald">
                    <div className="w-full h-full bg-surface-950 rounded-[11px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <span className="font-display font-bold text-white text-sm block leading-tight">
                      Navigation Hub
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      All Intelligence Modules
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-surface-900 text-slate-400 hover:text-white border border-white/[0.08] transition active:scale-95"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Account State */}
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-surface-900 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px] shrink-0">
                      <div className="w-full h-full rounded-full bg-surface-950 flex items-center justify-center font-bold text-xs text-emerald-400 uppercase">
                        {currentUser.full_name ? currentUser.full_name.charAt(0) : currentUser.email.charAt(0)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{currentUser.full_name || 'WorkMatch User'}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onLogout?.();
                    }}
                    className="p-2 rounded-xl bg-surface-800 text-rose-400 hover:bg-rose-500/10 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth?.('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}

              {/* Mode indicator */}
              <div className="p-3 rounded-2xl bg-surface-900/80 border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Operating Mode</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase">
                  {automationSettings?.application_mode || 'MANUAL'}
                </span>
              </div>

              {/* Links List */}
              <div className="space-y-1">
                {allMenuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition active:scale-98 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 text-white font-semibold border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-surface-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/[0.05] text-slate-400'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Emergency Kill Switch & Engine Status */}
            <div className="pt-5 border-t border-white/[0.08] space-y-3">
              {onEmergencyStop && (
                <button
                  onClick={() => {
                    onEmergencyStop();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/50 transition active:scale-95 border border-red-500/30"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Stop Automation (Kill Switch)</span>
                </button>
              )}

              <div className="p-3 rounded-xl bg-surface-900/60 border border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Opportunity Engine
                </span>
                <span className="font-mono text-emerald-400 font-bold text-[10px]">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
