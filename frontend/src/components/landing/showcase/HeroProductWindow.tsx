import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Filter, ShieldCheck, Zap, ArrowRight, RefreshCw } from 'lucide-react';

interface HeroProductWindowProps {
  onSelectJob?: (jobTitle: string) => void;
}

export const HeroProductWindow: React.FC<HeroProductWindowProps> = ({ onSelectJob }) => {
  const [scanStep, setScanStep] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Auto-cycling 6-second demonstration of the product engine:
  // Step 0: Profile Loaded
  // Step 1: Scanning Profile & Extracting Capability Vectors
  // Step 2: Signals Emitted to Opportunity Network
  // Step 3: Filtering & Locking High-Fit Opportunities
  useEffect(() => {
    const timer = setInterval(() => {
      setScanStep(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto my-6 perspective-1000 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Browser Window Frame */}
      <div
        className="w-full rounded-2xl md:rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-[0_20px_60px_-15px_rgba(11,18,32,0.85)] overflow-hidden transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`
        }}
      >
        {/* Browser Top Navigation Bar */}
        <div className="px-4 py-3 bg-[#111A2E] border-b border-[#1B253B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F05D6C]/80" />
            <span className="w-3 h-3 rounded-full bg-[#F5B942]/80" />
            <span className="w-3 h-3 rounded-full bg-[#35D07F]/80" />
            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-3 py-1 rounded-lg bg-[#070A12] border border-[#1B253B] text-[11px] font-mono text-[#9AA8BC]">
              <span className="text-[#20D3C2]">https://</span>
              <span>app.workmatch.ai/engine/live-stream</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#20D3C2]/15 text-[#20D3C2] text-[10px] font-mono font-bold border border-[#20D3C2]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2] animate-pulse" />
              <span>LIVE AI ENGINE</span>
            </span>
          </div>
        </div>

        {/* Browser Workspace Content */}
        <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch bg-gradient-to-b from-[#0D1322] to-[#070A12]">
          {/* Left Panel: User Profile Card (ASHAY - Frontend Developer) */}
          <div className="md:col-span-5 rounded-2xl bg-[#111A2E] border border-[#1B253B] p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
            {/* Visual Scanline Effect during Step 1 */}
            {scanStep === 1 && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#20D3C2] to-transparent animate-scanline pointer-events-none" />
            )}

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1B253B]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20D3C2] to-[#38BDF8] flex items-center justify-center font-bold text-[#0B1220] font-mono text-sm shadow-glow-teal">
                    AV
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F4F7FB] font-display">ASHAY</h4>
                    <p className="text-xs text-[#20D3C2] font-mono">Frontend Developer</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#35D07F]/15 text-[#35D07F] border border-[#35D07F]/30 font-semibold">
                  Verified
                </span>
              </div>

              {/* Skills Inventory */}
              <div className="py-4 space-y-2">
                <span className="text-[10px] font-mono text-[#9AA8BC] uppercase tracking-wider block">
                  Declared Skill Matrix:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'React 18', level: '98%' },
                    { name: 'JavaScript', level: '96%' },
                    { name: 'Firebase', level: '92%' },
                    { name: 'Python', level: '88%' },
                    { name: 'AI Engineering', level: '90%' }
                  ].map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#172238] border border-[#22324F] text-xs font-mono text-[#F4F7FB] flex items-center gap-1.5 transition-colors hover:border-[#20D3C2]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20D3C2]" />
                      <span>{s.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience, Projects & Preferences */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-[#070A12] border border-[#1B253B]">
                  <span className="text-[9px] text-[#9AA8BC] block">EXPERIENCE</span>
                  <span className="text-[#F4F7FB] font-bold">4.5 Yrs</span>
                </div>
                <div className="p-2 rounded-xl bg-[#070A12] border border-[#1B253B]">
                  <span className="text-[9px] text-[#9AA8BC] block">PROJECTS</span>
                  <span className="text-[#20D3C2] font-bold">12 Verified</span>
                </div>
                <div className="p-2 rounded-xl bg-[#070A12] border border-[#1B253B]">
                  <span className="text-[9px] text-[#9AA8BC] block">MIN RATE</span>
                  <span className="text-[#35D07F] font-bold">$40/hr</span>
                </div>
              </div>
            </div>

            {/* Live Scan State Badge */}
            <div className="mt-4 pt-3 border-t border-[#1B253B] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#9AA8BC]">Profile Status:</span>
              <span className="text-[#20D3C2] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#20D3C2]" />
                {scanStep === 0 && 'Profile Ready'}
                {scanStep === 1 && 'Scanning Profile Tensors...'}
                {scanStep === 2 && 'Routing Capability Signals...'}
                {scanStep === 3 && 'Match Weights Calibrated'}
              </span>
            </div>
          </div>

          {/* Center Column: Signal Transmission Bridge (Hidden on small screens) */}
          <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center space-y-3">
            <div className="text-[9px] font-mono text-[#20D3C2] uppercase font-bold tracking-widest text-center">
              AI SIGNAL ROUTER
            </div>
            {/* Animated Laser Arrow Line */}
            <div className="w-full relative flex items-center justify-center">
              <svg className="w-full h-8" viewBox="0 0 100 24" fill="none">
                <line x1="0" y1="12" x2="100" y2="12" stroke="#22324F" strokeWidth="2" strokeDasharray="3 3" />
                <line
                  x1="0"
                  y1="12"
                  x2={scanStep >= 2 ? '100' : '40'}
                  y2="12"
                  stroke="#20D3C2"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />
                <circle cx={scanStep >= 2 ? '90' : '30'} cy="12" r="4" fill="#5EE7DF" className="animate-ping" />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-[#9AA8BC] text-center">
              {scanStep >= 2 ? 'Evaluating Feed' : 'Synthesizing'}
            </span>
          </div>

          {/* Right Panel: Auto-Filtered Relevant Opportunities Stream */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#9AA8BC] pb-1">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#20D3C2]" />
                <span>Relevant Opportunities Found:</span>
              </span>
              <span className="text-[#20D3C2] font-bold">4 Verified Matches</span>
            </div>

            {/* List of Matched Jobs */}
            {[
              { title: 'Frontend Developer', platform: 'Upwork', rate: '$45–60/hr', match: 97, tag: 'Top Match', isLocked: scanStep >= 2 },
              { title: 'React Developer', platform: 'Direct', rate: '$55/hr', match: 94, tag: 'High Overlap', isLocked: scanStep >= 2 },
              { title: 'AI Web Developer', platform: 'Fiverr', rate: '$65/hr', match: 91, tag: 'Emerging Fit', isLocked: scanStep >= 2 },
              { title: 'Full Stack Developer', platform: 'Upwork', rate: '$50/hr', match: 88, tag: 'Viable Option', isLocked: scanStep >= 2 }
            ].map((job, idx) => (
              <div
                key={idx}
                onClick={() => onSelectJob && onSelectJob(job.title)}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                  job.isLocked
                    ? 'bg-[#111A2E] border-[#20D3C2]/60 shadow-md hover:border-[#20D3C2] hover:bg-[#172238]'
                    : 'bg-[#111A2E]/50 border-[#1B253B] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#070A12] text-[#9AA8BC] border border-[#1B253B]">
                      {job.platform}
                    </span>
                    <h5 className="text-xs font-bold text-[#F4F7FB]">{job.title}</h5>
                  </div>
                  <span className="text-[10px] font-mono text-[#9AA8BC] mt-0.5 block">
                    {job.rate} · {job.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-[#20D3C2]">
                      {job.match}%
                    </span>
                    <span className="text-[8px] font-mono text-[#9AA8BC] block">MATCH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Footer Status */}
        <div className="px-5 py-2.5 bg-[#0B101D] border-t border-[#1B253B] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#9AA8BC]">
          <span>WorkMatch continuously evaluates incoming listings against your verified profile.</span>
          <span className="text-[#35D07F] font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Zero manual keyword browsing required</span>
          </span>
        </div>
      </div>
    </div>
  );
};
