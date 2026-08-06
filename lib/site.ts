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
  "https://calendar.app.google/cyDCVBd2XhpuBCvG9";

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
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";
export const legalEntity = process.env.NEXT_PUBLIC_LEGAL_ENTITY?.trim() || "";
