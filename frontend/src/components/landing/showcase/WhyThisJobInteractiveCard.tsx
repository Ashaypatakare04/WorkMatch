import React, { useState } from 'react';
import { Check, AlertTriangle, Sparkles, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

interface ReasonItem {
  id: string;
  label: string;
  matchType: 'strong' | 'good' | 'moderate';
  isCaution?: boolean;
  meta: string;
}

const REASONS: ReasonItem[] = [
  { id: '1', label: 'React', matchType: 'strong', meta: 'Declared 4.5y production inventory matches stack' },
  { id: '2', label: 'JavaScript', matchType: 'strong', meta: 'Strict TypeScript & modern ES architecture overlap' },
  { id: '3', label: 'Firebase', matchType: 'good', meta: 'Verified backend serverless & auth integrations' },
  { id: '4', label: 'Experience', matchType: 'strong', meta: '1–2 yrs requested sits safely within your senior ceiling' },
  { id: '5', label: 'Budget', matchType: 'strong', meta: '$40/hr upper limit meets your minimum engagement floor' },
  { id: '6', label: 'Deadline', matchType: 'moderate', isCaution: true, meta: '12 days duration is fast-paced; calendar allows 20h/wk' }
];

export const WhyThisJobInteractiveCard: React.FC = () => {
  const [activeReasonId, setActiveReasonId] = useState<string>('1');
  const activeReason = REASONS.find(r => r.id === activeReasonId) || REASONS[0];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 select-none">
      <div className="rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-2xl p-6 sm:p-9 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#1B253B]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#20D3C2]/30 text-[11px] font-mono text-[#20D3C2] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRANSPARENT REASONING ENGINE</span>
            </div>
            <h3 className="text-2xl font-bold text-[#F4F7FB] font-display">
              Frontend Developer
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#111A2E] border border-[#20D3C2]/40 text-center">
              <span className="text-3xl font-extrabold font-mono text-[#20D3C2] leading-none block">
                97%
              </span>
              <span className="text-[9px] font-mono font-bold tracking-wider text-[#9AA8BC]">MATCH</span>
            </div>
          </div>
        </div>

        {/* 2-Column Explanation Breakdown */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Explanation Reasons (Section 05) */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-xs font-mono text-[#20D3C2] uppercase tracking-wider font-bold block mb-2">
              WHY? (Hover to Inspect Provenance):
            </span>

            <div className="space-y-2">
              {REASONS.map(r => {
                const isActive = activeReasonId === r.id;
                return (
                  <div
                    key={r.id}
                    onMouseEnter={() => setActiveReasonId(r.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#172238] border-[#20D3C2] shadow-md scale-[1.01]'
                        : 'bg-[#111A2E]/70 border-[#1B253B] hover:border-[#20D3C2]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {r.isCaution ? (
                        <AlertTriangle className="w-4 h-4 text-[#F5B942] flex-shrink-0" />
                      ) : (
                        <Check className="w-4 h-4 text-[#35D07F] flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold text-[#F4F7FB]">{r.label}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        r.isCaution
                          ? 'bg-[#F5B942]/15 text-[#F5B942]'
                          : 'bg-[#35D07F]/15 text-[#35D07F]'
                      }`}
                    >
                      {r.isCaution ? 'Moderate Watch' : r.matchType === 'strong' ? 'Strong Match' : 'Good Match'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Lineage Linkage back to Job Listing & Profile */}
          <div className="md:col-span-6 p-5 rounded-2xl bg-[#111A2E] border border-[#1B253B] space-y-4">
            <div className="pb-3 border-b border-[#1B253B]">
              <span className="text-[10px] font-mono text-[#9AA8BC] uppercase tracking-wider block">
                Provenance Proof &amp; Verification
              </span>
              <h5 className="text-sm font-bold text-[#F4F7FB] mt-1">
                Factor: {activeReason.label}
              </h5>
            </div>

            <p className="text-xs text-[#F4F7FB] leading-relaxed">
              {activeReason.meta}
            </p>

            <div className="p-3 rounded-xl bg-[#070A12] border border-[#1B253B] text-[11px] font-mono text-[#9AA8BC] space-y-1">
              <div className="text-[#20D3C2] font-semibold">✓ Connected to verified profile inventory</div>
              <div>✓ Zero subjective recruiter interpretation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
