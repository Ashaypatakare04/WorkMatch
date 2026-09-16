# Deployment & Operations Guide

This guide describes how to run, test, and deploy **WorkMatch AI**.

---

## 1. Prerequisites

- **Node.js**: v20.0+ (Node 22 LTS recommended)
- **npm**: v10.0+
- **OS**: Windows, macOS, or Linux

---

## 2. Quick Local Setup

1. **Clone or open repository**:
   ```bash
   cd WorkMatch
   ```

2. **Install all dependencies**:
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Initialize Database Migrations**:
   ```bash
   npm run migrate --prefix backend
   ```

4. **Run Backend API Server**:
   ```bash
   npm run dev --prefix backend
   # Server runs at http://localhost:4000
   ```

5. **Run Frontend Dev Server**:
   ```bash
   npm run dev --prefix frontend
   # UI opens at http://localhost:5173
   ```

6. **One-Click Demo Setup**:
   Open `http://localhost:5173` and click **"Load 1-Click Demo Dataset"** to populate 30 realistic jobs across Upwork, Fiverr, and Freelancer, along with calculated match scores, risk flags, proposals, and pipeline tracking.

---

## 3. Running Automated Tests

Run the complete test suite:
```bash
npm test --prefix backend
```

Test coverage includes:
- Deduplication hashing and job normalization
- Difficulty calculation with personalized criteria weights
- Multi-dimensional transparent scoring and exclusion checks
- Risk & off-platform fraud signal detection
- Strict proposal claim verification & sanitization
- Automation safety limits & emergency kill-switch
- Multi-user data isolation

---

## 4. Production Build

Build both backend and frontend:
```bash
npm run build --prefix backend
npm run build --prefix frontend
```

Static frontend assets will be compiled into `/frontend/dist`. The backend can serve these assets directly or through an Nginx reverse proxy.

---

## 5. Environment Variables (`.env`)

```env
PORT=4000
NODE_ENV=production
DATABASE_PATH=./data/workmatch.sqlite
JWT_SECRET=your-production-jwt-secret-key-32-chars
ENCRYPTION_SECRET=your-aes256-encryption-secret-key!
AI_PROVIDER=mock # Options: 'mock', 'gemini', 'openai'
GEMINI_API_KEY=optional_gemini_api_key
UPWORK_CLIENT_ID=optional_upwork_oauth_client_id
UPWORK_CLIENT_SECRET=optional_upwork_oauth_client_secret
```
