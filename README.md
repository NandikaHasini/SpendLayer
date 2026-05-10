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

### Persistence & Reliability

- Supabase-backed report persistence
- refresh-safe report rendering
- shareable report URLs
- loading and fallback states
- deterministic report retrieval

### AI-Assisted Summaries

- supplemental AI-generated report summaries
- deterministic audit engine remains authoritative
- graceful fallback summaries when AI is unavailable
- timeout-safe network handling
- non-blocking summary rendering

### Lead Capture

- Supabase-backed lead persistence
- silent failure handling
- trimmed and normalized inputs
- accessibility-aware validation
- graceful degradation when persistence is unavailable

### Accessibility & Stability

- keyboard-accessible controls
- focus-visible interactions
- aria-aware validation
- hydration-safe state management

### Testing & Verification

- 110 automated tests
- zero TypeScript build errors
- deterministic calculation coverage
- persistence and stabilization tests
- AI fallback behavior verification
- lead capture verification

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
- opaque optimization logic

All audit recommendations are generated synchronously through:

- pricing datasets
- rule-based evaluation
- overlap analysis
- deterministic savings calculations

This guarantees:

- repeatable outputs
- explainable recommendations
- financially conservative estimates
- predictable testing behavior

AI-generated summaries are supplemental only and never modify:

- recommendations
- savings totals
- pricing calculations
- deterministic audit outputs

---

## Local Development

### Install dependencies

```bash
npm install --legacy-peer-deps
```

## Email Report Delivery

Email delivery is optional and supplemental. SpendLayer reports remain fully accessible in the browser and through shareable report links even when email delivery is not configured or a delivery attempt fails.

To enable email delivery, create a Resend account at [resend.com](https://resend.com), verify your sending domain, and add `RESEND_API_KEY` to your local and production environment variables.

Report emails only forward deterministic audit data that already exists in the saved report. The email layer does not generate new recommendations, savings figures, or AI reasoning.
