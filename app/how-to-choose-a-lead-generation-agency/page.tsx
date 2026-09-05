import type { Metadata } from "next";
import type { ReactNode } from "react";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

const page = getGuidePage("how-to-choose-a-lead-generation-agency");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// The hard questions a buyer should ask — and our own on-the-record answers.
// Rendered visibly and mirrored into FAQPage markup below (verbatim match).
const hardQuestions = [
  {
    question: "Do you guarantee a number of leads, appointments, or jobs?",
    ourAnswer:
      "No — and you should walk away from any vendor who does. Whether a homeowner books and buys depends on your pricing, your reputation, your timing, and how the visit goes. A vendor controls the quality of the research and the outreach, not the buyer's decision. We sell defined activity: records worked, personalized outreach, appointment handling by tier. Never outcomes.",
  },
  {
    question: "Is this lead sold to anyone else?",
    ourAnswer:
      "Not with us — B2B Lead Growth sells no leads at all, shared or exclusive, so nothing we do is priced per lead. Ask every other vendor, because the answer is usually yes: shared leads are sold to three or four contractors at once, and the close rate is low enough to wreck the math. You pay us a flat monthly fee for work done on your own customer history and your own service area. Run the cost-per-booked-job math before you buy from anyone.",
  },
  {
    question: "Who owns the prospect data if we part ways?",
    ourAnswer:
      "You do — and with us your customer list was never ours to begin with. Every list, script, and tracker we build is yours to keep when you leave, along with the current suppression and opt-out list. Vendors keeping the records when a client leaves is avoidable: get ownership in writing before you sign with anyone.",
  },
  {
    question: "What is the minimum contract length?",
    ourAnswer:
      "Month-to-month, 14 days' notice either side, no setup fee. Long minimum terms shift the risk onto you before a vendor has proven anything. If a vendor needs six committed months to show value, ask why the first two will not.",
  },
  {
    question: "Can you show case studies or references?",
    ourAnswer:
      "No — B2B Lead Growth has no case studies or client references yet, and we will not manufacture social proof. What we offer instead is the audit: a free, keepable sample of the actual work, on your market, before any money changes hands. When we have real client results we can report with permission, we will publish them.",
  },
  {
    question: "Exactly what work happens each month, and how is it reported?",
    ourAnswer:
      "Each tier publishes its scope: how many records are worked, what is delivered, and what is excluded. Reports contain verified activity numbers only — contacted, replies, interested replies flagged, appointments booked. Never projections, and never a claim about jobs closed, because we cannot observe what happened in the driveway. Ask any vendor to name the metric they will report and the metric they refuse to report. Both answers are informative.",
  },
  {
    question: "Where does your contact data come from?",
    ourAnswer:
      "Homeowner records come from your own export and nowhere else; referral partners are businesses we research from free public sources, with a citation each. We cannot research, buy, or infer a homeowner record — only you can send it. Referral partners are builders, property managers, realtors and trades, and every one carries a cited reason it was included. If a vendor cannot tell you where a contact came from or why that person was chosen, you are buying a scraped list with a markup.",
  },
];

// `why` is a ReactNode, not a string: two of these explanations point at the page that
// substantiates them, and an in-body link with descriptive anchor text is worth more than
// naming a destination in prose and leaving the reader to find it. These are rendered in a
// table below, never serialized into JSON-LD — only `hardQuestions` is.
const redFlags: { flag: string; why: ReactNode }[] = [
  {
    flag: "Guaranteed jobs, appointments, or revenue",
    why: "Nobody controls a homeowner's buying decision. A guarantee is either priced-in churn math or a sign the vendor counts unqualified appointments as delivered.",
  },
  {
    flag: "The same lead is sold to three other contractors",
    why: (
      <>
        Shared leads are the default in this market, and the reason cost per booked job rarely
        matches cost per lead. If a vendor will not say in writing how many contractors receive each
        lead, assume the answer is several. Run{" "}
        <a
          href="/shared-vs-exclusive-hvac-leads"
          className="text-accent underline underline-offset-4"
        >
          the shared vs. exclusive cost-per-job math
        </a>{" "}
        first.
      </>
    ),
  },
  {
    flag: "Pricing that requires three sales calls to learn",
    why: (
      <>
        Opaque pricing usually adapts to your budget. Many vendors in this space do not publish
        rates, and third-party-reported ranges run from about $2,000 to well over $10,000 per month
        — the sources are cited on{" "}
        <a href="/pricing" className="text-accent underline underline-offset-4">
          our published HVAC lead generation pricing page
        </a>
        .
      </>
    ),
  },
  {
    flag: "Long lock-ins before any proof",
    why: "Three-to-twelve-month minimums transfer the performance risk to you. Month-to-month terms keep a vendor accountable every four weeks.",
  },
  {
    flag: "You can't export or keep the data",
    why: "If the lists, scripts, and CRM records evaporate when you cancel, the vendor is renting you your own pipeline.",
  },
  {
    flag: "Volume as the headline metric",
    why: "\"10,000 emails a month\" is a spam commitment, not a service. Ask about research depth per prospect, suppression practices, and opt-out handling instead.",
  },
  {
    flag: "Sending from domains or identities you don't control",
    why: "Outreach sent in your name from infrastructure you cannot inspect risks your brand and your deliverability. You should know what is sent, to whom, from where.",
  },
  {
    flag: "Vague answers about data sourcing",
    why: "\"Proprietary database\" often means an old scraped list resold many times. Cited, source-linked prospects are checkable; a database is not.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      mainEntity: hardQuestions.map((q) => ({
        "@type": "Question",
        // Same fragment the visible answer carries below, so one answer is citable on its own.
        "@id": `${siteUrl}/${page.slug}#${faqSlug(q.question)}`,
        url: `${siteUrl}/${page.slug}#${faqSlug(q.question)}`,
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.ourAnswer },
      })),
    },
  ],
};

export default function ChooseAgencyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <GuideLayout
        page={page}
        eyebrow="HVAC owner's guide"
        h1="How to choose an HVAC lead generation company: 7 questions, 8 red flags"
        intro={
          <>
            {/* Answer-first. The seven questions used to be enumerated inside one 63-word
                sentence with two parenthetical asides; this is the same list in 39 words, and
                it is the paragraph an answer engine quotes. The parenthetical answers moved
                down into the question blocks, where the reader is actually asking them. */}
            <p className="text-ink">
              Choose an HVAC lead generation company by asking seven questions: are results
              guaranteed, is the lead resold, who owns the data, how long is the term, what happens
              each month, how is it reported, where the data comes from.
            </p>
            <p>
              Vendors fail these far more often than they fail on price. Our own answers to all
              seven are on the record below, next to eight red flags worth walking away from.
            </p>
            <p>
              We sell HVAC lead generation and we are new, so use the checklist on us. Our{" "}
              <a href="/pricing" className="text-accent underline underline-offset-4">
                published monthly pricing
              </a>{" "}
              and the{" "}
              <a href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
                free pipeline audit
              </a>{" "}
              are how you check the answers.
            </p>
          </>
        }
      >
        {/* A table, not cards. Each entry is a labelled pair — the flag, and why it matters —
            and the card version rendered them as two unlabelled <p> siblings, which is exactly
            the shape an extractor cannot read. Same eight entries, same order. */}
        <GuideSection title="Eight red flags, and why each one matters">
          <GuideTable
            caption="Red flags when choosing an HVAC lead generation company, and why each one matters"
            head={["Red flag", "Why it matters"]}
            rows={redFlags.map((r) => [
              <span key={r.flag} className="font-semibold text-ink">
                {r.flag}
              </span>,
              r.why,
            ])}
          />
        </GuideSection>

        <GuideSection title="The seven questions, with our own answers on the record">
          <p>
            Ask these of any vendor you evaluate. Our answers sit below each one, so you can hold us
            to the same standard. For what the channels they resell actually cost, see{" "}
            <a
              href="/hvac-lead-generation-new-jersey"
              className="text-accent underline underline-offset-4"
            >
              what HVAC leads cost in New Jersey, by channel
            </a>
            .
          </p>
          {/* id + scroll-mt on every answer, mirroring the fragment each Question node
              publishes as its url — so one answer can be cited and linked to directly. */}
          <div className="divide-y divide-line border-y border-line">
            {hardQuestions.map((q) => (
              <div key={q.question} id={faqSlug(q.question)} className="scroll-mt-20 py-5">
                <h3 className="text-lg font-semibold text-ink">{q.question}</h3>
                <p className="mt-2 leading-7">{q.ourAnswer}</p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="When you should not hire any vendor yet">
          <KeyAnswer>
            Do not hire an HVAC lead generation vendor yet if you have no capacity on the schedule,
            nobody free to answer an interested homeowner within a business day, or no clear pricing
            you are confident quoting. Those leaks are downstream of the leads. Fix capacity and the
            response process first; pipeline help only multiplies what already works.
          </KeyAnswer>
          <p>
            An honest vendor tells you this in the first conversation. It is also the first thing a
            good audit reveals: sometimes the targeting is fine and the bottleneck is elsewhere. You
            deserve to know that before you spend anything, which is why{" "}
            <a href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              the free pipeline audit
            </a>{" "}
            is delivered in writing, before any money changes hands.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
