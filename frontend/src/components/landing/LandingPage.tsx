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
  Bot,
  Search,
  Activity,
  Layers,
  Clock,
  DollarSign,
  Copy,
  Check
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
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLoadDemoAndLaunch,
  isLoadingDemo = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Spotlight Glow State
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Interactive Simulator State
  const [simSkillFit, setSimSkillFit] = useState<number>(94);
  const [simHourlyRate, setSimHourlyRate] = useState<number>(85);
  const [simClientRating, setSimClientRating] = useState<number>(4.9);
  const [simComplexity, setSimComplexity] = useState<'Simple' | 'Medium' | 'Complex'>('Simple');

  // Interactive Cockpit Mode & Live Opportunity State
  const [cockpitMode, setCockpitMode] = useState<'MANUAL' | 'ASSISTED' | 'AUTOMATIC'>('AUTOMATIC');
  const [selectedOppIdx, setSelectedOppIdx] = useState<number>(0);

  // Proposal Persona Studio State & Copy Feedback
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

  const sampleOpportunities: SampleOpportunity[] = [
    {
      id: 'ts-react',
      tabLabel: 'TypeScript Architect',
      platform: 'Upwork Enterprise',
      matchScore: 98,
      timeAgo: '4m ago',
      title: 'Senior TypeScript & React Architect for High-Throughput Analytics Dashboard',
      description: 'Looking for an elite full-stack engineer experienced in Vite, SQLite, real-time WebSockets, and modern data visualization. Must have proven capability shipping production apps.',
      skillOverlap: '100% Fit',
      budget: '$95 – $125/hr',
      clientRep: '★ 4.98 ($120k+ spent)',
      verifiedSkills: 'Exact match with 3 verified profile skills (TypeScript, React, Performance Optimization)'
    },
    {
      id: 'ai-agent',
      tabLabel: 'AI Workflow Lead',
      platform: 'Fiverr Pro',
      matchScore: 96,
      timeAgo: '12m ago',
      title: 'Autonomous Multi-Agent Orchestration & LLM Pipeline Architecture',
      description: 'Seeking a senior engineer to design reliable agent workflows with strict hallucination guards, tool calling, and deterministic state trees. Production experience required.',
      skillOverlap: '97% Fit',
      budget: '$4,200 Fixed',
      clientRep: '★ 5.0 (Top Rated Plus)',
      verifiedSkills: 'Exact match with 4 verified profile skills (LLM Orchestration, Python, REST, Tool-use)'
    },
    {
      id: 'nextjs-lead',
      tabLabel: 'Next.js 15 Lead',
      platform: 'Direct Inbound',
      matchScore: 94,
      timeAgo: '18m ago',
      title: 'Next.js 15 App Router & Server Actions Performance Refactor',
      description: 'Refactor high-traffic web application to Next.js 15 App Router. Improve Core Web Vitals, server components caching strategy, and reduce bundle footprint.',
      skillOverlap: '95% Fit',
      budget: '$110/hr',
      clientRep: '★ 4.95 ($85k+ spent)',
      verifiedSkills: 'Exact match with 3 verified profile skills (Next.js, Tailwind CSS, SSR Architecture)'
    }
  ];

  const proposalTexts: Record<string, string> = {
    direct: `Hi [Client], I reviewed your dashboard performance bottlenecks. You need sub-100ms analytics queries with real-time UI updates without blocking the main event thread.\n\nI have direct production experience architecting React with TypeScript and optimizing SQLite query indexing. In a recent project, we achieved a 65% reduction in dashboard latency using memoized selector hooks and virtualized scrolling.\n\nI can take this on starting tomorrow. Here is the first step I would take on day one...`,
    technical: `Greetings, regarding your specification for high-throughput state handling: your architecture requires strict decoupled state management to prevent unnecessary DOM re-renders.\n\nMy verified technical scope covers React 18 concurrency, TypeScript strict mode, and memory-efficient data caching. I avoid heavy third-party bundles in favor of lean native primitives.\n\nHappy to discuss schema migrations and API endpoint contracts on a quick technical sync.`,
    consultative: `Hello, looking at your project roadmap, the primary objective is ensuring your analytics scale cleanly as your user base doubles over the next quarter.\n\nBeyond just writing the code, I focus on delivering clean maintainable architecture that your team can easily extend. We will structure the dashboard modules with zero hard dependencies and full automated test coverage.\n\nLet's align on your key business milestones and release dates.`
  };

  const handleCopyProposal = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const currentOpp = sampleOpportunities[selectedOppIdx] || sampleOpportunities[0];

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

  // GSAP Animations (ParkFlow style hero stagger + continuous traveling beam streak)
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Staggered hero entrance
      gsap.fromTo(
        '.hero-text',
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out' }
      );

      // ParkFlow signature flying streak loop across screen
      gsap.to('.flying-beam', {
        x: '115vw',
        repeat: -1,
        duration: 20,
        ease: 'linear'
      });

      // Ambient blur orb breathing
      gsap.to('.ambient-orb', {
        scale: 1.15,
        opacity: 0.5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
      className="relative min-h-screen bg-[#02040a] text-white selection:bg-white/30 overflow-hidden font-sans"
    >
      {/* Interactive Cursor-Following Ambient Spotlight Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(52, 211, 153, 0.08), transparent 70%)`
        }}
      />

      {/* Subtle 35mm Film Grain Texture Layer */}
      <div className="fixed inset-0 pointer-events-none cinematic-grain z-40 opacity-20" />

      {/* Background Atmosphere & Ambient Radiant Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Architectural background image overlay with slow cinematic camera dolly */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 pointer-events-none animate-cinematic-dolly origin-center"
          style={{
            backgroundImage: `url(${backdropImages[activeBackdrop]})`,
            opacity: activeBackdrop === 'neural' ? 0.35 : 0.48,
            mixBlendMode: activeBackdrop === 'neural' ? 'screen' : 'luminosity',
            filter: 'brightness(1.10) contrast(1.04)'
          }}
        />

        {/* Radiant overhead lighting cone & gentle ground gradient */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-400/20 via-cyan-400/12 to-transparent rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/20 to-[#02040a]/80 z-0 pointer-events-none" />

        {/* Softened Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette pointer-events-none z-0" />

        {/* Balanced Radiant Ambient Blur Orbs */}
        <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-emerald-400/25 rounded-full blur-[130px] mix-blend-screen opacity-50 ambient-orb" />
        <div className="absolute top-1/3 right-1/4 w-[650px] h-[650px] bg-cyan-400/22 rounded-full blur-[140px] mix-blend-screen opacity-45 ambient-orb" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[130px] mix-blend-screen opacity-35" />
        
        {/* Subtle Radial Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-mask pointer-events-none" />

        {/* Ambient floating luminescent embers / data particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[65%] left-[18%] w-2 h-2 rounded-full bg-emerald-300/80 blur-[1px] particle-drift-1" />
          <div className="absolute top-[80%] left-[72%] w-1.5 h-1.5 rounded-full bg-cyan-300/90 blur-[1px] particle-drift-2" />
          <div className="absolute top-[70%] left-[48%] w-2.5 h-2.5 rounded-full bg-emerald-300/60 blur-[2px] particle-drift-3" />
          <div className="absolute top-[85%] left-[32%] w-1.5 h-1.5 rounded-full bg-cyan-300/80 blur-[1px] particle-drift-1" />
          <div className="absolute top-[75%] left-[84%] w-2 h-2 rounded-full bg-emerald-400/80 blur-[1px] particle-drift-2" />
        </div>
      </div>

      {/* Traveling Neural Dispatcher Signal (ParkFlow .flying-car effect) */}
      <div className="absolute top-1/4 -left-48 z-[1] flying-beam pointer-events-none flex items-center">
        <div className="relative flex items-center">
          {/* Pulsing glow engine */}
          <div className="absolute inset-0 bg-emerald-400/40 blur-[25px] rounded-full w-24 h-10 animate-pulse" />
          
          {/* Signal Capsule */}
          <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-emerald-400/40 backdrop-blur-md text-[11px] font-mono text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.7)] shadow-glow-emerald">
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current animate-bounce" />
            <span>Scanning Upwork &amp; Fiverr • 98% Match</span>
          </div>

          {/* Neon Light Trail Tail (ParkFlow streak) */}
          <div className="absolute top-1/2 -left-36 w-36 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent to-emerald-400/80 blur-[1px]" />
        </div>
      </div>

      {/* Cinematic Top Letterbox HUD Telemetry */}
      <div className="relative z-50 max-w-6xl mx-auto px-6 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>REC ● 24.00 FPS</span>
          <span className="text-white/20">|</span>
          <span>ISO 800</span>
          <span className="text-white/20">|</span>
          <span>2.39:1 ANAMORPHIC</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-0.5 h-2 bg-emerald-400/80 animate-pulse" />
            <span className="w-0.5 h-3 bg-emerald-400/80 animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-emerald-400/80 animate-pulse delay-150" />
          </div>
          <span>NEURAL SCAN STREAM // LIVE</span>
          <span className="text-white/20">|</span>
          <span className="text-emerald-400/90 font-semibold">100% SIGNAL</span>
        </div>
      </div>

      {/* Floating Glass Pill Navigation Header */}
      <header className="relative z-50 pt-2 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-full bg-white/[0.06] border border-white/15 px-5 sm:px-7 py-3 backdrop-blur-xl flex items-center justify-between shadow-[0_0_35px_rgba(0,0,0,0.4)]">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">WorkMatch</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20 font-bold">
                OS 2.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition-colors">
              Match Simulator
            </button>
            <button onClick={() => handleScrollTo('studio')} className="hover:text-white transition-colors">
              Proposal Studio
            </button>
            <button onClick={() => handleScrollTo('comparison')} className="hover:text-white transition-colors">
              Anti-Slop Matrix
            </button>
            <button onClick={() => handleScrollTo('roi')} className="hover:text-white transition-colors">
              ROI Calculator
            </button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition-colors">
              FAQ
            </button>
          </nav>

          {/* Header Action Buttons (ParkFlow style) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="text-xs font-semibold text-white/70 hover:text-white px-3.5 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isLoadingDemo ? 'Loading Sandbox...' : '1-Click Demo'}
            </button>
            <button
              onClick={onLaunchApp}
              className="px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={onLaunchApp}
              className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold"
            >
              App
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 border border-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 p-5 rounded-2xl bg-[#09090b]/95 border border-white/15 space-y-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
            <button onClick={() => handleScrollTo('features')} className="block w-full text-left py-2 text-sm text-white/80">
              Features
            </button>
            <button onClick={() => handleScrollTo('simulator')} className="block w-full text-left py-2 text-sm text-white/80">
              Match Simulator
            </button>
            <button onClick={() => handleScrollTo('studio')} className="block w-full text-left py-2 text-sm text-white/80">
              Proposal Studio
            </button>
            <button onClick={() => handleScrollTo('comparison')} className="block w-full text-left py-2 text-sm text-white/80">
              Anti-Slop Matrix
            </button>
            <button onClick={() => handleScrollTo('roi')} className="block w-full text-left py-2 text-sm text-white/80">
              ROI Calculator
            </button>
            <button onClick={() => handleScrollTo('faq')} className="block w-full text-left py-2 text-sm text-white/80">
              FAQ
            </button>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white text-center"
              >
                1-Click Demo Sandbox
              </button>
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-full bg-white text-black text-xs font-semibold text-center"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (ParkFlow Massive Typography & Centered Structure) */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 sm:px-6 pt-16 pb-20 max-w-5xl mx-auto">
        {/* Cinematic Viewfinder Corner Brackets */}
        <div className="hidden md:block absolute top-10 left-2 w-5 h-5 border-t border-l border-white/20 pointer-events-none" />
        <div className="hidden md:block absolute top-10 right-2 w-5 h-5 border-t border-r border-white/20 pointer-events-none" />
        <div className="hidden md:block absolute bottom-10 left-2 w-5 h-5 border-b border-l border-white/20 pointer-events-none" />
        <div className="hidden md:block absolute bottom-10 right-2 w-5 h-5 border-b border-r border-white/20 pointer-events-none" />

        {/* Anamorphic Lens Flare Line & Horizon Bloom */}
        <div className="absolute top-[46%] left-0 right-0 pointer-events-none z-0 overflow-hidden">
          <div className="anamorphic-flare" />
          <div className="anamorphic-bloom -translate-y-1/2" />
        </div>

        {/* Release Pill Badge & Atmosphere Selector */}
        <div className="hero-text flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">WorkMatch OS 2.0</span>
            <span className="text-white/30">•</span>
            <span className="text-white/70">Autonomous Freelance OS</span>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {(['cockpit', 'command', 'neural'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setActiveBackdrop(mode)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono capitalize transition-all ${
                  activeBackdrop === mode
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {mode === 'cockpit' ? 'Minimal Cockpit' : mode === 'command' ? 'Command Deck' : 'Neural Mesh'}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Telemetry Micro-Badges & Hero Headline */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Micro-Badge Left: Live Match Ping */}
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(52,211,153,0.2)] absolute -top-6 -left-10 z-20 pointer-events-none animate-float text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                <span>$125/hr Match Found</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Upwork Enterprise • 98% Fit</div>
            </div>
          </div>

          {/* Micro-Badge Right: Truth Verification */}
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.2)] absolute top-28 -right-10 z-20 pointer-events-none animate-float-reverse text-left">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                <span>100% Truth Enforced</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">AUDITED</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Zero Hallucinations Verified</div>
            </div>
          </div>

          {/* Hero Headline (ParkFlow massive typography) */}
          <h1 className="hero-text text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70 leading-[1.04]">
            Stop Chasing Jobs. <br />
            <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">Let AI Win Them.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="hero-text text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-normal tracking-normal leading-relaxed">
            Experience autonomous, serverless freelance management. Real-time marketplace aggregation, multi-factor fit scoring, and zero-hallucination proposal dispatch.
          </p>
        </div>

        {/* Hero Dual CTA Buttons (ParkFlow's exact signature buttons) */}
        <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onLoadDemoAndLaunch}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 text-base md:text-lg px-8 py-3.5 rounded-full shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoadingDemo ? (
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : (
              <Zap className="w-5 h-5 text-black fill-current" />
            )}
            <span>{isLoadingDemo ? 'Seeding Sandbox...' : '1-Click Demo Sandbox'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => handleScrollTo('simulator')}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/25 text-base md:text-lg px-8 py-3.5 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-white/90" />
            <span>Test Match Simulator</span>
          </button>
        </div>

        {/* Micro Guarantee Value Strip */}
        <div className="hero-text mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Truthful Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Hallucinations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Instant Kill Switch</span>
          </div>
        </div>

        {/* ParkFlow-Style 3-Column Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 max-w-5xl w-full hero-text">
          <div className="p-6 md:p-8 rounded-2xl parkflow-card text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.18)]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Live Marketplace Feed</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Instantly see what opportunities are available across Upwork, Fiverr, and Freelancer with sub-second websocket synchronization.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl parkflow-card text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.18)]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Multi-Factor Fit Score</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Visualize opportunity quality with a 9-dimension formula combining skill fit, client payment history, and hourly rate profitability.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl parkflow-card text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center mb-4 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.18)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Deterministic Truth Audit</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Automated proposal generation strictly constrained to your capability inventory. Never hallucinate skills or risk marketplace reputation.
            </p>
          </div>
        </div>

        {/* Interactive Floating Live Cockpit Showcase */}
        <div className="mt-16 w-full max-w-5xl mx-auto">
          <div className="relative rounded-3xl parkflow-card p-5 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.5),0_0_40px_rgba(52,211,153,0.06)] overflow-hidden">
            {/* Command center architectural background layer */}
            <div className="absolute inset-0 bg-[url('/images/tech-command-center.jpg')] bg-cover bg-center opacity-28 mix-blend-luminosity pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/85 via-[#060a12]/50 to-transparent pointer-events-none" />
            {/* Cockpit Window Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/12 text-left">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="h-4 w-px bg-white/15" />
                <span className="text-xs font-mono text-slate-400">workmatch-engine.live • 24/7 Scan Stream</span>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-[#070c17]/90 p-1 rounded-full border border-white/15 text-xs">
                {(['MANUAL', 'ASSISTED', 'AUTOMATIC'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCockpitMode(mode)}
                    className={`px-4 py-1 rounded-full font-semibold transition ${
                      cockpitMode === mode
                        ? 'bg-white text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'MANUAL' ? 'Alert Only' : mode === 'ASSISTED' ? 'Co-Pilot' : 'Autonomous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Opportunity Stream Selector Bar */}
            <div className="relative z-10 mt-5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Live Opportunities:
                </span>
                {sampleOpportunities.map((opp, idx) => (
                  <button
                    key={opp.id}
                    onClick={() => setSelectedOppIdx(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedOppIdx === idx
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedOppIdx === idx ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{opp.tabLabel}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">{opp.matchScore}%</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
                Click tab to inspect live scan
              </span>
            </div>

            {/* Cockpit Visual Grid */}
            <div className="relative z-10 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
              {/* Opportunity Card Preview with Scanline Radar Beam */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-[#070c17]/85 border border-white/12 space-y-4 relative overflow-hidden shadow-xl transition-all">
                {/* Radar Scanner Beam (animate-scanline) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-scanline blur-[1px]" />
                </div>

                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                        {currentOpp.platform}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ⚡ Top 1% Match
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Posted {currentOpp.timeAgo}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {currentOpp.title}
                    </h3>
                  </div>

                  {/* Radial Match Indicator */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.06] border border-white/12 min-w-[70px] text-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                    <span className="text-2xl font-black font-mono text-emerald-400">{currentOpp.matchScore}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono">Match</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed relative z-10">
                  {currentOpp.description}
                </p>

                {/* Criteria Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] relative z-10">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Skill Overlap</span>
                    <span className="font-mono text-emerald-400 font-bold">{currentOpp.skillOverlap}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Budget Quality</span>
                    <span className="font-mono text-white font-bold">{currentOpp.budget}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Client Trust</span>
                    <span className="font-mono text-cyan-400 font-bold">{currentOpp.clientRep}</span>
                  </div>
                </div>

                {/* Insight Strip */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{currentOpp.verifiedSkills}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">0 Connect Waste</span>
                </div>
              </div>

              {/* Status Side Column */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#070c17]/80 border border-white/12 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Truth Verification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Enforced</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
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
                      <span>Payment safety verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070c17]/80 border border-white/12 space-y-2 shadow-lg">
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
          </div>
        </div>
      </section>

      {/* Quantitative Proof Strip */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-md py-8">
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
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">0</div>
              <div className="text-xs text-slate-400 mt-1">Account Bans or Incidents</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars: Streamlined, Visual & User-Friendly */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            Engine Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Autonomous Precision. Zero Slop.
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Engineered for elite freelancers. Every subsystem is tuned to eliminate connect waste, safeguard your reputation, and win high-ticket contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Radar Scout */}
          <div className="p-6 sm:p-8 rounded-2xl parkflow-card flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">Universal Radar Scout</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect Upwork, Fiverr, and global marketplaces through unified websocket adapters. Instant deduplication, real-time alerts, and zero-latency job intake.
              </p>
            </div>

            <div className="mt-8 space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Sync Latency</span>
                <span className="text-emerald-400 font-bold">&lt; 15ms</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ Upwork Partner Sync
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ Fiverr Scanner
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: 9-Factor Fit Engine */}
          <div className="p-6 sm:p-8 rounded-2xl parkflow-card flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">9-Factor Fit Scoring</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Evaluate every listing before spending a single connect. Mathematical scoring computes skill overlap, client spend history, hourly yield, and turnaround.
              </p>
            </div>

            <div className="mt-8 space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Min Score Filter</span>
                <span className="text-cyan-400 font-bold">85%+ Required</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ Skill Match
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ Budget Yield
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ Client Rating
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Truth Guard & Safety */}
          <div className="p-6 sm:p-8 rounded-2xl parkflow-card flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Truth Guard &amp; Kill Switch</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Strict profile-bounded generation prevents hallucinated claims. Backed by a 1-click panic Kill Switch and an institutional bank-style connect accounting ledger.
              </p>
            </div>

            <div className="mt-8 space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Safety Guard</span>
                <span className="text-emerald-400 font-bold">100% Enforced</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  ✓ 0 Hallucinations
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  🛑 Panic Stop
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white border border-white/15">
                  📑 CSV Ledger
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Match Simulator */}
      <section id="simulator" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            Interactive Test Drive
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Test the Opportunity Match Formula
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Drag the sliders below to simulate how WorkMatch evaluates any freelance job in milliseconds.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl parkflow-card max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Capability Alignment with Job:</span>
                  <span className="font-mono text-emerald-400 font-bold">{simSkillFit}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simSkillFit}
                  onChange={e => setSimSkillFit(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/12 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Offered Hourly Rate / Budget:</span>
                  <span className="font-mono text-white font-bold">${simHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={simHourlyRate}
                  onChange={e => setSimHourlyRate(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/12 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Client Rating &amp; Payment History:</span>
                  <span className="font-mono text-amber-400 font-bold">★ {simClientRating.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={simClientRating}
                  onChange={e => setSimClientRating(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/12 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-300 block">Project Turnaround &amp; Scope:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Simple', 'Medium', 'Complex'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSimComplexity(c)}
                      className={`py-2 px-3 rounded-full text-xs font-semibold border transition ${
                        simComplexity === c
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/[0.05] border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#070c17]/85 border border-white/15 text-center space-y-4 shadow-xl">
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
      <section id="studio" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            Proposal Studio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Authentic Proposals That Win
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            See the contrast between generic AI boilerplates and WorkMatch truthful, client-focused proposal tailoring.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl parkflow-card max-w-4xl mx-auto space-y-6">
          {/* Persona Tabs (ParkFlow Pill style) */}
          <div className="flex items-center justify-center gap-2 flex-wrap pb-4 border-b border-white/10">
            {[
              { id: 'direct', label: 'Direct & Value-First', tag: 'Highest Conversion' },
              { id: 'technical', label: 'Technical Specialist', tag: 'Architect & Senior Roles' },
              { id: 'consultative', label: 'Consultative Partner', tag: 'Enterprise & Strategy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePersona(tab.id as any)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition flex items-center gap-2 ${
                  activePersona === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/15 hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activePersona === tab.id ? 'bg-black/15 text-black' : 'bg-[#070c17]/80 text-slate-400'
                }`}>
                  {tab.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Proposal Box */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#070c17]/85 border border-white/15 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Truth Audit: 100% Validated Against Profile Skills
              </span>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">128 Words • Sub-1min Read</span>
                <button
                  onClick={() => handleCopyProposal(proposalTexts[activePersona])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition active:scale-95 border ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 bg-white/[0.03] p-5 rounded-xl border border-white/10">
              {activePersona === 'direct' && (
                <>
                  <p>
                    Hi <span className="text-cyan-400 font-mono font-medium">[Client]</span>, I reviewed your dashboard performance bottlenecks. You need sub-100ms analytics queries with real-time UI updates without blocking the main event thread.
                  </p>
                  <p>
                    I have direct production experience architecting <span className="text-white font-semibold font-mono">React</span> with <span className="text-white font-semibold font-mono">TypeScript</span> and optimizing SQLite query indexing. In a recent project, we achieved a 65% reduction in dashboard latency using memoized selector hooks and virtualized scrolling.
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
                    My verified technical scope covers <span className="text-white font-semibold font-mono">React 18</span> concurrency, <span className="text-white font-semibold font-mono">TypeScript strict mode</span>, and memory-efficient data caching. I avoid heavy third-party bundles in favor of lean native primitives.
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
              <button onClick={onLaunchApp} className="text-white hover:underline font-semibold flex items-center gap-1">
                <span>Try in Proposal Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Anti-Slop (Card-Based, Fast Scannability) */}
      <section id="comparison" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            The Anti-Slop Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            How WorkMatch Compares
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            See why serious freelancers choose deterministic truth over robotic spam bots and manual searching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Manual */}
          <div className="p-6 sm:p-8 rounded-3xl parkflow-card space-y-5 text-left border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Old Way</span>
                <span className="text-lg">⏳</span>
              </div>
              <h3 className="text-xl font-bold text-slate-200">Manual Job Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exhausting, slow, and relies on gut feelings rather than empirical profitability data.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 pt-2">
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
                  <span>Slow drafting leads to missed early-bid windows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Untracked connect waste &amp; freelancer burnout</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Generic AI Bots */}
          <div className="p-6 sm:p-8 rounded-3xl parkflow-card space-y-5 text-left border border-rose-500/20 bg-rose-950/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">High Risk</span>
                <span className="text-lg">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Generic AI Spam Bots</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cheap scrapers that flood clients with robotic templates, ruining client trust and risking account suspensions.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Canned generic templates flagged as spam</span>
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
                  <span>Drains hundreds of connects on low-paying jobs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: WorkMatch OS (The Standard) */}
          <div className="p-6 sm:p-8 rounded-3xl parkflow-card space-y-5 text-left border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.08] to-transparent shadow-[0_0_40px_rgba(52,211,153,0.12)] relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.6)]">
              The Pro Standard
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Autonomous OS</span>
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white">WorkMatch OS</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Institutional precision, mathematically verified fit scores, and 100% deterministic truth enforcement.
              </p>
              <ul className="space-y-3 text-xs text-slate-200 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>24/7 Sub-second live marketplace intake &amp; alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>9-Factor multi-dimensional match formula (≥ 85% rule)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>100% Truthful audit bounded to verified skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>1-Click Emergency Kill Switch + Bank Audit Ledger</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            ROI &amp; Connect Savings
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Calculate Time &amp; Capital Reclaimed
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            See how much time and wasted connect capital WorkMatch recovers for you every single month.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl parkflow-card max-w-4xl mx-auto shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">How many proposals do you send per month?</span>
                <span className="font-mono text-white font-bold text-sm">{monthlyProposals} proposals</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={monthlyProposals}
                onChange={e => setMonthlyProposals(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-white/12 rounded-lg"
              />
            </div>

            {/* ROI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div className="p-5 rounded-2xl bg-[#070c17]/80 border border-white/12 space-y-1 shadow-sm">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Freelance Hours Saved</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">~{hoursSaved} hrs</div>
                <span className="text-[10px] text-emerald-300/90 font-medium">Every month</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070c17]/80 border border-white/12 space-y-1 shadow-sm">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Connects Capital Rescued</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-400">~{connectsSaved}</div>
                <span className="text-[10px] text-cyan-300/90 font-medium">${estDollarConnects} USD saved</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070c17]/80 border border-white/12 space-y-1 shadow-sm">
                <span className="text-[11px] text-slate-400 font-mono uppercase">Billable Value Unlocked</span>
                <div className="text-3xl font-extrabold font-mono text-white">${estExtraEarnings}</div>
                <span className="text-[10px] text-slate-400">At standard $50/hr billing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/[0.06] text-slate-300 border border-white/15">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
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
              className="p-5 rounded-2xl parkflow-card overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-300 transition"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-white flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-sm text-slate-300 leading-relaxed border-t border-white/10 mt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Impact Conversion CTA (ParkFlow White Glow Button) */}
      <section className="relative z-10 py-28 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-14 parkflow-card text-center overflow-hidden shadow-2xl">
          {/* Cyber neural grid background layer */}
          <div className="absolute inset-0 bg-[url('/images/neural-grid.jpg')] bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/80 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-emerald-500/18 to-cyan-500/18 blur-[130px] pointer-events-none" />

          <div className="relative space-y-6 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/10 text-white border border-white/20">
              Immediate Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Ready to win more contracts in 90% less time?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Launch the live demo workspace right now. No credit card, no API keys required to explore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto bg-white text-black hover:bg-white/90 text-base md:text-lg px-8 py-4 rounded-full shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoadingDemo ? (
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 text-black fill-current" />
                )}
                <span>{isLoadingDemo ? 'Seeding Sandbox...' : 'Launch Live Demo Sandbox'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/15 text-base md:text-lg px-8 py-4 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                Open Workspace Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (ParkFlow style: Minimalist Border-T) */}
      <footer className="relative z-10 border-t border-white/12 mt-20 p-8 text-center text-slate-400 text-sm">
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
