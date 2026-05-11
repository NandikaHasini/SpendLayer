# Tests

## Testing Philosophy

SpendLayer uses deterministic testing to verify:

* recommendation consistency
* pricing correctness
* frontend stability
* persistence reliability
* hydration safety

The project intentionally avoids flaky or non-deterministic tests.

---

## Test Coverage

### Pricing Tests

Verify:

* pricing dataset consistency
* vendor metadata integrity
* pricing lookup correctness

### Calculator Tests

Verify:

* savings calculations
* annualization logic
* optimization calculations
* significance thresholds

### Audit Engine Tests

Verify:

* deterministic recommendations
* downgrade logic
* redundancy detection
* API_USAGE informational behavior

### Form Validation Tests

Verify:

* Zod validation behavior
* user-friendly validation messaging
* multi-step workflow validation

### Submission Flow Tests

Verify:

* audit submission
* deterministic report generation
* report rendering integration

### Stabilization Tests

Verify:

* hydration-safe state handling
* numeric input stabilization
* persistence behavior
* fallback rendering

### Persistence Tests

Verify:

* Supabase persistence behavior
* report retrieval
* refresh-safe rendering
* invalid report handling

---

## Current Verification Status

Expected pre-submission checks:

* `npm test` should pass.
* `npm run build` should pass.
* Deterministic audit outputs should remain stable.
* Persistence behavior should degrade gracefully when optional services are unavailable.

Previously captured screenshots in `docs/screenshots/terminal-tests.png` and `docs/screenshots/terminal-build.png` should be refreshed by the submitter if code changes are made after this audit.

## Verification Commands

### Run tests

```bash
npm test
```

### Production build

```bash
npm run build
```

### Development server

```bash
npm run dev
```
