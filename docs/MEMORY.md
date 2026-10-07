# Project Memory — PlaceMate

> **MEMORY.md = the current state of the project.** Update this file at the end of every working session and whenever a task completes. AI tools read this first to know "where we are". Permanent decisions live in `DECISIONS.md` — never here.

---

## Current Status

**Phase 0 — Setup complete.** Documentation set finalized; `client/` (Next.js) and `server/` (Express) scaffolds created and verified. The server boots with Prisma 7 + `@prisma/adapter-pg`; `GET /api/health` returns HTTP 200 `{ data: { status: "ok", service: "placemate-api" } }` (verified via a tsx smoke test; the temp file was deleted after). Client deps installed (lucide-react, react-hook-form, @hookform/resolvers, zod). Root files written (`README.md`, `.env.example`, `.gitignore`). No business logic implemented yet.

## Completed

- [x] Product definition, PRD, ARCHITECTURE, DESIGN, TEST_PLAN, SECURITY, DECISIONS (all docs in `docs/`)
- [x] Repo layout: `client/` + `server/` + `docs/` + `.cursor/rules/` + root `README.md`/`TASKS.md`/`RULES.md`/`.env.example`/`.gitignore`
- [x] Next.js scaffold (`client/`) — TypeScript, Tailwind v4, App Router, src dir, Inter font, PlaceMate metadata + design tokens
- [x] Express scaffold (`server/`) — ESM + NodeNext, health endpoint, central error handler, env template
- [x] Prisma 7 wiring (verified): `prisma.config.ts` holds the datasource URL; generator `prisma-client` outputs to `src/generated/prisma/` (git-ignored); runtime uses `PrismaPg` adapter; `tsc --noEmit` clean
- [x] Build contract locked in docs: API surface, data model, matching algorithm, RBAC matrix

## Current Task

**TASK-001 — Git & GitHub setup** (see `TASKS.md` Phase 1) — blocked on installing Git on the machine.

## Known Issues / Blockers

- **Git is not installed** on this machine (verified: not in `C:\Program Files\Git` or user-local programs). Must be installed before TASK-001. Everything else is unaffected.
- Node.js is installed at `C:\Program Files\nodejs` but was not on this session's PATH — verify `node --version` works in your own terminal.
- **Prisma 7 breaking changes apply**: connection URL must live in `prisma.config.ts` (schema `url` is rejected); the runtime requires a driver adapter (`new PrismaClient({ adapter })`); the server is ESM and source imports use `.ts` extensions. Regenerate the client (`npx prisma generate`) after any schema edit — `src/generated/` is git-ignored.
- No Supabase project created yet (needed for TASK-002/003) — `DATABASE_URL` is still empty.
- No Cloudinary account created yet (needed for TASK-025).
- No `.env` values set — server falls back to defaults where possible.

## Next Step (in order)

1. Install Git (git-scm.com/download/win), verify `git --version` in a new terminal
2. TASK-001: `git init` in `project/`, first commit, push to GitHub
3. TASK-002: create Supabase project → copy connection string to `server/.env` (`DATABASE_URL`)
4. TASK-003: confirm `npm run dev` + `GET /api/health` with a real DB configured, then Phase 2 (TASK-011 first migration)

## Session Log

| Date | What happened |
|---|---|
| 2026-10-07 | Workspace created. Vibe-coding reference library set up in `../vibe-code/`. PlaceMate docs written. Scaffolds generated. Git install identified as next manual step. |
| 2026-10-07 | Phase 0 closed out: client extras installed (lucide/RHF/zod); server adapted to Prisma 7 (prisma.config.ts + PrismaPg adapter + generated client) and verified end-to-end (tsc clean, smoke test HTTP 200); root README/.env.example/.gitignore written; docs synced to scaffold reality; temp files cleaned. |
