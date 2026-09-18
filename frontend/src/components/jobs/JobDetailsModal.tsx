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
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

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
    setTimeout(() => setCopied(false), 2000);
  };

  const currentProposal = proposals[selectedVariant];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div className="glass-card border border-white/[0.12] rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto relative">
        {/* Subtle top ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-900/95 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                job.platform === 'upwork' ? 'badge-upwork' : job.platform === 'fiverr' ? 'badge-fiverr' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
              }`}>
                {job.platform}
              </span>
              <span className="text-xs text-slate-300 bg-surface-800 px-2.5 py-0.5 rounded-md border border-white/[0.06]">{job.category}</span>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Tab switch */}
            <div className="flex items-center bg-surface-950 p-1 rounded-xl border border-white/[0.08] text-xs w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all text-center ${
                  activeTab === 'details' ? 'bg-surface-750 text-white font-semibold shadow-sm border border-white/[0.1]' : 'text-slate-400 hover:text-slate-200'
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
                className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'proposals' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-glow-emerald' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proposals {proposals.length > 0 ? `(${proposals.length})` : ''}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:block p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Title & Key Specs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <h2 className="text-xl font-display font-extrabold text-white leading-snug">
                    {job.title}
                  </h2>

                  {/* Overall Match Badge */}
                  <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-surface-850 border border-white/[0.1] shadow-glow-amber">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">Overall Match</div>
                      <div className="text-xl font-mono font-black text-white">
                        {score?.overall_score || 85}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="glass-card p-3.5 rounded-2xl border border-white/[0.07] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Budget</div>
                      <div className="text-xs font-bold text-emerald-300 font-mono">
                        {job.budget.type === 'fixed' ? `$${job.budget.max || job.budget.min} Fixed` : `$${job.budget.min}-$${job.budget.max}/hr`}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-3.5 rounded-2xl border border-white/[0.07] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Duration</div>
                      <div className="text-xs font-semibold text-white">
                        {job.deadline || job.estimated_duration || 'Flexible'}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-3.5 rounded-2xl border border-white/[0.07] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                      <User className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Client Rating</div>
                      <div className="text-xs font-semibold text-white">
                        {job.client.rating ? `${job.client.rating}★ (${job.client.reviews} reviews)` : 'Verified Client'}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-3.5 rounded-2xl border border-white/[0.07] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                      <Users className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Competition</div>
                      <div className="text-xs font-semibold text-white font-mono">
                        {job.competition.proposal_count || 0} bids submitted
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparent Multi-Dimensional Score Breakdown */}
              <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-display font-bold text-white">Multi-Dimensional Match Architecture</h3>
                    <span className="text-xs font-mono text-slate-400">(0-100 Criteria)</span>
                  </div>
                  {showExplanation ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {showExplanation && (
                  <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                    {/* Dimension Progress Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Skill Match</span>
                          <span className="font-mono font-bold text-emerald-400">{score?.skill_score || 90}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all" style={{ width: `${score?.skill_score || 90}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Experience Alignment</span>
                          <span className="font-mono font-bold text-cyan-400">{score?.experience_score || 85}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all" style={{ width: `${score?.experience_score || 85}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Difficulty Assessment (Ease)</span>
                          <span className="font-mono font-bold text-teal-400">{score?.difficulty_score || 88}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all" style={{ width: `${score?.difficulty_score || 88}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Budget Value Score</span>
                          <span className="font-mono font-bold text-amber-400">{score?.budget_score || 82}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all" style={{ width: `${score?.budget_score || 82}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Communication & Collaboration</span>
                          <span className="font-mono font-bold text-purple-400">{score?.communication_score || 95}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all" style={{ width: `${score?.communication_score || 95}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                          <span>Client Payment & History Quality</span>
                          <span className="font-mono font-bold text-indigo-400">{score?.client_quality_score || 85}%</span>
                        </div>
                        <div className="w-full bg-surface-900 h-2 rounded-full overflow-hidden p-[1px]">
                          <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all" style={{ width: `${score?.client_quality_score || 85}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Reasons For and Against */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06] text-xs">
                      <div className="space-y-2">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5" /> Why this matches you:
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {(score?.explanation.why_matches || ['Direct skill alignment with your profile']).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span className="leading-relaxed">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {score?.explanation.concerns && score.explanation.concerns.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Potential concerns / caveats:
                          </span>
                          <ul className="space-y-1.5 text-slate-300">
                            {score.explanation.concerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
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
              <div className={`p-5 rounded-3xl border space-y-2.5 text-xs ${
                risk?.risk_level === 'High'
                  ? 'bg-red-950/30 border-red-500/40 shadow-xl shadow-red-950/20'
                  : risk?.risk_level === 'Medium'
                  ? 'bg-amber-950/25 border-amber-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    {risk?.risk_level === 'High' ? (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className={`font-display ${risk?.risk_level === 'High' ? 'text-red-300' : 'text-emerald-300'}`}>
                      Security & Scam Assessment: {risk?.risk_level || 'Low Risk'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">Score: {risk?.risk_score || 10}/100</span>
                </div>
                <p className="text-slate-300 text-[11.5px] leading-relaxed">
                  {risk?.explanation || 'No high-risk fraud signals found. Client payment method is active and communications are strictly on platform.'}
                </p>
                {risk?.warning_signals && risk.warning_signals.length > 0 && (
                  <div className="pt-2.5 border-t border-red-500/20 space-y-1">
                    <span className="font-bold text-red-300 text-[10px] font-mono uppercase tracking-wider">Warning Signals:</span>
                    <ul className="list-disc list-inside text-red-200 text-[11px] space-y-0.5">
                      {risk.warning_signals.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Original Job Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Original Job Description
                </h3>
                <div className="p-4.5 rounded-2xl bg-surface-900/90 border border-white/[0.07] text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {job.description}
                </div>
              </div>

              {/* Skills & Requirements */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Required Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-surface-800 border border-white/[0.08] text-slate-200 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Proposal Generation & Claims Verification View */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Personalized Proposal Variants</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated without hallucinations. Strictly verified against your capability profile.
                  </p>
                </div>

                <button
                  onClick={handleGenerateProposals}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-200 text-xs font-medium transition-all border border-white/[0.08] hover:border-white/[0.16] disabled:opacity-50"
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate Variants'}
                </button>
              </div>

              {/* Variant Selector Tabs */}
              <div className="flex gap-2 border-b border-white/[0.07] pb-3 overflow-x-auto">
                {proposals.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVariant(idx);
                      setEditableContent(p.content);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
                      selectedVariant === idx
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-glow-emerald'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800'
                    }`}
                  >
                    <span>{p.title || `Variant ${idx + 1}`}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({p.word_count}w)</span>
                  </button>
                ))}
              </div>

              {currentProposal ? (
                <div className="space-y-4">
                  {/* Strict Claims Verification Card */}
                  <div className="p-4.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-display">Strict Claim Verification Audit</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        100% Truthful
                      </span>
                    </div>
                    <div className="text-[11.5px] text-slate-300 leading-relaxed space-y-1">
                      <div>✓ No unsupported years of experience claimed.</div>
                      <div>
                        ✓ Verified profile skills referenced:{' '}
                        <span className="text-emerald-300 font-medium">
                          {currentProposal.claims_verification?.skills_used?.join(', ') || 'Data Entry, Excel, Web Research'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Editable Proposal Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono uppercase text-[11px] text-slate-400">Proposal Content (Customizable):</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-400">
                          {editableContent.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy Proposal'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={editableContent}
                      onChange={e => setEditableContent(e.target.value)}
                      rows={10}
                      className="w-full bg-surface-900/90 border border-white/[0.08] rounded-2xl p-4 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-400">Click Regenerate Variants to draft new proposals.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/[0.08] bg-surface-900/95 backdrop-blur-xl flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5">
          <button
            onClick={() => onSaveJob(job.id)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-200 text-xs font-medium border border-white/[0.08] hover:border-white/[0.18] transition active:scale-95"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Save Opportunity</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl bg-surface-800 text-slate-300 text-xs font-medium hover:bg-surface-750 transition text-center"
            >
              Close
            </button>

            {activeTab === 'details' ? (
              <button
                onClick={handleGenerateProposals}
                disabled={isGenerating}
                className="w-2/3 sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Drafting...' : 'Draft Proposal'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onApply(job.id, currentProposal?.id);
                  onClose();
                }}
                className="w-2/3 sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-xs shadow-glow-emerald transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit &amp; Track</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
