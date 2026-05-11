# Reflection

# Project Goal

SpendLayer was built as a deterministic AI SaaS spend auditing workflow for developers, startup teams, and small organizations using multiple AI tooling subscriptions.

The primary goal was to create a lightweight system that could:

- identify redundant tooling
- estimate conservative savings opportunities
- provide explainable recommendations
- remain operationally reliable under partial failure conditions

The project intentionally prioritized:

- deterministic behavior
- explainability
- graceful degradation
- testing reliability
- and operational simplicity

over feature count or speculative AI automation.

---

# Biggest Engineering Challenges

## Hydration Stability & Persisted Client State

The most difficult technical problem involved maintaining deterministic rendering behavior while introducing persisted client-side state and async workflows.

Hydration mismatches began appearing once Zustand persistence, async report loading, and client restoration logic interacted with server-rendered content.

Fixing this required:

- mounted render gating
- persistence-safe normalization
- defensive fallback rendering
- client hydration guards
- and separation of transient vs persisted state

The complexity increased significantly once report persistence and shareable report pages were introduced together.

---

## Reliability Under Partial Failure

Another major engineering challenge was ensuring the application remained usable even when optional services failed.

This included handling:

- AI summary failures
- Supabase persistence issues
- invalid report retrieval
- missing environment variables
- timeout handling
- and email delivery failures

The architecture intentionally ensured that:

- reports remain viewable if AI summaries fail
- persistence failures never crash the audit workflow
- email delivery failures never block report access
- and invalid routes degrade gracefully instead of failing catastrophically

Designing fallback behavior became more important than adding additional product features late in development.

---

# Why Deterministic Recommendations Were Chosen

SpendLayer intentionally avoids AI-generated financial recommendations.

Recommendations are generated through:

- pricing datasets
- workflow suitability rules
- overlap analysis
- and deterministic savings calculations

This decision was made because:

- financial recommendations should remain explainable
- repeated inputs should produce repeated outputs
- deterministic systems are easier to validate and test
- and conservative recommendation behavior improves trust

AI-generated summaries are supplemental only and never modify:

- recommendation types
- savings calculations
- pricing logic
- or audit outputs

---

# Important Architecture Decisions

## Chosen Approaches

Key implementation decisions included:

- deterministic recommendation logic over LLM-generated recommendations
- lightweight Supabase persistence over heavier backend infrastructure
- manually verified pricing datasets instead of automated scraping
- additive AI summaries rather than AI-controlled workflows
- graceful degradation instead of hard dependency failures
- public shareable reports instead of full account systems

These decisions kept the project focused on execution quality, reliability, and evaluator clarity.

---

## Intentionally Avoided Complexity

The project intentionally avoided:

- speculative savings estimates
- autonomous optimization behavior
- enterprise-scale infrastructure
- billing systems
- authentication complexity
- dashboard-heavy analytics
- excessive backend abstraction
- and unnecessary feature expansion

The assignment goals favored reliability, explainability, and product clarity more than infrastructure scale.

---

# Failures & Iteration Points

Several implementation approaches failed or required redesign during development.

Examples included:

- unstable hydration behavior during persisted Zustand rollout
- Supabase schema mismatches during report persistence implementation
- seeded demo routes depending on unstable IDs
- overly aggressive recommendation wording during early audit iterations
- Google Fonts fetching causing deployment instability in restricted environments

Some UI sections were simplified after realizing the project was becoming unnecessarily complex relative to the assignment scope.

This reinforced the importance of prioritizing operational stability over feature expansion.

---

# What I Learned

The project reinforced several engineering lessons:

- deterministic systems become easier to reason about and validate over time
- persistence and async rendering quickly increase frontend complexity
- graceful fallback behavior is more valuable than feature quantity
- conservative recommendation systems often build more trust than aggressive automation
- testing reliability improves significantly when business logic remains deterministic
- evaluator-facing documentation quality strongly affects perceived engineering maturity

The project also highlighted how quickly seemingly lightweight SaaS workflows become operationally complex once persistence, deployment readiness, async behavior, and external integrations are introduced together.

---

# What I Would Improve Next

If development continued further, the next improvements would likely include:

- historical audit tracking
- PDF export support
- automated pricing refresh tooling
- report comparison workflows
- lightweight analytics
- deployment hardening
- and self-hosted font optimization

However, the current version intentionally stopped before significant feature expansion in order to preserve reliability, clarity, and deterministic behavior.

---

# AI Usage Disclosure

AI tools were used during development for:

- debugging assistance
- implementation brainstorming
- architecture discussion
- documentation refinement
- and edge-case review

However:

- audit recommendations are deterministic
- pricing calculations are rule-based
- and savings outputs remain repeatable and explainable