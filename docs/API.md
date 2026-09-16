# WorkMatch AI — REST API Documentation

Base URL: `http://localhost:4000/api`

All authenticated endpoints accept a `Bearer <token>` in the `Authorization` header. In local personal mode, unauthenticated calls automatically route through the default sandbox user.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new user account.
```json
// Request
{
  "email": "alex@example.com",
  "password": "SecurePassword123!",
  "full_name": "Alex Mercer"
}
// Response
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "user_...", "email": "alex@example.com", "full_name": "Alex Mercer" }
}
```

### `POST /api/auth/login`
Authenticates user and returns JWT.

### `GET /api/auth/me`
Returns authenticated user identity.

---

## 2. Jobs Endpoints

### `GET /api/jobs`
List opportunities with multi-parameter filtering and sorting.
- Query params: `platform`, `category`, `minScore`, `maxScore`, `difficulty`, `minBudget`, `riskLevel`, `status` (`active`, `saved`, `ignored`), `query`, `sortBy`, `limit`, `offset`.

### `GET /api/jobs/:id`
Retrieves full job object with analysis, score breakdown, risk signals, and generated proposals.

### `POST /api/jobs/:id/save`
Bookmarks a job opportunity.

### `POST /api/jobs/:id/ignore`
Archives a job with a structured rejection reason (`Too difficult`, `Too low budget`, `Bad client`, etc.).

### `DELETE /api/jobs/:id/action`
Clears saved/ignored status on a job.

### `POST /api/jobs/:id/proposal`
Generates 4 personalized proposal variants with strict claim verification audits.

### `POST /api/jobs/sync`
Triggers synchronization and AI analysis across all registered connectors.

---

## 3. Applications Pipeline Endpoints

### `GET /api/applications`
Returns all tracked applications across Kanban pipeline stages.

### `POST /api/applications`
Records a new application submission.

### `POST /api/applications/:id/status`
Updates pipeline stage (`applied`, `viewed`, `interview`, `hired`, `rejected`, `withdrawn`).

---

## 4. Platform Connector Endpoints

### `GET /api/platforms`
Lists all connectors, status (`CONNECTED`, `DISCONNECTED`), mode (`LIVE`, `MOCK`, `UNAVAILABLE`), and capability matrix.

### `POST /api/platforms/:id/connect`
Connects credentials or enables platform connector.

### `POST /api/platforms/:id/disconnect`
Disconnects platform connector.

---

## 5. Profile & Preferences Endpoints

### `GET /api/profile`
Retrieves User Capability Profile, verified skills inventory, and difficulty weights.

### `PUT /api/profile`
Updates headline, bio, hourly rate, and daily availability.

### `PUT /api/profile/skills`
Updates verified skills list with proficiency levels.

### `PUT /api/profile/preferences`
Updates categories, exclusions, and difficulty weights.

### `GET /api/profile/learned`
Returns transparent AI learned patterns and insights.

---

## 6. Automation & Safety Endpoints

### `GET /api/automation`
Returns mode (`MANUAL`, `ASSISTED`, `AUTOMATIC`), safety limits, and kill switch status.

### `PUT /api/automation`
Updates safety bounds (max daily, max hourly, min score cutoff, connect cost cap, risk whitelist).

### `POST /api/automation/stop`
**EMERGENCY KILL SWITCH**: Immediately halts all automated applications and sets mode to `MANUAL`.

### `GET /api/automation/audit`
Returns chronological audit log of automation decisions.

---

## 7. Analytics & Reports Endpoints

### `GET /api/analytics`
Returns aggregate KPI metrics, platform breakdowns, and proposal conversion win rates.

### `GET /api/reports/statement?range=30d`
Generates a bank-statement style activity ledger for the specified date range.

### `GET /api/reports/statement/csv?range=30d`
Exports activity statement as a downloadable CSV spreadsheet.

---

## 8. One-Click Demo Mode

### `POST /api/demo/seed`
Initializes a full demonstration environment with realistic jobs, scores, risk flags, proposals, and pipeline tracking.
