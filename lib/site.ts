// Single source of truth for the site's absolute base URL.
// We PIN the stable Vercel production URL as the canonical default. This guarantees
// that canonical/OG/sitemap/robots/JSON-LD always point at the stable production
// origin — never at a per-deployment preview hostname (the long *.vercel.app URL),
// never at localhost, and never at a custom domain we don't own. Canonical URLs are
// supposed to point at production even when rendered from a preview build, so pinning
// is the SEO-correct behavior. An explicit NEXT_PUBLIC_SITE_URL still overrides — set
// it only if a real custom domain is added later.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://b2b-lead-growth-site.vercel.app";

export const brandName = "B2B Lead Growth";

// Canonical organization/service description used in JSON-LD structured data.
// Describes what is actually delivered — researched prospects carrying a public
// source citation, and optionally the outreach and booking on top — rather than the
// "verified" contact-data claim the system does not make.
export const orgDescription =
  "B2B Lead Growth builds outbound pipelines for contractors, service businesses, and B2B teams: researched prospects with public source citations, plus done-for-you outreach and booked calls.";

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------
// ONE source of truth for the scheduler link, so the intake form, the copy, and
// the docs can never drift apart again. The operating system's canonical link
// lives in `00_CONTROL_CENTER/sender_identity.yaml`; this must stay pointed at
// the same Google Calendar booking page so there is only ever one live link.
//
// NEXT_PUBLIC_* is inlined at BUILD time — changing it in Vercel requires a
// redeploy, so the hardcoded default is the canonical link rather than an
// empty string. That way a misconfigured build still books real calls.
export const bookingUrl =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
  "https://calendar.app.google/nvD1n6y2gzRzjeMS7";

// The scheduler's actual appointment length. Stated on the site so the promise
// matches the calendar slot a visitor lands on.
export const callLengthMinutes = 15;

// The work is delivered remotely, so any US business can be served — that stays
// the JSON-LD `areaServed`. But the campaigns actually running today are focused
// on New Jersey, so the visible copy says so: it is both more honest and more
// relevant to the people the outbound is currently reaching.
export const areaServed = "United States";
export const currentFocusArea = "New Jersey";

// ---------------------------------------------------------------------------
// Legal identity
// ---------------------------------------------------------------------------
// A privacy policy needs to say WHO is responsible for the data and give a way to
// reach them that isn't "fill in our sales form". Neither can be guessed, so both
// come from environment variables and the site degrades honestly when they're
// unset: the policy says the details are available on request rather than
// asserting an entity or an inbox that doesn't exist.
//
// Set these in Vercel (and .env.local) as soon as the business details exist:
//   NEXT_PUBLIC_CONTACT_EMAIL  e.g. hello@yourdomain.com
//   NEXT_PUBLIC_LEGAL_ENTITY   e.g. "Example Lead Growth LLC, New Jersey, USA"
// The env override is kept, but the fallback is a REAL monitored inbox rather than ""
// — the same posture this file already takes for `bookingUrl`. /terms renders
// `mailto:${contactEmail}` unguarded, so an unset variable would publish an empty
// mailto on a legal page, which is worse than degrading honestly.
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "nishanthbala419@gmail.com";
export const legalEntity = process.env.NEXT_PUBLIC_LEGAL_ENTITY?.trim() || "";

// The legal name shown on legal pages. Keep this as the TRADE name until the LLC is
// verified formed and in good standing — do NOT publish "LLC" the entity can't back.
// Once formation is confirmed, set this to the exact registered name.
export const legalEntityName = "B2B Lead Growth";

// The named person behind the business. The site claims the service is founder-run and
// that there is no account manager between the client and the person responsible — that
// claim is only checkable if the person is named. This MUST stay in lockstep with the
// outbound sender identity (operating-system repo: 00_CONTROL_CENTER/sender_identity.yaml,
// from_name) so a prospect who gets an email and then visits the site sees the same name.
// This is founder attribution, NOT a claim of legal signatory authority.
export const founderName = "Nishanth Balaji";

// Commercial / PO-box / registered-agent mailing address. DO NOT use a private residence.
// Leave "" until a commercial address exists — the address line renders ONLY when this is set.
export const businessMailingAddress = "";

// Governing-law state for the Terms of Service (CONFIRM with counsel).
export const governingLawState = "New Jersey";

// Notice window (in days) either party may cancel on. Published on /terms AND asserted in
// marketing copy, so it lives in one place — a mismatch between the pricing pitch and the
// Terms is exactly the contradiction a buyer or a chargeback reviewer looks for.
export const cancellationNoticeDays = 14;

// Last-updated stamp shown on /terms and /privacy. Bump BOTH together, and only on a
// substantive edit. The ISO form exists because app/sitemap.ts needs a machine-safe date —
// parsing the display string relies on locale-dependent Date behaviour.
export const legalLastUpdated = "August 8, 2026";
export const legalLastUpdatedISO = "2026-08-08";
