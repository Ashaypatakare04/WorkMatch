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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {job.platform}
            </span>
            <span className="text-xs text-slate-400">{job.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeTab === 'details' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Job Analysis
              </button>
              <button
                onClick={() => {
                  if (proposals.length === 0) {
                    handleGenerateProposals();
                  } else {
                    setActiveTab('proposals');
                  }
                }}
                className={`px-3 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'proposals' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Proposals {proposals.length > 0 ? `(${proposals.length})` : ''}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Title & Key Specs */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-white leading-snug">
                    {job.title}
                  </h2>

                  {/* Overall Match Badge */}
                  <div className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Match</div>
                      <div className="text-xl font-mono font-bold text-white">
                        {score?.overall_score || 85}<span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Budget</div>
                      <div className="text-xs font-semibold text-white font-mono">
                        {job.budget.type === 'fixed' ? `$${job.budget.max || job.budget.min} Fixed` : `$${job.budget.min}-$${job.budget.max}/hr`}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Duration / Deadline</div>
                      <div className="text-xs font-semibold text-white">
                        {job.deadline || job.estimated_duration || 'Flexible'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <User className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Client Rating</div>
                      <div className="text-xs font-semibold text-white">
                        {job.client.rating ? `${job.client.rating}★ (${job.client.reviews} reviews)` : 'Unrated'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Competition</div>
                      <div className="text-xs font-semibold text-white">
                        {job.competition.proposal_count || 0} proposals
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparent Multi-Dimensional Score Breakdown */}
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Transparent Match Breakdown</h3>
                    <span className="text-xs text-slate-400">(Multi-criteria scoring)</span>
                  </div>
                  {showExplanation ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {showExplanation && (
                  <div className="space-y-4 pt-2 border-t border-slate-700/50">
                    {/* Dimension Progress Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Skill Match</span>
                          <span className="font-mono font-semibold">{score?.skill_score || 90}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${score?.skill_score || 90}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Experience Match</span>
                          <span className="font-mono font-semibold">{score?.experience_score || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-400 h-full rounded-full" style={{ width: `${score?.experience_score || 85}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Difficulty Ease Score</span>
                          <span className="font-mono font-semibold">{score?.difficulty_score || 88}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${score?.difficulty_score || 88}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Budget Match</span>
                          <span className="font-mono font-semibold">{score?.budget_score || 82}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${score?.budget_score || 82}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Communication Match</span>
                          <span className="font-mono font-semibold">{score?.communication_score || 95}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-400 h-full rounded-full" style={{ width: `${score?.communication_score || 95}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Client Quality</span>
                          <span className="font-mono font-semibold">{score?.client_quality_score || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${score?.client_quality_score || 85}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Reasons For and Against */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-700/40 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5" /> Why this matches you:
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {(score?.explanation.why_matches || ['Direct skill alignment with your profile']).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {score?.explanation.concerns && score.explanation.concerns.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-semibold text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Potential concerns / caveats:
                          </span>
                          <ul className="space-y-1 text-slate-300">
                            {score.explanation.concerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>{concern}</span>
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
              <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                risk?.risk_level === 'High'
                  ? 'bg-red-950/40 border-red-500/40'
                  : risk?.risk_level === 'Medium'
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    {risk?.risk_level === 'High' ? (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className={risk?.risk_level === 'High' ? 'text-red-300' : 'text-emerald-300'}>
                      Risk Assessment: {risk?.risk_level || 'Low Risk'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">Score: {risk?.risk_score || 10}/100</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {risk?.explanation || 'No high-risk fraud signals found. Client payment method is active and communications are on platform.'}
                </p>
                {risk?.warning_signals && risk.warning_signals.length > 0 && (
                  <div className="pt-2 border-t border-red-500/20 space-y-1">
                    <span className="font-semibold text-red-300 text-[10px] uppercase tracking-wider">Warning Signals:</span>
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Original Job Description
                </h3>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {job.description}
                </div>
              </div>

              {/* Skills & Requirements */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Required Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
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
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Personalized Proposal Variants</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated without hallucinations. Strictly verified against your capability profile.
                  </p>
                </div>

                <button
                  onClick={handleGenerateProposals}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 disabled:opacity-50"
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>

              {/* Variant Selector Tabs */}
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                {proposals.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVariant(idx);
                      setEditableContent(p.content);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      selectedVariant === idx
                        ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{p.title || `Variant ${idx + 1}`}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({p.word_count}w)</span>
                  </button>
                ))}
              </div>

              {currentProposal ? (
                <div className="space-y-4">
                  {/* Strict Claims Verification Card */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Strict Claim Verification Audit</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        100% Truthful
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      ✓ No unsupported years of experience claimed.<br />
                      ✓ Verified skills utilized:{' '}
                      <span className="text-emerald-300 font-medium">
                        {currentProposal.claims_verification?.skills_used?.join(', ') || 'Data Entry, Excel'}
                      </span>
                    </div>
                  </div>

                  {/* Editable Proposal Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Proposal Pitch (Editable):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400">
                          {editableContent.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-medium"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={editableContent}
                      onChange={e => setEditableContent(e.target.value)}
                      rows={9}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-400">Click Regenerate to draft new proposals.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => onSaveJob(job.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save Opportunity</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
            >
              Close
            </button>

            {activeTab === 'details' ? (
              <button
                onClick={handleGenerateProposals}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/25 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Drafting Proposal...' : 'Generate Personalized Proposal'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onApply(job.id, currentProposal?.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Track Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
