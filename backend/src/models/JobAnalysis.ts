export interface JobAnalysis {
  id?: string;
  job_id: string;
  required_skills: string[];
  optional_skills: string[];
  experience_requirement: string;
  technical_complexity: 'Low' | 'Medium' | 'High';
  estimated_hours: number;
  step_count: number;
  communication_level: 'Low' | 'Medium' | 'High';
  deadline_pressure: 'Low' | 'Medium' | 'High';
  budget_quality: 'Low' | 'Fair' | 'High';
  client_expectations: string;
  analyzed_at: string;
}
