-- WorkMatch AI Relational Database Schema (SQLite)
PRAGMA foreign_keys = ON;

-- 1. Users table (Multi-user ready)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    plan_type TEXT NOT NULL DEFAULT 'personal', -- 'personal', 'pro', 'team'
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 2. User Profiles (Capability Profiles)
CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    years_experience REAL NOT NULL DEFAULT 0,
    hourly_rate REAL NOT NULL DEFAULT 25.0,
    availability_hours_per_day REAL NOT NULL DEFAULT 4,
    availability_days_per_week INTEGER NOT NULL DEFAULT 5,
    preferred_working_hours TEXT NOT NULL DEFAULT 'Flexible',
    max_simultaneous_projects INTEGER NOT NULL DEFAULT 3,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 3. User Skills (Verified & Unverified)
CREATE TABLE IF NOT EXISTS user_skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    proficiency_level TEXT NOT NULL, -- Beginner, Basic, Intermediate, Advanced, Expert
    years_experience REAL NOT NULL DEFAULT 1.0,
    verified INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE(user_id, skill_name)
);

-- 4. User Preferences & Weights
CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_categories TEXT NOT NULL DEFAULT '[]', -- JSON array
    excluded_keywords TEXT NOT NULL DEFAULT '[]', -- JSON array (e.g. cold calling, sales)
    preferred_difficulty TEXT NOT NULL DEFAULT 'Easy + Moderate', -- 'Easy only', 'Easy + Moderate', 'Moderate', 'Any'
    min_budget REAL NOT NULL DEFAULT 20.0,
    preferred_max_workload TEXT NOT NULL DEFAULT 'Part-time',
    preferred_duration TEXT NOT NULL DEFAULT 'Short-term',
    preferred_deadline TEXT NOT NULL DEFAULT 'Flexible',
    preferred_communication_level TEXT NOT NULL DEFAULT 'Low',
    preferred_max_tasks INTEGER NOT NULL DEFAULT 5,
    -- Configurable difficulty weights (must sum to 100 or normalized)
    difficulty_weights TEXT NOT NULL DEFAULT '{"skill_match":25,"technical_complexity":15,"experience_requirement":10,"time_requirement":10,"client_expectations":10,"deadline":5,"communication":5,"budget":10,"personal_skill":10}',
    -- Configurable scoring thresholds
    scoring_thresholds TEXT NOT NULL DEFAULT '{"high_match":85,"possible_match":70}',
    updated_at TEXT NOT NULL
);

-- 5. Platform Connections
CREATE TABLE IF NOT EXISTS platform_connections (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_id TEXT NOT NULL, -- 'upwork', 'fiverr', 'freelancer', 'mock'
    status TEXT NOT NULL DEFAULT 'DISCONNECTED', -- 'CONNECTED', 'DISCONNECTED', 'ERROR'
    mode TEXT NOT NULL DEFAULT 'MOCK', -- 'LIVE', 'MOCK', 'UNAVAILABLE'
    auth_data_encrypted TEXT,
    capabilities TEXT NOT NULL DEFAULT '{"job_search":true,"job_details":true,"client_details":true,"applications":false,"application_status":false}',
    last_sync_at TEXT,
    last_sync_status TEXT DEFAULT 'IDLE',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(user_id, platform_id)
);

-- 6. Jobs (Normalized)
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    platform_job_id TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget_type TEXT NOT NULL, -- 'fixed', 'hourly'
    budget_min REAL,
    budget_max REAL,
    budget_currency TEXT NOT NULL DEFAULT 'USD',
    experience_level TEXT NOT NULL, -- 'Entry', 'Intermediate', 'Expert'
    estimated_duration TEXT NOT NULL DEFAULT '',
    deadline TEXT NOT NULL DEFAULT '',
    posted_at TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT '',
    client_country TEXT NOT NULL DEFAULT '',
    client_rating REAL,
    client_reviews_count INTEGER,
    client_jobs_posted INTEGER,
    client_jobs_hired INTEGER,
    client_hire_rate REAL,
    proposal_count INTEGER DEFAULT 0,
    communication_requirements TEXT NOT NULL DEFAULT '[]', -- JSON array
    requirements TEXT NOT NULL DEFAULT '[]', -- JSON array
    external_links TEXT NOT NULL DEFAULT '[]', -- JSON array
    source_data TEXT NOT NULL DEFAULT '{}', -- JSON platform-specific original
    hash TEXT UNIQUE NOT NULL, -- Deduplication hash
    collected_at TEXT NOT NULL
);

-- 7. Job Analyses (Extracted by AI)
CREATE TABLE IF NOT EXISTS job_analyses (
    id TEXT PRIMARY KEY,
    job_id TEXT UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    required_skills TEXT NOT NULL DEFAULT '[]', -- JSON array
    optional_skills TEXT NOT NULL DEFAULT '[]', -- JSON array
    experience_requirement TEXT NOT NULL DEFAULT '',
    technical_complexity TEXT NOT NULL DEFAULT 'Low', -- Low, Medium, High
    estimated_hours REAL NOT NULL DEFAULT 2.0,
    step_count INTEGER NOT NULL DEFAULT 1,
    communication_level TEXT NOT NULL DEFAULT 'Low', -- Low, Medium, High
    deadline_pressure TEXT NOT NULL DEFAULT 'Low', -- Low, Medium, High
    budget_quality TEXT NOT NULL DEFAULT 'Fair', -- Low, Fair, High
    client_expectations TEXT NOT NULL DEFAULT '',
    analyzed_at TEXT NOT NULL
);

-- 8. Job Scores (Personalized per user)
CREATE TABLE IF NOT EXISTS job_scores (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score REAL NOT NULL,
    skill_score REAL NOT NULL,
    experience_score REAL NOT NULL,
    difficulty_score REAL NOT NULL,
    budget_score REAL NOT NULL,
    time_score REAL NOT NULL,
    communication_score REAL NOT NULL,
    preference_score REAL NOT NULL,
    client_quality_score REAL NOT NULL,
    matched_skills TEXT NOT NULL DEFAULT '[]', -- JSON array
    missing_skills TEXT NOT NULL DEFAULT '[]', -- JSON array
    explanation TEXT NOT NULL DEFAULT '{}', -- JSON { why_matches: [], why_not_matches: [], concerns: [], estimated_effort: "", potential_value: "" }
    scored_at TEXT NOT NULL,
    UNIQUE(job_id, user_id)
);

-- 9. Job Risks (Scam / Warning signals)
CREATE TABLE IF NOT EXISTS job_risks (
    id TEXT PRIMARY KEY,
    job_id TEXT UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL, -- 'Low', 'Medium', 'High', 'Needs Review'
    risk_score REAL NOT NULL, -- 0 to 100
    warning_signals TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
    explanation TEXT NOT NULL DEFAULT '',
    analyzed_at TEXT NOT NULL
);

-- 10. Saved / Ignored Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'saved', 'ignored'
    reason TEXT NOT NULL DEFAULT '', -- Rejection/ignore reason
    created_at TEXT NOT NULL,
    UNIQUE(user_id, job_id)
);

-- 11. Proposals
CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    style TEXT NOT NULL, -- 'direct', 'friendly', 'professional', 'short'
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    claims_verification TEXT NOT NULL DEFAULT '{}', -- JSON { verified: true, skills_used: [], unsupported_claims: [], notes: "" }
    addressed_requirements TEXT NOT NULL DEFAULT '[]', -- JSON array
    why_written TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

-- 12. Applications Pipeline & Tracking
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proposal_id TEXT REFERENCES proposals(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'discovered', -- discovered, analyzed, saved, proposal_generated, applied, viewed, interview, hired, rejected, withdrawn
    mode TEXT NOT NULL DEFAULT 'manual', -- manual, assisted, automatic
    connect_cost INTEGER NOT NULL DEFAULT 0,
    applied_at TEXT,
    notes TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'pending', -- pending, won, lost
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(user_id, job_id)
);

-- 13. Application Events (Audit trail)
CREATE TABLE IF NOT EXISTS application_events (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);

-- 14. User Feedback & Learning
CREATE TABLE IF NOT EXISTS user_feedback (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'accept', 'reject', 'save', 'apply', 'interview', 'hire', 'ignore'
    reason TEXT NOT NULL DEFAULT '', -- 'Too difficult', 'Too low budget', 'Bad client', 'Too much communication', etc.
    details TEXT NOT NULL DEFAULT '{}', -- JSON
    created_at TEXT NOT NULL
);

-- 15. Learned Preferences
CREATE TABLE IF NOT EXISTS learned_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accepted_patterns TEXT NOT NULL DEFAULT '[]', -- JSON array of tags/categories
    rejected_patterns TEXT NOT NULL DEFAULT '[]', -- JSON array of tags/categories
    preferred_budget_range TEXT NOT NULL DEFAULT '{"min": 30, "max": 150}',
    preferred_difficulty TEXT NOT NULL DEFAULT 'Easy + Moderate',
    preferred_comm_level TEXT NOT NULL DEFAULT 'Low',
    insights TEXT NOT NULL DEFAULT '[]', -- JSON array of user-readable strings
    last_updated TEXT NOT NULL
);

-- 16. Automation Settings & Hard Safety Controls
CREATE TABLE IF NOT EXISTS automation_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_mode TEXT NOT NULL DEFAULT 'MANUAL', -- 'MANUAL', 'ASSISTED', 'AUTOMATIC'
    is_active INTEGER NOT NULL DEFAULT 0,
    emergency_stop INTEGER NOT NULL DEFAULT 0,
    max_daily_applications INTEGER NOT NULL DEFAULT 5,
    max_hourly_applications INTEGER NOT NULL DEFAULT 2,
    min_match_score REAL NOT NULL DEFAULT 85.0,
    max_connect_cost INTEGER NOT NULL DEFAULT 6,
    allowed_categories TEXT NOT NULL DEFAULT '[]', -- JSON array
    excluded_categories TEXT NOT NULL DEFAULT '[]', -- JSON array
    max_budget_limit REAL NOT NULL DEFAULT 500.0,
    require_low_risk_only INTEGER NOT NULL DEFAULT 1,
    applications_today_count INTEGER NOT NULL DEFAULT 0,
    last_reset_date TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
    channel TEXT NOT NULL, -- 'browser', 'email', 'telegram', 'discord'
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    match_score REAL,
    sent_at TEXT NOT NULL,
    read_at TEXT,
    status TEXT NOT NULL DEFAULT 'sent'
);

-- 18. Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    browser_enabled INTEGER NOT NULL DEFAULT 1,
    email_enabled INTEGER NOT NULL DEFAULT 0,
    telegram_enabled INTEGER NOT NULL DEFAULT 0,
    discord_enabled INTEGER NOT NULL DEFAULT 0,
    min_score_threshold REAL NOT NULL DEFAULT 85.0,
    alert_high_risk INTEGER NOT NULL DEFAULT 1,
    quiet_hours_start TEXT NOT NULL DEFAULT '22:00',
    quiet_hours_end TEXT NOT NULL DEFAULT '08:00',
    updated_at TEXT NOT NULL
);

-- 19. AI Usage Logs
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    tokens_in INTEGER NOT NULL DEFAULT 0,
    tokens_out INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '{}',
    ip_address TEXT NOT NULL DEFAULT '127.0.0.1',
    created_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX IF NOT EXISTS idx_job_scores_user_score ON job_scores(user_id, overall_score);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_sent ON notifications(user_id, sent_at);
