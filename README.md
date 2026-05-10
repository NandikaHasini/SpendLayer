# SpendLayer

SpendLayer is a deterministic AI spend audit platform for startup teams. Users enter their AI tooling stack, monthly spend, workflow type, and team size to receive structured recommendations and conservative savings estimates.

Deployed URL: TODO

Demo report: `/spend-report/demo`

## Quickstart

```bash
npm install --legacy-peer-deps
npm test
npm run build
npm run dev
```

Open `http://localhost:3000`, run an audit, or visit `http://localhost:3000/spend-report/demo`.

## Features

- Rule-based deterministic audit engine
- Pricing intelligence for ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and Windsurf
- Recommendation types: `KEEP`, `DOWNGRADE`, `CONSOLIDATE`, `REMOVE_REDUNDANCY`, and informational `API_USAGE`
- Responsive multi-step audit workflow
- Supabase-backed report persistence
- Shareable public report URLs
- Reliable demo route with deterministic fallback data
- Optional transactional report email delivery
- Optional AI-assisted summary that never changes audit calculations
- Lead capture with lightweight honeypot protection

## Architecture Summary

- Next.js app router renders the landing page, audit workflow, API routes, and public report pages.
- `lib/audit` contains deterministic rules, calculations, validation, and view-model helpers.
- `lib/pricing/tools.ts` stores vendor plan data with official source URLs and verification dates.
- Supabase stores submitted reports and optional lead captures.
- Resend sends report emails without generating new recommendations.
- `/spend-report/demo` uses `lib/demo-report.ts` and does not require Supabase.

## Key Decisions

SpendLayer intentionally avoids:

- speculative pricing assumptions
- AI-generated savings calculations
- non-deterministic recommendation behavior
- opaque optimization logic
- enterprise claims that the MVP does not support

AI-generated summaries are supplemental only. They never modify recommendations, savings totals, pricing calculations, or deterministic audit outputs.

The assignment MVP also avoids auth, dashboards, billing, analytics platforms, and complex infrastructure so the product stays focused on the audit workflow and submission evidence.

## Screenshots

Screenshots are stored in `docs/screenshots/`:

- `homepage-hero.png`
- `audit-form.png`
- `report-page.png`
- `lead-capture-form.png`
- `email-delivery-success.png`
- `supabase-lead-persistence.png`
- `terminal-tests.png`
- `terminal-build.png`

## Documentation

- `user_interviews.md` - real interview template with TODO placeholders
- `GTM.md` - founder-led go-to-market strategy
- `economics.md` - conservative CAC, conversion, ACV, and ARR assumptions
- `metrics.md` - North Star, activation, retention proxy, and pivot thresholds
- `landing_copy.md` - concise landing copy and FAQ
- `PROMPTS.md` - AI summary prompt, fallback behavior, and deterministic recommendation philosophy
- `PRICING_DATA.md` - official pricing source index and dataset coverage
- `docs/demo-dataset.md` - deterministic demo route dataset

## Environment

Copy `.env.example` and configure the services you want to test:

- Supabase variables enable report and lead persistence.
- Resend variables enable transactional report email.
- AI summary variables enable optional narrative summaries.

The audit report remains usable when optional services are unavailable.

## Email Report Delivery

Email delivery is optional and supplemental. SpendLayer reports remain accessible in the browser and through shareable report links even when email delivery is not configured or a delivery attempt fails.

Report emails only forward deterministic audit data that already exists in the saved report. The email layer does not generate new recommendations, savings figures, or AI reasoning.
