// The qualification model.
//
// ONE source of truth for the intake questions, the fit rules, and the wording of
// every outcome. The client component renders from these arrays; `app/api/lead/route.ts`
// re-runs `evaluateFit` on the server against the SAME rules rather than trusting the
// outcome the browser posted. Nothing here imports React or Next, so both sides can.
//
// Why fit is evaluated at all: before this, every visitor who completed the form was
// handed the same booking link. The site's own "not the right fit" list says plainly
// that a residential-only shop, a company that wants to buy homeowner leads, a company
// with no capacity to take accounts, and a company already running its own outbound
// seat are not people we can help — and a form that books them a call anyway makes the
// published list decoration. These rules make it operative.
//
// REBUILT 2026-09-10 for D-025. The previous model asked how much CUSTOMER HISTORY a
// shop held and whether it could EXPORT it, because the service was residential
// reactivation and a client's own records were the only prospect base it could lawfully
// work. The live model is managed outbound for HVAC contractors with commercial work:
// the accounts are businesses we research from public sources, so the fit questions now
// ask the commercial ICP (core/icp.py in the operating-system repo) — already sells and
// completes commercial work; someone who quotes and wins those bids; room for more
// accounts; no consistent way to find target accounts and follow up with them. The
// client's own account history is an optional second lane and is never asked as a
// precondition.
//
// Rules for changing this file:
//   * A `not_yet` outcome must name the SPECIFIC answer that produced it and point
//     somewhere genuinely useful. It is a redirection, not a rejection notice.
//   * Nothing here may promise an outcome. `evaluateFit` judges whether we can do the
//     work, never whether the work will produce accounts or revenue.
//   * Every disqualifier must correspond to an entry in `notFor` in lib/content.ts.
//     If the two drift, the site is screening on criteria it never published.
//   * A residential-only decline is a reason not to sell to that CONTRACTOR. It is never,
//     in any wording, a suggestion that homeowners could be contacted instead.

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

// THE question. A shop with no commercial work has no account base for us to build
// from, and homeowners are never contacted, so "none" is a hard block. A mixed shop is
// the typical fit, not a weak one: D-025 says a commercial COMPONENT, and a
// commercial-only reading would decline exactly the contractors this is built for.
export const COMMERCIAL_SHARE = [
  {
    value: "none",
    label: "None — we're residential only",
    hint: "Homes, not buildings",
  },
  { value: "occasional", label: "A few commercial jobs a year, mostly residential" },
  {
    value: "steady",
    label: "A real share of the work — commercial service, maintenance or installs alongside residential",
  },
  { value: "most", label: "Most or all of it" },
] as const satisfies readonly Option[];

// Whether a conversation we start has somewhere to land. We research, reach, follow up
// and (on the top tier) book; the walkthrough, the bid and the close stay with the
// contractor at every tier, so somebody there has to do them.
export const COMMERCIAL_QUOTER = [
  { value: "nobody", label: "Nobody, really — we haven't bid commercial work" },
  { value: "owner-when-time", label: "The owner, when there's time" },
  { value: "dedicated", label: "An estimator or commercial manager whose job it is" },
] as const satisfies readonly Option[];

// Whether the target profile can be written at all. "Anyone with a building" cannot be
// researched or scored; naming the account types and the areas is what the list is
// built from. Needing help is not a block — the audit's first page IS that profile.
export const TARGET_ACCOUNTS = [
  {
    value: "can-name",
    label: "Yes — we can name the account types and the areas we want",
    hint: "e.g. property managers and office buildings in two counties",
  },
  { value: "roughly", label: "Roughly — we know the kind of building, not the list" },
  { value: "need-help", label: "We'd need help defining it" },
] as const satisfies readonly Option[];

// Typical COMMERCIAL job or contract value, in bands a contractor recognises. These are
// bands the visitor self-reports against, not a claim about what commercial work is
// worth; D-025 §9 deliberately leaves the commercial economics uncited.
export const JOB_VALUE = [
  { value: "under-5000", label: "Under $5,000", hint: "Service and repair" },
  {
    value: "5000-25000",
    label: "$5,000 to $25,000",
    hint: "Maintenance agreements, smaller replacements",
  },
  {
    value: "25000-100000",
    label: "$25,000 to $100,000",
    hint: "Rooftop units, multi-site service contracts",
  },
  { value: "over-100000", label: "$100,000 and up", hint: "Larger installs, portfolio contracts" },
] as const satisfies readonly Option[];

// The growth problem, in the words an owner would use. `buy-leads` is deliberately on
// this list: it is the single most common mismatch for this business, and asking it
// out loud is cheaper for everyone than discovering it fifteen minutes into a call.
export const GROWTH_PROBLEM = [
  {
    value: "no-way-to-find-accounts",
    label: "No consistent way to find new commercial accounts",
  },
  {
    value: "follow-up-drops",
    label: "We start conversations, but the follow-up falls through",
  },
  {
    value: "referral-dependent",
    label: "Commercial work depends on referrals, and they're uneven",
  },
  {
    value: "not-on-bid-lists",
    label: "Bids come in, but we're not on the bid lists we want",
  },
  {
    value: "buy-leads",
    label: "We're looking to buy homeowner leads",
    hint: "Worth saying now — we're not a lead seller",
  },
  { value: "other", label: "Something else" },
] as const satisfies readonly Option[];

// How commercial work reaches the shop today. `in-house-outbound` is on the list for
// the same reason `buy-leads` is above: a shop that already runs the function we sell
// is a decline, and it is kinder to say so on screen than on a call.
export const CURRENT_APPROACH = [
  { value: "word-of-mouth", label: "Nothing consistent — mostly word of mouth" },
  { value: "repeat-referrals", label: "Repeat accounts and referrals" },
  { value: "bids-rfps", label: "Bids and RFPs we're invited to" },
  { value: "gc-relationships", label: "General contractors we've worked with" },
  {
    value: "in-house-outbound",
    label: "An in-house outbound or BDR seat",
    hint: "Someone whose job is finding accounts",
  },
  { value: "paid-ads", label: "Paid ads or a lead marketplace" },
  { value: "other", label: "Something else" },
] as const satisfies readonly Option[];

// Who follows up with commercial accounts today. This is the clearest read on whether
// the work we do is already being done — and it is the question that decides the tier.
export const FOLLOW_UP_OWNER = [
  { value: "nobody", label: "Nobody, consistently" },
  { value: "owner-sometimes", label: "The owner, when there's time" },
  { value: "office-part-time", label: "An office person, alongside everything else" },
  { value: "dedicated", label: "Someone whose actual job it is" },
] as const satisfies readonly Option[];

// Capacity. The middle option is the ideal customer, not a weak one: a shop booked
// solid in August with a thin October is exactly who a maintenance-agreement account
// suits. Only the company that does not want more accounts at all is screened out.
export const CAPACITY = [
  { value: "room-now", label: "We could take on more accounts now" },
  { value: "shoulder-thin", label: "Busy right now, but there's room in the shoulder seasons" },
  {
    value: "at-capacity",
    label: "At capacity year-round, and not looking to add accounts",
  },
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
export type CommercialShare = ValueOf<typeof COMMERCIAL_SHARE>;
export type CommercialQuoter = ValueOf<typeof COMMERCIAL_QUOTER>;
export type TargetAccounts = ValueOf<typeof TARGET_ACCOUNTS>;
export type JobValue = ValueOf<typeof JOB_VALUE>;
export type GrowthProblem = ValueOf<typeof GROWTH_PROBLEM>;
export type CurrentApproach = ValueOf<typeof CURRENT_APPROACH>;
export type FollowUpOwner = ValueOf<typeof FOLLOW_UP_OWNER>;
export type Capacity = ValueOf<typeof CAPACITY>;
export type Timeline = ValueOf<typeof TIMELINE>;
export type Budget = ValueOf<typeof BUDGET>;

/* -------------------------------------------------------------------------- */
/*  Answers                                                                     */
/* -------------------------------------------------------------------------- */

// Only the answers the RULES read. Contact details live on the form state and are
// deliberately absent here: fit must not depend on who is asking.
//
// Key order is the order the form asks them in; `ANSWER_KEYS` and the privacy page's
// published list both derive from it.
export type QualificationAnswers = {
  yearsInBusiness: YearsInBusiness | "";
  commercialShare: CommercialShare | "";
  commercialQuoter: CommercialQuoter | "";
  jobValue: JobValue | "";
  growthProblem: GrowthProblem | "";
  currentApproach: CurrentApproach | "";
  followUpOwner: FollowUpOwner | "";
  capacity: Capacity | "";
  targetAccounts: TargetAccounts | "";
  timeline: Timeline | "";
  budget: Budget | "";
};

export const EMPTY_ANSWERS: QualificationAnswers = {
  yearsInBusiness: "",
  commercialShare: "",
  commercialQuoter: "",
  jobValue: "",
  growthProblem: "",
  currentApproach: "",
  followUpOwner: "",
  capacity: "",
  targetAccounts: "",
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

// Eight scored dimensions, 0-2 each. Exported alongside the threshold so the tests
// assert against the published numbers rather than restating them.
export const MAX_FIT_SCORE = 16;
export const STRONG_THRESHOLD = 11;

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
    // notFor: "Anyone wanting to buy homeowner leads — we are not a lead seller, and we
    // never contact homeowners"
    id: "wants-to-buy-leads",
    applies: (a) => a.growthProblem === "buy-leads",
    headline: "We're not what you're looking for.",
    reason:
      "You're after homeowner leads to buy, and we don't sell them. We don't sell, resell or broker leads of any kind, and we never contact homeowners — the businesses we research on a client's behalf are commercial accounts: property managers, building owners, facility teams. Telling you that now is more useful than a call that ends the same way.",
    nextStep:
      "If you are going to buy leads, the guide below is the honest math on shared versus exclusive — including the FTC's case against HomeAdvisor. It's written by someone who sells neither.",
    reading: {
      href: "/shared-vs-exclusive-hvac-leads",
      label: "Shared vs. exclusive HVAC leads: the real cost per job",
    },
  },
  {
    // notFor: "Residential-only shops — we research commercial accounts, and a shop with
    // no commercial work has no account base for us to build"
    //
    // A decline of the CONTRACTOR, and the wording is deliberate: it says twice that
    // homeowners are never contacted, so nobody can read "residential-only is not a fit"
    // as "but for the right price we'd go after your homeowners instead".
    id: "residential-only",
    applies: (a) => a.commercialShare === "none",
    headline: "Not yet — this is built for commercial work.",
    reason:
      "Everything we do runs on the commercial side of an HVAC business: we research the property managers, building owners and facility teams that could become accounts, and we contact them in your name. A residential-only shop has no account base for that to build from, and we never contact homeowners — not from research, not from a purchased list, not at any price. We'd rather say so than take a monthly fee for work that has nothing to run on.",
    nextStep:
      "If commercial work is something you're moving into — a maintenance agreement for a building, a first rooftop unit — come back once you've won and completed a few of those. The guide below is what HVAC leads actually cost by channel, which is the honest map for a residential shop right now.",
    reading: {
      href: "/hvac-lead-generation-new-jersey",
      label: "What HVAC leads actually cost, and your options right now",
    },
  },
  {
    // notFor: "Companies at capacity year-round, or not looking to add accounts"
    id: "no-capacity",
    applies: (a) => a.capacity === "at-capacity",
    headline: "You don't need this right now.",
    reason:
      "You're at capacity year-round and not looking to add accounts. Filling a schedule that's already full isn't a problem worth paying to solve, and a new account arrives with response-time expectations you'd have to take from the ones you already serve.",
    nextStep:
      "If that changes — a slow season, another crew, a new service area — come back then. We'd rather you did that than pay for a month you couldn't use.",
    reading: null,
  },
  {
    // notFor: "Companies already running an in-house outbound or BDR team — you own
    // what we sell"
    //
    // A decline, not a competitive judgement (core/icp.py `mature_outbound`): the gap
    // the service fills — no consistent way to find accounts and follow up — is not
    // this shop's gap, so managed outbound is not the thing that would change its month.
    id: "in-house-outbound",
    applies: (a) => a.currentApproach === "in-house-outbound",
    headline: "You already have what we sell.",
    reason:
      "Commercial work reaches you through an in-house outbound seat — someone whose job is to find accounts and follow up with them. That is the exact gap this service fills, so for you it would be a second copy of a function you already run, not an addition. It isn't a judgement on the business; it's that managed outbound isn't the thing that would change your month.",
    nextStep:
      "If that seat goes away, or you open a territory it can't cover, come back then. The guide below is the checklist we'd want any outbound effort measured against, in-house or vendor.",
    reading: {
      href: "/how-to-choose-a-lead-generation-agency",
      label: "How to choose a lead-gen company (and the questions that expose a bad one)",
    },
  },
];

/** The published block ids, in evaluation order. Tests hold this equal to `notFor`. */
export const BLOCK_IDS: readonly string[] = BLOCKS.map((b) => b.id);

// Fit points. Each dimension is worth 0-2 and each score is defensible out loud, which
// matters because the score is shown to the owner next to the lead.
const POINTS: Record<string, Record<string, number>> = {
  yearsInBusiness: { "under-2": 0, "2-5": 1, "5-15": 2, "over-15": 2 },
  // A mixed shop scores the same as a commercial-only one: the account base exists in
  // both. Only the occasional-job shop scores lower, and it gets a watchout, not a block.
  commercialShare: { none: 0, occasional: 1, steady: 2, most: 2 },
  commercialQuoter: { nobody: 0, "owner-when-time": 1, dedicated: 2 },
  targetAccounts: { "can-name": 2, roughly: 1, "need-help": 0 },
  jobValue: {
    "under-5000": 0,
    "5000-25000": 1,
    "25000-100000": 2,
    "over-100000": 2,
  },
  capacity: { "room-now": 2, "shoulder-thin": 2, "at-capacity": 0 },
  timeline: { now: 2, "30-days": 2, quarter: 1, researching: 0 },
  // The less follow-up capacity exists today, the larger the gap this fills. A company
  // that already employs someone to do it scores lower because it needs us less — not
  // because it would be a worse client.
  followUpOwner: { nobody: 2, "owner-sometimes": 2, "office-part-time": 1, dedicated: 0 },
};

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

const BIG_CONTRACTS = new Set<JobValue | "">(["25000-100000", "over-100000"]);

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

  // Appointment Engine books qualified conversations onto a calendar. That only pays
  // when nobody is doing follow-up today, there is a named person to take the booked
  // conversation, and the contracts are big enough to justify the tier.
  if (
    BIG_CONTRACTS.has(a.jobValue) &&
    a.followUpOwner === "nobody" &&
    a.commercialQuoter === "dedicated"
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
  if (a.currentApproach === "paid-ads") {
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

  if (a.commercialShare === "most") {
    out.push(
      "Commercial work is most or all of what you do, so the accounts we research are the kind you already know how to win.",
    );
  } else if (a.commercialShare === "steady") {
    out.push(
      "You already sell and complete commercial work alongside residential — that is the account base this is built on.",
    );
  }
  if (a.commercialQuoter === "dedicated") {
    out.push(
      "Someone whose job is to quote and win commercial bids means a conversation we start has somewhere to land.",
    );
  }
  if (a.targetAccounts === "can-name") {
    out.push(
      "You can name the account types and areas you want, which is the profile we build the list from — the hardest part of targeting is already done.",
    );
  }
  if (
    (a.yearsInBusiness === "5-15" || a.yearsInBusiness === "over-15") &&
    (a.commercialShare === "steady" || a.commercialShare === "most")
  ) {
    out.push(
      "Years of completed commercial work means references a commercial buyer can call, which is the first thing one asks for.",
    );
  }
  if (a.followUpOwner === "nobody") {
    out.push(
      "Nobody is consistently following up with commercial accounts today, so this is filling a gap rather than duplicating someone's job.",
    );
  } else if (a.followUpOwner === "owner-sometimes") {
    out.push(
      "Follow-up with accounts currently depends on the owner having a quiet afternoon, which in season means it doesn't happen.",
    );
  }
  if (a.capacity === "shoulder-thin") {
    out.push(
      "Room in the shoulder seasons is the shape this suits: maintenance agreements and planned work are exactly what commercial accounts bring.",
    );
  } else if (a.capacity === "room-now") {
    out.push("You have room for more accounts now, so anything this produces has somewhere to go.");
  }
  if (a.growthProblem === "no-way-to-find-accounts") {
    out.push(
      "No consistent way to find new commercial accounts is the exact gap this is built to fill: a researched list, a named person, a reason to write, and the follow-up.",
    );
  }
  if (a.growthProblem === "follow-up-drops") {
    out.push(
      "Follow-up falling through is the cheapest problem here to fix — the sequence runs whether or not the week gets busy.",
    );
  }
  if (a.growthProblem === "referral-dependent") {
    out.push(
      "Referrals are the best work there is and the least predictable; this adds a list you control alongside them.",
    );
  }
  if (a.growthProblem === "not-on-bid-lists") {
    out.push(
      "Getting onto the right bid lists starts with the people who keep them — property managers, facility directors, general contractors — which is who we contact.",
    );
  }
  if (a.currentApproach === "bids-rfps") {
    out.push(
      "Bids and RFPs mean you already have a commercial sales process; this feeds it rather than replacing it.",
    );
  }
  if (BIG_CONTRACTS.has(a.jobValue)) {
    out.push(
      "At your contract values, a single account won in a year would cover the fee many times over — that is your arithmetic, not a projection of ours.",
    );
  }
  return out;
}

// Open questions. On a `strong` result these are things the call confirms; on
// `explore` they are the reason it is only `explore`.
function buildWatchouts(a: QualificationAnswers): string[] {
  const out: string[] = [];

  if (a.commercialShare === "occasional") {
    out.push(
      "Commercial is a small share of your work today. That's workable — the audit checks whether there's an account base to build from — but it's the first thing we'd look at, and we'd say so if it's too thin.",
    );
  }
  if (a.commercialQuoter === "nobody") {
    out.push(
      "There's nobody who quotes commercial bids today. A conversation we start needs someone to take the walkthrough and write the proposal — that stays yours at every tier — so this is the open question before anything else.",
    );
  } else if (a.commercialQuoter === "owner-when-time") {
    out.push(
      "Commercial quotes currently depend on the owner having time. Not a blocker, but the conversations we start will land on that same desk — worth deciding who takes them before the first batch.",
    );
  }
  if (a.targetAccounts === "roughly") {
    out.push(
      "You know the kind of building rather than the list. That is what the account profile in the audit is for; expect us to send it back for your corrections before anything is researched.",
    );
  } else if (a.targetAccounts === "need-help") {
    out.push(
      "Defining the target accounts is where we'd start. The audit's first page is that profile, and nothing is researched until you've corrected it.",
    );
  }
  if (a.yearsInBusiness === "under-2") {
    out.push(
      "Under two years in business means fewer completed commercial jobs to reference, and a commercial buyer usually asks for one on the first call. Not a blocker on its own, but it changes what we can cite for you.",
    );
  }
  if (a.jobValue === "under-5000") {
    out.push(
      "At service-and-repair values the fee is a bigger share of each job won. Worth doing that arithmetic with your own numbers before you commit to a tier.",
    );
  }
  if (a.timeline === "researching") {
    out.push(
      "You're researching rather than ready. That's fine — the audit is free and yours to keep, and nothing starts until you say so.",
    );
  }
  if (a.followUpOwner === "dedicated") {
    out.push(
      "You already have someone whose job is account follow-up. That usually points at the lower tier: we build and rank the list, and your person works it.",
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
      // wrong one — "at capacity" from an owner who meant this month, "residential
      // only" from one who does commercial maintenance and didn't think it counted.
      // Screening people out honestly is the point of this flow and stays; screening
      // them out with no way to say "you've read that wrong" is just a dead end. So the
      // disqualification keeps its reason and its reading, and gains a person to reply
      // to. Deliberately NOT a booking link: the block stands unless a human says
      // otherwise, and offering a calendar here would be the politeness the outcome
      // copy exists to refuse.
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
      nextStep: `Next: we build your free pipeline audit and send it over in writing, within ${auditDeliveryWindow} — the account profile, 3-5 cited commercial accounts, and one sample message. You don't have to talk to anyone to get it${
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
    a.commercialShare && `commercial share: ${label(COMMERCIAL_SHARE, a.commercialShare)}`,
    a.commercialQuoter && `quotes commercial: ${label(COMMERCIAL_QUOTER, a.commercialQuoter)}`,
    a.jobValue && `typical commercial job ${label(JOB_VALUE, a.jobValue)}`,
    a.growthProblem && `problem: ${label(GROWTH_PROBLEM, a.growthProblem)}`,
    a.currentApproach && `today: ${label(CURRENT_APPROACH, a.currentApproach)}`,
    a.followUpOwner && `follow-up: ${label(FOLLOW_UP_OWNER, a.followUpOwner)}`,
    a.capacity && label(CAPACITY, a.capacity),
    a.targetAccounts && `target accounts: ${label(TARGET_ACCOUNTS, a.targetAccounts)}`,
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
  commercialShare: "how much of your work is commercial",
  commercialQuoter: "who quotes and wins your commercial bids",
  jobValue: "your typical commercial job or contract value",
  growthProblem: "the growth problem you picked",
  currentApproach: "how commercial work reaches you today",
  followUpOwner: "who follows up with commercial accounts today",
  capacity: "whether you could take on more accounts",
  targetAccounts: "whether you can describe the commercial accounts you want",
  timeline: "when you would want to start",
  budget: "which monthly fee you are weighing up",
};

/** The option set backing each question, for server-side validation of posted values. */
export const ANSWER_OPTIONS: Record<keyof QualificationAnswers, readonly Option[]> = {
  yearsInBusiness: YEARS_IN_BUSINESS,
  commercialShare: COMMERCIAL_SHARE,
  commercialQuoter: COMMERCIAL_QUOTER,
  jobValue: JOB_VALUE,
  growthProblem: GROWTH_PROBLEM,
  currentApproach: CURRENT_APPROACH,
  followUpOwner: FOLLOW_UP_OWNER,
  capacity: CAPACITY,
  targetAccounts: TARGET_ACCOUNTS,
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
