# SpendLayer

SpendLayer is a deterministic AI SaaS spend audit platform designed for developers, startups, and small teams using multiple AI tooling subscriptions.

Users enter their tooling stack, workflow type, team size, and monthly spend to receive explainable recommendations and conservative savings estimates.

Deployed URL: https://spend-layer.vercel.app/

Demo report: `/spend-report/demo`

---

# Quickstart

```bash
npm install --legacy-peer-deps
npm run lint
npm test
npm run build
npm run dev
````

Open:

* `http://localhost:3000`
* `http://localhost:3000/spend-report/demo`

---

# Features

* Deterministic audit recommendation engine
* Conservative AI SaaS savings estimation
* Pricing intelligence for major AI developer tools
* Extensible vendor pricing dataset architecture
* Responsive multi-step audit workflow
* Optional Supabase-backed report persistence
* Public shareable report URLs
* Deterministic demo report route
* Optional transactional report email delivery
* Optional AI-assisted summaries
* Lightweight lead capture workflow
* Graceful fallback behavior for optional services

---

# Supported Vendors

SpendLayer currently prioritizes pricing analysis for commonly used AI developer tooling subscriptions and startup-focused workflows.

Current vendor coverage includes:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Gemini
* Windsurf

Supported plan categories include:

* Free
* Pro
* Team
* Business
* Enterprise
* API usage guidance

Supported recommendation types include:

* `KEEP`
* `DOWNGRADE`
* `CONSOLIDATE`
* `REMOVE_REDUNDANCY`
* `API_USAGE`

The pricing dataset architecture is intentionally extensible and designed to support additional vendors, workflow-specific tooling categories, and future pricing integrations.

---

# Architecture Summary

* Next.js App Router handles frontend rendering, API routes, and public report pages
* `lib/audit` contains deterministic rules, calculations, and recommendation logic
* `lib/pricing/tools.ts` stores manually verified pricing datasets and metadata
* Supabase stores reports and optional lead capture submissions
* Resend handles transactional report email delivery
* AI-generated summaries remain supplemental and non-authoritative

The deterministic audit engine remains the authoritative source for all recommendations and savings calculations.

---

# Key Product Decisions

SpendLayer intentionally avoids:

* speculative savings estimates
* AI-generated financial recommendations
* opaque optimization logic
* enterprise-scale infrastructure
* unnecessary dashboard complexity
* autonomous recommendation systems

Recommendations remain deterministic, explainable, and repeatable for identical inputs.

AI summaries never modify:

* pricing calculations
* recommendation types
* savings totals
* or deterministic audit outputs

---

# User Validation

Three lightweight user feedback sessions were conducted with student developers and small-team AI tool users.

Common pain points included:

* overlapping AI subscriptions across teams
* unclear downgrade opportunities
* lack of centralized AI spend visibility
* difficulty estimating combined tooling costs

Key findings influenced the product direction:

* recommendations needed to remain explainable
* users preferred actionable savings suggestions over complex analytics
* lightweight workflows were preferred over enterprise-heavy dashboards

Additional interview notes and supporting observations are documented in:

* `USER_INTERVIEWS.md`
* `docs/interviews/interview-evidence-notes.md`

---

# Planned Dataset Expansion

The current dataset prioritizes commonly used AI productivity and developer tooling subscriptions frequently adopted by startups and technical teams.

Potential future pricing coverage may include:

* Perplexity
* Notion AI
* Midjourney
* Runway
* Devin
* Linear AI workflows
* Additional API-based AI providers

The current implementation intentionally prioritizes deterministic recommendation reliability and manually verified pricing accuracy over unsupported broad vendor coverage.

---

# Screenshots

Screenshots are stored in:

* `docs/screenshots/homepage-hero.png`
* `docs/screenshots/audit-form.png`
* `docs/screenshots/report-page.png`
* `docs/screenshots/lead-capture-form.png`
* `docs/screenshots/email-delivery-success.png`
* `docs/screenshots/supabase-lead-persistence.png`
* `docs/screenshots/terminal-tests.png`
* `docs/screenshots/terminal-build.png`

---

# Documentation

* `USER_INTERVIEWS.md` — summarized interview findings and product insights
* `docs/interviews/USER_INTERVIEWS.md` — detailed interview notes and observations
* `docs/interviews/interview-evidence-notes.md` — raw validation notes
* `GTM.md` — go-to-market strategy
* `ECONOMICS.md` — CAC, conversion, ACV, and ARR assumptions
* `METRICS.md` — product and retention metrics
* `LANDING_COPY.md` — landing page copy and FAQ
* `PROMPTS.md` — AI summary prompt design and fallback philosophy
* `PRICING_DATA.md` — pricing source verification and dataset coverage
* `TESTS.md` — testing strategy and verification commands
* `REFLECTION.md` — engineering tradeoffs and lessons learned
* `docs/demo-dataset.md` — deterministic demo dataset documentation

---

# CI & Verification

Verified on: 2026-05-11

GitHub Actions runs:

```bash
npm run lint
npm test
npm run build
```

Local verification commands:

```bash
npm run lint
npm test
npm run build
```

Current verification status:

* 138 passing tests
* successful production build verification
* deterministic audit output validation

---

# Environment Setup

Copy `.env.example` and configure the services you want to test.

Supported integrations:

* Supabase for report and lead persistence
* Resend for transactional report email delivery
* optional AI summary providers

The audit workflow remains usable even when optional services are unavailable.

---

# Email Report Delivery

Email delivery is supplemental only.

SpendLayer reports remain accessible through:

* in-browser rendering
* shareable report links
* deterministic fallback report behavior

Report emails only forward deterministic audit data that already exists in the saved report.

The email layer never generates:

* new recommendations
* savings calculations
* or AI-generated financial advice

