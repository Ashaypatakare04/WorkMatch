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
  AlertCircle
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          User Capability Profile & Criteria
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Your profile is the single source of truth for all matching algorithms and proposal generators.
        </p>
      </div>

      {/* AI Learned Preferences Box */}
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Continuous Personalization & Learned Preferences</h2>
          </div>
          <button
            onClick={onRefreshLearned}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate Insights</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The system continuously analyzes which jobs you accept, reject, save, or win to adapt recommendations transparently without silent overrides.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              Frequently Accepted Opportunity Patterns:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(learnedInsights?.accepted_patterns || ['Data Entry', 'Web Research', 'Excel Verification']).map((p: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-red-400 font-semibold text-[11px] uppercase tracking-wider">
              Identified Negative / Dismissal Filters:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(learnedInsights?.rejected_patterns || ['Cold calling', 'Telemarketing', 'Advanced programming']).map((p: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 text-[11px]">
                  ✕ {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Profile & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Info */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Professional Identity & Rates</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Professional Headline:</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Bio & Core Capabilities:</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Hourly Rate (USD):</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Availability (Hours/Day):</label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={e => setHoursPerDay(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfileCore}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
                >
                  {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
                  <span>{saveSuccess ? 'Saved!' : 'Save Core Details'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified Skills Manager */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Verified Skills Inventory</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proposals strictly reference these skills. No fabricated claims allowed.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {skills.length} Verified
              </span>
            </div>

            {/* Add Skill Form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="Add custom skill (e.g. Google Sheets, Python, Manual QA)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <select
                value={newSkillLevel}
                onChange={e => setNewSkillLevel(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                onClick={handleAddSkill}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Skills Badges List */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700/50">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 pl-3 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                >
                  <span>{skill.skill_name}</span>
                  <span className="text-[10px] text-sky-400 font-mono">({skill.proficiency_level})</span>
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-500 hover:text-red-400 transition ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded Keywords (Things user does NOT want) */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Explicit Exclusions & Deal-Breakers</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Jobs containing these terms will be heavily penalized or flagged with concerns.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newExclusion}
                onChange={e => setNewExclusion(e.target.value)}
                placeholder="e.g. Cold calling, Telemarketing, Video calls, Night shift..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleAddExclusion}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Add Rule
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {exclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300"
                >
                  <span>✕ {item}</span>
                  <button
                    onClick={() => handleRemoveExclusion(item)}
                    className="text-red-400/80 hover:text-red-200 transition"
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
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Configurable Difficulty Criteria</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Define what &ldquo;Easy Job&rdquo; means for you. Adjust the weight and importance of each criteria below:
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { key: 'skill_match', label: 'Skill Match Alignment', default: 25 },
                { key: 'technical_complexity', label: 'Technical Complexity', default: 15 },
                { key: 'experience_requirement', label: 'Experience Requirement', default: 10 },
                { key: 'time_requirement', label: 'Time & Duration Demand', default: 10 },
                { key: 'client_expectations', label: 'Client Feedback / Reputation', default: 10 },
                { key: 'deadline', label: 'Deadline & Turnaround Pressure', default: 5 },
                { key: 'communication', label: 'Communication Requirements', default: 5 },
                { key: 'budget', label: 'Compensation & Budget Quality', default: 10 },
                { key: 'personal_skill', label: 'Your Personal Skill Mastery', default: 10 }
              ].map(item => {
                const val = (weights as any)[item.key] ?? item.default;
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{item.label}</span>
                      <span className="font-mono text-sky-400 font-semibold">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={val}
                      onChange={e => handleWeightChange(item.key as any, Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Weights are automatically normalized to calculate the composite difficulty score on every opportunity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
