# Test Plan — PlaceMate

| | |
|---|---|
| **Version** | 1.0 |
| **Related** | `PRD.md`, `SECURITY.md`, `TASKS.md` |

> Defines what **"working"** means. Every feature is done only when its checks here pass. Use this as the checklist during code review (guide Step 24) and before deployment (guide Step 27).

---

## 1. Test Levels & Commands

| Level | Tool | Where | Command |
|---|---|---|---|
| Unit (matcher, keyword extraction, utils) | Vitest | `server/tests/unit/` | `npm test` (in `server/`) |
| Integration (API + real test DB) | Vitest + supertest | `server/tests/integration/` | `npm run test:integration` |
| E2E (browser, full stack) | Playwright | `client/e2e/` | `npx playwright test` (in `client/`) |
| Static | TypeScript + ESLint | both apps | `npm run build`, `npm run lint` |

---

## 2. Authentication & Roles

- [ ] Signup with valid data → account created, role = STUDENT or RECRUITER
- [ ] Signup with existing email → 409, clear error shown in UI
- [ ] Signup with invalid email / short password → 400, field-level errors
- [ ] Signup attempting `role: ADMIN` via API → rejected (400) — admin only via seed
- [ ] Login valid → JWT returned, redirected to role-appropriate dashboard
- [ ] Login wrong password / unknown email → 401, generic "Invalid credentials" (no user enumeration)
- [ ] Logged-out user opening `/dashboard` → redirected to login
- [ ] Expired/invalid JWT on any protected API → 401
- [ ] Student calling `/api/admin/*` → 403
- [ ] Student calling `POST /api/jobs` → 403
- [ ] Recruiter calling `POST /api/applications` → 403
- [ ] After logout, token removed; protected pages unreachable via back button

## 3. Student Profile & Resume

- [ ] Update profile: CGPA must be 0–10, batch 2020–2035, branch from list → invalid values rejected with 400
- [ ] Upload valid PDF (< 5 MB) → parsed, stored on Cloudinary, skills extracted, success feedback
- [ ] Upload non-PDF (jpg, docx) → 400 "Only PDF files are allowed"
- [ ] Upload > 5 MB PDF → 400 "File too large"
- [ ] Upload corrupted/scanned (text-less) PDF → graceful 400 ("Could not read text from this PDF"), no crash
- [ ] Re-upload replaces previous resume (URL + text + timestamp updated, old file removed or orphaned intentionally)
- [ ] Resume section shows current filename + upload date after refresh

## 4. Matching Engine (unit tests — pure functions)

- [ ] Identical resume/JD skill sets → 100
- [ ] No overlap → 0
- [ ] Known fixture (5 shared of 10 union) → exactly 50.0
- [ ] Case-insensitive: "React" vs "react" matches
- [ ] Multi-word skills ("machine learning", "node.js") matched as units, not split
- [ ] Score is deterministic: same inputs → same output, 100 runs
- [ ] Job `requiredSkills` count even if absent from description text
- [ ] Skill dictionary lookup has no false-positive substring matches ("java" does not match "javascript")

## 5. Jobs

- [ ] Recruiter creates job with full JD → appears in lists immediately
- [ ] Job form validation: title, company, description, ≥1 required skill, minCgpa 0–10
- [ ] Student jobs list shows eligibility badge (Eligible / Not eligible — reason)
- [ ] Eligible student sees their personal match score on each job card
- [ ] Student without resume sees "Upload resume to see match score" CTA instead of a score
- [ ] Closed job → Apply disabled, API returns 400
- [ ] Recruiter only sees own jobs in "My Jobs"; admin sees all

## 6. Applications & Pipeline

- [ ] Eligible student applies → 201, status APPLIED, appears in "My applications"
- [ ] Ineligible student applies via UI → blocked with reason
- [ ] Ineligible student applies via direct API call → 403 (server-side, not just UI)
- [ ] Duplicate apply (same job) → 409 and friendly message
- [ ] Student sees only their own applications (`/api/applications/me`); requesting another student's ID → 403/404
- [ ] Recruiter sees applicants only for own jobs, sorted by matchScore desc
- [ ] Admin sees all applicants, filterable by minCgpa / batch / branch / jobId
- [ ] Valid transitions: Applied → Shortlisted → Interview → Offer → Accepted (by correct actor)
- [ ] Invalid transitions (e.g., Applied → Accepted directly) → 400
- [ ] Student can move OFFER_EXTENDED → ACCEPTED, but cannot move any other stage → 403
- [ ] Every status change writes an ApplicationStatusEvent; timeline shows actor + timestamp

## 7. Admin Export

- [ ] CSV download contains exactly the filtered rows (count matches UI count)
- [ ] CSV headers: Student, Email, CGPA, Batch, Branch, Job, Company, MatchScore, Status, AppliedAt
- [ ] Empty filter result → CSV with headers only (no crash)
- [ ] Values with commas/quotes (company "Acme, Inc.") are properly CSV-escaped

## 8. Security Checks (see SECURITY.md for full matrix)

- [ ] No secret/API key appears anywhere in `client/` bundle or git history
- [ ] SQL injection attempt in filters (e.g., `batch=2026;DROP`) → treated as invalid input, no error leakage
- [ ] Uploaded file never executed or served from our origin (Cloudinary serves it)
- [ ] Error responses never include stack traces or Prisma internals in production
- [ ] Rate limiting (basic) on `/api/auth/login` — rapid attempts throttled

## 9. Responsive & Accessibility

- [ ] 375px: sidebar becomes slide-over, tables stack into cards, no horizontal scroll
- [ ] 768px: layouts hold, no overlapping elements
- [ ] 1440px: content max-width respected, no stretched lines
- [ ] All forms: tab-navigable, labels present, errors announced
- [ ] Color contrast ≥ 4.5:1 for text; status conveyed by text + color

## 10. E2E Scenarios (Playwright — Phase 6)

```text
E2E-1  Signup → login → complete profile → upload resume → see match score on job
E2E-2  Apply to eligible job → status APPLIED in My Applications
E2E-3  Recruiter: post job → see applicant ranked by score → shortlist
E2E-4  Admin: filter (CGPA ≥ 7.5, Batch 2026, CSE) → export CSV → advance status
E2E-5  Student accepts an OFFER_EXTENDED application → status ACCEPTED
E2E-6  Guard rails: logged-out dashboard redirect, ineligible apply blocked, duplicate apply blocked
```

## 11. Pre-Deployment Regression (run every time)

- [ ] `npm run build` passes in `client/` and `server/`
- [ ] Lint + typecheck clean in both
- [ ] All server unit + integration tests green
- [ ] E2E suite green against the preview deployment
- [ ] Production QA checklist executed (guide §33) — live URL, not localhost
