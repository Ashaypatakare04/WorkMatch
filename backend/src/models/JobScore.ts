export interface ScoreExplanation {
  why_matches: string[];
  why_not_matches: string[];
  concerns: string[];
  estimated_effort: string;
  potential_value: string;
}

export interface JobScore {
  id?: string;
  job_id: string;
  user_id: string;
  overall_score: number;       // 0 to 100
  skill_score: number;         // 0 to 100
  experience_score: number;    // 0 to 100
  difficulty_score: number;    // 0 to 100
  budget_score: number;        // 0 to 100
  time_score: number;          // 0 to 100
  communication_score: number; // 0 to 100
  preference_score: number;    // 0 to 100
  client_quality_score: number;// 0 to 100
  matched_skills: string[];
  missing_skills: string[];
  explanation: ScoreExplanation;
  scored_at: string;
}
