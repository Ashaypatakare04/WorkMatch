import React from 'react';
import { JobScore } from '../../types/index.js';

interface MatchScoreProps {
  score: number;
  breakdown?: Partial<{
    skills: number;
    experience: number;
    time: number;
    budget: number;
    complexity: number;
    communication: number;
  }> | JobScore;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  className?: string;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  breakdown,
  size = 'md',
  showBreakdown = false,
  className = ''
}) => {
  // Extract breakdown values safely
  const bSkills = (breakdown as any)?.skills ?? (breakdown as any)?.skill_score ?? 92;
  const bExp = (breakdown as any)?.experience ?? (breakdown as any)?.experience_score ?? 88;
  const bTime = (breakdown as any)?.time ?? (breakdown as any)?.time_score ?? 90;
  const bBudget = (breakdown as any)?.budget ?? (breakdown as any)?.budget_score ?? 86;
  const bComplexity = (breakdown as any)?.complexity ?? (breakdown as any)?.difficulty_score ?? 85;
  const bComm = (breakdown as any)?.communication ?? (breakdown as any)?.communication_score ?? 94;

  const radius = size === 'sm' ? 22 : size === 'lg' ? 44 : 32;
  const stroke = size === 'sm' ? 4 : size === 'lg' ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const scoreColor =
    score >= 85
      ? 'text-[#20D3C2]'
      : score >= 70
      ? 'text-[#35D07F]'
      : score >= 50
      ? 'text-[#F5B942]'
      : 'text-[#F05D6C]';

  const strokeColor =
    score >= 85
      ? 'stroke-[#20D3C2]'
      : score >= 70
      ? 'stroke-[#35D07F]'
      : score >= 50
      ? 'stroke-[#F5B942]'
      : 'stroke-[#F05D6C]';

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  }[size];

  const textSize = {
    sm: 'text-sm font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-3xl font-extrabold'
  }[size];

  const subTextSize = {
    sm: 'text-[8px] font-mono tracking-wider',
    md: 'text-[9px] font-mono tracking-widest',
    lg: 'text-[11px] font-mono tracking-widest'
  }[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Signature Circular Gauge */}
      <div className={`relative ${sizeClasses} flex items-center justify-center shrink-0`}>
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${(radius + stroke) * 2} ${(radius + stroke) * 2}`}
        >
          {/* Background Track */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            className="stroke-slate-200 dark:stroke-[#22324F]"
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            className={`${strokeColor} transition-all duration-700 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className={`font-mono leading-none tracking-tight ${textSize} ${scoreColor}`}>
            {score}
          </span>
          <span className={`text-slate-500 dark:text-[#9AA8BC] uppercase font-semibold ${subTextSize}`}>
            MATCH
          </span>
        </div>
      </div>

      {/* Optional Dimensional Breakdown */}
      {showBreakdown && (
        <div className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-[#22324F] text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Skills</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#20D3C2] rounded-full" style={{ width: `${bSkills}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bSkills}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Experience</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#20D3C2] rounded-full" style={{ width: `${bExp}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bExp}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Time fit</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#35D07F] rounded-full" style={{ width: `${bTime}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bTime}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Budget</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#F5B942] rounded-full" style={{ width: `${bBudget}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bBudget}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Complexity</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#20D3C2] rounded-full" style={{ width: `${bComplexity}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bComplexity}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-[#9AA8BC]">
            <span>Communication</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-[#111A2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#35D07F] rounded-full" style={{ width: `${bComm}%` }} />
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-[#F4F7FB] w-7 text-right">{bComm}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
