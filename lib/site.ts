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
//
// REWRITTEN 2026-09-18 for D-028 (operating-system repo:
// 00_CONTROL_CENTER/decisions/D-028_two_offer_model.md, machine form core/offer.py): the two
// plans BY NAME, the handoff point of each (qualified conversations / accepted sales
// opportunities), and the boundary that holds on both. D-027's three levels, and its $750 plan,
// are retired; the note below is kept for the history of the sentence.
//
// (Previously) REWRITTEN 2026-09-17 for D-027 (operating-system repo:
// 00_CONTROL_CENTER/decisions/D-027_responsibility_tiers.md, machine form core/offer.py).
// It names the category (commercial HVAC managed outbound), the ONE niche (established HVAC
// contractors that already sell and complete commercial work — D-025), the three levels of
// responsibility BY NAME, and the boundary that holds on every one of them: the contractor
// estimates and closes. The previous wording said the service "handles the follow-up, and
// hands off qualified conversations" — which described only the middle plan, and used a
// noun ("qualified") that D-027 reserves for the $2,500 standard.
//
// BUSINESSES ONLY, SAID AS A POSITIVE (2026-09-18). It used to end "and homeowners are never
// contacted" — true (gate #0f in the operating system) but it put the retired residential
// model into the one sentence answer engines lift to describe the company. It now names who
// IS contacted — property managers, building owners and facility teams — and that no leads are
// sold, which keeps it filed away from the per-lead sellers without mentioning homeowners.
export const orgDescription =
  "B2B Lead Growth is a commercial HVAC managed outbound service for established HVAC contractors that already sell and complete commercial work. It finds the commercial accounts worth pursuing — property managers, building owners, facility teams and multi-site operators — from cited public sources, contacts the right people in the contractor's name, and hands the contractor's team qualified conversations. Two plans: Managed Outbound ($1,500 a month) hands over each qualified conversation with a warm introduction; the Opportunity Engine ($2,500 a month) develops each one into an accepted sales opportunity with the next sales step already set. The contractor always does the technical discovery, estimates and closes. Every account contacted is a business, and no leads are sold.";

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

// How long the free audit takes to arrive, in ONE place.
//
// This promise was already published on /free-pipeline-audit ("the audit arrives within
// a few business days, not instantly") and in the homepage's final CTA — but NOT on the
// fit check's own result screen, which is the one moment a visitor actually needs it.
// Someone who has just handed over their name, their company and ten answers was told
// "we build your audit and send it over" with no indication of whether that meant this
// afternoon or next month, and silence at that exact point is what an abandoned lead
// looks like. Single-sourcing it means the result screen cannot drift from the page
// that makes the promise.
//
// Deliberately the EXISTING published wording rather than a tighter number: stating a
// specific day count would be a new operational commitment, and that is the owner's
// call to make, not a side effect of fixing where the promise appears.
export const auditDeliveryWindow = "a few business days";

// GEOGRAPHY, as two separate facts that must never be collapsed into one.
//
// WHERE WE SERVE: the work is research from public sources plus email sent from the client's
// own mailbox, so it is delivered remotely for an HVAC contractor anywhere in the United
// States. That is the JSON-LD `areaServed` and what the visible copy says.
//
// WHERE WE ARE: a founder-run company based in New Jersey. True, checkable, and stated as
// exactly that.
//
// `currentFocusArea = "New Jersey"` used to sit here and was rendered as "currently focused
// on New Jersey" in the footer, the fit lists, an FAQ, the Terms and a dedicated
// /hvac-lead-generation-new-jersey page. It positioned a nationally deliverable service as a
// one-state business (D-027 mandate §8) on the strength of where its founder happens to live.
// Removed; tests/pricing-model.test.ts fails if New-Jersey-only positioning comes back.
export const areaServed = "United States";
export const basedIn = "New Jersey";

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

// Real external profiles for Organization.sameAs — the entity-corroboration signal
// search engines and answer engines use to decide a brand is a real, single entity
// rather than one unattached page. It is also the specific gap that keeps a new
// domain from being confidently named in an AI answer: nothing else on the web
// currently says this company exists.
//
// ONLY add profiles that actually exist and are owned by this business (a LinkedIn
// company page, Crunchbase, Clutch, GoodFirms). NEVER pre-add a planned one — a
// sameAs pointing at a 404 is a fabricated corroboration signal and is exactly the
// kind of claim this site is built not to make. The array renders nothing while
// empty, so wiring it now costs nothing and adding a profile later is a one-line edit.
//
// Restored from commit 2705c1a, which SEO_GROWTH_PLAN.md §8.4 records as shipped but
// which never reached this branch.
// Note: Google Business Profile is deliberately absent — an online-only business is
// ineligible under the 2026 rules (SEO_GROWTH_PLAN.md §9).
export const organizationProfiles: string[] = [];

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
// 2026-09-17: the SERVICE-DESCRIPTION passages of both documents moved to D-027 (plan names,
// what each plan does, the calling policy, nationwide geography, and the attribution fields
// the fit check now records). No liability, governing-law or dispute clause changed.
// 2026-09-18: /terms §2's example of the optional client-supplied lists now reads "your own
// past commercial accounts" (it listed the retired residential model's record types). No
// liability, governing-law or dispute clause changed.
// 2026-09-18 (D-028): the SERVICE-DESCRIPTION passages of /terms and /privacy moved from D-027's
// three levels to the two plans (Managed Outbound, Opportunity Engine), the warm handoff, and the
// retirement of the $750 plan. The §4 no-guarantee list gained "qualified conversations" and
// "accepted sales opportunities" (it only widens what we never promise). No liability,
// governing-law or dispute clause changed.
export const legalLastUpdated = "September 18, 2026";
export const legalLastUpdatedISO = "2026-09-18";
