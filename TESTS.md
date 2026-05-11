# TESTS.md

# Tests

## Testing Philosophy

SpendLayer uses deterministic testing to verify:

* recommendation consistency,
* pricing correctness,
* persistence reliability,
* frontend stability,
* and graceful degradation behavior.

The project intentionally avoids flaky or probabilistic testing patterns.

Because the audit engine is deterministic, repeated inputs should always produce identical outputs.

---

# Current Test Status

Current verification state at the time of submission:

* 12 test files
* 138 passing tests
* successful production build
* zero TypeScript build errors

Verification commands:

```bash
npm test
npm run build
```

---

# Test File Breakdown

## tests/pricing.test.ts

Purpose:

* validates pricing dataset consistency
* verifies vendor metadata integrity
* verifies pricing lookup behavior

Covers:

* supported vendors
* plan pricing correctness
* workflow metadata consistency
* deterministic pricing retrieval

---

## tests/calculator.test.ts

Purpose:

* validates savings calculations

Covers:

* monthly savings calculations
* annualized savings
* significance thresholds
* optimization calculations

---

## tests/audit-engine.test.ts

Purpose:

* validates deterministic recommendation behavior

Covers:

* downgrade recommendations
* redundancy detection
* consolidation logic
* API_USAGE informational recommendations
* repeatable recommendation outputs

---

## tests/form-validation.test.ts

Purpose:

* validates audit form input behavior

Covers:

* Zod validation
* invalid input handling
* required fields
* workflow validation messaging

---

## tests/audit-submission.test.ts

Purpose:

* validates audit submission workflow

Covers:

* report generation flow
* submission handling
* deterministic audit integration

---

## tests/stabilization.test.ts

Purpose:

* validates frontend stabilization behavior

Covers:

* hydration-safe rendering
* persistence behavior
* fallback rendering
* numeric input normalization

---

## tests/report-storage.test.ts

Purpose:

* validates report persistence behavior

Covers:

* Supabase persistence flow
* report retrieval
* invalid report handling
* refresh-safe rendering

---

## tests/lead-capture.test.ts

Purpose:

* validates lead capture persistence flow

Covers:

* input normalization
* graceful persistence failures
* timeout-safe handling
* Supabase integration behavior

---

## tests/ai-summary.test.ts

Purpose:

* validates supplemental AI summary generation

Covers:

* fallback summary behavior
* deterministic-safe summary integration
* graceful AI degradation

---

## tests/email-report.test.ts

Purpose:

* validates transactional email delivery workflow

Covers:

* timeout-safe fetch behavior
* missing API key handling
* HTTP failure handling
* invalid JSON handling
* graceful delivery degradation

---

## tests/EmailReportForm.test.tsx

Purpose:

* validates client-side email form behavior

Covers:

* rendering behavior
* validation flow
* loading states
* success states
* graceful failure handling
* reset behavior

---

## tests/setup.test.ts

Purpose:

* validates baseline project test environment setup

Covers:

* shared setup behavior
* deterministic environment assumptions

---

# Manual Verification Performed

In addition to automated tests, manual verification included:

* testing audit flow on desktop and mobile layouts
* testing persisted report refresh behavior
* testing invalid report routes
* testing email delivery with a real inbox
* verifying Supabase inserts manually through Table Editor
* testing report sharing in incognito mode
* testing graceful fallback behavior when optional services fail

---

# Expected Pre-Submission Checks

Before submission:

```bash
npm test
npm run build
git status
```

Expected:

* tests pass
* production build succeeds
* working tree clean

---

# Screenshots

Terminal verification screenshots are stored in:

```text
docs/screenshots/terminal-tests.png
docs/screenshots/terminal-build.png
```

These should be refreshed if verification is rerun after significant code changes.
