// Shared content arrays. Imported by the landing UI (client) AND by the server page
// that emits FAQPage + Offer JSON-LD — one source of truth keeps the structured data
// verbatim-matched to the visible text (a Google rich-results requirement).

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
  /** Short bullets. This was one 60-word semicolon-spliced sentence per tier, which
   *  is unreadable on a phone and impossible to compare across three columns. */
  includes: string[];
  /** What stays with you. Named on the card, not buried in the contract. */
  youKeep: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Lead Engine",
    price: 750,
    oneLiner: "We build the list. You work it.",
    capacity: "Up to ~40 prospects per batch — you send",
    bestFor: "Someone in your office will make the calls.",
    includes: [
      "Your ideal-job profile, plus the work you want screened out",
      "Your own records cleaned, deduped and ranked by closeness to a job",
      "Referral partners researched near you, each with a cited source",
      "Outreach scripts and a follow-up sequence",
      "Delivered CRM-ready",
    ],
    youKeep: "You send everything and handle every reply. No outreach runs at this tier.",
  },
  {
    name: "Outreach Engine",
    price: 1500,
    oneLiner: "We write and send the follow-up every week.",
    capacity: "Up to ~100 outreach messages a month, follow-ups included (about 33 prospects)",
    bestFor: "Nobody has time to chase follow-up, and you don't want to hire for it.",
    includes: [
      "Everything in Lead Engine",
      "Each message written to that record's own reason, never mail-merge",
      "A multi-touch follow-up cadence, tracked",
      "Replies triaged and flagged by who is ready to talk",
      "A monthly report: qualified conversations started, against prospects contacted and messages sent",
    ],
    youKeep: "You take the sales conversation. No appointments are booked at this tier.",
    featured: true,
  },
  {
    name: "Appointment Engine",
    price: 2500,
    oneLiner: "We qualify the replies and book the appointments.",
    capacity: "Up to ~150 outreach messages a month, follow-ups included (about 50 prospects)",
    bestFor: "You want both lists worked end to end, with appointments on your calendar.",
    includes: [
      "Everything in Outreach Engine",
      "Every reply qualified against your criteria",
      "Appointments booked on your calendar, with confirmations and reminders",
      "Full pipeline tracking",
      "A weekly report on the same measure, plus one optimization experiment",
    ],
    youKeep: "You run the visit, the quote and the close.",
  },
];

// Audience qualifiers. Surfaced as a dedicated section so the right visitor
// self-identifies fast and the wrong-fit visitor screens themselves out before
// they book — fewer, better-fit calls instead of broad, low-intent volume.
//
// ONE niche: established residential HVAC. Every entry describes a condition an
// established HVAC company can check against itself in a second ("do I have
// unsold estimates? yes"), not a category label it has to interpret. A visitor
// reached by the outbound has to see themselves here immediately, or the whole
// funnel leaks at the landing.
//
// Do NOT re-broaden this to "service businesses / SaaS / professional services".
// It read that way until 2026-08-23 and cost the page its whole reason to exist:
// a list that includes everyone tells an HVAC owner nothing about whether the
// service understands his business.
export const idealFor: string[] = [
  "Established residential HVAC companies — multiple trucks, years of history, room for more work",
  "Unsold replacement estimates and expired proposals nobody has chased",
  "Lapsed maintenance agreements worth renewing",
  "Past customers whose installed systems are reaching replacement age",
  "Referral partners worth working: builders, property managers, realtors, plumbers, inspectors",
  "Follow-up you want done weekly, without hiring for it",
];

// Honest disqualifiers. Two of these are load-bearing rather than cosmetic:
//   * "no customer history yet" is the real precondition for reactivation, and
//     it is why the whole site says ESTABLISHED HVAC rather than just HVAC.
//   * "we cannot cold-source homeowners" is gate #0f in the operating system
//     (client-owned pool). Homeowner records come from the client's own export,
//     are approved by the client, and are never researched, bought, or inferred.
//     Saying so here keeps the marketing claim and the code gate identical.
// The last item names the real limitation of an early business rather than
// papering over it — stating it plainly is what earns the benefit of the doubt
// from a careful buyer.
export const notFor: string[] = [
  "Brand-new companies with no customer history — reactivation needs records",
  "Anyone wanting to buy homeowner leads — we are not a lead seller, and cannot cold-source homeowners",
  "Anyone wanting thousands of unverified addresses blasted overnight",
  "Anyone expecting guaranteed jobs, revenue, or a set number of appointments",
  "Companies with no capacity, or nobody to run the visit and close",
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
    body: "Nobody else is being sold the same homeowner. We do not buy, sell, resell, or broker leads, shared or exclusive, so you are never bidding against three other contractors for one form fill. There is no per-lead price: a flat monthly fee buys work on your own list and service area.",
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
    body: "We run a conflict check before accepting anyone, and we work one HVAC company per service area: while we work for you, we will not take on a competing shop in your territory. The reason is practical — your referral partners are the same builders and realtors a competitor would want. Be clear on what this is, though. As standard it is an operating practice, not a contractual right: the agreement is non-exclusive by default. If you want it enforceable, contracted per-metro exclusivity is a priced add-on on the order form, and we will quote it before you sign rather than spring it on a call.",
  },
  {
    title: "Your customer list stays yours, and we never invent one",
    body: "Homeowner records come from your export and nowhere else: past customers, unsold estimates, lapsed agreements, missed calls. We cannot research, buy, or infer them, and any record claiming to be yours that isn't in the file you approved is blocked. Referral partners are businesses, so those we do research — each arrives with its source link.",
  },
  {
    title: "It goes out from your name, with your sign-off",
    body: "Messages send from your own domain and mailbox, so your customers see the company they already know and you can read the sent folder yourself. You approve the targeting, the messaging and the first batch before anything sends, and you can pause any time after that.",
  },
  {
    title: "One clear line of ownership",
    body: "We own the list work, the research, the writing, and on the outreach tiers the sending, follow-up and reply triage. We report it honestly. You own the in-home visit, the quote and the close. No account manager in between.",
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
// editing: "we replace a prospect that failed our own citation standard" is a quality
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
    title: "A partner that fails our own citation check is replaced free",
    body: "Every researched referral partner must carry a real public source. If one we delivered fails that standard, we replace it inside the same month at no charge. That is a commitment about the quality of the work, not about whether anybody buys.",
    clause: "Services agreement §10.6.2",
  },
  {
    title: "What is published beats what is in the contract",
    body: "Our fees, cancellation and refund terms are published before any sales conversation. Where the published terms are better for you than the signed ones, the published terms win.",
    clause: "Services agreement §10.5.2",
  },
  {
    title: "Everything built for you stays yours",
    body: "The lists, the scripts, the trackers, and your suppression list. Leaving claws none of it back, and the opt-out list is handed over within five business days.",
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
  "Where the records come from",
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
// cold-call homeowners" — never a bare "No."), because these exact strings are lifted
// whole into acceptedAnswer.text in app/page.tsx and get quoted in isolation, both by
// an answer engine and by an owner skimming on a phone between jobs. Substantiation
// follows in two to four short sentences; the working cap is about 90 words.
//
// Two answers here previously ran to 180 and 198 words with the actual answer buried in
// the middle — which is precisely what stops either audience extracting it.
export const faqs: Faq[] = [
  {
    question: "What exactly do you do for an HVAC company?",
    group: "What this is",
    answer:
      "We work two pipelines an established HVAC company already owns: your own records, and referral partners nearby. Reactivation covers unsold estimates, lapsed maintenance agreements, and past customers whose systems are at replacement age — cleaned, deduped, ranked, then worked with a real follow-up sequence. Partner outreach covers builders, property managers, realtors and plumbers, researched from public sources with a cited reason. Your tier decides whether we hand you the list and scripts or run the outreach ourselves.",
  },
  {
    question: "Do you cold-call or cold-email homeowners?",
    group: "Where the records come from",
    answer:
      "No, we never cold-call or cold-email homeowners, and we could not even if you asked. Homeowner records come from your own export: people who already called you, bought from you, or asked you for a price. We cannot research, buy, or infer them. Any record claiming to come from your list but missing from the file you approved is blocked in code. The only people we research from scratch are businesses — the referral partners in your service area.",
  },
  {
    question: "Where do the records actually come from?",
    group: "Where the records come from",
    answer:
      "Homeowner records come from your own export; referral partners are researched from free public sources, each with a citation. The two lanes stay strictly separate. You send a CRM, field-service or spreadsheet export and approve it before anything is contacted. Every researched partner ships with a source link, a fit reason, and a verification note. Nothing is bought from a data broker, and a researched prospect with no citation cannot be contacted at all.",
  },
  {
    question: "How is this different from Angi, Thumbtack, or a per-lead seller?",
    group: "What this is",
    answer:
      "We sell no leads at all — you pay a flat monthly fee to work your own customer list, never a per-lead price. Marketplaces sell a lead, usually the same one they sold to three other contractors, and you pay again every time. Nobody else is being sold your homeowner, and the list, scripts and trackers stay yours if you leave. The trade-off is real: a marketplace hands you a name today; reactivation takes weeks.",
  },
  {
    // The nearest and cheapest substitute, and the one an established shop reaches for
    // first: the marketing module inside the field-service software they already pay
    // for. The site answered Angi, answered ads agencies, answered hiring — and never
    // answered this, which is the objection most likely to end the conversation.
    question: "ServiceTitan / Housecall Pro / Jobber already emails my customer list. Why pay you?",
    group: "What this is",
    answer:
      "Those tools blast a segment; we contact each record individually with its own cited reason. That reason is the estimate number and date, the agreement that lapsed, or the install year that puts the system past its expected life. We also research the builders, property managers and realtors in your towns, which your software cannot do. If you already run those campaigns and work the replies, you may not need us; most shops don't, because nobody has time.",
  },
  {
    question: "We already have a marketing company running ads. Does this replace them?",
    group: "What this is",
    answer:
      "No, this runs alongside your ads agency rather than replacing it, and usually it shouldn't. Ads and local search buy attention from people who don't know you yet. We work the demand you already paid for once: the estimate that never closed, the plan that lapsed, the customer whose system is now at the end of its life. We also work the partners who could refer you work. We don't touch your ad accounts, your website, or your Google Business Profile.",
  },
  {
    question: "What makes a record worth contacting?",
    group: "Where the records come from",
    answer:
      "A record is worth contacting when it fits your agreed job profile, has a usable contact path, and carries a specific, checkable reason. From your list, that reason is the estimate number and date, the agreement that lapsed, or the install year that puts the system at replacement age. For a researched referral partner, it also has to connect to a real decision-maker and carry the public source the reason came from. No reason, no contact.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    group: "What you can expect",
    answer:
      "No, we do not guarantee jobs, appointments, or revenue at any tier. You should be wary of anyone in this industry who does. Whether a homeowner replaces a system depends on your price, your reputation, your timing, and how the visit goes. What we commit to is running the system, doing the work to the stated standard, and reporting the results honestly. The Appointment Engine tier books qualified appointments on your calendar; no tier promises a number.",
  },
  {
    question: "How many records or messages do I get each month?",
    group: "What you can expect",
    answer:
      "On the Lead Engine, a batch of about 40 researched, cited prospects that you work yourself. On the Outreach and Appointment tiers the number is outreach messages sent — up to about 100 or 150 a month, first touches and follow-ups counted alike, which is roughly 33 or 50 prospects on a three-touch sequence — and we agree the real number with you before work starts. It is counted in messages because that is the unit our sending controls actually enforce, so the report reconciles against the agreement line for line. The honest number also depends on how much usable history your export contains and what your sending setup can safely support; chasing a bigger headline is what pushes a vendor to loosen the targeting or exceed safe sending limits. What we measure the work by is qualified conversations started: a decision-maker who replied with real interest, confirmed by a person, shown against the prospects contacted to get there. That is a measurement of what happened, never a promise.",
  },
  {
    // The arithmetic the best-fit buyer does on the spot. The fit check scores the
    // BIGGEST lists as the strongest fit, and the tiers then cap volume — so an owner
    // with 3,000 records divides and gets "months to get through my own list once".
    // The question deliberately does not repeat a bare "100", because on the sending
    // tiers that number counts messages, not records, and the two differ by ~3x.
    // Leaving the arithmetic unanswered makes the cap look like a trick
    // rather than what it is: a refusal to blast, and a deliberate ordering of the
    // list so the most likely jobs are worked first.
    question: "I have thousands of records and you cap the monthly volume. Won't that take years?",
    group: "What you can expect",
    answer:
      "No — most of that list isn't worth contacting, and what survives gets ranked so the likeliest jobs are worked first. A raw history of thousands of rows is mostly duplicates, past buyers, people who moved, and jobs too small to touch; cleaning removes a large share before ranking. We will not lift the cap: sending faster than your domain can safely carry gets the mailbox filtered, and that is not recoverable. If usable volume is left over, we say so.",
  },
  {
    question: "What do I have to send you, and how hard is it?",
    group: "Money, terms and getting started",
    answer:
      "You send one export from wherever your history lives: ServiceTitan, Housecall Pro, Jobber, QuickBooks, or a spreadsheet. Ideally it covers past customers, open and expired estimates, maintenance agreements, install dates, and missed calls. It does not have to be clean — cleaning, deduping and ranking are part of the work. If you can only pull part of it, we start with what you have. Nothing is contacted until it is imported and you have approved it, so this step sets the schedule.",
  },
  {
    question: "How are the records delivered?",
    group: "What you can expect",
    answer:
      "Records arrive as a spreadsheet, a CRM-ready file, or into a system you name — ranked highest-priority first. Each row carries contact details, notes, status, and why it was picked. Every researched partner carries a source link you can open. On the outreach tiers you also get the sending log, so you can see exactly what went to whom and when.",
  },
  {
    question: "Whose email address does this go out from?",
    group: "How the outreach runs",
    answer:
      "Yours — outreach sends from your own domain and mailbox, never ours. A past customer sees the company they already know, and you can open the sent folder and read every message. You approve the targeting, the messaging and the first batch before anything sends, you set the volume, and you can pause at any time. Deliverability depends on your domain setup and history, which stay in your hands; confirm the email and privacy rules in your market before outreach begins.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    group: "How the outreach runs",
    answer:
      "Anyone who asks not to be contacted is suppressed immediately, in code, and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every send rather than something a person has to remember. Opt-outs are processed even while a campaign is paused, and the suppression list goes with you if you leave.",
  },
  {
    question: "How is this different from hiring an inside-sales or office person?",
    group: "Money, terms and getting started",
    answer:
      "Every tier costs less than a full-time hire, with no salary, payroll tax, tooling, ramp time, or management attached. In most shops the follow-up is the first thing dropped when the phones get busy. This starts in weeks, moves up or down a tier as the season changes, and is measured against clear reporting. No fixed headcount before you know the approach works in your market.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    group: "What you can expect",
    answer:
      "No, there are no published case studies or client results yet, and we will not invent any. This is an early, founder-led service. What the site shows instead is the standard, the record format, the process, and the price. Start with the free audit or the Lead Engine tier and judge the first list on its own merits — that is the proof that matters before you scale spend.",
  },
  {
    question: "Where are you based, and who do you serve?",
    group: "What this is",
    answer:
      "We are based in New Jersey and work remotely with established residential HVAC companies across the United States. Campaigns are currently focused on New Jersey, so that is where the local knowledge is sharpest today: permit patterns, seasonality, and the local referral network. Being outside New Jersey does not disqualify you; it means less local context on day one.",
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
      `No. The call is a ${callLengthMinutes}-minute, no-obligation walkthrough of the audit we already sent you — not a pitch, and not the price of the audit. We go through the job profile and the partners we picked, you tell us where we read your market wrong, and you decide with the work already in hand whether running it at scale is worth paying for. You can skip it entirely and keep the audit. No work begins until you decide to move forward.`,
  },
];

// The Free Pipeline Audit is the primary trust offer: a free slice of the paid Lead
// Engine work, handed over before any money changes hands. For a business with no
// track record yet, giving away real, verifiable work IS the proof — so the copy here
// promises a deliverable and its quality, never an outcome. Keep it honest and free of
// any guarantee/testimonial/result claim (see the operating-system repo's design spec).
//
// The vetted prospects in the audit are REFERRAL PARTNERS, not homeowners, and the
// guardrail says so explicitly. Homeowner records are the client's own export under
// gate #0f and cannot exist before there is a client — promising "3-5 vetted
// prospects" to an HVAC company without that distinction would read as an offer to
// hand over homeowner leads, which is exactly what this business does not do.
export const audit = {
  name: "Free Pipeline Audit",
  /** Two short sentences. It was one 55-word sentence with three em-dashed asides. */
  tagline:
    "Real work for your company, before you pay anything. Yours to keep either way.",
  includes: [
    {
      title: "A job profile worth targeting",
      body: "Service area, system types, replacement versus repair — and the work you would rather turn down.",
    },
    {
      title: "3-5 referral partners, named and checked",
      body: "Real businesses near you that could send you work. Each has a contact path, a cited reason to call now, and a source link you can open.",
    },
    {
      title: "One sample outreach message",
      body: "Written for one of those partners, tied to its real reason. The actual voice, not a template.",
    },
    {
      title: "A read on where your work comes from",
      body: "Your current lead flow, and the one gap most likely costing you jobs.",
    },
  ],
  whyFree:
    "We have no case studies yet, so the audit is the proof. If it is useful, we talk. If not, you keep it and owe nothing.",
  guardrail:
    "It shows the quality of the work, not a promised result. No guaranteed leads, calls or jobs. It contains no homeowner records — those come from your own list, after you are a client and have approved the export.",
} as const;

// The service timeline for the managed tiers (Outreach / Appointment), shown so a
// buyer knows what they are agreeing to before they agree to it.
//
// CANONICAL SOURCE: the operating-system repo's `core/timeline.py`. This is a
// RENDERING of that module, not a second timeline — `scripts/check_cross_repo.py`
// in that repo asserts every `band` and `label` below matches it exactly, and
// fails the OS validation suite if they drift. Add or edit a phase THERE first.
//
// A subset is allowed (this page omits internal steps like the final automated
// checks); a phase stated here with different wording is not.
//
// Every band describes work we do. Nothing here is dated against a result —
// replies, meetings, and revenue depend on the market and the offer, so putting a
// date next to one would be inventing a number.
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
    band: "Days 2-4",
    label: "We draft your ideal-customer definition and send it for sign-off",
    owner: "we",
    detail:
      "Who we should be reaching, and the bad-fit work we screen out. You correct it. We never proceed on a definition you have not seen.",
  },
  {
    band: "Your pace",
    label: "You export the demand you already own",
    owner: "you",
    detail:
      "This step sets the whole schedule: past customers, open and expired estimates, lapsed maintenance plans, missed calls. We cannot research, buy, or infer these — only you can send them. Nothing is contacted until they are imported and you have approved the list.",
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
    // = [(0,1),(1,2),(2,5),(4,10),(6,None)], mirrored in core/timeline.py:60. This line
    // used to read "5 a day for three days, 10 a day for the next three" — overstating
    // day one by 5x — because check_cross_repo.py compares only `band` and `label` and
    // never `detail`, so the two could drift silently and did. The slower true ramp is
    // also the better sentence for this reader: it is more obviously careful with the
    // domain his own customers will see the mail arrive from.
    detail:
      "We start at 1 a day, 2 a day from day 1, 5 a day from day 2, 10 a day from day 4, then up to full volume from day 6. Starting slow protects your domain's reputation. A mailbox that opens at full speed gets filtered, and that is not recoverable in a month.",
  },
  {
    band: "About two weeks per prospect",
    label: "Each prospect gets a short, spaced sequence",
    owner: "we",
    // 3 touches / 4 days apart, from core.timeline.touch_shape() against the live client
    // template. This said "up to 4 touches, at least 3 days apart" — the inverse — which
    // core/timeline.py:305-310 already records as an audited defect fixed in the proposal
    // and never fixed here. It also broke the arithmetic on the tier cards: the "about 33
    // prospects" behind a 100-message cap is 100/3, and on a 4-touch cadence 100 messages
    // is 25 prospects, not 33.
    detail:
      "Up to 3 touches, at least 4 days apart, each adding something new rather than chasing. Anyone who asks us to stop is suppressed immediately, in code, permanently.",
  },
  {
    band: "Ongoing, same day",
    label: "Replies are triaged as they arrive",
    owner: "we",
    // TRIAGE IS EVERY MANAGED TIER; QUALIFICATION IS THE $2,500 TIER ONLY (D-020 §5, CSA
    // §3 item 8). This detail said "Interested replies are qualified against the criteria
    // you set" with no tier boundary, on a page that tells the reader "Outreach Engine and
    // Appointment Engine include all of them" — promising at $1,500 what the agreement
    // reserves for $2,500. core/offer.py:91 records the identical defect being fixed in
    // the proposal and the call brief; the fix never reached the site.
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
export const serviceTimelineDisclaimer =
  "These are the timings we work to for the parts of this we control. They describe our activity, not your results. The steps marked as yours set the real pace — we cannot start outreach before your records are in and approved.";
