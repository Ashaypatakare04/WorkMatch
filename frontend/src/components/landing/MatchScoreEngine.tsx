import React, { useState, useMemo } from 'react';
import { Sparkles, Sliders, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface MatchDimension {
  id: string;
  name: string;
  weight: number;
  initialValue: number;
  description: string;
  color: string;
}

const DIMENSIONS: MatchDimension[] = [
  { id: 'skills', name: 'Skills Overlap', weight: 0.30, initialValue: 98, description: 'Direct verification with React 18, TypeScript & Tailwind inventory', color: '#20D3C2' },
  { id: 'experience', name: 'Experience Depth', weight: 0.20, initialValue: 94, description: '4.5+ years production frontend architecture seniority', color: '#5EE7DF' },
  { id: 'requirements', name: 'Requirements Scope', weight: 0.15, initialValue: 97, description: 'Zero unverified technologies or ambiguous delivery expectations', color: '#38BDF8' },
  { id: 'complexity', name: 'Complexity Level', weight: 0.10, initialValue: 91, description: 'Moderate architectural scope fits declared capability window', color: '#818CF8' },
  { id: 'budget', name: 'Budget Alignment', weight: 0.15, initialValue: 96, description: '$50/hr target floor exceeded with verified escrow funding', color: '#35D07F' },
  { id: 'preferences', name: 'Preferences & Cadence', weight: 0.10, initialValue: 95, description: 'Async-first workflow with under 2h weekly synchronous meetings', color: '#20D3C2' }
];

interface MatchScoreEngineProps {
  onExploreDemo?: () => void;
}

export const MatchScoreEngine: React.FC<MatchScoreEngineProps> = ({ onExploreDemo }) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    DIMENSIONS.forEach(d => {
      init[d.id] = d.initialValue;
    });
    return init;
  });

  const [activeDimension, setActiveDimension] = useState<string>('skills');

  // Calculate weighted composite score
  const compositeScore = useMemo(() => {
    let total = 0;
    DIMENSIONS.forEach(d => {
      total += (values[d.id] || 0) * d.weight;
    });
    return Math.min(99, Math.round(total));
  }, [values]);

  const updateDimensionValue = (id: string, newVal: number) => {
    setValues(prev => ({ ...prev, [id]: newVal }));
  };

  const selectedDim = DIMENSIONS.find(d => d.id === activeDimension) || DIMENSIONS[0];

  return (
    <div className="w-full rounded-3xl bg-[#0D1322] border border-[#1B253B] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#20D3C2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#1B253B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172238] border border-[#20D3C2]/30 text-[11px] font-mono text-[#20D3C2] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#20D3C2]" />
            <span>MULTIDIMENSIONAL MATCH ENGINE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F4F7FB] font-display">
            The Science of Fit
          </h3>
          <p className="text-sm text-[#9AA8BC] mt-1.5 max-w-xl">
            WorkMatch decomposes every contract across 6 independent dimensions to guarantee truthful recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9AA8BC] bg-[#111A2E] px-3.5 py-2 rounded-xl border border-[#1B253B]">
          <ShieldCheck className="w-4 h-4 text-[#35D07F]" />
          <span>Real-time Composite Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Radial Arc Holographic Visualization (Section 7) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Multi-layered concentric animated SVG arcs */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#20D3C2" />
                  <stop offset="50%" stopColor="#5EE7DF" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Tracks */}
              <circle cx="100" cy="100" r="85" stroke="#172238" strokeWidth="6" fill="transparent" />
              <circle cx="100" cy="100" r="72" stroke="#172238" strokeWidth="4" fill="transparent" />
              <circle cx="100" cy="100" r="59" stroke="#172238" strokeWidth="3" fill="transparent" />

              {/* Dynamic Outer Composite Arc */}
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="url(#scoreGrad)"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 85}
                strokeDashoffset={2 * Math.PI * 85 - (compositeScore / 100) * (2 * Math.PI * 85)}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#glow)"
                className="transition-all duration-700 ease-out"
              />

              {/* Middle Dimension Arc (Skills) */}
              <circle
                cx="100"
                cy="100"
                r="72"
                stroke="#5EE7DF"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 72}
                strokeDashoffset={2 * Math.PI * 72 - ((values.skills || 90) / 100) * (2 * Math.PI * 72)}
                strokeLinecap="round"
                fill="transparent"
                opacity="0.8"
                className="transition-all duration-500 ease-out"
              />

              {/* Inner Dimension Arc (Budget) */}
              <circle
                cx="100"
                cy="100"
                r="59"
                stroke="#35D07F"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 59}
                strokeDashoffset={2 * Math.PI * 59 - ((values.budget || 90) / 100) * (2 * Math.PI * 59)}
                strokeLinecap="round"
                fill="transparent"
                opacity="0.7"
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* Center Callout: 97% MATCH */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl sm:text-6xl font-extrabold font-mono text-[#F4F7FB] tracking-tight leading-none">
                  {compositeScore}
                </span>
                <span className="text-2xl font-mono text-[#20D3C2] font-bold ml-1">%</span>
              </div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#20D3C2] uppercase mt-1">
                MATCH
              </span>
              <span className="text-[10px] font-mono text-[#9AA8BC] mt-1">
                EXCELLENT ALIGNMENT
              </span>
            </div>
          </div>

          <p className="text-xs font-mono text-[#9AA8BC] text-center mt-5">
            Composite result derived from multi-layer tensor evaluation.
          </p>
        </div>

        {/* Right Column: Interactive Dimension Sliders & Breakdown (Section 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIMENSIONS.map(dim => {
              const val = values[dim.id] || 0;
              const isActive = activeDimension === dim.id;
              return (
                <div
                  key={dim.id}
                  onClick={() => setActiveDimension(dim.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#172238] border-[#20D3C2] shadow-lg shadow-[#20D3C2]/5'
                      : 'bg-[#111A2E]/70 border-[#1B253B] hover:border-[#20D3C2]/40 hover:bg-[#172238]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#F4F7FB]">{dim.name}</span>
                    <span className="text-xs font-mono font-bold text-[#20D3C2]">{val}%</span>
                  </div>

                  {/* Arc/Track Visualization */}
                  <div className="w-full h-1.5 rounded-full bg-[#0D1322] overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${val}%`,
                        backgroundColor: dim.color
                      }}
                    />
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={val}
                    onChange={e => updateDimensionValue(dim.id, Number(e.target.value))}
                    onClick={e => e.stopPropagation()}
                    className="w-full accent-[#20D3C2] h-1 bg-[#172238] rounded-lg cursor-pointer"
                    aria-label={`Adjust ${dim.name}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Active Dimension Deep Dive Card */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#1B253B] mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F4F7FB]">{selectedDim.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20D3C2]/15 text-[#20D3C2] font-semibold">
                  Weight: {Math.round(selectedDim.weight * 100)}%
                </span>
              </div>
              <p className="text-xs text-[#9AA8BC] leading-relaxed">
                {selectedDim.description}
              </p>
            </div>

            {onExploreDemo && (
              <button
                onClick={onExploreDemo}
                className="px-4 py-2 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] font-bold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-sm"
              >
                <span>Test Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
