# ARCHITECTURE

## Stack
- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Supabase
- Vitest

## Why This Stack
Chosen for:
- fast iteration
- type safety
- production-grade scalability
- SEO and Open Graph support
- strong developer experience

## System Flow
User Input → Zustand Store → Audit Engine → Recommendation Output → Lead Capture → Shareable Report

## Planned Scaling
If scaled to 10k audits/day:
- move audit processing to background jobs
- add Redis caching
- optimize pricing lookup layer
- move report generation to async pipeline

Phase 2 — Pricing Intelligence & Audit Engine

## Audit Flow Architecture

The audit workflow is implemented as a deterministic multi-step form.

### Flow
1. Collect workflow and usage context
2. Capture team metadata
3. Collect subscribed AI tools and monthly spend
4. Validate inputs using Zod schemas
5. Generate deterministic recommendations through the audit engine
6. Persist results in Zustand state
7. Render recommendations in `/spend-report/[id]`

### Deterministic Design
The recommendation engine does not use AI inference or randomness.

All recommendations are generated synchronously from:
- pricing datasets
- rule-based evaluation
- overlap analysis
- savings calculations

This guarantees repeatable outputs for identical inputs.

## State Management

SpendLayer uses Zustand for lightweight client-side persistence.

### Stores
- `auditStore`
  - stores generated audit results
  - stores audit IDs
  - supports refresh-safe report rendering

- `auditFormStore`
  - stores in-progress form state
  - preserves multi-step progress

### Hydration Stability
Separate persistence keys are used to avoid state-shape collisions during hydration.

Mounted render gating is used to prevent SSR/client mismatch warnings.

## Testing Strategy

The project uses Vitest for deterministic unit and integration testing.

### Coverage Includes
- pricing validation
- audit engine recommendations
- savings calculations
- form validation
- audit submission flow
- report stabilization
- persistence-related behavior

Current status:
- 82 tests passing
- zero TypeScript build errors

