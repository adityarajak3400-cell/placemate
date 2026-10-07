# Development Rules — PlaceMate

> The project's AI rulebook. Cursor rules in `.cursor/rules/` mirror this file for automatic enforcement. When anything conflicts, this file + `docs/DECISIONS.md` win.

## General

- Use TypeScript everywhere; `strict` mode; no `any` without a written justification.
- Reuse existing components, types, helpers before writing new ones — search first.
- Do not duplicate logic. One source of truth per concern.
- Keep functions small and single-purpose. Extract pure logic from I/O.
- **Do not modify unrelated files.** A task touches only what it needs.
- No new dependencies without asking (must fit `docs/ARCHITECTURE.md` §2).
- Read `docs/` before implementing — never code from assumptions.

## Before Coding

- Read the relevant project documentation (PRD → ARCHITECTURE → DESIGN → the task).
- Inspect existing implementation of anything related; extend it, don't fork it.
- For any change larger than ~50 lines, present a plan first and wait for approval.
- State the task ID you're working on at the start.

## After Coding (definition of done)

- Types pass, lint passes, build passes (`client/` and `server/`).
- Report: files changed, what was implemented, how it was verified, remaining issues.
- Update `docs/MEMORY.md` (status + session log) and `TASKS.md` (check the box).
- Leave the repo in a working state — never end a session with a broken build.

## UI (client/)

- Follow `docs/DESIGN.md` exactly: colors, radius, spacing, button variants, badges.
- Every screen: responsive (375/768/1440), loading state, empty state, error state.
- Forms: labels above inputs, zod validation shared with the API, inline error messages, disable submit while pending.
- One API client (`src/lib/api.ts`) — no scattered `fetch` calls.
- Client-side role guards are UX only — never treat them as security.

## Backend (server/)

- Layer rule: routes → controllers → services → Prisma. No shortcuts across layers.
- All DB access in `services/`; controllers never import Prisma.
- Validate every mutating request with zod middleware before the controller.
- Re-check auth **and** ownership server-side in every protected handler.
- Consistent responses: `{ data }` or `{ error: { message, details? } }` with correct HTTP codes.
- Never leak internals: no stack traces, no Prisma errors, no `passwordHash` in responses.

## Security

- Never expose secrets or keys in code, logs, or client bundles.
- Validate all input server-side (files included: type, size, count).
- Verify authorization server-side, per `docs/SECURITY.md` (role matrix + ownership rules).
- Follow the SECURITY.md checklist for the feature you touch.

## Testing

- Add unit tests for pure logic (matcher, keyword extraction, CSV escaping).
- Add integration tests for new API endpoints (happy path + auth failure + validation failure).
- Run the tests affected by your change before saying "done"; fix failures before continuing.
- Playwright E2E for user-facing flows (Phase 6).

## Git

- Small, scoped commits: one task = at least one commit.
- Conventional messages: `feat:`, `fix:`, `docs:`, `test:`, `chore:` + what + where.
- Never commit `.env` files, `node_modules`, or build output.
- Commit only after build/lint/tests for the touched area pass.
