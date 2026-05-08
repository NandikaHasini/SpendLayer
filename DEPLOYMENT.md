# Deployment Guide

SpendLayer is designed for deployment on Vercel with Supabase as the persistence backend.

---

## Prerequisites

- Node.js 20+
- Vercel account
- Supabase project (active — used for deterministic report storage and retrieval)
- (Optional future integration) Anthropic API key for AI summaries
- (Optional future integration) Resend API key for transactional email

---

## Environment Variables

Set the following in your Vercel project settings under **Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `ANTHROPIC_API_KEY` | Optional | Anthropic API key for AI summaries — fails gracefully if absent |
| `RESEND_API_KEY` | Optional | Resend API key for transactional email — fails gracefully if absent |

---

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from **Settings → API**
3. Add both values to your Vercel environment variables

### Database Schema

Run these SQL statements in your Supabase SQL editor:

```sql
create table audit_reports (
  id text primary key,
  audit_input jsonb not null,
  audit_result jsonb not null,
  created_at timestamptz default now()
);
```

---

## Vercel Deployment Steps

1. Push your repository to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Set framework preset to **Next.js**
4. Add all required environment variables
5. Deploy

Verify build passes locally before deploying:

```bash
npm install --legacy-peer-deps
npm test
npm run build
```

---

## Important Architecture Notes

- The audit engine is fully deterministic and requires no external API calls
- Supabase persistence is active for report storage and shareable URL generation
- AI summaries via Anthropic are optional — if `ANTHROPIC_API_KEY` is absent or the API call fails, a deterministic fallback summary is shown
- Transactional email via Resend is optional — lead capture stores to Supabase regardless of email delivery status

---

## Post-Deployment QA Checklist

- [ ] Homepage loads without errors
- [ ] `/audit` route renders and all 4 form steps navigate correctly
- [ ] Submitting a valid audit navigates to `/spend-report/[id]`
- [ ] `/spend-report/[id]` renders the correct audit result
- [ ] Shareable URL loads audit data correctly for a new browser session
- [ ] No console errors in browser
- [ ] Mobile layout renders correctly on 375px viewport
- [ ] Lighthouse audit completed
- [ ] Accessibility reviewed
- [ ] Mobile responsiveness verified
