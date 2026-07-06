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
      "Teams that want a verified, scored prospect list and the scripts to work it — and will run the outreach themselves.",
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
export const idealFor: string[] = [
  "B2B service providers, agencies, and consultants who sell high-value engagements and want a steady outbound pipeline",
  "SaaS and software companies with a defined deal size and sales motion",
  "IT, cybersecurity, and managed-service firms with recurring or high-value contracts to sell",
  "Professional services — finance, legal, accounting, HR, and marketing",
  "Specialized or niche B2B companies with a clear ideal customer",
];

export const notFor: string[] = [
  "B2C or consumer products with no business buyer",
  "Teams that want thousands of unverified emails to blast overnight",
  "Anyone expecting guaranteed sales or a fixed number of closed deals",
  "Businesses with no clear offer or no one to work the pipeline",
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
    title: "You keep your data and your domain",
    body: "Your list, your sending account, your CRM. Outreach goes out from your own domain at a measured, personalized pace — never a high-volume blast — and nothing is trapped inside a tool you lose access to when the engagement ends.",
  },
  {
    title: "Quality you can inspect first",
    body: "Every record ships with a fit reason, source citation, and verification note. Start on Lead Engine, judge the quality on your first list, then scale into done-for-you outreach once the quality earns it — no borrowed logos, no invented case studies.",
  },
  {
    title: "One clear line of ownership",
    body: "We own targeting, research, and outreach activity and report it honestly. You own the offer and the close. No confusion about who's responsible for what.",
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
      "A qualified lead matches the agreed ICP, connects to a relevant buyer role or influence point, includes usable verified data or confidence notes, and has a clear reason for outreach.",
  },
  {
    question: "Do you guarantee meetings/sales?",
    answer:
      "No. We guarantee the system and the activity and report the results, but sales depend on your offer, follow-up, timing, market fit, and closing. The Appointment Engine tier books qualified calls on your calendar, but no tier promises revenue or a fixed number of appointments.",
  },
  {
    question: "How are leads delivered?",
    answer:
      "Leads are delivered as a spreadsheet, CRM-ready file, or agreed system with fields, tags, notes, status tracking, priority tiers, and verification context.",
  },
  {
    question: "Who is this service best for?",
    answer:
      "The service is built for B2B service providers, agencies, and consultants; SaaS and software companies with a defined deal size; IT, cybersecurity, and managed-service firms; professional services such as finance, legal, accounting, HR, and marketing; and specialized or niche B2B companies with a clear offer and someone to work the pipeline. It is not a fit for B2C products or teams wanting large volumes of unverified emails to blast overnight.",
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
    question: "Will outreach put my domain or sender reputation at risk?",
    answer:
      "Outreach runs from your sending account at a measured pace with personalized, relevant messages you approve before they send — not high-volume templated blasts. You keep control of your domain and can pause at any time. You should still confirm the email, privacy, and platform rules that apply to your market.",
  },
  {
    question: "How do we start, and is there a long-term contract?",
    answer:
      "No long-term contract — pricing is month-to-month, so you're not locked in while you find out whether outbound works for your market. You can stop or move between tiers as your needs change. Most teams start with the tier that fits today — often Lead Engine, to see the quality first — then move up to done-for-you outreach once it proves out. It all begins with a short strategy call to confirm fit and define your ICP before any work starts.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "On the outreach tiers you provide the sending account or domain the messages go out from, and you approve every message before it sends. You handle the sales calls and the close. We handle the targeting, research, and list building — and, on the done-for-you tiers, the personalized outreach and follow-up. We confirm exactly what's needed for your tier on the strategy call before any work starts.",
  },
  {
    question: "What happens on the free strategy call?",
    answer:
      "It's a short, no-obligation call to confirm whether this is a fit and to define your ideal customer profile. We talk through who you sell to, what a good deal looks like, and which tier makes sense to start with. No work begins until you decide to move forward, and there's a roughly 60-second intake beforehand so the call starts with context.",
  },
];
