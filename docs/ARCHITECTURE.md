# Architecture Guide — WorkMatch AI

WorkMatch AI is architected as a **modular, platform-agnostic work opportunity intelligence and application assistant**. It is structured to support single-user personal operations initially while enforcing multi-tenant isolation, clean boundaries, and zero platform lock-in.

---

## 1. High-Level System Architecture

```text
                                  USER
                                   │
                                   ▼
                       USER CAPABILITY PROFILE
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              WORKMATCH AI                              │
│                                                                        │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │ AI Gateway          │   │ Matching Engine   │   │ Risk Engine  │   │
│   │ (Prompts, Providers)│   │ (Transparent 0-100│   │ (Scam/Flags) │   │
│   └──────────┬──────────┘   └─────────┬─────────┘   └───────┬──────┘   │
│              │                        │                     │          │
│   ┌──────────┴──────────┐   ┌─────────┴─────────┐   ┌───────┴──────┐   │
│   │ Proposal Generator  │   │ Difficulty Engine │   │ Notification │   │
│   │ & Claim Verifier    │   │ (User Weights)    │   │ Service      │   │
│   └─────────────────────┘   └───────────────────┘   └──────────────┘   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
                         PLATFORM CONNECTOR LAYER
             ┌─────────────────────┼─────────────────────┐
             ▼                     ▼                     ▼
      Upwork Connector      Fiverr Connector      Freelancer Connector
      (Live/Mock Mode)      (Live/Mock Mode)      (Live/Mock Mode)
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   ▼
                   NORMALIZED JOB REPOSITORY (SQLite)
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
          ALERT MODE          ASSISTED MODE       AUTOMATIC MODE
        (Notifications)     (Human Approval)     (Hard Safety Guards)
```

---

## 2. Core Subsystems

### 2.1 Platform Connector Layer (`/backend/src/connectors/`)
- Platform-specific logic is strictly isolated inside connectors implementing the `PlatformConnector` interface.
- Each connector declares its dynamic `capabilities`:
  - `job_search`: boolean
  - `job_details`: boolean
  - `client_details`: boolean
  - `applications`: boolean
  - `application_status`: boolean
- Connectors support `LIVE`, `MOCK`, and `UNAVAILABLE` modes. If live API credentials are not provided, connectors seamlessly run realistic mock simulations without faking live connections.

### 2.2 Normalized Job Object (`/backend/src/models/NormalizedJob.ts`)
- All jobs retrieved from external sources are mapped to a standardized `NormalizedJob` model.
- Includes a deterministic SHA-256 deduplication hash based on platform, job ID, title, description, and client metadata.

### 2.3 Job Analysis & Feature Extraction (`/backend/src/ai/analyzers/JobAnalyzer.ts`)
- Extracts structured attributes: required skills, optional skills, experience requirement, technical complexity, estimated hours, step count, communication requirements, and deadline pressure.

### 2.4 Configurable Difficulty Engine (`/backend/src/ai/matching/DifficultyCalculator.ts`)
- Difficulty is not hard-coded. The user defines importance weights across 9 criteria:
  - Skill match (25%)
  - Technical complexity (15%)
  - Experience requirement (10%)
  - Time requirement (10%)
  - Client expectations (10%)
  - Deadline (5%)
  - Communication (5%)
  - Budget (10%)
  - Personal skill mastery (10%)

### 2.5 Transparent Matching Engine (`/backend/src/ai/matching/MatchingEngine.ts`)
- Generates transparent, multi-dimensional scores (0–100): Overall Match, Skill Match, Experience Match, Difficulty Match, Budget Match, Time Match, Communication Match, Preference Match, and Client Quality.
- Produces human-readable explanations detailing why the job matches, potential concerns, and missing skills.
- Strictly penalizes jobs matching user exclusion rules (e.g., cold calling, telemarketing).

### 2.6 Risk & Fraud Detection Engine (`/backend/src/ai/risk/RiskScamSignalEngine.ts`)
- Inspects jobs for off-platform communication (Telegram, WhatsApp), off-platform payment attempts, upfront fees/deposits, suspicious URL shorteners, and unrealistic compensation.
- Classifies risk into `Low`, `Medium`, `High`, or `Needs Review`.

### 2.7 Proposal Generation & Strict Claim Verification (`/backend/src/ai/proposals/`)
- Generates 4 distinct styles: **Direct**, **Friendly**, **Professional**, and **Short**.
- Eliminates AI robotic tropes using the `Humanizer` pass.
- Mandates the `ClaimVerifier` audit: guarantees that generated proposals never claim skills, certifications, or years of experience not verified in the user's capability profile.

### 2.8 Autonomous Safety & Multi-Mode Applications (`/backend/src/automation/`)
- Supports **Alert Only (Manual)**, **Assisted**, and **Automatic** modes.
- Hard safety constraints: daily application limits, hourly limits, minimum score cutoffs, cost cutoffs, low-risk whitelisting, and a global Emergency Kill Switch (`STOP AUTOMATION`).
- All automated actions create audit log records.

---

## 3. Data Flow

```text
Raw Platform API / Mock Harvest
               │
               ▼
   [generateJobHash] Deduplication Check
               │
               ▼
       Normalized Job Insert
               │
               ▼
          JobAnalyzer (Extract Features)
               │
               ▼
     RiskScamSignalEngine (Fraud Flags)
               │
               ▼
        MatchingEngine (0-100 Score)
               │
      ┌────────┴────────┐
      ▼                 ▼
Score >= 85        Score < 85
      │                 │
      ▼                 ▼
NotificationService   Cataloged
      │
      ▼
AutomationController (If Mode == AUTOMATIC)
```
