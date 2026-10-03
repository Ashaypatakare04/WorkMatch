import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Check,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sliders,
  Send,
  RefreshCw,
  FileText,
  UserCheck
} from 'lucide-react';
import { OpportunityScene } from './three/OpportunityScene.js';
import { StoryStage, OpportunityNodeData, OPPORTUNITY_NODES } from './three/types.js';

interface EcosystemStorySectionProps {
  onLaunchApp: () => void;
  onLoadDemoAndLaunch: () => void;
}

const STAGES: {
  id: StoryStage;
  num: string;
  name: string;
  headline: string;
  subtext: string;
}[] = [
  {
    id: 'discover',
    num: '01',
    name: 'DISCOVER',
    headline: 'Thousands of opportunities.',
    subtext: "Finding opportunities isn't the hard part. The internet is flooded with listings across Upwork, Fiverr, and job boards. The real challenge is finding the rare few that genuinely fit your life."
  },
  {
    id: 'understand',
    num: '02',
    name: 'UNDERSTAND',
    headline: 'Not every opportunity deserves your time.',
    subtext: 'Before reading pages of repetitive job posts, WorkMatch deconstructs every contract into 8 structural dimensions: Skills, Experience, Budget, Time, Deadline, Difficulty, Communication, and Risk.'
  },
  {
    id: 'match',
    num: '03',
    name: 'MATCH',
    headline: 'WorkMatch finds the ones that fit.',
    subtext: 'Low-fit opportunities fade into the background. High-fit contracts are pulled to the center of your capability profile, ranked by objective multi-dimensional alignment.'
  },
  {
    id: 'explain',
    num: '04',
    name: 'EXPLAIN',
    headline: "Don't just get a recommendation. Understand it.",
    subtext: 'A recommendation without an explanation is useless. WorkMatch breaks down exactly why an opportunity is suitable—along with potential concerns like short deadlines or timezone misalignment.'
  },
  {
    id: 'apply',
    num: '05',
    name: 'APPLY',
    headline: 'Turn a good match into a real application.',
    subtext: 'Transform verified match evidence directly into tailored proposals. WorkMatch references only verified profile facts—never fabricating unearned skills or risking your reputation.'
  },
  {
    id: 'learn',
    num: '06',
    name: 'LEARN',
    headline: 'Every decision makes your recommendations more personal.',
    subtext: 'Every time you save, apply, or dismiss an opportunity with a reason, WorkMatch adjusts your personalized preference architecture. Your ecosystem continuously evolves around you.'
  }
];

export const EcosystemStorySection: React.FC<EcosystemStorySectionProps> = ({
  onLaunchApp,
  onLoadDemoAndLaunch
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityNodeData>(OPPORTUNITY_NODES[0]);
  const [proposalTone, setProposalTone] = useState<'direct' | 'technical' | 'consultative'>('direct');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStage = STAGES[activeStageIndex];

  // Dynamic proposal preview tied to Section 5
  const tailoredProposal = `Hi,\n\nI reviewed your requirements for ${selectedOpp.title}. Based on verified production experience with ${selectedOpp.skills.slice(0, 3).join(', ')}, I can deliver this within your ${selectedOpp.timeEstimate} timeframe.\n\nMy declared rate fits your ${selectedOpp.budget} parameter, and I operate on an asynchronous-first cadence with zero friction.\n\nBest regards,\nAlex Vance`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredProposal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="ecosystem-story" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#22324F]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#22324F] text-[11px] font-mono text-[#20D3C2] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2]" />
          <span>ONE EVOLVING 3D ECOSYSTEM</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] mb-4 font-display">
          How WorkMatch finds work that fits you.
        </h2>
        <p className="text-base text-[#9AA8BC] leading-relaxed">
          From uncurated internet listings to verified personalized recommendations, watch the Opportunity Ecosystem evolve in real-time.
        </p>

        {/* Interactive Stage Stepper */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {STAGES.map((s, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#20D3C2] text-[#0B1220] font-bold shadow-glow-teal'
                    : 'bg-[#111A2E] text-[#9AA8BC] hover:text-[#F4F7FB] border border-[#22324F] hover:border-[#20D3C2]/40'
                }`}
              >
                <span>{s.num}</span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: 3D Scene (Sticky on desktop) & Story Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Evolving 3D Ecosystem (7 cols desktop) */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="h-[460px] sm:h-[520px] md:h-[580px] w-full rounded-3xl overflow-hidden border border-[#22324F] shadow-card relative">
            <OpportunityScene
              stage={currentStage.id}
              selectedOpportunity={selectedOpp}
              onSelectOpportunity={setSelectedOpp}
              onHoverOpportunity={opp => {
                if (opp) setSelectedOpp(opp);
              }}
              className="w-full h-full"
            />
          </div>

          {/* Bottom helper indicating active 3D dynamics */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#9AA8BC] px-2">
            <span className="flex items-center gap-1.5 text-[#20D3C2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2] animate-ping" />
              <span>3D State: {currentStage.name}</span>
            </span>
            <span>Click any node in 3D to inspect</span>
          </div>
        </div>

        {/* Right Column: Narrative Card & Real UI Integration (5 cols desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Story Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#172238] border border-[#22324F] shadow-card space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#20D3C2] uppercase tracking-wider block">
                STAGE {currentStage.num} · {currentStage.name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F7FB] font-display leading-snug">
                {currentStage.headline}
              </h3>
              <p className="text-sm text-[#9AA8BC] leading-relaxed pt-1">
                {currentStage.subtext}
              </p>
            </div>

            {/* STAGE-SPECIFIC INTERACTIVE UI INTEGRATIONS */}

            {/* Stage 1: DISCOVER UI */}
            {currentStage.id === 'discover' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-[#9AA8BC] flex items-center justify-between">
                  <span>Aggregated Sources:</span>
                  <span className="text-[#20D3C2]">Upwork, Fiverr, Freelancer</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#111A2E] border border-[#22324F]">
                    <span className="text-[#9AA8BC] text-[10px] block">TOTAL STREAM</span>
                    <span className="text-[#F4F7FB] font-bold text-base">3,420 Listings</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#111A2E] border border-[#22324F]">
                    <span className="text-[#9AA8BC] text-[10px] block">FILTERED NOISE</span>
                    <span className="text-[#F5B942] font-bold text-base">98.2% Rejected</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2: UNDERSTAND UI (8 Information Layers) */}
            {currentStage.id === 'understand' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-[#20D3C2] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>8 Information Layers Analyzed:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {['Skills', 'Experience', 'Budget', 'Time', 'Deadline', 'Difficulty', 'Communication', 'Risk'].map((layer, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#111A2E] border border-[#22324F] text-center text-[#F4F7FB]">
                      {layer}
                    </div>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-[#9AA8BC] pt-1">
                  ↓ Converts unstructured job descriptions into verifiable parameters.
                </div>
              </div>
            )}

            {/* Stage 3: MATCH UI (Score Filtering) */}
            {currentStage.id === 'match' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-[#20D3C2] font-semibold">
                  Personalized Fit Filtering:
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { title: 'Frontend Dashboard', score: 94, status: 'Top Fit', color: 'text-[#20D3C2]' },
                    { title: 'Python Automation', score: 91, status: 'Strong Fit', color: 'text-[#20D3C2]' },
                    { title: 'Data Analysis', score: 89, status: 'Strong Fit', color: 'text-[#5EE7DF]' },
                    { title: 'WordPress Fix', score: 72, status: 'Faded / Low Fit', color: 'text-[#9AA8BC]' }
                  ].map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#111A2E] border border-[#22324F] flex items-center justify-between">
                      <span className="text-[#F4F7FB]">{m.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#9AA8BC]">{m.status}</span>
                        <span className={`font-bold ${m.color}`}>{m.score} MATCH</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 4: EXPLAIN UI (Explainable Recommendation) */}
            {currentStage.id === 'explain' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#20D3C2] uppercase font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35D07F]" />
                    <span>Why this matches you:</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#111A2E] border border-[#22324F] space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-[#F4F7FB]">
                      <Check className="w-3.5 h-3.5 text-[#35D07F] mt-0.5 flex-shrink-0" />
                      <span>Strong skill overlap with your declared React 18 & TypeScript stack</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#F4F7FB]">
                      <Check className="w-3.5 h-3.5 text-[#35D07F] mt-0.5 flex-shrink-0" />
                      <span>Fits your open 20 hrs/week schedule without conflicting deadlines</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#F4F7FB]">
                      <Check className="w-3.5 h-3.5 text-[#35D07F] mt-0.5 flex-shrink-0" />
                      <span>Suitable difficulty matches your senior experience profile</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#F4F7FB]">
                      <Check className="w-3.5 h-3.5 text-[#35D07F] mt-0.5 flex-shrink-0" />
                      <span>Budget ($120 / $60/hr) exceeds your $50/hr target floor</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-[#F5B942] uppercase font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F5B942]" />
                    <span>Potential concern:</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5B942]/10 border border-[#F5B942]/20 text-xs text-[#F4F7FB] font-sans">
                    ⚠ Client requires initial kickoff sync within 48 hours of acceptance.
                  </div>
                </div>
              </div>
            )}

            {/* Stage 5: APPLY UI (Tailored Truthful Proposal) */}
            {currentStage.id === 'apply' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#20D3C2] font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Personalized Proposal Draft</span>
                  </span>
                  <span className="text-[#35D07F] text-[11px] flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>100% Verified Claims</span>
                  </span>
                </div>

                {/* Evidence badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A2E] text-[#35D07F] border border-[#35D07F]/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Relevant skill: React 18
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A2E] text-[#35D07F] border border-[#35D07F]/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Relevant project: Analytics UI
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A2E] text-[#35D07F] border border-[#35D07F]/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified experience: 4.5y
                  </span>
                </div>

                {/* Proposal Textarea preview */}
                <div className="p-3.5 rounded-xl bg-[#111A2E] border border-[#22324F] font-mono text-xs text-[#F4F7FB] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {tailoredProposal}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-[#111A2E] hover:bg-[#1C2943] text-[#F4F7FB] text-xs font-mono border border-[#22324F] transition-colors"
                  >
                    {isCopied ? 'Copied ✓' : 'Copy Draft'}
                  </button>
                  <button
                    onClick={onLoadDemoAndLaunch}
                    className="px-4 py-2 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <span>Open in Proposal Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 6: LEARN UI (Feedback Architecture) */}
            {currentStage.id === 'learn' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#22324F] space-y-3">
                  <div className="text-xs font-mono text-[#20D3C2] uppercase font-bold flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#20D3C2] animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Active Personalization Loop:</span>
                  </div>

                  {/* Animation sequence from prompt: APPLICATION -> OUTCOME -> USER FEEDBACK -> PERSONALIZATION */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA8BC] flex-wrap gap-1 py-1">
                    <span className="text-[#F4F7FB]">APPLICATION</span>
                    <span>→</span>
                    <span className="text-[#35D07F]">OUTCOME</span>
                    <span>→</span>
                    <span className="text-[#20D3C2]">USER FEEDBACK</span>
                    <span>→</span>
                    <span className="text-[#5EE7DF]">PERSONALIZATION ↺</span>
                  </div>

                  <p className="text-xs text-[#9AA8BC] leading-relaxed">
                    When you reject a job because &ldquo;rate too low&rdquo; or &ldquo;too many meetings,&rdquo; WorkMatch updates your scoring weights. The 3D ecosystem reorganizes dynamically around your updated profile.
                  </p>
                </div>

                <button
                  onClick={onLaunchApp}
                  className="w-full py-3 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-glow-teal"
                >
                  <span>Experience Personalized Matching</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Stepper Navigation buttons */}
            <div className="pt-4 border-t border-[#22324F] flex items-center justify-between">
              <button
                onClick={() => setActiveStageIndex(prev => Math.max(0, prev - 1))}
                disabled={activeStageIndex === 0}
                className="text-xs font-mono text-[#9AA8BC] hover:text-[#F4F7FB] disabled:opacity-30 disabled:hover:text-[#9AA8BC] transition-colors"
              >
                ← Previous Stage
              </button>

              <div className="text-xs font-mono text-[#9AA8BC]">
                {activeStageIndex + 1} / {STAGES.length}
              </div>

              <button
                onClick={() => setActiveStageIndex(prev => Math.min(STAGES.length - 1, prev + 1))}
                disabled={activeStageIndex === STAGES.length - 1}
                className="text-xs font-mono text-[#20D3C2] hover:text-[#5EE7DF] disabled:opacity-30 disabled:hover:text-[#20D3C2] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Next Stage</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
