import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  Search,
  Briefcase,
  Clock,
  DollarSign,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Menu,
  X,
  Zap,
  Filter,
  Eye,
  Send,
  Inbox,
  FileCheck,
  Building,
  Target,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLoadDemoAndLaunch: () => void;
  isLoadingDemo?: boolean;
}

// Editorial Real Photography Assets (Unsplash verified)
const siteImages = {
  hero: '/images/workspace-hero.jpg',
  workspace: '/images/freelancer-desk.jpg',
  editorial: '/images/talent-collaboration.jpg',
  craft: '/images/developer-code.jpg',
  analytics: '/images/analytics-dashboard.jpg',
  finance: '/images/financial-chart.jpg'
};

interface OpportunityData {
  id: string;
  title: string;
  role: string;
  platform: 'Upwork' | 'Fiverr' | 'Direct Inbound';
  budget: string;
  rateRange: string;
  hourlyRate: number;
  timeEstimate: string;
  hoursPerWeek: number;
  complexity: 'Low' | 'Medium' | 'High';
  skills: string[];
  matchScore: number;
  factors: {
    skills: number;
    budget: number;
    experience: number;
    time: number;
    reputation: number;
  };
  whyItFits: string[];
  summary: string;
}

const sampleOpportunities: OpportunityData[] = [
  {
    id: 'frontend-lead',
    title: 'Senior Frontend Architect — React & TypeScript',
    role: 'Frontend Developer',
    platform: 'Upwork',
    budget: '$45–$65/hr',
    rateRange: '$45–$65/hr',
    hourlyRate: 55,
    timeEstimate: '20 hrs/week · 3 months',
    hoursPerWeek: 20,
    complexity: 'Medium',
    skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
    matchScore: 94,
    factors: {
      skills: 98,
      budget: 94,
      experience: 96,
      time: 92,
      reputation: 98
    },
    whyItFits: [
      'Uses core technologies verified in your declared stack (React 18, TypeScript)',
      'Budget ($45–$65/hr) comfortably exceeds your $40/hr target floor',
      '20 hrs/week workload aligns with your active availability window',
      'Client holds 4.98 rating across $120k+ in verified completed contracts'
    ],
    summary: 'Design and implement high-performance modular frontend interfaces for a real-time analytics dashboard.'
  },
  {
    id: 'fullstack-analytics',
    title: 'Full-Stack Dashboard Engineer — Node.js & Next.js',
    role: 'Full Stack Engineer',
    platform: 'Direct Inbound',
    budget: '$50–$75/hr',
    rateRange: '$50–$75/hr',
    hourlyRate: 65,
    timeEstimate: '15 hrs/week · Ongoing',
    hoursPerWeek: 15,
    complexity: 'Medium',
    skills: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    matchScore: 91,
    factors: {
      skills: 92,
      budget: 96,
      experience: 94,
      time: 88,
      reputation: 95
    },
    whyItFits: [
      'Matches your full-stack capability with zero unverified requirements',
      'High-tier hourly compensation with predictable bi-weekly escrow payouts',
      'Flexible async workflow with under 2 hours of synchronous meetings per week',
      'Clear technical milestone definitions with verified stakeholder sign-off'
    ],
    summary: 'Develop sub-100ms analytics queries, server actions, and chart visualizations for an executive operations portal.'
  },
  {
    id: 'mobile-systems',
    title: 'Mobile Systems Engineer — React Native & Expo',
    role: 'Mobile Engineer',
    platform: 'Fiverr',
    budget: '$4,200 Fixed',
    rateRange: '$60/hr equivalent',
    hourlyRate: 60,
    timeEstimate: '25 hrs/week · 4 weeks',
    hoursPerWeek: 25,
    complexity: 'High',
    skills: ['React Native', 'Expo', 'TypeScript', 'REST APIs'],
    matchScore: 88,
    factors: {
      skills: 90,
      budget: 91,
      experience: 88,
      time: 84,
      reputation: 92
    },
    whyItFits: [
      'Strong architectural overlap with cross-platform mobile specifications',
      'Fixed-milestone escrow backed by verified upfront deposit',
      'Clean handoff documentation with established design tokens in Figma',
      'Well-scoped 4-week delivery with pre-approved technical specifications'
    ],
    summary: 'Build an offline-first inventory management application for field technicians with camera scanning.'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLoadDemoAndLaunch,
  isLoadingDemo = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Interactive Preview State (Subtle technology demonstration without AI clichés)
  const [heroBudget, setHeroBudget] = useState<number>(50);
  const [heroComplexity, setHeroComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [heroAvailability, setHeroAvailability] = useState<number>(20);

  // Match Analysis Selected Opportunity
  const [selectedOppId, setSelectedOppId] = useState<string>('frontend-lead');

  // Job Discovery Category Filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'fullstack' | 'mobile'>('all');

  // Interactive Personalization Controls
  const [prefRateFloor, setPrefRateFloor] = useState<number>(40);
  const [prefExperience, setPrefExperience] = useState<'Mid' | 'Senior' | 'Lead'>('Senior');
  const [prefHours, setPrefHours] = useState<number>(20);
  const [prefComplexity, setPrefComplexity] = useState<'Focused' | 'Moderate' | 'Architectural'>('Moderate');
  const [prefAsyncOnly, setPrefAsyncOnly] = useState<boolean>(true);
  const [prefRemoteOnly, setPrefRemoteOnly] = useState<boolean>(true);

  // Proposal Studio Persona & Copy
  const [proposalAngle, setProposalAngle] = useState<'direct' | 'technical' | 'consultative'>('direct');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP subtle entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.editorial-reveal',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Compute live match score in hero preview based on user parameters
  const heroLiveMatch = useMemo(() => {
    let score = 94;
    // Budget delta
    if (heroBudget >= 60) score -= 3;
    if (heroBudget <= 35) score += 2;
    // Complexity alignment
    if (heroComplexity === 'Medium') score += 2;
    if (heroComplexity === 'High') score -= 5;
    // Availability delta
    if (heroAvailability === 20) score += 1;
    if (heroAvailability > 25) score -= 4;
    return Math.min(99, Math.max(76, score));
  }, [heroBudget, heroComplexity, heroAvailability]);

  // Selected opportunity for Match Analysis
  const currentAnalysisOpp = useMemo(() => {
    return sampleOpportunities.find(o => o.id === selectedOppId) || sampleOpportunities[0];
  }, [selectedOppId]);

  // Filtered opportunities for Job Discovery
  const filteredOpportunities = useMemo(() => {
    if (activeCategory === 'frontend') {
      return sampleOpportunities.filter(o => o.role === 'Frontend Developer');
    }
    if (activeCategory === 'fullstack') {
      return sampleOpportunities.filter(o => o.role === 'Full Stack Engineer');
    }
    if (activeCategory === 'mobile') {
      return sampleOpportunities.filter(o => o.role === 'Mobile Engineer');
    }
    return sampleOpportunities;
  }, [activeCategory]);

  // Dynamic proposal preview based on selected angle
  const proposalDraft = useMemo(() => {
    if (proposalAngle === 'direct') {
      return `Hi,\n\nI reviewed your requirements for the Senior Frontend Architect position. Over the past 4 years, I have engineered modular dashboard interfaces using React 18, TypeScript, and Vite—consistently keeping bundle footprints minimal and render loops under 16ms.\n\nYour 20 hrs/week timeline aligns cleanly with my open availability, and the $45–$65/hr budget fits my standard engagement range. I can begin reviewing your existing component architecture this week.\n\nBest regards,\nAlex Vance`;
    }
    if (proposalAngle === 'technical') {
      return `Hi,\n\nYour analytics interface requirements call for deterministic state management, virtualized table rendering, and strict TypeScript boundaries. In my previous contract, I decoupled client-side data queries into optimized memoized slices, reducing dashboard load times by 42%.\n\nMy declared profile skills directly map to your stack (React 18, TypeScript, Tailwind). I structure components with strict separation between headless logic and presentational tokens for long-term maintainability.\n\nBest regards,\nAlex Vance`;
    }
    return `Hi,\n\nBuilding an executive dashboard is ultimately about decision speed and clarity. My focus is delivering production-ready, accessible UI components that allow your stakeholders to interact with real-time operational data without lag or ambiguity.\n\nI operate on an asynchronous-first cadence with crisp daily changelogs, verified test coverage, and transparent milestone tracking. Let's schedule a focused 15-minute briefing to align on your first delivery milestone.\n\nBest regards,\nAlex Vance`;
  }, [proposalAngle]);

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(proposalDraft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#090b10] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden font-sans"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION: Clean, Compact, Editorial
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#090b10]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
              {/* Bespoke Geometric Brandmark */}
              <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-400" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-slate-400" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-slate-500" />
                <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                WorkMatch
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <button
              onClick={() => handleScrollTo('product-overview')}
              className="hover:text-white transition-colors"
            >
              Product
            </button>
            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollTo('match-analysis')}
              className="hover:text-white transition-colors"
            >
              Decision Engine
            </button>
            <button
              onClick={() => handleScrollTo('features')}
              className="hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('pricing')}
              className="hover:text-white transition-colors"
            >
              Pricing
            </button>
          </nav>

          {/* Desktop Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="text-xs font-medium bg-white text-slate-950 hover:bg-slate-200 px-4 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              {isLoadingDemo ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3 text-slate-950" />
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onLoadDemoAndLaunch}
              className="text-xs font-medium bg-white text-slate-950 px-3 py-1.5 rounded-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#0c0e14] px-5 py-4 space-y-3">
            <button
              onClick={() => handleScrollTo('product-overview')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Product
            </button>
            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollTo('match-analysis')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Decision Engine
            </button>
            <button
              onClick={() => handleScrollTo('features')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('pricing')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Pricing
            </button>
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={onLaunchApp}
                className="w-full py-2 rounded-lg bg-white/[0.05] text-xs font-medium text-white"
              >
                Log in to Workspace
              </button>
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full py-2 rounded-lg bg-white text-slate-950 text-xs font-medium"
              >
                Launch Sandbox Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION: Editorial, Product-First, High Craft
      ────────────────────────────────────────────────────────────── */}
      <section id="product-overview" className="relative pt-16 md:pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {/* Subtle Label */}
          <div className="editorial-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="tracking-wide">WORK DISCOVERY PLATFORM</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400">DECISION INTELLIGENCE</span>
          </div>

          {/* Enormous Editorial Headline */}
          <h1 className="editorial-reveal text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-white leading-[1.06] mb-6">
            Find work <br />
            <span className="text-slate-200">that fits.</span>
          </h1>

          {/* Restrained, Confident Copy */}
          <p className="editorial-reveal text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto mb-8">
            WorkMatch helps freelancers discover opportunities that match their skills, experience, preferences, and availability. Less searching. Better opportunities. More focused applications.
          </p>

          {/* Hero CTAs */}
          <div className="editorial-reveal flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoadingDemo ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Find Your Matches</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>

            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0e111a] hover:bg-[#131724] text-slate-300 border border-white/[0.08] hover:border-white/[0.14] text-sm font-medium transition-all"
            >
              See How It Works
            </button>
          </div>

          {/* Understated Social Proof */}
          <div className="editorial-reveal mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>Designed for independent professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>Upwork, Fiverr & Direct Inbound</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>100% verified profile claims</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. PRODUCT HERO VISUAL (Real Interactive Interface)
        ────────────────────────────────────────────────────────────── */}
        <div className="editorial-reveal relative max-w-4xl mx-auto rounded-2xl bg-[#0c0e16] border border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Subtle real-world atmospheric layer (monochrome desaturated modern workspace) */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale pointer-events-none"
            style={{ backgroundImage: `url(${siteImages.hero})` }}
          />

          {/* Interface Header Bar */}
          <div className="relative px-5 py-3.5 border-b border-white/[0.08] bg-[#0e111c]/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
              </div>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                WorkMatch Recommendation Radar
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EVALUATION ENGINE: ACTIVE</span>
            </div>
          </div>

          {/* Interactive Parameters Bar (Subtle intelligence demonstration) */}
          <div className="relative px-5 py-4 bg-[#090b12] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-300">Test Your Criteria:</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              {/* Budget Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Target Rate:</span>
                <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08]">
                  {[35, 50, 75].map(b => (
                    <button
                      key={b}
                      onClick={() => setHeroBudget(b)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        heroBudget === b ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ${b}/hr
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Complexity:</span>
                <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08]">
                  {(['Low', 'Medium', 'High'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setHeroComplexity(c)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        heroComplexity === c ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Availability:</span>
                <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08]">
                  {[10, 20, 35].map(h => (
                    <button
                      key={h}
                      onClick={() => setHeroAvailability(h)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        heroAvailability === h ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {h}h/wk
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product UI Discovery Card */}
          <div className="relative p-6 sm:p-8 space-y-6">
            {/* Top row: Role, Platform, Rate, and Recommendation Metric */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Upwork Enterprise
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Remote · {heroAvailability} hrs/week
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Frontend Developer
                </h3>
                <p className="text-sm font-mono text-slate-400 mt-1">
                  React / TypeScript Architect · $30–$50/hr
                </p>
              </div>

              {/* Professional Recommendation Score */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-3 bg-[#111420] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-white/[0.08]">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    Fit Recommendation
                  </span>
                  <div className="flex items-baseline gap-1.5 sm:justify-end">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 tracking-tight">
                      {heroLiveMatch}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ 100</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {heroLiveMatch >= 90 ? 'Strong Fit' : 'Moderate Fit'}
                </span>
              </div>
            </div>

            {/* "Why this fits you" Evaluation Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Why this fits you
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0e111a] border border-white/[0.06] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Skills Overlap</span>
                    <span className="text-slate-400">React · TypeScript · Tailwind (100% verified profile match)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0e111a] border border-white/[0.06] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Experience Requirement</span>
                    <span className="text-slate-400">4+ years background matches client seniority expectations</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0e111a] border border-white/[0.06] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Budget Target</span>
                    <span className="text-slate-400">
                      Within your ${heroBudget}/hr criteria (${heroBudget <= 50 ? 'Strong alignment' : 'Acceptable range'})
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0e111a] border border-white/[0.06] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Time & Availability</span>
                    <span className="text-slate-400">
                      Fits your {heroAvailability} hrs/week calendar without conflicting commitments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Evaluated against 8 personal criteria · Instant client trust verification
              </span>
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Opportunity in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PROBLEM SECTION: Editorial Visual Story
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            The Traditional Search Friction
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Freelance search shouldn't feel like this.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Sorting through unfiltered job boards drains hours of creative energy before you even begin writing a proposal.
          </p>
        </div>

        {/* Visual Progression: The Friction Pipeline */}
        <div className="relative mb-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 text-center">
            {[
              { step: '100+ Listings', sub: 'Raw uncurated feeds' },
              { step: 'Irrelevant Stacks', sub: 'Mismatched skills' },
              { step: 'Random Budgets', sub: 'Below your rate' },
              { step: 'Vague Deadlines', sub: 'Unstated expectations' },
              { step: 'Hours of Comparison', sub: 'Endless open tabs' },
              { step: '"Is this worth it?"', sub: 'Persistent fatigue', highlight: true }
            ].map((node, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border transition-colors ${
                  node.highlight
                    ? 'bg-rose-500/[0.08] border-rose-500/25 text-rose-300'
                    : 'bg-[#0d1018] border-white/[0.06] text-slate-300'
                }`}
              >
                <span className="text-xs font-semibold block mb-1">{node.step}</span>
                <span className="text-[11px] font-mono text-slate-400">{node.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transition: Transformation into WorkMatch Clarity */}
        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-10 text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2">
            The WorkMatch Difference
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            WorkMatch makes the decision simpler.
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            Instead of manually cross-referencing dozens of job descriptions, WorkMatch scores every listing against your verified stack, hourly rate, and capacity before you even open it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#0e111a] border border-white/[0.06]">
              <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">01 · FILTERED INTAKE</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your platforms once. Listings with low budgets or irrelevant skills are quietly discarded.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0e111a] border border-white/[0.06]">
              <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">02 · OBJECTIVE SCORING</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                See a transparent 0–100 recommendation metric calculated from 5 mathematical dimensions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0e111a] border border-white/[0.06]">
              <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">03 · TRUTHFUL PROPOSALS</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Draft compelling proposals constrained strictly by verified work history—never fabricating skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS: Sophisticated 4-Step Sequence
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Workflow Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            How WorkMatch Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A quiet, deterministic workflow designed to keep independent craftspeople focused on high-fit contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              number: '01',
              title: 'Set your preferences',
              description:
                'Declare your rate floor, verified technical stack, maximum weekly commitment, and preferred project complexity.'
            },
            {
              number: '02',
              title: 'Browse opportunities',
              description:
                'Unified intake continuously monitors Upwork, Fiverr, and direct leads, standardizing listings into a calm feed.'
            },
            {
              number: '03',
              title: 'See how well they fit',
              description:
                'Review multi-factor recommendation scores with transparent rationale for skills, budget, deadline, and scope.'
            },
            {
              number: '04',
              title: 'Apply with confidence',
              description:
                'Prepare tailored, truth-checked applications under complete human control. Nothing is ever sent automatically.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] hover:border-white/[0.16] transition-colors relative flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-mono font-semibold text-slate-500 mb-4 block">
                  {item.number}
                </span>
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. MATCH ANALYSIS: The Decision-Support Interface
      ────────────────────────────────────────────────────────────── */}
      <section id="match-analysis" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-3">
            Objective Decision Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            See why an opportunity fits.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            No black-box mystery. Every recommendation is supported by mathematical factor weights and transparent verification.
          </p>
        </div>

        {/* Opportunity Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {sampleOpportunities.map(opp => (
            <button
              key={opp.id}
              onClick={() => setSelectedOppId(opp.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                selectedOppId === opp.id
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'bg-[#0e111a] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {opp.role} · {opp.matchScore} Fit
            </button>
          ))}
        </div>

        {/* Decision Analysis Card */}
        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                  {currentAnalysisOpp.platform}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentAnalysisOpp.timeEstimate}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                {currentAnalysisOpp.title}
              </h3>
              <p className="text-sm font-mono text-slate-400 mt-1">
                Budget: {currentAnalysisOpp.budget}
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-[#0e111c] px-4 py-3 rounded-xl border border-white/[0.08]">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Overall Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-emerald-400">
                    {currentAnalysisOpp.matchScore}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Factor Bars */}
          <div className="py-6 border-b border-white/[0.08] space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Multi-Factor Evaluation Breakdown
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Skills Fit</span>
                  <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.skills}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentAnalysisOpp.factors.skills}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Budget Alignment</span>
                  <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.budget}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentAnalysisOpp.factors.budget}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Experience Seniority</span>
                  <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.experience}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentAnalysisOpp.factors.experience}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Time & Capacity Fit</span>
                  <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.time}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentAnalysisOpp.factors.time}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist: Why This Opportunity Fits */}
          <div className="pt-6 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Why this opportunity fits
            </span>
            <div className="space-y-2">
              {currentAnalysisOpp.whyItFits.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. MIDWAY EDITORIAL PHOTOGRAPHY SECTION: Atmospheric Calm
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-8 sm:p-14 border border-white/[0.08] shadow-2xl">
          {/* Authentic High-Quality Real Photography (Unsplash creative professional workspace) */}
          <div
            className="absolute inset-0 bg-cover bg-center grayscale opacity-25"
            style={{ backgroundImage: `url(${siteImages.editorial})` }}
          />

          {/* Deep Dark Overlay for Pristine Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/80 to-[#090b10]/60 pointer-events-none" />

          {/* Minimal Editorial Text */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
              Craftsmanship & Focus
            </span>
            <blockquote className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
              Spend less time searching. <br />
              <span className="text-slate-300">More time doing work that matters.</span>
            </blockquote>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-lg mx-auto leading-relaxed">
              WorkMatch is built for independent professionals who treat their freelance practice with discipline, precision, and focus.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BENTO FEATURES: Refined Layout with Real Product UI
      ────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Designed for thoughtful decisions.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every feature in WorkMatch exists to eliminate guesswork and protect your focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Better Matches */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">01 · RELEVANCE</span>
              <h3 className="text-lg font-semibold text-white">Better Matches</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See opportunities that match your genuine skills, verified work history, and target rate.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>TypeScript Architect</span>
                <span className="text-emerald-400 font-bold">96 Match</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-slate-300">React 18</span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-slate-300">Vite</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-400 border border-emerald-500/20">Verified Fit</span>
              </div>
            </div>
          </div>

          {/* 2. Clear Decisions */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">02 · TRANSPARENCY</span>
              <h3 className="text-lg font-semibold text-white">Clear Decisions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand exactly why an opportunity fits before spending 30 minutes writing an application.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Rate Alignment</span>
                <span className="text-slate-200">100% Fit</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Timeline Window</span>
                <span className="text-slate-200">20h Open</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Client Reputation</span>
                <span className="text-emerald-400 font-medium">★ 4.98 Verified</span>
              </div>
            </div>
          </div>

          {/* 3. Your Preferences */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">03 · CONTROL</span>
              <h3 className="text-lg font-semibold text-white">Your Preferences</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control budget minimums, weekly capacity, complexity, and asynchronous communication requirements.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Minimum Rate Floor:</span>
                <span className="text-slate-200 font-semibold">$50/hr</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Weekly Max:</span>
                <span className="text-slate-200 font-semibold">25 hrs/wk</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Async-First:</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* 4. Smart Alerts */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">04 · NOTIFICATIONS</span>
              <h3 className="text-lg font-semibold text-white">Smart Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive quiet notifications only when high-fit listings (≥90 match) appear in your connected marketplaces.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>New 94-Score Listing Detected</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Upwork: Senior React Architect ($65/hr)
              </p>
            </div>
          </div>

          {/* 5. Proposal Assistance */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">05 · TRUTHFULNESS</span>
              <h3 className="text-lg font-semibold text-white">Proposal Assistance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate proposal drafts strictly cross-referenced against your declared profile. Zero hallucinated claims.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>100% Truthfulness Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Claims cross-checked against profile inventory
              </p>
            </div>
          </div>

          {/* 6. Application Tracking */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">06 · ORGANIZATION</span>
              <h3 className="text-lg font-semibold text-white">Application Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep opportunities, outreach status, and active contracts unified in a single, distraction-free board.
              </p>
            </div>
            {/* Real Mini Product UI */}
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-400">Saved (4)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-400">Applied (3)</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-400">Offer (1)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. PERSONALIZATION: Interactive Preferences Interface
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Custom Fit Tuning
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Your preferences. Your opportunities.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Tune your discovery parameters in real time. WorkMatch evaluates every incoming contract against your exact boundaries.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left: Preferences Form */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Hourly Rate Target</span>
                  <span className="text-white font-semibold">${prefRateFloor} — ${prefRateFloor + 35}/hr</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="120"
                  step="5"
                  value={prefRateFloor}
                  onChange={e => setPrefRateFloor(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.06] rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">Experience Seniority</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mid', 'Senior', 'Lead'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setPrefExperience(lvl)}
                      className={`py-2 rounded-lg text-xs font-mono transition-colors border ${
                        prefExperience === lvl
                          ? 'bg-white text-slate-950 font-semibold border-white'
                          : 'bg-[#0e111a] text-slate-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Weekly Capacity</span>
                  <span className="text-white font-semibold">{prefHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={prefHours}
                  onChange={e => setPrefHours(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.06] rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">Project Complexity</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Focused', 'Moderate', 'Architectural'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setPrefComplexity(c)}
                      className={`py-2 rounded-lg text-xs font-mono transition-colors border ${
                        prefComplexity === c
                          ? 'bg-white text-slate-950 font-semibold border-white'
                          : 'bg-[#0e111a] text-slate-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Preference Preview & Confirmation */}
            <div className="p-6 rounded-xl bg-[#090b12] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Profile Configuration
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE SYNC
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Target Range:</span>
                    <span className="text-slate-200">${prefRateFloor} — ${prefRateFloor + 35}/hr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Seniority Bracket:</span>
                    <span className="text-slate-200">{prefExperience} Practitioner</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Commitment Cap:</span>
                    <span className="text-slate-200">{prefHours} hrs/week</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-slate-400">Complexity Filter:</span>
                    <span className="text-slate-200">{prefComplexity}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Remote Verification:</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <p className="text-xs font-mono text-emerald-400 mb-3">
                  ✓ Your matches update automatically. 3 high-fit opportunities currently match your exact criteria.
                </p>
                <button
                  onClick={onLoadDemoAndLaunch}
                  className="w-full py-2.5 rounded-lg bg-white text-slate-950 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Test Profile in Sandbox
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. JOB DISCOVERY: Premium Professional Browser
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Real-Time Radar
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Curated opportunities, zero noise.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every contract normalized into a clean, readable overview with verified client metrics and transparent match scores.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'frontend', label: 'Frontend & UI' },
            { id: 'fullstack', label: 'Full Stack & APIs' },
            { id: 'mobile', label: 'Mobile & Systems' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeCategory === tab.id
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'bg-[#0c0e16] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Opportunities List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredOpportunities.map(opp => (
            <div
              key={opp.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                    {opp.platform}
                  </span>
                  <span className="text-slate-400">{opp.timeEstimate}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {opp.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/[0.04] text-[11px] font-mono text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Rate, Match Metric & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] flex-shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-mono font-semibold text-white block">
                    {opp.budget}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {opp.matchScore} Fit Score
                  </span>
                </div>
                <button
                  onClick={onLoadDemoAndLaunch}
                  className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white text-slate-200 hover:text-slate-950 font-semibold text-xs transition-colors border border-white/[0.1]"
                >
                  View in Workspace
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. PROPOSALS: Complete Human Control Workflow
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Human-in-the-Loop Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            You remain in complete control.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            WorkMatch is not an autonomous bot that spams recruiters. It assists your proposal preparation using strictly verified profile facts.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-10 max-w-3xl mx-auto font-mono text-xs">
          {[
            { step: '01', title: 'Opportunity' },
            { step: '02', title: 'Review Fit' },
            { step: '03', title: 'Customize Draft' },
            { step: '04', title: 'Submit' }
          ].map((w, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#0c0e16] border border-white/[0.08]">
              <span className="text-slate-500 font-bold block mb-1">{w.step}</span>
              <span className="text-slate-200 font-semibold">{w.title}</span>
            </div>
          ))}
        </div>

        {/* Interactive Proposal Studio Preview */}
        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Proposal Assistant Preview
            </span>
            <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08] text-xs font-mono">
              {(['direct', 'technical', 'consultative'] as const).map(angle => (
                <button
                  key={angle}
                  onClick={() => setProposalAngle(angle)}
                  className={`px-3 py-1 rounded capitalize transition-colors ${
                    proposalAngle === angle ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {angle}
                </button>
              ))}
            </div>
          </div>

          {/* Proposal Draft Body */}
          <div className="p-5 rounded-xl bg-[#090b12] border border-white/[0.06] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mb-4">
            {proposalDraft}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>100% verified profile skills used</span>
            </span>
            <button
              onClick={handleCopyProposal}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>{isCopied ? 'Copied to Clipboard' : 'Copy Sample Proposal'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. PRICING SECTION: Clean, Transparent
      ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Simple, predictable plans.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            No surprise add-ons. Full access to marketplace discovery, scoring, and proposal preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Starter */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Sandbox</span>
              <h3 className="text-xl font-semibold text-white mb-1">Free Explorer</h3>
              <p className="text-xs text-slate-400 mb-6">Explore the recommendation engine with demo data.</p>
              <div className="text-3xl font-mono font-bold text-white mb-6">$0</div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Mock Simulation Dataset</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>15 Opportunity Fit Audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proposal Assistant Editor</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLoadDemoAndLaunch}
              className="mt-8 w-full py-2.5 rounded-lg bg-white/[0.06] hover:bg-white text-slate-200 hover:text-slate-950 font-semibold text-xs transition-colors border border-white/[0.1]"
            >
              Launch Free Sandbox
            </button>
          </div>

          {/* Pro Freelancer (Featured) */}
          <div className="p-6 rounded-2xl bg-[#101422] border border-emerald-500/30 flex flex-col justify-between relative shadow-xl">
            <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold tracking-wider uppercase">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">Independent</span>
              <h3 className="text-xl font-semibold text-white mb-1">Pro Freelancer</h3>
              <p className="text-xs text-slate-400 mb-6">For craftspeople actively acquiring contracts.</p>
              <div className="text-3xl font-mono font-bold text-white mb-6">
                $29 <span className="text-xs font-normal text-slate-400 font-sans">/ month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unlimited Marketplace Discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Fit Scoring & Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Truth-Checked Proposal Drafting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Emergency Safety Kill Switch</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="mt-8 w-full py-2.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
            >
              Start Pro Access
            </button>
          </div>

          {/* Studio / Agency */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Team</span>
              <h3 className="text-xl font-semibold text-white mb-1">Studio / Agency</h3>
              <p className="text-xs text-slate-400 mb-6">For multi-person teams and talent networks.</p>
              <div className="text-3xl font-mono font-bold text-white mb-6">
                $79 <span className="text-xs font-normal text-slate-400 font-sans">/ month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Profile Capability Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Team Workload & Capacity Balancing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Priority Channel Webhooks</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="mt-8 w-full py-2.5 rounded-lg bg-white/[0.06] hover:bg-white text-slate-200 hover:text-slate-950 font-semibold text-xs transition-colors border border-white/[0.1]"
            >
              Open Studio Workspace
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. FAQ SECTION: Clear, Human Answers
      ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Everything you need to know about WorkMatch recommendation engine, safety, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Does WorkMatch apply to jobs automatically without my approval?',
              a: 'No. WorkMatch is an intelligence and decision-support tool, not an autonomous spam bot. Every proposal draft must be reviewed, confirmed, and dispatched by you.'
            },
            {
              q: 'How does the recommendation fit score work?',
              a: 'WorkMatch evaluates every opportunity across 5 mathematical dimensions: skills overlap, budget floor, experience level, weekly capacity, and client payment reputation. The resulting 0–100 score gives you an instant measure of fit.'
            },
            {
              q: 'Can I test WorkMatch without connecting live accounts?',
              a: 'Yes! WorkMatch includes full Mock Simulation Mode with a 1-click demo seed dataset that creates realistic marketplace jobs, verified client profiles, and test proposals instantly.'
            },
            {
              q: 'How does WorkMatch prevent hallucinated or exaggerated claims in proposals?',
              a: 'The proposal assistant strictly checks every reference against your declared profile inventory. If a job mentions a technology you do not possess, WorkMatch will never fabricate experience.'
            },
            {
              q: 'What is the Safety Emergency Stop?',
              a: 'A prominent safety control available on all views. Activating it engages an immediate system-wide tripwire that halts all proposal generation across all connected channels.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0c0e16] border border-white/[0.08] transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.06] mt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. FINAL CTA: Confident, Editorial, Clean
      ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="rounded-3xl bg-[#0c0e16] border border-white/[0.08] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle real-world photography accent */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.05] grayscale pointer-events-none"
            style={{ backgroundImage: `url(${siteImages.workspace})` }}
          />

          <div className="relative space-y-5">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block">
              Begin Decision Discovery
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Your next opportunity should fit.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
              Stop sorting through jobs that aren't right for you. Explore the live sandbox demo right now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoadingDemo ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Find Your Matches</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#0e111a] hover:bg-[#131724] text-slate-300 border border-white/[0.08] hover:border-white/[0.14] text-sm font-medium transition-all"
              >
                Open Workspace Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          15. FOOTER: Minimalist Editorial
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] py-10 px-4 sm:px-6 text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">WorkMatch</span>
            <span>•</span>
            <span>Work discovery and decision intelligence for freelancers</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => handleScrollTo('product-overview')} className="hover:text-white transition-colors">
              Product
            </button>
            <button onClick={() => handleScrollTo('how-it-works')} className="hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => handleScrollTo('pricing')} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-white transition-colors">
              FAQ
            </button>
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
