# Architecture Decision Records — PlaceMate

> **DECISIONS.md = permanent decisions.** Changes only by adding a new ADR that explicitly supersedes an old one. This stops the AI (and humans) from silently re-litigating settled architecture.

Format: **Decision · Reason · Alternatives rejected · Consequences**

---

## ADR-001 — Separate Express API instead of unified Next.js

- **Decision:** The backend is a standalone Express + TypeScript REST API (`server/`); Next.js only renders UI and calls the API.
- **Reason:** Matches the blueprint's intent (RESTful API architecture, Multer middleware). Demonstrates full-stack breadth — REST design, middleware pipeline, separate deploy — which is exactly what the target full-stack roles screen for.
- **Alternatives rejected:** Next.js Route Handlers (simpler, one deploy — but reduces the resume signal and deviates from the blueprint).
- **Consequences:** Two deployments (Vercel + Render), CORS must be configured, env vars exist in two places. Accepted deliberately.

## ADR-002 — PostgreSQL via Supabase (hosted) instead of local Docker Postgres

- **Decision:** Use a Supabase-hosted PostgreSQL database from day one, connected via Prisma.
- **Reason:** Zero local infrastructure to manage; free tier is sufficient; the same connection string works in production (Render), so no dev/prod engine drift. Supabase also leaves the door open for Storage/Realtime in later projects.
- **Alternatives rejected:** Docker Postgres locally (best isolation, but extra setup for a beginner and easy to abandon); Neon (equivalent option — Supabase chosen for console familiarity).
- **Consequences:** Requires internet for development; the free tier can pause after inactivity (first request may be slow — acceptable).

## ADR-003 — Cloudinary for resume storage instead of AWS S3

- **Decision:** Resume PDFs are stored on Cloudinary (free tier), uploaded from the API via `upload_stream`.
- **Reason:** One API key instead of IAM roles/buckets/policies; generous free tier; direct CDN URLs; simple Node SDK (`cloudinary`).
- **Alternatives rejected:** AWS S3 (the blueprint's first option — but IAM setup is a large beginner time-sink and a common source of leaked credentials); Supabase Storage (fine, but resume PDFs benefit from Cloudinary's document handling and transformation URLs).
- **Consequences:** Vendor dependency; resume URLs are public-but-unguessable (random public ID). If privacy hardens later, switch to signed URLs (note for v2).

## ADR-004 — JWT (bearer, localStorage) + bcrypt instead of sessions / Supabase Auth / cookies

- **Decision:** The API issues a 7-day JWT (payload `{ userId, role }`); the client stores it in localStorage and sends `Authorization: Bearer`. Passwords hashed with bcrypt.
- **Reason:** With a separate API origin, bearer tokens avoid cross-site cookie complexity (SameSite/CORS credentials); simple to debug with Postman; the auth flow is implemented by us (stronger learning + resume signal than delegating to Supabase Auth).
- **Alternatives rejected:** Supabase Auth (fast, but hides the interesting part inside a vendor); httpOnly cookie via a Next.js rewrite proxy (arguably more secure — rejected for now because it obscures how auth works for a first project); sessions in DB (extra table, no benefit for a stateless API).
- **Consequences:** localStorage is readable by XSS — mitigated by strict no-third-party-script policy and React's default escaping (see SECURITY.md §9). Upgrade path recorded: refresh-token rotation or httpOnly cookies in v2.

## ADR-005 — Keyword + Jaccard similarity matching instead of AI/embeddings

- **Decision:** Match score = Jaccard similarity between skill/keyword sets extracted from resume text and JD text, using a curated skill dictionary (~120 entries, `server/src/lib/skills.ts`).
- **Reason:** Deterministic (same input → same score, testable), zero API cost, no external AI dependency, works offline, and the algorithm is explainable in an interview.
- **Alternatives rejected:** Gemini/OpenAI embeddings (better semantics, but adds cost, latency, a key to protect, and non-determinism — flagged as the v2 upgrade to demonstrate AI integration).
- **Consequences:** Scores are lexical, not semantic ("ReactJS" vs "React" must be normalized in the dictionary). The matcher is a pure function → heavily unit-tested (TASK-034).

## ADR-006 — Two standalone apps (`client/`, `server/`) instead of an npm-workspaces monorepo

- **Decision:** Each app owns its own `package.json`, dependencies and env files. Repo root holds docs and config only.
- **Reason:** Simplest mental model; deploys map 1:1 to Vercel/Render; no hoisting/workspace resolution issues for a beginner.
- **Alternatives rejected:** npm/pnpm workspaces, Turborepo (useful at scale, pure overhead for 2 apps).
- **Consequences:** A few duplicated dev dependencies; shared types are copied between `client/src/types/api.ts` and server contracts (acceptable at this size; revisit with a `shared/` package if drift becomes real).

## ADR-007 — TypeScript on both ends

- **Decision:** Strict TypeScript for client and server.
- **Reason:** Guide's stack rule ("Use TypeScript"); catches API contract mistakes at compile time; `strict: true` in both tsconfigs.
- **Consequences:** Slightly slower to write; no `any` without justification.

## ADR-008 — Admin is seeded; signup is student/recruiter only (recruiters unverified in v1)

- **Decision:** `prisma db seed` creates one ADMIN account from `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`. Recruiters self-register and can post jobs immediately; v1 has no admin approval step.
- **Reason:** Keeps RBAC honest (admin impossible via public API) while avoiding a whole approval-workflow feature in the MVP.
- **Alternatives rejected:** Admin approval queue for recruiters (real-world correct, explicitly deferred — see PRD §7); invite codes (extra infra).
- **Consequences:** A malicious recruiter can post a job in v1 (acceptable: internal academic tool, data reviewed by TPC). v2: verification flag on recruiter accounts.

## ADR-009 — Testing stack: Vitest + supertest (API), Playwright (E2E)

- **Decision:** Vitest for unit/integration (fast, TS-native), supertest for HTTP-level API tests, Playwright for browser E2E in `client/e2e/`.
- **Reason:** Guide recommends Playwright; Vitest keeps one tool for all server tests; pure-function matcher makes unit tests trivial.
- **Alternatives rejected:** Jest (slower TS setup); Cypress (heavier, Playwright is the guide's pick).
- **Consequences:** Two test runners in the repo; CI wiring deferred until after first deployment (Phase 7+).
