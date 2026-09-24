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
  DollarSign
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
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-screen bg-[#000000] text-white selection:bg-white/30 overflow-hidden font-sans"
    >
      {/* Background Atmosphere & Ambient Lighting (ParkFlow style) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Architectural background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${backdropImages[activeBackdrop]})`,
            opacity: activeBackdrop === 'neural' ? 0.22 : 0.35,
            mixBlendMode: activeBackdrop === 'neural' ? 'screen' : 'luminosity',
            filter: 'brightness(1.08)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#000000] z-0 pointer-events-none" />

        {/* Dual High-Diffusion Ambient Blur Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/25 rounded-full blur-[150px] mix-blend-screen opacity-40 ambient-orb" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[160px] mix-blend-screen opacity-35 ambient-orb" />
        <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-blue-900/30 rounded-full blur-[150px] mix-blend-screen opacity-25" />
        
        {/* Dark Vignette & Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 radial-mask pointer-events-none" />
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

      {/* Floating Glass Pill Navigation Header */}
      <header className="relative z-50 pt-5 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-full bg-white/[0.04] border border-white/10 px-5 sm:px-7 py-3 backdrop-blur-xl flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)]">
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
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
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

        {/* Hero Headline (ParkFlow massive typography) */}
        <h1 className="hero-text text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60 leading-[1.04]">
          Stop Chasing Jobs. <br />
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Let AI Win Them.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-text text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mb-12 font-medium tracking-normal leading-relaxed">
          Experience autonomous, serverless freelance management. Real-time marketplace aggregation, multi-factor fit scoring, and zero-hallucination proposal dispatch.
        </p>

        {/* Hero Dual CTA Buttons (ParkFlow's exact signature buttons) */}
        <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onLoadDemoAndLaunch}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 text-base md:text-lg px-8 py-3.5 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_55px_rgba(255,255,255,0.45)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-base md:text-lg px-8 py-3.5 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-white/80" />
            <span>Test Match Simulator</span>
          </button>
        </div>

        {/* Micro Guarantee Value Strip */}
        <div className="hero-text mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
            <span>100% Truthful Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
            <span>Zero Hallucinations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
            <span>Instant Kill Switch</span>
          </div>
        </div>

        {/* ParkFlow-Style 3-Column Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 max-w-5xl w-full hero-text">
          <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left transition-colors hover:bg-white/10">
            <Radio className="h-8 w-8 mb-4 text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-white">Live Marketplace Feed</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Instantly see what opportunities are available across Upwork, Fiverr, and Freelancer with sub-second websocket synchronization.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left transition-colors hover:bg-white/10">
            <Activity className="h-8 w-8 mb-4 text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-white">Multi-Factor Fit Score</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Visualize opportunity quality with a 9-dimension formula combining skill fit, client payment history, and hourly rate profitability.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left transition-colors hover:bg-white/10">
            <ShieldCheck className="h-8 w-8 mb-4 text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-white">Deterministic Truth Audit</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Automated proposal generation strictly constrained to your capability inventory. Never hallucinate skills or risk marketplace reputation.
            </p>
          </div>
        </div>

        {/* Interactive Floating Live Cockpit Showcase */}
        <div className="mt-16 w-full max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Command center architectural background layer */}
            <div className="absolute inset-0 bg-[url('/images/tech-command-center.jpg')] bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
            {/* Cockpit Window Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-xs font-mono text-white/50">workmatch-engine.live • 24/7 Scan Stream</span>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/10 text-xs">
                {(['MANUAL', 'ASSISTED', 'AUTOMATIC'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCockpitMode(mode)}
                    className={`px-4 py-1 rounded-full font-medium transition ${
                      cockpitMode === mode
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {mode === 'MANUAL' ? 'Alert Only' : mode === 'ASSISTED' ? 'Co-Pilot' : 'Autonomous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cockpit Visual Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
              {/* Opportunity Card Preview */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                        Upwork Enterprise
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        ⚡ Top 1% Match
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">Posted 4m ago</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Senior TypeScript &amp; React Architect for High-Throughput Analytics Dashboard
                    </h3>
                  </div>

                  {/* Radial Match Indicator */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[70px] text-center">
                    <span className="text-2xl font-black font-mono text-emerald-400">98%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-white/60 font-mono">Match</span>
                  </div>
                </div>

                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  Looking for an elite full-stack engineer experienced in Vite, SQLite, real-time WebSockets, and modern data visualization. Must have proven capability shipping production apps.
                </p>

                {/* Criteria Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Skill Overlap</span>
                    <span className="font-mono text-emerald-400 font-bold">100% Fit</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Budget Quality</span>
                    <span className="font-mono text-white font-bold">$95 – $125/hr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Client Trust</span>
                    <span className="font-mono text-cyan-400 font-bold">★ 4.98 ($120k+)</span>
                  </div>
                </div>

                {/* Insight Strip */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white/80">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Exact match with 3 verified profile skills (TypeScript, React, Performance Optimization)</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 whitespace-nowrap">0 Connect Waste</span>
                </div>
              </div>

              {/* Status Side Column */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Truth Verification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Enforced</span>
                  </div>
                  <div className="space-y-2 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
                      <span>Zero unverified skills claimed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
                      <span>Experience bounds sanitized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
                      <span>Payment safety verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider font-mono">
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
                  <p className="text-[11px] text-white/40 leading-tight">
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
      <section className="relative z-10 border-y border-white/10 bg-white/[0.01] backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">$4.2M+</div>
              <div className="text-xs text-white/40 mt-1">Opportunity Value Evaluated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">98.4%</div>
              <div className="text-xs text-white/40 mt-1">Proposal Truthfulness Ratio</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tracking-tight">&lt; 15ms</div>
              <div className="text-xs text-white/40 mt-1">Difficulty Assessment Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white/80 tracking-tight">0</div>
              <div className="text-xs text-white/40 mt-1">Account Bans or Incidents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 5 Core Architectural Pillars (ParkFlow Glass Style) */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
            Engine Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Built for High-Earner Freelancers
          </h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">
            Generic AI spam bots flood clients with garbage. WorkMatch was engineered from the ground up to guarantee relevance, precision, and reputation safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Platform Aggregation (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/[0.08] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Universal Multi-Marketplace Sync
              </h3>
              <p className="text-sm text-white/60 max-w-xl leading-relaxed">
                Connect your Upwork, Fiverr, and global marketplace accounts through unified bi-directional adapters. Stream opportunities into one inbox, normalized with deduplication and client payment reputation metrics.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                ✓ Upwork Partner OAuth &amp; Sync
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                ✓ Fiverr Buyer Request Scanner
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white/60 text-xs font-mono">
                REST v2 Native Webhooks
              </span>
            </div>
          </div>

          {/* Card 2: 9-Factor Difficulty Engine */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/[0.08] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                9-Factor Difficulty Formula
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                We evaluate opportunities beyond mere keywords: skill overlap, technical simplicity, turnaround, client review score, and compensation ratio.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white/70">
                <span>Capability Alignment</span>
                <span className="text-emerald-400">Weight: 25%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[85%]" />
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Truth Audit */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/[0.08] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Deterministic Truth Audit
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                WorkMatch strictly restricts proposals to verified skills in your capability inventory. Never risk your reputation by claiming frameworks you do not possess.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 font-mono">
              ✓ Automated claim extraction &amp; sanitizer
            </div>
          </div>

          {/* Card 4: Hard Fail-Safe Throttles */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/[0.08] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Hard Fail-Safe Throttles
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Declare maximum daily applications, cost caps per proposal, and risk filters. A global 1-click Emergency Kill Switch halts automated activity instantly.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-mono">
              🛑 1-Click Global Emergency Stop
            </div>
          </div>

          {/* Card 5: Bank-Statement Audit Ledger (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/[0.08] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Bank-Statement Audit Ledger
              </h3>
              <p className="text-sm text-white/60 max-w-xl leading-relaxed">
                Every connect invested, job evaluated, and proposal dispatched is recorded into an institutional statement ledger. Export CSV reports to audit ROI and connect capital with exact dollar accuracy.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-white/40 block text-[10px]">Estimated Direct Cost</span>
                <span className="font-bold text-emerald-400">$0.15 / Connect Tracked</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-white/40 block text-[10px]">Audit Export</span>
                <span className="font-bold text-cyan-400">CSV &amp; PDF Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Match Simulator */}
      <section id="simulator" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
            Interactive Test Drive
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Test the Opportunity Match Formula
          </h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">
            Drag the sliders below to simulate how WorkMatch evaluates any freelance job in milliseconds.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/80">Capability Alignment with Job:</span>
                  <span className="font-mono text-emerald-400 font-bold">{simSkillFit}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simSkillFit}
                  onChange={e => setSimSkillFit(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/80">Offered Hourly Rate / Budget:</span>
                  <span className="font-mono text-white font-bold">${simHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={simHourlyRate}
                  onChange={e => setSimHourlyRate(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white/80">Client Rating &amp; Payment History:</span>
                  <span className="font-mono text-amber-400 font-bold">★ {simClientRating.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={simClientRating}
                  onChange={e => setSimClientRating(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-white/10 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-white/80 block">Project Turnaround &amp; Scope:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Simple', 'Medium', 'Complex'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSimComplexity(c)}
                      className={`py-2 px-3 rounded-full text-xs font-semibold border transition ${
                        simComplexity === c
                          ? 'bg-white text-black border-white'
                          : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-black/60 border border-white/10 text-center space-y-4">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block">
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

              <div className="space-y-1.5 text-left text-xs text-white/60 pt-3 border-t border-white/10">
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
      <section id="studio" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
            Proposal Studio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Authentic Proposals That Win
          </h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">
            See the contrast between generic AI boilerplates and WorkMatch truthful, client-focused proposal tailoring.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-4xl mx-auto space-y-6">
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
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activePersona === tab.id ? 'bg-black/15 text-black' : 'bg-black/40 text-white/50'
                }`}>
                  {tab.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Proposal Box */}
          <div className="p-5 sm:p-7 rounded-2xl bg-black/60 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Truth Audit: 100% Validated Against Profile Skills
              </span>
              <span className="text-[10px] font-mono text-white/40">128 Words • Sub-1min Reading Time</span>
            </div>

            <div className="text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {activePersona === 'direct' && (
                <>
                  <p>
                    Hi <span className="text-white/40">[Client]</span>, I reviewed your dashboard performance bottlenecks. You need sub-100ms analytics queries with real-time UI updates without blocking the main event thread.
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

            <div className="flex items-center justify-between text-xs text-white/40 pt-2">
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

      {/* Comparison Matrix: Anti-Slop Table */}
      <section id="comparison" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
            The Anti-Slop Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            How WorkMatch Compares
          </h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">
            See why high-ticket freelancers choose deterministic truth over spam bots and manual searching.
          </p>
        </div>

        <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/5 text-white/60 border-b border-white/10">
                <tr>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white">Capability</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white/40">Manual Job Search</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-rose-400">Generic AI Bots</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white bg-white/5">WorkMatch OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-semibold text-white">Monitoring Speed</td>
                  <td className="py-4 px-6 text-white/40">Hours spent refreshing feeds</td>
                  <td className="py-4 px-6 text-white/40">Generic keyword scraping</td>
                  <td className="py-4 px-6 font-semibold text-white bg-white/[0.03]">24/7 Sub-second live sync</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-semibold text-white">Opportunity Scoring</td>
                  <td className="py-4 px-6 text-white/40">Subjective gut feeling</td>
                  <td className="py-4 px-6 text-rose-400">None (applies blindly)</td>
                  <td className="py-4 px-6 font-semibold text-white bg-white/[0.03]">9-Factor multi-criteria formula</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-semibold text-white">Proposal Truthfulness</td>
                  <td className="py-4 px-6 text-white/40">High effort, slow writing</td>
                  <td className="py-4 px-6 text-rose-400">Hallucinated skills &amp; fake claims</td>
                  <td className="py-4 px-6 font-semibold text-white bg-white/[0.03]">100% Enforced truthful audit</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-semibold text-white">Marketplace Safety</td>
                  <td className="py-4 px-6 text-white/40">Safe but exhausting</td>
                  <td className="py-4 px-6 text-rose-400">High risk of account ban</td>
                  <td className="py-4 px-6 font-semibold text-white bg-white/[0.03]">Circuit breakers + Instant Kill Switch</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-semibold text-white">Financial Accountability</td>
                  <td className="py-4 px-6 text-white/40">Untracked connect waste</td>
                  <td className="py-4 px-6 text-rose-400">Connects drained in hours</td>
                  <td className="py-4 px-6 font-semibold text-white bg-white/[0.03]">Official Bank-Style Audit Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi" className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
            ROI &amp; Connect Savings
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
            Calculate Time &amp; Capital Reclaimed
          </h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">
            See how much time and wasted connect capital WorkMatch recovers for you every single month.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-white/80">How many proposals do you send per month?</span>
                <span className="font-mono text-white font-bold text-sm">{monthlyProposals} proposals</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={monthlyProposals}
                onChange={e => setMonthlyProposals(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-white/10 rounded-lg"
              />
            </div>

            {/* ROI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[11px] text-white/40 font-mono uppercase">Freelance Hours Saved</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">~{hoursSaved} hrs</div>
                <span className="text-[10px] text-emerald-400/80">Every month</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[11px] text-white/40 font-mono uppercase">Connects Capital Rescued</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-400">~{connectsSaved}</div>
                <span className="text-[10px] text-cyan-400/80">${estDollarConnects} USD saved</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[11px] text-white/40 font-mono uppercase">Billable Value Unlocked</span>
                <div className="text-3xl font-extrabold font-mono text-white">${estExtraEarnings}</div>
                <span className="text-[10px] text-white/40">At standard $50/hr billing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/5 text-white/70 border border-white/10">
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
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden transition hover:bg-white/[0.05]"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-white/80 transition"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-white flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-sm text-white/60 leading-relaxed border-t border-white/5 mt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Impact Conversion CTA (ParkFlow White Glow Button) */}
      <section className="relative z-10 py-28 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-white/[0.03] border border-white/10 text-center overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Cyber neural grid background layer */}
          <div className="absolute inset-0 bg-[url('/images/neural-grid.jpg')] bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none" />

          <div className="relative space-y-6 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-white/10 text-white border border-white/20">
              Immediate Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Ready to win more contracts in 90% less time?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Launch the live demo workspace right now. No credit card, no API keys required to explore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto bg-white text-black hover:bg-white/90 text-base md:text-lg px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_55px_rgba(255,255,255,0.45)] font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 text-base md:text-lg px-8 py-4 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                Open Workspace Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (ParkFlow style: Minimalist Border-T) */}
      <footer className="relative z-10 border-t border-white/10 mt-20 p-8 text-center text-white/40 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">WorkMatch OS</span>
            <span>•</span>
            <span>Autonomous Freelance Operating System</span>
          </div>

          <div className="flex items-center gap-6 text-white/60">
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
