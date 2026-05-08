# SpendLayer

SpendLayer is a deterministic AI spend audit platform designed to help startups and teams identify unnecessary AI tooling costs, redundant subscriptions, and optimization opportunities.

Users enter their AI tooling stack, monthly spend, workflow type, and team size to receive structured audit recommendations and savings insights.

---

## Features

### Deterministic Audit Engine

* rule-based recommendation system
* no AI-generated financial decisions
* repeatable outputs for identical inputs

### Pricing Intelligence

Supports pricing analysis for:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Gemini
* Windsurf

### Recommendation Types

* KEEP
* DOWNGRADE
* CONSOLIDATE
* REMOVE_REDUNDANCY
* API_USAGE (informational only)

### Responsive Audit Workflow

* multi-step audit form
* Zustand-powered persistence
* hydration-safe rendering
* mobile-responsive UX

### Persistence & Reliability

* Supabase-backed report persistence
* refresh-safe report rendering
* shareable report URLs
* loading and fallback states
* deterministic report retrieval

### Accessibility & Stability

* keyboard-accessible controls
* focus-visible interactions
* aria-aware validation
* hydration-safe state management

### Testing & Verification

* 89 automated tests
* zero TypeScript build errors
* deterministic calculation coverage
* persistence and stabilization tests

---

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Zustand
* Supabase
* Vitest

---

## Architecture Philosophy

SpendLayer intentionally avoids:

* speculative pricing assumptions
* AI-generated savings calculations
* non-deterministic recommendation behavior
* opaque optimization logic

All audit recommendations are generated synchronously through:

* pricing datasets
* rule-based evaluation
* overlap analysis
* deterministic savings calculations

This guarantees:

* repeatable outputs
* explainable recommendations
* financially conservative estimates
* predictable testing behavior

---

## Local Development

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Start development server

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Production build

```bash
npm run build
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Current Project Status

### Completed

* Phase 1 — Foundation & Tooling
* Phase 2 — Pricing Intelligence & Audit Engine
* Phase 3 — Audit Form UX & Stabilization
* Phase 4 — Persistence & Production Hardening

### Current Verification

* 89 tests passing
* zero TypeScript build errors
* responsive/mobile QA completed
* persistence verified
* deterministic outputs verified

---

## Future Improvements

* PDF export support
* lightweight analytics
* audit history dashboard
* pricing refresh tooling
* production deployment polish

---

## Product Philosophy

SpendLayer is intentionally designed as a trustworthy deterministic SaaS MVP.

The project prioritizes:

* explainability
* conservative financial logic
* deterministic outputs
* lightweight architecture
* production-minded engineering

The system intentionally avoids:

* fake AI-generated recommendations
* speculative savings claims
* overengineered infrastructure
* hype-driven automation
