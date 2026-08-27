import type { Metadata } from "next";
import GuideLayout, { GuideSection, KeyAnswer } from "@/components/GuideLayout";
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
      "No — and we think you should walk away from anyone who does. Whether a homeowner books and buys depends on your pricing, your reputation, your timing, and how the visit goes. A vendor controls the quality of the research and the outreach, not the buyer's decision. We sell defined activity (records worked, personalized outreach, appointment handling by tier), never outcomes.",
  },
  {
    question: "Is this lead sold to anyone else?",
    ourAnswer:
      "This is the first question to ask any HVAC lead vendor, and the answer is usually yes. Shared leads are sold to three or four contractors at once, which is why the call goes to whoever dials fastest and why the close rate is low enough to wreck the math. We sell no leads at all, shared or exclusive, so nothing we do is priced per lead: you pay a flat monthly fee for work done on your own customer history and your own service area. Run the cost-per-booked-job math before you buy from anyone.",
  },
  {
    question: "Who owns the prospect data if we part ways?",
    ourAnswer:
      "You do — and with us, your customer list was never ours to begin with. Every list, script, and tracker we build is yours to keep when you leave, along with the current suppression and opt-out list. Vendors keeping the records when a client leaves is entirely avoidable: get ownership in writing before you sign with anyone.",
  },
  {
    question: "What is the minimum contract length?",
    ourAnswer:
      "Month-to-month, 14 days' notice either side, no setup fee. Long minimum terms shift all the risk onto you before the vendor has proven anything. If a vendor needs six guaranteed months to show value, ask why the first two won't show it.",
  },
  {
    question: "Can you show case studies or references?",
    ourAnswer:
      "Not yet — we are a new company and we will not manufacture social proof. What we offer instead is the audit: a free, keepable sample of the actual work, on your market, before any money changes hands. When we have real client results we can report with permission, we will publish them.",
  },
  {
    question: "Exactly what work happens each month, and how is it reported?",
    ourAnswer:
      "Each tier publishes its scope: how many records are worked, what is delivered, and what is excluded. Reports contain verified activity numbers only — contacted, replies, interested replies flagged, appointments booked — never projections, and never a claim about jobs closed, because we cannot observe what happened in the driveway. Ask any vendor to name the metric they will report and the metric they refuse to report; both answers are informative.",
  },
  {
    question: "Where does your contact data come from?",
    ourAnswer:
      "Two places, and we keep them strictly separate. Homeowner records come from your own export and nowhere else — we cannot research, buy, or infer them. Referral partners (builders, property managers, realtors, trades) are businesses, so those we research from free public sources, each with a citation explaining why they were included. If a vendor cannot tell you where a contact came from or why that person was chosen, you are buying a scraped list with a markup.",
  },
];

const redFlags = [
  {
    flag: "Guaranteed jobs, appointments, or revenue",
    why: "Nobody controls a homeowner's buying decision. Guarantees are either priced-in churn math or a sign the vendor counts unqualified appointments as delivered.",
  },
  {
    flag: "The same lead is sold to three other contractors",
    why: "Shared leads are the default in this market and the reason cost-per-booked-job rarely matches cost-per-lead. If a vendor will not say in writing how many contractors receive each lead, assume the answer is several.",
  },
  {
    flag: "Pricing that requires three sales calls to learn",
    why: "Opaque pricing usually means pricing that adapts to your budget. Many vendors in this space do not publish rates, and third-party-reported ranges run from about $2,000 to well over $10,000 per month — the cited sources are on our pricing page.",
  },
  {
    flag: "Long lock-ins before any proof",
    why: "Three-to-twelve-month minimums transfer the performance risk to you. Month-to-month terms keep the vendor accountable every four weeks.",
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
    why: "Outreach sent in your name from infrastructure you can't inspect risks your brand and deliverability. You should know exactly what is sent, to whom, from where.",
  },
  {
    flag: "Vague answers about data sourcing",
    why: "\"Proprietary database\" often means an old scraped list resold many times. Cited, source-linked prospects are checkable; databases are not.",
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
        h1="How to choose an HVAC lead generation company: red flags and the questions that expose them"
        intro={
          <>
            <p>
              The fastest way to evaluate anyone selling you HVAC leads is to ask seven questions:
              whether results are guaranteed (the honest answer is no), whether the lead is sold to
              anyone else, who owns the data when you leave (you should), the minimum term (shorter
              is safer), what exactly happens each month, how it is reported, and where the contact
              data comes from. Vendors fail these questions far more often than they fail on price.
            </p>
            <p>
              This guide is written against our own interest. We sell HVAC lead generation, we are
              new, and the honest move is to hand you the checklist you should use on us — including
              the questions we find uncomfortable.
            </p>
          </>
        }
      >
        <GuideSection title="The red flags, and why each one matters">
          <ul className="space-y-4">
            {redFlags.map((r) => (
              <li key={r.flag} className="rounded-lg border border-gold-500/14 bg-ink-900/60 p-5">
                <p className="font-semibold text-bone">{r.flag}</p>
                <p className="mt-2 leading-7">{r.why}</p>
              </li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="The seven questions — with our own answers on the record">
          <p>
            Ask these of any vendor you evaluate. Our answers are below each one, so you can hold
            us to the same standard.
          </p>
          <div className="divide-y divide-gold-500/12 border-y border-gold-500/12">
            {hardQuestions.map((q) => (
              <div key={q.question} className="py-5">
                <h3 className="text-lg font-semibold text-bone">{q.question}</h3>
                <p className="mt-2 leading-7">{q.ourAnswer}</p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="When you should not hire any vendor yet">
          <KeyAnswer>
            If you have no capacity on the schedule, no one available to answer an interested
            homeowner within a business day, or no clear pricing you are confident quoting,
            outsourced lead generation will waste your money — the leaks are downstream of the
            leads. Fix the capacity and the response process first; pipeline help only multiplies
            what already works.
          </KeyAnswer>
          <p>
            An honest vendor should tell you this in the first conversation. It is also the first
            thing a good free audit reveals: sometimes the targeting is fine and the bottleneck is
            elsewhere, and you deserve to know that before you spend anything.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
