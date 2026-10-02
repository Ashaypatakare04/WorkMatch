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
  ShieldAlert,
  Globe
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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Layers,
      badge: activeAppCount > 0 ? `${activeAppCount}` : undefined,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30'
    },
    { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Activity Reports', icon: FileText },
    { id: 'platforms', label: 'Platforms', icon: Network },
    { id: 'automation', label: 'Automation & Safety', icon: Bot },
    { id: 'profile', label: 'Capability Profile', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'landing', label: 'Landing Page', icon: Globe },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 bg-white dark:bg-[#111A2E] border-r border-slate-200 dark:border-[#22324F] flex-col justify-between py-6 px-4 min-h-[calc(100vh-61px)] select-none shrink-0 transition-colors duration-200">
      <div className="space-y-1.5">
        <div className="px-3 pb-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#9AA8BC]">
          Intelligence Workspace
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-slate-100 dark:bg-[#172238] text-slate-900 dark:text-[#F4F7FB] font-bold shadow-sm border border-slate-200 dark:border-[#22324F]'
                  : 'text-slate-600 dark:text-[#9AA8BC] hover:text-slate-950 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-[#172238]/60'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#20D3C2] rounded-r-full shadow-glow-teal"></div>
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#20D3C2]' : 'text-slate-500 dark:text-[#9AA8BC] group-hover:text-slate-800 dark:group-hover:text-[#F4F7FB]'}`} />
                <span className="tracking-normal">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 dark:bg-[#111A2E] text-slate-700 dark:text-[#F4F7FB] border-slate-200 dark:border-[#22324F]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info badge */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#172238] text-xs space-y-2 border border-slate-200 dark:border-[#22324F] shadow-sm">
        <div className="flex items-center justify-between text-slate-900 dark:text-[#F4F7FB] font-bold font-display">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20D3C2] animate-pulse"></span>
            Opportunity Engine
          </span>
          <span className="text-[#20D3C2] font-mono text-xs uppercase font-bold tracking-wider">
            Active
          </span>
        </div>
        <div className="text-slate-600 dark:text-[#9AA8BC] text-xs leading-relaxed">
          Upwork, Fiverr &amp; Freelancer cross-platform normalization with verified claims.
        </div>
      </div>
    </aside>
  );
};
