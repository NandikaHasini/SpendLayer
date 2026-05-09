# PROMPTS.md — AI Usage Documentation

SpendLayer uses AI in a strictly supplemental role. The deterministic audit engine is always the source of truth.

---

## AI Usage Scope

AI is used ONLY for:
- Generating a personalized narrative summary of deterministic audit results
- Producing founder-friendly explanations of recommendations already calculated by the rule engine

AI is NEVER used for:
- Savings calculations
- Plan recommendations
- Pricing lookups
- Recommendation generation
- Any financial decision logic

---

## Summary Generation Philosophy

The AI summary is generated AFTER the deterministic audit engine completes. It receives only:
- Total current monthly spend
- Total monthly savings identified
- Total annual savings identified
- Count of tools reviewed
- Count of tools flagged for optimization
- Count of tools already efficient

The AI is explicitly instructed NOT to invent figures, contradict engine output, or add recommendations beyond what the data shows.

---

## Safety Constraints

- AI summary generation is wrapped in timeout-safe fetch using AbortController + setTimeout (8 second limit on server, 10 second limit on client)
- If the API key is absent, the fallback summary is used immediately without any API call
- If the API response is invalid or empty, the fallback summary is used
- If the API call throws, times out, or returns a non-OK status, the fallback summary is used
- The report page renders immediately with deterministic data
- AI summary loads asynchronously via client-side useEffect and never blocks report rendering
- AuditSummary renders a loading skeleton immediately while the async fetch completes
- No hydration risk — AI summary is client-only via useEffect
- Both AI summary and lead capture use timeout-safe network behavior through AbortController-based cancellation
- Timeouts are always cleared on component unmount to prevent memory leaks
- Future production deployments may introduce lightweight abuse protection or rate limiting on these endpoints

---

## Fallback Behavior

If AI summary generation fails for any reason, the system produces a deterministic fallback summary:

- If hasSignificantSavings is false:
  "Your current AI tooling spend of $X/month appears well-optimized for your team size and workflow. No significant savings opportunities were identified based on current pricing data."

- If hasSignificantSavings is true:
  "Your audit identified $X/month ($Y/year) in potential savings from your current $Z/month AI tooling spend. Review the recommendations below to understand which plan changes or consolidations could reduce your costs."

This fallback is always accurate because it uses only verified deterministic values from the audit engine.

The fallback function is defined once in lib/ai/summary-fallback.ts and imported wherever needed — it is never duplicated.

---

## Prompt Example

The following prompt is sent to the Anthropic API for summary generation:

```
You are a concise financial advisor summarizing an AI tooling spend audit for a startup founder.

Audit data:
- Current monthly spend: $[amount]
- Monthly savings identified: $[amount]
- Annual savings identified: $[amount]
- Tools reviewed: [count]
- Tools to optimize: [count]
- Tools already efficient: [count]

Write a 2–3 sentence professional summary of these audit results.
Be direct and founder-friendly.
Do NOT invent savings figures. Use only the numbers provided above.
Do NOT make recommendations beyond what the data shows.
Do NOT use marketing language or hype.
```

---

## Lead Capture

Lead capture is implemented as an optional, non-blocking form below the audit report.

- teamSize is intentionally omitted from the lead form to avoid incorrect inference
- Inputs are trimmed before submission
- Empty optional strings are normalized to null before database persistence
- Lead persistence to Supabase is designed to fail silently
- A persistence failure never affects report rendering or user experience
- The form always shows a success state to the user regardless of backend outcome

---

## Model Used

- Provider: Anthropic
- Model: claude-3-5-haiku-20241022
- Max tokens: 200
- Server timeout: 8 seconds (AbortController + setTimeout)
- Client timeout: 10 seconds (AbortController + setTimeout)
