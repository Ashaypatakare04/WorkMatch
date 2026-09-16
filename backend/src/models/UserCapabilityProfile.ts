export type SkillProficiency = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserSkill {
  id?: string;
  skill_name: string;
  category: string;
  proficiency_level: SkillProficiency;
  years_experience: number;
  verified: boolean;
}

export interface DifficultyWeights {
  skill_match: number;            // default: 25%
  technical_complexity: number;   // default: 15%
  experience_requirement: number; // default: 10%
  time_requirement: number;       // default: 10%
  client_expectations: number;    // default: 10%
  deadline: number;               // default: 5%
  communication: number;          // default: 5%
  budget: number;                 // default: 10%
  personal_skill: number;         // default: 10%
}

export interface ScoringThresholds {
  high_match: number;     // e.g. 85
  possible_match: number; // e.g. 70
}

export interface UserPreferences {
  preferred_categories: string[];
  excluded_keywords: string[];
  preferred_difficulty: 'Easy only' | 'Easy + Moderate' | 'Moderate' | 'Any';
  min_budget: number;
  preferred_max_workload: string;
  preferred_duration: string;
  preferred_deadline: string;
  preferred_communication_level: 'Low' | 'Medium' | 'High' | 'Any';
  preferred_max_tasks: number;
  difficulty_weights: DifficultyWeights;
  scoring_thresholds: ScoringThresholds;
}

export interface UserCapabilityProfile {
  user_id: string;
  headline: string;
  bio: string;
  years_experience: number;
  hourly_rate: number;
  availability_hours_per_day: number;
  availability_days_per_week: number;
  preferred_working_hours: string;
  max_simultaneous_projects: number;
  skills: UserSkill[];
  preferences: UserPreferences;
}

export const DEFAULT_DIFFICULTY_WEIGHTS: DifficultyWeights = {
  skill_match: 25,
  technical_complexity: 15,
  experience_requirement: 10,
  time_requirement: 10,
  client_expectations: 10,
  deadline: 5,
  communication: 5,
  budget: 10,
  personal_skill: 10
};

export const DEFAULT_SCORING_THRESHOLDS: ScoringThresholds = {
  high_match: 85,
  possible_match: 70
};
