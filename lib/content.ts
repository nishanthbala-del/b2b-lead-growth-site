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
      "The service is built for B2B service providers, agencies, consultants, software companies, IT/cyber firms, professional services, local B2B companies, and niche service businesses.",
  },
  {
    question: "Do you offer outreach or appointment setting?",
    answer:
      "Yes — that's the upgrade ladder. Lead Engine delivers the list and scripts; Outreach Engine runs personalized outreach and follow-up for you; Appointment Engine adds reply qualification and books appointments directly on your calendar.",
  },
];
