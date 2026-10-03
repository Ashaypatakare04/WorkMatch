import React, { useState } from 'react';
import { Bookmark, Send, Eye, XCircle, CheckCircle2, ShieldCheck, Play, ArrowRight } from 'lucide-react';

export const DecisionSimulatorScreen: React.FC = () => {
  const [currentAction, setCurrentAction] = useState<'idle' | 'reviewed' | 'saved' | 'applied' | 'skipped'>('idle');
  const [pipelineCount, setPipelineCount] = useState({ saved: 4, applied: 3, skipped: 1 });

  const handleAction = (action: 'reviewed' | 'saved' | 'applied' | 'skipped') => {
    setCurrentAction(action);
    if (action === 'saved') setPipelineCount(prev => ({ ...prev, saved: prev.saved + 1 }));
    if (action === 'applied') setPipelineCount(prev => ({ ...prev, applied: prev.applied + 1 }));
    if (action === 'skipped') setPipelineCount(prev => ({ ...prev, skipped: prev.skipped + 1 }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 select-none">
      <div className="rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-2xl overflow-hidden">
        {/* Device Header */}
        <div className="px-6 py-3.5 bg-[#111A2E] border-b border-[#1B253B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20D3C2]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#F4F7FB] uppercase">
              Opportunity Decision Cockpit
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#9AA8BC]">
            <span>Saved ({pipelineCount.saved})</span>
            <span>•</span>
            <span className="text-[#20D3C2]">Applied ({pipelineCount.applied})</span>
          </div>
        </div>

        {/* Opportunity Card Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#1B253B]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#20D3C2]/15 text-[#20D3C2] font-bold">
                  Upwork Verified
                </span>
                <span className="text-xs text-[#9AA8BC] font-mono">$60/hr · 20 hrs/week</span>
              </div>
              <h4 className="text-2xl font-bold text-[#F4F7FB] font-display">
                Frontend Dashboard Architect
              </h4>
              <p className="text-xs text-[#9AA8BC] mt-1">
                Client holds 4.98 rating across $140k+ verified escrow contracts.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-[#1B253B] text-center flex-shrink-0">
              <span className="text-2xl font-extrabold font-mono text-[#20D3C2] leading-none block">
                97%
              </span>
              <span className="text-[9px] font-mono text-[#9AA8BC]">MATCH FIT</span>
            </div>
          </div>

          {/* Verification reasons */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#F4F7FB]">
              <CheckCircle2 className="w-4 h-4 text-[#35D07F] flex-shrink-0" />
              <span>Skills overlap verified: React 18, TypeScript, Tailwind</span>
            </div>
            <div className="flex items-center gap-2 text-[#F4F7FB]">
              <CheckCircle2 className="w-4 h-4 text-[#35D07F] flex-shrink-0" />
              <span>Budget ($60/hr) exceeds your $50/hr target floor</span>
            </div>
            <div className="flex items-center gap-2 text-[#F4F7FB]">
              <CheckCircle2 className="w-4 h-4 text-[#35D07F] flex-shrink-0" />
              <span>Async-first workflow with zero daily meetings</span>
            </div>
          </div>

          {/* Action Decision Control Buttons (Section 07 Specification) */}
          <div className="pt-4 border-t border-[#1B253B] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleAction('reviewed')}
              className="py-3 px-4 rounded-xl bg-[#111A2E] hover:bg-[#172238] text-[#F4F7FB] text-xs font-mono font-bold transition-all border border-[#1B253B] flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#38BDF8]" />
              <span>Review Details</span>
            </button>

            <button
              onClick={() => handleAction('saved')}
              className="py-3 px-4 rounded-xl bg-[#111A2E] hover:bg-[#172238] text-[#F4F7FB] text-xs font-mono font-bold transition-all border border-[#1B253B] flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-[#F5B942]" />
              <span>Save for Later</span>
            </button>

            <button
              onClick={() => handleAction('applied')}
              className="py-3 px-4 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-glow-teal"
            >
              <Send className="w-4 h-4 text-[#0B1220]" />
              <span>Apply with Draft</span>
            </button>

            <button
              onClick={() => handleAction('skipped')}
              className="py-3 px-4 rounded-xl bg-[#111A2E] hover:bg-[#172238] text-[#9AA8BC] hover:text-[#F05D6C] text-xs font-mono transition-all border border-[#1B253B] flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Skip Opportunity</span>
            </button>
          </div>

          {/* Feedback ticker */}
          {currentAction !== 'idle' && (
            <div className="p-3 rounded-xl bg-[#20D3C2]/10 border border-[#20D3C2]/30 text-xs font-mono text-[#20D3C2] flex items-center justify-between">
              <span>Decision Registered: {currentAction.toUpperCase()}</span>
              <span className="text-[#35D07F]">Personalization weights updated in real time</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
