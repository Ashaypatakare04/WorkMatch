// WorkMatch AI PostgreSQL Relational Database Schema DDL
// Aligned 100% with SQLite schema.sql (20 core tables + password_resets)

export const PG_SCHEMA_SQL = `
-- 1. Users table (Multi-user ready)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    plan_type VARCHAR(64) NOT NULL DEFAULT 'personal',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. User Profiles (Capability Profiles)
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255) NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    years_experience REAL NOT NULL DEFAULT 0,
    hourly_rate REAL NOT NULL DEFAULT 25.0,
    availability_hours_per_day REAL NOT NULL DEFAULT 4,
    availability_days_per_week INTEGER NOT NULL DEFAULT 5,
    preferred_working_hours VARCHAR(128) NOT NULL DEFAULT 'Flexible',
    max_simultaneous_projects INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. User Skills (Verified & Unverified)
CREATE TABLE IF NOT EXISTS user_skills (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(128) NOT NULL,
    category VARCHAR(128) NOT NULL DEFAULT 'General',
    proficiency_level VARCHAR(64) NOT NULL,
    years_experience REAL NOT NULL DEFAULT 1.0,
    verified INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

-- 4. User Preferences & Weights
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_categories TEXT NOT NULL DEFAULT '[]',
    excluded_keywords TEXT NOT NULL DEFAULT '[]',
    preferred_difficulty VARCHAR(128) NOT NULL DEFAULT 'Easy + Moderate',
    min_budget REAL NOT NULL DEFAULT 20.0,
    preferred_max_workload VARCHAR(64) NOT NULL DEFAULT 'Part-time',
    preferred_duration VARCHAR(64) NOT NULL DEFAULT 'Short-term',
    preferred_deadline VARCHAR(64) NOT NULL DEFAULT 'Flexible',
    preferred_communication_level VARCHAR(64) NOT NULL DEFAULT 'Low',
    preferred_max_tasks INTEGER NOT NULL DEFAULT 5,
    difficulty_weights TEXT NOT NULL DEFAULT '{"skill_match":25,"technical_complexity":15,"experience_requirement":10,"time_requirement":10,"client_expectations":10,"deadline":5,"communication":5,"budget":10,"personal_skill":10}',
    scoring_thresholds TEXT NOT NULL DEFAULT '{"high_match":85,"possible_match":70}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Platform Connections
CREATE TABLE IF NOT EXISTS platform_connections (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DISCONNECTED',
    mode VARCHAR(32) NOT NULL DEFAULT 'MOCK',
    auth_data_encrypted TEXT,
    capabilities TEXT NOT NULL DEFAULT '{"job_search":true,"job_details":true,"client_details":true,"applications":false,"application_status":false}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_sync_status VARCHAR(64) DEFAULT 'IDLE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, platform_id)
);

-- 6. Jobs (Normalized)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(128) PRIMARY KEY,
    platform VARCHAR(64) NOT NULL,
    platform_job_id VARCHAR(128) NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    budget_type VARCHAR(32) NOT NULL DEFAULT 'fixed',
    budget_min REAL,
    budget_max REAL,
    budget_currency VARCHAR(16) NOT NULL DEFAULT 'USD',
    experience_level VARCHAR(64) NOT NULL DEFAULT 'Intermediate',
    estimated_duration VARCHAR(128) NOT NULL DEFAULT '',
    deadline VARCHAR(128) NOT NULL DEFAULT '',
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    client_name VARCHAR(255) NOT NULL DEFAULT '',
    client_country VARCHAR(128) NOT NULL DEFAULT '',
    client_rating REAL,
    client_reviews_count INTEGER,
    client_jobs_posted INTEGER,
    client_jobs_hired INTEGER,
    client_hire_rate REAL,
    proposal_count INTEGER DEFAULT 0,
    communication_requirements TEXT NOT NULL DEFAULT '[]',
    requirements TEXT NOT NULL DEFAULT '[]',
    external_links TEXT NOT NULL DEFAULT '[]',
    source_data TEXT NOT NULL DEFAULT '{}',
    hash VARCHAR(128) UNIQUE NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Job Analyses (Extracted by AI)
CREATE TABLE IF NOT EXISTS job_analyses (
    id VARCHAR(128) PRIMARY KEY,
    job_id VARCHAR(128) UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    required_skills TEXT NOT NULL DEFAULT '[]',
    optional_skills TEXT NOT NULL DEFAULT '[]',
    experience_requirement VARCHAR(64) NOT NULL DEFAULT '',
    technical_complexity VARCHAR(32) NOT NULL DEFAULT 'Low',
    estimated_hours REAL NOT NULL DEFAULT 2.0,
    step_count INTEGER NOT NULL DEFAULT 1,
    communication_level VARCHAR(32) NOT NULL DEFAULT 'Low',
    deadline_pressure VARCHAR(32) NOT NULL DEFAULT 'Low',
    budget_quality VARCHAR(32) NOT NULL DEFAULT 'Fair',
    client_expectations TEXT NOT NULL DEFAULT '',
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. Job Scores (Personalized per user)
CREATE TABLE IF NOT EXISTS job_scores (
    id VARCHAR(128) PRIMARY KEY,
    job_id VARCHAR(128) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score REAL NOT NULL,
    skill_score REAL NOT NULL,
    experience_score REAL NOT NULL,
    difficulty_score REAL NOT NULL,
    budget_score REAL NOT NULL,
    time_score REAL NOT NULL,
    communication_score REAL NOT NULL,
    preference_score REAL NOT NULL,
    client_quality_score REAL NOT NULL,
    matched_skills TEXT NOT NULL DEFAULT '[]',
    missing_skills TEXT NOT NULL DEFAULT '[]',
    explanation TEXT NOT NULL DEFAULT '{}',
    scored_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- 9. Job Risks (Scam / Warning signals)
CREATE TABLE IF NOT EXISTS job_risks (
    id VARCHAR(128) PRIMARY KEY,
    job_id VARCHAR(128) UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    risk_level VARCHAR(32) NOT NULL DEFAULT 'Low',
    risk_score REAL NOT NULL DEFAULT 0,
    warning_signals TEXT NOT NULL DEFAULT '[]',
    explanation TEXT NOT NULL DEFAULT '',
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. Saved / Ignored Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(128) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    reason TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- 11. Proposals
CREATE TABLE IF NOT EXISTS proposals (
    id VARCHAR(128) PRIMARY KEY,
    job_id VARCHAR(128) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    style VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    claims_verification TEXT NOT NULL DEFAULT '{}',
    addressed_requirements TEXT NOT NULL DEFAULT '[]',
    why_written TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. Applications Pipeline & Tracking
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(128) PRIMARY KEY,
    job_id VARCHAR(128) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proposal_id VARCHAR(128) REFERENCES proposals(id) ON DELETE SET NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'discovered',
    mode VARCHAR(32) NOT NULL DEFAULT 'manual',
    connect_cost INTEGER NOT NULL DEFAULT 0,
    applied_at TIMESTAMP WITH TIME ZONE,
    notes TEXT NOT NULL DEFAULT '',
    outcome VARCHAR(64) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- 13. Application Events (Audit trail)
CREATE TABLE IF NOT EXISTS application_events (
    id VARCHAR(128) PRIMARY KEY,
    application_id VARCHAR(128) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 14. User Feedback & Learning
CREATE TABLE IF NOT EXISTS user_feedback (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(128) REFERENCES jobs(id) ON DELETE SET NULL,
    action VARCHAR(64) NOT NULL,
    reason TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 15. Learned Preferences
CREATE TABLE IF NOT EXISTS learned_preferences (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accepted_patterns TEXT NOT NULL DEFAULT '[]',
    rejected_patterns TEXT NOT NULL DEFAULT '[]',
    preferred_budget_range TEXT NOT NULL DEFAULT '{"min": 30, "max": 150}',
    preferred_difficulty VARCHAR(64) NOT NULL DEFAULT 'Easy + Moderate',
    preferred_comm_level VARCHAR(64) NOT NULL DEFAULT 'Low',
    insights TEXT NOT NULL DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 16. Automation Settings & Hard Safety Controls
CREATE TABLE IF NOT EXISTS automation_settings (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_mode VARCHAR(32) NOT NULL DEFAULT 'MANUAL',
    is_active INTEGER NOT NULL DEFAULT 0,
    emergency_stop INTEGER NOT NULL DEFAULT 0,
    max_daily_applications INTEGER NOT NULL DEFAULT 5,
    max_hourly_applications INTEGER NOT NULL DEFAULT 2,
    min_match_score REAL NOT NULL DEFAULT 85.0,
    max_connect_cost INTEGER NOT NULL DEFAULT 6,
    allowed_categories TEXT NOT NULL DEFAULT '[]',
    excluded_categories TEXT NOT NULL DEFAULT '[]',
    max_budget_limit REAL NOT NULL DEFAULT 500.0,
    require_low_risk_only INTEGER NOT NULL DEFAULT 1,
    applications_today_count INTEGER NOT NULL DEFAULT 0,
    last_reset_date VARCHAR(64) NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(128) REFERENCES jobs(id) ON DELETE SET NULL,
    channel VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    match_score REAL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL DEFAULT 'sent'
);

-- 18. Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    browser_enabled INTEGER NOT NULL DEFAULT 1,
    email_enabled INTEGER NOT NULL DEFAULT 0,
    telegram_enabled INTEGER NOT NULL DEFAULT 0,
    discord_enabled INTEGER NOT NULL DEFAULT 0,
    min_score_threshold REAL NOT NULL DEFAULT 85.0,
    alert_high_risk INTEGER NOT NULL DEFAULT 1,
    quiet_hours_start VARCHAR(16) NOT NULL DEFAULT '22:00',
    quiet_hours_end VARCHAR(16) NOT NULL DEFAULT '08:00',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 19. AI Usage Logs
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    prompt_name VARCHAR(128) NOT NULL,
    prompt_version VARCHAR(32) NOT NULL,
    tokens_in INTEGER NOT NULL DEFAULT 0,
    tokens_out INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    details TEXT NOT NULL DEFAULT '{}',
    ip_address VARCHAR(64) NOT NULL DEFAULT '127.0.0.1',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 21. Password Resets (Secure Account Recovery)
CREATE TABLE IF NOT EXISTS password_resets (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 22. Subscriptions & Billing
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL,
    subscription_id VARCHAR(128) NOT NULL,
    customer_id VARCHAR(128) NOT NULL,
    plan_type VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_subscriptions_user UNIQUE (user_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_hash ON jobs(hash);
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_scores_user_score ON job_scores(user_id, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_sent ON notifications(user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sub_id ON subscriptions(subscription_id);
`;
