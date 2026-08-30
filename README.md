# b2b-lead-growth-site

Marketing site and lead-intake flow for **B2B Lead Growth**, a B2B lead-generation
service. Next.js 15 (App Router) + Tailwind, deployed on Vercel.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## How it fits together

| Piece | Where |
| --- | --- |
| Landing page | `components/LeadGenerationLanding.tsx` |
| Fit check (`/start`): question flow + result | `components/qualification/QualificationFlow.tsx` |
| Guide page shell (the five indexable content pages) | `components/GuideLayout.tsx` |
| Page registry — drives the sitemap, nav, and per-page JSON-LD | `lib/pages.ts` |
| Copy that also feeds JSON-LD (plans, FAQs, audience) | `lib/content.ts` |
| Brand constants: canonical URL, booking link, call length, service area, legal identity | `lib/site.ts` |
| Lead API (validation, anti-spam, storage) | `app/api/lead/route.ts` |
| Security headers + CSP | `next.config.ts` |

The entry point is `/start`: a short fit check that returns a straight yes/no,
including no, then writes the lead to a Google Sheet via an Apps Script webhook and
offers the booking link on a pass.

## Before deploying

Read **[SETUP.md](./SETUP.md)** — it covers the Apps Script, the environment
variables, and the Vercel steps. Two things matter most:

- **`SHEETS_WEBHOOK_URL` and `SHEETS_WEBHOOK_SECRET` must be set in production.**
  Vercel's filesystem is ephemeral, so the Sheet is the only durable place a lead
  is stored. Without them, `/api/lead` logs `LEAD ... WAS NOT STORED ANYWHERE` and
  the visitor is told their details didn't save.
- **`NEXT_PUBLIC_BOOKING_URL` must match the operating system's canonical booking
  link** (`00_CONTROL_CENTER/sender_identity.yaml`). There is only ever one live
  link, and the site tells visitors the call is 15 minutes — set the appointment
  schedule to match.

## House rule for the copy

Nothing on this site may claim a result, client, or capability the service does not
actually have. There are no case studies, testimonials, logos, or performance
numbers on purpose — the business has not published client results yet, and the
site says so rather than inventing proof. `lib/content.ts` carries the same rule in
its comments; keep it that way when editing copy.
