export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  is_admin: boolean;
  plan_type: 'personal' | 'pro' | 'team';
  created_at: string;
  updated_at: string;
}

export interface UserSessionPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  planType: string;
}
