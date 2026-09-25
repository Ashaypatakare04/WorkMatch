import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Radio,
  FileText,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bot,
  Search,
  Activity,
  Layers,
  Clock,
  DollarSign,
  Copy,
  Check,
  Cpu,
  Terminal,
  Lock,
  ExternalLink,
  RefreshCw,
  CheckCheck
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLoadDemoAndLaunch: () => void;
  isLoadingDemo?: boolean;
}

interface SampleOpportunity {
  id: string;
  tabLabel: string;
  platform: string;
  matchScore: number;
  timeAgo: string;
  title: string;
  description: string;
  skillOverlap: string;
  budget: string;
  clientRep: string;
  verifiedSkills: string;
  riskAssessment: string;
  factors: {
    skills: number;
    rate: number;
    reputation: number;
    scope: number;
    timeline: number;
  };
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLoadDemoAndLaunch,
  isLoadingDemo = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive Simulator State
  const [simSkillFit, setSimSkillFit] = useState<number>(87);
  const [simExperience, setSimExperience] = useState<number>(94);
  const [simHourlyRate, setSimHourlyRate] = useState<number>(85);
  const [simComplexity, setSimComplexity] = useState<'Simple' | 'Medium' | 'Complex'>('Medium');
  const [simDeadline, setSimDeadline] = useState<'Flexible' | 'Standard' | 'Urgent'>('Standard');

  // Interactive Cockpit Mode & Selected Opportunity
  const [cockpitMode, setCockpitMode] = useState<'MANUAL' | 'ASSISTED' | 'AUTOMATIC'>('ASSISTED');
  const [selectedOppIdx, setSelectedOppIdx] = useState<number>(0);

  // Proposal Studio Persona & Copy Feedback
  const [activePersona, setActivePersona] = useState<'direct' | 'technical' | 'consultative'>('direct');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // ROI Calculator State
  const [monthlyProposals, setMonthlyProposals] = useState<number>(35);

  // Atmosphere Background Selector State
  const [activeBackdrop, setActiveBackdrop] = useState<'cockpit' | 'command' | 'neural'>('cockpit');

  const backdropImages = {
    cockpit: '/images/hero-cockpit.jpg',
    command: '/images/tech-command-center.jpg',
    neural: '/images/neural-grid.jpg'
  };

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const sampleOpportunities: SampleOpportunity[] = [
    {
      id: 'ts-react',
      tabLabel: 'TypeScript Architect',
      platform: 'Upwork Enterprise',
      matchScore: 98,
      timeAgo: '4m ago',
      title: 'Senior TypeScript & React Architect for High-Throughput Analytics Dashboard',
      description: 'Looking for a senior full-stack engineer experienced in Vite, SQLite, real-time WebSockets, and modern data visualization. Must have proven capability shipping sub-100ms dashboard queries with zero main-thread jank.',
      skillOverlap: '100% Fit',
      budget: '$95 – $125/hr',
      clientRep: '★ 4.98 ($120k+ spent)',
      verifiedSkills: '3 verified profile skills (TypeScript, React 18, Database Optimization)',
      riskAssessment: 'Low Risk • Verified Payment • 100% Hire Rate',
      factors: {
        skills: 100,
        rate: 96,
        reputation: 98,
        scope: 94,
        timeline: 98
      }
    },
    {
      id: 'ai-agent',
      tabLabel: 'AI Workflow Lead',
      platform: 'Fiverr Pro',
      matchScore: 96,
      timeAgo: '12m ago',
      title: 'Autonomous Multi-Agent Orchestration & LLM Pipeline Architecture',
      description: 'Seeking a senior engineer to design reliable agent workflows with strict hallucination guards, tool calling, and deterministic state trees. Production experience with structured output validation required.',
      skillOverlap: '97% Fit',
      budget: '$4,200 Fixed',
      clientRep: '★ 5.0 (Top Rated Plus)',
      verifiedSkills: '4 verified profile skills (LLM Orchestration, Python, REST APIs, Tool-use)',
      riskAssessment: 'Low Risk • Verified Milestone Escrow • Clear Specification',
      factors: {
        skills: 97,
        rate: 94,
        reputation: 100,
        scope: 92,
        timeline: 96
      }
    },
    {
      id: 'nextjs-lead',
      tabLabel: 'Next.js 15 Lead',
      platform: 'Direct Inbound',
      matchScore: 94,
      timeAgo: '18m ago',
      title: 'Next.js 15 App Router & Server Actions Performance Refactor',
      description: 'Refactor high-traffic web application to Next.js 15 App Router. Improve Core Web Vitals, server components caching strategy, and reduce bundle footprint by memoizing data layers.',
      skillOverlap: '95% Fit',
      budget: '$110/hr',
      clientRep: '★ 4.95 ($85k+ spent)',
      verifiedSkills: '3 verified profile skills (Next.js, Tailwind CSS, SSR Architecture)',
      riskAssessment: 'Low Risk • Repeat Enterprise Client • High Feedback Score',
      factors: {
        skills: 95,
        rate: 92,
        reputation: 96,
        scope: 93,
        timeline: 94
      }
    }
  ];

  const proposalTexts: Record<string, string> = {
    direct: `Hi [Client],

I noticed you're looking for sub-100ms analytics queries with real-time UI updates without blocking the main event thread.

I have direct production experience architecting React 18 with TypeScript and optimizing SQLite query indexing. In a recent deployment, we achieved a 65% reduction in dashboard latency using memoized selector hooks and virtualized data table rendering.

I can take this on starting tomorrow. Here is the first step I would take on day one:
1. Profile event-loop bottlenecks using Chrome DevTools Performance panel.
2. Decouple websocket data ingest into a dedicated Web Worker to eliminate main thread blocking.
3. Establish benchmark latency metrics.

Best regards,
[Your Name]`,
    technical: `Greetings,

Regarding your specification for high-throughput state handling: your architecture requires strict decoupled state management to prevent unnecessary DOM re-renders during high-frequency websocket broadcasts.

My verified technical scope covers React 18 concurrent features, TypeScript strict mode, and memory-efficient data caching. I avoid heavy third-party bundles in favor of lean native primitives and virtualized viewports.

I would structure the ingestion pipeline as follows:
- Worker thread for packet deserialization and delta computation
- Memoized atomic selectors to isolate UI tree updates
- IndexedDB fallback for fast offline session recovery

Happy to review schema migrations and API endpoint contracts on a quick technical sync.`,
    consultative: `Hello,

Looking at your project roadmap, the primary objective is ensuring your analytics scale cleanly as your user base doubles over the next quarter.

Beyond just writing the code, I focus on delivering clean maintainable architecture that your team can easily extend. We will structure the dashboard modules with zero hard dependencies, documented API contracts, and comprehensive automated test coverage.

Our delivery milestones:
- Week 1: Audit existing bottlenecks & implement worker-based websocket ingestion.
- Week 2: Virtualized components & SQLite query optimization.
- Week 3: Verification against production telemetry with sub-100ms guarantees.

Let's align on your key business milestones and release schedule.`
  };

  const handleCopyProposal = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const currentOpp = sampleOpportunities[selectedOppIdx] || sampleOpportunities[0];

  // Computed Simulator Score (Mathematical 5-factor fit)
  const complexityWeight = simComplexity === 'Simple' ? 1.0 : simComplexity === 'Medium' ? 0.9 : 0.78;
  const deadlineWeight = simDeadline === 'Flexible' ? 1.0 : simDeadline === 'Standard' ? 0.92 : 0.84;
  const budgetRatio = Math.min(simHourlyRate, 130) / 130;

  const budgetScore = Math.round(budgetRatio * 100);
  const complexityScore = Math.round(complexityWeight * 100);
  const deadlineScore = Math.round(deadlineWeight * 100);

  const computedScore = Math.min(
    99,
    Math.round(
      simSkillFit * 0.35 +
      simExperience * 0.25 +
      budgetScore * 0.20 +
      complexityScore * 0.10 +
      deadlineScore * 0.10
    )
  );

  // SVG Radial Gauge Calculation
  const gaugeRadius = 54;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeStrokeDashoffset = gaugeCircumference - (computedScore / 100) * gaugeCircumference;

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

  // GSAP Animations (Clean, subtle entrance)
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-animate',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#06080e] text-slate-100 selection:bg-emerald-500 selection:text-white overflow-x-hidden font-sans"
    >
      {/* Background Ambience: Calm, restrained, high-end SaaS depth with architectural imagery */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Architectural background image overlay with smooth transition */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${backdropImages[activeBackdrop]})`,
            opacity: activeBackdrop === 'neural' ? 0.22 : 0.28,
            mixBlendMode: activeBackdrop === 'neural' ? 'screen' : 'luminosity',
            filter: 'brightness(1.06) contrast(1.04)'
          }}
        />

        {/* Deep gradient overlay to ensure perfect contrast and text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080e]/40 via-[#06080e]/85 to-[#06080e] z-0 pointer-events-none" />

        {/* Softened, subtle radial glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-500/8 via-teal-500/3 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[850px] right-[-120px] w-[500px] h-[500px] bg-cyan-500/[0.02] rounded-full blur-[150px]" />
        <div className="absolute top-[2200px] left-[-120px] w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[150px]" />

        {/* Quiet, low-contrast grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 radial-mask" />
      </div>

      {/* Telemetry Status Bar: Enterprise-grade operational bar with demo data transparency */}
      <div className="relative z-50 border-b border-white/[0.06] bg-[#070a12]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">SYSTEM: OPERATIONAL</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">MULTI-MARKETPLACE INTAKE ACTIVE</span>
            <span className="text-white/20 hidden md:inline">•</span>
            <span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-400 border border-white/[0.06]">
              SIMULATED DEMO ENVIRONMENT
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">LATENCY:</span>
              <span className="text-emerald-400 font-semibold">&lt; 15MS</span>
            </div>
            <span className="text-white/20 hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-500">PROFILE AUDIT:</span>
              <span className="text-slate-300 font-semibold">STRICT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pill Navigation Header */}
      <header className="relative z-50 pt-4 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-full bg-[#0b0f19]/90 border border-white/[0.08] px-5 sm:px-6 py-2.5 backdrop-blur-xl flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                WorkMatch
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
                AI 2.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => handleScrollTo('cockpit')} className="hover:text-white transition-colors">
              Opportunity Match
            </button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition-colors">
              Formula Simulator
            </button>
            <button onClick={() => handleScrollTo('studio')} className="hover:text-white transition-colors">
              Proposal Studio
            </button>
            <button onClick={() => handleScrollTo('comparison')} className="hover:text-white transition-colors">
              Comparison
            </button>
            <button onClick={() => handleScrollTo('roi')} className="hover:text-white transition-colors">
              ROI
            </button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition-colors">
              FAQ
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              {isLoadingDemo ? 'Seeding Sandbox...' : '1-Click Demo'}
            </button>
            <button
              onClick={onLaunchApp}
              className="px-4 py-1.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-semibold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onLaunchApp}
              className="px-3 py-1 rounded-full bg-white text-slate-950 text-xs font-semibold"
            >
              Launch
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.1] space-y-3 shadow-2xl backdrop-blur-xl">
            <button onClick={() => handleScrollTo('features')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              Features
            </button>
            <button onClick={() => handleScrollTo('cockpit')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              Opportunity Match
            </button>
            <button onClick={() => handleScrollTo('simulator')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              Formula Simulator
            </button>
            <button onClick={() => handleScrollTo('studio')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              Proposal Studio
            </button>
            <button onClick={() => handleScrollTo('comparison')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              Comparison
            </button>
            <button onClick={() => handleScrollTo('roi')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              ROI
            </button>
            <button onClick={() => handleScrollTo('faq')} className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white">
              FAQ
            </button>
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-semibold text-white text-center"
              >
                1-Click Demo Sandbox
              </button>
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-full bg-white text-slate-950 text-xs font-semibold text-center"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION: Clean Visual Hierarchy, High Contrast, Spacious */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 md:pt-28 pb-16 max-w-5xl mx-auto">
        {/* Release Pill Badge & Atmosphere Theme Switcher */}
        <div className="hero-animate mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">WorkMatch OS 2.0</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 font-medium">Autonomous Freelance Operating System</span>
          </div>

          <div className="inline-flex items-center bg-[#0d1322]/80 border border-white/[0.1] rounded-full p-1 backdrop-blur-md shadow-sm">
            {(['cockpit', 'command', 'neural'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setActiveBackdrop(mode)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono capitalize transition-all ${
                  activeBackdrop === mode
                    ? 'bg-white text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'cockpit' ? 'Cockpit' : mode === 'command' ? 'Command Deck' : 'Neural Mesh'}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Headline: Primary Visual Focal Point */}
        <h1 className="hero-animate text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl">
          Stop Chasing Jobs. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Let AI Win Them.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-animate text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Universal marketplace discovery, multi-factor fit scoring, and deterministic, zero-hallucination proposal dispatch across Upwork, Fiverr, and global platforms.
        </p>

        {/* Primary CTA Buttons */}
        <div className="hero-animate flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onLoadDemoAndLaunch}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 text-sm md:text-base px-7 py-3 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_16px_rgba(255,255,255,0.12)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoadingDemo ? (
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-current text-slate-950" />
            )}
            <span>{isLoadingDemo ? 'Seeding Sandbox...' : '1-Click Demo Sandbox'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => handleScrollTo('simulator')}
            className="w-full sm:w-auto bg-[#0b0f19] hover:bg-[#111726] text-slate-200 border border-white/[0.12] hover:border-white/[0.2] text-sm md:text-base px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Test Match Formula</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="hero-animate mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified Profile Claims</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mathematical Fit Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safety Controls (Kill Switch Armed)</span>
          </div>
        </div>
      </section>

      {/* 2. LIVE OPPORTUNITY MATCH SECTION (AI Command Cockpit with Connected Workflow) */}
      <section id="cockpit" className="relative z-10 py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="relative rounded-3xl card-primary p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.45)] border border-white/[0.08] overflow-hidden">
          {/* Subtle architectural background texture */}
          <div className="absolute inset-0 bg-[url('/images/tech-command-center.jpg')] bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent pointer-events-none" />

          {/* Cockpit Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Live Opportunity Match
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    REAL-TIME RADAR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                    (Sample Listing #8942)
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Mode Selector */}
            <div className="flex items-center bg-[#070a12] p-1 rounded-full border border-white/[0.08] text-xs self-start sm:self-auto">
              {(['MANUAL', 'ASSISTED', 'AUTOMATIC'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCockpitMode(mode)}
                  className={`px-3.5 py-1 rounded-full font-semibold transition-all ${
                    cockpitMode === mode
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'MANUAL' ? 'Alert Only' : mode === 'ASSISTED' ? 'Co-Pilot' : 'Autonomous'}
                </button>
              ))}
            </div>
          </div>

          {/* Connected Visual Pipeline Indicator (Requirement 5) */}
          <div className="py-3 border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-white/10 text-white flex items-center justify-center text-[9px] font-bold">1</span>
              <span className="text-white font-medium">Job Intake</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">2</span>
              <span className="text-emerald-400 font-medium">Truth Check</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-[9px] font-bold">3</span>
              <span className="text-teal-400 font-medium">Match Factors</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">4</span>
              <span className="text-white font-semibold">98% Fit Score</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full bg-white/10 text-white flex items-center justify-center text-[9px] font-bold">5</span>
              <span className="text-emerald-300 font-medium">Action & Dispatch</span>
            </div>
          </div>

          {/* Opportunity Selector Tabs */}
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Live Leads:
              </span>
              {sampleOpportunities.map((opp, idx) => (
                <button
                  key={opp.id}
                  onClick={() => setSelectedOppIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedOppIdx === idx
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedOppIdx === idx ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>{opp.tabLabel}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">{opp.matchScore}%</span>
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline-block">
              Simulated WebSocket Intake
            </span>
          </div>

          {/* Product Dashboard Visual Flow: JOB INTEL → MATCH FACTORS → AI ACTION */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Column 1: Job Intake & Verification (lg:col-span-5) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-white/10 text-white border border-white/15">
                    {currentOpp.platform}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Posted {currentOpp.timeAgo}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {currentOpp.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentOpp.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Offered Rate</span>
                    <span className="font-mono text-white font-bold">{currentOpp.budget}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Client Trust</span>
                    <span className="font-mono text-emerald-400 font-bold">{currentOpp.clientRep}</span>
                  </div>
                </div>
              </div>

              {/* Client & Job Verification Box (Requirement 3: Human-readable primary, technical secondary) */}
              <div className="p-3.5 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Client &amp; Job Verification
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                    TRUTH GUARD: STRICT
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-mono">✓</span>
                    <span>{currentOpp.verifiedSkills}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-mono">✓</span>
                    <span>{currentOpp.riskAssessment}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Match Factors & Star Match Score (lg:col-span-4) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Match Analysis
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">9-Factor Formula</span>
                </div>

                {/* Star Match Score Display (Requirement 6) */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-0.5">
                    MATCH SCORE
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {currentOpp.matchScore}%
                  </div>
                  <span className="inline-block text-[10px] font-mono text-emerald-300 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-1">
                    Excellent Match • Top 1% Lead
                  </span>
                </div>

                {/* Individual Scoring Bars */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-mono text-[11px]">Skills Overlap</span>
                      <span className="font-mono text-emerald-400 font-semibold">{currentOpp.factors.skills}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${currentOpp.factors.skills}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-mono text-[11px]">Rate Alignment</span>
                      <span className="font-mono text-emerald-400 font-semibold">{currentOpp.factors.rate}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${currentOpp.factors.rate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-mono text-[11px]">Client Trust Index</span>
                      <span className="font-mono text-teal-400 font-semibold">{currentOpp.factors.reputation}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${currentOpp.factors.reputation}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-mono text-[11px]">Scope Clarity</span>
                      <span className="font-mono text-cyan-400 font-semibold">{currentOpp.factors.scope}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${currentOpp.factors.scope}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="font-mono text-[11px]">Turnaround Feasibility</span>
                      <span className="font-mono text-emerald-400 font-semibold">{currentOpp.factors.timeline}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${currentOpp.factors.timeline}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center">
                Empirical Multi-Factor Breakdown
              </div>
            </div>

            {/* Column 3: AI Recommendation & Action (lg:col-span-3) */}
            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Action Workflow
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    CO-PILOT: APPROVED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                    <span>AI Recommendation</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Opportunity exceeds the 85% match standard. Personalized proposal drafted with zero fabricated claims.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>SAFETY CONTROLS:</span>
                    <span className="text-emerald-400 font-semibold">KILL SWITCH: ARMED</span>
                  </div>
                  <span className="text-white font-mono text-[11px] block">
                    {cockpitMode === 'MANUAL'
                      ? 'Manual Review Required'
                      : cockpitMode === 'ASSISTED'
                      ? '1-Click Review & Submit'
                      : 'Auto-Submit within 12 Connects'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => handleScrollTo('studio')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-all hover:scale-102 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Review Proposal in Studio</span>
                </button>
                <button
                  onClick={onLaunchApp}
                  className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-medium transition"
                >
                  Open in Workspace →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Proof Strip with Demo Data Transparency (Requirement 9 & 10) */}
      <section className="relative z-10 border-y border-white/[0.06] bg-[#070a12]/60 py-7">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.04] text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Platform Capabilities</span>
            <span className="text-emerald-400/80">SIMULATED BENCHMARK DATA</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">$4.2M+</div>
              <div className="text-xs text-slate-400 mt-1">Opportunity Volume Evaluated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">100%</div>
              <div className="text-xs text-slate-400 mt-1">Verified Profile Alignment</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-400 tracking-tight">&lt; 15ms</div>
              <div className="text-xs text-slate-400 mt-1">Multi-Factor Scoring Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">0</div>
              <div className="text-xs text-slate-400 mt-1">Account Incidents or Bans</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MINIATURE PRODUCT INTERFACES (Features with Human-Readable Terms & Demo Transparency) */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            Autonomous Precision. Zero Slop.
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Engineered for high-performing freelancers. Every subsystem eliminates connect waste, enforces truthful claims, and wins high-ticket contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Universal Radar Scout */}
          <div className="p-6 rounded-2xl card-primary flex flex-col justify-between border border-white/[0.08]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE SCANNING
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Universal Radar Scout</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Aggregates Upwork, Fiverr, and direct leads with sub-second websocket synchronization and deduplication.
                </p>
              </div>

              {/* Mini Radar Interface */}
              <div className="p-3.5 rounded-xl card-terminal space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    UNIVERSAL RADAR
                  </span>
                  <span className="text-emerald-400 font-semibold">24 new leads</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Upwork Enterprise</span>
                    <span className="text-white font-semibold">12</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fiverr Pro</span>
                    <span className="text-white font-semibold">7</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Direct Inbound</span>
                    <span className="text-white font-semibold">5</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Last scan: 12 sec ago</span>
                  <span className="text-emerald-400">Simulated Feed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Intake Latency</span>
              <span className="text-emerald-400 font-semibold">&lt; 15ms</span>
            </div>
          </div>

          {/* Card 2: Multi-Factor Fit Score */}
          <div className="p-6 rounded-2xl card-primary flex flex-col justify-between border border-white/[0.08]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  9-FACTOR ALGO
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Multi-Factor Fit Score</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Evaluates skill overlap, client spend history, hourly yield, and turnaround before you spend a connect.
                </p>
              </div>

              {/* Mini Fit Interface */}
              <div className="p-3.5 rounded-xl card-terminal space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-[11px]">
                  <span className="text-slate-400">MATCH SCORE</span>
                  <span className="text-emerald-400 font-bold text-sm">90%</span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Skills Match</span>
                      <span className="text-emerald-400">87%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="w-[87%] h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Experience</span>
                      <span className="text-teal-400">94%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-teal-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Budget Yield</span>
                      <span className="text-cyan-400">82%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="w-[82%] h-full bg-cyan-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Complexity</span>
                      <span className="text-slate-300">76%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="w-[76%] h-full bg-slate-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Threshold Standard</span>
              <span className="text-emerald-400 font-semibold">≥ 85% Auto</span>
            </div>
          </div>

          {/* Card 3: Client & Job Verification (Requirement 3: Preferred human-readable naming) */}
          <div className="p-6 rounded-2xl card-primary flex flex-col justify-between border border-white/[0.08]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  TRUTH GUARD: STRICT
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Client &amp; Job Verification</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Strict profile constraints ensure AI never invents skills, preserving your account reputation.
                </p>
              </div>

              {/* Mini Audit Interface */}
              <div className="p-3.5 rounded-xl card-terminal space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-[11px]">
                  <span className="text-slate-400">VERIFICATION CHECKS</span>
                  <span className="text-emerald-400 font-semibold">PASSED</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Profile Inventory</span>
                    <span className="text-emerald-400">✓ PASS</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Zero Hallucination</span>
                    <span className="text-emerald-400">✓ STRICT</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Rate Sanity Check</span>
                    <span className="text-emerald-400">✓ PASS</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Client Payment Risk</span>
                    <span className="text-teal-400">✓ LOW</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Safety Controls</span>
                  <span className="text-emerald-400 font-medium">Kill Switch: Armed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Fabricated Claims</span>
              <span className="text-emerald-400 font-semibold">0% Allowed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MATCH FORMULA SIMULATOR (Requirement 6: 90% Match Score is the Star) */}
      <section id="simulator" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Formula Simulator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            Test the Opportunity Match Formula
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Adjust the sliders below to simulate how WorkMatch mathematically evaluates any freelance job listing.
          </p>
        </div>

        <div className="p-6 sm:p-9 rounded-3xl card-primary max-w-4xl mx-auto border border-white/[0.08] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Skill Alignment */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Skill Alignment with Profile:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{simSkillFit}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simSkillFit}
                  onChange={e => setSimSkillFit(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                  aria-label="Skill Alignment"
                />
              </div>

              {/* Experience Depth */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Verified Experience Depth:</span>
                  <span className="font-mono text-teal-400 font-semibold">{simExperience}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={simExperience}
                  onChange={e => setSimExperience(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                  aria-label="Experience Depth"
                />
              </div>

              {/* Offered Rate / Budget */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Offered Hourly Rate / Budget:</span>
                  <span className="font-mono text-white font-semibold">${simHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={simHourlyRate}
                  onChange={e => setSimHourlyRate(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/10 rounded-lg"
                  aria-label="Hourly Rate"
                />
              </div>

              {/* Scope Complexity */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300 block">Project Complexity:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Simple', 'Medium', 'Complex'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSimComplexity(c)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        simComplexity === c
                          ? 'bg-white text-slate-950 border-white shadow-sm'
                          : 'bg-[#070a12] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline Urgency */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300 block">Turnaround Feasibility:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Flexible', 'Standard', 'Urgent'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setSimDeadline(d)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        simDeadline === d
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                          : 'bg-[#070a12] border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Radial Result Card (5 cols) - Star of the Section (Requirement 6) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#070a12] border border-white/[0.08] text-center space-y-4">
              {/* Radial Score Gauge Focal Point */}
              <div className="flex flex-col items-center justify-center my-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2 font-medium">
                  MATCH SCORE
                </span>

                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={gaugeRadius}
                      className="text-white/[0.06]"
                      strokeWidth="7"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={gaugeRadius}
                      strokeWidth="7"
                      strokeDasharray={gaugeCircumference}
                      strokeDashoffset={gaugeStrokeDashoffset}
                      strokeLinecap="round"
                      stroke={computedScore >= 85 ? '#10b981' : computedScore >= 70 ? '#14b8a6' : '#f59e0b'}
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Centered Score */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={`text-5xl font-extrabold font-mono tracking-tight leading-none ${
                      computedScore >= 85 ? 'text-emerald-400' : computedScore >= 70 ? 'text-teal-400' : 'text-amber-400'
                    }`}>
                      {computedScore}%
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                      {computedScore >= 85 ? 'High Fit' : computedScore >= 70 ? 'Moderate' : 'Low Fit'}
                    </span>
                  </div>
                </div>

                {/* Rating Label directly below score */}
                <div className="mt-3">
                  {computedScore >= 85 ? (
                    <span className="inline-block text-xs font-mono font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 rounded-full">
                      Excellent Match • Auto-Approved
                    </span>
                  ) : computedScore >= 70 ? (
                    <span className="inline-block text-xs font-mono font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/25 px-3.5 py-1 rounded-full">
                      Strong Match • Assisted Review
                    </span>
                  ) : (
                    <span className="inline-block text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3.5 py-1 rounded-full">
                      Below Threshold • Auto-Filtered
                    </span>
                  )}
                </div>
              </div>

              {/* Supporting Factor Bars */}
              <div className="space-y-2 text-left text-xs font-mono pt-3 border-t border-white/[0.06]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Skills Fit</span>
                    <span className="text-emerald-400 font-semibold">{simSkillFit}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${simSkillFit}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Experience</span>
                    <span className="text-teal-400 font-semibold">{simExperience}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full transition-all duration-300" style={{ width: `${simExperience}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Budget Yield</span>
                    <span className="text-white font-semibold">{budgetScore}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-white/90 rounded-full transition-all duration-300" style={{ width: `${budgetScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Complexity</span>
                    <span className="text-slate-300 font-semibold">{complexityScore}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-300" style={{ width: `${complexityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Deadline</span>
                    <span className="text-emerald-400 font-semibold">{deadlineScore}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${deadlineScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI PROPOSAL STUDIO: Professional Editor Layout (Requirement 8) */}
      <section id="studio" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Proposal Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            Authentic Proposals That Win
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Notice the difference: zero boilerplate greetings, zero hallucinated claims, and immediate value tailored to the client&apos;s technical scope.
          </p>
        </div>

        <div className="rounded-3xl card-primary max-w-4xl mx-auto border border-white/[0.08] overflow-hidden shadow-2xl">
          {/* Breadcrumb Workflow Strip */}
          <div className="px-6 py-3 bg-[#070a12] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300">1. Job Analyzed</span>
              <span className="text-white/20">→</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                2. Truth Audit Passed
              </span>
              <span className="text-white/20">→</span>
              <span className="text-white font-semibold">3. Proposal Synthesized</span>
            </div>

            <span className="text-[11px] text-slate-400">
              Target: Upwork #8942
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Persona Tabs */}
            <div className="flex items-center justify-center gap-2 flex-wrap pb-4 border-b border-white/[0.08]">
              {[
                { id: 'direct', label: 'Direct & Value-First', tag: 'Highest Conversion' },
                { id: 'technical', label: 'Technical Specialist', tag: 'Architect Roles' },
                { id: 'consultative', label: 'Consultative Partner', tag: 'Enterprise Strategy' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePersona(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-2 ${
                    activePersona === tab.id
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    activePersona === tab.id ? 'bg-slate-950/15 text-slate-950 font-bold' : 'bg-white/10 text-slate-400'
                  }`}>
                    {tab.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Realistic Editor Chrome (Requirement 8) */}
            <div className="rounded-2xl card-terminal overflow-hidden border border-white/[0.08]">
              {/* Editor Header Bar with Match Status */}
              <div className="px-5 py-3 bg-[#090d16] border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-medium">proposal-draft.md</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                    Match: 98%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    Simulated Preview
                  </span>
                </div>
              </div>

              {/* Proposal Content Body */}
              <div className="p-5 sm:p-7 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-text">
                {proposalTexts[activePersona]}
              </div>

              {/* Metadata & Actions Footer Bar */}
              <div className="px-5 py-3.5 bg-[#090d16] border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                {/* Metadata Tags */}
                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] flex-wrap">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Skills: Verified</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Tone: </span>
                    <span className="text-white capitalize">{activePersona}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Length: </span>
                    <span className="text-slate-300">128 words</span>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyProposal(proposalTexts[activePersona])}
                  className={`flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-semibold transition active:scale-95 border ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-white text-slate-950 hover:bg-slate-100 border-transparent shadow-sm'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON MATRIX: ANTI-SLOP (Visual Hierarchy & Scannability) */}
      <section id="comparison" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            The Anti-Slop Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            How WorkMatch Compares
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            See why serious freelancers choose deterministic truth over robotic spam scrapers and manual refreshing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Manual */}
          <div className="p-6 sm:p-7 rounded-2xl card-primary space-y-4 border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-semibold uppercase text-slate-400">Old Way</span>
                <span className="text-sm font-mono text-slate-500">MANUAL</span>
              </div>
              <h3 className="text-lg font-bold text-slate-200">Manual Job Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exhausting, slow, and reliant on intuition rather than empirical profitability data.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Hours lost refreshing multiple browser tabs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unscientific gut-feeling applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Slow drafting misses early high-visibility bid window</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Untracked connect capital waste</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Generic AI Bots */}
          <div className="p-6 sm:p-7 rounded-2xl card-primary space-y-4 border border-rose-500/20 bg-[#0e090f] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <span className="text-xs font-mono font-semibold uppercase text-rose-400">High Risk</span>
                <span className="text-sm font-mono text-rose-400">UNCONSTRAINED AI</span>
              </div>
              <h3 className="text-lg font-bold text-white">Generic AI Spam Bots</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cheap scrapers that flood clients with generic template spam, ruining client trust.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Canned templates flagged as spam by client filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Hallucinates skills &amp; experience you don&apos;t possess</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Severe risk of permanent Upwork account ban</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Drains connects on low-paying or scam jobs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: WorkMatch OS (The Standard) */}
          <div className="p-6 sm:p-7 rounded-2xl card-primary space-y-4 border border-emerald-500/30 bg-[#091119] shadow-[0_0_20px_rgba(16,185,129,0.06)] flex flex-col justify-between relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">The Pro Standard</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">WORKMATCH OS</span>
              </div>
              <h3 className="text-lg font-bold text-white">WorkMatch Intelligence</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deterministic truth enforcement, mathematically verified fit scores, and client-tailored proposals.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>24/7 Sub-second marketplace intake &amp; alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>9-Factor multi-dimensional match formula (≥ 85%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>100% Truthful audit bounded to verified skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Safety Controls &amp; institutional audit ledger</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ROI CALCULATOR */}
      <section id="roi" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ROI &amp; Connect Savings
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            Calculate Time &amp; Capital Reclaimed
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            See how much time and wasted connect capital WorkMatch recovers for you each month.
          </p>
        </div>

        <div className="p-6 sm:p-9 rounded-3xl card-primary max-w-4xl mx-auto border border-white/[0.08] shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">How many proposals do you send per month?</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{monthlyProposals} proposals</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={monthlyProposals}
                onChange={e => setMonthlyProposals(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                aria-label="Monthly proposals"
              />
            </div>

            {/* ROI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] text-center">
              <div className="p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Freelance Hours Saved</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">~{hoursSaved} hrs</div>
                <span className="text-[10px] text-emerald-300">Every single month</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Connects Capital Rescued</span>
                <div className="text-3xl font-extrabold font-mono text-teal-400">~{connectsSaved}</div>
                <span className="text-[10px] text-teal-300">${estDollarConnects} USD saved</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070a12] border border-white/[0.08] space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Billable Value Unlocked</span>
                <div className="text-3xl font-extrabold font-mono text-white">${estExtraEarnings}</div>
                <span className="text-[10px] text-slate-400">At standard $50/hr billing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
            Clarity &amp; Security First
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Will using WorkMatch get my Upwork or Fiverr account banned?',
              a: 'No. WorkMatch uses standard official partner credentials, human-in-the-loop assisted approval by default, and strict anti-spam rate limiting. It never sends mass indiscriminate applications.'
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
              q: 'What are the Safety Controls & Kill Switch?',
              a: 'A prominent safety control available on all views. Pressing it activates an immediate system-wide tripwire that disables all automated proposals in sub-5ms across every connected channel.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl card-primary border border-white/[0.08] transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-300 transition"
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-white flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.08] mt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL HIGH-IMPACT CONVERSION CTA */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 card-primary text-center overflow-hidden border border-white/[0.1] shadow-2xl">
          {/* Cyber neural grid background layer */}
          <div className="absolute inset-0 bg-[url('/images/neural-grid.jpg')] bg-cover bg-center opacity-15 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent pointer-events-none" />

          {/* Subtle Ambient Radial */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 blur-[120px] pointer-events-none" />

          <div className="relative space-y-6 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Production Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Ready to win more contracts in 90% less time?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Launch the live demo workspace right now. No credit card or API keys required to explore the full suite.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_16px_rgba(255,255,255,0.12)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoadingDemo ? (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current text-slate-950" />
                )}
                <span>{isLoadingDemo ? 'Seeding Sandbox...' : 'Launch Live Demo Sandbox'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto bg-[#070a12] hover:bg-[#0c111d] text-slate-200 border border-white/[0.12] text-sm md:text-base px-7 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                Open Workspace Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] mt-16 p-8 text-center text-slate-400 text-xs font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">WorkMatch OS</span>
            <span>•</span>
            <span className="text-slate-400">Autonomous Freelance Operating System</span>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <button onClick={onLaunchApp} className="hover:text-white transition">Workspace</button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition">Simulator</button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition">FAQ</button>
          </div>

          <div>
            © {new Date().getFullYear()} WorkMatch Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
