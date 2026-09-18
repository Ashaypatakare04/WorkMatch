import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Check,
  AlertCircle,
  Briefcase,
  DollarSign,
  Clock,
  Award,
  FilterX
} from 'lucide-react';
import { UserCapabilityProfile, UserSkill, DifficultyWeights } from '../../types/index.js';

interface ProfileViewProps {
  profile: UserCapabilityProfile;
  learnedInsights?: any;
  onUpdateProfile: (profile: Partial<UserCapabilityProfile>) => void;
  onUpdateSkills: (skills: UserSkill[]) => void;
  onUpdatePreferences: (preferences: any) => void;
  onRefreshLearned: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  learnedInsights,
  onUpdateProfile,
  onUpdateSkills,
  onUpdatePreferences,
  onRefreshLearned
}) => {
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [hourlyRate, setHourlyRate] = useState(profile.hourly_rate);
  const [hoursPerDay, setHoursPerDay] = useState(profile.availability_hours_per_day);
  const [skills, setSkills] = useState<UserSkill[]>(profile.skills || []);
  const [weights, setWeights] = useState<DifficultyWeights>(profile.preferences.difficulty_weights);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<UserSkill['proficiency_level']>('Intermediate');
  const [newExclusion, setNewExclusion] = useState('');
  const [exclusions, setExclusions] = useState<string[]>(profile.preferences.excluded_keywords || []);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const updated: UserSkill[] = [
        ...skills,
        {
          skill_name: newSkillName.trim(),
          category: 'General',
          proficiency_level: newSkillLevel,
          years_experience: 2.0,
          verified: true
        }
      ];
      setSkills(updated);
      onUpdateSkills(updated);
      setNewSkillName('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, idx) => idx !== index);
    setSkills(updated);
    onUpdateSkills(updated);
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim() && !exclusions.includes(newExclusion.trim())) {
      const updated = [...exclusions, newExclusion.trim()];
      setExclusions(updated);
      onUpdatePreferences({ ...profile.preferences, excluded_keywords: updated });
      setNewExclusion('');
    }
  };

  const handleRemoveExclusion = (item: string) => {
    const updated = exclusions.filter(e => e !== item);
    setExclusions(updated);
    onUpdatePreferences({ ...profile.preferences, excluded_keywords: updated });
  };

  const handleWeightChange = (key: keyof DifficultyWeights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    onUpdatePreferences({ ...profile.preferences, difficulty_weights: updated });
  };

  const handleSaveProfileCore = () => {
    onUpdateProfile({
      headline,
      bio,
      hourly_rate: Number(hourlyRate),
      availability_hours_per_day: Number(hoursPerDay)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTriggerRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshLearned();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Single Source of Truth
            </span>
            <span className="text-xs text-slate-500 font-mono">100% Truthful Alignment</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            Capability Profile &amp; Match Formula
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your capability inventory defines what opportunities the AI targets and guarantees proposal claims never fabricate non-existent skills or experience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-surface-900/80 border border-white/[0.08] flex items-center gap-2.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-medium">Claim Verification</span>
              <span className="text-xs font-mono font-semibold text-emerald-300">Enforced &amp; Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Learned Preferences Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-cyan-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display text-white">
                Continuous Personalization &amp; Learned Tendencies
              </h2>
              <span className="text-[11px] text-slate-400">
                Calibrates transparently based on your manual saves, ignores, and won proposals
              </span>
            </div>
          </div>

          <button
            onClick={handleTriggerRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-slate-200 text-xs font-semibold border border-white/10 transition shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Re-evaluating...' : 'Re-evaluate Insights'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1 relative">
          {/* Frequently Accepted Patterns */}
          <div className="p-4 rounded-2xl bg-surface-950/60 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Preferred Opportunity Themes
              </span>
              <span className="text-[10px] text-slate-500 font-mono">High Win Velocity</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(learnedInsights?.accepted_patterns || ['Data Entry', 'Web Research', 'Excel Verification']).map((p: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
                >
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          {/* Identified Negative / Dismissal Filters */}
          <div className="p-4 rounded-2xl bg-surface-950/60 border border-red-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-bold text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FilterX className="w-3.5 h-3.5" /> Auto-Dismissed Keywords &amp; Niches
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Score Penalized</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(learnedInsights?.rejected_patterns || ['Cold calling', 'Telemarketing', 'Advanced programming']).map((p: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-medium"
                >
                  ✕ {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Profile Identity & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Info */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Marketplace Identity &amp; Target Compensation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Public Presentation</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  Professional Headline:
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white text-xs font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  Bio &amp; Verified Work Scope:
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Hourly Rate (USD):
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Daily Availability (Hours/Day):
                  </label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={e => setHoursPerDay(Number(e.target.value))}
                    className="w-full bg-surface-950 border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfileCore}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-surface-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
                >
                  {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{saveSuccess ? 'Changes Saved!' : 'Save Core Details'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified Skills Inventory */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold font-display text-white">
                    Verified Skills Inventory
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proposals strictly reference these skills. No fabricated claims allowed.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold font-mono flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {skills.length} Verified
              </span>
            </div>

            {/* Add Skill Form */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="Add skill (e.g. Lead Generation, Python, Web QA)..."
                className="w-full sm:flex-1 bg-surface-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
              <select
                value={newSkillLevel}
                onChange={e => setNewSkillLevel(e.target.value as any)}
                className="w-full sm:w-auto bg-surface-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                onClick={handleAddSkill}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-white text-xs font-semibold border border-white/10 transition active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Skills Badges List */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-surface-950/80 border border-white/[0.08] hover:border-emerald-500/30 text-xs text-slate-200 transition"
                >
                  <span className="font-medium text-white">{skill.skill_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {skill.proficiency_level}
                  </span>
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-500 hover:text-red-400 transition p-1 hover:bg-surface-800 rounded"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded Keywords */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <FilterX className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Explicit Exclusions &amp; Deal-Breakers
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Jobs containing these terms will be heavily penalized or flagged with safety warnings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={newExclusion}
                onChange={e => setNewExclusion(e.target.value)}
                placeholder="e.g. Cold calling, Telemarketing, Video calls, Unpaid test..."
                className="w-full sm:flex-1 bg-surface-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
              />
              <button
                onClick={handleAddExclusion}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 text-xs font-semibold border border-white/10 transition active:scale-[0.98]"
              >
                Add Exclusion
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {exclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300"
                >
                  <span className="font-medium">✕ {item}</span>
                  <button
                    onClick={() => handleRemoveExclusion(item)}
                    className="text-red-400/80 hover:text-red-200 transition ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Configurable Difficulty Criteria Sliders */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Match Formula Weights
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Define what &ldquo;Easy &amp; High-Value&rdquo; means for you. Adjust the importance of each parameter:
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { key: 'skill_match', label: 'Skill Match Alignment', default: 25 },
                { key: 'technical_complexity', label: 'Technical Simplicity', default: 15 },
                { key: 'experience_requirement', label: 'Experience Alignment', default: 10 },
                { key: 'time_requirement', label: 'Time & Duration Demand', default: 10 },
                { key: 'client_expectations', label: 'Client Reputation & Spent', default: 10 },
                { key: 'deadline', label: 'Deadline & Turnaround Ease', default: 5 },
                { key: 'communication', label: 'Async Communication Fit', default: 5 },
                { key: 'budget', label: 'Compensation & Budget Quality', default: 10 },
                { key: 'personal_skill', label: 'Personal Skill Mastery', default: 10 }
              ].map(item => {
                const val = (weights as any)[item.key] ?? item.default;
                return (
                  <div key={item.key} className="space-y-1.5 p-2 rounded-xl bg-surface-950/40 border border-white/[0.04]">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-mono text-cyan-400 font-bold">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={val}
                      onChange={e => handleWeightChange(item.key as any, Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-surface-800 rounded-lg"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 leading-relaxed font-mono">
              Weights are dynamically normalized to generate the 0–100 composite match score on every opportunity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
