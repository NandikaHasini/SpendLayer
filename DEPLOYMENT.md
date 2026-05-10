# Deployment Guide

SpendLayer is designed for deployment on Vercel with Supabase as the persistence backend.

---

## Prerequisites

- Node.js 20+
- Vercel account
- Supabase project (active — used for deterministic report storage and retrieval)

---

## Environment Variables

Set the following in your Vercel project settings under **Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |

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

### Lead Captures Table

Run this SQL in your Supabase SQL editor to enable lead capture persistence:

```sql
create table lead_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text,
  role text,
  team_size integer,
  audit_id text,
  created_at timestamptz default now()
);
```

Lead capture failures are handled gracefully — the report renders regardless of whether persistence succeeds.

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

---

## Production Environment Checklist

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL used by client and server integrations |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key for public Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only key for report and lead persistence |
| `RESEND_API_KEY` | No | Optional Resend key for report email delivery |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical production URL used for Open Graph metadata and report links |
| `ANTHROPIC_API_KEY` | No | Optional key for the supplemental AI summary layer |

## Resend Setup

1. Create a Resend account at [resend.com](https://resend.com)
2. Verify the sending domain you will use for SpendLayer report emails
3. Add `RESEND_API_KEY` to Vercel environment variables
4. Deploy and send a test report from a saved audit page

Email delivery is supplemental. Reports must continue to render and remain shareable when `RESEND_API_KEY` is unset.

## Open Graph Notes

- Set `NEXT_PUBLIC_APP_URL` to the production origin, for example `https://spendlayer.com`
- Add `public/og-image.png` at 1200x630 for social previews
- Verify the deployed page metadata resolves to the production URL

## Production Verification

Before release:

```bash
npm test
npm run build
```

Then verify:

- [ ] Test email delivery with a real Resend key
- [ ] Confirm report pages render with `RESEND_API_KEY` unset
- [ ] Confirm email failure does not block report access or interaction
- [ ] Confirm Open Graph preview uses `NEXT_PUBLIC_APP_URL` and `public/og-image.png`

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
