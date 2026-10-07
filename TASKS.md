# Tasks — PlaceMate

> **Never ask the AI to build the whole app in one prompt.** One task at a time, in order. Definition of done per task: build passes, lint passes, tests for the touched area pass, docs updated (MEMORY.md + checkbox here).

**Legend:** `[x]` done · `[ ]` to do · 🚫 blocked

---

## Phase 0 — Setup (complete)

- [x] **TASK-000** Documentation set (`docs/`), repo layout (`client/` + `server/`), Next.js + Express scaffolds

## Phase 1 — Foundation

- [ ] **TASK-001** Git & GitHub — install Git (manual, blocked 🚫 until installed), `git init` in `project/`, verify `.gitignore` covers both apps, first commit (docs + scaffolds), create GitHub repo `placemate`, push
- [ ] **TASK-002** Supabase project — create project, copy connection string to `server/.env` (`DATABASE_URL`), create `client/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000`
- [ ] **TASK-003** Prisma wiring — scaffold done in Phase 0 (`prisma.config.ts`, `@prisma/adapter-pg`, client generated, `/api/health` verified 200 via tsx smoke test). Remaining: fill `DATABASE_URL` in `server/.env` (TASK-002), then run the first migration (`prisma migrate dev --name init-users`) in TASK-011

## Phase 2 — Auth & Roles

- [ ] **TASK-011** Schema: `User` + `Role` enum → first migration (`prisma migrate dev --name init-users`)
- [ ] **TASK-012** `POST /api/auth/signup` — zod validation, bcrypt hash, 409 on duplicate, role limited to STUDENT/RECRUITER
- [ ] **TASK-013** `POST /api/auth/login` → JWT (7d); `GET /api/auth/me`
- [ ] **TASK-014** `auth` middleware + `requireRole` guard; protect a demo route; 401/403 shape verified
- [ ] **TASK-015** Client: signup page (role picker, validation, loading/error states, DESIGN.md)
- [ ] **TASK-016** Client: login page
- [ ] **TASK-017** Client: `lib/api.ts` single API client + auth context (token persistence, 401 → logout) + protected dashboard shell with role-aware sidebar
- [ ] **TASK-018** Integration tests: auth happy paths + failures (TEST_PLAN §2)
  - _Gate: full signup → login → dashboard flow works in the browser before Phase 3._

## Phase 3 — Student Profile & Resume

- [ ] **TASK-021** Schema: `StudentProfile` + migration (cgpa, batch, branch, skills, resumeUrl, resumeText)
- [ ] **TASK-022** `GET/PUT /api/profile/me` — zod bounds (CGPA 0–10, batch 2020–2035, branch allow-list, skills array)
- [ ] **TASK-023** Client: profile page + form (React Hook Form + zod, success feedback)
- [ ] **TASK-024** `POST /api/profile/resume` — Multer memory (5 MB, 1 file), PDF-only check, `pdf-parse` text extraction, graceful corrupt-PDF error
- [ ] **TASK-025** `lib/skills.ts` skill dictionary (~120) + pure keyword extraction + unit tests
- [ ] **TASK-026** Cloudinary upload (`upload_stream`, `resumes/<userId>-<ts>`) → save `resumeUrl`; Client: upload UI + extracted-skills preview
  - _Gate: TEST_PLAN §3 (resume) + §4 (matching units) pass before Phase 4._

## Phase 4 — Jobs & Matching Engine

- [ ] **TASK-031** Schema: `Job` + `JobStatus` + indexes + migration
- [ ] **TASK-032** `POST /api/jobs` (recruiter/admin), `GET /api/jobs`, `GET /api/jobs/:id`, `PATCH /api/jobs/:id` (close)
- [ ] **TASK-033** `lib/matcher.ts` — Jaccard similarity, pure function + unit tests (TEST_PLAN §4 fixtures: 100 / 0 / 50 exact)
- [ ] **TASK-034** `GET /api/jobs` enriched for students: eligibility verdict + reason + personal `matchScore` (or "upload resume" flag)
- [ ] **TASK-035** Client: jobs list — cards with eligibility badge, score bar (DESIGN §3 thresholds)
- [ ] **TASK-036** Client: job detail page + recruiter "Post Job" form + "My Jobs" list

## Phase 5 — Applications Pipeline

- [ ] **TASK-041** Schema: `Application` + `AppStatus` + `ApplicationStatusEvent`, `@@unique([jobId, studentId])`, indexes + migration
- [ ] **TASK-042** `POST /api/applications` — server-side eligibility, duplicate → 409, score snapshot at apply time, initial status event
- [ ] **TASK-043** `GET /api/applications/me` + Client: "My Applications" (status badges, timeline view, empty state)
- [ ] **TASK-044** `GET /api/jobs/:id/applicants` (owner/admin, sorted by score) + `PATCH /api/applications/:id/status` with transition table (TEST_PLAN §6), events written
- [ ] **TASK-045** Client: applicants table (recruiter/admin) with status controls + student "Accept Offer" action (OFFER_EXTENDED → ACCEPTED only)
  - _Gate: E2E-1, E2E-2, E2E-3, E2E-6 pass manually before Phase 6._

## Phase 6 — TPC Admin Portal

- [ ] **TASK-051** `GET /api/admin/applications` — filters `minCgpa`, `batch`, `branch`, `jobId` (zod-validated) + total count
- [ ] **TASK-052** `GET /api/admin/applications/export` — CSV from the **same** filter service, proper escaping
- [ ] **TASK-053** Client: admin dashboard — filter bar, live count, table, "Export CSV" button
- [ ] **TASK-054** Seed script (`prisma db seed`): admin from env + demo recruiter + demo student + 3 sample jobs with real JDs

## Phase 7 — Testing & Hardening

- [ ] **TASK-061** Vitest + supertest setup for integration tests against a test database
- [ ] **TASK-062** Playwright setup in `client/e2e/` + scenarios E2E-1 … E2E-6 (TEST_PLAN §10)
- [ ] **TASK-063** Security pass — run SECURITY.md §10 checklist; add helmet, rate limiting, CORS tightening
- [ ] **TASK-064** Responsive + accessibility pass at 375 / 768 / 1440 (TEST_PLAN §9)

## Phase 8 — Deployment

- [ ] **TASK-071** Deploy `server/` to Render — env vars, `prisma migrate deploy` on release, health check green
- [ ] **TASK-072** Deploy `client/` to Vercel — `NEXT_PUBLIC_API_URL` → Render URL, update `CLIENT_ORIGIN`
- [ ] **TASK-073** Production QA on the live URLs (guide §33 checklist); fix findings via structured debug prompts
- [ ] **TASK-074** README polish: Mermaid architecture diagram, screenshots, demo credentials, resume bullets with metrics

---

## How to Start a Task (the structured prompt)

```text
CONTEXT
We are building PlaceMate (see docs/PRD.md, docs/ARCHITECTURE.md, RULES.md).
Current state: docs/MEMORY.md.

TASK
TASK-0XX: <title from this file>

FILES
<point at the folders/files this task touches, per ARCHITECTURE.md §4>

CONSTRAINTS
- Follow ARCHITECTURE.md layer rules and DECISIONS.md ADRs.
- Follow DESIGN.md for any UI.
- Do not modify unrelated files. No new dependencies.

ACCEPTANCE CRITERIA
<copy the relevant checks from docs/TEST_PLAN.md>

TESTING
Run lint + typecheck + relevant tests. Report files changed, verification, remaining issues.
```
