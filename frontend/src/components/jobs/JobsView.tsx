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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {filterStatus === 'saved' ? 'Saved Work Opportunities' : filterStatus === 'ignored' ? 'Ignored Job Archive' : 'Work Opportunities Catalog'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filtered.length} opportunity matches evaluated by WorkMatch AI.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, title, client, or requirements..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Platforms</option>
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
              <option value="freelancer">Freelancer</option>
              <option value="mock">Mock Simulator</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/50 text-xs">
          <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          {/* Score Pills */}
          <button
            onClick={() => setScoreFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              scoreFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Scores
          </button>
          <button
            onClick={() => setScoreFilter('high')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
              scoreFilter === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" /> High Matches (≥85)
          </button>
          <button
            onClick={() => setScoreFilter('possible')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              scoreFilter === 'possible' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Possible (70-84)
          </button>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
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
            className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
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
            className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
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
        <div className="text-center py-16 bg-slate-800/20 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">No jobs match your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => {
            const score = job.score?.overall_score ?? 70;
            const isHighMatch = score >= 85;
            const isSaved = job.user_action === 'saved';
            const isIgnored = job.user_action === 'ignored';

            return (
              <div
                key={job.id}
                className="group bg-slate-800/40 hover:bg-slate-800/70 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3.5"
              >
                {/* Card Top Row: Badges, Score & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700/80 text-slate-200 font-mono">
                      {job.platform}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {job.category}
                    </span>
                    {job.risk?.risk_level === 'High' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> High Risk Flags
                      </span>
                    ) : job.risk?.risk_level === 'Medium' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Medium Risk
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Low Risk
                      </span>
                    )}

                    {job.score?.difficulty_score && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Difficulty: <strong className="text-slate-300">{job.score.difficulty_score >= 80 ? 'Easy' : job.score.difficulty_score >= 50 ? 'Moderate' : 'Challenging'}</strong>
                      </span>
                    )}
                  </div>

                  {/* Score & Quick Save */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-sm ${
                      isHighMatch
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : score >= 70
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isHighMatch && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{score}</span>
                      <span className="text-[10px] opacity-70">/100</span>
                    </div>

                    <button
                      onClick={() => isSaved ? onRemoveAction(job.id) : onSaveJob(job.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isSaved
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
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
                    className="text-base font-semibold text-white group-hover:text-sky-300 transition cursor-pointer"
                  >
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Why It Matches Highlight */}
                {job.score?.explanation.why_matches && job.score.explanation.why_matches.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Why It Matches You:
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-0.5">
                      {job.score.explanation.why_matches.slice(0, 2).map((w, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer metadata & buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-4 text-slate-400 text-[11px] flex-wrap">
                    <span className="font-semibold text-white font-mono">
                      {job.budget.type === 'fixed'
                        ? `$${job.budget.max || job.budget.min || 0} Fixed`
                        : `$${job.budget.min}-$${job.budget.max}/hr`}
                    </span>
                    <span>Client: <strong className="text-slate-300">{job.client.rating ? `${job.client.rating}★` : 'New'}</strong> ({job.client.country || 'Global'})</span>
                    <span>Proposals: <strong className="text-slate-300">{job.competition.proposal_count || 0}</strong></span>
                    <span>Skill Match: <strong className="text-emerald-400">{job.score?.skill_score || 80}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.user_action !== 'ignored' && (
                      <button
                        onClick={() => setIgnoringJobId(job.id)}
                        className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-red-400 text-xs transition"
                      >
                        Ignore
                      </button>
                    )}

                    <button
                      onClick={() => onViewJob(job)}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-md shadow-sky-600/20"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Why are you ignoring this job?</h3>
            <p className="text-xs text-slate-400">
              WorkMatch AI uses this feedback to personalize and tune future recommendations for your profile.
            </p>

            <div className="space-y-2">
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
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700/40 text-xs text-slate-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="ignoreReason"
                    value={reason}
                    checked={ignoreReason === reason}
                    onChange={() => setIgnoreReason(reason)}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setIgnoringJobId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmIgnore}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500"
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
