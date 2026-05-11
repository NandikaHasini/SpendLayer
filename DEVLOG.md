# DEVLOG

## Day 1 — 2026-05-07

# Foundation & Project Setup

## Work Completed

- Initialized Next.js 16 application
- Configured TypeScript and Tailwind CSS v4
- Added shadcn/ui setup
- Added Zustand state management
- Configured Vitest testing environment
- Added Supabase scaffolding
- Created initial project structure and folder organization

## Problems Encountered

- npm dependency installation instability during setup
- Tailwind CSS v4 configuration differences compared to previous versions
- Next.js 16 async route handling differences from earlier App Router implementations

## Important Decisions

- Keep architecture lightweight and assignment-focused
- Use deterministic recommendation logic instead of AI-generated recommendations
- Separate pricing logic from UI rendering early to reduce future coupling

## Verification

- `npm run dev`
- `npm test`
- `npm run build`

All passed successfully.

---

## Day 2 — 2026-05-08

# Deterministic Audit Engine & Pricing Logic

## Work Completed

- Built pricing dataset structure
- Added vendor metadata system
- Added workflow suitability metadata
- Implemented deterministic audit engine
- Added savings calculations
- Added overlap detection and consolidation logic
- Added downgrade recommendation flow
- Added informational API usage recommendation flow

## Supported Vendors

- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Gemini
- Windsurf

## Problems Encountered

- Recommendation overlap logic became increasingly complex once tools supported multiple workflows
- Early recommendation wording sounded overly confident and unrealistic
- Needed to prevent duplicate recommendation generation

## Important Decisions

- Use manually verified official pricing references only
- Keep recommendation outputs repeatable for identical inputs
- Prevent AI-generated summaries from modifying deterministic calculations

## Verification

- Added audit engine tests
- Added pricing validation tests
- Verified deterministic outputs across repeated runs

---

## Day 3 — 2026-05-09

# Audit Workflow UI & Frontend Stabilization

## Work Completed

- Built multi-step audit form
- Added React Hook Form integration
- Added Zod validation
- Implemented recommendation cards and summaries
- Added responsive/mobile layouts
- Improved persisted Zustand behavior
- Added spend and team metadata collection

## Stabilization Work

- Fixed hydration mismatches
- Added mounted render gating
- Improved persistence normalization
- Stabilized numeric input behavior
- Improved validation messaging

## Problems Encountered

- Persisted client state created hydration instability
- Numeric inputs occasionally desynchronized during step transitions
- Client restoration logic introduced inconsistent rendering behavior

## Verification

- Added validation tests
- Added audit submission tests
- Verified hydration warnings removed
- Manually tested desktop and mobile workflows

---

## Day 4 — 2026-05-10

# Persistence, Reliability & AI Summary Integration

## Work Completed

- Added Supabase-backed report persistence
- Added public report retrieval by ID
- Added shareable report URLs
- Added invalid report fallback handling
- Added AI-assisted summaries
- Added graceful fallback summaries
- Added lead capture workflow
- Added Supabase-backed lead persistence

## Reliability Improvements

- Added timeout handling using AbortController
- Added cleanup-safe async rendering
- Added environment validation
- Added refresh-safe report rendering
- Added graceful API degradation behavior

## Problems Encountered

- Supabase schema mismatches during persistence rollout
- Missing report columns during retrieval testing
- Lead capture and report persistence required separate fallback behavior
- Needed to ensure AI summary failures never blocked report access

## Important Decisions

- AI summaries remain supplemental only
- Deterministic audit engine remains authoritative
- Report retrieval should degrade gracefully instead of crashing
- Persistence failures should fail safely without blocking the user workflow

## Verification

- Added persistence tests
- Added lead capture tests
- Verified refresh-safe rendering
- Verified fallback report behavior
- Verified deterministic summary fallback logic

---

## Day 5 — 2026-05-11

# Production Hardening & Submission Preparation

## Work Completed

- Added Resend-backed email workflow
- Added non-blocking report email delivery
- Added Open Graph and Twitter metadata
- Added deterministic demo report route
- Added honeypot abuse protection
- Added GitHub Actions CI workflow
- Added deployment documentation
- Added evaluator-focused documentation cleanup
- Added interview research notes and evidence structure

## Reliability & Deployment Work

- Added environment variable documentation
- Verified production build readiness
- Added deterministic demo report fallback behavior
- Improved deployment-safe metadata handling

## Problems Encountered

- Missing Supabase environment variables during persistence testing
- Google Fonts fetching caused instability in restricted build environments
- Demo report URLs initially depended on unstable seeded data
- Email delivery failures required isolated fallback handling

## Important Decisions

- Email delivery remains supplemental only
- Report emails forward deterministic data only
- External API failures should never block report access
- CI focused on deterministic verification using lint, tests, and production build validation

## Verification

- Added email delivery tests
- Added form validation tests
- Verified real email delivery manually
- Verified report sharing in incognito mode
- Verified 138 passing tests
- Verified successful production builds

## Reflection

The final phase focused less on adding features and more on operational reliability, graceful degradation, evaluator clarity, and production readiness.