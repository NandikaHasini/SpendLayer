# Pricing Data

SpendLayer uses deterministic pricing records from official vendor pricing pages. Pricing data is stored in `lib/pricing/tools.ts`.

The audit engine uses this data to:

- estimate current spend
- identify downgrade opportunities
- detect redundant subscriptions
- generate conservative savings recommendations

## Source Requirements

Every stored pricing number must have:

- an official source URL
- a dataset verification date
- a clear plan name
- no unsupported enterprise estimate

Pre-submission documentation check performed: 2026-05-10.

Plan amounts should be manually re-verified before a production launch because AI vendor pricing changes frequently. This documentation pass preserves audit behavior and does not modify engine outputs.

## Official Source Index

| Vendor | Official source URL | Dataset verification date | Notes |
| --- | --- | --- | --- |
| ChatGPT | https://openai.com/chatgpt/pricing | 2025-01-15 | Official ChatGPT plan pricing page |
| Claude | https://claude.com/pricing | 2025-01-15 | Official Claude plan pricing page |
| Cursor | https://cursor.com/pricing | 2025-01-15 | Official Cursor pricing page |
| GitHub Copilot | https://github.com/features/copilot/plans | 2025-01-15 | Official Copilot pricing page |
| Gemini | https://gemini.google/subscriptions | 2025-01-15 | Official Gemini consumer subscription page |
| Gemini for Workspace | https://workspace.google.com/products/gemini/ | 2025-01-15 | Official Gemini business source |
| Windsurf | https://windsurf.com/pricing | 2025-01-15 | Official Windsurf pricing page |

## Dataset Price Coverage

| Vendor | Plan | Price stored | Official source URL | Last verified in dataset |
| --- | --- | ---: | --- | --- |
| ChatGPT | Free | $0/mo | https://openai.com/chatgpt/pricing | 2025-01-15 |
| ChatGPT | Plus | $20/mo | https://openai.com/chatgpt/pricing | 2025-01-15 |
| ChatGPT | Pro | $200/mo | https://openai.com/chatgpt/pricing | 2025-01-15 |
| ChatGPT | Team | $30/user/mo monthly, $25/user/mo annual equivalent | https://openai.com/chatgpt/pricing | 2025-01-15 |
| ChatGPT | Enterprise | Custom/contact sales | https://openai.com/chatgpt/pricing | 2025-01-15 |
| Claude | Free | $0/mo | https://claude.com/pricing | 2025-01-15 |
| Claude | Pro | $20/mo | https://claude.com/pricing | 2025-01-15 |
| Claude | Team | $30/user/mo | https://claude.com/pricing | 2025-01-15 |
| Claude | Enterprise | Custom/contact sales | https://claude.com/pricing | 2025-01-15 |
| Cursor | Hobby | $0/mo | https://cursor.com/pricing | 2025-01-15 |
| Cursor | Pro | $20/mo monthly, $16/mo annual equivalent | https://cursor.com/pricing | 2025-01-15 |
| Cursor | Business | $40/user/mo | https://cursor.com/pricing | 2025-01-15 |
| GitHub Copilot | Free | $0/mo | https://github.com/features/copilot/plans | 2025-01-15 |
| GitHub Copilot | Pro | $10/mo monthly, $8.33/mo annual equivalent | https://github.com/features/copilot/plans | 2025-01-15 |
| GitHub Copilot | Business | $19/user/mo | https://github.com/features/copilot/plans | 2025-01-15 |
| GitHub Copilot | Enterprise | $39/user/mo | https://github.com/features/copilot/plans | 2025-01-15 |
| Gemini | Free | $0/mo | https://gemini.google/subscriptions | 2025-01-15 |
| Gemini | Advanced | $19.99/mo | https://gemini.google/subscriptions | 2025-01-15 |
| Gemini | Business | $24/user/mo | https://workspace.google.com/products/gemini/ | 2025-01-15 |
| Windsurf | Free | $0/mo | https://windsurf.com/pricing | 2025-01-15 |
| Windsurf | Pro | $15/mo | https://windsurf.com/pricing | 2025-01-15 |
| Windsurf | Teams | $30/user/mo | https://windsurf.com/pricing | 2025-01-15 |

## Assumptions Avoided

The audit engine intentionally avoids:

- speculative discounts
- enterprise contract assumptions
- unsupported pricing estimates
- AI-generated pricing guesses
- non-deterministic calculations

## API Usage Recommendation Philosophy

`API_USAGE` recommendations are informational only.

They do not guarantee savings or contribute to savings totals. This avoids misleading financial projections for token-based usage patterns that vary by user.
