import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

// HOW TO EVALUATE A COMMERCIAL HVAC LEAD GENERATION / MANAGED OUTBOUND VENDOR — US INCLUDED.
//
// REWRITTEN 2026-09-17. Until then this guide was framed by the residential lead-buying
// conversation: "is this lead sold to anyone else?", shared-versus-exclusive math, what Angi
// charges. That is not the purchase this site's reader is making. He is choosing someone to
// research commercial accounts and contact them in his name, and the questions that expose a
// weak vendor there are different ones: what are you responsible for on each plan, what do
// you mean by "qualified", whose mailbox sends, do you call.
//
// THE RESIDENTIAL CONTRAST IS GONE (2026-09-18). Until then one section, labelled as a
// contrast, kept two cited facts about residential lead marketplaces (Angi's matching rule and
// the FTC's HomeAdvisor order) for visitors arriving from /shared-vs-exclusive-hvac-leads. It
// was accurate, but it was the last page on the site describing the retired residential lead
// business, and it read to a search engine as a residential signal on a commercial page. Its
// one useful lesson — check where a vendor's contacts come from, in writing — is now a
// section of its own, written for a commercial buyer. SOURCES.md records the retired rows.
// This page cites no figures.

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
    question: "Do you guarantee a number of leads, appointments, site visits or contracts?",
    ourAnswer:
      "No — and you should walk away from any vendor who does. Whether an account signs depends on your pricing, your references, your timing, and how the site visit goes. A vendor controls the quality of the research and the outreach, not the buyer's decision. We sell defined work at a defined standard, never outcomes.",
  },
  {
    question: "Who exactly do you contact, and where does the contact data come from?",
    ourAnswer:
      "Every account we contact is a business we researched from free public sources, with a citation each: property managers, building owners, facility teams, multi-site operators. Each carries a named person, the reason it was included, and the source link. Nothing comes from a purchased list. If a vendor cannot tell you where a contact came from or why that person was chosen, you are buying a scraped list with a markup.",
  },
  {
    question: "What are you responsible for on each plan, and what stays with my team?",
    ourAnswer:
      "It is printed on each plan. On Managed Outbound we find the right commercial accounts, reach the decision-makers, run the outreach and follow-up, and hand you each prospect who agrees to speak with your team, with a warm introduction; the deeper qualification is yours from there. On the Opportunity Engine we also validate the need and timing, gather the property, account and buyer information, check the opportunity against the criteria you agreed with us, and set a concrete next sales step before we hand it over with a complete brief. On both plans the technical discovery, the estimate, the proposal, the price and the close are yours. Ask any vendor for the same line, in writing.",
  },
  {
    question: "What do you mean by qualified?",
    ourAnswer:
      "We mean a written definition, not an adjective. A qualified conversation is a decision-maker at an account that fits your profile who showed genuine interest and agreed to speak with your team, confirmed by a person; that is what Managed Outbound hands over. An accepted sales opportunity goes further and is published as a standard: a need and timing the buyer confirmed, the property, account and buyer information gathered with unknowns marked, a check against the criteria you agreed with us, and a next sales step set on a date. That is Opportunity Engine work. An interested reply on its own is an interested prospect; we do not call it qualified.",
  },
  {
    question: "Whose name and mailbox does the outreach go out from?",
    ourAnswer:
      "Yours. Outreach sends from your own domain and mailbox, so the people we write to see the company they can look up, and you can open the sent folder and read every message. Before anything sends you confirm the account categories, the service area, the exclusions, the claims we may make and the sending identity. Outreach sent in your name from infrastructure you cannot inspect risks your brand and your deliverability.",
  },
  {
    question: "Who owns the research and the suppression list if we part ways?",
    ourAnswer:
      "You do — the account research, the drafted messages and the trackers we build are yours to keep when you leave, along with the current suppression and opt-out list. Vendors keeping the records when a client leaves is avoidable: get ownership in writing before you sign with anyone.",
  },
  {
    question: "What is the minimum term, and what does it cost to leave?",
    ourAnswer:
      "Month-to-month, 14 days' notice either side, no setup fee and no exit fee. Long minimum terms shift the risk onto you before a vendor has proven anything. If a vendor needs six committed months to show value, ask why the first two will not.",
  },
  {
    question: "Can you show case studies or references?",
    ourAnswer:
      "No — B2B Lead Growth has no case studies or client references yet, and we will not manufacture social proof. What we offer instead is the audit: a free, keepable sample of the actual work, on your market, before any money changes hands. When we have real client results we can report with permission, we will publish them.",
  },
  {
    question: "What happens each month, and how is it reported?",
    ourAnswer:
      "Each plan publishes what we are responsible for, what is handed over, and what is excluded. Reports contain verified activity only — accounts contacted, messages sent, replies, and interested prospects, meaning a relevant contact who replied with genuine interest, confirmed by a person. Each plan also counts what it hands over, under its own name. Never projections, and never a claim about jobs closed, because we cannot observe what happens after the handoff unless you tell us. Ask any vendor to name the metric they will report and the metric they refuse to report. Both answers are informative.",
  },
  {
    question: "Do you make phone calls, and to whom?",
    ourAnswer:
      "Our cold outreach is email-led, and we make no cold calls on any plan. A call becomes appropriate only after a contact has shown genuine interest, when a live conversation would add something an email cannot. On the Opportunity Engine we can run an engaged call with an interested contact, under your written authorization; on Managed Outbound that call is yours. Ask any vendor who they call, from what list, and what they say your company name is.",
  },
];

// `why` is a ReactNode, not a string: some of these explanations point at the page that
// substantiates them. These are rendered in a table below, never serialized into JSON-LD —
// only `hardQuestions` is.
const redFlags: { flag: string; why: ReactNode }[] = [
  {
    flag: "Guaranteed jobs, appointments, site visits or contracts",
    why: "Nobody controls the buyer's decision. A guarantee is either priced-in churn math or a sign the vendor counts anything with a pulse as delivered.",
  },
  {
    flag: "The word qualified, with no written definition",
    why: (
      <>
        If a vendor cannot show you the standard an opportunity must meet before they call it
        qualified, the word means &ldquo;replied&rdquo;. Ask for it in writing; ours is published
        as{" "}
        <Link href="/how-it-works#qualification-standard" className="text-accent underline underline-offset-4">
          the acceptance standard
        </Link>
        .
      </>
    ),
  },
  {
    flag: "Every plan described as appointment setting",
    why: "Finding accounts, creating qualified conversations and developing an accepted sales opportunity are different jobs. A vendor whose cheapest plan claims all of them is overpromising on each.",
  },
  {
    flag: "Pricing that requires three sales calls to learn",
    why: (
      <>
        Opaque pricing usually adapts to your budget. Many outbound agencies do not publish rates;
        the ranges we could find, with their sources, are on{" "}
        <Link href="/pricing" className="text-accent underline underline-offset-4">
          our published commercial HVAC lead generation pricing page
        </Link>
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
    why: "If the account research and the records evaporate when you cancel, the vendor is renting you your own pipeline.",
  },
  {
    flag: "Volume as the headline metric",
    why: "\"10,000 emails a month\" is a spam commitment, not a service. Ask about research depth per account, suppression practices, and opt-out handling instead.",
  },
  {
    flag: "Sending from domains or identities you don't control",
    why: "Outreach sent in your name from infrastructure you cannot inspect risks your brand and your deliverability. You should know what is sent, to whom, from where.",
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
        eyebrow="Commercial HVAC owner's guide"
        intro={
          <>
            <p className="text-ink">
              Choose a commercial HVAC lead generation partner by asking ten questions: what is
              guaranteed, who is contacted, what each plan makes the vendor responsible for, what
              qualified means, whose mailbox sends, who owns the data, the term, the proof, the
              reporting, and the calling.
            </p>
            <p>
              Vendors fail these far more often than they fail on price. Our own answers to all ten
              are on the record below, next to eight red flags worth walking away from.
            </p>
            <p>
              We sell{" "}
              <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
                commercial HVAC lead generation
              </Link>{" "}
              and we are new, so use the checklist on us. Our{" "}
              <Link href="/pricing" className="text-accent underline underline-offset-4">
                published monthly pricing
              </Link>{" "}
              and the{" "}
              <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
                free pipeline audit
              </Link>{" "}
              are how you check the answers.
            </p>
          </>
        }
      >
        <GuideSection title="Eight red flags, and why each one matters">
          <GuideTable
            caption="Red flags when choosing a commercial HVAC lead generation or managed outbound partner, and why each one matters"
            head={["Red flag", "Why it matters"]}
            rows={redFlags.map((r) => [
              <span key={r.flag} className="font-semibold text-ink">
                {r.flag}
              </span>,
              r.why,
            ])}
          />
        </GuideSection>

        <GuideSection title="The ten questions, with our own answers on the record">
          <p>
            Ask these of any vendor you evaluate. Our answers sit below each one, so you can hold us
            to the same standard.
          </p>
          <div className="divide-y divide-line border-y border-line">
            {hardQuestions.map((q) => (
              <div key={q.question} id={faqSlug(q.question)} className="scroll-mt-20 py-5">
                <h3 className="text-lg font-semibold text-ink">{q.question}</h3>
                <p className="mt-2 leading-7">{q.ourAnswer}</p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection id="check-the-data" title="How to check where a vendor's contacts come from">
          <KeyAnswer>
            Before you pay any vendor, ask to see where its contacts come from, in writing. It is
            the second question on the list above, and it is the one most vendors answer worst.
          </KeyAnswer>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="text-ink">Ask for three sample records.</span> Each should show the
              building or company, the named person, the reason it was included, the source link,
              and the date someone checked it.
            </li>
            <li>
              <span className="text-ink">Open the links yourself.</span> A researched record
              survives the click. A scraped one often points at a page that says something else.
            </li>
            <li>
              <span className="text-ink">Count the named people.</span> A list of info@ addresses
              is a list of front doors, not decision-makers.
            </li>
            <li>
              <span className="text-ink">Ask who else gets the same list.</span> Commercial
              accounts are finite in any one market. A vendor selling the same names to your
              competitors is selling you a race.
            </li>
            <li>
              <span className="text-ink">Ask what happens to the data when you leave.</span> The
              research done in your name should be yours to keep.
            </li>
          </ul>
          <p>
            Our own method, written out in full, is in{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              how to find commercial HVAC accounts in your service area
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="When you should not hire any vendor yet">
          <KeyAnswer>
            Do not hire a commercial HVAC lead generation vendor yet if you have no room for another
            account, nobody who quotes and wins commercial bids, nobody free to answer an interested
            reply within a business day, or no clear pricing you are confident quoting. Those leaks
            are downstream of the outreach. Fix capacity and the response process first; pipeline
            help only multiplies what already works.
          </KeyAnswer>
          <p>
            An honest vendor tells you this in the first conversation. It is also the first thing a
            good audit reveals: sometimes the targeting is fine and the bottleneck is elsewhere. You
            deserve to know that before you spend anything, which is why{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              the free pipeline audit
            </Link>{" "}
            is delivered in writing, before any money changes hands.
          </p>
          <p>
            And if the question underneath the search is which channel to fund at all rather than
            which vendor to hire,{" "}
            <Link href="/commercial-hvac-outbound-vs-inbound" className="text-accent underline underline-offset-4">
              outbound versus inbound for commercial HVAC
            </Link>{" "}
            compares how each one&rsquo;s cost behaves, how long each takes to produce anything, and
            the cases where none of them is the right purchase yet.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
