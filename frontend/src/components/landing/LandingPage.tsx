import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  Briefcase,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bot,
  Play,
  Award,
  Radio,
  BarChart3,
  FileText,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLoadDemoAndLaunch: () => void;
  isLoadingDemo?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLoadDemoAndLaunch,
  isLoadingDemo = false
}) => {
  // Interactive Simulator State
  const [simSkillFit, setSimSkillFit] = useState<number>(94);
  const [simHourlyRate, setSimHourlyRate] = useState<number>(85);
  const [simClientRating, setSimClientRating] = useState<number>(4.9);
  const [simComplexity, setSimComplexity] = useState<'Simple' | 'Medium' | 'Complex'>('Simple');

  // Interactive Cockpit Mode
  const [cockpitMode, setCockpitMode] = useState<'MANUAL' | 'ASSISTED' | 'AUTOMATIC'>('AUTOMATIC');

  // Proposal Persona Studio State
  const [activePersona, setActivePersona] = useState<'direct' | 'technical' | 'consultative'>('direct');

  // ROI Calculator State
  const [monthlyProposals, setMonthlyProposals] = useState<number>(35);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Computed Simulator Score
  const complexityWeight = simComplexity === 'Simple' ? 1.0 : simComplexity === 'Medium' ? 0.85 : 0.7;
  const computedScore = Math.min(
    99,
    Math.round(
      simSkillFit * 0.45 +
      (Math.min(simHourlyRate, 120) / 120) * 100 * 0.25 +
      (simClientRating / 5.0) * 100 * 0.15 +
      complexityWeight * 100 * 0.15
    )
  );

  // Computed ROI
  const hoursSaved = Math.round(monthlyProposals * 0.65);
  const connectsSaved = Math.round(monthlyProposals * 6.5);
  const estDollarConnects = (connectsSaved * 0.15).toFixed(2);
  const estExtraEarnings = (hoursSaved * 50).toLocaleString();

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Decorative Mesh Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[600px] bg-indigo-500/5 blur-[160px]" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 radial-mask" />
      </div>

      {/* Floating Top Navigation Header */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-header rounded-2xl sm:rounded-full border border-white/10 px-4 sm:px-6 py-3 shadow-2xl backdrop-blur-xl flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/25">
              <div className="w-full h-full bg-surface-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                  <path d="M7 10L12 22L16 13L20 22L25 10" stroke="url(#nav-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="nav-grad" x1="7" y1="10" x2="25" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg font-display tracking-tight text-white">WorkMatch</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition">Features</button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition">Match Simulator</button>
            <button onClick={() => handleScrollTo('studio')} className="hover:text-white transition">Proposal Studio</button>
            <button onClick={() => handleScrollTo('comparison')} className="hover:text-white transition">Anti-Slop Matrix</button>
            <button onClick={() => handleScrollTo('roi')} className="hover:text-white transition">ROI Calculator</button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition">FAQ</button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition hover:bg-white/[0.04]"
            >
              {isLoadingDemo ? 'Loading Sandbox...' : '1-Click Demo'}
            </button>
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={onLaunchApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-surface-950 text-xs font-bold"
            >
              App
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-900 border border-white/10 text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 glass-card rounded-2xl border border-white/10 space-y-3 shadow-2xl animate-fadeIn">
            <button onClick={() => handleScrollTo('features')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">Features</button>
            <button onClick={() => handleScrollTo('simulator')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">Match Simulator</button>
            <button onClick={() => handleScrollTo('studio')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">Proposal Studio</button>
            <button onClick={() => handleScrollTo('comparison')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">Comparison</button>
            <button onClick={() => handleScrollTo('roi')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">ROI Calculator</button>
            <button onClick={() => handleScrollTo('faq')} className="block w-full text-left py-2 text-xs font-medium text-slate-300">FAQ</button>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full py-2.5 rounded-xl bg-surface-900 border border-white/10 text-xs font-semibold text-slate-200 text-center"
              >
                1-Click Demo Sandbox
              </button>
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 text-xs font-bold text-center"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-900/90 border border-emerald-500/30 text-xs text-slate-300 mb-6 shadow-glow-emerald backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">WorkMatch OS 2.0</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-medium">Autonomous Freelance Operating System</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Stop Chasing Jobs.{' '}
          <span className="gradient-text-emerald block mt-1">Let AI Win Them Truthfully.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Aggregates top freelance marketplaces in real time, computes deep 9-factor difficulty scores, and drafts verified proposals strictly constrained to your actual capabilities—with zero hallucinations.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={onLoadDemoAndLaunch}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-sm font-bold shadow-xl shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoadingDemo ? (
              <div className="w-4 h-4 rounded-full border-2 border-surface-950 border-t-transparent animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-surface-950 fill-current" />
            )}
            <span>{isLoadingDemo ? 'Seeding Sandbox...' : 'Launch Demo Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleScrollTo('simulator')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-900/90 hover:bg-surface-800 text-slate-200 text-sm font-semibold border border-white/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Test Match Simulator</span>
          </button>
        </div>

        {/* Micro Value Proposition Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Truthful Claims</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Hallucinations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Anti-Spam Throttles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Instant Kill Switch</span>
          </div>
        </div>

        {/* Interactive Floating Hero Cockpit */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Ambient frame glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />

          <div className="relative glass-card rounded-3xl border border-white/15 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl">
            {/* Cockpit Window Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-xs font-mono text-slate-400">workmatch-engine.live • 24/7 Scan Stream</span>
              </div>

              {/* Cockpit Mode Switcher */}
              <div className="flex items-center bg-surface-950 p-1 rounded-xl border border-white/10 text-xs">
                {(['MANUAL', 'ASSISTED', 'AUTOMATIC'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCockpitMode(mode)}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      cockpitMode === mode
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'MANUAL' ? 'Alert Only' : mode === 'ASSISTED' ? 'Co-Pilot' : 'Autonomous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cockpit Visual Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
              {/* Left 2 Cols: High Match Upwork Opportunity Card Simulation */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-surface-950/80 border border-emerald-500/30 space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="badge-upwork px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Upwork Enterprise
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ⚡ Top 1% Match
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Posted 4m ago</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-white">
                      Senior TypeScript &amp; React Architect for High-Throughput Analytics Dashboard
                    </h3>
                  </div>

                  {/* Radial Match Indicator */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 min-w-[70px] text-center">
                    <span className="text-2xl font-black font-mono text-emerald-400">98%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300 font-mono">Match</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  Looking for an elite full-stack engineer experienced in Vite, SQLite, real-time WebSockets, and modern data visualization. Must have proven capability shipping production apps.
                </p>

                {/* Micro Criteria Progress Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-[11px]">
                  <div className="p-2 rounded-xl bg-surface-900/60 border border-white/[0.04]">
                    <span className="text-slate-400 block text-[10px]">Skill Overlap</span>
                    <span className="font-mono text-emerald-400 font-bold">100% Fit</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-900/60 border border-white/[0.04]">
                    <span className="text-slate-400 block text-[10px]">Budget Quality</span>
                    <span className="font-mono text-white font-bold">$95 – $125/hr</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-900/60 border border-white/[0.04]">
                    <span className="text-slate-400 block text-[10px]">Client Trust</span>
                    <span className="font-mono text-cyan-400 font-bold">★ 4.98 ($120k+)</span>
                  </div>
                </div>

                {/* Why It Matched Insight Strip */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Exact match with 3 verified profile skills (TypeScript, React, Performance Optimization)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">0 Connect Waste</span>
                </div>
              </div>

              {/* Right Col: Autonomous Dispatch Live Status */}
              <div className="space-y-4">
                {/* Truth Shield Card */}
                <div className="p-4 rounded-2xl bg-surface-950/80 border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Truth Verification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Enforced</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero unverified skills claimed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Experience bounds sanitized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Client payment safety verified</span>
                    </div>
                  </div>
                </div>

                {/* Operating Mode Status Card */}
                <div className="p-4 rounded-2xl bg-surface-950/80 border border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Current Execution State
                  </span>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {cockpitMode === 'MANUAL'
                        ? 'Scouting & Dispatching Instant Alerts'
                        : cockpitMode === 'ASSISTED'
                        ? 'Drafting Tailored Truthful Proposals'
                        : 'Autonomous Auto-Dispatch (Within Budget)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {cockpitMode === 'AUTOMATIC'
                      ? 'Proposals submit strictly when score ≥ 85% and cost ≤ 12 connects.'
                      : 'Requires your explicit review and one-click authorization.'}
                  </p>
                </div>
              </div>
            </div>

            {/* High-Fidelity Cockpit Studio Render */}
            <div className="mt-8 pt-6 border-t border-white/10 relative rounded-2xl overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/images/hero-cockpit.jpg"
                  alt="WorkMatch Autonomous Freelance OS Command Cockpit"
                  className="w-full h-auto max-h-[460px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl glass-card backdrop-blur-xl border border-white/15">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald" />
                    <div>
                      <span className="font-semibold text-white text-xs block">Live Multi-Marketplace Command Center</span>
                      <span className="text-[11px] text-slate-400">Continuous 24/7 scanning, instant scoring, and truthful proposal studio</span>
                    </div>
                  </div>

                  <button
                    onClick={onLoadDemoAndLaunch}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Launch Live Interactive Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quantitative Proof Strip */}
      <section className="relative z-10 border-y border-white/[0.08] bg-surface-900/40 backdrop-blur-lg py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">$4.2M+</div>
              <div className="text-xs text-slate-400 mt-1">Opportunity Value Evaluated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">98.4%</div>
              <div className="text-xs text-slate-400 mt-1">Proposal Truthfulness Ratio</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tracking-tight">&lt; 15ms</div>
              <div className="text-xs text-slate-400 mt-1">Difficulty Assessment Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400 tracking-tight">0</div>
              <div className="text-xs text-slate-400 mt-1">Account Bans or Incidents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 5 Core Architectural Pillars */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Engine Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            Built for High-Earner Freelancers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Generic AI spam bots flood clients with garbage. WorkMatch was engineered from the ground up to guarantee relevance, precision, and reputation safety.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Platform Aggregation (Span 2) */}
          <div className="md:col-span-2 glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Universal Multi-Marketplace Sync
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Connect your Upwork, Fiverr, and global marketplace accounts through unified bi-directional adapters. Stream opportunities into one inbox, normalized with deduplication and client payment reputation metrics.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <span className="badge-upwork px-3 py-1 rounded-xl text-xs font-semibold">
                ✓ Upwork Partner OAuth &amp; Sync
              </span>
              <span className="badge-fiverr px-3 py-1 rounded-xl text-xs font-semibold">
                ✓ Fiverr Buyer Request Scanner
              </span>
              <span className="px-3 py-1 rounded-xl bg-surface-900 border border-white/10 text-slate-300 text-xs font-semibold font-mono">
                REST v2 Native Webhooks
              </span>
            </div>
          </div>

          {/* Card 2: 9-Factor Difficulty Engine (Span 1) */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                9-Factor Difficulty Formula
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We evaluate opportunities beyond mere keywords: skill overlap, technical simplicity, turnaround, client review score, and compensation ratio.
              </p>
            </div>

            {/* AI Radar Image Preview */}
            <div className="my-4 rounded-2xl overflow-hidden border border-white/10 relative h-36 group">
              <img
                src="/images/ai-radar.jpg"
                alt="Multidimensional Job Matching Neural Radar"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-surface-950/80 text-cyan-300 border border-cyan-500/30">
                Neural Match Radar
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Capability Alignment</span>
                <span className="text-emerald-400">Weight: 25%</span>
              </div>
              <div className="w-full bg-surface-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[85%]" />
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Truth Audit (Span 1) */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Deterministic Truth Audit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                WorkMatch strictly restricts proposals to verified skills in your capability inventory. Never risk your reputation by claiming frameworks or years of experience you do not possess.
              </p>
            </div>

            {/* Truth Security Shield Image Preview */}
            <div className="my-4 rounded-2xl overflow-hidden border border-white/10 relative h-36 group">
              <img
                src="/images/truth-shield.jpg"
                alt="Cryptographic Claim Verification & Security Shield"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-surface-950/80 text-emerald-300 border border-emerald-500/30">
                100% Truthful Guarantee
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
              ✓ Automated claim extraction &amp; sanitizer
            </div>
          </div>

          {/* Card 4: Autonomous Governance & Hard Circuit Breakers (Span 1) */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Hard Fail-Safe Throttles
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Declare maximum daily applications, cost caps per proposal, and risk filters. A global 1-click Emergency Kill Switch halts automated activity instantly.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-mono">
              🛑 1-Click Global Emergency Stop
            </div>
          </div>

          {/* Card 5: Financial Statement Ledger (Span 2) */}
          <div className="md:col-span-2 glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Bank-Statement Audit Ledger
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Every connect invested, job evaluated, and proposal dispatched is recorded into an institutional bank-style statement ledger. Export CSV reports to audit ROI and connect capital with exact dollar accuracy.
              </p>
            </div>

            {/* Financial Ledger Image Preview */}
            <div className="my-5 rounded-2xl overflow-hidden border border-white/10 relative h-48 group">
              <img
                src="/images/financial-ledger.jpg"
                alt="Quantum Advantage Activity & Connects Ledger"
                className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-950/80 text-cyan-300 border border-cyan-500/30">
                  Immutable Spend &amp; Return Metrics
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-surface-950/80 px-2 py-0.5 rounded">
                  +24.8% Real-Time ROI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-950/70 border border-white/[0.06]">
                <span className="text-slate-400 block text-[10px]">Estimated Direct Cost</span>
                <span className="font-bold text-emerald-400">$0.15 / Connect Tracked</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-950/70 border border-white/[0.06]">
                <span className="text-slate-400 block text-[10px]">Audit Export</span>
                <span className="font-bold text-cyan-400">CSV &amp; PDF Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Match Simulator */}
      <section id="simulator" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Interactive Test Drive
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            Test the Opportunity Match Formula
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Drag the sliders below to simulate how WorkMatch evaluates any freelance job in milliseconds.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 max-w-4xl mx-auto shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Skill Fit */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Capability Alignment with Job:</span>
                  <span className="font-mono text-emerald-400 font-bold">{simSkillFit}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simSkillFit}
                  onChange={e => setSimSkillFit(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-surface-900 rounded-lg"
                />
              </div>

              {/* Slider 2: Hourly Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Offered Hourly Rate / Budget:</span>
                  <span className="font-mono text-cyan-400 font-bold">${simHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={simHourlyRate}
                  onChange={e => setSimHourlyRate(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-surface-900 rounded-lg"
                />
              </div>

              {/* Slider 3: Client Rating */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">Client Rating &amp; Payment History:</span>
                  <span className="font-mono text-amber-400 font-bold">★ {simClientRating.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={simClientRating}
                  onChange={e => setSimClientRating(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-surface-900 rounded-lg"
                />
              </div>

              {/* Selector: Complexity */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-200 block">Project Turnaround &amp; Scope:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Simple', 'Medium', 'Complex'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSimComplexity(c)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        simComplexity === c
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-surface-950 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Instant Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-950/90 border border-white/10 text-center space-y-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                Calculated Match Score
              </span>

              <div className="relative inline-flex items-center justify-center">
                <div className={`text-6xl font-black font-mono tracking-tight ${
                  computedScore >= 85 ? 'text-emerald-400' : computedScore >= 70 ? 'text-cyan-400' : 'text-amber-400'
                }`}>
                  {computedScore}%
                </div>
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
                {computedScore >= 85 ? (
                  <span className="text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
                    High Match • Auto-Approved
                  </span>
                ) : computedScore >= 70 ? (
                  <span className="text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                    Moderate Match • Assisted Review
                  </span>
                ) : (
                  <span className="text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                    Low Fit • Auto-Dismissed
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-left text-xs text-slate-300 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{simSkillFit >= 80 ? 'Verified skill set passes truth audit' : 'Partial skill overlap'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{simHourlyRate >= 60 ? 'Compensation exceeds target hourly minimum' : 'Budget below ideal tier'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{simClientRating >= 4.5 ? 'Client reputation verified low-risk' : 'Client risk flag detected'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Proposal Persona Studio */}
      <section id="studio" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Proposal Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            Authentic Proposals That Win
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            See the contrast between generic AI boilerplates and WorkMatch truthful, client-focused proposal tailoring.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 max-w-4xl mx-auto space-y-6">
          {/* Persona Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pb-4 border-b border-white/10">
            {[
              { id: 'direct', label: 'Direct & Value-First', tag: 'Highest Conversion' },
              { id: 'technical', label: 'Technical Specialist', tag: 'Architect & Senior Roles' },
              { id: 'consultative', label: 'Consultative Partner', tag: 'Enterprise & Strategy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePersona(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activePersona === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-950 shadow-md'
                    : 'bg-surface-900/80 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  activePersona === tab.id ? 'bg-surface-950/20 text-surface-950' : 'bg-surface-800 text-slate-400'
                }`}>
                  {tab.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Proposal Preview Box */}
          <div className="p-5 sm:p-7 rounded-2xl bg-surface-950/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Truth Audit: 100% Validated Against Profile Skills
              </span>
              <span className="text-[10px] font-mono text-slate-500">128 Words • Sub-1min Reading Time</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed space-y-3 bg-surface-900/50 p-4 rounded-xl border border-white/[0.04]">
              {activePersona === 'direct' && (
                <>
                  <p>
                    Hi <span className="text-slate-400">[Client]</span>, I reviewed your dashboard performance bottlenecks. You need sub-100ms analytics queries with real-time UI updates without blocking the main event thread.
                  </p>
                  <p>
                    I have direct production experience architecting <span className="text-emerald-400 font-semibold font-mono">React</span> with <span className="text-emerald-400 font-semibold font-mono">TypeScript</span> and optimizing SQLite query indexing. In a recent project, we achieved a 65% reduction in dashboard latency using memoized selector hooks and virtualized scrolling.
                  </p>
                  <p>
                    I can take this on starting tomorrow. Here is the first step I would take on day one...
                  </p>
                </>
              )}

              {activePersona === 'technical' && (
                <>
                  <p>
                    Greetings, regarding your specification for high-throughput state handling: your architecture requires strict decoupled state management to prevent unnecessary DOM re-renders.
                  </p>
                  <p>
                    My verified technical scope covers <span className="text-cyan-400 font-semibold font-mono">React 18</span> concurrency, <span className="text-cyan-400 font-semibold font-mono">TypeScript strict mode</span>, and memory-efficient data caching. I avoid heavy third-party bundles in favor of lean native primitives.
                  </p>
                  <p>
                    Happy to discuss schema migrations and API endpoint contracts on a quick technical sync.
                  </p>
                </>
              )}

              {activePersona === 'consultative' && (
                <>
                  <p>
                    Hello, looking at your project roadmap, the primary objective is ensuring your analytics scale cleanly as your user base doubles over the next quarter.
                  </p>
                  <p>
                    Beyond just writing the code, I focus on delivering clean maintainable architecture that your team can easily extend. We will structure the dashboard modules with zero hard dependencies and full automated test coverage.
                  </p>
                  <p>
                    Let&apos;s align on your key business milestones and release dates.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                ✓ Zero generic fluff like &ldquo;I am a hard worker with 10 years experience&rdquo;
              </span>
              <button onClick={onLaunchApp} className="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                <span>Try in Proposal Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Anti-Slop Table */}
      <section id="comparison" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            The Anti-Slop Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            How WorkMatch Compares
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            See why high-ticket freelancers choose deterministic truth over spam bots and manual searching.
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-900/90 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-300">Capability</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-500">Manual Job Search</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-rose-400">Generic AI Bots</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10">WorkMatch OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                <tr className="hover:bg-surface-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">Monitoring Speed</td>
                  <td className="py-4 px-6 text-slate-400">Hours spent refreshing feeds</td>
                  <td className="py-4 px-6 text-slate-400">Generic keyword scraping</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">24/7 Sub-second live sync</td>
                </tr>
                <tr className="hover:bg-surface-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">Opportunity Scoring</td>
                  <td className="py-4 px-6 text-slate-400">Subjective gut feeling</td>
                  <td className="py-4 px-6 text-rose-400">None (applies blindly)</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">9-Factor multi-criteria formula</td>
                </tr>
                <tr className="hover:bg-surface-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">Proposal Truthfulness</td>
                  <td className="py-4 px-6 text-slate-400">High effort, slow writing</td>
                  <td className="py-4 px-6 text-rose-400">Hallucinated skills &amp; fake claims</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">100% Enforced truthful audit</td>
                </tr>
                <tr className="hover:bg-surface-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">Marketplace Safety</td>
                  <td className="py-4 px-6 text-slate-400">Safe but exhausting</td>
                  <td className="py-4 px-6 text-rose-400">High risk of account ban</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">Circuit breakers + Instant Kill Switch</td>
                </tr>
                <tr className="hover:bg-surface-800/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">Financial Accountability</td>
                  <td className="py-4 px-6 text-slate-400">Untracked connect waste</td>
                  <td className="py-4 px-6 text-rose-400">Connects drained in hours</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">Official Bank-Style Audit Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ROI &amp; Connect Savings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            Calculate Your Monthly Time &amp; Capital Reclaimed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            See how much time and wasted connect capital WorkMatch recovers for you every single month.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 max-w-4xl mx-auto shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-200">How many proposals do you send per month?</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">{monthlyProposals} proposals</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={monthlyProposals}
                onChange={e => setMonthlyProposals(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-surface-900 rounded-lg"
              />
            </div>

            {/* ROI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div className="p-5 rounded-2xl bg-surface-950/80 border border-emerald-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Freelance Hours Saved</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">~{hoursSaved} hrs</div>
                <span className="text-[10px] text-emerald-500/80">Every month</span>
              </div>

              <div className="p-5 rounded-2xl bg-surface-950/80 border border-cyan-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Connects Capital Rescued</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-400">~{connectsSaved}</div>
                <span className="text-[10px] text-cyan-500/80">${estDollarConnects} USD saved</span>
              </div>

              <div className="p-5 rounded-2xl bg-surface-950/80 border border-indigo-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Billable Value Unlocked</span>
                <div className="text-3xl font-extrabold font-mono text-white">${estExtraEarnings}</div>
                <span className="text-[10px] text-slate-500">At standard $50/hr billing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Will using WorkMatch get my Upwork or Fiverr account banned?',
              a: 'No. WorkMatch uses standard official partner OAuth credentials, human-in-the-loop assisted approval by default, and strict anti-spam rate limiting. It never sends mass indiscriminate applications.'
            },
            {
              q: 'Can I test WorkMatch without connecting my real platform accounts?',
              a: 'Yes! WorkMatch includes full Mock Simulation Mode with a 1-click demo seed dataset that creates realistic marketplace jobs, verified client profiles, and test proposals instantly.'
            },
            {
              q: 'How does the 100% Truthfulness Guarantee work?',
              a: 'WorkMatch strictly cross-references every sentence generated against your declared skills inventory. If an opportunity mentions a technology you do not possess, it never fabricates experience—it focuses solely on your actual strengths or lowers the score.'
            },
            {
              q: 'What is the Emergency Kill Switch?',
              a: 'A prominent safety control available on all views. Pressing it activates an immediate system-wide tripwire that disables all automated proposals in sub-5ms across every connected channel.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-400 transition"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Impact Conversion CTA */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative glass-card rounded-3xl p-8 sm:p-14 border border-emerald-500/30 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative space-y-6 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Immediate Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              Ready to win more contracts in 90% less time?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch the live demo workspace right now. No credit card, no API keys required to explore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-sm font-bold shadow-xl shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoadingDemo ? (
                  <div className="w-4 h-4 rounded-full border-2 border-surface-950 border-t-transparent animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-surface-950 fill-current" />
                )}
                <span>{isLoadingDemo ? 'Seeding Sandbox...' : 'Launch Live Demo Sandbox'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-surface-900 hover:bg-surface-800 text-white text-sm font-semibold border border-white/15 transition active:scale-[0.98]"
              >
                Open Workspace Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-surface-950/80 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-surface-950 rounded-[7px] flex items-center justify-center">
                <span className="font-bold text-[10px] text-emerald-400">W</span>
              </div>
            </div>
            <span className="text-slate-400 font-medium">WorkMatch AI Operating System</span>
            <span className="text-slate-700">|</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-emerald" />
              All Systems Operational
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={onLaunchApp} className="hover:text-white transition">Workspace</button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition">Simulator</button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition">FAQ</button>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} WorkMatch. Independent software for freelancers.
          </div>
        </div>
      </footer>
    </div>
  );
};
