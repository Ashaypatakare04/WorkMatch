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
  ShieldAlert,
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
  clientRep: string;
  clientSpent: string;
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
    clientRep: '★ 4.98 Rating',
    clientSpent: '$120k+ spent',
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
    clientRep: '★ 5.0 Enterprise',
    clientSpent: '$240k+ spent',
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
    clientRep: '★ 4.95 Pro Client',
    clientSpent: '$45k+ spent',
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
  const [heroComplexity, setHeroComplexity] = useState<'Focused' | 'Moderate' | 'Architectural'>('Moderate');
  const [heroAvailability, setHeroAvailability] = useState<number>(20);

  // Match Analysis Selected Opportunity
  const [selectedOppId, setSelectedOppId] = useState<string>('frontend-lead');

  // Job Discovery Category Filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'fullstack' | 'mobile'>('all');

  // Interactive Formula Simulator State (Ported from GitHub version with refined design)
  const [simSkillFit, setSimSkillFit] = useState<number>(88);
  const [simExperience, setSimExperience] = useState<number>(94);
  const [simHourlyRate, setSimHourlyRate] = useState<number>(85);
  const [simComplexity, setSimComplexity] = useState<'Focused' | 'Moderate' | 'Architectural'>('Moderate');
  const [simDeadline, setSimDeadline] = useState<'Flexible' | 'Standard' | 'Urgent'>('Standard');

  // Interactive ROI Calculator State (Ported from GitHub version)
  const [monthlyProposals, setMonthlyProposals] = useState<number>(30);

  // Interactive Personalization Controls
  const [prefRateFloor, setPrefRateFloor] = useState<number>(40);
  const [prefExperience, setPrefExperience] = useState<'Mid' | 'Senior' | 'Lead'>('Senior');
  const [prefHours, setPrefHours] = useState<number>(20);
  const [prefComplexity, setPrefComplexity] = useState<'Focused' | 'Moderate' | 'Architectural'>('Moderate');

  // Proposal Studio Persona, Copy & Human Review Checkbox
  const [proposalAngle, setProposalAngle] = useState<'direct' | 'technical' | 'consultative'>('direct');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [humanReviewApproved, setHumanReviewApproved] = useState<boolean>(true);

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
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Compute live match score in hero preview based on user parameters
  const heroLiveMatch = useMemo(() => {
    let score = 94;
    if (heroBudget >= 60) score -= 3;
    if (heroBudget <= 35) score += 2;
    if (heroComplexity === 'Moderate') score += 2;
    if (heroComplexity === 'Architectural') score -= 4;
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

  // Computed score for Formula Simulator
  const simBudgetScore = useMemo(() => {
    if (simHourlyRate >= 80) return 96;
    if (simHourlyRate >= 60) return 92;
    if (simHourlyRate >= 45) return 86;
    return 78;
  }, [simHourlyRate]);

  const simComplexityScore = useMemo(() => {
    if (simComplexity === 'Moderate') return 95;
    if (simComplexity === 'Focused') return 90;
    return 85;
  }, [simComplexity]);

  const simDeadlineScore = useMemo(() => {
    if (simDeadline === 'Flexible') return 98;
    if (simDeadline === 'Standard') return 92;
    return 80;
  }, [simDeadline]);

  const computedSimScore = useMemo(() => {
    return Math.min(
      99,
      Math.round(
        simSkillFit * 0.35 +
        simExperience * 0.25 +
        simBudgetScore * 0.20 +
        simComplexityScore * 0.10 +
        simDeadlineScore * 0.10
      )
    );
  }, [simSkillFit, simExperience, simBudgetScore, simComplexityScore, simDeadlineScore]);

  // SVG Radial Gauge Calculation Helper
  const getGaugeProps = (score: number, radius = 42) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return { circumference, strokeDashoffset, radius };
  };

  // ROI Calculator Calculations
  const hoursSavedPerMonth = useMemo(() => Math.round(monthlyProposals * 0.7), [monthlyProposals]);
  const connectsSavedPerMonth = useMemo(() => Math.round(monthlyProposals * 6), [monthlyProposals]);

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
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-300">
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
              Workflow
            </button>
            <button
              onClick={() => handleScrollTo('cockpit')}
              className="hover:text-white transition-colors"
            >
              Decision Cockpit
            </button>
            <button
              onClick={() => handleScrollTo('simulator')}
              className="hover:text-white transition-colors"
            >
              Formula Simulator
            </button>
            <button
              onClick={() => handleScrollTo('studio')}
              className="hover:text-white transition-colors"
            >
              Proposal Studio
            </button>
            <button
              onClick={() => handleScrollTo('comparison')}
              className="hover:text-white transition-colors"
            >
              Comparison
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
                  <span>Find Your Matches</span>
                  <ArrowRight className="w-3 h-3 text-slate-950" />
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
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
          <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0e14] px-5 py-4 space-y-3">
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
              Workflow
            </button>
            <button
              onClick={() => handleScrollTo('cockpit')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Decision Cockpit
            </button>
            <button
              onClick={() => handleScrollTo('simulator')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Formula Simulator
            </button>
            <button
              onClick={() => handleScrollTo('studio')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Proposal Studio
            </button>
            <button
              onClick={() => handleScrollTo('comparison')}
              className="block w-full text-left py-2 text-sm text-slate-300"
            >
              Comparison
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
            3. PRODUCT HERO VISUAL (Enhanced with Radial Gauge & Parameter Tuning)
        ────────────────────────────────────────────────────────────── */}
        <div className="editorial-reveal relative max-w-4xl mx-auto rounded-2xl bg-[#0c0e16] border border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Subtle real-world atmospheric layer (monochrome desaturated modern workspace) */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.06] grayscale pointer-events-none"
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
                Live Opportunity Recommendation
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MATCHING ENGINE: ACTIVE</span>
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
                  {(['Focused', 'Moderate', 'Architectural'] as const).map(c => (
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
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
                <p className="text-sm font-mono text-slate-400">
                  React / TypeScript Architect · $45–$65/hr
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                  <span>★ 4.98 Client ($120k+ spent)</span>
                  <span>•</span>
                  <span>Low Risk Verified</span>
                </div>
              </div>

              {/* SVG Radial Score Gauge (Integrated from GitHub version) */}
              <div className="flex items-center gap-4 bg-[#111420] sm:bg-[#090b12] p-4 rounded-xl border border-white/[0.08] flex-shrink-0">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-white/[0.08]"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-emerald-400 transition-all duration-700 ease-out"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 - (heroLiveMatch / 100) * (2 * Math.PI * 40)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold font-mono text-emerald-400 leading-none">
                      {heroLiveMatch}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">SCORE</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Fit Recommendation
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-300 block">
                    {heroLiveMatch >= 90 ? 'High Fit Recommendation' : 'Moderate Match'}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Top 5% of candidate pool
                  </span>
                </div>
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
          5. COMPLETE PRODUCT WORKFLOW: 5-Stage Storytelling
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            The Complete Freelance Workflow
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From initial multi-channel intake through to application delivery and milestone tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Discover',
              subtitle: 'Multi-Marketplace Intake',
              desc: 'Normalizes active listings from Upwork, Fiverr, and direct leads into a unified, deduplicated feed.'
            },
            {
              step: '02',
              title: 'Evaluate',
              subtitle: 'Mathematical Fit Score',
              desc: 'Scores opportunities across skills, budget floor, client reputation, and availability.'
            },
            {
              step: '03',
              title: 'Understand',
              subtitle: 'Transparent Reasoning',
              desc: 'Detailed checklists show exactly why a contract fits your declared profile without guesswork.'
            },
            {
              step: '04',
              title: 'Prepare',
              subtitle: 'Truth-Checked Drafts',
              desc: 'Synthesizes structured proposals strictly constrained by verified experience under complete human review.'
            },
            {
              step: '05',
              title: 'Track',
              subtitle: 'Unified Pipeline',
              desc: 'Keeps your opportunities, sent applications, and active contracts organized in a single quiet board.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0c0e16] border border-white/[0.08] hover:border-white/[0.16] transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-xl font-mono font-semibold text-slate-500 mb-2 block">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-white mb-0.5">
                  {item.title}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 block mb-2">
                  {item.subtitle}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. LIVE OPPORTUNITY MATCH COCKPIT (Decision Engine Deep Dive)
      ────────────────────────────────────────────────────────────── */}
      <section id="cockpit" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-3">
            Decision Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Live Opportunity Match Cockpit
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Inspect real contracts evaluated against verified profile bounds, payment security, and workload capacity.
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

        {/* 2-Column Cockpit Interface */}
        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-9 shadow-2xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Job Intel & Verification (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-200 border border-white/[0.08]">
                    {currentAnalysisOpp.platform}
                  </span>
                  <span className="text-slate-400">{currentAnalysisOpp.timeEstimate}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                  {currentAnalysisOpp.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  {currentAnalysisOpp.summary}
                </p>
              </div>

              {/* Key Metrics Chips */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#090b12] border border-white/[0.06]">
                  <span className="text-slate-400 block text-[10px] uppercase">Offered Budget</span>
                  <span className="text-white font-semibold text-sm">{currentAnalysisOpp.budget}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090b12] border border-white/[0.06]">
                  <span className="text-slate-400 block text-[10px] uppercase">Client Payment History</span>
                  <span className="text-emerald-400 font-semibold text-sm">{currentAnalysisOpp.clientRep} ({currentAnalysisOpp.clientSpent})</span>
                </div>
              </div>

              {/* "Why this opportunity fits" Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Profile Alignment Check
                </span>
                {currentAnalysisOpp.whyItFits.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleScrollTo('studio')}
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white text-slate-200 hover:text-slate-950 font-semibold text-xs transition-colors border border-white/[0.1] flex items-center gap-1.5"
                >
                  <span>Prepare Draft in Proposal Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Radial Match Gauge & Factor Breakdown (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#090b12] border border-white/[0.06] space-y-5">
              {/* Circular Gauge Display */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-white/[0.08]"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-emerald-400 transition-all duration-700 ease-out"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 - (currentAnalysisOpp.matchScore / 100) * (2 * Math.PI * 40)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold font-mono text-emerald-400 leading-none">
                      {currentAnalysisOpp.matchScore}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">FIT</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Composite Match Metric
                  </span>
                  <span className="text-xs font-mono font-semibold text-white block">
                    {currentAnalysisOpp.matchScore >= 90 ? 'Priority Opportunity' : 'Strong Alignment'}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    100% verified profile alignment
                  </span>
                </div>
              </div>

              {/* 5-Dimension Factor Bars */}
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Skills Overlap</span>
                    <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.skills}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentAnalysisOpp.factors.skills}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Budget Alignment</span>
                    <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.budget}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentAnalysisOpp.factors.budget}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Experience Seniority</span>
                    <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.experience}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentAnalysisOpp.factors.experience}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Availability Capacity</span>
                    <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.time}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentAnalysisOpp.factors.time}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Client Trust & History</span>
                    <span className="text-emerald-400 font-semibold">{currentAnalysisOpp.factors.reputation}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentAnalysisOpp.factors.reputation}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. INTERACTIVE MATCH FORMULA SIMULATOR (Ported from GitHub)
      ────────────────────────────────────────────────────────────── */}
      <section id="simulator" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Mathematical Evaluation
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Test the Opportunity Match Formula
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Adjust the sliders below to simulate how WorkMatch objectively evaluates any freelance contract listing against your profile.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-9 shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Skill Alignment with Profile:</span>
                  <span className="text-emerald-400 font-semibold">{simSkillFit}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simSkillFit}
                  onChange={e => setSimSkillFit(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  aria-label="Skill Alignment"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Verified Experience Depth:</span>
                  <span className="text-emerald-400 font-semibold">{simExperience}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={simExperience}
                  onChange={e => setSimExperience(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  aria-label="Experience Depth"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Offered Hourly Rate:</span>
                  <span className="text-white font-semibold">${simHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="5"
                  value={simHourlyRate}
                  onChange={e => setSimHourlyRate(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  aria-label="Hourly Rate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-2">Scope Complexity:</span>
                  <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08]">
                    {(['Focused', 'Moderate', 'Architectural'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setSimComplexity(c)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono transition-colors ${
                          simComplexity === c ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-2">Timeline Flexibility:</span>
                  <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08]">
                    {(['Flexible', 'Standard', 'Urgent'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setSimDeadline(d)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono transition-colors ${
                          simDeadline === d ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Output Gauge (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-[#090b12] border border-white/[0.06] text-center space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Calculated Recommendation Score
              </span>

              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-white/[0.08]"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-emerald-400 transition-all duration-500 ease-out"
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 - (computedSimScore / 100) * (2 * Math.PI * 40)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-mono text-emerald-400 leading-none">
                    {computedSimScore}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300">
                <span className="text-emerald-400 font-semibold">
                  {computedSimScore >= 90 ? 'Priority Application' : computedSimScore >= 80 ? 'Viable Opportunity' : 'Below Profile Threshold'}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Formula: 35% Skills + 25% Experience + 20% Budget + 10% Scope + 10% Timeline
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. MIDWAY EDITORIAL PHOTOGRAPHY SECTION: Atmospheric Calm
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
          9. BENTO FEATURES: Refined Layout with Real Product UI
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
            <div className="p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06] text-xs font-mono flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-400">Saved (4)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-400">Applied (3)</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-400">Active (1)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. PROPOSALS STUDIO (Professional 2-Column Split Layout with Human Review)
      ────────────────────────────────────────────────────────────── */}
      <section id="studio" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-3">
            Human-in-the-Loop Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Authentic Proposals Under Your Control
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            WorkMatch is not an autonomous bot that spams recruiters. It assists your proposal preparation using strictly verified profile facts.
          </p>
        </div>

        {/* 2-Column Proposal Studio Layout */}
        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] shadow-2xl max-w-5xl mx-auto overflow-hidden">
          {/* Studio Top Bar */}
          <div className="px-6 py-3 bg-[#090b12] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300">1. Job Intake</span>
              <span className="text-white/20">→</span>
              <span className="text-slate-300">2. Fit Audit</span>
              <span className="text-white/20">→</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                3. Truth-Checked Proposal
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              Opportunity: Senior Frontend Architect
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Fact Verification Checklist (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-[#090b12] border border-white/[0.06] space-y-4">
                <div className="pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Verified Profile Claims
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold mt-0.5 block">
                    100% Truthfulness Guarantee Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-300 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Profile verified for React 18 & TypeScript (4.5 yrs)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-300 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Offered $45–$65/hr rate is within verified target</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-300 flex items-start gap-2">
                    <Check className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>20 hrs/week schedule matches open calendar capacity</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-slate-400 leading-relaxed border-t border-white/[0.06]">
                  WorkMatch strictly refuses to invent skills or exaggerate experience. Only verified capabilities from your profile are referenced.
                </div>
              </div>

              {/* Right Column: Persona Switcher & Draft Editor (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Persona Tabs */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Tone Angle:
                  </span>
                  <div className="flex rounded-md bg-white/[0.05] p-0.5 border border-white/[0.08] text-xs font-mono">
                    {[
                      { id: 'direct', label: 'Direct & Concise' },
                      { id: 'technical', label: 'Technical Architecture' },
                      { id: 'consultative', label: 'Consultative Strategy' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setProposalAngle(t.id as any)}
                        className={`px-3 py-1 rounded transition-colors ${
                          proposalAngle === t.id ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Proposal Textarea */}
                <div className="p-4 rounded-xl bg-[#090b12] border border-white/[0.06] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[170px]">
                  {proposalDraft}
                </div>

                {/* Human Review Approval Checkbox */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="checkbox"
                    id="human-review-check"
                    checked={humanReviewApproved}
                    onChange={e => setHumanReviewApproved(e.target.checked)}
                    className="accent-emerald-400 rounded cursor-pointer"
                  />
                  <label htmlFor="human-review-check" className="text-slate-300 font-mono text-xs cursor-pointer select-none">
                    Human Review: I have inspected and approved this tailored proposal draft.
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleCopyProposal}
                    className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Copied to Clipboard' : 'Copy Proposal Draft'}</span>
                  </button>

                  <button
                    onClick={onLoadDemoAndLaunch}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <span>Open in Proposal Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. COMPARISON MATRIX: WorkMatch vs Manual vs Spam Bots
      ────────────────────────────────────────────────────────────── */}
      <section id="comparison" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Market Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            How WorkMatch Compares
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            See why serious independent professionals choose objective decision intelligence over manual searching and robotic spam bots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Manual Freelancing */}
          <div className="p-6 rounded-2xl bg-[#0c0e16] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-400 uppercase">The Old Way</span>
                <span className="text-xs font-mono text-slate-500">MANUAL</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Manual Job Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exhausting and reliant on unscientific intuition rather than empirical fit data.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Hours lost refreshing multiple browser tabs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unfiltered jobs with incompatible budgets</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Slow drafting misses early high-visibility bid window</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unmonitored connect capital and energy waste</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Generic AI Spam Bots */}
          <div className="p-6 rounded-2xl bg-[#0e090f] border border-rose-500/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <span className="text-xs font-mono text-rose-400 uppercase">High Risk</span>
                <span className="text-xs font-mono text-rose-400">UNCONSTRAINED AI</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Generic AI Spam Bots</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cheap scrapers that flood clients with generic template spam, ruining client trust.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Canned templates flagged as spam by client filters</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Fabricates skills and years of experience (hallucinations)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Blind auto-submitting risks marketplace bans</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Zero consideration for client payment trust</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: WorkMatch Decision Intelligence */}
          <div className="p-6 rounded-2xl bg-[#091114] border border-emerald-500/30 flex flex-col justify-between relative shadow-xl">
            <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold tracking-wider uppercase">
              WorkMatch Standard
            </span>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <span className="text-xs font-mono text-emerald-400 uppercase">Verified Fit</span>
                <span className="text-xs font-mono text-emerald-400">DECISION ENGINE</span>
              </div>
              <h3 className="text-lg font-semibold text-white">WorkMatch Platform</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calm discovery, objective multi-factor scoring, and strictly truthful proposal drafts.
              </p>

              <div className="space-y-2.5 text-xs text-slate-200 pt-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Normalized intake across Upwork, Fiverr & direct leads</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% verified profile skills guarantee—zero fabrication</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Transparent 5-factor mathematical recommendation scores</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Complete human control: review, customize, and approve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. INTERACTIVE ROI CALCULATOR: Reclaimed Time & Capital
      ────────────────────────────────────────────────────────────── */}
      <section id="roi" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Efficiency Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Calculate Time & Capital Reclaimed
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Estimate how much manual search time and wasted connect capital WorkMatch recovers for you each month.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0c0e16] border border-white/[0.08] p-6 sm:p-9 shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Proposals Slider (6 cols) */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Monthly Proposals Prepared:</span>
                  <span className="text-emerald-400 font-bold text-sm">{monthlyProposals} proposals/mo</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={monthlyProposals}
                  onChange={e => setMonthlyProposals(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                  aria-label="Monthly Proposals"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>5 (Casual)</span>
                  <span>30 (Active)</span>
                  <span>60 (Studio)</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Based on an average of 42 minutes spent manually searching, reading mismatched scopes, and drafting initial bids for each client opportunity.
              </p>
            </div>

            {/* Right: Computed Reclaimed Metrics (6 cols) */}
            <div className="md:col-span-6 grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#090b12] border border-white/[0.06]">
                <span className="text-3xl font-mono font-bold text-emerald-400 block mb-1">
                  ~{hoursSavedPerMonth}h
                </span>
                <span className="text-xs font-semibold text-white block mb-0.5">Hours Reclaimed</span>
                <span className="text-[11px] font-mono text-slate-400">Search time saved per month</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090b12] border border-white/[0.06]">
                <span className="text-3xl font-mono font-bold text-white block mb-1">
                  ~{connectsSavedPerMonth}
                </span>
                <span className="text-xs font-semibold text-white block mb-0.5">Connects Protected</span>
                <span className="text-[11px] font-mono text-slate-400">Eliminated mismatched bids</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. JOB DISCOVERY & APPLICATION PIPELINE
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Real-Time Radar
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Curated Opportunities, Zero Noise
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
          14. PRICING SECTION: Clean, Transparent Plans
      ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Simple, Predictable Plans
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
          15. FAQ SECTION: Clear, Human Answers
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
          16. FINAL CTA: Confident, Editorial, Clean
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
          17. FOOTER: Minimalist Editorial
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
              Workflow
            </button>
            <button onClick={() => handleScrollTo('cockpit')} className="hover:text-white transition-colors">
              Cockpit
            </button>
            <button onClick={() => handleScrollTo('simulator')} className="hover:text-white transition-colors">
              Simulator
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
