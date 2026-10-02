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
import { MatchScore } from '../common/MatchScore.js';
import { WhyThisMatches } from '../common/WhyThisMatches.js';

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
      const matchTitle = (j.title || '').toLowerCase().includes(q);
      const matchDesc = (j.description || '').toLowerCase().includes(q);
      const matchClient = (j.client?.name || '').toLowerCase().includes(q);
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
      const aBudget = a.budget?.max || a.budget?.min || 0;
      const bBudget = b.budget?.max || b.budget?.min || 0;
      return bBudget - aBudget;
    }
    if (sortBy === 'lowest_competition') {
      return (a.competition?.proposal_count || 0) - (b.competition?.proposal_count || 0);
    }
    if (sortBy === 'lowest_difficulty') {
      return (b.score?.difficulty_score || 0) - (a.score?.difficulty_score || 0);
    }
    // newest
    return new Date(b.posted_at || 0).getTime() - new Date(a.posted_at || 0).getTime();
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
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {filterStatus === 'saved' ? 'Saved Opportunities' : filterStatus === 'ignored' ? 'Ignored Opportunities' : 'Opportunities Catalog'}
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              {filtered.length} {filtered.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Real-time multi-platform work discovery normalized and ranked by true capability alignment.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, title, client, or requirements..."
              className="w-full bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Platform Filter */}
          <div>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer font-medium"
            >
              <option value="all">All Platforms (Upwork, Fiverr, Freelancer)</option>
              <option value="upwork">Upwork Only</option>
              <option value="fiverr">Fiverr Only</option>
              <option value="freelancer">Freelancer Only</option>
              {jobs.some(j => j.platform === 'mock') && (
                <option value="mock">Simulator Feed</option>
              )}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer font-medium"
            >
              <option value="best_match">Sort: Best Match Score</option>
              <option value="newest">Sort: Newest First</option>
              <option value="highest_budget">Sort: Highest Budget</option>
              <option value="lowest_competition">Sort: Lowest Competition</option>
              <option value="lowest_difficulty">Sort: Easiest Difficulty</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Filters:
            </span>

            {/* Score Pills */}
            <button
              onClick={() => setScoreFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                scoreFilter === 'all'
                  ? 'bg-slate-200 dark:bg-surface-750 text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-white/[0.1]'
                  : 'bg-slate-100 dark:bg-surface-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              All Scores
            </button>
            <button
              onClick={() => setScoreFilter('high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                scoreFilter === 'high'
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-surface-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> High Match (≥85)
            </button>
            <button
              onClick={() => setScoreFilter('possible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                scoreFilter === 'possible'
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-surface-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              Possible (70–84)
            </button>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-medium"
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
              className="bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-medium"
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
              className="bg-slate-50 dark:bg-surface-900/90 border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy Only</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(searchQuery || platformFilter !== 'all' || categoryFilter !== 'all' || scoreFilter !== 'all' || riskFilter !== 'all' || difficultyFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
                setCategoryFilter('all');
                setScoreFilter('all');
                setRiskFilter('all');
                setDifficultyFilter('all');
              }}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Cards List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-3.5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-surface-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <p className="text-base font-display font-bold text-slate-900 dark:text-white">No jobs match your filter criteria.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Try adjusting your keywords, platform, difficulty, or score range filter.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setPlatformFilter('all');
              setCategoryFilter('all');
              setScoreFilter('all');
              setRiskFilter('all');
              setDifficultyFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => {
            const score = job.score?.overall_score ?? 70;
            const isHighMatch = score >= 85;
            const isSaved = job.user_action === 'saved';

            return (
              <div
                key={job.id}
                className="glass-card glass-card-hover p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] space-y-4 group relative shadow-sm"
              >
                {/* Card Top Row: Badges, Score & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-lg border font-bold ${
                      job.platform === 'upwork'
                        ? 'badge-upwork'
                        : job.platform === 'fiverr'
                        ? 'badge-fiverr'
                        : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/25 font-bold'
                    }`}>
                      {job.platform}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-surface-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/[0.06] font-medium">
                      {job.category}
                    </span>
                    {job.client?.payment_verified && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
                      </span>
                    )}
                    {job.risk?.risk_level === 'High' ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> High Risk Flags
                      </span>
                    ) : job.risk?.risk_level === 'Medium' ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Medium Risk
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Low Risk
                      </span>
                    )}

                    {job.score?.difficulty_score && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Difficulty: <strong className="text-slate-800 dark:text-slate-200">{job.score.difficulty_score >= 80 ? 'Easy' : job.score.difficulty_score >= 50 ? 'Moderate' : 'Challenging'}</strong>
                      </span>
                    )}
                  </div>

                  {/* Score & Quick Save */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                      isHighMatch
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 shadow-sm'
                        : score >= 70
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 shadow-sm'
                        : 'bg-slate-100 dark:bg-surface-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08]'
                    }`}>
                      {isHighMatch && <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
                      <span>{score}</span>
                      <span className="text-xs opacity-70">/100</span>
                    </div>

                    <button
                      onClick={() => isSaved ? onRemoveAction(job.id) : onSaveJob(job.id)}
                      className={`p-2 rounded-xl border transition-all active:scale-95 ${
                        isSaved
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-800 dark:text-amber-300 shadow-sm'
                          : 'bg-slate-100 dark:bg-surface-800 border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.2]'
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
                    className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                  >
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Why It Matches Highlight */}
                {job.score?.explanation?.why_matches && job.score.explanation.why_matches.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 dark:bg-surface-900/80 border border-slate-200/80 dark:border-white/[0.06] text-xs text-slate-700 dark:text-slate-300 space-y-2">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Why It Matches You:
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                      {job.score.explanation.why_matches.slice(0, 2).map((w, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span className="leading-relaxed">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer metadata & buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-slate-200 dark:border-white/[0.06] text-xs">
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-xs flex-wrap font-medium">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono text-sm">
                      {job.budget?.type === 'fixed'
                        ? `$${job.budget?.max || job.budget?.min || 0} Fixed`
                        : `$${job.budget?.min || 0}-$${job.budget?.max || 0}/hr`}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Client: <strong className="text-slate-800 dark:text-slate-200">{job.client?.rating ? `${job.client.rating}★` : 'Verified'}</strong> ({job.client?.country || 'Global'})</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Proposals: <strong className="text-slate-800 dark:text-slate-200">{job.competition?.proposal_count || 0}</strong></span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Skill Match: <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{job.score?.skill_score || 80}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    {job.user_action !== 'ignored' && (
                      <button
                        onClick={() => setIgnoringJobId(job.id)}
                        className="px-3.5 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition active:scale-95 text-center"
                      >
                        Dismiss
                      </button>
                    )}

                    <button
                      onClick={() => onViewJob(job)}
                      className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white dark:text-slate-950 font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-glow-emerald active:scale-95 text-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect &amp; Draft</span>
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
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:glass-card border border-slate-200 dark:border-white/[0.1] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Why are you ignoring this job?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] text-xs text-slate-700 dark:text-slate-200 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="ignoreReason"
                    value={reason}
                    checked={ignoreReason === reason}
                    onChange={() => setIgnoreReason(reason)}
                    className="text-emerald-500 focus:ring-emerald-400 bg-white dark:bg-surface-900 border-slate-300 dark:border-white/[0.1]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => setIgnoringJobId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-surface-750 transition"
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
