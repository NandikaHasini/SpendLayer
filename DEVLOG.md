# DEVLOG

## Day 1 — 2026-05-07

### Foundation & Environment Setup

### What I Implemented

* Initialized Next.js 16 project
* Added TypeScript and Tailwind CSS v4
* Configured shadcn/ui
* Added Zustand state management setup
* Added Supabase scaffolding
* Added Vitest testing setup and initial smoke tests
* Created initial folder structure and project organization

### Problems Faced

* npm installation instability and ECONNRESET issues during dependency setup
* Tailwind v4 configuration differences compared to older versions
* Next.js 16 async route handling differences compared to previous App Router versions

### Important Decisions

* Keep architecture lightweight and avoid unnecessary backend complexity
* Use deterministic logic instead of AI-generated recommendation systems
* Separate pricing logic from UI rendering early to reduce coupling later

### Verification

* `npm run dev` passed
* `npm test` passed
* `npm run build` passed

### Reflection

The biggest realization today was that keeping the project deterministic from the beginning would make later testing and persistence significantly easier.

---

## Day 2 — 2026-05-08

### Pricing Dataset & Deterministic Audit Engine

### What I Implemented

* Pricing dataset structure
* Vendor metadata system
* Workflow suitability metadata
* Deterministic audit engine
* Savings calculations
* Redundancy detection
* Consolidation recommendations
* Downgrade recommendation logic
* API_USAGE informational recommendation flow

### Supported Vendors

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Gemini
* Windsurf

### Important Decisions

* Use official vendor pricing references only
* Avoid speculative pricing assumptions
* Keep recommendation outputs repeatable for identical inputs
* Prevent AI summaries from modifying savings calculations

### Problems Faced

* Recommendation overlap logic became more complicated once tools supported multiple workflows
* Needed to avoid producing overly aggressive optimization recommendations
* Early recommendation wording sounded too confident and unrealistic

### Verification

* Added pricing validation tests
* Added audit engine tests
* Verified deterministic recommendation outputs
* Verified repeated identical inputs produced identical outputs

### Reflection

Deterministic recommendation logic was harder than expected because the system needed to remain explainable while still feeling practically useful.

---

## Day 3 — 2026-05-09

### Audit Workflow UI & Frontend Stabilization

### What I Implemented

* Multi-step audit form
* React Hook Form integration
* Zod validation
* Tool selection workflow
* Spend and team metadata capture
* Recommendation cards
* Savings summaries
* Zustand persistence improvements
* Responsive/mobile layout adjustments

### Stabilization Work

* Hydration mismatch fixes
* Mounted render gating
* Persistence key separation
* Numeric input stabilization
* Mobile layout improvements
* Validation messaging improvements

### Problems Faced

* Hydration warnings caused by persisted Zustand state
* Numeric inputs occasionally desynchronized during step transitions
* Form state persistence created inconsistent rendering during refreshes

### Verification

* Added form validation tests
* Added submission flow tests
* Verified hydration warnings removed
* Manually tested `/audit` workflow on desktop and mobile layouts

### Reflection

The project became significantly more complex once async rendering and persisted client state were introduced together.

---

## Day 4 — 2026-05-10

### Persistence, Reliability & AI Summary Layer

### What I Implemented

* Supabase report persistence
* Shareable report URLs
* Report retrieval by ID
* Invalid report handling
* Loading and fallback states
* AI-assisted report summaries
* Graceful fallback summaries
* Lead capture form
* Supabase-backed lead persistence

### Reliability Improvements

* AbortController-based timeout handling
* Cleanup-safe async rendering
* Silent persistence failure handling
* Graceful API degradation
* Environment variable validation
* Refresh-safe report rendering

### Problems Faced

* Supabase schema mismatches during persistence rollout
* Missing `audit_reports` columns during report retrieval testing
* Demo report route initially failed because seeded IDs were unstable
* Lead capture and report persistence flows required separate failure handling
* Needed to ensure AI failures never blocked report rendering

### Important Decisions

* AI summaries remain supplemental only
* Deterministic audit engine remains authoritative
* Lead persistence failures should never block report access
* Report retrieval should degrade gracefully instead of crashing

### Verification

* Added persistence tests
* Added lead capture tests
* Verified refresh-safe report rendering
* Verified Supabase inserts manually through Table Editor
* Verified invalid report fallback rendering
* Verified AI summary fallback behavior

### Reflection

Reliability and graceful degradation became more important than adding new features once persistence workflows were introduced.

---

## Day 5 — 2026-05-11

### Production Hardening & Deployment Preparation

### What I Implemented

* Resend-backed email delivery workflow
* Non-blocking report email flow
* Open Graph and Twitter metadata
* Homepage demo report flow
* Honeypot-based abuse protection
* GitHub Actions CI workflow
* Deployment environment documentation
* Additional evaluator-focused documentation polish
* Interview research structure and evidence notes
* README production cleanup

### Deployment Preparation

* Added environment variable documentation for Supabase and Resend
* Added CI workflow for test/build verification
* Verified production build readiness
* Added deterministic demo report fallback
* Added deployment-safe metadata handling

### Problems Faced

* Missing `SUPABASE_SERVICE_ROLE_KEY` during early persistence testing
* Google Fonts fetching created build instability in restricted environments
* Missing Open Graph image asset during metadata setup
* Demo report URLs initially pointed to nonexistent persisted reports
* Needed to ensure email delivery failures never blocked report usage

### Important Decisions

* Email delivery remains supplemental only
* Report emails contain deterministic totals only
* External API failures should never block report access
* CI intentionally avoids unstable lint checks
* Keep architecture lightweight instead of adding unnecessary infrastructure

### Verification

* Added email delivery tests
* Added email form rendering and validation tests
* Verified real email delivery using inbox testing
* Verified production build successfully completes
* Verified 138 tests passing
* Verified report sharing in incognito mode
* Verified fallback handling for missing reports

### Reflection

The final phase shifted from feature building into operational reliability, deployment readiness, and assignment-quality documentation. The most valuable improvements were related to trust, explainability, and graceful fallback behavior rather than adding additional functionality.
