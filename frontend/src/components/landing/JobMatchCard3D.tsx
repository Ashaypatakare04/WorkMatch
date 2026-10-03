import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface JobMatchCard3DProps {
  onViewOpportunity?: () => void;
}

export const JobMatchCard3D: React.FC<JobMatchCard3DProps> = ({ onViewOpportunity }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto py-10 perspective-1000 flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor-label="VIEW MATCH"
    >
      {/* Surrounding Converging Nodes & Holographic Signal Orbiters (Section 5) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Converging Skill Node 1 */}
        <div
          className="absolute -top-4 -left-6 sm:left-4 px-3 py-1.5 rounded-xl bg-[#111A2E]/90 border border-[#20D3C2]/40 text-[11px] font-mono text-[#20D3C2] shadow-lg backdrop-blur-md transition-transform duration-500 flex items-center gap-1.5"
          style={{
            transform: `translate3d(${rotate.y * -1.5}px, ${rotate.x * 1.5}px, 40px) scale(${isHovered ? 1.05 : 1})`
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2] animate-ping" />
          <span>Skill Verified: React 18</span>
        </div>

        {/* Converging Requirement Node 2 */}
        <div
          className="absolute -top-4 -right-4 sm:right-6 px-3 py-1.5 rounded-xl bg-[#111A2E]/90 border border-[#5EE7DF]/40 text-[11px] font-mono text-[#5EE7DF] shadow-lg backdrop-blur-md transition-transform duration-500 flex items-center gap-1.5"
          style={{
            transform: `translate3d(${rotate.y * 1.5}px, ${rotate.x * -1.2}px, 35px) scale(${isHovered ? 1.05 : 1})`
          }}
        >
          <Sparkles className="w-3 h-3 text-[#5EE7DF]" />
          <span>Scope: Async Dashboard</span>
        </div>

        {/* Converging Experience Signal 3 */}
        <div
          className="absolute -bottom-4 -left-4 sm:left-6 px-3 py-1.5 rounded-xl bg-[#111A2E]/90 border border-[#35D07F]/40 text-[11px] font-mono text-[#35D07F] shadow-lg backdrop-blur-md transition-transform duration-500 flex items-center gap-1.5"
          style={{
            transform: `translate3d(${rotate.y * -1.2}px, ${rotate.x * -1.5}px, 45px) scale(${isHovered ? 1.05 : 1})`
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#35D07F]" />
          <span>4.5y Experience Match</span>
        </div>

        {/* Converging Budget Compatibility 4 */}
        <div
          className="absolute -bottom-4 -right-4 sm:right-6 px-3 py-1.5 rounded-xl bg-[#111A2E]/90 border border-[#38BDF8]/40 text-[11px] font-mono text-[#38BDF8] shadow-lg backdrop-blur-md transition-transform duration-500 flex items-center gap-1.5"
          style={{
            transform: `translate3d(${rotate.y * 1.8}px, ${rotate.x * 1.2}px, 30px) scale(${isHovered ? 1.05 : 1})`
          }}
        >
          <Zap className="w-3 h-3 text-[#38BDF8]" />
          <span>Escrow Funded ($35–50/hr)</span>
        </div>
      </div>

      {/* Physical 3D Floating Job Card Object (Section 5) */}
      <div
        className="w-full rounded-3xl bg-gradient-to-b from-[#172238] to-[#0D1322] border-2 border-[#20D3C2]/50 p-6 sm:p-8 shadow-2xl transition-all duration-200 ease-out relative overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${isHovered ? 25 : 0}px)`,
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(32, 211, 194, 0.25), 0 0 30px rgba(32, 211, 194, 0.15)'
            : '0 20px 40px -15px rgba(11, 18, 32, 0.8)'
        }}
      >
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1B253B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20D3C2] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#20D3C2]">
              Physical 3D Match Card
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#9AA8BC] px-2.5 py-0.5 rounded-full bg-[#111A2E] border border-[#1B253B]">
            Upwork Verified
          </span>
        </div>

        {/* Job Content - Exactly as in Section 5 Specification */}
        <div className="py-6 space-y-4">
          <div>
            <h4 className="text-2xl sm:text-3xl font-bold text-[#F4F7FB] font-display tracking-tight">
              Frontend Developer
            </h4>
            <p className="text-sm font-mono text-[#20D3C2] mt-1 font-semibold">
              React · JavaScript · Firebase
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#9AA8BC]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
              Remote Engagement
            </span>
            <span>•</span>
            <span className="text-[#F4F7FB] font-semibold">$35–50/hr</span>
            <span>•</span>
            <span>20 hrs/week</span>
          </div>

          {/* Signature 97% Match Display */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#1B253B] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#9AA8BC] uppercase block">
                COMPATIBILITY SIGNAL
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#20D3C2] leading-none">
                97%
              </span>
              <span className="text-xs font-mono font-bold text-[#20D3C2] ml-1.5">MATCH</span>
            </div>

            <div className="text-right text-[11px] font-mono text-[#35D07F] space-y-0.5">
              <div>✓ Skills 98% Overlap</div>
              <div>✓ Schedule 100% Free</div>
              <div>✓ Rate Above Target</div>
            </div>
          </div>
        </div>

        {/* Card Action Button */}
        <div className="pt-2">
          <button
            onClick={onViewOpportunity}
            className="w-full py-3.5 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] font-bold text-xs font-mono transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-glow-teal"
          >
            <span>View Opportunity</span>
            <ArrowRight className="w-4 h-4 text-[#0B1220]" />
          </button>
        </div>
      </div>
    </div>
  );
};
