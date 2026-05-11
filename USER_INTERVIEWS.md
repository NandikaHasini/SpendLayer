# USER_INTERVIEWS.md

These interviews were conducted to understand how developers and small teams currently manage AI tooling costs, how often they review subscriptions, and what level of trust they require before acting on optimization recommendations.

The conversations were informal and focused on real workflows rather than validating a predetermined solution.

---

# Interview 1

**Date:** 2026-05-11

**Participant:** Full-stack developer with freelance and product experience

**Relationship:** Brother

**Team size:** Mostly solo work, occasionally collaborates with 2–3 developers

**Current AI tools in use:** ChatGPT, Claude, GitHub Copilot

**Estimated monthly AI tooling spend:** Approximately $40–$60/month

## Current workflow

Participant mainly chooses tools based on coding speed and response quality rather than structured cost evaluation. Subscriptions are usually reviewed only when monthly expenses noticeably increase.

## Direct quotes

> "I keep paying for tools because switching feels annoying even if I barely use one of them."

> "Sometimes I realize two tools are doing almost the same thing."

> "I would trust recommendations more if the pricing source was visible."

## Biggest pain points

* Subscription overlap between coding assistants
* Forgetting inactive subscriptions
* No simple overview of total AI spend

## Surprising observations

* Convenience mattered more than absolute cost savings
* Participant preferred conservative recommendations over aggressive optimization claims

## Trust concerns or objections

* Did not want AI-generated financial advice without explanation
* Wanted visibility into how recommendations were calculated

## Product decisions influenced by this interview

* Kept deterministic recommendation logic instead of AI-generated savings decisions
* Added emphasis on visible pricing sources and transparent reasoning

---

# Interview 2

**Date:** 2026-05-11

**Participant:** Student developer regularly using AI tools for projects and learning

**Relationship:** Friend

**Team size:** Individual usage

**Current AI tools in use:** ChatGPT, Gemini, Cursor

**Estimated monthly AI tooling spend:** Approximately $20–$30/month

## Current workflow

Participant experiments with multiple tools simultaneously and rarely tracks combined monthly spending intentionally.

## Direct quotes

> "I honestly never calculated how much all these subscriptions add up to together."

> "The report felt easier to understand than looking through billing pages."

> "I liked that it didn't pretend to know my business automatically."

## Biggest pain points

* Difficulty comparing overlapping tools
* Subscription fatigue
* Unclear value difference between tools

## Surprising observations

* Participant cared more about workflow clarity than exact savings numbers
* Shareable report links were seen as useful for discussing tool choices with teammates

## Trust concerns or objections

* Skeptical of exaggerated savings claims
* Wanted recommendations to remain explainable

## Product decisions influenced by this interview

* Kept savings estimates conservative
* Improved wording around overlap recommendations

---

# Interview 3

**Date:** 2026-05-11

**Participant:** Hackathon teammate building AI-assisted applications

**Relationship:** Hackathon collaborator

**Team size:** 4-person student project team

**Current AI tools in use:** ChatGPT, Claude, GitHub Copilot, Gemini

**Estimated monthly AI tooling spend:** Shared team spend approximately $80–$120/month

## Current workflow

Tool decisions are usually made informally during projects. Spending visibility is low because subscriptions are distributed across multiple individuals.

## Direct quotes

> "Nobody on the team really knows the total monthly AI cost."

> "The audit summary was useful because it grouped recommendations clearly."

> "I would probably use this before renewing subscriptions."

## Biggest pain points

* Distributed subscriptions across teammates
* Duplicate tooling across the same workflow
* Lack of centralized spend visibility

## Surprising observations

* Team valued simple summaries more than detailed analytics
* Participants preferred actionable recommendations over dashboards

## Trust concerns or objections

* Concerned about AI hallucinating financial recommendations
* Wanted deterministic outputs for repeated inputs

## Product decisions influenced by this interview

* Reinforced deterministic audit philosophy
* Kept report structure concise and shareable instead of dashboard-heavy

---

# Cross-Interview Synthesis

## Repeated patterns

* Most users do not actively track combined AI subscription costs
* Subscription overlap is common across coding workflows
* Users trusted transparent recommendations more than opaque AI suggestions

## Most common operational issue

Participants often continued paying for overlapping tools simply because cancelling or evaluating alternatives required effort.

## Most surprising insight

Several participants valued clarity and trustworthiness more than maximizing savings estimates.

## Product decisions validated

* Deterministic recommendations instead of black-box AI financial advice
* Conservative savings estimates
* Shareable audit URLs
* Transparent pricing references

## Product decisions changed after interviews

* Recommendation explanations were simplified
* Greater emphasis placed on pricing transparency and overlap clarity

## Open questions for future research

* Whether teams would connect billing systems directly in a future version
* Whether historical spend tracking would meaningfully improve retention
