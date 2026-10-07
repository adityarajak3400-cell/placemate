# Product Requirements Document — PlaceMate

| | |
|---|---|
| **Product** | PlaceMate — Campus Placement & Referral Portal with Auto-Resume Matcher |
| **Version** | 1.0 |
| **Date** | October 2026 |
| **Status** | Approved for MVP development |
| **Source** | `../../vibe-code/TOP_5_FRESHER_PROJECTS_2026.md` → Project 1 |

---

## 1. Problem

Campus placements are managed with scattered spreadsheets, shared drives and chat groups:

- **Students** miss opportunities, don't know if their resume matches a job, and can't track where their application stands.
- **TPC (Training & Placement Cell) admins** manually screen hundreds of applicants, apply eligibility rules by hand, and export lists from messy spreadsheets.
- **Recruiters/Alumni** receive unfiltered application dumps instead of candidate lists ranked by relevance.

## 2. Target Users

| Role | Who they are | Primary need |
|---|---|---|
| **Student** | Final-year BCA / BSc CS / BTech students (Batch 2026/2027) | Find eligible jobs, know their match score, apply, track status |
| **TPC Admin** | Training & Placement Cell staff | Manage jobs & applicants, filter by eligibility, export reports |
| **Recruiter / Alumni** | Company recruiters and institute alumni | Post jobs with a JD and see applicants ranked by resume match |

## 3. Goal

A single placement portal where every job application is automatically scored against the student's resume, the eligibility rules are enforced by the system instead of spreadsheets, and the TPC cell gets one-click filtered reports.

## 4. Core Features

1. **Multi-role authentication & access control** — Students, TPC Admins, Recruiters with granular permissions (RBAC).
2. **PDF resume parser & ATS matching engine** — Upload a PDF resume; the system parses the text, extracts skills/keywords, and computes a % match against each job description (Jaccard similarity).
3. **Application lifecycle pipeline** — `Applied → ATS Shortlisted → Interview Scheduled → Offer Extended → Accepted` with a visible status timeline.
4. **TPC Admin portal** — Eligibility filtering (min CGPA, batch, branch), ranked applicant lists, one-click CSV export.

## 5. MVP Scope (what ships in v1)

### 5.1 Student

- [ ] Signup / login (email + password)
- [ ] Complete academic profile (name, CGPA, batch, branch, skills)
- [ ] Upload PDF resume (max 5 MB) — parsed and stored
- [ ] Browse jobs with eligibility indicator and personal **match score**
- [ ] Apply to a job (blocked if not eligible or already applied)
- [ ] View "My Applications" with current pipeline status

### 5.2 Recruiter / Alumni

- [ ] Signup / login with recruiter role
- [ ] Post a job (title, company, description/JD, required skills, eligibility: min CGPA, batches, branches)
- [ ] View applicants for own jobs, **ranked by match score**
- [ ] Move applicants through pipeline stages

### 5.3 TPC Admin

- [ ] Login as admin (seeded account in v1)
- [ ] View all jobs and all applications across the platform
- [ ] Filter applicants by min CGPA, batch and branch
- [ ] Update application status (full pipeline control)
- [ ] Export the currently filtered applicant list as CSV

## 6. Application Lifecycle (state machine)

```text
APPLIED ──▶ ATS_SHORTLISTED ──▶ INTERVIEW_SCHEDULED ──▶ OFFER_EXTENDED ──▶ ACCEPTED
   │                │                    │                    │
   └────────────────┴────────────────────┴────────────────────┴──▶ REJECTED (from any stage)
```

- Only Recruiter/Admin can advance or reject an application.
- Only the Student can move `OFFER_EXTENDED → ACCEPTED`.
- Every status change is recorded in a status history event (shown as a timeline).

## 7. Out of Scope (v1)

Deliberately excluded to prevent scope creep — candidates for v2+:

- Email notifications (application updates, interview invites)
- Interview scheduling with calendar integration
- Alumni "referral request" workflow (referral tracking, referral codes)
- AI/embedding-based matching (v1 uses deterministic keyword + Jaccard)
- Multi-college / multi-tenant support
- Mobile app
- Payments, chat, social feed
- Admin UI for user management (v1 uses seeded admin account)

## 8. Success Criteria

A person can complete each flow end-to-end on the deployed app:

**Student:** create account → login → complete profile → upload PDF resume → see match score on a job → apply → see status change to ATS Shortlisted.

**Recruiter:** login → post job with JD → see applicants ranked by match score → shortlist one.

**TPC Admin:** login → filter applicants by CGPA ≥ 7.5 + Batch 2026 + CS → export CSV → move an applicant to Interview Scheduled.

Plus:

- Match scores are reproducible (same resume + same JD = same score).
- Ineligible students cannot apply to a job even by calling the API directly.
- A student can never see another student's applications.
- All three roles see different navigation/permissions for the same app.

## 9. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Responsive | Usable at 375px (mobile), 768px (tablet), 1440px (desktop) |
| Performance | Resume parse + match score computed in < 3s for a ≤ 5 MB PDF |
| Security | See `SECURITY.md` — server-side authz on every request |
| Accessibility | Labeled form fields, keyboard navigable, visible focus states |
| File limits | PDF only, max 5 MB, single resume per student (re-upload replaces) |

## 10. Open Questions (resolve before the related task)

1. Seed admin account credentials convention → decided in TASK-001 (add to `.env.example` as `SEED_ADMIN_EMAIL`).
2. Skill dictionary size for matcher v1 → start with ~120 common tech skills (`server/src/lib/skills.ts`), expand later.
3. Whether recruiters must be verified by admin before posting → v1: no (trust-based), noted in DECISIONS.md.
