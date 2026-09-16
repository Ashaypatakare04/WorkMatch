# AI Architecture & Prompt Engineering Guide

WorkMatch AI decouples prompts, models, and application logic through a centralized **AI Gateway**.

---

## 1. AI Gateway Architecture (`/backend/src/ai/gateway/AIGateway.ts`)

The frontend never directly contacts an AI provider. All requests traverse the AI Gateway which enforces:
- **Provider Selection**: Seamless switching between `MockAIProvider`, Google Gemini API, or OpenAI.
- **Versioned Prompts**: Prompts are stored as tested, version-controlled templates in `/backend/src/ai/prompts/`.
- **Structured JSON Outputs**: Enforces typed outputs with schema validation.
- **Audit & Cost Tracking**: Every AI execution records token usage, model name, prompt version, and duration into `ai_usage_logs`.

---

## 2. Versioned Prompt Templates

### 2.1 `job_analyzer_v1`
Extracts structured attributes from free-form job descriptions:
- `required_skills`: string[]
- `optional_skills`: string[]
- `experience_requirement`: 'Entry' | 'Intermediate' | 'Expert'
- `technical_complexity`: 'Low' | 'Medium' | 'High'
- `estimated_hours`: number
- `step_count`: number
- `communication_level`: 'Low' | 'Medium' | 'High'
- `deadline_pressure`: 'Low' | 'Medium' | 'High'

### 2.2 `risk_analyzer_v1`
Evaluates job postings against known work fraud indicators:
- Off-platform communication attempts (Telegram, WhatsApp, Skype)
- Direct off-platform payment circumvention
- Upfront fees, security deposits, or equipment payments
- Unrealistic pay-to-effort ratios
- Unpaid specimen work or extensive test tasks

### 2.3 `proposal_generator_v1`
Drafts 4 high-converting proposal variants tailored to client expectations:
1. **Direct**: Action-oriented, fast confirmation of competence (50-90 words).
2. **Friendly**: Warm, communicative, and collaborative (60-110 words).
3. **Professional**: Structured, standards-focused, quality compliance (60-120 words).
4. **Short**: Ultra-concise, immediate start confirmation (30-60 words).

### 2.4 `claim_verifier_v1`
Strict compliance agent that validates draft proposals against the user's verified profile:
- Detects inflated experience years (e.g. claiming 5 years when profile has 2).
- Flags unverified software tools or languages.
- Detects fabricated past clients or big-tech affiliations.

---

## 3. Truthfulness & Anti-Hallucination Pipeline

```text
Raw Proposal Draft
        │
        ▼
   [Humanizer] (Strip robotic AI cliches like "Dear Hiring Manager", "I am thrilled...")
        │
        ▼
   [ClaimVerifier.verify] (Strict audit against UserCapabilityProfile)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
Claims Verified              Unsupported Claims Detected
   │                               │
   │                               ▼
   │                        [ClaimVerifier.sanitize] (Clamp years, strip false claims)
   │                               │
   └───────────────┬───────────────┘
                   ▼
         Final Safe Proposal
```

---

## 4. Cost Control & Deduplication

AI calls are minimized through:
1. **Deduplication Hashing**: Identical jobs from the same platform/client are never re-analyzed.
2. **Deterministic Fallbacks**: Deterministic heuristics evaluate obvious signals before LLM passes.
3. **Usage Telemetry**: In `ai_usage_logs`, track input/output tokens to monitor operational budgets.
