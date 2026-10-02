import {
  NormalizedJob,
  PlatformConnectionState,
  AutomationSettings,
  AnalyticsSummary,
  UserCapabilityProfile,
  NotificationItem,
  Application,
  BankStatementReport,
  Proposal
} from '../types/index.js';

export const mockStandardJob: NormalizedJob = {
  id: 'job_standard_1',
  platform: 'upwork',
  platform_job_id: 'up_123',
  url: 'https://upwork.com/jobs/123',
  title: 'Full Stack React & Node Developer Needed',
  description: 'Looking for an experienced engineer to build dashboards and APIs.',
  category: 'Software Development',
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  budget: {
    type: 'fixed',
    min: 500,
    max: 1200,
    currency: 'USD'
  },
  experience_level: 'Intermediate',
  estimated_duration: '1-3 months',
  deadline: 'Flexible',
  posted_at: '2026-10-01T12:00:00Z',
  client: {
    name: 'Tech Ventures Inc',
    country: 'United States',
    rating: 4.9,
    reviews: 32,
    jobs_posted: 15,
    jobs_hired: 12,
    hire_rate: 80,
    payment_verified: true
  },
  competition: {
    proposal_count: 8
  },
  communication_requirements: ['Daily async update'],
  requirements: ['React 18', 'TypeScript', 'Clean code'],
  external_links: [],
  source_data: {},
  collected_at: '2026-10-01T12:30:00Z',
  score: {
    job_id: 'job_standard_1',
    user_id: 'usr_demo',
    overall_score: 92,
    skill_score: 95,
    experience_score: 90,
    difficulty_score: 85,
    budget_score: 88,
    time_score: 90,
    communication_score: 95,
    preference_score: 90,
    client_quality_score: 92,
    matched_skills: ['React', 'TypeScript', 'Node.js'],
    missing_skills: [],
    explanation: {
      why_matches: ['Strong skill alignment with React & TypeScript', 'Budget meets hourly minimum'],
      why_not_matches: [],
      concerns: ['Competitive proposal influx'],
      estimated_effort: '15-20 hrs/week',
      potential_value: 'High'
    },
    scored_at: '2026-10-01T12:35:00Z'
  },
  risk: {
    job_id: 'job_standard_1',
    risk_level: 'Low',
    risk_score: 5,
    warning_signals: [],
    explanation: 'Verified client payment and standard platform terms.',
    analyzed_at: '2026-10-01T12:35:00Z'
  },
  user_action: null
};

export const mockEdgeCaseJob: NormalizedJob = {
  id: 'job_edge_2',
  platform: 'freelancer',
  platform_job_id: 'fl_999',
  url: '',
  title: 'Data Scraping Project with Off-Platform Contact',
  description: 'Scrape websites and message us on Telegram for immediate payment.',
  category: 'Data Entry',
  skills: [],
  budget: {
    type: 'hourly',
    min: 10,
    max: 20,
    currency: 'USD'
  },
  experience_level: 'Entry',
  estimated_duration: '',
  deadline: '',
  posted_at: '2026-09-30T10:00:00Z',
  client: {
    name: 'Anonymous',
    country: '',
    rating: null,
    reviews: null,
    jobs_posted: 1,
    jobs_hired: 0,
    hire_rate: 0,
    payment_verified: false
  },
  competition: {
    proposal_count: null
  },
  communication_requirements: [],
  requirements: [],
  external_links: [],
  source_data: {},
  collected_at: '2026-09-30T10:05:00Z',
  score: {
    job_id: 'job_edge_2',
    user_id: 'usr_demo',
    overall_score: 45,
    skill_score: 50,
    experience_score: 40,
    difficulty_score: 40,
    budget_score: 30,
    time_score: 50,
    communication_score: 20,
    preference_score: 20,
    client_quality_score: 20,
    matched_skills: [],
    missing_skills: ['Scraping'],
    explanation: {
      why_matches: [],
      why_not_matches: ['Unverified client', 'Off-platform risk'],
      concerns: ['Requests off-platform chat on Telegram'],
      estimated_effort: 'Unknown',
      potential_value: 'Poor'
    },
    scored_at: '2026-09-30T10:10:00Z'
  },
  risk: {
    job_id: 'job_edge_2',
    risk_level: 'High',
    risk_score: 90,
    warning_signals: ['Off-platform Telegram redirect', 'Unverified payment method'],
    explanation: 'Scam risk: Client requests communication outside the platform.',
    analyzed_at: '2026-09-30T10:10:00Z'
  },
  user_action: 'ignored',
  ignore_reason: 'Bad client reputation'
};

export const mockSavedJob: NormalizedJob = {
  ...mockStandardJob,
  id: 'job_saved_3',
  title: 'Senior Next.js Developer for Web App',
  user_action: 'saved'
};

export const mockPlatforms: PlatformConnectionState[] = [
  {
    platformId: 'upwork',
    name: 'Upwork',
    status: 'CONNECTED',
    mode: 'LIVE',
    lastSync: '2026-10-02T10:00:00Z',
    capabilities: {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: true,
      application_status: true
    }
  },
  {
    platformId: 'fiverr',
    name: 'Fiverr',
    status: 'CONNECTED',
    mode: 'MOCK',
    lastSync: '2026-10-02T09:30:00Z',
    capabilities: {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: false,
      application_status: false
    }
  },
  {
    platformId: 'freelancer',
    name: 'Freelancer',
    status: 'DISCONNECTED',
    mode: 'MOCK',
    lastSync: undefined,
    capabilities: {
      job_search: true,
      job_details: true,
      client_details: true,
      applications: true,
      application_status: true
    }
  }
];

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    user_id: 'usr_demo',
    job_id: 'job_standard_1',
    job_title: 'Full Stack React & Node Developer Needed',
    platform: 'upwork',
    proposal_id: 'prop_1',
    status: 'applied',
    connect_cost: 6,
    mode: 'manual',
    created_at: '2026-10-01T14:00:00Z',
    updated_at: '2026-10-01T14:00:00Z',
    notes: '',
    outcome: 'pending',
    proposal_content: 'Hi! I have extensive React and Node.js expertise and would love to help you build your dashboard.',
    overall_score: 92
  },
  {
    id: 'app_2',
    user_id: 'usr_demo',
    job_id: 'job_2',
    job_title: 'TypeScript Frontend Refactor',
    platform: 'upwork',
    status: 'interview',
    connect_cost: 8,
    mode: 'assisted',
    created_at: '2026-09-28T11:00:00Z',
    updated_at: '2026-09-29T15:00:00Z',
    notes: '',
    outcome: 'pending',
    overall_score: 88
  },
  {
    id: 'app_3',
    user_id: 'usr_demo',
    job_id: 'job_3',
    job_title: 'Next.js SaaS Application',
    platform: 'freelancer',
    status: 'hired',
    connect_cost: 4,
    mode: 'manual',
    created_at: '2026-09-25T10:00:00Z',
    updated_at: '2026-09-27T16:00:00Z',
    notes: '',
    outcome: 'won',
    overall_score: 95
  }
];

export const mockAutomationSettings: AutomationSettings = {
  id: 'auto_1',
  user_id: 'usr_demo',
  application_mode: 'ASSISTED',
  is_active: false,
  max_daily_applications: 10,
  max_hourly_applications: 3,
  min_match_score: 85,
  max_connect_cost: 8,
  require_low_risk_only: true,
  allowed_categories: [],
  excluded_categories: [],
  max_budget_limit: 1000,
  emergency_stop: false,
  applications_today_count: 2,
  last_reset_date: '2026-10-02',
  updated_at: '2026-10-02T10:00:00Z'
};

export const mockProfile: UserCapabilityProfile = {
  user_id: 'usr_demo',
  headline: 'Full-Stack TypeScript & React Engineer',
  bio: 'Specialized in building performant enterprise web applications.',
  years_experience: 5,
  hourly_rate: 45,
  availability_hours_per_day: 6,
  availability_days_per_week: 5,
  preferred_working_hours: 'Flexible',
  max_simultaneous_projects: 3,
  skills: [
    {
      skill_name: 'React',
      category: 'Frontend',
      proficiency_level: 'Expert',
      years_experience: 5.0,
      verified: true
    },
    {
      skill_name: 'TypeScript',
      category: 'Languages',
      proficiency_level: 'Advanced',
      years_experience: 4.0,
      verified: true
    }
  ],
  preferences: {
    difficulty_weights: {
      skill_match: 0.25,
      technical_complexity: 0.15,
      experience_requirement: 0.15,
      time_requirement: 0.10,
      client_expectations: 0.10,
      deadline: 0.05,
      communication: 0.05,
      budget: 0.10,
      personal_skill: 0.05
    },
    scoring_thresholds: { high_match: 85, possible_match: 65 },
    excluded_keywords: ['wordpress', 'crypto', 'gambling'],
    preferred_categories: ['Software Development', 'Web Development'],
    preferred_difficulty: 'Intermediate',
    min_budget: 30,
    preferred_max_workload: '20-30 hrs/week',
    preferred_duration: '1-3 months',
    preferred_deadline: 'flexible',
    preferred_communication_level: 'Daily',
    preferred_max_tasks: 3
  }
};

export const mockAnalytics: AnalyticsSummary = {
  metrics: {
    average_match_score: 87.5,
    jobs_discovered: 42,
    high_matches: 12,
    possible_matches: 18,
    saved_jobs: 5,
    applications: 8,
    interviews: 2,
    hires: 1,
    rejections: 1,
    total_connects_spent: 42
  },
  by_platform: [
    { name: 'Upwork', count: 28 },
    { name: 'Freelancer', count: 14 }
  ],
  by_category: [
    { name: 'Software Development', count: 20 },
    { name: 'Web Development', count: 14 },
    { name: 'Data Entry', count: 8 }
  ],
  by_difficulty: [
    { name: 'Intermediate', count: 25 },
    { name: 'Advanced', count: 17 }
  ],
  by_proposal_style: [
    { style: 'direct', applications: 4, interviews: 1, hires: 1 },
    { style: 'professional', applications: 4, interviews: 1, hires: 0 }
  ],
  recent_activity: [
    { date: '2026-10-02', action: 'applied', job_title: 'Full Stack React & Node Developer Needed', platform: 'upwork' }
  ]
};

export const mockProposals: Proposal[] = [
  {
    id: 'prop_1',
    job_id: 'job_standard_1',
    user_id: 'usr_demo',
    version_number: 1,
    title: 'Direct & Impactful',
    style: 'direct',
    content: 'Hi! I specialize in React 18, TypeScript, and Node.js APIs. I can start immediately.',
    word_count: 16,
    claims_verification: {
      verified: true,
      skills_used: ['React', 'TypeScript', 'Node.js'],
      unsupported_claims: [],
      notes: ''
    },
    addressed_requirements: ['React', 'Node.js'],
    why_written: 'Direct match for full stack developer request.',
    created_at: '2026-10-01T12:40:00Z'
  },
  {
    id: 'prop_2',
    job_id: 'job_standard_1',
    user_id: 'usr_demo',
    version_number: 1,
    title: 'Technical Deep-Dive',
    style: 'professional',
    content: 'Hello! Having engineered responsive SPAs with TypeScript and Tailwind, here is my plan.',
    word_count: 14,
    claims_verification: {
      verified: true,
      skills_used: ['React', 'TypeScript'],
      unsupported_claims: [],
      notes: ''
    },
    addressed_requirements: ['React', 'TypeScript'],
    why_written: 'In-depth architectural proposal.',
    created_at: '2026-10-01T12:40:00Z'
  }
];

export const mockStatementReport: BankStatementReport = {
  period_label: 'Last 30 Days',
  from_date: '2026-09-02',
  to_date: '2026-10-02',
  metrics: {
    jobs_discovered: 85,
    high_matches: 24,
    possible_matches: 40,
    saved_jobs: 15,
    applications: 10,
    interviews: 3,
    hires: 1,
    rejections: 4,
    average_match_score: 86,
    total_connects_spent: 56
  },
  spending_summary: {
    total_connects: 56,
    estimated_usd_cost: 8.40
  },
  top_categories: ['Software Development', 'Web Development'],
  top_skills: ['React', 'TypeScript', 'Node.js'],
  platform_breakdown: [
    { name: 'upwork', count: 8 },
    { name: 'freelancer', count: 2 }
  ],
  proposal_performance: [
    { style: 'direct', applications: 6, interviews: 2, conversion_rate: '33%' },
    { style: 'technical', applications: 4, interviews: 1, conversion_rate: '25%' }
  ],
  chronological_events: [
    {
      timestamp: '2026-10-01T14:00:00Z',
      platform: 'upwork',
      job_title: 'Full Stack React & Node Developer Needed',
      action: 'applied',
      score: 92,
      cost: 6
    }
  ]
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: 'usr_demo',
    channel: 'browser',
    title: 'High Match Opportunity Discovered',
    body: 'Senior Next.js Developer matches 94% of your verified skills.',
    match_score: 94,
    sent_at: '2026-10-02T08:00:00Z',
    read_at: null,
    status: 'sent'
  },
  {
    id: 'notif_2',
    user_id: 'usr_demo',
    channel: 'browser',
    title: 'Weekly Opportunity Summary',
    body: '24 new opportunities matched your profile this week.',
    match_score: undefined,
    sent_at: '2026-10-01T18:00:00Z',
    read_at: '2026-10-01T19:00:00Z',
    status: 'sent'
  }
];
