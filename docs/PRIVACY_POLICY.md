# WorkMatch AI — Privacy Policy

**Effective Date: October 2026**

At **WorkMatch AI**, protecting your privacy and securing your freelance workflow data is our foundational commitment. This Privacy Policy outlines our principles regarding the collection, use, protection, and retention of your personal data.

---

## 1. Information We Collect
1. **Account Credentials:** When you register, we collect your email address, full name, and a securely salted and hashed representation of your password (using `scrypt`). We never store plaintext passwords.
2. **Capability Inventory & Profile:** To score opportunities and verify proposals, we store your declared skills, experience levels, portfolio descriptions, and hourly rate expectations.
3. **Application & Opportunity History:** Jobs you bookmark, ignore, or draft proposals for, along with pipeline states (Kanban stages) and proposal versions.
4. **Usage Analytics:** Telemetry regarding feature usage, token counts, and performance metrics to ensure service reliability.

---

## 2. How We Use Your Information
- To deliver transparent, personalized fit scores across freelance marketplace opportunities;
- To verify factual claims in generated proposal drafts and protect you against hallucinations;
- To track pipeline analytics (win rates, interview conversions, earnings);
- To securely authenticate your sessions via HttpOnly SameSite cookies or Bearer tokens;
- To process subscription billing via Stripe / LemonSqueezy.

---

## 3. Zero Sale of Personal Data
**We do not sell, rent, or trade your personal information to third parties or data brokers under any circumstances.** Your profile data and proposals are never monetized for commercial advertising.

---

## 4. Third-Party AI Services & Zero-Training Guarantees
WorkMatch AI integrates with enterprise AI APIs (such as Google Gemini and OpenAI):
- Data transmitted to enterprise AI gateways is processed strictly for ephemeral inference to generate proposal drafts and parse job specifications.
- **Your private profiles, client notes, and proposals are NOT used to train foundation models.**
- Sensitive user credentials (passwords, payment details) are never sent to AI providers.

---

## 5. Security & Data Protection
- **Encryption in Transit & at Rest:** All API communications are secured via TLS 1.3 / HTTPS. Session cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` attributes in production.
- **Rate-Limiting & Anti-Brute-Force:** High-risk endpoints (login, password reset) employ sliding-window rate limiters to prevent credential stuffing.
- **Audit Logging:** Administrative and automated submission events are written to an immutable audit ledger.

---

## 6. User Rights (GDPR & CCPA Compliance)
You maintain total sovereignty over your data:
- **Right to Access & Export:** You may export a complete, chronological snapshot of your user data, profile, and applications at any time (`GET /api/backup/export` or `/api/reports/statement/csv`).
- **Right to Rectification:** You can update or correct your profile inventory at any time from your settings.
- **Right to Erasure ("Right to be Forgotten"):** You can request complete deletion of your account and all associated records by contacting `privacy@workmatch.ai` or through Account Settings.

---

## 7. Contact Us
For any privacy inquiries or to exercise your GDPR/CCPA rights, reach out to our Data Protection Officer at `privacy@workmatch.ai`.
