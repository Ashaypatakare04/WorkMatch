import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Briefcase, Calendar, DollarSign, Layers, ExternalLink } from 'lucide-react';

interface SkillDetail {
  id: string;
  name: string;
  level: number;
  bar: string;
  verifiedProjects: string[];
  connections: string[];
}

const SKILLS_DATA: SkillDetail[] = [
  {
    id: 'react',
    name: 'React 18',
    level: 98,
    bar: '████████',
    verifiedProjects: ['Enterprise Analytics Dashboard (Sub-16ms latency)', 'Modular UI Component Library in Tailwind'],
    connections: ['Next.js 15', 'TypeScript', 'State Management']
  },
  {
    id: 'js',
    name: 'JavaScript / TypeScript',
    level: 95,
    bar: '███████',
    verifiedProjects: ['Decoupled Query Caching Layer', 'Strict Type-Safe API Client SDK'],
    connections: ['Async Pipelines', 'REST APIs', 'Node.js']
  },
  {
    id: 'python',
    name: 'Python Automation',
    level: 88,
    bar: '██████',
    verifiedProjects: ['Distributed Data Ingestion Worker', 'Automated Multi-Channel Webhook Service'],
    connections: ['FastAPI', 'Playwright', 'PostgreSQL']
  },
  {
    id: 'ai',
    name: 'AI & LLM Integration',
    level: 92,
    bar: '████',
    verifiedProjects: ['Contextual RAG Retrieval Engine', 'Deterministic Schema Proposal Synthesizer'],
    connections: ['Embeddings', 'Prompt Architecture', 'Vector Search']
  }
];

export const InteractiveProfileScreen: React.FC = () => {
  const [activeSkillId, setActiveSkillId] = useState<string>('react');
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const activeSkill = SKILLS_DATA.find(s => s.id === activeSkillId) || SKILLS_DATA[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setCardTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto my-8 select-none perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="w-full rounded-3xl bg-[#0D1322] border-2 border-[#1B253B] shadow-2xl p-6 sm:p-9 transition-transform duration-200 ease-out relative overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#20D3C2]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Screen Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#1B253B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20D3C2] to-[#38BDF8] flex items-center justify-center font-bold text-[#0B1220] font-mono shadow-glow-teal">
              ID
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#20D3C2] uppercase font-bold block">
                YOUR CAPABILITY PROFILE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] font-display">
                Alex Vance · Senior Frontend Architect
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono text-[#35D07F] px-3 py-1 rounded-full bg-[#111A2E] border border-[#35D07F]/30 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Profile 100% Calibrated</span>
          </span>
        </div>

        {/* Interactive 2-Column Profile Body */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Skills List (Section 01) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#9AA8BC]">
              <span className="uppercase tracking-wider">Hover to Inspect Evidence:</span>
              <span className="text-[#20D3C2]">4 Core Skills</span>
            </div>

            <div className="space-y-2.5">
              {SKILLS_DATA.map(skill => {
                const isActive = activeSkillId === skill.id;
                return (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setActiveSkillId(skill.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#172238] border-[#20D3C2] shadow-lg shadow-[#20D3C2]/10 scale-[1.01]'
                        : 'bg-[#111A2E]/80 border-[#1B253B] hover:border-[#20D3C2]/40 hover:bg-[#172238]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#F4F7FB] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#20D3C2] animate-ping' : 'bg-slate-500'}`} />
                        <span>{skill.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#20D3C2]">{skill.level}%</span>
                    </div>

                    {/* Visual Bar representation as specified */}
                    <div className="w-full h-2 rounded-full bg-[#070A12] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#20D3C2] to-[#5EE7DF]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Emerging Skill Nodes & Verified Projects (Section 01) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#111A2E] border border-[#1B253B] space-y-5">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1B253B]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#20D3C2] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Project Evidence: {activeSkill.name}</span>
                </span>
                <span className="text-[10px] font-mono text-[#35D07F]">Zero Exaggeration</span>
              </div>

              <div className="space-y-2.5 mt-3">
                {activeSkill.verifiedProjects.map((proj, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0D1322] border border-[#1B253B] text-xs text-[#F4F7FB] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#35D07F] mt-0.5 flex-shrink-0" />
                    <span>{proj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-node connections */}
            <div>
              <span className="text-[10px] font-mono text-[#9AA8BC] uppercase tracking-wider block mb-2">
                Connected Capability Tensors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSkill.connections.map((c, i) => (
                  <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#172238] border border-[#22324F] text-[#5EE7DF]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile Boundaries Ticker */}
            <div className="pt-3 border-t border-[#1B253B] grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-[#0D1322] border border-[#1B253B]">
                <span className="text-[9px] text-[#9AA8BC] block">AVAILABILITY</span>
                <span className="text-[#F4F7FB] font-bold">20 hrs/wk</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0D1322] border border-[#1B253B]">
                <span className="text-[9px] text-[#9AA8BC] block">FLOOR RATE</span>
                <span className="text-[#35D07F] font-bold">$50/hr</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0D1322] border border-[#1B253B] col-span-2 sm:col-span-1">
                <span className="text-[9px] text-[#9AA8BC] block">DIFFICULTY</span>
                <span className="text-[#20D3C2] font-bold">Medium · High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
