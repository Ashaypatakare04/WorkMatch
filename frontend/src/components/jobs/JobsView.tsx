import React, { useState } from 'react';
import {
  Search,
  Filter,
  Flame,
  Bookmark,
  XCircle,
  Eye,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  Check,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { NormalizedJob } from '../../types/index.js';

interface JobsViewProps {
  jobs: NormalizedJob[];
  onViewJob: (job: NormalizedJob) => void;
  onSaveJob: (jobId: string) => void;
  onIgnoreJob: (jobId: string, reason: string) => void;
  onRemoveAction: (jobId: string) => void;
  filterStatus?: 'active' | 'saved' | 'ignored';
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onViewJob,
  onSaveJob,
  onIgnoreJob,
  onRemoveAction,
  filterStatus = 'active'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('best_match');

  // Ignore dialog state
  const [ignoringJobId, setIgnoringJobId] = useState<string | null>(null);
  const [ignoreReason, setIgnoreReason] = useState('Too difficult');

  const categories = Array.from(new Set(jobs.map(j => j.category))).filter(Boolean);

  // Filter jobs
  let filtered = jobs.filter(j => {
    if (filterStatus === 'saved' && j.user_action !== 'saved') return false;
    if (filterStatus === 'ignored' && j.user_action !== 'ignored') return false;
    if (filterStatus === 'active' && j.user_action === 'ignored') return false;

    if (platformFilter !== 'all' && j.platform !== platformFilter) return false;
    if (categoryFilter !== 'all' && j.category !== categoryFilter) return false;
    if (riskFilter !== 'all' && j.risk?.risk_level !== riskFilter) return false;

    const score = j.score?.overall_score || 0;
    if (scoreFilter === 'high' && score < 85) return false;
    if (scoreFilter === 'possible' && (score < 70 || score >= 85)) return false;
    if (scoreFilter === 'low' && score >= 70) return false;

    if (difficultyFilter !== 'all') {
      const diffScore = j.score?.difficulty_score || 70;
      if (difficultyFilter === 'easy' && diffScore < 80) return false;
      if (difficultyFilter === 'moderate' && (diffScore < 50 || diffScore >= 80)) return false;
      if (difficultyFilter === 'challenging' && diffScore >= 50) return false;
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchDesc = j.description.toLowerCase().includes(q);
      const matchClient = j.client.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchClient) return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'best_match') {
      return (b.score?.overall_score || 0) - (a.score?.overall_score || 0);
    }
    if (sortBy === 'highest_budget') {
      const aBudget = a.budget.max || a.budget.min || 0;
      const bBudget = b.budget.max || b.budget.min || 0;
      return bBudget - aBudget;
    }
    if (sortBy === 'lowest_competition') {
      return (a.competition.proposal_count || 0) - (b.competition.proposal_count || 0);
    }
    if (sortBy === 'lowest_difficulty') {
      return (b.score?.difficulty_score || 0) - (a.score?.difficulty_score || 0);
    }
    // newest
    return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
  });

  const handleConfirmIgnore = () => {
    if (ignoringJobId) {
      onIgnoreJob(ignoringJobId, ignoreReason);
      setIgnoringJobId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
              {filterStatus === 'saved' ? 'Saved Opportunities' : filterStatus === 'ignored' ? 'Ignored Opportunities' : 'Opportunities Catalog'}
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {filtered.length} {filtered.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-platform work discovery normalized and ranked by true capability alignment.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-3.5 shadow-glass">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, title, client, or requirements..."
              className="w-full bg-surface-900/90 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="w-full bg-surface-900/90 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
            >
              <option value="all">All Platforms (Upwork, Fiverr, Freelancer)</option>
              <option value="upwork">Upwork Only</option>
              <option value="fiverr">Fiverr Only</option>
              <option value="freelancer">Freelancer Only</option>
              <option value="mock">Simulator Feed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-surface-900/90 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
            >
              <option value="best_match">Sort: Best Match Score</option>
              <option value="newest">Sort: Newest First</option>
              <option value="highest_budget">Sort: Highest Budget</option>
              <option value="lowest_competition">Sort: Lowest Competition</option>
              <option value="lowest_difficulty">Sort: Easiest Difficulty</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06] text-xs">
          <span className="text-slate-400 text-[11px] font-mono font-medium flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filters:
          </span>

          {/* Score Pills */}
          <button
            onClick={() => setScoreFilter('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
              scoreFilter === 'all'
                ? 'bg-surface-750 text-white font-semibold border border-white/[0.1]'
                : 'bg-surface-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            All Scores
          </button>
          <button
            onClick={() => setScoreFilter('high')}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              scoreFilter === 'high'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'bg-surface-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" /> High Match (≥85)
          </button>
          <button
            onClick={() => setScoreFilter('possible')}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
              scoreFilter === 'possible'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'bg-surface-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Possible (70-84)
          </button>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-surface-900/90 border border-white/[0.08] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Risk Dropdown */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-surface-900/90 border border-white/[0.08] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk Only</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="bg-surface-900/90 border border-white/[0.08] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy Only</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>
      </div>

      {/* Jobs Cards List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-white/[0.08] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-display font-semibold text-white">No jobs match your filter criteria.</p>
          <p className="text-xs text-slate-400">Try adjusting your keywords, platform, or score range filter.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map(job => {
            const score = job.score?.overall_score ?? 70;
            const isHighMatch = score >= 85;
            const isSaved = job.user_action === 'saved';

            return (
              <div
                key={job.id}
                className="glass-card glass-card-hover p-6 rounded-3xl border border-white/[0.08] space-y-4 group relative"
              >
                {/* Card Top Row: Badges, Score & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      job.platform === 'upwork'
                        ? 'badge-upwork'
                        : job.platform === 'fiverr'
                        ? 'badge-fiverr'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                    }`}>
                      {job.platform}
                    </span>
                    <span className="text-[11px] text-slate-300 bg-surface-800/80 px-2.5 py-0.5 rounded-md border border-white/[0.06]">
                      {job.category}
                    </span>
                    {job.client?.payment_verified && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Payment Verified
                      </span>
                    )}
                    {job.risk?.risk_level === 'High' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> High Risk Flags
                      </span>
                    ) : job.risk?.risk_level === 'Medium' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Medium Risk
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Low Risk
                      </span>
                    )}

                    {job.score?.difficulty_score && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Difficulty: <strong className="text-slate-200">{job.score.difficulty_score >= 80 ? 'Easy' : job.score.difficulty_score >= 50 ? 'Moderate' : 'Challenging'}</strong>
                      </span>
                    )}
                  </div>

                  {/* Score & Quick Save */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                      isHighMatch
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-glow-amber'
                        : score >= 70
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-glow-emerald'
                        : 'bg-surface-800 text-slate-400 border-white/[0.08]'
                    }`}>
                      {isHighMatch && <Flame className="w-4 h-4 text-amber-400" />}
                      <span>{score}</span>
                      <span className="text-[10px] opacity-70">/100</span>
                    </div>

                    <button
                      onClick={() => isSaved ? onRemoveAction(job.id) : onSaveJob(job.id)}
                      className={`p-2 rounded-xl border transition-all active:scale-95 ${
                        isSaved
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-glow-amber'
                          : 'bg-surface-800 border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    onClick={() => onViewJob(job)}
                    className="text-base font-display font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Why It Matches Highlight */}
                {job.score?.explanation.why_matches && job.score.explanation.why_matches.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-surface-900/80 border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Why It Matches You:
                    </div>
                    <ul className="text-[11.5px] text-slate-300 space-y-1">
                      {job.score.explanation.why_matches.slice(0, 2).map((w, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer metadata & buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-3 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center gap-4 text-slate-400 text-[11px] flex-wrap">
                    <span className="font-bold text-emerald-300 font-mono text-xs">
                      {job.budget.type === 'fixed'
                        ? `$${job.budget.max || job.budget.min || 0} Fixed`
                        : `$${job.budget.min}-$${job.budget.max}/hr`}
                    </span>
                    <span>Client: <strong className="text-slate-200">{job.client.rating ? `${job.client.rating}★` : 'Verified'}</strong> ({job.client.country || 'Global'})</span>
                    <span>Proposals: <strong className="text-slate-200">{job.competition.proposal_count || 0}</strong></span>
                    <span>Skill Match: <strong className="text-emerald-400 font-mono">{job.score?.skill_score || 80}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {job.user_action !== 'ignored' && (
                      <button
                        onClick={() => setIgnoringJobId(job.id)}
                        className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-red-400 text-xs transition active:scale-95"
                      >
                        Ignore
                      </button>
                    )}

                    <button
                      onClick={() => onViewJob(job)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-xs transition-all flex items-center gap-1.5 shadow-glow-emerald active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect & Draft Proposal</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ignore Reason Modal */}
      {ignoringJobId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="glass-card border border-white/[0.1] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-display font-bold text-white">Why are you ignoring this job?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              WorkMatch AI uses this feedback to tune and align future opportunity scoring for your capability profile.
            </p>

            <div className="space-y-1.5">
              {[
                'Too difficult',
                'Too low budget',
                'Bad client reputation',
                'Too much communication/calls required',
                'Missing required skill',
                'Deadline too short',
                'Not interested in this domain'
              ].map(reason => (
                <label
                  key={reason}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] text-xs text-slate-200 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="ignoreReason"
                    value={reason}
                    checked={ignoreReason === reason}
                    onChange={() => setIgnoreReason(reason)}
                    className="text-emerald-500 focus:ring-emerald-400 bg-surface-900 border-white/[0.1]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setIgnoringJobId(null)}
                className="px-4 py-2 rounded-xl bg-surface-800 text-slate-300 text-xs font-medium hover:bg-surface-750 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmIgnore}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition active:scale-95"
              >
                Record Feedback & Ignore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
