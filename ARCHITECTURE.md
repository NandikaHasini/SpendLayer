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