
---

# Updated `DEVLOG.md`

```md
# DEVLOG

## Day 1 — Foundation & Environment Setup

### What I Implemented

- Initialized Next.js 16 project
- Added TypeScript and Tailwind CSS v4
- Configured shadcn/ui
- Added Zustand setup
- Added Supabase scaffolding
- Added Vitest setup and smoke tests
- Created initial folder architecture

### Problems Faced

- npm ECONNRESET installation issues
- Next.js 16 async route behavior differences

### What I Learned

- Tailwind v4 integration is more incremental than older versions
- Newer Next.js versions require careful hydration handling

### Verification

- npm run dev passed
- npm test passed
- npm run build passed

---

## Day 2 — Pricing Dataset & Vendor Modeling

### What I Implemented

- Pricing dataset structure
- Vendor metadata system
- Pricing verification metadata
- Workflow suitability metadata

### Supported Vendors

- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Gemini
- Windsurf

### Key Decisions

- Use official pricing references only
- Avoid speculative pricing estimates
- Keep pricing deterministic and manually verified

### Verification

- pricing validation tests added
- dataset consistency verified

---

## Day 3 — Deterministic Audit Engine

### What I Implemented

- deterministic audit engine
- savings calculations
- downgrade detection
- redundancy detection
- consolidation logic
- API_USAGE informational-only recommendations

### Recommendation Types

- KEEP
- DOWNGRADE
- CONSOLIDATE
- REMOVE_REDUNDANCY
- API_USAGE

### Important Decisions

- Avoid AI-generated financial reasoning
- API_USAGE recommendations should never guarantee savings
- Recommendation outputs must remain deterministic

### Verification

- calculator tests added
- audit engine tests added
- deterministic recommendation outputs verified

---

## Day 4 — Audit Workflow UI

### What I Implemented

- multi-step audit form
- React Hook Form integration
- Zod validation
- workflow and team metadata capture
- tool selection and spend inputs

### UX Improvements

- validation messaging
- mobile-responsive layouts
- user-friendly form progression

### Verification

- form validation tests added
- submission flow tests added

---

## Day 5 — Frontend Stabilization

### What I Implemented

- report rendering system
- recommendation cards
- confidence indicators
- savings summaries
- Zustand persistence improvements

### Stabilization Work

- hydration mismatch fixes
- persistence key separation
- mounted render gating
- numeric input stabilization
- responsive/mobile QA

### Verification

- hydration warnings removed
- manual QA completed for /audit and /spend-report/[id]
- deterministic rendering verified

---

## Day 6 — Persistence & Reliability

### What I Implemented

- Supabase report persistence
- report retrieval by ID
- shareable report URLs
- loading and fallback states
- invalid report handling

### Reliability Improvements

- timeout-safe fetch handling
- graceful fallback rendering
- environment variable validation
- persistence fallback to Zustand state

### Verification

- persistence tests added
- refresh-safe rendering verified
- report retrieval verified

---

## Day 7 — AI Summary Layer & Lead Capture

### What I Implemented

- supplemental AI-assisted report summaries
- deterministic-safe summary generation flow
- graceful fallback summary handling
- client-side non-blocking summary rendering
- lead capture form
- Supabase-backed lead persistence
- timeout-safe network handling
- silent persistence failure handling

### Important Architecture Decisions

- AI summaries remain supplemental only
- deterministic audit engine remains authoritative
- AI never modifies recommendations or savings calculations
- fallback summaries are used whenever AI is unavailable
- lead persistence failures never block report UX

### Reliability Improvements

- AbortController-based timeout handling
- cleanup-safe async behavior
- trimmed and normalized lead inputs
- graceful API degradation
- hydration-safe async rendering

### Verification

- 110 tests passing
- zero TypeScript build errors
- Supabase persistence verified
- lead capture verified
- fallback summary behavior verified
- responsive/mobile QA completed
- deterministic outputs preserved

### Final Reflection

The biggest engineering challenge was preserving deterministic audit behavior while incrementally introducing persistence, async rendering, and supplemental AI capabilities without compromising explainability or reliability.

The project intentionally prioritized trustworthy deterministic outputs over speculative AI-generated automation.

---

## Day 4 — Email Delivery & Deployment Prep

### What I Implemented

- Resend-backed report email delivery
- non-blocking email workflow on saved audit reports
- graceful degradation when `RESEND_API_KEY` is missing or delivery fails
- Open Graph and Twitter metadata for production sharing
- deployment environment documentation for Supabase, Resend, app URL, and AI summary configuration

### Important Architecture Decisions

- Email delivery is supplemental only and never blocks report access
- Report emails use deterministic audit totals and recommendation counts only
- Delivery errors return safe client responses without exposing secrets or request payloads
- `viewport` remains a separate Next.js export from `metadata`

### Verification

- Added email delivery and API route tests
- Added client form coverage for rendering, accessibility attributes, validation paths, and non-navigation behavior
- Preserved deterministic audit logic, pricing datasets, routing, and existing report calculations
