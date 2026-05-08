# SpendLayer

SpendLayer is a deterministic AI spend audit platform designed to help startups and teams identify unnecessary AI tooling costs, redundant subscriptions, and optimization opportunities.

Users enter their AI tooling stack, monthly spend, workflow type, and team size to receive structured audit recommendations and savings insights.

---

## Features

### Deterministic Audit Engine
- rule-based recommendation system
- no AI-generated financial decisions
- repeatable outputs for identical inputs

### Pricing Intelligence
Supports pricing analysis for:
- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Gemini
- Windsurf

### Recommendation Types
- KEEP
- DOWNGRADE
- CONSOLIDATE
- REMOVE_REDUNDANCY
- API_USAGE (informational only)

### Responsive Audit Workflow
- multi-step audit form
- Zustand-powered persistence
- hydration-safe rendering
- mobile-responsive UX

### Report Generation
- savings summaries
- recommendation cards
- vendor-level insights
- confidence indicators
- deterministic rendering

### Testing & Stability
- 82 automated tests
- zero TypeScript build errors
- hydration-safe state management
- deterministic calculation coverage

---

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Supabase
- Vitest

---

## Architecture Philosophy

SpendLayer intentionally avoids:
- speculative pricing assumptions
- AI-generated savings calculations
- non-deterministic recommendation behavior

All audit recommendations are generated synchronously through:
- pricing datasets
- rule-based evaluation
- overlap analysis
- deterministic savings calculations

---

## Local Development

### Install dependencies

```bash
npm install