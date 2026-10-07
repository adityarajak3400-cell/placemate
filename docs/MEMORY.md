# Project Memory — PlaceMate

> **MEMORY.md = the current state of the project.** Update this file at the end of every working session and whenever a task completes. AI tools read this first to know "where we are". Permanent decisions live in `DECISIONS.md` — never here.

---

## Current Status

**Phase 0 — Setup complete.** Documentation set finalized; `client/` (Next.js) and `server/` (Express) scaffolds created and verified. The server boots with Prisma 7 + `@prisma/adapter-pg`; `GET /api/health` returns HTTP 200 `{ data: { status: "ok", service: "placemate-api" } }` (verified via a tsx smoke test; the temp file was deleted after). Client deps installed (lucide-react, react-hook-form, @hookform/resolvers, zod). Root files written (`README.md`, `.env.example`, `.gitignore`). No business logic implemented yet.

**Phase 1 in progress** — Git 2.55.0 installed (winget); repo on `main`, first commit `c86c097` (43 files) **pushed to GitHub** → `origin` = https://github.com/adityarajak3400-cell/placemate (public). TASK-001 complete. Both dev servers verified live (API :5000, web :3000), running detached; previews in the Qoder panel.

## Completed

- [x] Product definition, PRD, ARCHITECTURE, DESIGN, TEST_PLAN, SECURITY, DECISIONS (all docs in `docs/`)
- [x] Repo layout: `client/` + `server/` + `docs/` + `.cursor/rules/` + root `README.md`/`TASKS.md`/`RULES.md`/`.env.example`/`.gitignore`
- [x] Next.js scaffold (`client/`) — TypeScript, Tailwind v4, App Router, src dir, Inter font, PlaceMate metadata + design tokens
- [x] Express scaffold (`server/`) — ESM + NodeNext, health endpoint, central error handler, env template
- [x] Prisma 7 wiring (verified): `prisma.config.ts` holds the datasource URL; generator `prisma-client` outputs to `src/generated/prisma/` (git-ignored); runtime uses `PrismaPg` adapter; `tsc --noEmit` clean
- [x] Build contract locked in docs: API surface, data model, matching algorithm, RBAC matrix

## Current Task

**TASK-001 — Git & GitHub: DONE** (pushed 2026-10-07). **Next: TASK-002 Supabase** — create the project, provide the connection string; then TASK-003/011 (verify DB + first migration).

## Known Issues / Blockers

- GitHub remote live: `origin` → https://github.com/adityarajak3400-cell/placemate (public). The account username is **`adityarajak3400-cell`** — do NOT confuse with the email handle `adityarajak3400` (that username does not exist).
- Node.js is installed at `C:\Program Files\nodejs` but was not on this session's PATH — verify `node --version` works in your own terminal.
- **Prisma 7 breaking changes apply**: connection URL must live in `prisma.config.ts` (schema `url` is rejected); the runtime requires a driver adapter (`new PrismaClient({ adapter })`); the server is ESM and source imports use `.ts` extensions. Regenerate the client (`npx prisma generate`) after any schema edit — `src/generated/` is git-ignored.
- No Supabase project created yet (needed for TASK-002/003) — `server/.env` still holds the localhost placeholder for `DATABASE_URL`.
- No Cloudinary account created yet (needed for TASK-025).
- `server/.env` dev values: real 48-char `JWT_SECRET` generated (2026-10-07); `DATABASE_URL` pending Supabase.

## Next Step (in order)

1. TASK-002: create Supabase project → copy connection string to `server/.env` (`DATABASE_URL`)
2. TASK-003/Phase 2: verify the DB connection, then TASK-011 first migration (`prisma migrate dev --name init-users`)
3. (Optional, user's choice) Make the git identity permanent: `git config --global user.name "aditya"` + `git config --global user.email "adityarajak3400@gmail.com"`

## Session Log

| Date | What happened |
|---|---|
| 2026-10-07 | Workspace created. Vibe-coding reference library set up in `../vibe-code/`. PlaceMate docs written. Scaffolds generated. Git install identified as next manual step. |
| 2026-10-07 | Phase 0 closed out: client extras installed (lucide/RHF/zod); server adapted to Prisma 7 (prisma.config.ts + PrismaPg adapter + generated client) and verified end-to-end (tsc clean, smoke test HTTP 200); root README/.env.example/.gitignore written; docs synced to scaffold reality; temp files cleaned. |
| 2026-10-07 | Phase 1 started: Git 2.55.0 installed via winget; `project/` git-initialized on `main`, first commit `c86c097` (43 files); real `JWT_SECRET` written to `server/.env`; both dev servers verified live (API :5000, web :3000) running detached. GitHub push + Supabase signup remain (need user's accounts). |
| 2026-10-07 | **TASK-001 COMPLETE** — actual GitHub account is `adityarajak3400-cell` (the email handle `adityarajak3400` does not exist as a user); remote `origin` set, first push succeeded — `main` tracking `origin/main` at github.com/adityarajak3400-cell/placemate (public, 43 files). |
