// Shared content arrays. Imported by the landing UI (client) AND by the server page
// that emits FAQPage + Offer JSON-LD — one source of truth keeps the structured data
// verbatim-matched to the visible text (a Google rich-results requirement).

export type Plan = {
  name: string;
  price: number;
  volume: string;
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
    volume: "Qualified, ready-to-contact lead list",
    bestFor:
      "Teams that want a researched, cited, scored prospect list and the scripts to work it — and will run the outreach themselves.",
    includes:
      "Defined ICP with bad-fit exclusions; sourced, enriched, scored, deduped lead list with citations; 2–3 outreach script angles plus a follow-up skeleton; CRM-ready delivery and handoff",
    guardrails:
      "You own all sending, follow-up, qualifying, and booking; no outreach run for you at this tier",
    cta: "Start with Lead Engine",
  },
  {
    name: "Outreach Engine",
    price: 1500,
    volume: "We run the outreach — you respond to interest",
    bestFor:
      "Companies that want consistent, personalized outbound running every week without hiring for it.",
    includes:
      "Everything in Lead Engine; personalized outreach drafted per prospect (not templated mail-merge); multi-touch follow-up cadence, tracked; reply triage that flags who's interested; monthly report (contacted → replies → positive)",
    guardrails:
      "You own the sending account and the sales call; no guaranteed reply volume or closed deals",
    cta: "Build My Pipeline",
    featured: true,
  },
  {
    name: "Appointment Engine",
    price: 2500,
    volume: "You show up to booked, qualified calls",
    bestFor:
      "Teams that want the full system — prospecting through booked appointments — handled end to end.",
    includes:
      "Everything in Outreach Engine; full reply qualification against your criteria; appointment booking on your calendar with confirmations and reminders; full CRM and pipeline tracking; weekly report plus a weekly optimization experiment",
    guardrails:
      "You own the live call and the close; no guaranteed revenue or fixed number of appointments",
    cta: "Scale with Appointment Engine",
  },
];

// Audience qualifiers. Surfaced as a dedicated section so the right visitor
// self-identifies fast and the wrong-fit visitor screens themselves out before
// they book — fewer, better-fit calls instead of broad, low-intent volume.
//
// The first entry is deliberately the market the campaigns are actively running
// in today (local service businesses, starting with New Jersey HVAC). A visitor
// who is being reached by that outbound has to see themselves on this page
// immediately, or the whole funnel leaks at the landing.
export const idealFor: string[] = [
  "Local and regional service businesses — HVAC, contractors, and home services — that sell high-value jobs and want a steady flow of qualified conversations",
  "B2B service providers, agencies, and consultants who sell high-value engagements and want a steady outbound pipeline",
  "SaaS and software companies with a defined deal size and sales motion",
  "IT, cybersecurity, and managed-service firms with recurring or high-value contracts to sell",
  "Professional services — finance, legal, accounting, HR, and marketing",
  "Specialized or niche companies with a clear ideal customer and someone to work the pipeline",
];

// Honest disqualifiers. The last item names the real limitation of an early
// business rather than papering over it — it is the same fact the rest of the
// page is built around, and stating it plainly is what earns the benefit of the
// doubt from a careful buyer.
export const notFor: string[] = [
  "Consumer-product or e-commerce brands that need mass-market advertising rather than one-to-one outreach",
  "Teams that want thousands of unverified emails to blast overnight",
  "Anyone expecting guaranteed sales, guaranteed jobs, or a fixed number of appointments",
  "Businesses with no clear offer, or no one available to take the calls and close",
  "Anyone who needs published client case studies before they'll start — this is an early, founder-led service, and there are none yet",
];

// Differentiators / objection-reducers. Every item maps to something the service
// actually does elsewhere on the page — no new claims are introduced here.
export type Differentiator = { title: string; body: string };

export const differentiators: Differentiator[] = [
  {
    title: "You approve every message",
    body: "Outreach is written per prospect and goes out only after you sign off — not templated mail-merge running on autopilot in your name.",
  },
  {
    title: "Everything we build is yours",
    body: "Your list, your sending account, your CRM. Outreach goes out from your own domain with your sign-off, and the lists, scripts, and trackers stay yours to keep — nothing is locked inside a tool you lose access to when the engagement ends.",
  },
  {
    title: "No citation, no outreach",
    body: "Every prospect is sourced from free public data and carries the source it came from, plus a fit reason and a data-confidence note. That is a hard rule in the system, not a best effort — a record without a citation cannot be contacted. No bought broker lists, no invented companies, no borrowed logos, no fabricated case studies.",
  },
  {
    title: "One clear line of ownership",
    body: "We own targeting, research, the writing, and — on the outreach tiers — the sending and follow-up, and we report it honestly. You approve the messaging, take the calls, and close. No confusion about who's responsible for what.",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "What is B2B lead generation?",
    answer:
      "B2B lead generation identifies potential business buyers, qualifies fit, and prepares sales opportunities your team can review, prioritize, and follow up with.",
  },
  {
    question: "What makes a lead qualified?",
    answer:
      "A qualified lead matches the agreed ICP, connects to a relevant buyer role or influence point, includes usable contact data with a confidence note, and has a clear, cited reason for outreach.",
  },
  {
    question: "Do you guarantee meetings/sales?",
    answer:
      "No. Sales depend on your offer, follow-up, timing, market fit, and closing, so we don't promise meetings, revenue, or a set number of results. What we commit to is running the system, doing the research and outreach work, and reporting the results honestly. The Appointment Engine tier includes booking qualified calls on your calendar, but no tier promises revenue or a fixed number of appointments.",
  },
  {
    question: "How many leads or messages do I get each month?",
    answer:
      "We set the volume with you on the strategy call, because the honest answer depends on how many companies actually match your criteria and what your sending setup can safely support. We deliberately don't advertise a headline number: hitting a quota is what pushes an agency to loosen the targeting or exceed safe sending limits, which is exactly the failure mode this service is built to avoid. You'll know the agreed volume before any work starts, and the monthly report shows what was actually delivered against it.",
  },
  {
    question: "How are leads delivered?",
    answer:
      "Leads are delivered as a spreadsheet, CRM-ready file, or agreed system with fields, tags, notes, status tracking, priority bands, a fit reason, and the public source citation for every record.",
  },
  {
    question: "Who is this service best for?",
    answer:
      "The service is built for local and regional service businesses such as HVAC, contractors, and home services that sell high-value jobs; B2B service providers, agencies, and consultants; SaaS and software companies with a defined deal size; IT, cybersecurity, and managed-service firms; professional services such as finance, legal, accounting, HR, and marketing; and specialized or niche companies with a clear offer and someone to work the pipeline. It is not a fit for consumer-product or e-commerce brands that need mass-market advertising, or for teams wanting large volumes of unverified emails to blast overnight.",
  },
  {
    question: "Where are you based, and who do you serve?",
    answer:
      "The work is done remotely and can be delivered for businesses across the United States. Campaigns are currently focused on New Jersey, starting with residential HVAC contractors, so that is where the sharpest local market knowledge sits today.",
  },
  {
    question: "Do you have case studies or client results I can see?",
    answer:
      "Not yet, and we won't invent any. This is an early, founder-led service, so there are no published client results to show — which is exactly why the site shows you the standards, the record format, the process, and the pricing instead. Start on Lead Engine and judge the first list on its own merits; that is the proof that actually matters before you scale spend.",
  },
  {
    question: "Where do the leads come from?",
    answer:
      "Prospects are researched from free public sources, and every record ships with the source citation, a fit reason, and a verification note. Nothing is bought from a data broker and nothing is invented — if a prospect has no citation, it doesn't go into your list or get contacted.",
  },
  {
    question: "What happens if someone asks not to be contacted?",
    answer:
      "They're added to a suppression list immediately and never contacted again on your campaign. Opt-out handling, deduplication, and daily sending caps run as automated checks on every send rather than something a person has to remember.",
  },
  {
    question: "Do you offer outreach or appointment setting?",
    answer:
      "Yes — that's the upgrade ladder. Lead Engine delivers the list and scripts; Outreach Engine runs personalized outreach and follow-up for you; Appointment Engine adds reply qualification and books appointments directly on your calendar.",
  },
  {
    question: "How is this different from buying a lead list?",
    answer:
      "A bought list is a bulk export with no context and no accountability. Here, each prospect is matched to your ICP, enriched, scored, and delivered with a fit reason, source, and verification note — and, on the done-for-you tiers, worked with personalized outreach you approve. You're buying a qualified pipeline you can act on, not a spreadsheet of unchecked contacts.",
  },
  {
    question: "How is this different from hiring an SDR?",
    answer:
      "A full-time SDR carries salary, tooling, ramp time, and management overhead. This is a system you can start in weeks, scale by changing tiers, and measure against clear reporting — without hiring, onboarding, or carrying fixed headcount before you know outbound works for your market.",
  },
  {
    question: "Who controls the outreach and the sending account?",
    answer:
      "You do. Outreach runs from your own sending account, every message is personalized and approved by you before it sends, and you set the volume and can pause anytime. Sender reputation and deliverability depend on your domain setup and sending history, which stay in your hands — so you should confirm the email, privacy, and platform rules that apply to your market before outreach begins.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    answer:
      "No long-term contract and no setup fee — pricing is a flat monthly fee, month-to-month, and you can cancel anytime, so you're not locked in while you find out whether outbound works for your market. You can move between tiers as your needs change, and everything built for you is yours to keep. It often makes sense to start with the tier that fits today — often Lead Engine, to see the quality first — then move up to done-for-you outreach once it proves out. It all begins with a 15-minute strategy call to confirm fit and define your ICP before any work starts.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "Three things: a clear picture of who you sell to, your approval on the messaging, and someone available to take the calls. On the outreach tiers you also provide the sending account or domain the messages go out from, so the relationship and the sender reputation stay yours. We handle the targeting, research, list building, and — on the done-for-you tiers — the outreach and follow-up. We confirm exactly what's needed for your tier on the strategy call before any work starts.",
  },
  {
    question: "What happens on the free strategy call?",
    answer:
      "It's a 15-minute, no-obligation call to confirm whether this is a fit and to define your ideal customer profile. We talk through who you sell to, what a good deal looks like, and which tier makes sense to start with. You also get a short written lead audit out of it — a few specific observations about your market and one clear next step — and it's yours to keep whether or not we work together. No work begins until you decide to move forward, and there's a roughly 60-second intake beforehand so the call starts with context.",
  },
];
