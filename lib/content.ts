// Shared content arrays. Imported by the landing UI AND by the server pages that emit
// FAQPage / Service / Offer / DefinedTermSet JSON-LD — one source of truth keeps the
// structured data verbatim-matched to the visible text (a Google rich-results requirement).
//
// THE MODEL THIS FILE DESCRIBES (D-027, 2026-09-16): commercial HVAC managed outbound, sold
// as THREE LEVELS OF OPERATIONAL RESPONSIBILITY at one price ladder —
//
//     $750    Prospecting                  we find and contact suitable commercial accounts;
//                                          you take over at interest
//     $1,500  Managed Pipeline             we run outreach and follow-up, screen genuine
//                                          interest, and organize the handoff
//     $2,500  Qualified Opportunity Engine we qualify the opportunity, gather the relevant
//                                          context, coordinate the next step or site visit,
//                                          and prepare your team to estimate and close
//
// — never three versions of the same outreach with different volume limits. A lower plan
// never inherits a higher plan's responsibility, and on every plan the contractor estimates
// and closes. The buyer is unchanged from D-025: an established HVAC contractor that already
// sells and completes commercial work. Everyone we contact is a BUSINESS; homeowners are
// never contacted, from any source, at any price.
//
// CANONICAL SOURCE: the operating-system repo's core/offer.py (TIERS, RESPONSIBILITY,
// HANDOFF_STANDARDS, TERMINOLOGY, CONTRACTOR_BOUNDARY, TERMS, STEP_UPS, OUTCOME_METRIC,
// POSITIONING) and 00_CONTROL_CENTER/decisions/D-027_responsibility_tiers.md. Where a string
// there is canonical — the plan names, the one-liners, the positioning sentence, the
// boundary sentence, the definitions, the timeline phases — it is copied rather than
// paraphrased, and scripts/check_cross_repo.py in that repo plus tests/pricing-model.test.ts
// in this one fail if it drifts.
//
// WHAT THIS REPLACED. Until 2026-09-16 the plans were "Lead Engine / Outreach Engine /
// Appointment Engine": a list the client worked himself, then sending, then "qualified
// conversations booked onto your calendar". Three things were wrong with that under D-027 and
// are the reason the file was rewritten rather than renamed: the entry plan sent nothing (it
// now sends every first touch in the client's name), the word "qualified" was applied to an
// ordinary interested reply (it is now reserved for the $2,500 standard), and the top plan's
// headline was appointment setting (it is now a prepared opportunity — and no plan promises
// an appointment, a site visit, or a count of anything).

import { callLengthMinutes, intakeMinutes } from "./site.ts";

/* -------------------------------------------------------------------------- */
/*  The one positioning sentence, the boundary, the metric                     */
/* -------------------------------------------------------------------------- */

// core.offer.positioning_sentence(), verbatim. The homepage hero carries the same words as
// LITERAL JSX text (components/LeadGenerationLanding.tsx) because check_cross_repo.py reads
// that file, not this constant; tests/pricing-model.test.ts holds the two together.
export const positioningSentence =
  "We find the commercial accounts worth pursuing, contact the right people in your name, and hand each opportunity to your team at the level you chose — from first interest to a prepared opportunity your estimator can act on. We measure the work by one thing: interested prospects.";

// core.offer.BOUNDARY_SENTENCE, verbatim. True on every plan.
export const boundarySentence =
  "B2B Lead Growth prepares the opportunity. The HVAC contractor estimates and closes it.";

// core.offer.CONTRACTOR_BOUNDARY, verbatim. Each entry completes the sentence "We do not …".
export const contractorBoundary: string[] = [
  "perform technical HVAC inspections",
  "engineer solutions or specify equipment",
  "diagnose equipment",
  "determine final project scope",
  "create binding HVAC estimates or quotes",
  "set final pricing",
  "negotiate technical or contract terms",
  "guarantee contracts, appointments, site visits, qualified opportunities, revenue or sales",
  "replace the contractor's estimator or salesperson in closing",
];

// THE ONE ACTIVITY METRIC (core.offer.OUTCOME_METRIC). A measurement of what happened, never
// a promise — which is why the sentence carries its own denominators and no number.
// It was labelled "qualified conversations started" until D-027 reserved the word "qualified"
// for the $2,500 standard. The definition did not change; the noun did.
export const outcomeMetric = {
  label: "interested prospects",
  definition:
    "a relevant decision-maker at a commercial account that fits your profile who replied with genuine openness to continuing the conversation, with that interest confirmed by a person",
  denominators: ["accounts contacted", "outreach messages sent"],
  oneSentence:
    "We measure the work by interested prospects — a decision-maker at a commercial account that fits your profile who replied with genuine interest, confirmed by a person — always shown against the accounts contacted and the messages sent to get there. It is a count of what happened, not a commitment to a number.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Terminology — five terms, never interchangeable (D-027 §4)                 */
/* -------------------------------------------------------------------------- */

export type Term = { key: string; term: string; definition: string };

// core.offer.TERMINOLOGY. "the client approved" reads "you approved" here because the reader
// of this site IS the client; nothing else is changed. Rendered on /how-it-works (with a
// DefinedTermSet), /pricing and /commercial-hvac-lead-generation from this one array.
export const terminology: Term[] = [
  {
    key: "prospect",
    term: "Prospect",
    definition:
      "A commercial account, or a contact at one, that matches the targeting requirements you approved. Always a business — never a homeowner.",
  },
  {
    key: "interested-prospect",
    term: "Interested Prospect",
    definition:
      "A relevant contact expressing genuine openness to continuing the conversation, confirmed by a person rather than a keyword match.",
  },
  {
    key: "screened-interest",
    term: "Screened Interest",
    definition:
      "An interested prospect whose basic relevance and intent have been checked. The unit the $1,500 Managed Pipeline hands off.",
  },
  {
    key: "qualified-opportunity",
    term: "Qualified Opportunity",
    definition:
      "A commercial opportunity meeting the defined qualification standard, with sufficient verified business, buyer, scope and next-step context to justify the contractor investing sales or estimating time. Reserved for the $2,500 Qualified Opportunity Engine.",
  },
  {
    key: "structured-handoff",
    term: "Structured Handoff",
    definition:
      "The organized transfer of the conversation, the relevant context, the history and the next action to the HVAC contractor.",
  },
];

/* -------------------------------------------------------------------------- */
/*  The three plans                                                             */
/* -------------------------------------------------------------------------- */

export type PlanKey = "prospecting" | "managed_pipeline" | "qualified_opportunity";

export type Plan = {
  key: PlanKey;
  name: string;
  price: number;
  /** One sentence: what this plan makes US responsible for. Canonical — do not reword. */
  oneLiner: string;
  /** The responsibility chain this plan buys, in delivery order (core/offer TIERS[*].owns). */
  owns: string[];
  /** What happens once a contact shows genuine interest (core/offer TIER_FUNNEL). */
  afterInterest: string[];
  /** What is handed to the contractor, and what it is called (core/offer HANDOFF_STANDARDS).
   *  A lower plan's handoff is never labelled with a higher plan's noun. */
  handoff: { label: string; unit: string; definition: string };
  /** A SUPPORTING FACT, never the reason a plan costs more (D-027 §1). The unit is outreach
   *  messages a month because that is what the send gate enforces. */
  capacity: string;
  /** Who should pick this one, in a single sentence. */
  bestFor: string;
  /** Mirrors core/offer TIERS[*].scope — the same list the proposal and the call brief
   *  render, so a prospect reads one scope on the site and hears the same one on the call. */
  includes: string[];
  /** What stays with the contractor. Named on the card, not buried in the contract. */
  youKeep: string;
  reportCadence: "Monthly" | "Weekly";
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    key: "prospecting",
    name: "Prospecting",
    price: 750,
    oneLiner: "We find and contact suitable commercial accounts. You take over at interest.",
    owns: [
      "targeting",
      "research",
      "contact selection",
      "initial outreach",
      "identification of genuine interest",
      "handoff at interest",
    ],
    afterInterest: ["interest", "contractor takeover"],
    handoff: {
      label: "Interest handoff",
      unit: "interested prospects handed off",
      definition:
        "An interested prospect — a relevant contact at a commercial account that fits your profile who replied with genuine openness to continuing the conversation, confirmed by a person — handed to you as it arrives. Nothing has been screened or qualified: you take the conversation.",
    },
    capacity:
      "Up to 40 first-touch outreach messages a month — one per commercial account. There is no follow-up sequence at this level.",
    bestFor:
      "Someone on your team already works interested replies and chases the follow-up. The work you lack is finding the accounts and making the first contact.",
    includes: [
      "Ideal-account profile built with you, including the work and property types to screen out",
      "Commercial accounts in your area researched from public sources — property and facility managers, building owners, multi-site operators, offices, warehouses, schools, healthcare, restaurants, retail — each with a named contact, a cited reason and a source link",
      "A first-touch message written for each account and sent in your name, from your own domain and mailbox",
      "Every reply read the same day; opt-outs suppressed in code, immediately",
      "An interested prospect handed to you as it arrives, with the thread and the reason we contacted them — you take the conversation from there",
      "Monthly report of verified activity: accounts contacted, messages sent, interested prospects handed off",
    ],
    youKeep:
      "Follow-up, interest screening, qualification, scheduling, the site visit, the estimate and the close stay with you.",
    reportCadence: "Monthly",
  },
  {
    key: "managed_pipeline",
    name: "Managed Pipeline",
    price: 1500,
    oneLiner: "We run outreach and follow-up, screen genuine interest, and organize the handoff.",
    owns: [
      "targeting",
      "outreach",
      "follow-up",
      "interest screening",
      "conversation organization",
      "pipeline organization",
      "structured handoff",
    ],
    afterInterest: [
      "interest",
      "screening and follow-up",
      "organized handoff",
      "contractor sales process",
    ],
    handoff: {
      label: "Structured handoff (screened interest)",
      unit: "structured handoffs",
      definition:
        "An interested prospect whose basic relevance and intent have been checked — the account fits, the reply is genuine, and the person can take a vendor decision or has routed us to who does — handed over with the conversation, the relevant context, the history and the next action. It is screened interest, not a qualified opportunity: deeper discovery, technical evaluation, estimating and closing are yours.",
    },
    capacity:
      "Up to 100 outreach messages a month, first touches and follow-ups alike (about 33 accounts on a 3-touch sequence).",
    bestFor:
      "Nobody on your team has time to chase replies every week, and you want each interested account screened and organized before it reaches you.",
    includes: [
      "Everything in Prospecting",
      "A follow-up sequence run for you, each touch adding something new rather than chasing",
      "Interest screening — we check that a reply is genuine and relevant, and that the person can actually take a vendor decision or route us to whoever does",
      "Simple questions answered by email, so an interested prospect is never made to book a meeting to get an answer",
      "The pipeline organized: every open conversation tracked with its status, owner and next step",
      "A structured handoff of each screened prospect: the conversation, the relevant context, the history and the next action, delivered to the person on your team who takes it",
      "Monthly report of verified activity, organized around structured handoffs",
    ],
    youKeep:
      "Deeper discovery, technical evaluation, the site visit, the estimate and the close stay with you.",
    reportCadence: "Monthly",
    featured: true,
  },
  {
    key: "qualified_opportunity",
    name: "Qualified Opportunity Engine",
    price: 2500,
    oneLiner:
      "We qualify the opportunity, gather the relevant context, coordinate the next step or site visit, and prepare your team to estimate and close.",
    owns: [
      "targeting",
      "outreach",
      "follow-up",
      "genuine-interest screening",
      "qualification",
      "useful context gathering",
      "appropriate next-step coordination",
      "site-visit coordination where appropriate",
      "structured opportunity preparation",
      "contractor handoff",
    ],
    afterInterest: [
      "interest",
      "qualification",
      "context gathering",
      "next-step or site-visit coordination where appropriate",
      "prepared opportunity handoff",
      "contractor estimating and closing",
    ],
    handoff: {
      label: "Qualified Opportunity handoff",
      unit: "qualified opportunities",
      definition:
        "A commercial opportunity that meets the defined qualification standard — verified account and site, a reachable buyer with confirmed purchasing responsibility, a buyer-confirmed concrete need and work type, a confirmed timing or next-step window, the buyer's agreement to your team's follow-up, and the useful property, buyer and scope context gathered — prepared so your sales or estimating staff can act on it. The technical evaluation, the estimate and the close remain yours.",
    },
    capacity:
      "Up to 150 outreach messages a month, first touches and follow-ups alike (about 50 accounts on a 3-touch sequence).",
    bestFor:
      "Someone on your team quotes and wins commercial bids, and you want their time spent on opportunities that arrive qualified, with the context gathered and the next step agreed.",
    includes: [
      "Everything in Managed Pipeline",
      "Each screened prospect qualified against a defined standard: the account and site, the buyer and their role, the stated need and work type, the timing, and an agreed next step — never a label on a reply",
      "The useful context gathered where it can honestly be obtained: property and building context, stated scope indicators, the current-provider situation when disclosed, the decision process and who else is involved",
      "The appropriate next step coordinated with the buyer — a call with your estimator, or a site visit where one is needed — with the scheduling handled",
      "A prepared opportunity handoff your sales and estimating staff can act on, unknowns marked, with a pre-visit brief for every coordinated site visit",
      "Weekly report on qualified opportunities handed off, plus one optimization change each week",
    ],
    youKeep:
      "The technical evaluation, the estimate, the price and the close stay with you. We prepare the opportunity; you estimate and close it.",
    reportCadence: "Weekly",
  },
];

/** Stable per-plan fragment: "prospecting", "managed-pipeline", "qualified-opportunity-engine". */
export function planSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// WHO OWNS WHAT, as a grid (core.offer.RESPONSIBILITY). One row per responsibility, one cell
// per plan, in plan order. The last row is the contractor's on every plan — that row is the
// boundary, and it is in the table so nobody has to infer it from an absence.
export type ResponsibilityRow = {
  responsibility: string;
  /** [Prospecting, Managed Pipeline, Qualified Opportunity Engine] */
  owner: ["we" | "you", "we" | "you", "we" | "you"];
};

export const responsibilityMatrix: ResponsibilityRow[] = [
  { responsibility: "Targeting: the account profile, and the work and property types to screen out", owner: ["we", "we", "we"] },
  { responsibility: "Account research from public sources, with a cited reason and a source link per account", owner: ["we", "we", "we"] },
  { responsibility: "Contact selection: the right person at each account", owner: ["we", "we", "we"] },
  { responsibility: "First-touch outreach, written per account and sent in your name", owner: ["we", "we", "we"] },
  { responsibility: "Reading every reply and identifying genuine interest", owner: ["we", "we", "we"] },
  { responsibility: "The follow-up sequence after the first touch", owner: ["you", "we", "we"] },
  { responsibility: "Interest screening: is the reply genuine, relevant, and from someone who can take or route a vendor decision", owner: ["you", "we", "we"] },
  { responsibility: "Conversation organization: simple questions answered by email", owner: ["you", "we", "we"] },
  { responsibility: "Pipeline organization: every open conversation tracked with status, owner and next step", owner: ["you", "we", "we"] },
  { responsibility: "Qualification against a defined standard", owner: ["you", "you", "we"] },
  { responsibility: "Property, buyer and scope context, gathered where it can honestly be obtained", owner: ["you", "you", "we"] },
  { responsibility: "Next-step coordination with the buyer", owner: ["you", "you", "we"] },
  { responsibility: "Site-visit coordination, where a site visit is appropriate", owner: ["you", "you", "we"] },
  { responsibility: "An engaged call with an interested contact, under your written authorization (never a cold call)", owner: ["you", "you", "we"] },
  { responsibility: "A prepared opportunity handoff, with a pre-visit brief", owner: ["you", "you", "we"] },
  { responsibility: "Technical evaluation, final scope, the estimate, the price, negotiation and the close", owner: ["you", "you", "you"] },
];

// What the extra money buys — the answer to the question that decides the deal
// (core.offer.STEP_UPS, verbatim). Plans step up by the RESPONSIBILITY we take on, never by
// inflating the same deliverable or the message count.
export type StepUp = { from: string; to: string; delta: string; body: string };

export const stepUps: StepUp[] = [
  {
    from: "Prospecting",
    to: "Managed Pipeline",
    delta: "+$750/mo",
    body: "Prospecting hands you every interested prospect as it arrives and you take the conversation from there. Managed Pipeline runs the follow-up sequence, screens each interested reply for relevance and genuine intent, answers simple questions by email, keeps the pipeline organized, and hands you a structured handoff with the context and the next action. You stop chasing and screening.",
  },
  {
    from: "Managed Pipeline",
    to: "Qualified Opportunity Engine",
    delta: "+$1,000/mo",
    body: "Managed Pipeline hands you screened interest. The Qualified Opportunity Engine qualifies each one against a defined standard, gathers the property, buyer and scope context, coordinates the next step or the site visit with the buyer, and hands your estimator a prepared opportunity with a brief. You stop qualifying and coordinating; you estimate and close.",
  },
];

// Terms that are part of the offer (core.offer.TERMS). There is exactly ONE pricing model.
export const offerTerms: string[] = [
  "Flat monthly price. No setup fee.",
  "No per-lead charge, no per-opportunity fee, no acceptance fee and no commission — one price per plan.",
  "Month-to-month. Either side can cancel on 14 days' written notice.",
  "No pilot and no free trial of a paid plan. The free audit is the sample, and it costs nothing.",
  "No guarantee of revenue, contracts, appointments, site visits, qualified opportunities or any count of them.",
];

/* -------------------------------------------------------------------------- */
/*  The funnel (D-027 §5)                                                       */
/* -------------------------------------------------------------------------- */

// core.offer.FUNNEL + FUNNEL_CLOSE. Shared by every plan up to "tier-specific handling";
// what happens there is each plan's `afterInterest` above. No account is forced through the
// $2,500 workflow — the plan decides which handling runs.
export type FunnelStage = { stage: string; detail: string };

export const funnel: FunnelStage[] = [
  {
    stage: "Your capacity and capabilities",
    detail: "The work you do, where you do it, the accounts you want and the ones you would turn down. Everything downstream is built from this, so nothing is researched until you have corrected it.",
  },
  {
    stage: "Suitable commercial accounts",
    detail: "Businesses in your service area that fit the profile — property and facility managers, building owners, multi-site operators, offices, warehouses, schools, healthcare, restaurants, retail — found from public sources, each with a cited reason.",
  },
  {
    stage: "Relevant contacts",
    detail: "The named person at each account who can take a vendor decision for the building or the portfolio, or who routes one. A general inbox is never treated as a decision-maker.",
  },
  {
    stage: "Outreach",
    detail: "A message written for that account, tied to its cited reason, sent in your name from your own domain and mailbox.",
  },
  {
    stage: "Genuine engagement",
    detail: "Every reply is read the same day. Genuine interest is confirmed by a person, not a keyword match, and an opt-out is suppressed in code immediately.",
  },
  {
    stage: "Plan-specific handling",
    detail: "From here the plan you chose decides what we do: hand over at interest, screen and organize a structured handoff, or qualify and prepare the opportunity.",
  },
];

export const funnelClose: FunnelStage[] = [
  {
    stage: "Outcome feedback",
    detail: "You tell us what happened after the handoff — a meeting, an estimate, a bid, won, lost or stalled — in your own words.",
  },
  {
    stage: "Targeting and qualification learning",
    detail: "What you report changes which accounts we pursue next and what we ask before handing one over. A change to targeting is one you have seen and approved.",
  },
];

/* -------------------------------------------------------------------------- */
/*  The qualification standard — Qualified Opportunity Engine only             */
/* -------------------------------------------------------------------------- */

// The seven evidence-backed facts a Qualified Opportunity handoff requires
// (core.client_outcomes.HANDOFF_FACTS; three of them must be confirmed BY THE BUYER, not
// inferred by us). "Unknown" is a recorded value: unavailable information is marked unknown
// and never invented.
export type StandardFact = { fact: string; detail: string; buyerConfirmed?: boolean };

export const qualificationStandard: StandardFact[] = [
  {
    fact: "It sits inside your plan and your approved profile",
    detail: "The account type, the service area and the work type are ones you signed off, and nothing on your exclusion list applies.",
  },
  {
    fact: "The account and the site are verified",
    detail: "A real business and a real property, checked against a public source you can open.",
  },
  {
    fact: "The buyer has the responsibility",
    detail: "The person in the conversation can take a vendor decision for this site — because they said so, or because a documented route leads to them.",
  },
  {
    fact: "The need is confirmed by the buyer",
    detail: "A concrete need and work type in the buyer's own words. A request for information, a brochure request, a polite reply or accepting a free sample is recorded honestly and never counts as a need.",
    buyerConfirmed: true,
  },
  {
    fact: "The timing is confirmed by the buyer",
    detail: "A timing or next-step window the buyer stated. Someday, later and not now are not a timing.",
    buyerConfirmed: true,
  },
  {
    fact: "The buyer has agreed to hear from your team",
    detail: "An explicit yes to the next step — a call with your estimator, or a site visit where one is needed.",
    buyerConfirmed: true,
  },
  {
    fact: "The handoff package is complete",
    detail: "The conversation, the gathered context with unknowns marked, the history and the next action, in one place your estimator can act on.",
  },
];

// Useful context, gathered WHERE GENUINELY OBTAINABLE (D-027 §2). Every entry may come back
// "unknown" — and is recorded as unknown rather than filled in.
export const contextFields: string[] = [
  "business and property identity",
  "the relevant buyer or contact, and their role",
  "location, and whether it is inside your service area",
  "commercial fit",
  "the stated HVAC issue or need, and the stated work type",
  "maintenance, service or replacement interest",
  "timing",
  "property and building context",
  "stated scope indicators",
  "the current-provider situation, when the buyer discloses it",
  "the decision process, and who else is involved",
  "the next logical step, and whether a site visit is needed",
  "scheduling information",
  "notes useful to your sales and estimating staff",
];

/* -------------------------------------------------------------------------- */
/*  Calling policy, and how the sending is controlled                          */
/* -------------------------------------------------------------------------- */

// D-027 §7. The site used to say flatly that we "make no phone calls in your name", which
// stopped being true the day the top plan bought engaged calls — and an absolute that is
// false on one plan is a contradiction a careful buyer finds at the signature block. It is
// equally not a calling service: there are no cold calls, on any plan.
export const callingPolicy: string[] = [
  "Cold outreach is email-led. We make no cold calls, on any plan.",
  "A call becomes appropriate only after a contact has shown genuine interest, and only when a live conversation would add something an email cannot.",
  "On Prospecting and Managed Pipeline, any call with an interested contact is yours to make.",
  "On Qualified Opportunity Engine we can run an engaged call with an interested contact, under your written authorization.",
];

// How sending actually runs. These numbers are the ones the operating system's send gate
// enforces (presend-gate.py WARMUP_RAMP; the client template's 3-touch / 4-day cadence).
// They live HERE, in prose, and not in `serviceTimeline` below, because that array is held
// verbatim to core/timeline.py and the module's send-phase entries are still written in the
// retired plan vocabulary — see the note above `serviceTimeline`.
export type CadenceFact = { title: string; body: string };

export const sendingCadence: CadenceFact[] = [
  {
    title: "It goes out from your domain, deliberately slowly",
    body: "We start at 1 message a day, 2 a day from day 1, 5 a day from day 2, 10 a day from day 4, then up to full volume from day 6. Starting slow protects your domain's reputation; a mailbox that opens at full speed gets filtered, and that is not recoverable in a month.",
  },
  {
    title: "A single first touch, or a short sequence, depending on the plan",
    body: "On Prospecting every message is a first touch — one per account. On Managed Pipeline and Qualified Opportunity Engine each account gets up to 3 touches, at least 4 days apart, each one adding something new rather than chasing.",
  },
  {
    title: "Replies are read the same day",
    body: "Every reply is read and classified by interest the day it lands. Anyone who asks us to stop is suppressed immediately, in code, permanently — even while a campaign is paused.",
  },
];

/* -------------------------------------------------------------------------- */
/*  How this differs from the other ways to buy HVAC growth                    */
/* -------------------------------------------------------------------------- */

// Differences IN KIND, stated as facts about what WE do. Nothing here claims we are better
// than anyone — there are no client results to support such a claim, and `whenItFits` says
// plainly when the other thing is the right tool. Rendered on
// /commercial-hvac-lead-generation.
export type Alternative = { name: string; whatItIs: string; difference: string; whenItFits: string };

export const alternatives: Alternative[] = [
  {
    name: "Residential lead marketplaces",
    whatItIs: "Sell homeowner service requests, priced per lead.",
    difference: "Everyone we contact is a business. Commercial accounts do not appear on those marketplaces, and we sell no leads.",
    whenItFits: "You want residential service calls this week.",
  },
  {
    name: "Homeowner lead sellers",
    whatItIs: "Sell a homeowner's name and number, shared or exclusive.",
    difference: "We never contact homeowners, and nothing is priced per lead. You pay a flat monthly fee for work done in your name.",
    whenItFits: "Your growth plan is residential replacement or repair.",
  },
  {
    name: "General cold-email agencies",
    whatItIs: "Run outbound email campaigns for many industries.",
    difference: "One niche. Every account is researched individually with a cited reason, and the price follows the level of responsibility rather than the message count.",
    whenItFits: "You sell something other than commercial HVAC work.",
  },
  {
    name: "PPC and paid-ads agencies",
    whatItIs: "Buy search and social traffic from people who are already looking.",
    difference: "We contact accounts that are not searching. We do not touch your ad accounts, and this runs alongside an ads agency rather than replacing one.",
    whenItFits: "You want inbound calls from people searching right now.",
  },
  {
    name: "Directories and listing sites",
    whatItIs: "List your company and wait to be found.",
    difference: "Outbound rather than a listing: we go to the account with a reason to talk.",
    whenItFits: "You want to be findable when a buyer is already comparing contractors.",
  },
  {
    name: "Call centers",
    whatItIs: "Place outbound calls from a script.",
    difference: "Email-led, with no cold calls on any plan. A call happens only after a contact has shown genuine interest.",
    whenItFits: "Your sales motion is phone-first and you want dials made for you.",
  },
  {
    name: "Outsourced HVAC closers",
    whatItIs: "Take over the sales conversation, the quote or the close.",
    difference: "We never estimate, quote, price or close. We prepare the opportunity; your team estimates and closes it.",
    whenItFits: "You have nobody who can quote and win commercial work — which is also a reason this service is not yet a fit.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Fit lists                                                                   */
/* -------------------------------------------------------------------------- */

// ONE niche: established HVAC contractors that already sell and complete commercial work
// (D-025; unchanged by D-027). Every entry is a clause of the canonical ICP sentence
// (core/icp.ONE_SENTENCE in the operating-system repo) or one of its qualifiers, phrased so
// an owner can check it against his own shop in a second.
//
// Do NOT re-broaden this to "service businesses / SaaS / professional services". A list that
// includes everyone tells an HVAC owner nothing about whether the service understands him.
export const idealFor: string[] = [
  "Established HVAC contractors that already sell and complete commercial work — service, maintenance, repair or replacement — alongside residential or instead of it",
  "Someone on the team who quotes commercial bids and wins them",
  "Room to take on more commercial accounts",
  "Commercial work that arrives by referral, repeat and word of mouth, with no consistent way to find new accounts and follow up with them",
  "A commercial buyer you can describe: property managers, building owners, facility teams or multi-site operators in the areas you serve",
  "Anywhere in the United States — the work is done remotely, from public sources, in your own service area",
];

// Honest disqualifiers. Each maps to a decline in core/icp.DISQUALIFIERS, and the four the
// fit check enforces in code (lib/qualification.ts BLOCKS) MUST each have an entry here —
// tests/qualification.test.ts holds the two lists together, so the site never screens
// someone out for a reason it did not publish.
//
// Two of these are load-bearing rather than cosmetic:
//   * "residential-only" is a reason not to sell to that CONTRACTOR — never, in any wording,
//     a suggestion that his homeowners could be contacted instead.
//   * "we never contact homeowners" is gate #0f in the operating system: consumers are never
//     cold-sourced, unconditionally, and no client config can authorize it.
export const notFor: string[] = [
  "Residential-only shops — we research commercial accounts, and a shop with no commercial work has no account base for us to build",
  "Anyone wanting to buy homeowner leads — we are not a lead seller, and we never contact homeowners",
  "Companies at capacity year-round, or not looking to add accounts",
  "Companies already running an in-house outbound or BDR team — you already own what we sell",
  "Solo operators — a commercial account arrives with response-time expectations one truck cannot hold",
  "Companies with nobody to quote and win commercial work — we prepare the opportunity to the level you chose; the technical evaluation, the estimate and the close stay yours",
  "Anyone who wants us to inspect, specify, estimate, price or close — that work is the contractor's, on every plan",
  "Anyone wanting thousands of unverified addresses blasted overnight",
  "Anyone expecting guaranteed jobs, revenue, site visits, or a set number of appointments",
  "Anyone needing published case studies before starting — there are none yet",
];

/* -------------------------------------------------------------------------- */
/*  Differentiators and risk reversal                                           */
/* -------------------------------------------------------------------------- */

// Written against what an HVAC owner has actually been burned by: leads sold to several
// contractors at once, a vendor that kept the list, a blast that went out in his name without
// him seeing it, and a vendor whose "qualified" meant "replied". Every item maps to something
// the service actually does or to a gate in the operating system — no new claims are
// introduced here, and none of them promise an outcome.
export type Differentiator = { title: string; body: string };

export const differentiators: Differentiator[] = [
  {
    title: "We are not a lead seller",
    body: "Nobody else is being sold the same account. We do not buy, sell, resell, or broker leads, shared or exclusive, so you are never bidding against other contractors for one form fill. There is no per-lead price and no per-opportunity fee: a flat monthly fee buys the level of responsibility you chose, on the account types and service area you approve.",
  },
  {
    title: "The line between our work and yours is printed on the plan",
    body: "Prospecting hands over at first interest. Managed Pipeline hands over screened interest, with a structured handoff. Qualified Opportunity Engine hands over a qualified opportunity, prepared for your estimator. A lower plan never quietly includes a higher plan's work, and on every plan the technical evaluation, the estimate, the price and the close are yours.",
  },
  {
    // SEPARATE THE PRACTICE FROM THE CONTRACTUAL RIGHT. CSA §4 makes the Services
    // non-exclusive by default and requires exclusivity "written into the Order Form as a
    // priced add-on". A buyer who has been sold as one of several shared leads is exactly the
    // buyer who will check this clause, and finding the gap at the signature block is how a
    // deal dies at the last step.
    title: "One HVAC company per service area — and what that is worth",
    body: "We run a conflict check before accepting anyone, and we work one HVAC company per service area: while we work for you, we will not take on a competing shop in your territory. The reason is practical — the property managers and facility teams we would write to for you are the same ones a competitor would want. Be clear on what this is, though. As standard it is an operating practice, not a contractual right: the agreement is non-exclusive by default. If you want it enforceable, contracted per-metro exclusivity is a priced add-on on the order form, and we will quote it before you sign rather than spring it on a call.",
  },
  {
    title: "Every account is researched from public sources, and cited — and we never contact homeowners",
    body: "The businesses we write to in your name are found the checkable way: a property manager's own portfolio page, a posted renovation, a permit filing, a facilities team named on a company site. Every account carries the source link and the reason it was picked; no citation, no contact. Homeowners are never on the list — not from research, not from a purchased file, not at any price.",
  },
  {
    title: "It goes out from your name, inside an envelope you signed off",
    body: "Messages send from your own domain and mailbox, so the people we write to see the company they can look up, and you can read the sent folder yourself. Before anything sends you confirm the account categories, the service area, the exclusions, the claims we may make and the sending identity. We then work inside that envelope; a new category, area or claim needs a new sign-off, and you can pause at any time.",
  },
];

// What a buyer is actually risking, assembled in one place.
//
// Every line here is a CLAUSE THAT ALREADY BINDS US, not a marketing promise invented for
// this block. The hard constraint it lives under: a business with zero results cannot offer an
// OUTCOME guarantee, and must never imply one. So every entry guarantees the DELIVERY, the
// TERMS, or the OWNERSHIP — never the result. "We replace an account that failed our own
// citation standard" is a quality commitment; "we refund you if it doesn't work" would be an
// outcome guarantee wearing a refund's clothes, and must never appear here.
export type RiskReversal = { title: string; body: string; clause: string };

export const riskReversal: RiskReversal[] = [
  {
    title: "No setup fee, no contract length, no exit fee",
    body: "A flat monthly fee, month-to-month. Either side can end it on 14 days' written notice. No minimum term, nothing to buy out.",
    clause: "Terms of Service §7",
  },
  {
    title: "A month we have not started is refunded in full",
    body: "If we have not begun work on a period, we refund that period in full on request. It is an obligation in the agreement, not a courtesy.",
    clause: "Services agreement §10.5.1",
  },
  {
    title: "An account that fails our own citation check is replaced free",
    body: "Every researched account must carry a real public source. If one we delivered fails that standard, we replace it inside the same month at no charge. That is a commitment about the quality of the work, not about whether anybody buys.",
    clause: "Services agreement §10.6.2",
  },
  {
    title: "What is published beats what is in the contract",
    body: "Our fees, cancellation and refund terms are published before any sales conversation. Where the published terms are better for you than the signed ones, the published terms win.",
    clause: "Services agreement §10.5.2",
  },
  {
    title: "Everything built for you stays yours",
    body: "The account research, the drafted messages, the trackers, and your suppression list. Leaving claws none of it back, and the opt-out list is handed over within five business days.",
    clause: "Services agreement §10.6",
  },
  {
    title: "Your data is deleted within 30 days of the end",
    body: "We delete or de-identify your records from active systems within 30 days of the engagement ending. One thing is kept permanently: the do-not-contact list, because destroying it is how an opt-out gets forgotten.",
    clause: "Services agreement §10.6 / §10.6.1",
  },
  {
    title: "No promised number of opportunities, on purpose",
    body: "A vendor that has to hit a promised count of opportunities or site visits is paid to hand you ones that were never going to buy. We commit to the work and report exactly what it produced, so what reaches your estimator is worth the drive.",
    clause: "Terms of Service §4",
  },
];

/* -------------------------------------------------------------------------- */
/*  Reviews                                                                     */
/* -------------------------------------------------------------------------- */

// Real client reviews, published ONE AT A TIME, by hand, after the operating-system repo's
// scripts/record_review.py has recorded named, quoted consent (CSA §14.2 / FTC 16 CFR Part
// 255). This array is EMPTY on purpose, the same "no case studies yet" honesty as everywhere
// else on this site (see README.md's house rule): adding an entry here IS the publish action,
// and it must never happen without a contentHash this site cannot itself verify.
export type Review = {
  quote: string;
  /** How to credit it, e.g. "Jane D., HVAC contractor" — never a full name without explicit consent. */
  name: string;
  /** The client_id this came from, in the operating-system repo (not shown on the page). */
  clientId: string;
  /** The content hash scripts/record_review.py printed. Cross-checkable, never displayed. */
  contentHash: string;
};

export const reviews: Review[] = [];

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                         */
/* -------------------------------------------------------------------------- */

// Grouping is presentational only. The FAQPage JSON-LD in app/page.tsx still maps the flat
// array, so the structured data stays a verbatim mirror of the visible text.
export const faqGroups = [
  "What this is",
  "Where the accounts come from",
  "How the outreach runs",
  "What you can expect",
  "Money, terms and getting started",
] as const;

export type FaqGroup = (typeof faqGroups)[number];

export type Faq = { question: string; answer: string; group: FaqGroup };

/** Stable anchor for one question, so a specific answer can be linked to directly. */
export function faqSlug(question: string): string {
  return (
    "faq-" +
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/, "")
  );
}

// ANSWER-FIRST, and this is not a style preference. Every answer opens with a direct,
// self-contained sentence that restates the subject ("No, we never contact homeowners" —
// never a bare "No."), because these exact strings are lifted whole into acceptedAnswer.text
// and get quoted in isolation, both by an answer engine and by an owner skimming on a phone.
//
// PLAIN LANGUAGE (D-022): one idea per sentence, the noun named, no agency register.
//
// ONE PLAN PER SENTENCE. When an answer says what a plan does, it names that plan in its own
// sentence. tests/pricing-model.test.ts reads these answers sentence by sentence and fails if
// a sentence about Prospecting claims follow-up, screening, qualification or site-visit
// coordination, or if one about Managed Pipeline claims qualification or context gathering.
export const faqs: Faq[] = [
  {
    question: "What exactly do you do for a commercial HVAC contractor?",
    group: "What this is",
    answer:
      "We find the commercial accounts worth pursuing, contact the right people in your name, and hand each opportunity to your team at the level you chose. The accounts are businesses in the areas you serve — property managers, building owners, facility teams, multi-site operators — researched from public sources with a cited reason each. Your plan decides how far we carry an opportunity before your team takes it. On every plan, your team estimates and closes.",
  },
  {
    question: "How is this different from Angi, Thumbtack, or a per-lead seller?",
    group: "What this is",
    answer:
      "We sell no leads at all — you pay a flat monthly fee for a managed outbound service, never a per-lead price. Those marketplaces sell homeowner inquiries for residential work. Everyone we contact is a business, and commercial accounts do not appear on those marketplaces. The trade-off is real: a marketplace hands you a name today, and a commercial account takes weeks of research and contact to reach.",
  },
  {
    // The nearest and cheapest substitute, and the one an established shop reaches for first:
    // the marketing module inside the field-service software they already pay for.
    question: "ServiceTitan / Housecall Pro / Jobber already emails my customer list. Why pay you?",
    group: "What this is",
    answer:
      "Those tools email the people already in your system; we find and contact the commercial accounts that are not in it yet. Your software cannot research the property managers and building owners in your towns, name the right person at each, or write to them with a cited reason. If someone on your team already does that every week, you may not need us; most shops don't have one, because nobody has time.",
  },
  {
    question: "We already have a marketing company running ads. Does this replace them?",
    group: "What this is",
    answer:
      "No, this runs alongside your ads agency rather than replacing it, and usually it should. Ads and local search catch people who are already looking, and for commercial work that is mostly service calls. Property managers and facility teams choosing a contractor for a building or a portfolio rarely search for one; somebody has to write to them. That is the work we do. We don't touch your ad accounts, your website, or your Google Business Profile.",
  },
  {
    question: "What do you not do?",
    group: "What this is",
    answer:
      "We do not inspect equipment, diagnose or specify it, set the scope, write the estimate, set the price, negotiate terms, or close the deal — those stay with your team on every plan. We also do not sell or resell leads, run paid ads, make cold calls, or contact homeowners, and we do not promise that any account will sign. We prepare the opportunity to the level you chose; you estimate and close it.",
  },
  {
    question: "Do you make phone calls?",
    group: "How the outreach runs",
    answer:
      "Our cold outreach is email-led, and we make no cold calls on any plan. A call becomes appropriate only after a contact has shown genuine interest, when a live conversation would add something an email cannot. On Prospecting and Managed Pipeline, that call is yours to make. On Qualified Opportunity Engine we can run an engaged call with an interested contact, under your written authorization.",
  },
  {
    question: "Where are you based, and who do you serve?",
    group: "What this is",
    answer:
      "We are a founder-run company based in New Jersey, and we work remotely with established HVAC contractors that already do commercial work, anywhere in the United States. The account research runs from public sources in whatever area you serve, so the service does not depend on where we sit. We work one HVAC company per service area.",
  },
  {
    question: "Do you contact homeowners?",
    group: "Where the accounts come from",
    answer:
      "No, we never contact homeowners — not from research, not from a purchased list, not at any price. Everyone we write to in your name is a business: a property manager, a building owner, a facilities team, a general contractor. Each is found from public sources and carries the reason it was picked and a link to where we found it. A residential-only shop is not a fit for that reason, and we say so on the fit check rather than after you pay.",
  },
  {
    question: "Where do the accounts actually come from?",
    group: "Where the accounts come from",
    answer:
      "The accounts are researched from free public sources — a property manager's portfolio page, a company's facilities team, a posted renovation, a permit filing — and every one carries its source link, a fit reason, and a named person to reach. Nothing is bought from a data broker, and an account with no citation cannot be contacted at all. If you also hold commercial account history you are entitled to use, you can send it and we work that too. It is optional, and nothing from it is contacted until you have approved the list.",
  },
  {
    question: "What makes an account worth contacting?",
    group: "Where the accounts come from",
    answer:
      "An account is worth contacting when it fits the profile you approved, has a named decision-maker with a usable contact path, and carries a specific, checkable reason to write now. The reason is a public fact — a portfolio they manage, a building they just took on, a posted renovation, a maintenance need their own site describes — with the source link attached. No reason, no contact. We never assert what shape a building's equipment is in; an indicator is a reason to write, not a diagnosis.",
  },
  {
    question: "Whose email address does this go out from?",
    group: "How the outreach runs",
    answer:
      "Yours — outreach sends from your own domain and mailbox, never ours. A property manager who looks you up finds the company that wrote to them, and you can open the sent folder and read every message. Before anything sends you confirm the account categories, the service area, the exclusions, the claims we may make and the sending identity; after that we work inside that envelope, and you can pause at any time. Deliverability depends on your domain setup and history, which stay in your hands; confirm the email and privacy rules in your market before outreach begins.",
  },
  {
    question: "What happens when someone replies with interest?",
    group: "How the outreach runs",
    answer:
      "What happens next depends on your plan, and only on your plan. On Prospecting, an interested prospect is handed to you as it arrives, with the thread and the reason we wrote, and you take the conversation. On Managed Pipeline we run the follow-up, check that the interest is genuine and relevant, and give you a structured handoff. On Qualified Opportunity Engine we qualify it against a defined standard, gather the context, and coordinate the next step or a site visit before your estimator is involved.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    group: "How the outreach runs",
    answer:
      "Anyone who asks not to be contacted is suppressed immediately, in code, and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every send rather than something a person has to remember. Opt-outs are processed even while a campaign is paused, and the suppression list goes with you if you leave.",
  },
  {
    question: "What is an interested prospect?",
    group: "What you can expect",
    answer:
      "An interested prospect is a relevant contact at a commercial account that fits your profile who replied with genuine openness to continuing the conversation, confirmed by a person — not by a keyword match. It is the one measure every report is organized around, always shown against the accounts contacted and the messages sent to get there. It is a count of what happened, never a commitment to a number. It is not the same thing as screened interest or a qualified opportunity; those are further steps, and only the plans that include them deliver them.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    group: "What you can expect",
    answer:
      "No, we do not guarantee revenue, contracts, appointments, site visits or qualified opportunities on any plan. You should be wary of anyone in this industry who does. Whether an account signs depends on your price, your references, your timing, and how the site visit goes. What we commit to is running the system, doing the work to the stated standard, and reporting the results honestly.",
  },
  {
    question: "How many accounts or messages does each plan cover?",
    group: "What you can expect",
    answer:
      "Each plan has a monthly capacity limit, and it is a supporting fact rather than the reason one plan costs more than another. Prospecting covers up to 40 first-touch messages a month, one per commercial account. Managed Pipeline covers up to 100 outreach messages a month, first touches and follow-ups alike, which is about 33 accounts on a three-touch sequence. Qualified Opportunity Engine covers up to 150, about 50 accounts. The count is in messages because that is the unit our sending controls enforce, so the report reconciles against the agreement line for line.",
  },
  {
    question: "What does a handoff actually contain?",
    group: "What you can expect",
    answer:
      "A handoff arrives by email, to the person on your team who takes it, and what is in it depends on your plan. On Prospecting it is the thread and the reason we wrote to that account. On Managed Pipeline it is a structured handoff: the conversation, the relevant context, the history and the next action. On Qualified Opportunity Engine it is a prepared opportunity with the gathered context, unknowns marked, and a pre-visit brief where a site visit was coordinated.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    group: "What you can expect",
    answer:
      "No, there are no published case studies or client results yet, and we will not invent any. This is an early, founder-led service. What the site shows instead is the standard, the account format, the process, and the price. Start with the free audit and judge the first accounts on their own merits — that is the proof that matters before you spend anything.",
  },
  {
    question: "Which plan should I start with?",
    group: "Money, terms and getting started",
    answer:
      "Pick the plan by who on your team does the work after someone shows interest. If someone on your team already works replies and chases the follow-up, Prospecting fits. If nobody has time for that, Managed Pipeline is where we suggest starting. If you want each opportunity qualified, with the context gathered and the next step or site visit coordinated before your estimator spends time on it, that is Qualified Opportunity Engine — and it only makes sense if someone on your team quotes and wins commercial bids. The fit check gives you a read from your own answers.",
  },
  {
    question: "What do you need from us to start?",
    group: "Money, terms and getting started",
    answer:
      "Four things, about 30 minutes: the account types you want (property managers, offices, schools, healthcare, retail, and so on), the areas you serve, the work and the accounts you want screened out, and who on your team takes an interested reply. That is the whole intake. You do not have to send a customer list: the account research runs from public sources.",
  },
  {
    question: "How is this different from hiring an inside-sales or office person?",
    group: "Money, terms and getting started",
    answer:
      "You are buying a defined piece of work rather than a headcount: no salary, payroll tax, tooling, ramp time or management attached. In most shops the account research and the first contact are the first things dropped when the phones get busy. This starts in weeks, moves up or down a plan as your needs change, and is measured against clear reporting. If you already employ someone whose job this is, you may not need us.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    group: "Money, terms and getting started",
    answer:
      `There is no long-term contract: a flat monthly fee, month-to-month, with no setup fee and 14 days' notice either side. You can move between plans, and everything built for you is yours to keep. It starts with a ${intakeMinutes}-minute fit check on this site, which tells you on the spot whether this is a fit — including when it isn't. If it is, we build your free pipeline audit and send it in writing. A ${callLengthMinutes}-minute walkthrough is offered afterwards, never required.`,
  },
  {
    question: "Do I have to get on a call to get the free audit?",
    group: "Money, terms and getting started",
    answer:
      `No. The call is a ${callLengthMinutes}-minute, no-obligation walkthrough of the audit we already sent you — not a pitch, and not the price of the audit. We go through the account profile and the accounts we picked, you tell us where we read your market wrong, and you decide with the work already in hand whether a paid plan is worth it. You can skip it entirely and keep the audit. No work begins until you decide to move forward.`,
  },
];

/* -------------------------------------------------------------------------- */
/*  The Free Pipeline Audit                                                     */
/* -------------------------------------------------------------------------- */

// The primary trust offer: a free slice of the account research every paid plan starts with,
// handed over before any money changes hands. For a business with no track record yet,
// giving away real, verifiable work IS the proof — so the copy here promises a deliverable
// and its quality, never an outcome. It includes no outreach: nothing is sent to anyone as
// part of the audit.
//
// THE DELIVERABLE IS COMMERCIAL ACCOUNTS, and the word matters. The operating-system repo's
// business_rules.py states the rule: "3-5 real, verified COMMERCIAL ACCOUNTS, each with a
// cited reason and a source link, plus one sample message. NEVER 'prospects' — an HVAC owner
// reads that as homeowners, which guard #0f makes impossible to source."
export const audit = {
  name: "Free Pipeline Audit",
  tagline:
    "Real work on your commercial pipeline, before you pay anything. Yours to keep either way.",
  includes: [
    {
      title: "An account profile worth targeting",
      body: "The account types and areas worth pursuing for your shop — property managers, building owners, facility teams — and the work you would rather turn down.",
    },
    {
      title: "3-5 commercial accounts, named and checked",
      body: "Real businesses in your area that could become accounts. Each has a named contact path, a cited reason to reach out now, and a source link you can open.",
    },
    {
      title: "One sample outreach message",
      body: "Written for one of those accounts, tied to its real reason. The actual voice, not a template.",
    },
    {
      title: "A read on where your commercial work comes from",
      body: "How commercial work reaches you today, and the one gap most likely costing you accounts.",
    },
  ],
  whyFree:
    "We have no case studies yet, so the audit is the proof. If it is useful, we talk. If not, you keep it and owe nothing.",
  guardrail:
    "It shows the quality of the work, not a promised result. No guaranteed leads, calls or jobs. Nothing is sent to anyone as part of it. It contains no homeowner records, because we never contact homeowners; every account in it is a business, with the public source it came from.",
} as const;

/* -------------------------------------------------------------------------- */
/*  The service timeline                                                        */
/* -------------------------------------------------------------------------- */

// CANONICAL SOURCE: the operating-system repo's `core/timeline.py`. This is a RENDERING of
// that module, not a second timeline — `scripts/check_cross_repo.py` in that repo asserts
// every `band`, `label` AND `detail` below matches it exactly, and fails the OS validation
// suite if they drift. Add or edit a phase THERE first, then mirror the string here verbatim.
//
// A SUBSET IS ALLOWED, AND THIS IS DELIBERATELY ONE (2026-09-17). Eight phases are published:
// the onboarding lane every plan shares, and the renewal. The module's send-side phases —
// the mailbox, the warm-up ramp, the touch sequence, reply handling, reporting, the day-30
// review — are NOT published from here, for two reasons that are both the module's to fix:
//   1. it gates them on the retired plan keys ("outreach", "appointment") while
//      core/offer.resolve_tier now returns the D-027 keys, so `phases_for()` no longer emits
//      them for ANY plan and check_cross_repo.py rejects them as "not in the module at all";
//   2. their `detail` text still names "Outreach Engine" / "Appointment Engine" and
//      "qualified conversations", which this site may not print (tests/pricing-model.test.ts).
// The facts those phases carried that a buyer needs — the ramp, the sequence, same-day reply
// handling — are published from `sendingCadence` above, in D-027 words. When core/timeline.py
// is migrated, restore the phases here verbatim and delete the duplicates.
//
// `band:` MUST APPEAR NOWHERE ELSE IN THIS FILE: the checker counts those lines to prove its
// own parser matched every phase.
//
// Every band describes work we do. Nothing here is dated against a result.
export type TimelinePhase = {
  band: string;
  label: string;
  owner: "you" | "we" | "both";
  detail: string;
};

export const serviceTimeline: TimelinePhase[] = [
  {
    band: "Day 0",
    label: "Agreement signed, first payment received",
    owner: "both",
    detail:
      "No work begins until the agreement is signed and the first payment has cleared.",
  },
  {
    band: "Days 1-2",
    label: "You fill in the onboarding form",
    owner: "you",
    detail:
      "About 30 minutes: what you do, where you work, what you can and cannot claim, and who your best customers are.",
  },
  {
    band: "Days 1-3",
    label: "We write your profile",
    owner: "we",
    detail:
      "Your intake becomes a written record of the claims we may make on your behalf — and the ones we may not. Nothing goes out that is not in it.",
  },
  {
    band: "Days 2-4",
    label: "We draft your ideal-customer definition and send it for sign-off",
    owner: "we",
    detail:
      "Who we should be reaching, and the bad-fit work we screen out. You correct it. We never proceed on a definition you have not seen.",
  },
  {
    band: "Days 3-10",
    label: "We research and build your commercial account list",
    owner: "we",
    detail:
      "Accounts in your area that fit the categories you approved: who they are, why they fit you, and a named person to reach. Every account carries a source link you can open. Nothing is contacted until the list clears our own checks.",
  },
  {
    band: "3 business days",
    label: "You approve the account profile and sending setup",
    owner: "you",
    detail:
      "You confirm the account categories, service area, exclusions, allowed claims, and sending identity once. We then operate inside that signed-off envelope; a new category, area, claim, or identity requires a new approval. Silence is never taken as approval, but individual messages and routine batches do not wait for repeated sign-off.",
  },
  {
    band: "Same day",
    label: "Final automated checks",
    owner: "we",
    detail:
      "Suppression lists, sending caps, compliance content scan, and identity checks all run in code before the first message is released.",
  },
  {
    band: "Day 30 onward",
    label: "Month-to-month from here",
    owner: "both",
    detail:
      "It renews monthly until you stop it. Either side can end it on 14 days' written notice. You keep everything built for you: the lists, the scripts, the trackers.",
  },
];

// Must accompany any rendering of serviceTimeline. Verbatim from core/timeline.DISCLAIMER.
export const serviceTimelineDisclaimer =
  "These are the timings we work to for the parts of this we control. They describe our activity, not your results. Any step marked as yours sets the pace for that step: where an engagement works your own account history, nothing there is contacted until you have sent it and approved the list.";
