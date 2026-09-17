import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
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
// The residential-marketplace material survives in ONE place, under a heading that says it is
// a contrast, because (a) it is the only lead-generation experience most HVAC owners have,
// and (b) /shared-vs-exclusive-hvac-leads now 301s here, so the visitor that URL used to serve
// should find the two cited facts it was built on. Every figure in that section is sourced,
// dated and registered in SOURCES.md; nothing else on this page cites a number.

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
      "Every account we contact is a business we researched from free public sources, with a citation each: property managers, building owners, facility teams, multi-site operators. Each carries a named person, the reason it was included, and the source link. We never contact homeowners — not from research, not from a purchased list. If a vendor cannot tell you where a contact came from or why that person was chosen, you are buying a scraped list with a markup.",
  },
  {
    question: "What are you responsible for on each plan, and what stays with my team?",
    ourAnswer:
      "It is printed on each plan. On Prospecting we find and contact suitable commercial accounts, and you take over at interest. On Managed Pipeline we run outreach and follow-up, screen genuine interest, and organize the handoff. On Qualified Opportunity Engine we qualify the opportunity, gather the relevant context, coordinate the next step or site visit, and prepare your team to estimate and close. On every plan the technical evaluation, the estimate, the price and the close are yours. Ask any vendor for the same line, in writing.",
  },
  {
    question: "What do you mean by qualified?",
    ourAnswer:
      "We mean a written standard, and only one plan delivers it. A qualified opportunity has a verified account and site, a buyer with the responsibility, and a need, a timing and an agreement to hear from your team that the buyer confirmed — with the useful context gathered and unknowns marked. That is Qualified Opportunity Engine work. An interested reply is an interested prospect, and a checked one is screened interest; we do not call either of them qualified.",
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
      "Our cold outreach is email-led, and we make no cold calls on any plan. A call becomes appropriate only after a contact has shown genuine interest, when a live conversation would add something an email cannot. On Qualified Opportunity Engine we can run an engaged call with an interested contact, under your written authorization; on the other two plans that call is yours. Ask any vendor who they call, from what list, and what they say your company name is.",
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
          the qualification standard
        </Link>
        .
      </>
    ),
  },
  {
    flag: "Every plan described as appointment setting",
    why: "Finding accounts, running follow-up and qualifying an opportunity are different jobs. A vendor whose cheapest plan claims all three is overpromising on each of them.",
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

        <GuideSection id="residential-marketplaces" title="A contrast: how residential lead marketplaces work">
          <p>
            <span className="text-ink">
              This section is about a different product from ours, and it is here as a contrast.
            </span>{" "}
            Most HVAC owners&rsquo; experience of &ldquo;lead generation&rdquo; is a residential
            marketplace that sells homeowner inquiries per lead. We sell no leads, we never contact
            homeowners, and commercial accounts do not appear on those marketplaces at all. Two
            cited facts about that model are still worth knowing before you evaluate anyone:
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="text-ink">Marketplace leads are shared by design.</span> Angi&rsquo;s
              help center states that each homeowner project request is matched with{" "}
              <em>&ldquo;no more than five pros&rdquo;</em>. That is the published model, not a
              hidden practice.
            </li>
            <li>
              <span className="text-ink">
                Lead-quality claims have been the subject of federal action.
              </span>{" "}
              In 2023 the FTC finalized an order requiring HomeAdvisor — a company affiliated with
              Angi — to pay up to $7.2 million to settle charges about how it marketed its leads to
              service providers, including claims about lead quality and where the leads came from.
              HomeAdvisor settled by consent order without admitting liability. The case was about
              lead quality and sourcing claims; it did not charge HomeAdvisor with selling one lead
              to several contractors.
            </li>
          </ul>
          <KeyAnswer>
            The lesson carries over to commercial work unchanged: verify what a vendor claims about
            who they contact and where the data came from, in writing, before you pay. It is the
            second question on the list above, and it is the one most vendors answer worst.
          </KeyAnswer>
          <SourceNote>
            Sources:{" "}
            <a
              href="https://intercom.help/angi/en/articles/6221483-opportunities-and-leads-frequently-asked-questions"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Angi Help Center
            </a>{" "}
            (updated April 2026; checked August 7, 2026) ·{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/01/ftc-order-requires-homeadvisor-pay-72-million-stop-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC press release (Jan 2023)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/04/ftc-approves-final-order-against-homeadvisor-inc-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC final-order announcement (Apr 2023)
            </a>
            . Policies belong to their owners and change; the order was finalized in April 2023 and
            the allegations were settled without an admission of liability.
          </SourceNote>
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
        </GuideSection>
      </GuideLayout>
    </>
  );
}
