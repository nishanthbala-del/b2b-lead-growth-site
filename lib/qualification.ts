// The qualification model.
//
// ONE source of truth for the intake questions, the fit rules, and the wording of
// every outcome. The client component renders from these arrays; `app/api/lead/route.ts`
// re-runs `evaluateFit` on the server against the SAME rules rather than trusting the
// outcome the browser posted. Nothing here imports React or Next, so both sides can.
//
// Why fit is evaluated at all: before this, every visitor who completed the form was
// handed the same booking link. The site's own "not the right fit" list says plainly
// that a company with no customer history, a company that wants to buy homeowner
// leads, and a company with no capacity to take work are not people we can help — and
// then the form booked them a call anyway. A disqualifier the funnel ignores is not a
// disqualifier, it is decoration. These rules make the published list operative.
//
// Rules for changing this file:
//   * A `not_yet` outcome must name the SPECIFIC answer that produced it and point
//     somewhere genuinely useful. It is a redirection, not a rejection notice.
//   * Nothing here may promise an outcome. `evaluateFit` judges whether we can do the
//     work, never whether the work will produce jobs or revenue.
//   * Every disqualifier must correspond to an entry in `notFor` in lib/content.ts.
//     If the two drift, the site is screening on criteria it never published.

// The one published delivery window, imported rather than restated. lib/site.ts holds
// no React/Next imports either, so this stays usable from both the browser flow and the
// server route.
import { auditDeliveryWindow, contactEmail } from "./site.ts";

/* -------------------------------------------------------------------------- */
/*  Option sets — rendered by the UI, matched by the rules                      */
/* -------------------------------------------------------------------------- */

// Each option carries the `value` the rules match on and the `label` a visitor reads,
// so re-wording a question can never silently change who qualifies.
export type Option<V extends string = string> = { value: V; label: string; hint?: string };

export const YEARS_IN_BUSINESS = [
  { value: "under-2", label: "Under 2 years" },
  { value: "2-5", label: "2 to 5 years" },
  { value: "5-15", label: "5 to 15 years" },
  { value: "over-15", label: "More than 15 years" },
] as const satisfies readonly Option[];

export const RECORD_VOLUME = [
  {
    value: "none",
    label: "We don't really have a customer list yet",
    hint: "Too new to have built one up",
  },
  { value: "few-hundred", label: "A few hundred customers and estimates" },
  { value: "1k-5k", label: "Roughly 1,000 to 5,000 records" },
  { value: "5k-plus", label: "More than 5,000 records" },
  {
    value: "unsure-but-years",
    label: "Not sure of the number, but we have years of history",
  },
] as const satisfies readonly Option[];

// Average JOB value, in bands an HVAC company recognises: a service call and a full
// system replacement are an order of magnitude apart.
export const JOB_VALUE = [
  { value: "under-2500", label: "Under $2,500", hint: "Service and repair" },
  { value: "2500-7500", label: "$2,500 to $7,500" },
  { value: "7500-15000", label: "$7,500 to $15,000", hint: "Typical replacement" },
  {
    value: "15000-40000",
    label: "$15,000 to $40,000",
    hint: "Multi-system or light commercial",
  },
  { value: "over-40000", label: "$40,000 and up" },
] as const satisfies readonly Option[];

// The growth problem, in the words an owner would use. `buy-leads` is deliberately on
// this list: it is the single most common mismatch for this business, and asking it
// out loud is cheaper for everyone than discovering it fifteen minutes into a call.
export const GROWTH_PROBLEM = [
  {
    value: "unsold-estimates",
    label: "Unsold estimates and expired proposals nobody gets back to",
  },
  {
    value: "lapsed-customers",
    label: "Lapsed maintenance agreements and customers we've lost touch with",
  },
  { value: "thin-shoulder-season", label: "The schedule goes thin between seasons" },
  {
    value: "no-referral-pipeline",
    label: "No steady referral flow from builders, property managers or realtors",
  },
  { value: "paying-per-lead", label: "We pay per lead and it isn't working" },
  {
    value: "buy-leads",
    label: "We're looking to buy homeowner leads",
    hint: "Worth saying now — we're not a lead seller",
  },
  { value: "other", label: "Something else" },
] as const satisfies readonly Option[];

export const CURRENT_APPROACH = [
  { value: "word-of-mouth", label: "Nothing consistent — mostly word of mouth" },
  { value: "repeat-referrals", label: "Repeat customers and referrals" },
  { value: "google-ads", label: "Google Ads or Local Services Ads" },
  { value: "lead-marketplace", label: "Angi, Thumbtack, or a similar lead seller" },
  { value: "direct-mail", label: "Direct mail or home shows" },
  { value: "manual-callbacks", label: "Someone calls past customers when there's time" },
  { value: "renewal-process", label: "We have a maintenance-agreement renewal process" },
  { value: "other", label: "Something else" },
] as const satisfies readonly Option[];

// Who chases the follow-up today. This is the clearest read on whether the work we do
// is already being done — and it is the question that decides which tier fits.
export const FOLLOW_UP_OWNER = [
  { value: "nobody", label: "Nobody, consistently" },
  { value: "owner-sometimes", label: "The owner, when there's time" },
  { value: "office-part-time", label: "An office person, alongside everything else" },
  { value: "dedicated", label: "Someone whose actual job it is" },
] as const satisfies readonly Option[];

// Capacity. The middle option is the ideal customer, not a weak one: a company booked
// solid in August with a thin October is exactly who reactivation is for. Only the
// company that does not want more work at all is screened out.
export const CAPACITY = [
  { value: "room-now", label: "We could take more work now" },
  { value: "shoulder-thin", label: "Busy right now, but the shoulder season is thin" },
  {
    value: "at-capacity",
    label: "At capacity year-round, and not looking to add work",
  },
] as const satisfies readonly Option[];

export const EXPORT_READINESS = [
  {
    value: "crm",
    label: "Yes — ServiceTitan, Housecall Pro, Jobber, QuickBooks or similar",
  },
  { value: "spreadsheets", label: "Yes, but it's spreadsheets and paper" },
  { value: "unsure", label: "Not sure what we could get out" },
  { value: "no-records", label: "No — we don't keep records like that" },
] as const satisfies readonly Option[];

export const TIMELINE = [
  { value: "now", label: "Ready to start now" },
  { value: "30-days", label: "In the next 30 days" },
  { value: "quarter", label: "Sometime this quarter" },
  { value: "researching", label: "Just researching for now" },
] as const satisfies readonly Option[];

// Budget is asked as a tier, not a number, so the answer maps to something real.
export const BUDGET = [
  { value: "750", label: "$750/mo", hint: "Lead Engine" },
  { value: "1500", label: "$1,500/mo", hint: "Outreach Engine" },
  { value: "2500", label: "$2,500/mo", hint: "Appointment Engine" },
  { value: "unsure", label: "Not sure yet", hint: "The audit comes first" },
] as const satisfies readonly Option[];

type ValueOf<T extends readonly Option[]> = T[number]["value"];

export type YearsInBusiness = ValueOf<typeof YEARS_IN_BUSINESS>;
export type RecordVolume = ValueOf<typeof RECORD_VOLUME>;
export type JobValue = ValueOf<typeof JOB_VALUE>;
export type GrowthProblem = ValueOf<typeof GROWTH_PROBLEM>;
export type CurrentApproach = ValueOf<typeof CURRENT_APPROACH>;
export type FollowUpOwner = ValueOf<typeof FOLLOW_UP_OWNER>;
export type Capacity = ValueOf<typeof CAPACITY>;
export type ExportReadiness = ValueOf<typeof EXPORT_READINESS>;
export type Timeline = ValueOf<typeof TIMELINE>;
export type Budget = ValueOf<typeof BUDGET>;

/* -------------------------------------------------------------------------- */
/*  Answers                                                                     */
/* -------------------------------------------------------------------------- */

// Only the answers the RULES read. Contact details live on the form state and are
// deliberately absent here: fit must not depend on who is asking.
export type QualificationAnswers = {
  yearsInBusiness: YearsInBusiness | "";
  recordVolume: RecordVolume | "";
  jobValue: JobValue | "";
  growthProblem: GrowthProblem | "";
  currentApproach: CurrentApproach | "";
  followUpOwner: FollowUpOwner | "";
  capacity: Capacity | "";
  exportReadiness: ExportReadiness | "";
  timeline: Timeline | "";
  budget: Budget | "";
};

export const EMPTY_ANSWERS: QualificationAnswers = {
  yearsInBusiness: "",
  recordVolume: "",
  jobValue: "",
  growthProblem: "",
  currentApproach: "",
  followUpOwner: "",
  capacity: "",
  exportReadiness: "",
  timeline: "",
  budget: "",
};

/* -------------------------------------------------------------------------- */
/*  Outcome                                                                     */
/* -------------------------------------------------------------------------- */

export type Outcome =
  // Everything we need is there. Straight to the calendar.
  | "strong"
  // Workable, with something specific to confirm first. Still books a call, but the
  // page says what the open question is rather than pretending there isn't one.
  | "explore"
  // We cannot do this work for this company today. NO calendar link — offering one
  // would waste their time and ours, and it would contradict what the site publishes.
  | "not_yet";

export type FitResult = {
  outcome: Outcome;
  /** Fit points scored. Recorded on the lead so the owner sees the same number we did. */
  score: number;
  maxScore: number;
  headline: string;
  /** Why it fits — each line derived from a specific answer, never generic filler. */
  reasons: string[];
  /** What is unresolved. On `not_yet` this is the reason we cannot proceed. */
  watchouts: string[];
  /** One sentence naming the actual next action. */
  nextStep: string;
  /**
   * Whether to offer the walkthrough call.
   *
   * IMPORTANT: this is an OFFER, never a gate. The canonical offer spec
   * (20_MARKETING_MY_SERVICES_SYSTEM/free_pipeline_audit.md §5) is explicit that the
   * Free Pipeline Audit is delivered in writing and "a call is never their price" —
   * "Book a call to receive your free audit" is named there as the exact anti-pattern
   * to avoid. So a qualified visitor is told the audit is being built and sent; the
   * calendar sits next to that as a walkthrough of work they will already have.
   */
  offerBooking: boolean;
  /** Advisory starting tier, or null when the answers don't point anywhere clearly. */
  recommendedTier: "Lead Engine" | "Outreach Engine" | "Appointment Engine" | null;
  /** A genuinely useful page for this visitor, whatever the outcome. */
  suggestedReading: { href: string; label: string } | null;
};

export const MAX_FIT_SCORE = 14;

/* -------------------------------------------------------------------------- */
/*  Rules                                                                       */
/* -------------------------------------------------------------------------- */

// A blocking answer, the honest explanation, and somewhere better to send them.
// Each `id` maps to a published entry in `notFor` (lib/content.ts) — the comment
// names which, so the two cannot drift apart unnoticed.
type Block = {
  id: string;
  applies: (a: QualificationAnswers) => boolean;
  headline: string;
  reason: string;
  nextStep: string;
  reading: { href: string; label: string } | null;
};

const BLOCKS: Block[] = [
  {
    // notFor: "Anyone looking to buy homeowner leads. We are not a lead seller..."
    id: "wants-to-buy-leads",
    applies: (a) => a.growthProblem === "buy-leads",
    headline: "We're not what you're looking for.",
    reason:
      "You're after homeowner leads to buy, and we don't sell them. We don't sell, resell or broker leads of any kind, and we can't cold-source homeowners — the homeowner records we work are the ones already in a client's own system. Telling you that now is more useful than a call that ends the same way.",
    nextStep:
      "If you are going to buy leads, the guide below is the honest math on shared versus exclusive — including the FTC's case against HomeAdvisor. It's written by someone who sells neither.",
    reading: {
      href: "/shared-vs-exclusive-hvac-leads",
      label: "Shared vs. exclusive HVAC leads: the real cost per job",
    },
  },
  {
    // notFor: "Brand-new HVAC companies with no customer history yet — reactivation
    // needs records to work, and you don't have them"
    id: "no-history",
    applies: (a) => a.recordVolume === "none" || a.exportReadiness === "no-records",
    headline: "Not yet — there's nothing here to reactivate.",
    reason:
      "Half of what we do is working the demand you already paid for: unsold estimates, lapsed agreements, customers whose systems are now at replacement age. Without records, that half has nothing to run on. The referral-partner half would still work, but on its own it's a slow build, and we'd rather say so than take a monthly fee for it.",
    nextStep:
      "Come back when you have a year or two of estimates and customers in one place — that's when this starts paying for itself. Your details are with us either way.",
    reading: {
      href: "/hvac-lead-generation",
      label: "What HVAC leads actually cost, and your options right now",
    },
  },
  {
    // notFor: "Companies with no capacity to take the work..."
    id: "no-capacity",
    applies: (a) => a.capacity === "at-capacity",
    headline: "You don't need this right now.",
    reason:
      "You're at capacity year-round and not looking to add work. Filling a schedule that's already full isn't a problem worth paying to solve, and more booked appointments would just push out the ones you have.",
    nextStep:
      "If that changes — a slow season, another truck, a new service area — come back then. We'd rather you did that than pay for a month you couldn't use.",
    reading: null,
  },
];

// Fit points. Each dimension is worth 0-2 and each score is defensible out loud, which
// matters because the score is shown to the owner next to the lead.
const POINTS: Record<string, Record<string, number>> = {
  yearsInBusiness: { "under-2": 0, "2-5": 1, "5-15": 2, "over-15": 2 },
  recordVolume: { none: 0, "few-hundred": 1, "1k-5k": 2, "5k-plus": 2, "unsure-but-years": 2 },
  jobValue: {
    "under-2500": 0,
    "2500-7500": 1,
    "7500-15000": 2,
    "15000-40000": 2,
    "over-40000": 2,
  },
  capacity: { "room-now": 2, "shoulder-thin": 2, "at-capacity": 0 },
  exportReadiness: { crm: 2, spreadsheets: 1, unsure: 1, "no-records": 0 },
  timeline: { now: 2, "30-days": 2, quarter: 1, researching: 0 },
  // The less follow-up capacity exists today, the larger the gap this fills. A company
  // that already employs someone to do it scores lower because it needs us less — not
  // because it would be a worse client.
  followUpOwner: { nobody: 2, "owner-sometimes": 2, "office-part-time": 1, dedicated: 0 },
};

const STRONG_THRESHOLD = 10;

function label<T extends readonly Option[]>(options: T, value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Fit points for a set of answers. Unanswered questions score zero. */
export function scoreAnswers(a: QualificationAnswers): number {
  let total = 0;
  for (const [key, table] of Object.entries(POINTS)) {
    const value = a[key as keyof QualificationAnswers];
    total += (value && table[value]) || 0;
  }
  return total;
}

/**
 * Which tier the answers point at. Advisory only — the call sets the real one, and the
 * UI says so. The logic is the same argument the pricing section makes in prose: the
 * tier is decided by how much of the work the client's own office can absorb.
 */
export function recommendTier(a: QualificationAnswers): FitResult["recommendedTier"] {
  // A stated budget is a fact about the buyer, not a guess, so it wins outright.
  if (a.budget === "750") return "Lead Engine";
  if (a.budget === "1500") return "Outreach Engine";
  if (a.budget === "2500") return "Appointment Engine";

  // Someone whose actual job is follow-up can work a list. Hand them the list.
  if (a.followUpOwner === "dedicated") return "Lead Engine";

  // Wanting appointments on the calendar, with jobs big enough to justify the tier.
  const bigJobs =
    a.jobValue === "7500-15000" || a.jobValue === "15000-40000" || a.jobValue === "over-40000";
  if (
    bigJobs &&
    a.followUpOwner === "nobody" &&
    (a.growthProblem === "thin-shoulder-season" || a.growthProblem === "unsold-estimates")
  ) {
    return "Appointment Engine";
  }

  if (a.followUpOwner === "nobody" || a.followUpOwner === "owner-sometimes") {
    return "Outreach Engine";
  }
  if (a.followUpOwner === "office-part-time") return "Lead Engine";
  return null;
}

/** Reading that is actually relevant to the answers given. */
function suggestReading(a: QualificationAnswers): FitResult["suggestedReading"] {
  if (a.currentApproach === "lead-marketplace" || a.growthProblem === "paying-per-lead") {
    return {
      href: "/shared-vs-exclusive-hvac-leads",
      label: "Shared vs. exclusive HVAC leads: the real cost per job",
    };
  }
  if (a.timeline === "researching") {
    return {
      href: "/how-to-choose-a-lead-generation-agency",
      label: "How to choose a lead-gen company (and the questions that expose a bad one)",
    };
  }
  return { href: "/free-pipeline-audit", label: "What's in the free pipeline audit" };
}

// Reasons this fits, each tied to an answer the visitor actually gave. Generic
// encouragement is worse than none: a page that tells everyone they're a great fit
// tells nobody anything.
function buildReasons(a: QualificationAnswers): string[] {
  const out: string[] = [];

  if (a.recordVolume === "1k-5k" || a.recordVolume === "5k-plus" || a.recordVolume === "unsure-but-years") {
    out.push(
      "You have real history to work with — that is what we follow up on, and most of it has never been chased.",
    );
  }
  if (a.followUpOwner === "nobody") {
    out.push(
      "Nobody is consistently working the follow-up today, so this is filling a gap rather than duplicating someone's job.",
    );
  } else if (a.followUpOwner === "owner-sometimes") {
    out.push(
      "Follow-up currently depends on the owner having a quiet afternoon, which in season means it doesn't happen.",
    );
  }
  if (a.capacity === "shoulder-thin") {
    out.push(
      "A thin shoulder season is exactly the shape this suits: the work is already in your system, it just needs to be reached before the season turns.",
    );
  } else if (a.capacity === "room-now") {
    out.push("You have room on the schedule now, so anything this produces has somewhere to go.");
  }
  if (a.growthProblem === "unsold-estimates") {
    out.push(
      "Unsold estimates are the highest-intent records in any HVAC system — the homeowner already asked you for a price.",
    );
  }
  if (a.growthProblem === "lapsed-customers") {
    out.push(
      "Lapsed agreements and old customers are people who already chose you once, which is a very different conversation from a cold one.",
    );
  }
  if (a.growthProblem === "no-referral-pipeline") {
    out.push(
      "The partner lane is the half we research ourselves: builders, property managers and realtors near you, each with a cited public reason to reach out.",
    );
  }
  if (a.growthProblem === "paying-per-lead" || a.currentApproach === "lead-marketplace") {
    out.push(
      "You're paying per lead today. Nothing here is priced per lead, and nobody else is sold the same homeowner.",
    );
  }
  if (a.jobValue === "15000-40000" || a.jobValue === "over-40000") {
    out.push(
      "At your job values, a handful of recovered installs a year covers the fee several times over — your numbers, not a projection of ours.",
    );
  }
  if (a.exportReadiness === "crm") {
    out.push(
      "Your history is already in a system we can take an export from, which removes the step that usually sets the schedule.",
    );
  }
  return out;
}

// Open questions. On a `strong` result these are things the call confirms; on
// `explore` they are the reason it is only `explore`.
function buildWatchouts(a: QualificationAnswers): string[] {
  const out: string[] = [];

  if (a.exportReadiness === "spreadsheets") {
    out.push(
      "Your records live in spreadsheets and on paper. That is workable — cleaning and deduping is part of the job — but it sets the start date, so it's the first thing we'd look at.",
    );
  }
  if (a.exportReadiness === "unsure") {
    out.push(
      "You're not sure what you could export. Worth finding out before the call: past customers, open and expired estimates, agreement status, and install dates are the fields that matter.",
    );
  }
  if (a.recordVolume === "few-hundred") {
    out.push(
      "A few hundred records is a thin list to reactivate. It can still be worth working, but the partner lane would likely carry more of the weight, and we'd say so rather than stretch the list.",
    );
  }
  if (a.yearsInBusiness === "under-2") {
    out.push(
      "Under two years in business means less history than this is usually built on. Not a blocker on its own, but it changes which lane leads.",
    );
  }
  if (a.jobValue === "under-2500") {
    out.push(
      "At service-and-repair job values the fee is a bigger share of each job won. Worth doing that arithmetic with your own numbers before you commit to a tier.",
    );
  }
  if (a.timeline === "researching") {
    out.push(
      "You're researching rather than ready. That's fine — the audit is free and yours to keep, and nothing starts until you say so.",
    );
  }
  if (a.followUpOwner === "dedicated") {
    out.push(
      "You already have someone whose job is follow-up. That usually points at the lower tier: we build and rank the list, and your person works it.",
    );
  }
  return out;
}

/**
 * The whole fit decision. Pure and total: same answers in, same result out.
 *
 * Evaluated on the server as well as the browser — the outcome the client posts is a
 * display artifact, and the record the owner reads is computed here from the answers.
 */
export function evaluateFit(a: QualificationAnswers): FitResult {
  const score = scoreAnswers(a);

  const block = BLOCKS.find((b) => b.applies(a));
  if (block) {
    return {
      outcome: "not_yet",
      score,
      maxScore: MAX_FIT_SCORE,
      headline: block.headline,
      reasons: [],
      watchouts: [block.reason],
      // Every block is triggered by a SINGLE radio answer, and a visitor can pick the
      // wrong one — "at capacity" from an owner who meant this month, "no records" from
      // one who has them in a filing cabinet rather than a CRM. Screening people out
      // honestly is the point of this flow and stays; screening them out with no way to
      // say "you've read that wrong" is just a dead end. So the disqualification keeps
      // its reason and its reading, and gains a person to reply to. Deliberately NOT a
      // booking link: the block stands unless a human says otherwise, and offering a
      // calendar here would be the politeness the outcome copy exists to refuse.
      nextStep: `${block.nextStep} If we have read your situation wrong — and one answer on a form is a thin way to judge a business — reply to ${contactEmail} and tell us what we missed. A person reads it.`,
      offerBooking: false,
      recommendedTier: null,
      suggestedReading: block.reading,
    };
  }

  const reasons = buildReasons(a);
  const watchouts = buildWatchouts(a);
  const tier = recommendTier(a);

  if (score >= STRONG_THRESHOLD) {
    return {
      outcome: "strong",
      score,
      maxScore: MAX_FIT_SCORE,
      headline: "This is the kind of company we do our best work for.",
      reasons,
      watchouts,
      nextStep: `Next: we build your free pipeline audit and send it over in writing, within ${auditDeliveryWindow} — the job profile, 3-5 cited referral partners, and one sample message. You don't have to talk to anyone to get it${
        tier ? `, and nothing is decided about ${tier} until you've seen the work` : ""
      }.`,
      offerBooking: true,
      recommendedTier: tier,
      suggestedReading: suggestReading(a),
    };
  }

  return {
    outcome: "explore",
    score,
    maxScore: MAX_FIT_SCORE,
    headline: "Worth a conversation — with one or two things to confirm first.",
    reasons,
    watchouts,
    nextStep:
      `Next: we build your free pipeline audit and send it over in writing within ${auditDeliveryWindow}, same as anyone else — the open questions above don't cost you the audit. If they turn out to be dealbreakers once we've looked, we'll tell you plainly instead of selling you a month of it.`,
    offerBooking: true,
    recommendedTier: tier,
    suggestedReading: suggestReading(a),
  };
}

/**
 * A one-line summary of the answers, written onto the lead record so the owner reads
 * the same qualification the visitor saw without opening a second system.
 */
export function summarizeAnswers(a: QualificationAnswers): string {
  const parts = [
    a.yearsInBusiness && `${label(YEARS_IN_BUSINESS, a.yearsInBusiness)} in business`,
    a.recordVolume && label(RECORD_VOLUME, a.recordVolume),
    a.jobValue && `avg job ${label(JOB_VALUE, a.jobValue)}`,
    a.growthProblem && `problem: ${label(GROWTH_PROBLEM, a.growthProblem)}`,
    a.currentApproach && `today: ${label(CURRENT_APPROACH, a.currentApproach)}`,
    a.followUpOwner && `follow-up: ${label(FOLLOW_UP_OWNER, a.followUpOwner)}`,
    a.capacity && label(CAPACITY, a.capacity),
    a.exportReadiness && `export: ${label(EXPORT_READINESS, a.exportReadiness)}`,
    a.timeline && label(TIMELINE, a.timeline),
    a.budget && `budget: ${label(BUDGET, a.budget)}`,
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Every rule-bearing question, so the API can validate without restating the list. */
export const ANSWER_KEYS = Object.keys(EMPTY_ANSWERS) as (keyof QualificationAnswers)[];

/**
 * Plain-English name for each question.
 *
 * Read by app/api/lead/route.ts (so an incomplete submission names the question the
 * visitor saw, not a field key) AND by /privacy (so the published list of what we
 * collect is generated from what the form actually asks). The privacy policy used to
 * hand-list the fields, which meant every new question silently falsified it.
 */
export const QUESTION_LABELS: Record<keyof QualificationAnswers, string> = {
  yearsInBusiness: "how long you have been in business",
  recordVolume: "roughly how much customer history you hold",
  jobValue: "your typical job value",
  growthProblem: "the growth problem you picked",
  currentApproach: "how new work reaches you today",
  followUpOwner: "who handles follow-up today",
  capacity: "whether you could take on more work",
  exportReadiness: "whether you could export your customer records",
  timeline: "when you would want to start",
  budget: "which monthly fee you are weighing up",
};

/** The option set backing each question, for server-side validation of posted values. */
export const ANSWER_OPTIONS: Record<keyof QualificationAnswers, readonly Option[]> = {
  yearsInBusiness: YEARS_IN_BUSINESS,
  recordVolume: RECORD_VOLUME,
  jobValue: JOB_VALUE,
  growthProblem: GROWTH_PROBLEM,
  currentApproach: CURRENT_APPROACH,
  followUpOwner: FOLLOW_UP_OWNER,
  capacity: CAPACITY,
  exportReadiness: EXPORT_READINESS,
  timeline: TIMELINE,
  budget: BUDGET,
};

/**
 * Keep only values that appear in the published option set for their question.
 * Free text posted into a rule-bearing field must never reach the scoring tables or
 * the owner's spreadsheet.
 */
export function sanitizeAnswers(raw: Partial<Record<string, unknown>>): QualificationAnswers {
  const out = { ...EMPTY_ANSWERS };
  for (const key of ANSWER_KEYS) {
    const value = String(raw[key] ?? "");
    if (ANSWER_OPTIONS[key].some((o) => o.value === value)) {
      (out[key] as string) = value;
    }
  }
  return out;
}
