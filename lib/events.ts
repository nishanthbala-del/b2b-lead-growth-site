// First-party conversion measurement: what a visitor DID on the path to the free audit.
//
// WHY THIS EXISTS. Until 2026-09-17 the only thing this site could count was a completed fit
// check. So "is the hero working?", "do people start the form and stop at step 3?", "do fit
// companies ever open the scheduler?" had no answer — and a page view is not an answer to any
// of them. These are the events between a visit and a conversation:
//
//   visit_start        a visit began: the first page of this tab's visit, where it came from
//                      (the attribution fields), and whether the screen was phone-sized
//   cta_click          the primary call to action was clicked (which page, which placement)
//   form_start         the first field of the fit check was touched
//   form_step          a step was completed and the next one shown (which step)
//   form_abandon       the tab was hidden or closed after form_start and before form_complete
//                      (the last step reached) — measurable abandonment, not a guess
//   form_complete      the fit check was submitted and saved
//   fit_outcome        strong | explore | not_yet, and the plan the answers pointed at
//                      (recorded by the SERVER from the same evaluateFit the visitor saw)
//   booking_opened     the scheduler link was opened from the result
//
// WHY visit_start WAS ADDED (2026-09-21). Every other event here happens AFTER a visitor has
// decided to act, so the Events tab could say what converted but never out of how many. Read on
// 2026-09-21, it held four rows since 2026-09-18, every one of them a test: zero real CTA clicks
// and zero fit checks started — and nothing could tell "nobody arrived" apart from "people
// arrived and left". That difference decides whether the next hour goes into getting found or
// into the pages, so it has to be measured, not guessed. One event per visit, fired once from
// the first page (components/AttributionCapture.tsx), carrying the same visit-origin fields
// every other event already carries: organic search, an AI assistant's link, a referral and a
// direct visit are then told apart by the referring host and the campaign tags, read by the same
// rules the operating system applies to a submission (core/attribution.py derive_channel) rather
// than by a second channel list kept here. Crawlers that run the page's script are discarded by
// the route (lib/request-guards.ts), so a rendering pass is not a visit.
//
// WHAT IT IS NOT. No third-party script, no advertising or analytics vendor, no cookie, no
// cross-site identifier, no fingerprint. `visitId` is a random value kept in this tab's
// sessionStorage so the steps of ONE visit can be read in order; it is never tied to a name or
// an email, it is not sent anywhere else, and it is gone when the tab closes. /privacy says
// all of this in words, generated from the list below.
//
// Nothing here imports React or Next: the browser helper, the API route and the tests share
// one closed vocabulary and one sanitizer. The server never trusts what the browser sent.

export const EVENT_NAMES = [
  "visit_start",
  "cta_click",
  "form_start",
  "form_step",
  "form_abandon",
  "form_complete",
  "fit_outcome",
  "booking_opened",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

/** Plain-English meaning of each event. Read by /privacy, so the published list is generated
 *  from what the code records — the same discipline as QUESTION_LABELS and ATTRIBUTION_LABELS. */
export const EVENT_LABELS: Record<EventName, string> = {
  visit_start: "that a visit began, on which page, and whether the screen was phone-sized",
  cta_click: "that the main button was clicked, and on which page",
  form_start: "that the fit check was started",
  form_step: "which step of the fit check was reached",
  form_abandon: "that the fit check was left unfinished, and at which step",
  form_complete: "that the fit check was completed",
  fit_outcome: "the fit result the form showed and the plan it suggested",
  booking_opened: "that the scheduling link was opened",
};

export type SiteEvent = {
  name: EventName;
  /** The page path the event happened on. Never a query string. */
  path: string;
  /** Where on the page (hero, plans, footer…) — a short label from a closed character set.
   *  For visit_start, the screen class instead: "mobile" or "desktop" (VISIT_SCREEN_CLASSES). */
  placement: string;
  /** Step number for form events; 0 otherwise. */
  step: number;
  /** strong | explore | not_yet for fit_outcome; "" otherwise. */
  outcome: string;
  /** The plan the answers pointed at, for fit_outcome; "" otherwise. */
  plan: string;
  /** Random per-tab value; see the note above. */
  visitId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingPath: string;
  referrerHost: string;
};

const TOKEN = /^[A-Za-z0-9_.-]{1,64}$/;
const PATH = /^\/[A-Za-z0-9/_-]{0,120}$/;
const OUTCOMES = new Set(["strong", "explore", "not_yet"]);
const PLANS = new Set(["Managed Outbound", "Opportunity Engine"]);

const token = (v: unknown): string => (typeof v === "string" && TOKEN.test(v) ? v : "");

/** Narrow an untrusted payload to a SiteEvent, or null when it is not one of ours. Every
 *  string is held to a closed character set because it ends up in a log a person reads. */
export function sanitizeEvent(raw: unknown): SiteEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = r.name;
  if (typeof name !== "string" || !(EVENT_NAMES as readonly string[]).includes(name)) return null;
  const path = typeof r.path === "string" && PATH.test(r.path) ? r.path : "/";
  const stepNum = Number(r.step);
  const step = Number.isInteger(stepNum) && stepNum >= 0 && stepNum <= 9 ? stepNum : 0;
  const outcome = typeof r.outcome === "string" && OUTCOMES.has(r.outcome) ? r.outcome : "";
  const plan = typeof r.plan === "string" && PLANS.has(r.plan) ? r.plan : "";
  const host = typeof r.referrerHost === "string" && /^[a-z0-9.-]{1,80}$/i.test(r.referrerHost) ? r.referrerHost : "";
  const landing = typeof r.landingPath === "string" && PATH.test(r.landingPath) ? r.landingPath : "";
  return {
    name: name as EventName,
    path,
    placement: token(r.placement),
    step,
    outcome,
    plan,
    visitId: token(r.visitId),
    utmSource: token(r.utmSource),
    utmMedium: token(r.utmMedium),
    utmCampaign: token(r.utmCampaign),
    landingPath: landing,
    referrerHost: host,
  };
}

export const VISIT_STORAGE_KEY = "blg_visit_v1";

/** The two screen classes a visit_start carries. Narrower than 768 CSS pixels reads as mobile —
 *  the same breakpoint the site's own layout switches at (Tailwind `md`). */
export const VISIT_SCREEN_CLASSES = ["mobile", "desktop"] as const;
export const MOBILE_MAX_WIDTH_PX = 767;
