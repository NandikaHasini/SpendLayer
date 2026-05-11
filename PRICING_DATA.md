# Pricing Data & Dataset Verification

Last verified: 2026-05-11

SpendLayer uses deterministic pricing datasets sourced from official vendor pricing pages. Pricing records are stored in `lib/pricing/tools.ts` and used by the audit engine to generate explainable, repeatable recommendations.

The pricing dataset supports:

- current spend estimation
- downgrade detection
- redundant subscription analysis
- workflow suitability checks
- conservative savings recommendations

The dataset intentionally prioritizes deterministic behavior, manually verified pricing references, and explainable audit outputs over automated scraping or speculative estimation.

---

# Verification Standards

Every stored pricing entry must include:

- an official vendor pricing source
- a verification date
- a clearly identified plan name
- deterministic pricing values
- no unsupported enterprise assumptions

Pricing references were manually reviewed during final submission verification on 2026-05-11.

Because AI vendor pricing changes frequently, production deployments should periodically re-verify pricing references before relying on long-term savings calculations.

This verification process improves dataset transparency and recommendation trustworthiness without modifying deterministic audit behavior.

---

# Official Source Index

| Vendor | Official Source URL | Verified | Notes |
| --- | --- | --- | --- |
| ChatGPT | https://openai.com/chatgpt/pricing | 2026-05-11 | Official ChatGPT pricing page |
| Claude | https://claude.com/pricing | 2026-05-11 | Official Claude pricing page |
| Cursor | https://cursor.com/pricing | 2026-05-11 | Official Cursor pricing page |
| GitHub Copilot | https://github.com/features/copilot/plans | 2026-05-11 | Official GitHub Copilot pricing page |
| Gemini | https://gemini.google/subscriptions | 2026-05-11 | Official Gemini consumer pricing |
| Gemini for Workspace | https://workspace.google.com/products/gemini/ | 2026-05-11 | Official Gemini business pricing |
| Windsurf | https://windsurf.com/pricing | 2026-05-11 | Official Windsurf pricing page |

---

# Dataset Price Coverage

| Vendor | Plan | Stored Pricing | Official Source | Verified |
| --- | --- | --- | --- | --- |
| ChatGPT | Free | $0/mo | https://openai.com/chatgpt/pricing | 2026-05-11 |
| ChatGPT | Plus | $20/mo | https://openai.com/chatgpt/pricing | 2026-05-11 |
| ChatGPT | Pro | $200/mo | https://openai.com/chatgpt/pricing | 2026-05-11 |
| ChatGPT | Team | $30/user/mo monthly, $25/user/mo annual equivalent | https://openai.com/chatgpt/pricing | 2026-05-11 |
| ChatGPT | Enterprise | Custom/contact sales | https://openai.com/chatgpt/pricing | 2026-05-11 |
| Claude | Free | $0/mo | https://claude.com/pricing | 2026-05-11 |
| Claude | Pro | $20/mo | https://claude.com/pricing | 2026-05-11 |
| Claude | Team | $30/user/mo | https://claude.com/pricing | 2026-05-11 |
| Claude | Enterprise | Custom/contact sales | https://claude.com/pricing | 2026-05-11 |
| Cursor | Hobby | $0/mo | https://cursor.com/pricing | 2026-05-11 |
| Cursor | Pro | $20/mo monthly, $16/mo annual equivalent | https://cursor.com/pricing | 2026-05-11 |
| Cursor | Business | $40/user/mo | https://cursor.com/pricing | 2026-05-11 |
| GitHub Copilot | Free | $0/mo | https://github.com/features/copilot/plans | 2026-05-11 |
| GitHub Copilot | Pro | $10/mo monthly, $8.33/mo annual equivalent | https://github.com/features/copilot/plans | 2026-05-11 |
| GitHub Copilot | Business | $19/user/mo | https://github.com/features/copilot/plans | 2026-05-11 |
| GitHub Copilot | Enterprise | $39/user/mo | https://github.com/features/copilot/plans | 2026-05-11 |
| Gemini | Free | $0/mo | https://gemini.google/subscriptions | 2026-05-11 |
| Gemini | Advanced | $19.99/mo | https://gemini.google/subscriptions | 2026-05-11 |
| Gemini | Business | $24/user/mo | https://workspace.google.com/products/gemini/ | 2026-05-11 |
| Windsurf | Free | $0/mo | https://windsurf.com/pricing | 2026-05-11 |
| Windsurf | Pro | $15/mo | https://windsurf.com/pricing | 2026-05-11 |
| Windsurf | Teams | $30/user/mo | https://windsurf.com/pricing | 2026-05-11 |

---

# Current Dataset Scope

SpendLayer currently prioritizes pricing coverage for commonly used AI developer tooling subscriptions and startup-focused workflows.

Primary vendor coverage includes:

- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Gemini
- Windsurf

Supported plan categories include:

- Free
- Pro
- Team
- Business
- Enterprise
- API usage guidance

The pricing dataset architecture is intentionally extensible and designed to support additional vendors, workflow-specific tooling categories, and future pricing integrations.

---

# Planned Dataset Expansion

The current dataset prioritizes commonly used AI productivity and developer tooling subscriptions frequently adopted by startups and technical teams.

Potential future pricing coverage may include:

- Perplexity
- Notion AI
- Midjourney
- Runway
- Devin
- Linear AI workflows
- Additional API-based AI providers

The current implementation intentionally prioritizes deterministic recommendation reliability and manually verified pricing accuracy over unsupported broad vendor coverage.

---

# Assumptions Explicitly Avoided

The audit engine intentionally avoids:

- speculative discounts
- enterprise contract assumptions
- unsupported pricing estimates
- AI-generated pricing guesses
- non-deterministic calculations
- fabricated usage projections

This keeps recommendation outputs conservative, explainable, and repeatable.

---

# API Usage Recommendation Philosophy

`API_USAGE` recommendations are informational only.

They do not contribute to deterministic savings totals and should not be interpreted as guaranteed financial savings.

This intentionally avoids misleading projections for token-based or usage-variable billing models where costs depend heavily on implementation patterns, request volume, and runtime behavior.