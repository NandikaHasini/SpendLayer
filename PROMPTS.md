# AI Usage Documentation

SpendLayer uses AI in a strictly supplemental role. The deterministic audit engine is always the source of truth.

## AI Usage Scope

AI is used only for:

- Generating a concise narrative summary of deterministic audit results
- Making already-computed recommendations easier for a founder to read

AI is never used for:

- Savings calculations
- Plan recommendations
- Pricing lookups
- Recommendation generation
- Financial decision logic

## AI Summary Prompt

The summary endpoint sends a constrained prompt shaped like this:

```text
You are a concise spend analyst summarizing deterministic AI tooling spend audit results for a startup founder.

Audit data:
- Current monthly spend: $[amount]
- Monthly savings identified: $[amount]
- Annual savings identified: $[amount]
- Tools reviewed: [count]
- Tools to optimize: [count]
- Tools already efficient: [count]

Write a 2-3 sentence professional summary of these audit results.
Be direct and founder-friendly.
Do NOT invent savings figures. Use only the numbers provided above.
Do NOT make recommendations beyond what the data shows.
Do NOT use marketing language or hype.
```

## Fallback Strategy

Summary generation is non-blocking and timeout-safe:

- If the API key is absent, the fallback summary is used immediately.
- If the AI call fails, times out, or returns invalid text, the fallback summary is used.
- The report page renders deterministic data before the AI summary completes.
- Client and server requests use `AbortController` timeouts.
- The fallback function lives in `lib/ai/summary-fallback.ts` and is shared instead of duplicated.

Fallback copy uses only deterministic totals:

- No meaningful savings: "Your current AI tooling spend of $X/month appears well-optimized for your team size and workflow. No significant savings opportunities were identified based on current pricing data."
- Savings found: "Your audit identified $X/month ($Y/year) in potential savings from your current $Z/month AI tooling spend. Review the recommendations below to understand which plan changes or consolidations could reduce your costs."

## Why Recommendations Are Deterministic

SpendLayer intentionally avoids LLM-generated financial recommendations because pricing recommendations must be repeatable, explainable, and testable.

The deterministic engine owns:

- vendor overlap detection
- downgrade logic
- savings calculations
- recommendation types
- confidence labels
- pricing-source assumptions

The LLM summary can only restate already computed totals in plain English. It cannot invent plan changes, savings estimates, or financial advice.

## Abuse Protection

Lead capture includes a simple honeypot field named `website`.

- Real users never see or fill the field.
- Automated submissions that fill the field receive a generic success response.
- Honeypot submissions are not persisted to Supabase.
- This avoids extra infrastructure while adding lightweight protection for the assignment MVP.

## Lead Capture

Lead capture is optional and non-blocking.

- Inputs are trimmed before submission.
- Empty optional strings are normalized to null before persistence.
- Lead persistence failures never block report rendering.
- The form shows a success state even when persistence is unavailable.

## Model Used

- Provider: Anthropic
- Model: `claude-3-5-haiku-20241022`
- Max tokens: 200
- Server timeout: 8 seconds
- Client timeout: 10 seconds

Note: the prompt should avoid presenting the system as a financial advisor. SpendLayer provides deterministic software-spend analysis, not financial advice.
