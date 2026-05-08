# Pricing Data

SpendLayer uses deterministic pricing datasets sourced from official vendor pricing pages.

The pricing layer is used by the audit engine to:

* estimate current spend
* identify downgrade opportunities
* detect redundant subscriptions
* generate conservative savings recommendations

---

## Supported Vendors

Current supported vendors:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Gemini
* Windsurf

---

## Pricing Verification

Pricing metadata includes:

* source URL
* verification timestamp
* supported plan tiers
* workflow suitability metadata

Pricing information is stored in:

* `lib/pricing/tools.ts`

---

## Official Pricing Sources

| Vendor         | Official Source                     | Verified   |
| -------------- | ----------------------------------- | ---------- |
| ChatGPT        | https://openai.com/pricing          | 2026-05-08 |
| Claude         | https://www.anthropic.com/pricing   | 2026-05-08 |
| Cursor         | https://cursor.com/pricing          | 2026-05-08 |
| GitHub Copilot | https://github.com/features/copilot | 2026-05-08 |
| Gemini         | https://gemini.google/subscriptions | 2026-05-08 |
| Windsurf       | https://windsurf.com/pricing        | 2026-05-08 |

---

## Assumptions Avoided

The audit engine intentionally avoids:

* speculative discounts
* enterprise contract assumptions
* unsupported pricing estimates
* AI-generated pricing guesses
* non-deterministic calculations

Recommendations are generated conservatively using deterministic rule evaluation.

---

## API_USAGE Recommendation Philosophy

`API_USAGE` recommendations are informational only.

They:

* do not guarantee savings
* do not contribute to savings totals
* are intended to encourage evaluation of token-based billing models

This avoids misleading financial projections for API consumption patterns that vary significantly between users.

---

## Deterministic Design

The pricing system is fully deterministic.

Identical inputs produce identical audit outputs.

No external AI inference is used for pricing analysis or recommendation generation.
