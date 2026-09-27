import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number | string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => {
  return (
    <div className={`relative rounded-xl p-[1.5px] bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 shadow-glow-emerald transition-transform duration-200 group-hover:scale-105 shrink-0 ${className}`}>
      <div className="h-full w-full bg-white dark:bg-[#0d1117] rounded-[10px] flex items-center justify-center overflow-hidden p-1 shadow-inner">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="wmNexusGrad" x1="10" y1="52" x2="54" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="48%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="wmNexusGradLight" x1="10" y1="52" x2="54" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="48%" stopColor="#0891B2" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="nexusGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Alignment Grid Track */}
          <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-cyan-500/20 dark:text-cyan-400/25" />

          {/* Left W Stem */}
          <path
            d="M13 24V43C13 44.7 14.3 46 16 46H17.5C19.2 46 20.5 44.7 20.5 43V33.5L26.2 43.8C26.8 44.9 28.4 45 29.1 44L36 33.5V43C36 44.7 37.3 46 39 46H40.5C42.2 46 43.5 44.7 43.5 43V30.5"
            stroke="url(#wmNexusGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm"
          />

          {/* Upward Opportunity Arrow (M into dynamic surge) */}
          <path
            d="M36 30L49 14.5M49 14.5H38.5M49 14.5V25"
            stroke="url(#wmNexusGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Focus Node */}
          <circle cx="28" cy="21" r="3.2" fill="#10B981" />
          <circle cx="28" cy="21" r="5" stroke="#10B981" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  taglineText?: string;
  badgeText?: string;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  taglineText = 'Multi-Platform Opportunity & Proposal Intelligence',
  badgeText = 'PRO',
  onClick,
  className = ''
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11'
  }[size];

  const textClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer group select-none transition-all ${className}`}
    >
      <LogoIcon className={iconSizeClasses} />
      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`font-display font-extrabold ${textClasses} text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors`}>
            WorkMatch<span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-0.5">AI</span>
          </span>
          {badgeText && (
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              {badgeText}
            </span>
          )}
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block tracking-wide">
            {taglineText}
          </p>
        )}
      </div>
    </div>
  );
};
