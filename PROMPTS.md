# Prompts

## AI Usage Scope

AI is intentionally NOT used for:

* savings calculations
* pricing recommendations
* downgrade decisions
* deterministic audit outputs

AI usage is limited to:

* personalized report summaries
* optional narrative explanation generation

---

## Personalized Summary Prompt

```text
You are generating a concise founder-friendly summary for an AI spend audit report.

Rules:
- keep under 100 words
- avoid exaggerated claims
- avoid guaranteed savings language
- summarize only provided deterministic recommendations
- tone should be professional and practical

Input:
- current spend
- optimized spend
- monthly savings
- recommendation types
- vendors involved

Output:
- concise actionable summary
```

---

## Fallback Prompt Philosophy

If AI summary generation fails:

* deterministic recommendations still render
* report functionality remains intact
* fallback UI explains temporary summary unavailability

This ensures:

* graceful degradation
* deterministic core functionality preservation

---

## AI Safety Constraints

The AI layer must never:

* invent savings
* fabricate pricing
* generate unsupported migration advice
* contradict deterministic audit outputs

AI summaries are supplemental only.

The deterministic audit engine remains the system of record.
