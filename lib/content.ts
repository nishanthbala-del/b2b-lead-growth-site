// Shared content arrays. Imported by the landing UI (client) AND by the server page
// that emits FAQPage + Offer JSON-LD — one source of truth keeps the structured data
// verbatim-matched to the visible text (a Google rich-results requirement).

export type Plan = {
  name: string;
  price: number;
  volume: string;
  // Stated monthly volume ceiling. Published so a buyer knows what they are
  // agreeing to before they agree to it — the work is capacity-limited and
  // quoting a tier without its ceiling reads as unlimited.
  capacity: string;
  bestFor: string;
  includes: string;
  guardrails: string;
  cta: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Lead Engine",
    price: 750,
    volume: "Your reactivation list and referral targets, built and ranked",
    capacity: "Up to ~40 records researched, cited and delivered per month (capacity-limited)",
    bestFor:
      "HVAC companies with someone in the office who will actually work a list — you want it built, cleaned and ranked, and you'll make the calls and send the emails.",
    includes:
      "Your ideal-job profile with bad-fit exclusions; your own customer records cleaned, deduped and priority-ranked for reactivation (unsold estimates, lapsed maintenance agreements, replacement-age systems, missed calls); researched referral partners in your service area, each with a cited public source; 2-3 outreach angles plus a follow-up skeleton; CRM-ready delivery and handoff",
    guardrails:
      "You own all sending, follow-up, qualifying, and booking; no outreach is run for you at this tier",
    cta: "Start with Lead Engine",
  },
  {
    name: "Outreach Engine",
    price: 1500,
    volume: "We run the outreach — your office answers the interested replies",
    capacity: "Up to ~100 records worked per month",
    bestFor:
      "HVAC companies that want the follow-up going out every week without pulling a tech off a truck or hiring an office role to chase it.",
    includes:
      "Everything in Lead Engine; outreach written per record and tied to its real reason — the specific estimate, the lapsed agreement, the system age — never templated mail-merge; multi-touch follow-up cadence, tracked; reply triage that flags who is ready to talk; monthly report (contacted → replies → positive)",
    guardrails:
      "You own the sending domain and the sales conversation; no guaranteed reply volume or booked jobs",
    cta: "Build My Pipeline",
    featured: true,
  },
  {
    name: "Appointment Engine",
    price: 2500,
    volume: "Qualified appointments land on your schedule",
    capacity: "Up to ~150 records worked per month",
    bestFor:
      "Established HVAC companies that want both lanes — reactivation and referral partners — run end to end, with appointments landing on the calendar.",
    includes:
      "Everything in Outreach Engine; every reply qualified against your criteria (job type, service area, system age, timing); appointments booked straight onto your calendar with confirmations and reminders; full CRM and pipeline tracking; weekly report plus a weekly optimization experiment",
    guardrails:
      "You own the in-home visit, the quote, and the close; no guaranteed revenue or fixed number of appointments",
    cta: "Scale with Appointment Engine",
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
  "Established residential HVAC companies — multiple trucks, years of service history, and room on the schedule for more work",
  "Companies sitting on unsold replacement estimates, expired proposals, and lapsed maintenance agreements nobody has time to chase",
  "Contractors whose customer list is old enough that a meaningful share of installed systems are now at replacement age",
  "Companies that want referral partners — builders, property managers, realtors, plumbers, electricians, home inspectors — worked deliberately instead of by chance",
  "Owners who want the follow-up to happen every week without hiring an office role or pulling a tech off a truck to do it",
  "Light commercial HVAC and mechanical service companies selling maintenance contracts and replacement work to property managers and facility teams",
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
  "Brand-new HVAC companies with no customer history yet — reactivation needs records to work, and you don't have them",
  "Anyone looking to buy homeowner leads. We are not a lead seller: we do not sell, resell, or broker leads, shared or exclusive, and we cannot cold-source homeowners for you",
  "Companies that want thousands of unverified addresses blasted overnight",
  "Anyone expecting guaranteed jobs, guaranteed revenue, or a fixed number of appointments",
  "Companies with no capacity to take the work, or nobody available to run the in-home visit and close",
  "Anyone who needs published client case studies before they'll start — this is an early, founder-led service, and there are none yet",
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

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "What exactly do you do for an HVAC company?",
    answer:
      "We work the two pipelines an established HVAC company already has and rarely gets to. First, reactivation: your own records — unsold replacement estimates, expired proposals, lapsed maintenance agreements, past customers whose systems are now at replacement age, and missed calls — cleaned, deduped, ranked, and worked with a real follow-up sequence. Second, referral partners: builders, general contractors, property managers, realtors, plumbers, electricians, and home inspectors in your service area who send work to somebody today, researched from public sources with a cited reason to reach out. Depending on the tier, we either hand you that list and the scripts, or we run the outreach and book the appointments.",
  },
  {
    question: "Do you cold-call or cold-email homeowners?",
    answer:
      "No, and we could not even if you asked. Homeowner records come from your own export and nothing else — people who already called you, bought from you, or asked you for a price. We cannot research, buy, or infer homeowner records, and the system blocks any record that claims to come from your list but isn't in the file you approved. The only people we research from scratch are businesses: the referral partners in your service area.",
  },
  {
    question: "Where do the records actually come from?",
    answer:
      "Two places, kept strictly separate. Your homeowner records come from you — a CRM, field-service software, or spreadsheet export that you send and then approve before anything is contacted. Referral-partner prospects are researched from free public sources, and every one ships with the source link, a fit reason, and a verification note. Nothing is bought from a data broker and nothing is invented: a researched prospect with no citation cannot be contacted at all.",
  },
  {
    question: "How is this different from Angi, Thumbtack, or a per-lead seller?",
    answer:
      "Those sell you a lead, usually the same lead they sold to three other contractors, and you pay again every time. We sell no leads at all. There is a flat monthly fee for work done on your own customer list and your own service area, so nobody else is being sold the same homeowner, nothing is priced per lead, and the list, the scripts, and the trackers stay yours if you leave. The trade-off is honest: a lead marketplace can hand you a name today, and reactivation and partner outreach take weeks to build momentum.",
  },
  {
    question: "We already have a marketing company running ads. Does this replace them?",
    answer:
      "No, and it usually shouldn't. Ads and local search buy attention from people who don't know you yet. This works the demand you have already paid for once — the estimate that never closed, the maintenance plan that lapsed, the customer from nine years ago whose system is now at the end of its life — plus the partners who could refer you work. The two run alongside each other, and we don't touch your ad accounts, your website, or your Google Business Profile.",
  },
  {
    question: "What makes a record worth contacting?",
    answer:
      "For a record from your list: it matches the job profile you agreed, it has a usable contact path, and it has a specific, checkable reason to reach out — the estimate number and date, the agreement that lapsed, the install year that puts the system at replacement age. For a researched referral partner: it matches the agreed profile, it connects to a real decision-maker or influence point, and it carries the public source the reason came from. No reason, no contact.",
  },
  {
    question: "Do you guarantee jobs, appointments, or revenue?",
    answer:
      "No. Whether a homeowner replaces a system depends on your price, your reputation, your timing, and how the visit goes — so we don't promise jobs, revenue, or a set number of appointments, and you should be wary of anyone in this industry who does. What we commit to is running the system, doing the list and research work to the stated standard, and reporting the results honestly. The Appointment Engine tier includes booking qualified appointments on your calendar; no tier promises how many.",
  },
  {
    question: "How many records or messages do I get each month?",
    answer:
      "Each tier publishes a monthly ceiling — roughly 40, 100, or 150 records worked — and we set the real number with you on the call, because the honest answer depends on how much usable history your export contains and what your sending setup can safely support. We deliberately don't advertise a bigger headline number: chasing a quota is what pushes a vendor to loosen the targeting or exceed safe sending limits, which is exactly the failure this is built to avoid. You'll know the agreed volume before any work starts, and the report shows what was actually delivered against it.",
  },
  {
    question: "What do I have to send you, and how hard is it?",
    answer:
      "One export from wherever your history lives — ServiceTitan, Housecall Pro, Jobber, QuickBooks, or a spreadsheet. Ideally it includes past customers, open and expired estimates, maintenance agreements and their status, install dates or equipment age, and missed or unreturned calls. It does not have to be clean; cleaning, deduping, and ranking it is part of the work. If you can only get part of it, we start with what you have. This is the step that sets the whole schedule, because nothing can be contacted until it is imported and you have approved it.",
  },
  {
    question: "How are the records delivered?",
    answer:
      "As a spreadsheet, CRM-ready file, or agreed system, with fields, tags, notes, status tracking, priority bands, the fit reason, and — for every researched partner — the public source citation. On the outreach tiers you also get the sending log, so you can see exactly what went to whom and when.",
  },
  {
    question: "Whose email address does this go out from?",
    answer:
      "Yours. Outreach runs from your own domain and mailbox, so a past customer sees the company they already know rather than a stranger, and you can open the sent folder and read every message. You approve the targeting, the messaging pattern, and the first batch before anything sends, you set the volume, and you can pause at any time. Sender reputation and deliverability depend on your domain setup and sending history, which stay in your hands — so you should confirm the email, privacy, and platform rules that apply in your market before outreach begins.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    answer:
      "They are added to a suppression list immediately and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every single send rather than something a person has to remember — and opt-outs are processed even while a campaign is paused.",
  },
  {
    question: "How is this different from hiring an inside-sales or office person?",
    answer:
      "A full-time hire carries salary, payroll tax, tooling, ramp time, and management — and in most shops the follow-up is the first thing that gets dropped when the phones get busy. This is a system you can start in weeks, move up or down a tier as the season changes, and measure against clear reporting, without adding fixed headcount before you know the approach works for your market. Every tier costs less than a full-time hire.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    answer:
      "Not yet, and we won't invent any. This is an early, founder-led service, so there are no published client results to show — which is exactly why this site shows you the standards, the record format, the process, and the pricing instead. Start with the free audit or the Lead Engine tier and judge the first list on its own merits; that is the proof that actually matters before you scale spend.",
  },
  {
    question: "Where are you based, and who do you serve?",
    answer:
      "The work is done remotely and can be delivered for HVAC companies across the United States. Campaigns are currently focused on New Jersey, so that is where the sharpest local market knowledge sits today — permit patterns, seasonality, and the local referral network. Being outside New Jersey doesn't disqualify you; it just means less local context on day one.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    answer:
      "No long-term contract and no setup fee — a flat monthly fee, month-to-month on a short written services agreement, and either side can end it on 14 days' notice, so you are not locked in while you find out whether this works for your market. You can move between tiers as the season changes, and everything built for you is yours to keep. It starts with a 15-minute call to confirm fit and define the job profile before any work begins, with a short 2-minute intake beforehand so the call starts with context.",
  },
  {
    question: "What happens on the free call?",
    answer:
      "It's a 15-minute, no-obligation call to confirm whether this is a fit and to define what a good job looks like for you — service area, job types you want more of, the ones you'd rather not take, and what your history actually contains. You also get a short written pipeline audit out of it: a few specific observations about your market and one clear next step, yours to keep whether or not we work together. No work begins until you decide to move forward.",
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
  tagline:
    "A sharpened profile of the jobs worth chasing, 3-5 real referral partners in your service area — each a named business with a cited public reason to reach out — and one sample outreach message written the way we would actually send it. Yours to keep, before you pay anything.",
  includes: [
    {
      title: "A job profile worth targeting",
      body: "What a good job actually looks like for you — service area, system types, residential or light commercial, replacement versus repair — plus the work you would rather screen out than win.",
    },
    {
      title: "3-5 real referral partners, individually vetted",
      body: "Named businesses in your service area that could send you work — builders, property managers, realtors, plumbers, home inspectors — each with a mapped contact path, a cited public reason they are worth approaching now, a source link, and a priority ranking.",
    },
    {
      title: "One sample outreach message",
      body: "A personalized first touch written for one of those partners, tied to its real, cited reason — so you see the voice and the specificity rather than a mail-merge template.",
    },
    {
      title: "A read of where your work comes from today",
      body: "An honest look at your current lead flow and the one gap most likely costing you booked jobs — most often the unsold estimates and lapsed agreements nobody has time to go back to.",
    },
  ],
  whyFree:
    "We would rather show you the quality than tell you about it. There is no track record to point to yet, so the audit is the proof. If it is useful, we will talk about running it at scale. If it is not, you keep the work and owe nothing.",
  guardrail:
    "The audit shows you the quality of the work, not a promised result — no guaranteed leads, calls, or jobs. It is a real deliverable you keep whether or not you ever hire us. Every partner is individually researched and cited, never bulk-scraped. It does not include homeowner records: those come from your own list, and only after you are a client and have approved the export.",
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
