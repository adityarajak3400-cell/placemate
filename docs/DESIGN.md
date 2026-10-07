# Design System — PlaceMate

| | |
|---|---|
| **Version** | 1.0 |
| **Related** | `PRD.md`, `ARCHITECTURE.md` |

> **DESIGN.md = HOW IT SHOULD LOOK AND FEEL.** Every UI task must follow this file. If a screen needs something this system doesn't define, extend this file first, then build.

---

## 1. Style

**Modern · Minimal · Professional.**

The audience is students, placement officers and recruiters — it must feel like a trustworthy institutional tool, not a flashy consumer app. Clean surfaces, generous whitespace, one accent color, data shown with clear hierarchy.

```text
DO                                    DON'T
─────────────────────────────         ─────────────────────────────
One primary accent (indigo)           Multiple competing accent colors
16px+ padding inside cards            Edge-to-edge text on cards
Consistent 12px radius                Mixed radii (4px here, 20px there)
Status conveyed by badge + color      Status conveyed by color alone
Skeleton/spinner for loading          Blank screen while loading
```

## 2. Typography

- Font: **Inter** (loaded via `next/font/google`), fallback system-ui.
- Scale (Tailwind classes):

| Use | Class | Weight |
|---|---|---|
| Page title | `text-2xl md:text-3xl` | `font-semibold` |
| Section title | `text-lg` | `font-semibold` |
| Body | `text-sm md:text-base` | `font-normal` |
| Muted/secondary | `text-sm text-slate-500` | `font-normal` |
| Label | `text-sm` | `font-medium` |
| Badge/mono numbers | `text-xs` / `tabular-nums` | `font-medium` |

## 3. Colors

Defined once as Tailwind theme tokens; never hardcode hex values in components.

| Token | Value | Used for |
|---|---|---|
| `primary` | `#6366F1` (indigo-500) | Primary buttons, links, active nav, focus rings |
| `primary-hover` | `#4F46E5` (indigo-600) | Hover state of primary |
| `background` | `#F8FAFC` (slate-50) | App background |
| `surface` | `#FFFFFF` | Cards, panels, modals |
| `border` | `#E2E8F0` (slate-200) | Card borders, dividers, input borders |
| `text` | `#0F172A` (slate-900) | Primary text |
| `muted` | `#64748B` (slate-500) | Secondary text, placeholders |

### Status colors (application pipeline + eligibility + match score)

| Meaning | Color | Classes |
|---|---|---|
| APPLIED | slate | `bg-slate-100 text-slate-700` |
| ATS_SHORTLISTED | violet | `bg-violet-100 text-violet-700` |
| INTERVIEW_SCHEDULED | amber | `bg-amber-100 text-amber-700` |
| OFFER_EXTENDED | emerald | `bg-emerald-100 text-emerald-700` |
| ACCEPTED | green | `bg-green-100 text-green-700` |
| REJECTED | red | `bg-red-100 text-red-700` |
| Success (toasts, matched) | green | `bg-green-100 text-green-700` |
| Error (form errors, failures) | red | `bg-red-50 text-red-600` |

### Match score thresholds

| Score | Color | Meaning |
|---|---|---|
| 75–100 | `text-green-600` + green bar | Strong match |
| 50–74 | `text-amber-600` + amber bar | Partial match |
| 0–49 | `text-slate-500` + slate bar | Weak match |

Displayed as `78%` with a thin 4px progress bar under it. `tabular-nums` so scores align in lists.

## 4. Components

### Buttons

| Variant | Classes | Use |
|---|---|---|
| Primary | `bg-indigo-500 hover:bg-indigo-600 text-white` | One per view: main action |
| Secondary | `border border-slate-200 bg-white hover:bg-slate-50 text-slate-900` | Alternative actions |
| Destructive | `bg-red-600 hover:bg-red-700 text-white` | Delete / reject (confirm first) |
| Ghost | `text-slate-600 hover:bg-slate-100` | Nav items, icon buttons |

All buttons: `rounded-lg px-4 py-2 text-sm font-medium`, `disabled:opacity-50 disabled:pointer-events-none`, visible focus ring (`focus-visible:ring-2 ring-indigo-500 ring-offset-2`). Icon + label buttons use lucide icons at `size={16}`.

### Cards / surfaces

`rounded-xl border border-slate-200 bg-white p-5` (radius 12px). Shadows are subtle to none — prefer borders.

### Inputs

Label above input (never placeholder-as-label). Input: `rounded-lg border border-slate-200 px-3 py-2 text-sm w-full`, error state `border-red-500` + `text-sm text-red-600` message below. Required fields marked with `*`.

### Badges

`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium` + status color classes from §3.

### App shell (authenticated area)

- **Desktop (≥ 1024px):** left sidebar (240px): logo, role-specific nav, user menu at bottom.
- **Mobile (< 1024px):** top bar with logo + hamburger → slide-over menu. Never a horizontal-scrolling navbar.
- Content area: `max-w-6xl mx-auto p-4 md:p-8` on `bg-slate-50`.

### Auth pages (login/signup)

Centered card (`max-w-md mx-auto mt-16`), logo on top, one primary button, link to switch between login/signup.

## 5. UX Requirements (non-negotiable per screen)

- [ ] **Mobile responsive** — verified at 375px, 768px, 1440px
- [ ] **Loading state** — skeleton rows for lists, spinner inside buttons during submit (disable while pending)
- [ ] **Empty state** — icon + one sentence + one action ("No applications yet. Browse jobs →")
- [ ] **Error state** — inline form errors from server, page-level error card with retry for failed fetches
- [ ] **Success feedback** — toast or inline confirmation after mutations (apply, save, upload, export)
- [ ] **Accessible forms** — every input has a label, errors linked via `aria-describedby`, focus moves to first error on submit failure
- [ ] **Keyboard navigable** — every action reachable without a mouse; visible focus states

## 6. Layout Patterns per Screen

| Screen | Pattern |
|---|---|
| Jobs list (student) | Cards in 1-col (mobile) / 2-col (desktop); each card: title, company, eligibility badge, match score bar, deadline, Apply button |
| Job detail | Two-column on desktop: JD left, metadata + apply box right; single column mobile |
| Resume upload | Drop zone card + uploaded-resume card (filename, updated date, Replace button) |
| My Applications | Table on desktop / stacked cards on mobile; status badge + timeline link |
| Applicants (recruiter/admin) | Table: student, CGPA, batch, branch, match score, status; sortable by score; filter bar above |
| Admin export | Filter bar + "Export CSV" button + live count ("128 applicants match these filters") |
| Status timeline | Vertical timeline: dot + status badge + actor + timestamp |

## 7. Motion

Minimal. Transitions `150ms ease` on hover/focus only. No decorative animation. Spinners: lucide `Loader2` with `animate-spin`.
