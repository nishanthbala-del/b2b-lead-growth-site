// Single source of truth for the site's absolute base URL.
// We PIN the stable Vercel production URL as the canonical default. This guarantees
// that canonical/OG/sitemap/robots/JSON-LD always point at the stable production
// origin — never at a per-deployment preview hostname (the long *.vercel.app URL),
// never at localhost, and never at a custom domain we don't own. Canonical URLs are
// supposed to point at production even when rendered from a preview build, so pinning
// is the SEO-correct behavior. An explicit NEXT_PUBLIC_SITE_URL still overrides — set
// it only if a real custom domain is added later.
// DELIBERATELY NOT an env var, for the same reason as `bookingUrl` below: an env
// override cannot be read from the repo, so nothing can verify what the deployed
// build actually canonicalised to. A stale NEXT_PUBLIC_SITE_URL left over from the
// pre-domain deployment would silently keep pointing every canonical, og:url,
// sitemap entry and JSON-LD @id at the throwaway *.vercel.app hostname while the
// brand domain served identical content - which is exactly the state this replaced.
// Canonical URLs are supposed to name production even when rendered from a preview
// build, so a single pinned value is also the SEO-correct behaviour.
export const siteUrl = "https://www.b2bleadgrowth.com";

export const brandName = "B2B Lead Growth";

// Canonical organization/service description used in JSON-LD structured data.
// Names the ONE niche (established residential HVAC) and both lanes the service
// actually runs — reactivating the client's own records, and researched referral
// partners carrying a public source citation. It deliberately does NOT claim to
// generate homeowner leads: homeowner records are the client's own export under
// gate #0f and are never researched, bought, or inferred.
export const orgDescription =
  "B2B Lead Growth is an HVAC lead generation and appointment setting service for established residential HVAC companies: it reactivates the unsold estimates, lapsed maintenance agreements, and past customers already in your system, and builds referral-partner pipelines from cited public sources. Not a lead seller.";

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
// DELIBERATELY NOT an env var. This link had FOUR values across the system at once
// (nvD1n6y2 canonical, cyDCVBd2 + FsAYPV9Y retired, and 1gmKxyRv shipped by a stale
// Vercel env var that silently overrode the code). An env override cannot be verified
// from the repo, so `scripts/check_cross_repo.py` in the operating-system repo could
// only ever warn about it. Hardcoding makes the deployed value readable from the
// commit and keeps the site and the outbound email signature provably identical.
// Canonical source: 00_CONTROL_CENTER/sender_identity.yaml -> booking_link.
export const bookingUrl = "https://calendar.app.google/nvD1n6y2gzRzjeMS7";

// The scheduler's actual appointment length. Stated on the site so the promise
// matches the calendar slot a visitor lands on.
export const callLengthMinutes = 15;

// The intake form's real length, published in ONE place. It was quoted as "60 seconds"
// on the homepage and "2 minutes" on every guide page — one form, two promises, and the
// shorter one is the one a visitor measures you against.
//
// Raised from 2 to 3 when the two-step form became the four-step fit check. Ten of the
// questions are one tap each, but four are free text, and 2 was the optimistic number
// rather than the measured one. Understating it is a small lie of exactly the kind this
// site is built to avoid, and it is the first promise a visitor gets to check.
export const intakeMinutes = 3;

// The work is delivered remotely, so any US HVAC company can be served — that stays
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
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "nishanth@b2bleadgrowth.com";
export const legalEntity = process.env.NEXT_PUBLIC_LEGAL_ENTITY?.trim() || "";

// The legal name shown on legal pages. This was held at the TRADE name while formation
// was unverified. Formation is now CONFIRMED — the operating-system repo's
// 00_CONTROL_CENTER/sender_identity.yaml records entity_confirmed: true and
// entity_legal_name "B2B Lead Growth LLC" (Certificate of Formation filed + EIN issued,
// Mini Balaji as sole member/signatory, New Jersey, owner-confirmed 2026-08-21), so this
// is now the exact registered name. Keep it in lockstep with that file.
export const legalEntityName = "B2B Lead Growth LLC";

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

// Governing-law state for the Terms of Service (CONFIRM with counsel). Same state as
// formation (sender_identity.yaml entity_state).
export const governingLawState = "New Jersey";

// State of formation, published on /terms so the contracting party is identifiable.
// Source: 00_CONTROL_CENTER/sender_identity.yaml -> entity_state.
export const entityFormationState = "New Jersey";

// Notice window (in days) either party may cancel on. Published on /terms AND asserted in
// marketing copy, so it lives in one place — a mismatch between the pricing pitch and the
// Terms is exactly the contradiction a buyer or a chargeback reviewer looks for.
export const cancellationNoticeDays = 14;

// Last-updated stamp shown on /terms and /privacy. Bump BOTH together, and only on a
// substantive edit. The ISO form exists because app/sitemap.ts needs a machine-safe date —
// parsing the display string relies on locale-dependent Date behaviour.
export const legalLastUpdated = "August 8, 2026";
export const legalLastUpdatedISO = "2026-08-08";
