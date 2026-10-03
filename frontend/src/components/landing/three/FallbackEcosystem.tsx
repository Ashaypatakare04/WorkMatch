import React from 'react';
import { OpportunityNodeData, StoryStage } from './types.js';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

interface FallbackEcosystemProps {
  opportunities: OpportunityNodeData[];
  selectedOpportunity: OpportunityNodeData | null;
  onSelectOpportunity: (opp: OpportunityNodeData) => void;
  stage: StoryStage;
}

export const FallbackEcosystem: React.FC<FallbackEcosystemProps> = ({
  opportunities,
  selectedOpportunity,
  onSelectOpportunity,
  stage
}) => {
  const activeOpp = selectedOpportunity || opportunities[0];

  return (
    <div className="w-full h-full min-h-[460px] md:min-h-[540px] relative rounded-2xl bg-[#0B1220] border border-[#22324F] p-5 md:p-8 flex flex-col justify-between overflow-hidden shadow-card">
      {/* Background ambient grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#20D3C2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#5EE7DF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header status bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#22324F]/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#20D3C2] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#20D3C2] font-semibold">
            Opportunity Ecosystem · 2D High-Fidelity Canvas
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#9AA8BC] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35D07F]" />
          <span>Stage: {stage.toUpperCase()}</span>
        </div>
      </div>

      {/* Central 2D diagram: USER PROFILE CORE <--> AI MATCH ENGINE <--> OPPORTUNITIES */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Profile Core (Left/Center in 2D) */}
        <div className="md:col-span-5 flex flex-col items-center text-center p-5 rounded-2xl bg-[#111A2E]/90 border border-[#22324F] shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#172238] border border-[#20D3C2]/30 text-[10px] font-mono text-[#20D3C2] font-semibold uppercase tracking-wider">
            User Profile Core
          </div>

          {/* Abstract Geometric Construction */}
          <div className="relative w-28 h-28 my-3 flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#20D3C2]/30 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-2 rounded-full border border-[#20D3C2]/20" />
            <div className="absolute inset-4 rounded-full border border-[#5EE7DF]/20" />
            {/* Faceted Core Badge */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#172238] to-[#0B1220] border-2 border-[#20D3C2] flex flex-col items-center justify-center shadow-glow-teal rotate-45 transition-transform hover:rotate-90 duration-700">
              <span className="-rotate-45 text-[10px] font-mono font-bold text-[#F4F7FB]">FIT</span>
              <span className="-rotate-45 text-[9px] font-mono text-[#20D3C2] font-semibold">CORE</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-[#F4F7FB] mt-1 font-display">
            Verified Work Identity
          </div>
          <div className="text-[11px] text-[#9AA8BC] font-mono mt-0.5">
            React · TypeScript · 20h/wk · $50/hr Floor
          </div>

          {/* Verified skills pills */}
          <div className="flex flex-wrap gap-1 justify-center mt-3 pt-3 border-t border-[#22324F]/60 w-full">
            {['Frontend Architect', 'Full Stack', 'Async Ready', 'Verified History'].map((s, idx) => (
              <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#172238] text-[#9AA8BC] border border-[#22324F]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Center Connection Stream */}
        <div className="md:col-span-2 hidden md:flex flex-col items-center justify-center space-y-2">
          <div className="text-[9px] font-mono text-[#20D3C2] uppercase font-bold tracking-widest">
            AI MATCH
          </div>
          <div className="w-full flex items-center justify-center">
            <svg className="w-full h-8" viewBox="0 0 100 24" fill="none">
              <line x1="0" y1="12" x2="100" y2="12" stroke="#20D3C2" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="50" cy="12" r="4" fill="#20D3C2" />
            </svg>
          </div>
          <div className="text-[9px] font-mono text-[#35D07F]">
            Evaluated
          </div>
        </div>

        {/* Opportunity Nodes Grid (Right in 2D) */}
        <div className="md:col-span-5 space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div className="text-[10px] font-mono uppercase text-[#9AA8BC] tracking-wider mb-1 flex items-center justify-between">
            <span>Opportunity Nodes</span>
            <span className="text-[#20D3C2]">{opportunities.length} Live</span>
          </div>

          {opportunities.map(opp => {
            const isSelected = activeOpp.id === opp.id;
            const isHigh = opp.matchScore >= 90;
            return (
              <button
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#172238] border-[#20D3C2] shadow-glow-teal ring-1 ring-[#20D3C2]/50'
                    : 'bg-[#111A2E]/80 border-[#22324F] hover:border-[#20D3C2]/40 hover:bg-[#172238]/60'
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B1220] text-[#9AA8BC] border border-[#22324F]">
                      {opp.platform}
                    </span>
                    <span className="text-xs font-semibold text-[#F4F7FB] truncate">
                      {opp.title}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#9AA8BC] mt-0.5">
                    {opp.budget} · {opp.timeEstimate.split('·')[0]}
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-xs font-mono font-bold ${isHigh ? 'text-[#20D3C2]' : 'text-[#5EE7DF]'}`}>
                    {opp.matchScore}
                  </span>
                  <span className="text-[8px] font-mono text-[#9AA8BC]">MATCH</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Opportunity Mini-Cockpit */}
      <div className="relative z-10 pt-3 border-t border-[#22324F]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#22324F]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F4F7FB]">{activeOpp.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20D3C2]/15 text-[#20D3C2] font-bold">
                {activeOpp.matchScore} MATCH
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 text-[11px] font-mono text-[#9AA8BC]">
              <span>Skills: <strong className="text-[#20D3C2]">{activeOpp.breakdown.skills}%</strong></span>
              <span>Time: <strong className="text-[#35D07F]">{activeOpp.breakdown.time}%</strong></span>
              <span>Budget: <strong className="text-[#F5B942]">{activeOpp.breakdown.budget}%</strong></span>
              <span>Risk: <strong className="text-[#35D07F]">{activeOpp.risk}</strong></span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#35D07F] flex items-center sm:justify-end gap-1">
              <Check className="w-3 h-3" />
              <span>{activeOpp.whyItFits[0]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
