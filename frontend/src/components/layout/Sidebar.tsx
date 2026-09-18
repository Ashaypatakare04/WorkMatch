import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Bookmark,
  BarChart3,
  FileText,
  Network,
  Bot,
  UserCheck,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  highMatchCount: number;
  possibleMatchCount: number;
  activeAppCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  highMatchCount,
  possibleMatchCount,
  activeAppCount
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'jobs',
      label: 'Opportunities',
      icon: Briefcase,
      badge: highMatchCount > 0 ? `${highMatchCount}` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Layers,
      badge: activeAppCount > 0 ? `${activeAppCount}` : undefined,
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
    },
    { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Activity Reports', icon: FileText },
    { id: 'platforms', label: 'Platforms', icon: Network },
    { id: 'automation', label: 'Automation & Safety', icon: Bot },
    { id: 'profile', label: 'Capability Profile', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-surface-900/50 backdrop-blur-xl border-r border-white/[0.06] flex flex-col justify-between py-6 px-3.5 min-h-[calc(100vh-61px)] select-none">
      <div className="space-y-1.5">
        <div className="px-3 pb-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400/80">
          Intelligence Workspace
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-surface-800 text-white font-semibold shadow-sm border border-white/[0.08] shadow-glow-emerald/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-surface-800/40'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full shadow-glow-emerald"></div>
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/[0.05] text-slate-400 border-white/[0.08]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info badge */}
      <div className="p-3.5 glass-card rounded-2xl text-[11px] space-y-2 border border-white/[0.07]">
        <div className="flex items-center justify-between text-slate-200 font-semibold font-display">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald"></span>
            Opportunity Engine
          </span>
          <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            Active
          </span>
        </div>
        <div className="text-slate-400 text-[10.5px] leading-relaxed">
          Upwork, Fiverr & Freelancer cross-platform normalization with claim verification.
        </div>
      </div>
    </aside>
  );
};
