# Reflection

## Biggest Engineering Challenges

The most difficult engineering problem during development was preserving deterministic behavior while improving frontend persistence and hydration stability.

Hydration mismatches appeared when persisted Zustand state differed between server-rendered and client-rendered content. This required:

* mounted render gating
* persistence key separation
* hydration-safe normalization

Another challenge was balancing realistic SaaS architecture with assignment scope constraints. It was easy to overengineer persistence and recommendation logic, but the project intentionally remained lightweight and deterministic.

---

## Why Deterministic Recommendations Were Chosen

SpendLayer intentionally avoids AI-generated financial recommendations.

Instead, recommendations are generated using:

* pricing datasets
* overlap analysis
* rule-based evaluation
* deterministic savings calculations

This approach was chosen because:

* financial recommendations should be explainable
* deterministic systems are easier to test
* conservative outputs improve credibility
* repeatable results simplify debugging

---

## Important Tradeoffs

### Chosen

* deterministic logic over AI-generated reasoning
* lightweight persistence over complex infrastructure
* manual pricing verification over unstable scraping
* responsive reliability over visual complexity

### Avoided

* speculative savings calculations
* enterprise-level architecture
* unnecessary backend complexity
* AI-generated recommendation text

---

## AI Usage Disclosure

AI tools were used during development for:

* debugging assistance
* architectural brainstorming
* code review support
* documentation refinement

However:

* audit recommendations themselves are not AI-generated
* pricing calculations are deterministic
* savings outputs are rule-based and synchronous

---

## What I Would Improve Next

If continued further, the next improvements would be:

* PDF export support
* audit history dashboard
* lightweight analytics
* deployment polish
* pricing refresh tooling

The project intentionally avoided feature bloat in favor of reliability and deterministic behavior.
