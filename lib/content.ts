// Shared content arrays. Imported by the landing UI (client) AND by the server page
// that emits FAQPage + Offer JSON-LD — one source of truth keeps the structured data
// verbatim-matched to the visible text (a Google rich-results requirement).
//
// THE MODEL THIS FILE DESCRIBES (D-025, 2026-09-10): managed outbound for established
// HVAC contractors that already sell and complete commercial work. The accounts we
// contact in a client's name are BUSINESSES — property and facility managers, building
// owners, multi-site operators, offices, warehouses, schools, healthcare, restaurants,
// retail — researched from public sources with a cited reason per account. A client's
// own account history (past accounts, unaccepted proposals, lapsed service agreements)
// is an optional second lane, never a requirement and never the headline. Homeowners
// are never contacted: not from research, not from a purchased list, not at any price.
//
// Until 2026-09-10 this file sold the retired residential model ("the jobs you already
// quoted are still sitting in your system"). Every string below was rewritten against
// the operating-system repo's core/offer.py, core/icp.py, core/timeline.py and D-025;
// where a sentence there is canonical (the positioning sentence, the timeline phases)
// it is copied verbatim rather than paraphrased, and scripts/check_cross_repo.py in
// that repo fails if it drifts.

import { callLengthMinutes, intakeMinutes } from "./site.ts";

export type Plan = {
  name: string;
  price: number;
  /** One sentence: what this tier actually does for you. */
  oneLiner: string;
  /** Stated monthly ceiling. The work is capacity-limited; quoting a tier without
   *  its ceiling reads as unlimited. */
  capacity: string;
  /** Who should pick this one, in a single sentence. */
  bestFor: string;
  /** Short bullets. Mirrors core/offer.TIERS[*].scope in the operating-system repo —
   *  the same list the proposal and the owner's call brief render, so the prospect
   *  reads one scope on the site and hears the same one on the call. */
  includes: string[];
  /** What stays with you. Named on the card, not buried in the contract. */
  youKeep: string;
  featured?: boolean;
};

// The volume unit is deliberate and audited (core/offer.py, 2026-08-30): on the entry
// tier the number is ACCOUNTS delivered, because we send nothing; on the two managed
// tiers it is outreach MESSAGES a month, first touches and follow-ups alike, because
// that is what the send gate actually enforces. "About 33 accounts" is 100 / 3 on the
// default three-touch sequence — an approximation a buyer can picture, not the cap.
export const plans: Plan[] = [
  {
    name: "Lead Engine",
    price: 750,
    oneLiner: "We build the account list. You work it.",
    capacity: "Up to ~40 researched, cited commercial accounts per batch — you send",
    bestFor: "Someone in your office will make the calls and send the emails.",
    includes: [
      "Ideal-account profile built with you, including the work to screen out",
      "Commercial accounts in your area researched from public sources — property and facility managers, building owners, multi-site operators, offices, warehouses, schools, healthcare, restaurants, retail — each with a named contact, a cited reason and a source link",
      "Your own account history, if you have it — past accounts, unaccepted and expired proposals, lapsed service agreements — cleaned, deduped, suppression-checked and ranked by how close each is to a job",
      "Referral partners near you researched from public sources, each with a cited reason and a source link",
      "Outreach scripts and a follow-up sequence, yours to keep",
      "Delivered CRM-ready, with a handoff walkthrough",
    ],
    youKeep: "You send everything and handle every reply. No outreach runs at this tier.",
  },
  {
    name: "Outreach Engine",
    price: 1500,
    oneLiner: "We write and send the emails, and run the follow-up.",
    capacity:
      "Up to ~100 outreach messages a month, first touches and follow-ups alike (about 33 accounts on a 3-touch sequence)",
    bestFor: "Nobody has time to find accounts and chase the follow-up, and you don't want to hire for it.",
    includes: [
      "Everything in Lead Engine",
      "Personalized outreach written and managed per account, tied to its cited reason — never mail-merge",
      "Follow-up cadence run for you",
      "Reply monitoring and triage — interested replies flagged and handed to you the same day",
      "Monthly report of verified activity, organised around qualified conversations started",
    ],
    youKeep: "You take the sales conversation. No appointments are booked at this tier.",
    featured: true,
  },
  {
    name: "Appointment Engine",
    price: 2500,
    oneLiner: "We qualify the replies and book the conversations.",
    capacity:
      "Up to ~150 outreach messages a month, first touches and follow-ups alike (about 50 accounts on a 3-touch sequence)",
    bestFor: "You want the whole engine run for you, with qualified conversations on your calendar.",
    includes: [
      "Everything in Outreach Engine",
      "Every interested reply qualified against your criteria",
      "Qualified conversations booked onto your calendar, with confirmations and reminders",
      "Pre-call briefs for every booked conversation",
      "Weekly report on qualified conversations started, plus one optimization change each week",
      "Monthly review with next-period plan",
    ],
    youKeep: "You run the site walkthrough, the bid, the quote and the close.",
  },
];

// Audience qualifiers. Surfaced as a dedicated section so the right visitor
// self-identifies fast and the wrong-fit visitor screens themselves out before
// they book — fewer, better-fit calls instead of broad, low-intent volume.
//
// ONE niche: established HVAC contractors with a commercial/B2B component (D-025).
// Every entry is a clause of the canonical ICP sentence (core/icp.ONE_SENTENCE in the
// operating-system repo) or one of its qualifiers, phrased so an owner can check it
// against his own shop in a second ("do we bid commercial work? yes"), not a category
// label he has to interpret. A visitor reached by the outbound has to see himself here
// immediately, or the whole funnel leaks at the landing.
//
// Do NOT re-broaden this to "service businesses / SaaS / professional services".
// It read that way until 2026-08-23 and cost the page its whole reason to exist:
// a list that includes everyone tells an HVAC owner nothing about whether the
// service understands his business.
export const idealFor: string[] = [
  "Established HVAC contractors that already sell and complete commercial work — service, maintenance, repair or replacement — alongside residential or instead of it",
  "Someone on the team who quotes commercial bids and wins them",
  "Room to take on more commercial accounts",
  "Commercial work that arrives by referral, repeat and word of mouth, with no consistent way to find new accounts and follow up with them",
  "A commercial buyer you can describe: property managers, building owners, facility teams or multi-site operators in your area",
  "Follow-up you want done every week, without hiring for it",
];

// Honest disqualifiers. Each maps to a decline in core/icp.DISQUALIFIERS in the
// operating-system repo, and the four the fit check enforces in code (lib/qualification.ts
// BLOCKS) MUST each have an entry here — tests/qualification.test.ts holds the two lists
// together, so the site never screens someone out for a reason it did not publish.
//
// Two of these are load-bearing rather than cosmetic:
//   * "residential-only" is the D-025 inversion. It is a reason not to sell to that
//     CONTRACTOR — never, in any wording, a suggestion that his homeowners could be
//     contacted instead.
//   * "we never contact homeowners" is gate #0f in the operating system (client-owned
//     pool): consumers are never cold-sourced, unconditionally, and no client config can
//     authorize it. Saying so here keeps the marketing claim and the code gate identical.
// The last item names the real limitation of an early business rather than papering
// over it — stating it plainly is what earns the benefit of the doubt from a careful buyer.
export const notFor: string[] = [
  "Residential-only shops — we research commercial accounts, and a shop with no commercial work has no account base for us to build",
  "Anyone wanting to buy homeowner leads — we are not a lead seller, and we never contact homeowners",
  "Companies at capacity year-round, or not looking to add accounts",
  "Companies already running an in-house outbound or BDR team — you already own what we sell",
  "Solo operators — a commercial account arrives with response-time expectations one truck cannot hold",
  "Companies with nobody to quote and win commercial work — we research, reach and follow up; the walkthrough, the bid and the close stay yours",
  "Anyone wanting thousands of unverified addresses blasted overnight",
  "Anyone expecting guaranteed jobs, revenue, or a set number of appointments",
  "Anyone needing published case studies before starting — there are none yet",
];

// Differentiators / objection-reducers, written against what an HVAC owner has
// actually been burned by before: shared leads sold to four contractors at once,
// a vendor that kept the list, and a blast that went out in his name without him
// seeing it. Every item maps to something the service actually does elsewhere on
// the page or to a gate in the operating system — no new claims are introduced
// here, and none of them promise an outcome.
export type Differentiator = { title: string; body: string };

export const differentiators: Differentiator[] = [
  {
    title: "We are not a lead seller",
    body: "Nobody else is being sold the same account. We do not buy, sell, resell, or broker leads, shared or exclusive, so you are never bidding against three other contractors for one form fill. There is no per-lead price: a flat monthly fee buys research and outreach on the account types and service area you approve.",
  },
  {
    // SEPARATE THE PRACTICE FROM THE CONTRACTUAL RIGHT. This card used to headline "One
    // HVAC company per service area, while you are a client" and close with "if you want
    // it in writing, ask for it in the order form" — which reads as though asking is all
    // it takes. The agreement says otherwise: CSA §4 makes the Services non-exclusive by
    // default and requires exclusivity "written into the Order Form as a priced add-on",
    // and the Order Form's own checkbox defaults to "Not purchased (default —
    // non-exclusive)". Nothing on the site said it costs extra. A buyer who has been sold
    // as one of five shared leads is exactly the buyer who will check this clause, and
    // finding the gap at the signature block is how a deal dies at the last step.
    title: "One HVAC company per service area — and what that is worth",
    body: "We run a conflict check before accepting anyone, and we work one HVAC company per service area: while we work for you, we will not take on a competing shop in your territory. The reason is practical — the property managers and facility teams we would write to for you are the same ones a competitor would want. Be clear on what this is, though. As standard it is an operating practice, not a contractual right: the agreement is non-exclusive by default. If you want it enforceable, contracted per-metro exclusivity is a priced add-on on the order form, and we will quote it before you sign rather than spring it on a call.",
  },
  {
    title: "Every account is researched from public sources, and cited — and we never contact homeowners",
    body: "The businesses we write to in your name are found the checkable way: a property manager's own portfolio page, a posted renovation, a permit filing, a facilities team named on a company site. Every account carries the source link and the reason it was picked; no citation, no contact. Homeowners are never on the list — not from research, not from a purchased file, not at any price. If you have your own account history to send — past accounts, proposals that were never accepted, lapsed service agreements — we work that too, as an optional second lane, and a record claiming to be yours that isn't in the file you approved is blocked.",
  },
  {
    title: "It goes out from your name, with your sign-off",
    body: "Messages send from your own domain and mailbox, so the people we write to see the company they can look up, and you can read the sent folder yourself. You approve the targeting, the messaging and the first batch before anything sends, and you can pause any time after that.",
  },
  {
    title: "One clear line of ownership",
    body: "We own the account research, the writing, and on the outreach tiers the sending, follow-up and reply triage. We report it honestly. You own the site walkthrough, the bid, the quote and the close. No account manager in between.",
  },
];

// What a buyer is actually risking, assembled in one place.
//
// Every line here is a CLAUSE THAT ALREADY BINDS US, not a marketing promise invented
// for this block. The business had more real risk reversal than most agencies and got
// credit for none of it, because it was scattered across four pages: the notice period
// sat in an FAQ, the make-good sat in a pricing-page answer, and the refund of an
// unbegun period and the published-terms floor existed only inside the contract nobody
// reads before buying.
//
// The hard constraint this block lives under: a business with zero results cannot offer
// an OUTCOME guarantee, and must never imply one. So every entry below guarantees the
// DELIVERY, the TERMS, or the OWNERSHIP — never the result. Read them again before
// editing: "we replace an account that failed our own citation standard" is a quality
// commitment; "we refund you if it doesn't work" would be an outcome guarantee wearing
// a refund's clothes, and is exactly what must never appear here.
//
// Source of truth for each is named in `clause` and must stay accurate — these are the
// citations that make the block checkable rather than reassuring.
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
    body: "The account lists, the scripts, the trackers, and your suppression list. Leaving claws none of it back, and the opt-out list is handed over within five business days.",
    clause: "Services agreement §10.6",
  },
  {
    title: "Your data is deleted within 30 days of the end",
    body: "We delete or de-identify your records from active systems within 30 days of the engagement ending. One thing is kept permanently: the do-not-contact list, because destroying it is how an opt-out gets forgotten.",
    clause: "Services agreement §10.6 / §10.6.1",
  },
];

// Real client reviews, published ONE AT A TIME, by hand, after the operating-system repo's
// scripts/record_review.py has recorded named, quoted consent (CSA §14.2 / FTC 16 CFR Part 255)
// — see that script's own printed instructions for the exact entry to add here. This array is
// EMPTY on purpose, the same "no case studies yet" honesty as everywhere else on this site (see
// README.md's house rule): adding an entry here IS the publish action, and it must never happen
// without a contentHash this site cannot itself verify — that verification lives in the other
// repo's data/reviews/log.csv, by design, so a review can never be added here as a copy-paste
// shortcut around the consent step.
export type Review = {
  quote: string;
  /** How to credit it, e.g. "Jane D., HVAC contractor" — never a full name without explicit consent. */
  name: string;
  /** The client_id this came from, in the operating-system repo (not shown on the page). */
  clientId: string;
  /** The content hash scripts/record_review.py printed — the operating-system repo's own proof
   *  this exact quote was consented to. Cross-checkable, never displayed. */
  contentHash: string;
};

export const reviews: Review[] = [];

// Grouping is presentational only. The FAQPage JSON-LD in app/page.tsx still maps the
// flat array, so the structured data stays a verbatim mirror of the visible text — the
// rich-results requirement — while the reader gets every question sorted into the
// five things they are actually asking about instead of one undifferentiated column.
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
// self-contained sentence under 25 words that restates the subject ("No, we never
// contact homeowners" — never a bare "No."), because these exact strings are lifted
// whole into acceptedAnswer.text in app/page.tsx and get quoted in isolation, both by
// an answer engine and by an owner skimming on a phone between jobs. Substantiation
// follows in two to four short sentences; the working cap is about 90 words.
//
// PLAIN LANGUAGE (D-022): one idea per sentence, the noun named, no agency register.
// "Property managers and building owners", never "your ICP"; "we write and send the
// emails", never "we run the outbound motion".
export const faqs: Faq[] = [
  {
    question: "What exactly do you do for an HVAC contractor?",
    group: "What this is",
    answer:
      "We identify commercial accounts that fit your business, contact the right decision-makers, handle the follow-up, and turn interested responses into qualified conversations for your team. The accounts are businesses in your area — property managers, building owners, facility teams, multi-site operators — researched from public sources with a cited reason each. Your tier decides whether we hand you the list and the scripts, or write and send the emails and run the follow-up ourselves.",
  },
  {
    question: "Do you cold-call or cold-email homeowners?",
    group: "Where the accounts come from",
    answer:
      "No, we never contact homeowners — not from research, not from a purchased list, not at any price. Everyone we write to in your name is a business: a property manager, a building owner, a facilities team, a general contractor. Each is found from public sources and carries the reason it was picked and a link to where we found it. A residential-only shop is not a fit for that reason, and we say so on the fit check rather than after you pay.",
  },
  {
    question: "Where do the accounts actually come from?",
    group: "Where the accounts come from",
    answer:
      "The accounts are researched from free public sources — a property manager's portfolio page, a company's facilities team, a posted renovation, a permit filing — and every one carries its source link, a fit reason, and a named person to reach. Nothing is bought from a data broker, and an account with no citation cannot be contacted at all. If you also have your own account history — past accounts, proposals that were never accepted, lapsed service agreements — you can send it and we work that too. It is optional, and nothing from it is contacted until you have approved the list.",
  },
  {
    question: "What do you need from us to start?",
    group: "Money, terms and getting started",
    answer:
      "Four things, about 30 minutes: the account types you want (property managers, offices, schools, healthcare, retail, and so on), the areas you serve, the work and the accounts you want screened out, and who on your team takes an interested reply. That is the whole intake. You do not have to send a customer list: the account research runs from public sources. If you do have past accounts or old proposals to send, it is optional and usually the fastest work in the engagement.",
  },
  {
    question: "How is this different from Angi, Thumbtack, or a per-lead seller?",
    group: "What this is",
    answer:
      "We sell no leads at all — you pay a flat monthly fee for research and outreach on the account types and service area you approve, never a per-lead price. Marketplaces sell a homeowner inquiry, usually the same one they sold to three other contractors, and you pay again every time. Nobody else is being sold the accounts we research for you, and the list, scripts and trackers stay yours if you leave. The trade-off is real: a marketplace hands you a name today; a commercial account takes weeks of research and follow-up to reach.",
  },
  {
    // The nearest and cheapest substitute, and the one an established shop reaches for
    // first: the marketing module inside the field-service software they already pay
    // for. The site answered Angi, answered ads agencies, answered hiring — and never
    // answered this, which is the objection most likely to end the conversation.
    question: "ServiceTitan / Housecall Pro / Jobber already emails my customer list. Why pay you?",
    group: "What this is",
    answer:
      "Those tools email the people already in your system; we find and contact the commercial accounts that are not in it yet. Your software cannot research the property managers and building owners in your towns, name the right person at each, or write to them with a cited reason. If you already have someone who does that and follows up every week, you may not need us; most shops don't, because nobody has time.",
  },
  {
    question: "We already have a marketing company running ads. Does this replace them?",
    group: "What this is",
    answer:
      "No, this runs alongside your ads agency rather than replacing it, and usually it should. Ads and local search catch people who are already looking, and for commercial work that is mostly service calls. Property managers and facility teams choosing a contractor for a building or a portfolio rarely search for one; somebody has to write to them, and follow up. That is the work we do. We don't touch your ad accounts, your website, or your Google Business Profile.",
  },
  {
    question: "What makes an account worth contacting?",
    group: "Where the accounts come from",
    answer:
      "An account is worth contacting when it fits the profile you approved, has a named decision-maker with a usable contact path, and carries a specific, checkable reason to write now. The reason is a public fact — a portfolio they manage, a building they just took on, a posted renovation, a maintenance need their own site describes — with the source link attached. No reason, no contact. We never assert what shape a building's equipment is in; an indicator is a reason to write, not a diagnosis.",
  },
  {
    question: "What is a qualified conversation?",
    group: "What you can expect",
    answer:
      "A qualified conversation is a decision-maker at an account that fits your profile who replied with real interest, confirmed by a person — not by a keyword match. It is the one measure every report is organised around, always shown against the accounts contacted and the messages sent to get there. It is a count of what happened, never a commitment to a number. On Appointment Engine we also check each one against the criteria you set before it reaches your calendar.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    group: "What you can expect",
    answer:
      "No, we do not guarantee jobs, appointments, or revenue at any tier. You should be wary of anyone in this industry who does. Whether an account signs depends on your price, your references, your timing, and how the walkthrough goes. What we commit to is running the system, doing the work to the stated standard, and reporting the results honestly. The Appointment Engine tier books qualified conversations on your calendar; no tier promises a number.",
  },
  {
    question: "How many accounts or messages do I get each month?",
    group: "What you can expect",
    answer:
      "On the Lead Engine, a batch of up to about 40 researched, cited commercial accounts that you work yourself. On the Outreach and Appointment tiers the number is outreach messages sent — up to about 100 or 150 a month, first touches and follow-ups counted alike, which is roughly 33 or 50 accounts on a three-touch sequence — and we agree the real number with you before work starts. It is counted in messages because that is the unit our sending controls actually enforce, so the report reconciles against the agreement line for line. Chasing a bigger headline is what pushes a vendor to loosen the targeting or exceed safe sending limits, and we will not do either.",
  },
  {
    question: "How are the accounts delivered?",
    group: "What you can expect",
    answer:
      "Accounts arrive as a spreadsheet, a CRM-ready file, or into a system you name — ranked highest-priority first. Each row carries the company, the named contact and their role, the reason it was picked, the source link you can open, and a status. On the outreach tiers you also get the sending log, so you can see exactly what went to whom and when.",
  },
  {
    question: "Whose email address does this go out from?",
    group: "How the outreach runs",
    answer:
      "Yours — outreach sends from your own domain and mailbox, never ours. A property manager who looks you up finds the company that wrote to them, and you can open the sent folder and read every message. You approve the targeting, the messaging and the first batch before anything sends, you set the volume, and you can pause at any time. Deliverability depends on your domain setup and history, which stay in your hands; confirm the email and privacy rules in your market before outreach begins.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    group: "How the outreach runs",
    answer:
      "Anyone who asks not to be contacted is suppressed immediately, in code, and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every send rather than something a person has to remember. Opt-outs are processed even while a campaign is paused, and the suppression list goes with you if you leave.",
  },
  {
    question: "What do you not do?",
    group: "What this is",
    answer:
      "We do not walk the site, write the bid, set the price, or close the deal — those stay with you at every tier, which is why the fit check asks who quotes and wins your commercial work. We do not sell or resell leads, run paid ads, make phone calls in your name, or contact homeowners. And we do not promise any account will sign. We find the accounts, write and send the emails, handle the follow-up, and hand you the conversations worth having.",
  },
  {
    question: "How is this different from hiring an inside-sales or office person?",
    group: "Money, terms and getting started",
    answer:
      "Every tier costs less than a full-time hire, with no salary, payroll tax, tooling, ramp time, or management attached. In most shops the account research and the follow-up are the first things dropped when the phones get busy. This starts in weeks, moves up or down a tier as the season changes, and is measured against clear reporting. No fixed headcount before you know the approach works in your market.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    group: "What you can expect",
    answer:
      "No, there are no published case studies or client results yet, and we will not invent any. This is an early, founder-led service. What the site shows instead is the standard, the account format, the process, and the price. Start with the free audit or the Lead Engine tier and judge the first list on its own merits — that is the proof that matters before you scale spend.",
  },
  {
    question: "Where are you based, and who do you serve?",
    group: "What this is",
    answer:
      "We are based in New Jersey and work remotely with established HVAC contractors that already do commercial work, across the United States. Campaigns are currently focused on New Jersey, so that is where the local knowledge is sharpest today: which property managers hold which portfolios, permit patterns, and seasonality. Being outside New Jersey does not disqualify you; it means less local context on day one.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    group: "Money, terms and getting started",
    answer:
      `There is no long-term contract: a flat monthly fee, month-to-month, with no setup fee and 14 days' notice either side. You can move between tiers, and everything built for you is yours to keep. It starts with a ${intakeMinutes}-minute fit check on this site, which tells you on the spot whether this is a fit — including when it isn't. If it is, we build your free pipeline audit and send it in writing. A ${callLengthMinutes}-minute walkthrough is offered afterwards, never required.`,
  },
  {
    question: "Do I have to get on a call to get the free audit?",
    group: "Money, terms and getting started",
    answer:
      `No. The call is a ${callLengthMinutes}-minute, no-obligation walkthrough of the audit we already sent you — not a pitch, and not the price of the audit. We go through the account profile and the accounts we picked, you tell us where we read your market wrong, and you decide with the work already in hand whether running it at scale is worth paying for. You can skip it entirely and keep the audit. No work begins until you decide to move forward.`,
  },
];

// The Free Pipeline Audit is the primary trust offer: a free slice of the paid Lead
// Engine work, handed over before any money changes hands. For a business with no
// track record yet, giving away real, verifiable work IS the proof — so the copy here
// promises a deliverable and its quality, never an outcome. Keep it honest and free of
// any guarantee/testimonial/result claim (see the operating-system repo's design spec,
// 20_MARKETING_MY_SERVICES_SYSTEM/free_pipeline_audit.md).
//
// THE DELIVERABLE IS COMMERCIAL ACCOUNTS, and the word matters. The operating-system
// repo's business_rules.py states the rule: "3-5 real, verified COMMERCIAL ACCOUNTS,
// each with a cited reason and a source link, plus one sample message. NEVER
// 'prospects' — an HVAC owner reads that as homeowners, which guard #0f makes
// impossible to source." So the accounts are named as what they are — property
// managers, building owners, facility teams — and the guardrail says out loud that no
// homeowner is in it.
export const audit = {
  name: "Free Pipeline Audit",
  /** Two short sentences. It was one 55-word sentence with three em-dashed asides. */
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
    "It shows the quality of the work, not a promised result. No guaranteed leads, calls or jobs. It contains no homeowner records, because we never contact homeowners; every account in it is a business, with the public source it came from.",
} as const;

// The service timeline, shown so a buyer knows what they are agreeing to before they
// agree to it.
//
// CANONICAL SOURCE: the operating-system repo's `core/timeline.py`. This is a
// RENDERING of that module, not a second timeline — `scripts/check_cross_repo.py`
// in that repo asserts every `band`, `label` AND `detail` below matches it exactly,
// and fails the OS validation suite if they drift. Add or edit a phase THERE first,
// regenerate docs/SERVICE_TIMELINE.md, then mirror the string here verbatim.
//
// A subset is allowed (this page omits internal steps like the final automated
// checks and the Starter-only handoff); a phase stated here with different wording
// is not.
//
// Every band describes work we do. Nothing here is dated against a result —
// replies, meetings, and revenue depend on the market and the offer, so putting a
// date next to one would be inventing a number.
//
// D-025 (2026-09-10) changed the SHAPE of this list, not just its words. The pace-setter
// used to be the client's export of their own customer records, because for a
// residential engagement that was the only lawful prospect source there was. For a
// commercial engagement the account research is what the first weeks consist of, it
// runs at OUR pace, and the export is an optional second lane — so the research phase
// is new here, and the export phase is now explicitly optional.
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
    band: "Your pace, optional",
    label: "You export the account history you already own",
    owner: "you",
    detail:
      "Optional, and usually the fastest work in the engagement: past accounts, proposals that were never accepted, lapsed service agreements, jobs that never became a contract. We cannot research, buy or infer these — only you can send them. Nothing is contacted until they are imported and you have approved the list. If you have nothing to export, the account research above runs anyway.",
  },
  {
    band: "Days 3-5",
    label: "We arm the mailbox you own",
    owner: "both",
    detail:
      "Messages go out from your sending identity, never ours. You can open the sent folder and read exactly what went where.",
  },
  {
    band: "3 business days",
    label: "You approve the setup and the first batch",
    owner: "you",
    detail:
      "Targeting, messaging pattern, and the first batch, in your words before anyone reads them. If you do not respond, we hold. Silence is never taken as approval.",
  },
  {
    band: "About a week in, once the steps above are done",
    label: "First messages go out — deliberately slowly",
    owner: "we",
    // The REAL ramp, from the array the send gate enforces: presend-gate.py WARMUP_RAMP
    // = [(0,1),(1,2),(2,5),(4,10),(6,None)], mirrored in core/timeline.py. This line
    // used to read "5 a day for three days, 10 a day for the next three" — overstating
    // day one by 5x — because check_cross_repo.py compared only `band` and `label` and
    // never `detail`, so the two could drift silently and did. It compares all three now.
    detail:
      "We start at 1 a day, 2 a day from day 1, 5 a day from day 2, 10 a day from day 4, then up to full volume from day 6. Starting slow protects your domain's reputation; a mailbox that opens at full speed gets filtered, and that is not recoverable in a month.",
  },
  {
    band: "About two weeks per prospect",
    label: "Each prospect gets a short, spaced sequence",
    owner: "we",
    // 3 touches / 4 days apart, from core.timeline.touch_shape() against the live client
    // template. This said "up to 4 touches, at least 3 days apart" — the inverse — which
    // also broke the arithmetic on the tier cards: the "about 33 accounts" behind a
    // 100-message cap is 100/3, and on a 4-touch cadence 100 messages is 25, not 33.
    detail:
      "Up to 3 touches, at least 4 days apart, each one adding something new rather than chasing. Anyone who asks us to stop is suppressed immediately, in code, permanently.",
  },
  {
    band: "Ongoing, same day",
    label: "Replies are triaged as they arrive",
    owner: "we",
    // TRIAGE IS EVERY MANAGED TIER; QUALIFICATION IS THE $2,500 TIER ONLY (D-020 §5, CSA
    // §3 item 8). The boundary is named inside the one string so the phase stays shared.
    detail:
      "Every reply is read and classified by interest, and the interested ones reach you the same day with the thread and the reason we contacted them. Opt-outs are processed automatically the moment they land. On Outreach Engine the screening conversation is yours; on Appointment Engine we check each interested reply against the criteria you set before anything reaches your calendar.",
  },
  {
    band: "Day 30",
    label: "First full review",
    owner: "both",
    detail:
      "What went out, what came back, what we change next month. It is also the checkpoint on whether this is working.",
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
// Rewritten there 2026-09-10 (D-025): the old last sentence said outreach could not start
// before "your records are in and approved", which was true when the client's export was
// the only prospect source and is false now that the account research runs regardless.
export const serviceTimelineDisclaimer =
  "These are the timings we work to for the parts of this we control. They describe our activity, not your results. Any step marked as yours sets the pace for that step: where an engagement works your own account history, nothing there is contacted until you have sent it and approved the list.";
