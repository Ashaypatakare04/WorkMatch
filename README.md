# WorkMatch AI — Universal AI Work Opportunity Assistant

**WorkMatch AI** is a modular, production-ready AI platform for discovering, evaluating, and applying to freelance work opportunities across multiple marketplaces (Upwork, Fiverr, Freelancer, and future connectors).

Designed for personal productivity with a multi-tenant SaaS architecture under the hood.

---

## Key Features

- **Decoupled Platform Connectors**: Modular connectors for **Upwork**, **Fiverr**, and **Freelancer** with dynamic capability matrices (`LIVE`, `MOCK`, `UNAVAILABLE` status tracking).
- **Normalized Job Engine**: Harmonizes heterogeneous platform listings into a standardized data model with SHA-256 deduplication.
- **Configurable Difficulty Engine**: Define what "easy job" means for you by adjusting weights across 9 criteria (skill match, technical complexity, time, budget, client rating, deadline, etc.).
- **Transparent 0–100 Matching**: Multi-dimensional breakdown (Skill %, Experience %, Difficulty %, Budget %, Time %, Communication %, Client Quality) with human-readable explanations.
- **Scam & Risk Signal Detection**: Automatic detection of off-platform redirects (Telegram/WhatsApp), fee requests, and suspicious behavior.
- **Truthful Proposal Generator**: Generates 4 tailored proposal variants (**Direct**, **Friendly**, **Professional**, **Short**) with a **strict Claim Verification audit** ensuring zero fabricated experience or unverified skills.
- **Application Pipeline Kanban**: Track opportunities from Discovered → Saved → Proposal Generated → Applied → Viewed → Interview → Hired.
- **Work Activity Statement Report**: Bank-statement style chronological audit ledger with Connect spending analytics and CSV export.
- **Three Application Modes**:
  - `Alert Only (Manual)`
  - `Assisted` (AI prepares proposal, human approves before submission)
  - `Automatic` (Applies within strict daily/hourly limits, min score cutoffs, and low-risk policy)
- **Global Emergency Kill Switch**: One-click instant lockdown (`STOP AUTOMATION`) halting all automated actions with full audit logging.
- **Built-in 1-Click Demo Mode**: Experience all features immediately with 30 realistic jobs across platforms without external credentials.

---

## Tech Stack

- **Backend**: Node.js 22 LTS, TypeScript, Express, SQLite with WAL mode & foreign keys.
- **Frontend**: React 18/19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **AI Core**: Centralized AI Gateway supporting Mock NLP engine (offline, zero-cost), Google Gemini, and OpenAI.
- **Testing**: Built-in test suite covering normalization, scoring, difficulty, risk, claim verification, automation safety, and multi-user isolation.

---

## Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### 2. Run Database Migrations
```bash
npm run migrate --prefix backend
```

### 3. Start Development Servers
In two terminal windows:
```bash
# Terminal 1: Backend API (http://localhost:4000)
npm run dev --prefix backend

# Terminal 2: Frontend UI (http://localhost:5173)
npm run dev --prefix frontend
```

### 4. Explore Demo Mode
Open `http://localhost:5173` in your browser and click **"Load 1-Click Demo Dataset"** on the dashboard.

---

## Running Automated Tests

```bash
npm test --prefix backend
```

---

## Documentation

Detailed architectural and technical guides are available in `/docs`:
- [Architecture Guide](file:///docs/ARCHITECTURE.md)
- [REST API Reference](file:///docs/API.md)
- [Database Schema & Postgres Migration](file:///docs/DATABASE.md)
- [Platform Connector Guide](file:///docs/CONNECTOR_GUIDE.md)
- [AI Gateway & Prompt Engineering](file:///docs/AI.md)
- [Security & Compliance](file:///docs/SECURITY.md)
- [Deployment Guide](file:///docs/DEPLOYMENT.md)
- [Academic & Portfolio Overview](file:///docs/project-overview.md)
