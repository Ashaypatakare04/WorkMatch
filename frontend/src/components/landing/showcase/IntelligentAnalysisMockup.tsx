import React, { useState } from 'react';
import { Sparkles, Check, AlertTriangle, ShieldCheck, ArrowRight, Zap, Clock, DollarSign, Layers } from 'lucide-react';

interface AnalysisNode {
  id: string;
  name: string;
  extractedFromJob: string;
  userProfileMatch: string;
  score: number;
  status: 'optimal' | 'moderate' | 'caution';
}

const ANALYSIS_NODES: AnalysisNode[] = [
  { id: 'skills', name: 'Skills Tensor', extractedFromJob: 'React, JavaScript, REST APIs, Firebase', userProfileMatch: '100% verified stack in profile', score: 98, status: 'optimal' },
  { id: 'experience', name: 'Experience Seniority', extractedFromJob: '1–2 years experience', userProfileMatch: '4.5+ years senior capability ceiling', score: 96, status: 'optimal' },
  { id: 'complexity', name: 'Complexity Scope', extractedFromJob: 'Independent work, Strong UI skills', userProfileMatch: 'Demonstrated in 12 verified projects', score: 94, status: 'optimal' },
  { id: 'budget', name: 'Budget Compensation', extractedFromJob: '$25–40/hr contract range', userProfileMatch: 'Aligns with your $40/hr target floor', score: 88, status: 'optimal' },
  { id: 'deadline', name: 'Deadline Pressure', extractedFromJob: '12 days delivery window', userProfileMatch: 'Fits open 20h/week calendar slot', score: 85, status: 'moderate' },
  { id: 'client', name: 'Client Expectations', extractedFromJob: 'Fast async communication', userProfileMatch: 'Verified asynchronous cadence rating', score: 97, status: 'optimal' },
  { id: 'comm', name: 'Communication Style', extractedFromJob: 'Daily changelog & self-direction', userProfileMatch: 'Direct match for zero-meeting preference', score: 96, status: 'optimal' }
];

export const IntelligentAnalysisMockup: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('skills');
  const activeNode = ANALYSIS_NODES.find(n => n.id === activeNodeId) || ANALYSIS_NODES[0];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 select-none">
      <div className="rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-2xl p-6 sm:p-9 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#1B253B]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#20D3C2]/30 text-[11px] font-mono text-[#20D3C2] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEMANTIC ANALYSIS ENGINE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] font-display">
              Beyond Keyword Matching
            </h3>
          </div>

          <span className="text-xs font-mono text-[#20D3C2] px-3 py-1.5 rounded-xl bg-[#111A2E] border border-[#1B253B]">
            7 Structural Dimensions Extracted
          </span>
        </div>

        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Floating Real Job Listing Frame (Section 03) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#111A2E] border border-[#1B253B] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B253B]">
              <span className="text-xs font-mono font-bold text-[#20D3C2] uppercase">
                Raw Client Listing
              </span>
              <span className="text-[10px] font-mono text-[#9AA8BC] px-2 py-0.5 rounded bg-[#070A12] border border-[#1B253B]">
                Upwork Escrow
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-[#F4F7FB]">Frontend Developer</h4>
              <p className="text-xs font-mono text-[#20D3C2]">React · JavaScript · REST APIs · Firebase</p>
            </div>

            {/* Contract Specifications */}
            <div className="space-y-1.5 text-xs font-mono text-[#9AA8BC] pt-1">
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="text-[#F4F7FB]">1–2 years</span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="text-[#35D07F] font-bold">$25–40/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Deadline:</span>
                <span className="text-[#F5B942]">12 days</span>
              </div>
            </div>

            {/* Client Expectations */}
            <div className="p-3 rounded-xl bg-[#070A12] border border-[#1B253B] space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-[#9AA8BC] uppercase block">Client Expects:</span>
              <div className="text-xs text-[#F4F7FB] space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2]" />
                  <span>Fast communication &amp; daily progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2]" />
                  <span>Independent execution without handholding</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2]" />
                  <span>Strong UI skills and component architecture</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deconstructed Analysis Nodes (Section 03) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-mono text-[#9AA8BC] uppercase tracking-wider block mb-2">
              Extracted Analysis Nodes &amp; Compatibility Signals:
            </span>

            <div className="space-y-2">
              {ANALYSIS_NODES.map(node => {
                const isActive = activeNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#172238] border-[#20D3C2] shadow-md'
                        : 'bg-[#111A2E]/70 border-[#1B253B] hover:border-[#20D3C2]/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F4F7FB]">{node.name}</span>
                        {node.status === 'optimal' ? (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#35D07F]/15 text-[#35D07F]">
                            Optimal Match
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#F5B942]/15 text-[#F5B942]">
                            Moderate Watch
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-[#9AA8BC] truncate">
                        {node.extractedFromJob}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                      <span className="text-xs font-mono font-bold text-[#20D3C2]">
                        {node.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Node Profile Linkage Card */}
            <div className="p-4 rounded-xl bg-[#111A2E] border border-[#20D3C2]/40 mt-3 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#35D07F] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold text-[#F4F7FB] block">
                  Profile Verification for {activeNode.name}:
                </span>
                <p className="text-xs text-[#9AA8BC] mt-0.5">
                  {activeNode.userProfileMatch}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
