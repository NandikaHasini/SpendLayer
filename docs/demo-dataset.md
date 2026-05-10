# Demo Dataset

## Workflow
Engineering

## Team Size
8

## Tools & Spend

| Tool | Monthly Spend |
|---|---|
| ChatGPT | 160 |
| Claude | 200 |
| Cursor | 160 |
| GitHub Copilot | 80 |
| Gemini | 40 |

## Purpose

Used for:
- screenshots
- demo verification
- deployment QA
- presentation consistency

## Reliable Demo Route

The public demo route is:

`/spend-report/demo`

This route does not depend on Supabase. It uses the deterministic fallback dataset in `lib/demo-report.ts`, generated through the same audit engine as submitted reports with a fixed `generatedAt` timestamp. This keeps the assignment demo stable even if persistence credentials are missing or a database request fails.
