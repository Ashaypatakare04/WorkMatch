import React, { useState } from 'react';
import { Check, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ComparisonJob {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  rate: string;
  skills: string;
  complexity: 'Low' | 'Moderate' | 'High';
  deadline: string;
  experienceMatch: string;
  clientRep: string;
  highlight: string;
}

const COMPARISON_JOBS: ComparisonJob[] = [
  {
    id: 'job-a',
    name: 'JOB A',
    title: 'Senior Frontend Architect',
    matchScore: 97,
    rate: '$50–65/hr',
    skills: 'React 18 · TypeScript · Vite',
    complexity: 'Moderate',
    deadline: '4 weeks (20h/wk)',
    experienceMatch: '100% Senior Overlap',
    clientRep: '★ 4.98 ($120k spent)',
    highlight: 'Optimal fit across all 6 profile dimensions'
  },
  {
    id: 'job-b',
    name: 'JOB B',
    title: 'Full Stack API Specialist',
    matchScore: 89,
    rate: '$45–55/hr',
    skills: 'Node.js · PostgreSQL · Next.js',
    complexity: 'Moderate',
    deadline: '6 weeks (15h/wk)',
    experienceMatch: '92% Capability Overlap',
    clientRep: '★ 4.90 ($40k spent)',
    highlight: 'Strong compensation with flexible delivery'
  },
  {
    id: 'job-c',
    name: 'JOB C',
    title: 'Rapid MVP Web Developer',
    matchScore: 76,
    rate: '$35/hr',
    skills: 'Vue · PHP · Tailwind CSS',
    complexity: 'Low',
    deadline: 'Urgent 5 days',
    experienceMatch: 'Partial Stack Match',
    clientRep: '★ 4.60 ($5k spent)',
    highlight: 'Below your primary $50/hr target floor'
  }
];

export const OpportunityComparisonCards: React.FC = () => {
  const [activeJobId, setActiveJobId] = useState<string>('job-a');

  return (
    <div className="w-full max-w-6xl mx-auto my-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {COMPARISON_JOBS.map(job => {
          const isSelected = activeJobId === job.id;
          const isTop = job.matchScore >= 95;
          return (
            <div
              key={job.id}
              onMouseEnter={() => setActiveJobId(job.id)}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#172238] to-[#0D1322] border-[#20D3C2] shadow-2xl shadow-[#20D3C2]/15 -translate-y-3 scale-[1.02]'
                  : 'bg-[#0D1322] border-[#1B253B] hover:border-[#20D3C2]/40 opacity-80'
              }`}
            >
              <div className="space-y-4">
                {/* Top Badge & Score */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1B253B]">
                  <span className="text-xs font-mono font-bold text-[#9AA8BC] uppercase tracking-wider">
                    {job.name}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold font-mono ${isTop ? 'text-[#20D3C2]' : job.matchScore >= 85 ? 'text-[#5EE7DF]' : 'text-[#9AA8BC]'}`}>
                      {job.matchScore}%
                    </span>
                    <span className="text-[10px] font-mono text-[#9AA8BC]">MATCH</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#F4F7FB] font-display">
                    {job.title}
                  </h4>
                  <p className="text-xs font-mono text-[#20D3C2] mt-1 font-semibold">
                    {job.skills}
                  </p>
                </div>

                {/* Multidimensional Parameters Comparison */}
                <div className="space-y-2 text-xs font-mono pt-2 border-t border-[#1B253B]">
                  <div className="flex justify-between text-[#9AA8BC]">
                    <span>Rate Alignment:</span>
                    <span className="text-[#F4F7FB] font-bold">{job.rate}</span>
                  </div>
                  <div className="flex justify-between text-[#9AA8BC]">
                    <span>Scope Complexity:</span>
                    <span className="text-[#F4F7FB]">{job.complexity}</span>
                  </div>
                  <div className="flex justify-between text-[#9AA8BC]">
                    <span>Timeline:</span>
                    <span className="text-[#F4F7FB]">{job.deadline}</span>
                  </div>
                  <div className="flex justify-between text-[#9AA8BC]">
                    <span>Client Trust:</span>
                    <span className="text-[#35D07F] font-semibold">{job.clientRep}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070A12] border border-[#1B253B] text-[11px] text-[#9AA8BC] flex items-start gap-2">
                  {job.matchScore >= 85 ? (
                    <Check className="w-3.5 h-3.5 text-[#35D07F] mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F5B942] mt-0.5 flex-shrink-0" />
                  )}
                  <span>{job.highlight}</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1B253B]">
                <button
                  className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#20D3C2] text-[#0B1220] shadow-glow-teal'
                      : 'bg-[#111A2E] text-[#9AA8BC] border border-[#1B253B]'
                  }`}
                >
                  <span>Select for Review</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
