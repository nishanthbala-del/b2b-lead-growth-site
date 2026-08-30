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
    capacity: "Up to ~40 records a month",
    bestFor: "You have someone in the office who will actually make the calls.",
    includes: [
      "Your ideal-job profile, with the work you want screened out",
      "Your own records cleaned, deduped and ranked by how close each is to a job",
      "Referral partners researched near you, each with a cited public source",
      "Outreach scripts and a follow-up sequence to work from",
      "Delivered CRM-ready",
    ],
    youKeep: "You send everything and handle every reply. No outreach runs at this tier.",
  },
  {
    name: "Outreach Engine",
    price: 1500,
    oneLiner: "We write and send the follow-up every week.",
    capacity: "Up to ~100 records a month",
    bestFor: "Nobody in your office has time to chase follow-up, and you don't want to hire for it.",
    includes: [
      "Everything in Lead Engine",
      "Outreach written per record against its real reason — never mail-merge",
      "A multi-touch follow-up cadence, tracked",
      "Replies triaged and flagged by who is ready to talk",
      "A monthly report: contacted, replied, positive",
    ],
    youKeep: "You take the sales conversation. No appointments are booked at this tier.",
    featured: true,
  },
  {
    name: "Appointment Engine",
    price: 2500,
    oneLiner: "We qualify the replies and book the appointments.",
    capacity: "Up to ~150 records a month",
    bestFor: "You want your own list and your referral partners both worked end to end, with appointments on the calendar.",
    includes: [
      "Everything in Outreach Engine",
      "Every reply qualified against your criteria",
      "Appointments booked on your calendar, with confirmations and reminders",
      "Full pipeline tracking",
      "A weekly report and one optimization experiment",
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
  "You have unsold replacement estimates and expired proposals nobody has chased",
  "You have lapsed maintenance agreements worth renewing",
  "Your customer list is old enough that installed systems are reaching replacement age",
  "You want referral partners — builders, property managers, realtors, plumbers, inspectors — worked deliberately",
  "You want the follow-up done weekly without hiring for it",
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
  "Brand-new companies with no customer history — reactivation needs records to work",
  "Anyone wanting to buy homeowner leads. We are not a lead seller, and we cannot cold-source homeowners",
  "Anyone wanting thousands of unverified addresses blasted overnight",
  "Anyone expecting guaranteed jobs, revenue, or a set number of appointments",
  "Companies with no capacity, or nobody to run the in-home visit and close",
  "Anyone who needs published case studies before starting — there are none yet",
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
    body: "Nobody else is being sold the same homeowner. We do not buy, sell, resell, or broker leads — shared or exclusive — and you are never bidding against three other contractors for the same form fill. There is no per-lead price here because there are no leads for sale: there is a flat monthly fee for work done on your own list and your own service area.",
  },
  {
    title: "One HVAC company per service area, while you are a client",
    body: "A conflict check runs before we accept anyone, and we work one HVAC company per service area. We will not take on a competing shop in your territory while we are working for you. The reason is practical rather than generous: your referral partners are the same builders, property managers and realtors a competitor would want, and pitching both of you to the same builder would make both campaigns worse. If you want that as a contractual right rather than an operating practice, ask for it in the order form before you sign — after being sold as one of five, pinning exclusivity down in writing is the right instinct.",
  },
  {
    title: "Your customer list stays yours, and we never invent one",
    body: "Homeowner records come from your export and nowhere else — past customers, unsold estimates, lapsed agreements, missed calls. We cannot research, buy, or infer them, and the system blocks any record claiming to come from your list that isn't in the file you approved. Referral partners are businesses, so those we do research from public sources — and every one arrives with the source link attached.",
  },
  {
    title: "It goes out from your name, with your sign-off",
    body: "Messages send from your own domain and mailbox, so your customers see the company they already know, and you can open the sent folder and read exactly what went where. You approve the targeting, the messaging, and the first batch before anything sends, and you can pause or change it at any point after that.",
  },
  {
    title: "One clear line of ownership",
    body: "We own the list work, the research, the writing, and — on the outreach tiers — the sending, the follow-up, and the reply triage, and we report it honestly. You own the in-home visit, the quote, and the close. No confusion about who is responsible for what, and no account manager in between.",
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
    body: "A flat monthly fee, month-to-month. Either side can end it on 14 days' written notice. There is no minimum term and nothing to buy out.",
    clause: "Terms of Service §7",
  },
  {
    title: "A month we have not started is refunded in full",
    body: "If we have not begun work on a period, we refund that period in full on request. That is a stated obligation in the agreement, not a courtesy we may extend.",
    clause: "Services agreement §10.5.1",
  },
  {
    title: "A partner that fails our own citation check is replaced free",
    body: "Every researched referral partner has to carry a real public source. If one we delivered fails that standard — meaning it should never have passed our own check — we replace it inside the same month at no charge. It is a commitment about the quality of the work, not about whether anybody buys.",
    clause: "Services agreement §10.6.2",
  },
  {
    title: "What is published beats what is in the contract",
    body: "We publish our fees, cancellation and refund terms before any sales conversation. Where the published terms are better for you than the signed ones, the published terms win. We will not advertise one deal and put a narrower one in front of you to sign.",
    clause: "Services agreement §10.5.2",
  },
  {
    title: "Everything built for you stays yours",
    body: "The lists, the scripts, the trackers, and your suppression list. Leaving does not claw any of it back, and we hand over the opt-out list within five business days so nobody who asked you to stop gets contacted again.",
    clause: "Services agreement §10.6",
  },
  {
    title: "Your data is deleted within 30 days of the end",
    body: "We delete or de-identify your records from active systems within 30 days of the engagement ending. We keep exactly one thing permanently — the do-not-contact list — because destroying it is the only way somebody's opt-out could be forgotten.",
    clause: "Services agreement §10.6 / §10.6.1",
  },
];

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

export const faqs: Faq[] = [
  {
    question: "What exactly do you do for an HVAC company?",
    group: "What this is",
    answer:
      "We work the two pipelines an established HVAC company already has and rarely gets to. First, reactivation: your own records — unsold replacement estimates, expired proposals, lapsed maintenance agreements, past customers whose systems are now at replacement age, and missed calls — cleaned, deduped, ranked, and worked with a real follow-up sequence. Second, referral partners: builders, general contractors, property managers, realtors, plumbers, electricians, and home inspectors in your service area who send work to somebody today, researched from public sources with a cited reason to reach out. Depending on the tier, we either hand you that list and the scripts, or we run the outreach and book the appointments.",
  },
  {
    question: "Do you cold-call or cold-email homeowners?",
    group: "Where the records come from",
    answer:
      "No, and we could not even if you asked. Homeowner records come from your own export and nothing else — people who already called you, bought from you, or asked you for a price. We cannot research, buy, or infer homeowner records, and the system blocks any record that claims to come from your list but isn't in the file you approved. The only people we research from scratch are businesses: the referral partners in your service area.",
  },
  {
    question: "Where do the records actually come from?",
    group: "Where the records come from",
    answer:
      "Two places, kept strictly separate. Your homeowner records come from you — a CRM, field-service software, or spreadsheet export that you send and then approve before anything is contacted. Referral-partner prospects are researched from free public sources, and every one ships with the source link, a fit reason, and a verification note. Nothing is bought from a data broker and nothing is invented: a researched prospect with no citation cannot be contacted at all.",
  },
  {
    question: "How is this different from Angi, Thumbtack, or a per-lead seller?",
    group: "What this is",
    answer:
      "Those sell you a lead, usually the same lead they sold to three other contractors, and you pay again every time. We sell no leads at all. There is a flat monthly fee for work done on your own customer list and your own service area, so nobody else is being sold the same homeowner, nothing is priced per lead, and the list, the scripts, and the trackers stay yours if you leave. The trade-off is honest: a lead marketplace can hand you a name today, and reactivation and partner outreach take weeks to build momentum.",
  },
  {
    // The nearest and cheapest substitute, and the one an established shop reaches for
    // first: the marketing module inside the field-service software they already pay
    // for. The site answered Angi, answered ads agencies, answered hiring — and never
    // answered this, which is the objection most likely to end the conversation.
    question: "ServiceTitan / Housecall Pro / Jobber already emails my customer list. Why pay you?",
    group: "What this is",
    answer:
      "If you are already running those campaigns and working the replies, you may not need us — and we would rather say so than talk you out of software you have paid for. The difference is not the sending, it is what gets sent and to whom. Those tools blast a segment: everyone who has not booked in twelve months gets the same tune-up email. We go the other way — each record is looked at individually and gets a specific reason it is being contacted now, the estimate number and date, the agreement that lapsed, the install year that puts the system past its expected life. We also do a lane your software cannot do at all: researching the builders, property managers and realtors in your towns from public sources. And in practice the honest reason most shops do not get value from the built-in tool is not that it is bad, it is that nobody in the office has time to segment the list, write the copy, and work what comes back. That is the part we take.",
  },
  {
    question: "We already have a marketing company running ads. Does this replace them?",
    group: "What this is",
    answer:
      "No, and it usually shouldn't. Ads and local search buy attention from people who don't know you yet. This works the demand you have already paid for once — the estimate that never closed, the maintenance plan that lapsed, the customer from nine years ago whose system is now at the end of its life — plus the partners who could refer you work. The two run alongside each other, and we don't touch your ad accounts, your website, or your Google Business Profile.",
  },
  {
    question: "What makes a record worth contacting?",
    group: "Where the records come from",
    answer:
      "For a record from your list: it matches the job profile you agreed, it has a usable contact path, and it has a specific, checkable reason to reach out — the estimate number and date, the agreement that lapsed, the install year that puts the system at replacement age. For a researched referral partner: it matches the agreed profile, it connects to a real decision-maker or influence point, and it carries the public source the reason came from. No reason, no contact.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    group: "What you can expect",
    answer:
      "No. Whether a homeowner replaces a system depends on your price, your reputation, your timing, and how the visit goes — so we don't promise jobs, revenue, or a set number of appointments, and you should be wary of anyone in this industry who does. What we commit to is running the system, doing the list and research work to the stated standard, and reporting the results honestly. The Appointment Engine tier includes booking qualified appointments on your calendar; no tier promises how many.",
  },
  {
    question: "How many records or messages do I get each month?",
    group: "What you can expect",
    answer:
      "Each tier publishes a monthly ceiling — roughly 40, 100, or 150 records worked — and we agree the real number with you, because the honest answer depends on how much usable history your export contains and what your sending setup can safely support. We deliberately don't advertise a bigger headline number: chasing a quota is what pushes a vendor to loosen the targeting or exceed safe sending limits, which is exactly the failure this is built to avoid. You'll know the agreed volume before any work starts, and the report shows what was actually delivered against it.",
  },
  {
    // The arithmetic the best-fit buyer does on the spot. The fit check scores the
    // BIGGEST lists as the strongest fit, and the tiers then cap at ~40/100/150 a
    // month — so an owner with 3,000 records divides and gets "months to get through
    // my own list once". Leaving that unanswered makes the cap look like a trick
    // rather than what it is: a refusal to blast, and a deliberate ordering of the
    // list so the most likely jobs are worked first.
    question: "I have thousands of records and you cap at 100 a month. Won't that take years?",
    group: "What you can expect",
    answer:
      "You would not want all of them contacted, and this is the part worth understanding before you buy. A raw history of several thousand rows is mostly duplicates, people who already bought, people who moved, bad addresses, and jobs too small to be worth a touch. Cleaning and deduping usually removes a large share of it before anything is ranked. What is left gets ordered by how close each one looks to a real job — the recent unsold replacement estimate outranks the tune-up customer from 2015 — and the monthly ceiling is worked from the top of that order down, so the strongest records are reached first rather than last. That is also why we will not lift the cap for a bigger headline number: sending faster than a domain can safely carry is what gets a mailbox filtered, and that is not recoverable in a month. If after the ranking there is genuinely more usable volume than a tier can carry, we will tell you that plainly and you can decide whether a higher tier is worth it. We would rather say the list is thinner than it looks than stretch it to fill a quota.",
  },
  {
    question: "What do I have to send you, and how hard is it?",
    group: "Money, terms and getting started",
    answer:
      "One export from wherever your history lives — ServiceTitan, Housecall Pro, Jobber, QuickBooks, or a spreadsheet. Ideally it includes past customers, open and expired estimates, maintenance agreements and their status, install dates or equipment age, and missed or unreturned calls. It does not have to be clean; cleaning, deduping, and ranking it is part of the work. If you can only get part of it, we start with what you have. This is the step that sets the whole schedule, because nothing can be contacted until it is imported and you have approved it.",
  },
  {
    question: "How are the records delivered?",
    group: "What you can expect",
    answer:
      "As a spreadsheet, a CRM-ready file, or into a system you name — ranked highest-priority first, with contact details, notes, status, why each one was picked, and, for every researched partner, a source link you can open. On the outreach tiers you also get the sending log, so you can see exactly what went to whom and when.",
  },
  {
    question: "Whose email address does this go out from?",
    group: "How the outreach runs",
    answer:
      "Yours. Outreach runs from your own domain and mailbox, so a past customer sees the company they already know rather than a stranger, and you can open the sent folder and read every message. You approve the targeting, the messaging pattern, and the first batch before anything sends, you set the volume, and you can pause at any time. Sender reputation and deliverability depend on your domain setup and sending history, which stay in your hands — so you should confirm the email, privacy, and platform rules that apply in your market before outreach begins.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    group: "How the outreach runs",
    answer:
      "They are added to a suppression list immediately and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every single send rather than something a person has to remember — and opt-outs are processed even while a campaign is paused.",
  },
  {
    question: "How is this different from hiring an inside-sales or office person?",
    group: "Money, terms and getting started",
    answer:
      "A full-time hire carries salary, payroll tax, tooling, ramp time, and management — and in most shops the follow-up is the first thing that gets dropped when the phones get busy. This is a system you can start in weeks, move up or down a tier as the season changes, and measure against clear reporting, without adding fixed headcount before you know the approach works for your market. Every tier costs less than a full-time hire.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    group: "What you can expect",
    answer:
      "Not yet, and we won't invent any. This is an early, founder-led service, so there are no published client results to show — which is exactly why this site shows you the standards, the record format, the process, and the pricing instead. Start with the free audit or the Lead Engine tier and judge the first list on its own merits; that is the proof that actually matters before you scale spend.",
  },
  {
    question: "Where are you based, and who do you serve?",
    group: "What this is",
    answer:
      "The work is done remotely and can be delivered for HVAC companies across the United States. Campaigns are currently focused on New Jersey, so that is where the sharpest local market knowledge sits today — permit patterns, seasonality, and the local referral network. Being outside New Jersey doesn't disqualify you; it just means less local context on day one.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    group: "Money, terms and getting started",
    answer:
      `No long-term contract and no setup fee — a flat monthly fee, month-to-month on a short written services agreement, and either side can end it on 14 days' notice, so you are not locked in while you find out whether this works for your market. You can move between tiers as the season changes, and everything built for you is yours to keep. It starts with a ${intakeMinutes}-minute fit check on this site, which tells you on the spot whether this is a fit — including when it isn't. If it is, we build your free pipeline audit and send it to you in writing; a ${callLengthMinutes}-minute walkthrough is offered after that, never required.`,
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
  /** One sentence. It was a 55-word sentence with three em-dashed asides. */
  tagline:
    "Real work, done for your company, before you pay anything — and yours to keep either way.",
  includes: [
    {
      title: "A job profile worth targeting",
      body: "What a good job looks like for you: service area, system types, replacement versus repair — and the work you would rather turn down.",
    },
    {
      title: "3-5 referral partners, named and checked",
      body: "Real businesses near you that could send you work. Each one has a contact path, a cited public reason to call now, and a source link you can open.",
    },
    {
      title: "One sample outreach message",
      body: "Written for one of those partners, tied to its real reason. You see the actual voice, not a template.",
    },
    {
      title: "A read on where your work comes from",
      body: "Your current lead flow, and the one gap most likely costing you jobs.",
    },
  ],
  whyFree:
    "We have no case studies yet, so the audit is the proof. If it is useful, we will talk. If it is not, you keep it and owe nothing.",
  guardrail:
    "It shows you the quality of the work, not a promised result. No guaranteed leads, calls or jobs. It contains no homeowner records — those come from your own list, only after you are a client and have approved the export.",
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
      "The clock starts here and not before — no work begins until the agreement is signed and the first payment has cleared.",
  },
  {
    band: "Days 1-2",
    label: "You fill in the onboarding form",
    owner: "you",
    detail:
      "About 30 minutes. What you do, where you work, what you can and cannot claim, and who your best customers actually are.",
  },
  {
    band: "Days 2-4",
    label: "We draft your ideal-customer definition and send it for sign-off",
    owner: "we",
    detail:
      "Who we should be reaching, and just as importantly the bad-fit exclusions we screen out. You correct it; we do not proceed on a definition you have not seen.",
  },
  {
    band: "Your pace",
    label: "You export the demand you already own",
    owner: "you",
    detail:
      "This is the step that sets the whole schedule. Past customers, open and expired estimates, lapsed maintenance plans, missed calls. We cannot research, buy, or infer these — they are your records and only you can send them. Nothing is contacted until they are imported and you have approved the list.",
  },
  {
    band: "Days 3-5",
    label: "We arm the mailbox you own",
    owner: "both",
    detail:
      "Messages go out from your sending identity, never ours, so you can open the sent folder and read exactly what went where.",
  },
  {
    band: "3 business days",
    label: "You approve the setup and the first batch",
    owner: "you",
    detail:
      "Targeting, messaging pattern, and the first batch of messages, in your words before anyone reads them. If you do not respond we hold — silence is never taken as approval.",
  },
  {
    band: "About a week in, once the steps above are done",
    label: "First messages go out — deliberately slowly",
    owner: "we",
    detail:
      "We start at 5 a day for the first three days, 10 a day for the next three, then up to full volume. Starting slow protects your domain's reputation; a mailbox that opens at full speed gets filtered, and that is not recoverable in a month.",
  },
  {
    band: "About two weeks per prospect",
    label: "Each prospect gets a short, spaced sequence",
    owner: "we",
    detail:
      "Up to 4 touches, at least 3 days apart, each one adding something new rather than chasing. Anyone who asks us to stop is suppressed immediately, in code, permanently.",
  },
  {
    band: "Ongoing, same day",
    label: "Replies are triaged as they arrive",
    owner: "we",
    detail:
      "Interested replies are qualified against the criteria you set. Opt-outs are processed automatically the moment they land.",
  },
  {
    band: "Day 30",
    label: "First full review",
    owner: "both",
    detail:
      "What went out, what came back, what we change for the next month. This is also the honest checkpoint on whether this is working.",
  },
  {
    band: "Day 30 onward",
    label: "Month-to-month from here",
    owner: "both",
    detail:
      "It renews monthly until you stop it. Either side can end it on 14 days' written notice, and you keep everything built for you — the lists, the scripts, the trackers.",
  },
];

// Must accompany any rendering of serviceTimeline. Verbatim from core/timeline.DISCLAIMER.
export const serviceTimelineDisclaimer =
  "These are the timings we work to for the parts of this we control. They describe our activity, not your results. The steps marked as yours set the real pace — we cannot start outreach before your records are in and approved.";
