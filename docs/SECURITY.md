# Security & Platform Compliance Guide

WorkMatch AI enforces strict security principles, multi-tenant isolation, and complete platform compliance.

---

## 1. Credential & Token Protection

1. **No Platform Passwords**: WorkMatch AI never requests, stores, or transmits plain-text platform passwords.
2. **Encrypted Tokens**: Sensitive OAuth tokens and API secrets are encrypted at rest using AES-256-CBC with cryptographic salts (`/backend/src/security/crypto.ts`).
3. **Zero Secrets in Frontend**: API keys, refresh tokens, and internal encryption secrets are never exposed to the client-side JavaScript bundle.
4. **Password Hashing**: User authentication passwords are protected with bcrypt using 10 salt rounds.

---

## 2. Multi-User Isolation

1. **User Scoping**: Every user-owned record (`user_profiles`, `user_skills`, `platform_connections`, `job_scores`, `proposals`, `applications`, `saved_jobs`, `notifications`, `audit_logs`) includes a foreign key constraint to `user_id`.
2. **Authorization Enforcement**: Repositories require explicit `userId` parameter checks. User A cannot view, score, or submit applications for User B.

---

## 3. Platform Compliance & Ethics

WorkMatch AI strictly respects platform Terms of Service:
1. **No Prohibited Bot Evasion**: The system does not attempt to bypass CAPTCHAs, Cloudflare protections, rate limits, or anti-bot defenses.
2. **Mock Fallback on Incompatible Platforms**: If a platform does not officially support automated submissions (such as Fiverr), the connector explicitly declares `applications: false` and guides the user to submit proposals manually.
3. **Rate Limiting**: Background sync jobs run on reasonable polling intervals (5–10 minutes) to avoid overloading external services.

---

## 4. Automation Guardrails & Emergency Stop

Automated submission is blocked unless:
- The user has explicitly selected `AUTOMATIC` application mode.
- The global `emergency_stop` kill-switch is inactive.
- Daily application caps (`max_daily_applications`) and hourly caps (`max_hourly_applications`) have not been reached.
- The job match score meets or exceeds the minimum score cutoff (`min_match_score`).
- The job risk level is `Low` (if `require_low_risk_only` is active).
- Connect costs are within configured maximum limits.
- No duplicate application exists for the job.

If any check fails, the application is rejected and logged with explanatory rationale into the `audit_logs` table.
