# WorkMatch AI — Production MVP Walkthrough

**WorkMatch AI** is a complete, modular, production-ready AI work opportunity discovery, matching, and application assistant built with clean architecture, zero platform lock-in, and strict truthfulness standards.

---

## 1. What Was Created

### 1.1 Layered Backend Architecture (`/backend`)
- **Normalized Job Engine** (`NormalizedJob.ts`): Standardizes opportunity payloads across platforms, equipped with a SHA-256 deduplication hashing algorithm.
- **Relational Database & Migrations** (`schema.sql`, `migrate.ts`, `connection.ts`): 20 normalized tables with foreign keys and WAL mode. Multi-user ready with `user_id` scoping across all records.
- **Modular Connector Layer** (`PlatformConnector.ts`, `ConnectorRegistry.ts`):
  - **Upwork Connector** (Priority 1: Live/Mock toggle, proposal support)
  - **Fiverr Connector** (Priority 2: Live/Mock toggle, disallows external automated bidding per platform terms)
  - **Freelancer Connector** (Priority 3: Live/Mock toggle, bidding support)
  - **Mock Platform Simulator** (30 diverse realistic jobs covering varied budgets, difficulties, and scam patterns)
- **AI Gateway & Prompts** (`AIGateway.ts`, `/prompts/`): Versioned prompt templates (`job_analyzer_v1`, `risk_analyzer_v1`, `proposal_generator_v1`, `claim_verifier_v1`) with full token/cost tracking in `ai_usage_logs`.
- **Transparent Multi-Criteria Scoring** (`MatchingEngine.ts`, `DifficultyCalculator.ts`): 0–100 score breakdown across Skill, Experience, Difficulty, Budget, Time, Communication, and Client Quality, with human-readable explanations and exclusion keyword penalties.
- **Scam & Fraud Signal Detection** (`RiskScamSignalEngine.ts`): Detects off-platform communication (Telegram/WhatsApp), fee requests, and unrealistic compensation.
- **Truthful Proposal Engine & Claim Verifier** (`ProposalGenerator.ts`, `ClaimVerifier.ts`, `Humanizer.ts`): Generates 4 styles (Direct, Friendly, Professional, Short) with a mandatory audit ensuring proposals NEVER claim unverified skills or inflated experience.
- **Multi-Mode Application & Hard Safety Guards** (`AutomationController.ts`): Manual, Assisted, and Automatic modes with rate limits, score cutoffs, low-risk whitelisting, and a global Emergency Kill Switch (`STOP AUTOMATION`).
- **Activity Statement Generator** (`AnalyticsRepository.ts`): Bank-statement style periodic reports and CSV exports.

### 1.2 Serious Productivity SaaS Frontend (`/frontend`)
- **React 18/19 + TypeScript + Vite + Tailwind CSS**: Clean, high-density dark SaaS design.
- **Dashboard View**: High-match badges, active metrics, 1-click mode switcher, platform statuses, and 1-Click Demo Dataset loader.
- **Opportunities Catalog**: Filterable by platform, score, difficulty, budget, category, and risk level, with ignore-reason dialogs.
- **Interactive Job Details Modal**: Full transparent score breakdown bars, client history, risk signals, and instant proposal generator.
- **Proposal Variants & Claim Verification**: Variant tabs, word counter, and green checkmark claim verification badges.
- **Applications Kanban Board**: Discovered → Saved → Proposal Generated → Applied → Viewed → Interview → Hired.
- **Connected Platforms View**: Status pills (`LIVE`, `MOCK`, `UNAVAILABLE`) with dynamic capability matrices.
- **Capability Profile & Difficulty Sliders**: 9 criteria weights for difficulty, skills manager, and AI learned preferences.
- **Activity Statement & CSV Export**: Chronological activity log with Connect spending and download button.

---

## 2. Verification & Automated Tests

All test suites were executed with 100% pass rates:

```bash
npm test --prefix backend
```

```text
TAP version 13
# Subtest: Automation Safety Controls and Emergency Kill Switch
    ok 1 - should BLOCK automated application when global emergency stop is activated
    ok 2 - should BLOCK automated application on platforms where applications are unsupported (e.g. Fiverr)
    ok 3 - should BLOCK automated application when job risk level is High
ok 1 - Automation Safety Controls and Emergency Kill Switch

# Subtest: Proposal Claim Verification and Truthfulness Audit
    ok 1 - should pass verification when proposal references verified skills within verified experience bounds
    ok 2 - should flag and reject proposal claiming 8 years of experience when profile has only 2 years
    ok 3 - should sanitize inflated years back to truthful profile bounds
ok 2 - Proposal Claim Verification and Truthfulness Audit

# Subtest: Difficulty Assessment Engine
    ok 1 - should rate basic 2-hour low-complexity task as Easy
    ok 2 - should reflect changes in user custom difficulty weights
ok 3 - Difficulty Assessment Engine

# Subtest: Matching and Transparent Scoring Engine
    ok 1 - should generate high match score (>80) with transparent explanations for matching job
    ok 2 - should severely penalize score when job triggers user exclusion keyword
ok 4 - Matching and Transparent Scoring Engine

# Subtest: Multi-User Architecture and Data Isolation
    ok 1 - should guarantee complete data isolation between separate users
ok 5 - Multi-User Architecture and Data Isolation

# Subtest: Job Normalization and Deduplication
    ok 1 - should generate identical hashes for functionally identical jobs with different whitespace
    ok 2 - should generate distinct hashes for different jobs
ok 6 - Job Normalization and Deduplication

# Subtest: Risk and Scam Signal Detection Engine
    ok 1 - should detect high risk and off-platform redirection flags
    ok 2 - should flag low risk for standard verified client jobs
ok 7 - Risk and Scam Signal Detection Engine

1..7
# tests 15
# suites 7
# pass 15
# fail 0
```

Frontend production build check:
```bash
npm run build --prefix frontend
# ✓ built in 23.19s without errors
```

---

## 3. How to Run the Application

```bash
# In Terminal 1: Start Backend API (Port 4000)
npm run dev --prefix backend

# In Terminal 2: Start Frontend UI (Port 5173)
npm run dev --prefix frontend
```

Open `http://localhost:5173` in your browser.
Click **"Load 1-Click Demo Dataset"** to populate realistic opportunities, scores, risk flags, proposals, and pipeline tracking.
