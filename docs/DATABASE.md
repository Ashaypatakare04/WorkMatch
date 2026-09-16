# Database Design & Schema Reference

WorkMatch AI utilizes a relational database architecture. In local deployment, it runs SQLite with WAL (Write-Ahead Logging) and strict foreign key constraints. The schema is multi-tenant isolated via `user_id` on all user-owned records, allowing seamless migration to PostgreSQL for SaaS scaling.

---

## 1. Schema Entity Relationship Diagram

```text
users (id, email, password_hash, is_admin, plan_type)
  ├── 1:1 user_profiles (headline, bio, hourly_rate, availability)
  ├── 1:N user_skills (skill_name, category, proficiency_level, verified)
  ├── 1:1 user_preferences (categories, exclusions, difficulty_weights)
  ├── 1:N platform_connections (platform_id, status, mode, capabilities)
  ├── 1:N job_scores (job_id, overall_score, breakdown, explanation)
  ├── 1:N saved_jobs (job_id, status, reason)
  ├── 1:N proposals (job_id, style, content, claims_verification)
  ├── 1:N applications (job_id, status, mode, connect_cost, outcome)
  ├── 1:N user_feedback (action, reason, details)
  ├── 1:1 learned_preferences (accepted_patterns, rejected_patterns)
  ├── 1:1 automation_settings (mode, emergency_stop, limits)
  ├── 1:N notifications (channel, title, body, match_score)
  ├── 1:1 notification_preferences (channels, thresholds, quiet_hours)
  ├── 1:N ai_usage_logs (provider, model, tokens, duration)
  └── 1:N audit_logs (action, details, ip_address)

jobs (id, platform, platform_job_id, url, title, budget, client, hash)
  ├── 1:1 job_analyses (required_skills, complexity, hours)
  ├── 1:1 job_risks (risk_level, risk_score, warning_signals)
  ├── 1:N job_scores
  ├── 1:N proposals
  └── 1:N applications
```

---

## 2. Table Directory & Purpose

| Table Name | Description | Key Foreign Keys |
| :--- | :--- | :--- |
| `users` | User identity & credentials | Primary root entity |
| `user_profiles` | Capability profiles, rates, availability | `user_id -> users(id)` |
| `user_skills` | Verified and custom skill inventory | `user_id -> users(id)` |
| `user_preferences` | User difficulty weights & exclusions | `user_id -> users(id)` |
| `platform_connections` | Connector status & encrypted credentials | `user_id -> users(id)` |
| `jobs` | Normalized work opportunities | Unique `hash` deduplication |
| `job_analyses` | Structured NLP features extracted from jobs | `job_id -> jobs(id)` |
| `job_scores` | Multi-criteria match scores (0-100) | `job_id`, `user_id` |
| `job_risks` | Fraud detection and warning flags | `job_id -> jobs(id)` |
| `saved_jobs` | Saved & ignored jobs with feedback | `job_id`, `user_id` |
| `proposals` | Generated proposal variants & claim audits | `job_id`, `user_id` |
| `applications` | Pipeline tracking & Kanban stages | `job_id`, `user_id`, `proposal_id` |
| `application_events` | Application lifecycle transition events | `application_id -> applications(id)` |
| `user_feedback` | Rejection reasons & outcome tracking | `user_id`, `job_id` |
| `learned_preferences` | Dynamic AI personalizations | `user_id -> users(id)` |
| `automation_settings` | Mode, limits, emergency kill switch | `user_id -> users(id)` |
| `notifications` | Dispatched alerts & read status | `user_id`, `job_id` |
| `notification_preferences` | User delivery rules & quiet hours | `user_id -> users(id)` |
| `ai_usage_logs` | Token & latency usage tracking | `user_id -> users(id)` |
| `audit_logs` | Security & automated actions audit trail | `user_id -> users(id)` |

---

## 3. Scaling to PostgreSQL (Production SaaS)

To convert WorkMatch AI to PostgreSQL in production:
1. Replace `DatabaseSync` in `/backend/src/database/connection.ts` with a `pg.Pool` or Prisma client.
2. In `schema.sql`, replace SQLite types (`INTEGER`, `REAL`, `TEXT`) with standard Postgres types (`SERIAL`, `FLOAT8`, `TIMESTAMPTZ`, `JSONB`).
3. Maintain exact query signatures in the Repository layer (`UserRepository`, `JobRepository`, etc.). Zero API or frontend code changes are needed.
