export type ApplicationStatus =
  | 'discovered'
  | 'analyzed'
  | 'saved'
  | 'proposal_generated'
  | 'applied'
  | 'viewed'
  | 'interview'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type ApplicationMode = 'manual' | 'assisted' | 'automatic';
export type ApplicationOutcome = 'pending' | 'won' | 'lost';

export interface Application {
  id?: string;
  job_id: string;
  user_id: string;
  proposal_id?: string | null;
  status: ApplicationStatus;
  mode: ApplicationMode;
  connect_cost: number;
  applied_at?: string | null;
  notes: string;
  outcome: ApplicationOutcome;
  created_at: string;
  updated_at: string;
}

export interface ApplicationEvent {
  id?: string;
  application_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
