// Shared content arrays. Imported by the landing UI AND by the server pages that emit
// FAQPage / Service / Offer / DefinedTermSet JSON-LD — one source of truth keeps the
// structured data verbatim-matched to the visible text (a Google rich-results requirement).
//
// THE MODEL THIS FILE DESCRIBES (D-028, 2026-09-18): commercial HVAC outbound, sold as TWO
// plans. The plan decides HOW FAR we own each prospect before the warm handoff to you —
//
//     $1,500  Managed Outbound     right accounts, decision-makers reached, outreach and
//                                  follow-up, genuine qualified interest; warm handoff at
//                                  Qualified Interest. Core outcome: qualified conversations.
//     $2,500  Opportunity Engine   everything in Managed Outbound, then the need validated, the
//                                  property/account/buyer information gathered, the fit accepted
//                                  against your criteria, a concrete next sales step coordinated;
//                                  handoff at an Accepted Sales Opportunity.
//
// On both plans the contractor does the technical discovery, the site assessment, the
// estimate, the proposal and the close. Everyone we contact is a BUSINESS — a property manager,
// a building owner, a facility team — found from public sources.
//
// CANONICAL SOURCE: the operating-system repo's core/offer.py (TIERS, RESPONSIBILITY,
// HANDOFF_STANDARDS, WARM_HANDOFF_STEPS, TERMINOLOGY, CONTRACTOR_BOUNDARY, TERMS, STEP_UPS,
// OUTCOME_METRIC, POSITIONING) and 00_CONTROL_CENTER/decisions/D-028_two_offer_model.md. Where a
// string there is canonical — the plan names, the one-liners, the positioning sentence, the
// boundary sentence, the definitions — it is copied rather than paraphrased, and
// scripts/check_cross_repo.py in that repo plus tests/pricing-model.test.ts in this one fail if
// it drifts.
//
// WHAT THIS REPLACED. D-027 (2026-09-16) sold three tiers ($750 / $1,500 / $2,500) under other
// names; D-028 retired the $750 tier and renamed and re-scoped the other two. Nothing on this
// site names the retired tiers.

import { canonAccount, canonTerm } from "./canon.ts";
import { callLengthMinutes, intakeMinutes } from "./site.ts";

/* -------------------------------------------------------------------------- */
/*  The one positioning sentence, the boundary, the metric                     */
/* -------------------------------------------------------------------------- */

// core.offer.positioning_sentence(), verbatim. The homepage hero carries the same words as
// LITERAL JSX text (components/LeadGenerationLanding.tsx) because check_cross_repo.py reads
// that file, not this constant; tests/pricing-model.test.ts holds the two together.
export const positioningSentence =
  "We find the commercial accounts worth pursuing, reach the decision-makers in your name, and hand your team qualified conversations — or, on the Opportunity Engine, accepted sales opportunities with the next sales step already set. We measure the work by one thing: qualified conversations.";

// core.offer.BOUNDARY_SENTENCE, verbatim. True on both plans.
export const boundarySentence =
  "B2B Lead Growth creates the sales conversation and, on the Opportunity Engine, develops it into an accepted sales opportunity. The HVAC contractor does the technical discovery, estimates, proposes and closes.";

// core.offer.CONTRACTOR_BOUNDARY, verbatim. Each entry completes the sentence "We do not …".
export const contractorBoundary: string[] = [
  "perform technical HVAC discovery, inspections or site assessments",
  "diagnose equipment or building systems",
  "engineer solutions, size equipment or specify equipment",
  "determine the final project scope",
  "prepare estimates, quotes, bids or proposals",
  "set pricing or negotiate price or contract terms",
  "conduct technical field sales or close the sale",
  "deliver the HVAC work",
  "guarantee contracts, appointments, site visits, qualified conversations, sales opportunities, revenue or sales",
];

// THE ONE MEASURE (core.offer.OUTCOME_METRIC). A measurement of what happened, never a promise —
// which is why the sentence carries its own denominators and no number. Counted from the
// recorded milestone (the buyer agreed to talk), never from a reply label.
export const outcomeMetric = {
  label: "qualified conversations",
  definition:
    "a decision-maker at a commercial account that fits your profile — or the colleague they sent us to — who showed genuine interest and agreed to speak with your team, confirmed by a person",
  denominators: ["accounts contacted", "outreach messages sent"],
  oneSentence:
    "We measure the work by qualified conversations — a decision-maker at a commercial account that fits your profile who showed genuine interest and agreed to talk with your team, confirmed by a person — always shown against the accounts contacted and the messages sent to get there. It is a count of what happened, not a commitment to a number.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Terminology — never interchangeable (D-028 §6)                             */
/* -------------------------------------------------------------------------- */

export type Term = { key: string; term: string; definition: string };

// The six offer terms, VERBATIM from the operating system (2026-09-18). Until then this array was a
// hand-written second-person rewrite of core.offer.TERMINOLOGY — the same six definitions in a
// second text, with nothing checking one against the other. It is now read from
// lib/generated/vocabulary.ts, which the OS exports from core/vocabulary.py (itself importing
// core.offer.TERMINOLOGY), so the words on /how-it-works, /pricing and
// /commercial-hvac-lead-generation are the words the OS's gates and reports use. Rendered with a
// DefinedTermSet on /how-it-works; every term is on /definitions with who decides and what must
// be on record. The kebab-case key is the page anchor (`term-<key>`), kept stable.
const OFFER_TERM_KEYS = [
  "prospect",
  "interested_prospect",
  "qualified_conversation",
  "accepted_sales_opportunity",
  "warm_handoff",
  "opportunity_brief",
] as const;

export const terminology: Term[] = OFFER_TERM_KEYS.map((k) => {
  const t = canonTerm(k);
  return { key: k.replace(/_/g, "-"), term: t.label, definition: t.definition };
});

/* -------------------------------------------------------------------------- */
/*  The two plans                                                               */
/* -------------------------------------------------------------------------- */

export type PlanKey = "managed_outbound" | "opportunity_engine";

export type Plan = {
  key: PlanKey;
  name: string;
  price: number;
  /** One sentence: what this plan makes US responsible for. Canonical — do not reword. */
  oneLiner: string;
  /** The plan's core outcome, in the mandate's words (core/offer TIERS[*].outcome_sentence). */
  outcome: string;
  /** Where our ownership ends and the warm handoff happens (core/offer MILESTONES). */
  handoffPoint: string;
  /** The responsibility chain this plan buys, in delivery order (core/offer TIERS[*].owns). */
  owns: string[];
  /** What happens once a contact shows genuine interest (core/offer TIER_FUNNEL). */
  afterInterest: string[];
  /** What is handed to the contractor, and what it is called (core/offer HANDOFF_STANDARDS).
   *  Managed Outbound's handoff is never labelled with the Opportunity Engine's noun. */
  handoff: { label: string; unit: string; definition: string };
  /** A SUPPORTING FACT, never the reason a plan costs more (D-028 §1). The unit is outreach
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
    key: "managed_outbound",
    name: "Managed Outbound",
    price: 1500,
    oneLiner:
      "We find the right commercial accounts, reach the decision-makers, run the outreach and follow-up, and hand you each prospect who wants to talk — with a warm introduction.",
    outcome: "Create qualified conversations.",
    handoffPoint: "Qualified Interest",
    owns: [
      "targeting",
      "account research",
      "decision-maker contact",
      "outreach",
      "follow-up",
      "interest screening",
      "qualified interest",
      "warm handoff",
    ],
    afterInterest: ["qualified interest", "warm handoff", "contractor qualification, discovery, estimating and closing"],
    handoff: {
      label: "Warm handoff — qualified interest",
      unit: "qualified conversations handed off",
      definition:
        "A qualified conversation: a decision-maker at a commercial account that fits your profile — or the colleague they sent us to — who showed genuine interest and agreed to speak with your team, confirmed by a person rather than a keyword. We introduce you by name and hand over the account, the contact, the context and the whole conversation; from that point the conversation is yours. Deeper qualification, technical discovery, the estimate, the proposal and the close stay with you.",
    },
    capacity:
      "Up to 100 outreach messages a month, first touches and follow-ups alike (about 33 accounts on a 3-touch sequence).",
    bestFor:
      "Your team can take a conversation from the first call: you want the right accounts found, the decision-makers reached, and every prospect who agrees to talk introduced to you warm.",
    includes: [
      "Ideal-account profile built with you, including the work and property types to screen out",
      "Commercial accounts in your area researched from public sources — property and facility managers, building owners, multi-site operators, offices, warehouses, schools, healthcare, restaurants, retail — each with a named decision-maker, a cited reason and a source link",
      "Outreach written for each account and sent in your name, from your own domain and mailbox, with a follow-up sequence where each touch adds something new",
      "Every reply read the same day; opt-outs suppressed in code, immediately; simple questions answered by email",
      "Interest screened: the account fits, the reply is genuine, and the person decides or has sent us to who does",
      "A warm handoff once the prospect agrees to speak with you: the handoff record with the account, the contact, the context and the whole conversation, a warm introduction by name, your booking link or calendar where it fits, and ownership of the conversation passed to you",
      "Downstream progress tracked when you report it, and a monthly report of verified activity organized around qualified conversations handed off",
    ],
    youKeep:
      "Deeper qualification, technical discovery, the site assessment, the estimate, the proposal, the close and the work itself stay with you.",
    reportCadence: "Monthly",
    featured: true,
  },
  {
    key: "opportunity_engine",
    name: "Opportunity Engine",
    price: 2500,
    oneLiner:
      "Everything in Managed Outbound, and we keep going: we validate the business need, gather the property, account and buyer information, confirm the fit against your agreed criteria, and coordinate a concrete next sales step before we hand the opportunity over.",
    outcome: "Turn qualified conversations into accepted sales opportunities.",
    handoffPoint: "Accepted Sales Opportunity",
    owns: [
      "targeting",
      "account research",
      "decision-maker contact",
      "outreach",
      "follow-up",
      "interest screening",
      "qualified interest",
      "business-need validation",
      "property, account and buyer information",
      "acceptance against your criteria",
      "next sales step coordination",
      "opportunity brief",
      "warm handoff",
    ],
    afterInterest: [
      "qualified interest",
      "business-need validation",
      "property, account and buyer information",
      "acceptance against your criteria",
      "a coordinated next sales step",
      "opportunity brief and warm handoff",
      "contractor technical discovery, estimating and closing",
    ],
    handoff: {
      label: "Opportunity handoff — accepted sales opportunity",
      unit: "accepted sales opportunities handed off",
      definition:
        "An accepted sales opportunity: a qualified conversation we carried further — the business need validated with the buyer, the property, account and buyer information gathered (anything unknown is marked unknown), the opportunity checked and accepted against the criteria you agreed with us, and a concrete next sales step coordinated with the buyer. Handed over with a complete opportunity brief and a warm introduction. Technical discovery, the site assessment, the estimate, the proposal and the close stay with you.",
    },
    capacity:
      "Up to 150 outreach messages a month, first touches and follow-ups alike (about 50 accounts on a 3-touch sequence).",
    bestFor:
      "Someone on your team quotes and wins commercial bids, and you want their time spent only on opportunities that were validated, accepted against your criteria and scheduled before they arrive.",
    includes: [
      "Everything in Managed Outbound",
      "After a prospect shows qualified interest, the business need validated with the buyer: the work they need, why, and the timing — in their words, never our technical assessment",
      "The relevant property, account and buyer information gathered where it can honestly be obtained: the building and site, the account, who buys and how they decide, the current-provider situation when disclosed — unknowns marked unknown",
      "Each opportunity checked against the acceptance criteria you agreed with us, criterion by criterion, before it is handed over",
      "A concrete next sales step coordinated with the buyer — a call or meeting with your estimator or salesperson, or a site assessment by your team — on a date",
      "A complete opportunity brief and a warm introduction at handoff, then downstream progress tracked when you report it",
      "Weekly report on accepted sales opportunities handed off, plus one optimization change each week",
    ],
    youKeep:
      "Technical HVAC discovery, the site assessment, the estimate, the proposal, the negotiation, the close and the work itself stay with you. We develop the opportunity; you do the technical selling and close it.",
    reportCadence: "Weekly",
  },
];

/** Stable per-plan fragment: "managed-outbound", "opportunity-engine". */
export function planSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// WHO OWNS WHAT, as a grid (core.offer.RESPONSIBILITY). One row per responsibility, one cell
// per plan, in plan order. The last row is the contractor's on both plans — that row is the
// boundary, and it is in the table so nobody has to infer it from an absence.
export type ResponsibilityRow = {
  responsibility: string;
  /** [Managed Outbound, Opportunity Engine] */
  owner: ["we" | "you", "we" | "you"];
};

export const responsibilityMatrix: ResponsibilityRow[] = [
  { responsibility: "Targeting: the account profile, and the work and property types to screen out", owner: ["we", "we"] },
  { responsibility: "Account research from public sources, with a cited reason and a source link per account", owner: ["we", "we"] },
  { responsibility: "Reaching the decision-maker at each account (or the colleague they send us to)", owner: ["we", "we"] },
  { responsibility: "Outreach and the follow-up sequence, written per account and sent in your name", owner: ["we", "we"] },
  { responsibility: "Reading every reply and screening the interest: genuine, relevant, from someone who decides", owner: ["we", "we"] },
  { responsibility: "Simple questions answered by email, and every open conversation tracked", owner: ["we", "we"] },
  { responsibility: "The warm handoff: the record, the whole conversation, a warm introduction, your booking path, ownership passed to you", owner: ["we", "we"] },
  { responsibility: "Validating the business need and the timing with the buyer", owner: ["you", "we"] },
  { responsibility: "Property, account and buyer information, gathered where it can honestly be obtained", owner: ["you", "we"] },
  { responsibility: "Checking the opportunity against the acceptance criteria you agreed with us", owner: ["you", "we"] },
  { responsibility: "Coordinating a concrete next sales step with the buyer, and the opportunity brief", owner: ["you", "we"] },
  { responsibility: "An engaged call with an interested contact, under your written authorization (never a cold call)", owner: ["you", "we"] },
  { responsibility: "Technical discovery, the site assessment, the estimate, the proposal, negotiation and the close", owner: ["you", "you"] },
];

// What the extra money buys — the answer to the question that decides the deal
// (core.offer.STEP_UPS, verbatim). The plans differ by HOW FAR we carry each opportunity,
// never by inflating the same deliverable or the message count.
export type StepUp = { from: string; to: string; delta: string; body: string };

export const stepUps: StepUp[] = [
  {
    from: "Managed Outbound",
    to: "Opportunity Engine",
    delta: "+$1,000/mo",
    body: "Managed Outbound hands you a qualified conversation: a decision-maker who wants to talk, introduced to your team with the account, the contact and the whole conversation. The Opportunity Engine keeps going: it validates the business need, gathers the property, account and buyer information, checks the opportunity against the criteria you agreed with us, and coordinates a concrete next sales step before handing you a complete opportunity brief. You stop qualifying and scheduling; your team still does the technical discovery, the estimate, the proposal and the close.",
  },
];

// Terms that are part of the offer (core.offer.TERMS). There is exactly ONE pricing model.
export const offerTerms: string[] = [
  "Flat monthly price. No setup fee.",
  "No per-lead charge, no per-opportunity fee, no acceptance fee, no performance fee and no commission — one flat price per plan.",
  "Month-to-month. Either side can cancel on 14 days' written notice.",
  "No pilot and no free trial of a paid plan. The free audit is the sample, and it costs nothing.",
  "No guarantee of revenue, contracts, appointments, site visits, qualified conversations, sales opportunities or any count of them.",
];

/* -------------------------------------------------------------------------- */
/*  The funnel (D-028 §5)                                                       */
/* -------------------------------------------------------------------------- */

// core.offer.FUNNEL + FUNNEL_CLOSE. Shared by both plans up to "plan-specific handling"; what
// happens there is each plan's `afterInterest` above. No account is forced through the $2,500
// workflow — the plan decides how far we carry it.
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
    stage: "Decision-makers",
    detail: "The named person at each account who can take a vendor decision for the building or the portfolio, or who routes one. A general inbox is never treated as a decision-maker.",
  },
  {
    stage: "Outreach and follow-up",
    detail: "A message written for that account, tied to its cited reason, sent in your name from your own domain and mailbox, with a short follow-up sequence.",
  },
  {
    stage: "Genuine interest",
    detail: "Every reply is read the same day. Genuine interest is confirmed by a person, not a keyword match, and an opt-out is suppressed in code immediately.",
  },
  {
    stage: "Plan-specific handling",
    detail: "From here the plan you chose decides how far we go: a warm handoff once the prospect agrees to talk with you, or — on the Opportunity Engine — validation, acceptance against your criteria and a coordinated next sales step first.",
  },
];

export const funnelClose: FunnelStage[] = [
  {
    stage: "Downstream outcome feedback",
    detail: "You tell us what happened after the handoff — a meeting, a site assessment, an estimate, a proposal, won, lost or stalled — in your own words.",
  },
  {
    stage: "Targeting and qualification learning",
    detail: "What you report changes which accounts we pursue next and what we ask before handing one over. A change to targeting is one you have seen and approved.",
  },
];

/* -------------------------------------------------------------------------- */
/*  The warm handoff (both plans) and the acceptance standard (Opportunity Engine) */
/* -------------------------------------------------------------------------- */

// core.offer.WARM_HANDOFF_STEPS, verbatim, read from the OS export (lib/generated/vocabulary.ts,
// the Warm Handoff term) since 2026-09-18. The same sequence on both plans; what differs is the point it
// runs at (Qualified Interest or an Accepted Sales Opportunity) and what travels with it.
export const warmHandoffSteps: string[] = [...canonTerm("warm_handoff").steps];

// What an Accepted Sales Opportunity requires (core.offer.HANDOFF_STANDARDS
// ["accepted_opportunity"]; four facts must be confirmed BY THE BUYER, not inferred by us).
// "Unknown" is a recorded value: unavailable information is marked unknown and never invented.
export type StandardFact = { fact: string; detail: string; buyerConfirmed?: boolean };

export const qualificationStandard: StandardFact[] = [
  {
    fact: "It is a qualified conversation first",
    detail: "The account fits the profile you approved, the reply is genuine, the person decides or has sent us to who does, and they agreed to speak with your team.",
    buyerConfirmed: true,
  },
  {
    fact: "The business need is validated with the buyer",
    detail: "A concrete need and work type in the buyer's own words. A request for information, a brochure request, a polite reply or accepting a free sample is recorded honestly and never counts as a need.",
    buyerConfirmed: true,
  },
  {
    fact: "The timing is confirmed by the buyer",
    detail: "A timing window the buyer stated. Someday, later and not now are not a timing.",
    buyerConfirmed: true,
  },
  {
    fact: "The property, account and buyer information is gathered",
    detail: "The building and site, the account, who buys and how they decide — gathered where it can honestly be obtained, with anything unknown marked unknown.",
  },
  {
    fact: "It is accepted against the criteria you agreed with us",
    detail: "Every acceptance criterion you agreed at onboarding is checked, one by one, with the evidence for each. A criterion that is not met means it is not handed over.",
  },
  {
    fact: "A concrete next sales step is coordinated",
    detail: "A call or meeting with your estimator or salesperson, or a site assessment by your team, agreed by the buyer and set on a date.",
    buyerConfirmed: true,
  },
  {
    fact: "The opportunity brief is complete",
    detail: "The conversation, the validated need, the gathered information with unknowns marked, the criteria check, the next step and the open questions, in one place your team can act on.",
  },
];

// Information gathered on the Opportunity Engine WHERE GENUINELY OBTAINABLE (D-028 §2). Every
// entry may come back "unknown" — and is recorded as unknown rather than filled in. None of it
// is a technical assessment: that is your team's work.
export const contextFields: string[] = [
  "business and property identity",
  "the relevant buyer or contact, and their role",
  "location, and whether it is inside your service area",
  "commercial fit against your agreed criteria",
  "the stated need and the stated work type",
  "maintenance, service or replacement interest",
  "timing",
  "property and building context",
  "the current-provider situation, when the buyer discloses it",
  "the decision process, and who else is involved",
  "the next sales step, and when it is set",
  "notes useful to your sales and estimating staff",
];

/* -------------------------------------------------------------------------- */
/*  Calling policy, and how the sending is controlled                          */
/* -------------------------------------------------------------------------- */

// D-028. It is not a calling service: there are no cold calls, on any plan.
export const callingPolicy: string[] = [
  "Cold outreach is email-led. We make no cold calls, on any plan.",
  "A call becomes appropriate only after a contact has shown genuine interest, and only when a live conversation would add something an email cannot.",
  "On Managed Outbound, a prospect who wants to talk is introduced to you, and the call is yours to make.",
  "On the Opportunity Engine we can run an engaged call with an interested contact, under your written authorization.",
];

// How sending actually runs. These numbers are the ones the operating system's send gate
// enforces (presend-gate.py WARMUP_RAMP; the client template's 3-touch / 4-day cadence).
export type CadenceFact = { title: string; body: string };

export const sendingCadence: CadenceFact[] = [
  {
    title: "It goes out from your domain, deliberately slowly",
    body: "We start at 1 message a day, 2 a day from day 1, 5 a day from day 2, 10 a day from day 4, then up to full volume from day 6. Starting slow protects your domain's reputation; a mailbox that opens at full speed gets filtered, and that is not recoverable in a month.",
  },
  {
    title: "A short, spaced sequence on both plans",
    body: "Each account gets up to 3 touches, at least 4 days apart, each one adding something new rather than chasing. A reply stops the sequence.",
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
    name: "Lead marketplaces and per-lead sellers",
    whatItIs: "Sell service requests or contact details, priced per lead, often to several contractors at once.",
    difference: "We sell no leads. Every account is a business we researched for you, and nothing is priced per lead: you pay a flat monthly fee for work done in your name.",
    whenItFits: "You want inbound service requests this week and are happy to pay per request.",
  },
  {
    name: "Contact-data providers",
    whatItIs: "Sell databases of company and contact records to search and export.",
    difference: "Every account is researched one at a time, with a named person chosen for the building, a cited reason and a source link. We also write and send the outreach.",
    whenItFits: "You have people who will research, write and follow up, and you only need raw data.",
  },
  {
    name: "General cold-email agencies",
    whatItIs: "Run outbound email campaigns for many industries.",
    difference: "One niche. Every account is researched individually with a cited reason, and the price follows how far we carry each opportunity rather than the message count.",
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
    difference: "We never estimate, quote, propose, price or close. We create the conversation (and on the Opportunity Engine develop it into an accepted sales opportunity); your team does the technical selling and closes it.",
    whenItFits: "You have nobody who can quote and win commercial work — which is also a reason this service is not yet a fit.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Fit lists                                                                   */
/* -------------------------------------------------------------------------- */

// ONE niche: established HVAC contractors that already sell and complete commercial work
// (D-025; unchanged by D-027 and D-028). Every entry is a clause of the canonical ICP sentence
// (core/icp.ONE_SENTENCE in the operating-system repo) or one of its qualifiers, phrased so
// an owner can check it against his own shop in a second.
//
// Do NOT re-broaden this to "service businesses / SaaS / professional services". A list that
// includes everyone tells an HVAC owner nothing about whether the service understands him.
export const idealFor: string[] = [
  "Established HVAC contractors that already sell and complete commercial work — service, maintenance, repair or replacement — whether it is most of your work or a real share of it",
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
//   * "no commercial work yet" is a reason not to sell to that CONTRACTOR — never, in any
//     wording, a suggestion that anyone other than a business could be contacted instead.
//   * "we do not sell leads of any kind" keeps the lead buyer out; who we DO contact
//     (businesses only — gate #0f in the operating system) is stated as a positive elsewhere.
// Neither names the retired residential model (2026-09-18): the site says what it is for.
export const notFor: string[] = [
  "Contractors with no commercial work yet — we research commercial accounts, and without commercial jobs there is no account base for us to build on",
  "Anyone wanting to buy leads — we do not sell, resell or broker leads of any kind",
  "Companies at capacity year-round, or not looking to add accounts",
  "Companies already running an in-house outbound or BDR team — you already own what we sell",
  "Solo operators — a commercial account arrives with response-time expectations one truck cannot hold",
  "Companies with nobody to take a commercial sales conversation — we hand over qualified conversations and accepted sales opportunities; the technical discovery, the estimate, the proposal and the close stay yours",
  "Anyone who wants us to inspect, size or specify equipment, estimate, write proposals, price or close — that work is the contractor's, on both plans",
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
    body: "Nobody else is being sold the same account. We do not buy, sell, resell, or broker leads, shared or exclusive, so you are never bidding against other contractors for one form fill. There is no per-lead price and no per-opportunity fee: a flat monthly fee buys the plan you chose, on the account types and service area you approve.",
  },
  {
    title: "The line between our work and yours is printed on the plan",
    body: "Managed Outbound hands over at Qualified Interest: a decision-maker who agreed to talk, introduced to you warm. The Opportunity Engine hands over only an Accepted Sales Opportunity: the need validated, accepted against your criteria and the next sales step set. Managed Outbound never quietly includes the Opportunity Engine's work, and on both plans the technical discovery, the estimate, the proposal and the close are yours.",
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
    title: "Every account is a business, researched from public sources and cited",
    body: "The businesses we write to in your name are found the checkable way: a property manager's own portfolio page, a posted renovation, a permit filing, a facilities team named on a company site. Every account carries the source link and the reason it was picked; no citation, no contact. Nothing comes from a purchased list.",
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

export type Faq = {
  question: string;
  answer: string;
  group: FaqGroup;
  /** Rendered OPEN on the homepage. The rest are in the page too, each behind its own
   *  disclosure, so nothing is removed from the site or from the FAQPage markup — the
   *  homepage just stops reading as a FAQ archive (conversion supplement, "Compress"). */
  featured?: boolean;
};

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
// self-contained sentence that restates the subject ("No, we make no cold calls on any plan" —
// never a bare "No."), because these exact strings are lifted whole into acceptedAnswer.text
// and get quoted in isolation, both by an answer engine and by an owner skimming on a phone.
//
// PLAIN LANGUAGE (D-022): one idea per sentence, the noun named, no agency register.
//
// ONE PLAN PER SENTENCE. When an answer says what a plan does, it names that plan in its own
// sentence. tests/pricing-model.test.ts reads these answers sentence by sentence and fails if
// a sentence about Managed Outbound claims need validation, acceptance against criteria or
// next-step coordination — that is the Opportunity Engine's work.
export const faqs: Faq[] = [
  {
    question: "What exactly do you do for a commercial HVAC contractor?",
    featured: true,
    group: "What this is",
    answer:
      "We find the commercial accounts worth pursuing, reach the decision-makers in your name, and hand your team qualified conversations, with a warm introduction. The accounts are businesses in the areas you serve — property managers, building owners, facility teams, multi-site operators — researched from public sources with a cited reason each. Your plan decides how far we carry each one: Managed Outbound hands over at Qualified Interest, and the Opportunity Engine carries it on to an Accepted Sales Opportunity. On both plans, your team does the technical selling, estimates and closes.",
  },
  {
    question: "How is this different from buying leads?",
    featured: true,
    group: "What this is",
    answer:
      "We sell no leads at all — you pay a flat monthly fee for a managed outbound service, never a per-lead price. Every account is a business we researched for you: a property manager, a building owner, a facility team. Nobody else is sold the same account. The trade-off is real: a lead seller hands you a name today, and a commercial account takes weeks of research and contact to reach.",
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
      "We do not do technical discovery or site assessments, diagnose, size or specify equipment, set the scope, write the estimate or the proposal, set the price, negotiate terms, or close the deal — those stay with your team on both plans. We also do not sell or resell leads, run paid ads, make cold calls, or buy contact lists, and we do not promise that any account will sign. We create the sales conversation; you do the technical selling and close it.",
  },
  {
    question: "Do you make phone calls?",
    group: "How the outreach runs",
    answer:
      "Our cold outreach is email-led, and we make no cold calls on any plan. A call becomes appropriate only after a contact has shown genuine interest, when a live conversation would add something an email cannot. On Managed Outbound, a prospect who wants to talk is introduced to you, and that call is yours to make. On the Opportunity Engine we can run an engaged call with an interested contact, under your written authorization.",
  },
  {
    question: "Where are you based, and who do you serve?",
    group: "What this is",
    answer:
      "We are a founder-run company based in New Jersey, and we work remotely with established HVAC contractors that already do commercial work, anywhere in the United States. The account research runs from public sources in whatever area you serve, so the service does not depend on where we sit. We work one HVAC company per service area.",
  },
  {
    question: "Who exactly will you contact in our name?",
    featured: true,
    group: "Where the accounts come from",
    answer:
      "We contact businesses only: property managers, building owners and facility teams, plus the general contractors and multi-site operators that buy commercial HVAC work. Each is found from public sources and carries the reason it was picked and a link to where we found it. A contractor with no commercial work yet is not a fit for that reason, and the fit check says so before you pay anything.",
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
    featured: true,
    group: "How the outreach runs",
    answer:
      "Yours — outreach sends from your own domain and mailbox, never ours. A property manager who looks you up finds the company that wrote to them, and you can open the sent folder and read every message. Before anything sends you confirm the account categories, the service area, the exclusions, the claims we may make and the sending identity; after that we work inside that envelope, and you can pause at any time. Deliverability depends on your domain setup and history, which stay in your hands; confirm the email and privacy rules in your market before outreach begins.",
  },
  {
    question: "What happens when someone replies with interest?",
    featured: true,
    group: "How the outreach runs",
    answer:
      "What happens next depends on your plan, and only on your plan. On both plans we check that the interest is genuine and relevant and that the person decides. On Managed Outbound, once they agree to speak with you, we hand them to you with a warm introduction and the whole conversation. On the Opportunity Engine we first validate the need, gather the account information, check it against your agreed criteria and set a concrete next sales step, then hand it over with a complete brief.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    group: "How the outreach runs",
    answer:
      "Anyone who asks not to be contacted is suppressed immediately, in code, and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every send rather than something a person has to remember. Opt-outs are processed even while a campaign is paused, and the suppression list goes with you if you leave.",
  },
  {
    question: "What is a qualified conversation?",
    group: "What you can expect",
    answer:
      "A qualified conversation is a decision-maker at a commercial account that fits your profile who showed genuine interest and agreed to speak with your team, confirmed by a person — not by a keyword match. It is the one measure every report is organized around, always shown against the accounts contacted and the messages sent to get there. It is a count of what happened, never a commitment to a number. An accepted sales opportunity is a further step that only the Opportunity Engine delivers.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    featured: true,
    group: "What you can expect",
    answer:
      "No, we do not guarantee revenue, contracts, appointments, site visits, qualified conversations or sales opportunities on either plan. You should be wary of anyone in this industry who does. Whether an account signs depends on your price, your references, your timing, and how the site visit goes. What we commit to is running the system, doing the work to the stated standard, and reporting the results honestly.",
  },
  {
    question: "How many accounts or messages does each plan cover?",
    group: "What you can expect",
    answer:
      "Each plan has a monthly capacity limit, and it is a supporting fact rather than the reason one plan costs more than the other. Managed Outbound covers up to 100 outreach messages a month, first touches and follow-ups alike, which is about 33 accounts on a three-touch sequence. The Opportunity Engine covers up to 150, about 50 accounts. The count is in messages because that is the unit our sending controls enforce, so the report reconciles against the agreement line for line.",
  },
  {
    question: "What does a handoff actually contain?",
    group: "What you can expect",
    answer:
      "A handoff arrives by email, to the person on your team who takes it, with a warm introduction to the buyer. On Managed Outbound it carries the account, the contact, the context and the whole conversation, plus your booking link where it fits. On the Opportunity Engine it also carries the opportunity brief: the validated need and timing, the account information with unknowns marked, the check against your criteria and the next sales step already set.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    group: "What you can expect",
    answer:
      "No, there are no published case studies or client results yet, and we will not invent any. This is an early, founder-led service. What the site shows instead is the standard, the account format, the process, and the price. Start with the free audit and judge the first accounts on their own merits — that is the proof that matters before you spend anything.",
  },
  {
    question: "Which plan should I start with?",
    featured: true,
    group: "Money, terms and getting started",
    answer:
      "Pick the plan by how far you want us to carry each opportunity. Managed Outbound is where we suggest starting: we create qualified conversations and introduce each one to your team warm. If you want each one validated, accepted against your criteria and scheduled before your estimator spends time on it, that is the Opportunity Engine — and it only makes sense if someone on your team quotes and wins commercial bids. The fit check gives you a read from your own answers.",
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
    featured: true,
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
    "It shows the quality of the work, not a promised result. No guaranteed leads, calls or jobs. Nothing is sent to anyone as part of it. Every account in it is a business, with the public source it came from.",
} as const;

/* -------------------------------------------------------------------------- */
/*  One real account, shown                                                     */
/* -------------------------------------------------------------------------- */

// SHOW THE PRODUCT (conversion supplement): one real, supportable account in the exact shape
// every account in the audit arrives in — the target account, why it fits, the buyer role,
// the source, the reason to write, and the recommended approach.
//
// PROVENANCE (replaced 2026-09-18). Until then this was entry 3 of a set prepared on
// 2026-08-30 for a residential-era campaign (the operating-system repo's
// data/starter_sets/hvac/L-1017_starter_set.md): a manager of condo, townhome and homeowner
// associations. It was real, but it told a commercial HVAC contractor that the audit was about
// residential communities. No prepared set in the operating system holds a commercial account
// yet, so this one was researched on 2026-09-18 from a public trade-press article specifically
// to show the format — and the disclosure says exactly that: it was not prepared for a client.
// Every quoted phrase is verbatim from Real Estate NJ, "NAI Hanson Management lands three new
// assignments in New Jersey, New York" (Joshua Burd, May 8, 2026):
// https://re-nj.com/nai-hanson-management-lands-three-new-assignments-in-new-jersey-new-york/
// NOTHING here is invented: no account, no buyer, no trigger, no reply, no result. The firm's
// name and the article link are withheld on the page, as for every account we research, and
// the buyer is given as a ROLE even though the article names that person.
//
// The approach is labelled as OURS. It is a recommendation about what to write, never a claim
// about the state of anyone's equipment (D-024: an opportunity, not a diagnosis).
//
// ONE TEXT, FROM THE OPERATING SYSTEM (2026-09-18). The fields are read from the OS export
// (lib/generated/specimens.ts `account`, from core/specimens.py), where the SAME account is the
// first specimen on /sample-deliverables and passes the send gate's own starter-set checks. The
// earlier hand-written "why it fits" said the buildings' equipment "needs a maintenance
// contractor" — the claim-about-a-stranger's-needs shape the gate refuses in every real record —
// so the example a contractor was shown broke the standard it was meant to demonstrate.
export const productExample = {
  preparedOn: canonAccount.preparedOn,
  preparedFor: canonAccount.preparedFor,
  account: { label: "Target account", value: canonAccount.account },
  fit: { label: "Why it fits", value: canonAccount.fit },
  buyer: { label: "Relevant buyer", value: canonAccount.buyer },
  source: { label: "Verified source", value: canonAccount.sourceNote, quotes: [...canonAccount.quotes] },
  reason: { label: "Reason for outreach", value: canonAccount.reason },
  approach: { label: "Recommended approach (ours)", value: canonAccount.approach },
  disclosure: canonAccount.disclosure,
} as const;

/* -------------------------------------------------------------------------- */
/*  The service timeline                                                        */
/* -------------------------------------------------------------------------- */

// CANONICAL SOURCE: the operating-system repo's `core/timeline.py`. This is a RENDERING of
// that module, not a second timeline — `scripts/check_cross_repo.py` in that repo asserts
// every `band`, `label` AND `detail` below matches it exactly, and fails the OS validation
// suite if they drift. Add or edit a phase THERE first, then mirror the string here verbatim.
//
// A SUBSET IS ALLOWED, AND THIS IS DELIBERATELY ONE. Eight phases are published: the onboarding
// lane both plans share, and the renewal. The module's delivery phases (the sequence, reply
// handling, screening, the warm handoff, and on the Opportunity Engine validation and
// acceptance) differ by plan and are described on the plan cards, in `sendingCadence` and in
// `warmHandoffSteps`, in D-028 words.
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
