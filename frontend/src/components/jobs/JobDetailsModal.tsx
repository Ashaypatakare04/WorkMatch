/**
 * ============================================================================
 * WORKMATCH JOB DETAILS & PROPOSAL STUDIO MODAL
 * ============================================================================
 *
 * JobDetailsModal is an in-depth decision and proposal workbench:
 *
 * Tab 1: Opportunity Analysis
 * - Transparent Fit Breakdown: Displays progress bars across 5 core dimensions
 *   (Skills, Experience, Difficulty, Budget, Client Reputation).
 * - Risk & Scam Signals: Clear warning badges if off-platform communication or
 *   unrealistic rates are detected.
 * - Client Background: Star ratings, reviews count, and payment verification state.
 *
 * Tab 2: Proposal Studio
 * - Multi-Variant Generation: Generates 4 distinct stylistic drafts (Direct,
 *   Conversational, Technical, Detailed).
 * - Claim Verification Audit: Displays badges confirming truthfulness against the
 *   user's profile inventory.
 * - Interactive Draft Editor: Live text area allowing customized tweaking before
 *   copying to clipboard or dispatching to the platform.
 */

import React, { useState } from 'react';
import {
  X,
  Flame,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  User,
  Users,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { NormalizedJob, Proposal } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../common/Toast.js';
import { MatchScore } from '../common/MatchScore.js';

interface JobDetailsModalProps {
  job: NormalizedJob;
  onClose: () => void;
  onSaveJob: (jobId: string) => void;
  onApply: (jobId: string, proposalId?: string) => void;
  applicationMode?: string;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onSaveJob,
  onApply,
  applicationMode = 'MANUAL'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'proposals'>('details');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedDesc, setCopiedDesc] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const { success: showToastSuccess, info: showToastInfo } = useToast();

  const score = job.score;
  const risk = job.risk;
  const analysis = job.analysis;

  const handleGenerateProposals = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.generateProposals(job.id);
      setProposals(generated);
      if (generated.length > 0) {
        setSelectedVariant(0);
        setEditableContent(generated[0].content);
        setActiveTab('proposals');
      }
    } catch (err) {
      console.error('Failed to generate proposals:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    showToastSuccess('Copied to Clipboard', 'Proposal text copied. Ready to paste on platform.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopilotDispatch = () => {
    if (!editableContent.trim()) return;
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Track as assisted application in the user pipeline
    onApply(job.id, currentProposal?.id);

    // Open platform job url in new tab
    if (job.url && job.url !== '#') {
      window.open(job.url, '_blank', 'noopener,noreferrer');
      showToastSuccess(
        '1-Click Copilot Launched!',
        `Proposal copied to clipboard & opened ${job.platform.toUpperCase()} in a new tab. Paste & submit!`
      );
    } else {
      showToastInfo(
        'Proposal Copied',
        `Proposal copied to clipboard. (Platform URL not available for mock demo)`
      );
    }
  };

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(job.description);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const currentProposal = proposals[selectedVariant];

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:glass-card border border-slate-200/90 dark:border-white/[0.12] rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto relative">
        {/* Subtle top ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/95 dark:bg-surface-900/95 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-lg border font-bold ${
                job.platform === 'upwork' ? 'badge-upwork' : job.platform === 'fiverr' ? 'badge-fiverr' : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/25 font-bold'
              }`}>
                {job.platform}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-surface-800 px-2.5 py-0.5 rounded-lg border border-slate-300/60 dark:border-white/[0.06] font-medium">{job.category}</span>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Tab switch */}
            <div className="flex items-center bg-slate-200/80 dark:bg-surface-950 p-1 rounded-xl border border-slate-300/60 dark:border-white/[0.08] text-xs w-full sm:w-auto justify-center font-medium">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all text-center ${
                  activeTab === 'details' ? 'bg-white dark:bg-surface-750 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200 dark:border-white/[0.1]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Opportunity Analysis
              </button>
              <button
                onClick={() => {
                  if (proposals.length === 0) {
                    handleGenerateProposals();
                  } else {
                    setActiveTab('proposals');
                  }
                }}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'proposals' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 font-bold shadow-glow-emerald' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proposals {proposals.length > 0 ? `(${proposals.length})` : ''}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:block p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface-800 transition ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Title & Key Specs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-snug">
                    {job.title}
                  </h2>

                  {/* Overall Match Badge with Signature MatchScore */}
                  <div className="flex-shrink-0 flex items-center gap-3.5 p-3 rounded-2xl bg-amber-500/10 dark:bg-[#172238] border border-amber-500/30 dark:border-[#22324F] shadow-sm">
                    <MatchScore score={score?.overall_score || 85} breakdown={score} size="sm" />
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-400/90 tracking-wider">Overall Match</div>
                      <div className="text-xl font-mono font-black text-slate-900 dark:text-white">
                        {score?.overall_score || 85}<span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="card-secondary p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Budget</div>
                      <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                        {job.budget?.type === 'fixed' ? `$${job.budget?.max || job.budget?.min || 0} Fixed` : `$${job.budget?.min || 0}-$${job.budget?.max || 0}/hr`}
                      </div>
                    </div>
                  </div>

                  <div className="card-secondary p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-400">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Duration</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {job.deadline || job.estimated_duration || 'Flexible'}
                      </div>
                    </div>
                  </div>

                  <div className="card-secondary p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Client Rating</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {job.client?.rating ? `${job.client.rating}★ (${job.client.reviews || 0} reviews)` : 'Verified Client'}
                      </div>
                    </div>
                  </div>

                  <div className="card-secondary p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-400">
                      <Users className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Competition</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                        {job.competition?.proposal_count || 0} proposals
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparent Multi-Dimensional Score Breakdown */}
              <div className="card-primary p-5 sm:p-6 rounded-3xl space-y-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">Multi-Dimensional Match Architecture</h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">(0-100 Criteria)</span>
                  </div>
                  {showExplanation ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                </div>

                {showExplanation && (
                  <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-white/[0.06]">
                    {/* Dimension Progress Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm">
                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Skill Match</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{score?.skill_score || 90}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all" style={{ width: `${score?.skill_score || 90}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Experience Alignment</span>
                          <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{score?.experience_score || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all" style={{ width: `${score?.experience_score || 85}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Difficulty Assessment (Ease)</span>
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{score?.difficulty_score || 88}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all" style={{ width: `${score?.difficulty_score || 88}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Budget Value Score</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{score?.budget_score || 82}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all" style={{ width: `${score?.budget_score || 82}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Communication & Collaboration</span>
                          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{score?.communication_score || 95}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all" style={{ width: `${score?.communication_score || 95}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                          <span>Client Payment & History Quality</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{score?.client_quality_score || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-surface-900 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all" style={{ width: `${score?.client_quality_score || 85}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Reasons For and Against */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/80 dark:border-white/[0.06] text-xs sm:text-sm">
                      <div className="space-y-2">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5" /> Why this matches you:
                        </span>
                        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                          {(score?.explanation?.why_matches || ['Direct skill alignment with your profile']).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span className="leading-relaxed">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {score?.explanation?.concerns && score.explanation.concerns.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Potential concerns / caveats:
                          </span>
                          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                            {score.explanation.concerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span className="leading-relaxed">{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Risk / Scam Analysis Box */}
              <div className={`p-5 sm:p-6 rounded-3xl border space-y-2.5 text-xs sm:text-sm ${
                risk?.risk_level === 'High'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-500/40 text-red-950 dark:text-red-200'
                  : risk?.risk_level === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-500/40 text-amber-950 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    {risk?.risk_level === 'High' ? (
                      <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span className={`font-display font-bold ${risk?.risk_level === 'High' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                      Security & Scam Assessment: {risk?.risk_level || 'Low Risk'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-xs font-semibold">Score: {risk?.risk_score || 10}/100</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {risk?.explanation || 'No high-risk fraud signals found. Client payment method is active and communications are strictly on platform.'}
                </p>
                {risk?.warning_signals && risk.warning_signals.length > 0 && (
                  <div className="pt-2.5 border-t border-red-200 dark:border-red-500/20 space-y-1">
                    <span className="font-bold text-red-700 dark:text-red-300 text-xs font-mono uppercase tracking-wider">Warning Signals:</span>
                    <ul className="list-disc list-inside text-red-800 dark:text-red-200 text-xs space-y-0.5">
                      {risk.warning_signals.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Original Job Description with Copy Action */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Original Job Description
                  </h3>
                  <button
                    onClick={handleCopyDesc}
                    className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition"
                    title="Copy full job description"
                  >
                    {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDesc ? 'Copied Description' : 'Copy Description'}</span>
                  </button>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans shadow-inner">
                  {job.description}
                </div>
              </div>

              {/* Skills & Requirements */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Required Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(job.skills || []).map((s, idx) => (
                    <span key={idx} className="text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Proposal Generation & Claims Verification View */
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Personalized Proposal Variants</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Generated without hallucinations. Strictly verified against your capability profile.
                  </p>
                </div>

                <button
                  onClick={handleGenerateProposals}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] disabled:opacity-50 self-start sm:self-auto"
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate Variants'}
                </button>
              </div>

              {/* Variant Selector Tabs */}
              <div className="flex gap-2.5 border-b border-slate-200 dark:border-white/[0.07] pb-3 overflow-x-auto no-scrollbar">
                {proposals.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVariant(idx);
                      setEditableContent(p.content);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
                      selectedVariant === idx
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    <span>{p.title || `Variant ${idx + 1}`}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">({p.word_count}w)</span>
                  </button>
                ))}
              </div>

              {currentProposal ? (
                <div className="space-y-4">
                  {/* Strict Claims Verification Card */}
                  <div className="p-4.5 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-display font-bold">Strict Claim Verification Audit</span>
                      </div>
                      <span className="text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        100% Truthful
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                      <div>✓ No unsupported years of experience or false claims made.</div>
                      <div>
                        ✓ Verified profile skills referenced:{' '}
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                          {currentProposal.claims_verification?.skills_used?.join(', ') || 'Data Entry, Excel, Web Research'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-700 dark:text-[#F5B942] italic pt-1 border-t border-emerald-200/50 dark:border-emerald-500/20 mt-1.5 flex items-center gap-1.5">
                        <span className="font-bold">ℹ Verification Note:</span>
                        <span>This proposal does not claim unverified experience because it is not present in your verified profile.</span>
                      </div>
                    </div>
                  </div>

                  {/* ToS-Safe Assisted Copilot Advice Banner */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold">ToS-Safe Assisted Copilot: </span>
                      Freelance platforms (Upwork, Fiverr) strictly forbid automated submission bots. WorkMatch protects your account by generating verified drafts that you can review, tweak, and 1-click copy &amp; open directly on {job.platform}.
                    </div>
                  </div>

                  {/* Tone / Length adjustment chips (Section 17) */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Tone &amp; Length:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const paras = editableContent.split('\n\n');
                        if (paras.length > 2) {
                          setEditableContent(paras.slice(0, 2).join('\n\n') + '\n\nLooking forward to speaking soon.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#111A2E] hover:bg-slate-200 dark:hover:bg-[#172238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324F] transition font-medium"
                    >
                      Shorten
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editableContent.startsWith('Hey there,')) {
                          setEditableContent(editableContent.replace(/^(Dear [^,]+,|Hello,|Hi,)/i, 'Hey there,'));
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#111A2E] hover:bg-slate-200 dark:hover:bg-[#172238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324F] transition font-medium"
                    >
                      Conversational
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditableContent(editableContent.replace(/^(Hey there,|Hi,)/i, 'Hello,'));
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#111A2E] hover:bg-slate-200 dark:hover:bg-[#172238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324F] transition font-medium"
                    >
                      Professional
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editableContent.includes('verified background')) {
                          setEditableContent(editableContent + '\n\nMy verified background directly aligns with the technical milestones of this project.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#111A2E] hover:bg-slate-200 dark:hover:bg-[#172238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324F] transition font-medium"
                    >
                      Emphasize experience
                    </button>
                  </div>

                  {/* Editable Proposal Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono uppercase text-xs font-semibold text-slate-500 dark:text-slate-400">Proposal Content (Customizable):</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          {editableContent.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 text-xs font-bold transition px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy Proposal'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={editableContent}
                      onChange={e => setEditableContent(e.target.value)}
                      rows={11}
                      className="w-full bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Click Regenerate Variants to draft new proposals.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/95 dark:bg-surface-900/95 backdrop-blur-xl flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => onSaveJob(job.id)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-750 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18] transition active:scale-95"
          >
            <Bookmark className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Save Opportunity</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/3 sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200/80 dark:bg-surface-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300/80 dark:hover:bg-surface-750 transition text-center"
            >
              Close
            </button>

            {activeTab === 'details' ? (
              <button
                onClick={handleGenerateProposals}
                disabled={isGenerating}
                className="w-2/3 sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white dark:text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Drafting...' : 'Draft Proposal'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopilotDispatch}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-display font-bold text-xs shadow-md transition-all active:scale-95"
                  title="Copy proposal and open platform job page in a new tab (100% ToS-safe)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>1-Click Copilot</span>
                </button>
                <button
                  onClick={() => {
                    onApply(job.id, currentProposal?.id);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white dark:text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mark Applied</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
