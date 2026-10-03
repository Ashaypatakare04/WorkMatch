import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { CustomCursor } from './CustomCursor.js';
import { Hero3DSection } from './Hero3DSection.js';
import { HeroProductWindow } from './showcase/HeroProductWindow.js';
import { InteractiveProfileScreen } from './showcase/InteractiveProfileScreen.js';
import { IntelligentAnalysisMockup } from './showcase/IntelligentAnalysisMockup.js';
import { MatchScoreEngine } from './MatchScoreEngine.js';
import { WhyThisJobInteractiveCard } from './showcase/WhyThisJobInteractiveCard.js';
import { OpportunityComparisonCards } from './showcase/OpportunityComparisonCards.js';
import { DecisionSimulatorScreen } from './showcase/DecisionSimulatorScreen.js';
import { AutomationRadarDashboard } from './showcase/AutomationRadarDashboard.js';
import { WorkflowJourneyTraveler } from './showcase/WorkflowJourneyTraveler.js';
import { UniverseFilterVisualizer } from './UniverseFilterVisualizer.js';
import { JobMatchCard3D } from './JobMatchCard3D.js';

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

  // Navigation & Scroll State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeStoryStage, setActiveStoryStage] = useState('01 PROFILE');

  // FAQ Accordion State (preserving tests)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Track scroll position for navbar compaction and story progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Simple viewport progress tracker
      if (scrollY < 800) {
        setActiveStoryStage('01 PROFILE');
      } else if (scrollY < 2200) {
        setActiveStoryStage('02 DISCOVER');
      } else if (scrollY < 4200) {
        setActiveStoryStage('03 MATCH');
      } else {
        setActiveStoryStage('04 DECIDE');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper
  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const targets = containerRef.current.querySelectorAll('.landing-reveal');
    if (!targets || targets.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#070A12] text-[#F4F7FB] selection:bg-[#20D3C2]/20 selection:text-[#5EE7DF] overflow-x-hidden font-sans transition-colors duration-300"
    >
      {/* Custom Precision Follower Cursor */}
      <CustomCursor />

      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION WITH PROGRESS TRACKER (Section: Navigation)
      ────────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#070A12]/92 backdrop-blur-md border-b border-[#1B253B] py-2.5 shadow-xl'
            : 'bg-transparent border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo: WORKMATCH */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer select-none group flex items-center gap-2.5"
            data-cursor-label="HOME"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#20D3C2] shadow-[0_0_8px_#20D3C2] animate-pulse" />
            <span className="text-sm font-mono font-bold tracking-[0.25em] text-[#F4F7FB] uppercase group-hover:text-[#20D3C2] transition-colors">
              WORKMATCH
            </span>
          </div>

          {/* Navigation Links + Live Progress Indicator */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-7 text-xs font-mono font-medium text-[#9AA8BC]">
              <button
                onClick={() => handleScrollTo('product-hero')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                Product
              </button>
              <button
                onClick={() => handleScrollTo('section-profile')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => handleScrollTo('section-discovery')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                Discovery
              </button>
              <button
                onClick={() => handleScrollTo('section-matching')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                Match Engine
              </button>
              <button
                onClick={() => handleScrollTo('section-workflow')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => handleScrollTo('faq')}
                className="hover:text-[#F4F7FB] transition-colors"
              >
                FAQ
              </button>
            </nav>

            {/* Story Progress Indicator */}
            <div className="px-3 py-1 rounded-full bg-[#111A2E] border border-[#20D3C2]/30 text-[10px] font-mono font-bold text-[#20D3C2]">
              {activeStoryStage}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle variant="icon" />
            <button
              onClick={onLaunchApp}
              className="text-xs font-mono text-[#9AA8BC] hover:text-[#F4F7FB] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onLoadDemoAndLaunch}
              disabled={isLoadingDemo}
              className="text-xs font-bold font-mono bg-[#20D3C2] text-[#0B1220] hover:bg-[#5EE7DF] px-4 py-2 rounded-xl shadow-glow-teal transition-all flex items-center gap-1.5"
              data-cursor-label="MATCH"
            >
              {isLoadingDemo ? (
                <div className="w-3.5 h-3.5 border-2 border-[#0B1220] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Get Started</span>
                  <span className="sr-only">Find Your Matches</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0B1220]" />
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle variant="icon" />
            <button
              onClick={onLoadDemoAndLaunch}
              className="text-xs font-bold font-mono bg-[#20D3C2] text-[#0B1220] px-3 py-1.5 rounded-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#9AA8BC] hover:text-[#F4F7FB]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1B253B] bg-[#0D1322] px-5 py-4 space-y-3 font-mono">
            <button
              onClick={() => handleScrollTo('product-hero')}
              className="block w-full text-left py-2 text-sm text-[#9AA8BC]"
            >
              Product
            </button>
            <button
              onClick={() => handleScrollTo('section-profile')}
              className="block w-full text-left py-2 text-sm text-[#9AA8BC]"
            >
              Your Profile
            </button>
            <button
              onClick={() => handleScrollTo('section-discovery')}
              className="block w-full text-left py-2 text-sm text-[#9AA8BC]"
            >
              Discovery Universe
            </button>
            <button
              onClick={() => handleScrollTo('section-matching')}
              className="block w-full text-left py-2 text-sm text-[#20D3C2] font-semibold"
            >
              Matching Engine
            </button>
            <button
              onClick={() => handleScrollTo('section-workflow')}
              className="block w-full text-left py-2 text-sm text-[#9AA8BC]"
            >
              How it Works
            </button>
            <button
              onClick={() => handleScrollTo('faq')}
              className="block w-full text-left py-2 text-sm text-[#9AA8BC]"
            >
              FAQ
            </button>
            <div className="pt-3 border-t border-[#1B253B] flex flex-col gap-2">
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 rounded-xl bg-[#172238] text-xs font-medium text-[#F4F7FB]"
              >
                Log in to Workspace
              </button>
              <button
                onClick={onLoadDemoAndLaunch}
                className="w-full py-2.5 rounded-xl bg-[#20D3C2] text-[#0B1220] font-bold text-xs"
              >
                Launch Sandbox Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO: CINEMATIC 3D + HERO PRODUCT DEMO
      ────────────────────────────────────────────────────────────── */}
      <section id="product-hero" className="pt-8 sm:pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Editorial Heading & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-8 space-y-3">
          <span className="text-xs font-mono tracking-[0.35em] text-[#20D3C2] uppercase font-bold block">
            WORKMATCH
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F7FB] font-display leading-[1.05]">
            Find work that fits you.
          </h1>
          <p className="text-base sm:text-lg text-[#9AA8BC] max-w-2xl mx-auto leading-relaxed">
            Discover freelance opportunities matched to your skills, experience and preferences.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onLoadDemoAndLaunch}
              className="px-8 py-3.5 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] text-sm font-bold font-mono transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-glow-teal"
              data-cursor-label="EXPLORE"
            >
              <span>Explore WorkMatch</span>
              <ArrowRight className="w-4 h-4 text-[#0B1220]" />
            </button>
          </div>
        </div>

        {/* HERO PRODUCT DEMO: Floating 3D Browser Window (ASHAY Profile -> Laser Scan -> Filtered Jobs) */}
        <HeroProductWindow onSelectJob={onLoadDemoAndLaunch} />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 01 — YOUR PROFILE
             Headline: Start with you.
             Description: Tell WorkMatch what you can do and what you want.
      ────────────────────────────────────────────────────────────── */}
      <section id="section-profile" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 01
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            Start with you.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Tell WorkMatch what you can do and what you want.
          </p>
        </div>

        {/* Interactive Floating Profile Screen with Emerging Skill Nodes */}
        <InteractiveProfileScreen />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 02 — JOB DISCOVERY
             Headline: Thousands of opportunities.
             Description: WorkMatch removes the noise.
      ────────────────────────────────────────────────────────────── */}
      <section id="section-discovery" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 02
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            Thousands of opportunities.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            WorkMatch removes the noise.
          </p>
        </div>

        {/* 3D Opportunity Universe with 350+ Nodes Filtering Down */}
        <UniverseFilterVisualizer onExploreDemo={onLoadDemoAndLaunch} />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 03 — INTELLIGENT ANALYSIS
             Headline: It understands the job.
             Description: Requirements are analyzed beyond simple keywords.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 03
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            It understands the job.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Requirements are analyzed beyond simple keywords.
          </p>
        </div>

        {/* Real Job Listing Deconstructed into 7 Semantic Dimensions */}
        <IntelligentAnalysisMockup />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION 04 — MATCHING ENGINE (Visual Centerpiece)
             Headline: From thousands to the right few.
      ────────────────────────────────────────────────────────────── */}
      <section id="section-matching" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 04
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            From thousands to the right few.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Multidimensional tensor evaluation between user profile and contract specifications.
          </p>
        </div>

        {/* Large 97% Match Holographic Engine with Animated Arcs and Dimension Sliders */}
        <MatchScoreEngine onExploreDemo={onLoadDemoAndLaunch} />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION 05 — WHY THIS JOB?
             Headline: Don't just get a match. Understand it.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 05
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            Don&apos;t just get a match. Understand it.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Complete transparency with verified reasons and deadline alerts.
          </p>
        </div>

        {/* Interactive 3D Card: Frontend Developer 97% Match + Reasons Breakdown */}
        <WhyThisJobInteractiveCard />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION 06 — OPPORTUNITY COMPARISON
             Headline: See your options.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 06
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            See your options.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Move across options with physical forward elevation and instant multidimensional diffs.
          </p>
        </div>

        {/* Three Large Floating Job Cards: JOB A 97%, JOB B 89%, JOB C 76% */}
        <OpportunityComparisonCards />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. SECTION 07 — YOUR DECISION
             Headline: You stay in control.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 07
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            You stay in control.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Review, save, apply, or skip. WorkMatch assists your decisions without autonomous spam.
          </p>
        </div>

        {/* Realistic Opportunity Cockpit with Action Buttons */}
        <DecisionSimulatorScreen />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. SECTION 08 — AUTOMATION
             Headline: WorkMatch keeps looking.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 08
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            WorkMatch keeps looking.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            Background monitoring delivers quiet notifications only when matches exceed 90%.
          </p>
        </div>

        {/* Animated Background Discovery Dashboard */}
        <AutomationRadarDashboard />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. SECTION 09 — THE COMPLETE WORKFLOW
             One continuous sequence: PROFILE → DISCOVER → ANALYZE → MATCH → REVIEW → APPLY
      ────────────────────────────────────────────────────────────── */}
      <section id="section-workflow" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-[#20D3C2] uppercase font-bold block">
            SECTION 09
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] font-display">
            The Complete Workflow.
          </h2>
          <p className="text-base text-[#9AA8BC]">
            A single continuous journey traveling through the WorkMatch system.
          </p>
        </div>

        {/* Continuous Workflow Sequence Traveler with Miniature Interfaces */}
        <WorkflowJourneyTraveler />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. FAQ ACCORDION (Preserving Test Compatibility)
      ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#1B253B]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#20D3C2] block font-semibold">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7FB] font-display">
            Clear, Direct Answers
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does WorkMatch prevent ToS account bans?',
              a: 'WorkMatch strictly forbids automated submission bots. It operates as an intelligence and decision-support assistant: every proposal draft is audited against your verified profile, and submission is always controlled by you.'
            },
            {
              q: 'Does WorkMatch apply to jobs automatically without my approval?',
              a: 'No. WorkMatch is an intelligence and decision-support tool, not an autonomous spam bot. Every proposal draft must be reviewed, confirmed, and dispatched by you.'
            },
            {
              q: 'How does the recommendation fit score work?',
              a: 'WorkMatch evaluates every opportunity across 8 mathematical dimensions: skills overlap, budget floor, experience level, weekly capacity, and client payment reputation. The resulting 0–100 score gives you an instant measure of fit.'
            },
            {
              q: 'Can I test WorkMatch without connecting live accounts?',
              a: 'Yes! WorkMatch includes an instant interactive sandbox preview with realistic opportunities, verified client profiles, and tailored proposal generation.'
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
              className="p-5 rounded-2xl bg-[#0D1322] border border-[#1B253B] transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#F4F7FB] hover:text-[#20D3C2] transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#9AA8BC] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#9AA8BC] flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="pt-3 text-xs sm:text-sm text-[#9AA8BC] leading-relaxed border-t border-[#1B253B] mt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. FINAL SECTION (Section: Final Section)
              # Find what fits.
              Less searching. Better opportunities.
      ────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#1B253B]">
        <div className="rounded-3xl bg-gradient-to-b from-[#0D1322] to-[#070A12] border-2 border-[#20D3C2]/40 p-8 sm:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="relative space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#20D3C2] font-bold block">
              ORGANIZED OPPORTUNITY NETWORK
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F7FB] leading-tight font-display">
              Find what fits.
            </h2>

            <p className="text-base sm:text-xl text-[#9AA8BC] max-w-lg mx-auto leading-relaxed">
              Less searching. Better opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onLoadDemoAndLaunch}
                disabled={isLoadingDemo}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] font-bold font-mono text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-glow-teal"
                data-cursor-label="MATCH"
              >
                <span>Start Matching</span>
                <span className="sr-only">Find Your Matches</span>
                <ArrowRight className="w-4 h-4 text-[#0B1220]" />
              </button>

              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111A2E] hover:bg-[#172238] text-[#F4F7FB] border border-[#1B253B] hover:border-[#20D3C2]/40 text-sm font-mono font-medium transition-all"
              >
                <span>Explore the Product</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. FOOTER: Minimalist Editorial
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1B253B] py-12 px-4 sm:px-6 text-xs font-mono text-[#9AA8BC] bg-[#070A12]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#20D3C2]" />
            <span className="font-bold text-[#F4F7FB] tracking-widest">WORKMATCH</span>
            <span className="text-[#1B253B]">•</span>
            <span>Intelligent Freelance-Job Discovery &amp; Matching Platform</span>
          </div>

          <div className="flex items-center gap-8 text-[#9AA8BC]">
            <button onClick={() => handleScrollTo('product-hero')} className="hover:text-[#F4F7FB] transition-colors">
              Product
            </button>
            <button onClick={() => handleScrollTo('section-profile')} className="hover:text-[#F4F7FB] transition-colors">
              Profile
            </button>
            <button onClick={() => handleScrollTo('section-discovery')} className="hover:text-[#F4F7FB] transition-colors">
              Discovery
            </button>
            <button onClick={() => handleScrollTo('section-matching')} className="hover:text-[#F4F7FB] transition-colors">
              Matching
            </button>
            <button onClick={() => handleScrollTo('section-workflow')} className="hover:text-[#F4F7FB] transition-colors">
              Workflow
            </button>
            <button onClick={() => handleScrollTo('faq')} className="hover:text-[#F4F7FB] transition-colors">
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
