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
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-61px)]">
      <div className="space-y-1">
        <div className="px-3 pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info badge */}
      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span>AI Engine</span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
          </span>
        </div>
        <div className="text-slate-400 text-[10px] leading-relaxed">
          Normalized job processing, multi-criteria weights, & truthful claim verification.
        </div>
      </div>
    </aside>
  );
};
