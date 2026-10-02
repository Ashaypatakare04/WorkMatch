import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface WhyThisMatchesProps {
  whyMatches?: string[];
  concerns?: string[];
  className?: string;
  compact?: boolean;
}

export const WhyThisMatches: React.FC<WhyThisMatchesProps> = ({
  whyMatches = [],
  concerns = [],
  className = '',
  compact = false
}) => {
  if (whyMatches.length === 0 && concerns.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Positive Reasons */}
      {whyMatches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#20D3C2]">
            <span className="text-sm">✦</span>
            <span>Why this matches you</span>
          </div>

          <div className="space-y-1.5">
            {(compact ? whyMatches.slice(0, 2) : whyMatches).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-[#F4F7FB]/90">
                <Check className="w-3.5 h-3.5 text-[#35D07F] shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concerns shown separately */}
      {concerns.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-[#22324F]/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5B942]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F5B942] shrink-0" />
            <span>Concerns to review</span>
          </div>

          <div className="space-y-1">
            {(compact ? concerns.slice(0, 1) : concerns).map((concern, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-amber-700 dark:text-[#F5B942]/90">
                <span className="text-[#F5B942] font-bold shrink-0">⚠</span>
                <span className="leading-snug">{concern}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
