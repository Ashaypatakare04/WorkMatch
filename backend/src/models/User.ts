export type PlanType = 'personal' | 'pro' | 'team';
export type AuthProvider = 'email' | 'google' | 'github' | 'linkedin';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  is_admin: boolean;
  plan_type: PlanType;
  provider?: AuthProvider;
  provider_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSessionPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  planType: string;
}
