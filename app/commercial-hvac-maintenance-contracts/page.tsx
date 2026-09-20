import type { Metadata } from "next";
import Link from "next/link";
import ExampleEmail from "@/components/ExampleEmail";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE COMMERCIAL REASON A CONTRACTOR WANTS THESE ACCOUNTS AT ALL.
//
// Every other guide on this site teaches a step of the method — finding accounts, choosing a
// buyer, writing the first email. None of them answered the question the contractor is
// actually asking, which is how recurring maintenance and service agreements get won. That
// intent had one passing mention across three pages.
//
// WHAT THIS PAGE MAY NOT DO. A maintenance agreement is priced, scoped and signed by the
// contractor. The operating system that runs this service is forbidden in code from pricing,
// sizing, diagnosing, scoping, negotiating or closing the buyer's work (core/scope_boundary.py
// in the operating-system repo), and this page keeps the same line: it covers finding the
// account, reaching the person who decides, and earning the conversation. It gives no coverage
// schedule, no pricing method, no proposal template and no closing advice — that is the
// contractor's trade, and pretending otherwise would be both dishonest and outside the service.
//
// No figures are cited, so none needs a source. Every rule stated here is one the operating
// system's own research and send gates enforce.

const page = getGuidePage("commercial-hvac-maintenance-contracts");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const whoBuys = [
  {
    account: "Property management firms",
    why: "They run buildings they do not own, and an owner expects the building covered without being asked twice.",
    decides: "The property manager, usually with an owner or a board above them for anything large.",
  },
  {
    account: "Multi-site operators",
    why: "One brand, many roofs. A single agreement across sites is less work for them than a vendor per location.",
    decides: "A facilities lead or an operations manager at the head office, not the site staff.",
  },
  {
    account: "Owner-occupied commercial buildings",
    why: "The owner carries the cost of a failure directly — lost use of the building, not a line in a budget.",
    decides: "The owner, or whoever they have put in charge of the building.",
  },
  {
    account: "Institutions with in-house teams",
    why: "The team handles daily work and buys outside help for specialist equipment, overflow and after-hours cover.",
    decides: "The facility or plant manager who already holds a budget for outside contractors.",
  },
];

const sequence = [
  {
    step: "1. Pick the accounts",
    detail:
      "Building type, equipment you know, and close enough for a technician to reach. A written profile first, so the list is a decision rather than whatever the search returned.",
  },
  {
    step: "2. Find the person who owns the vendor decision",
    detail:
      "Not the front desk, not the leasing agent, not the registered agent. The named person who decides who is on the vendor list.",
  },
  {
    step: "3. Write with a reason you can show",
    detail:
      "A dated public fact about that account, with a link. No source, no contact. An account that fits but has no reason to write today goes back on the list.",
  },
  {
    step: "4. Earn a conversation",
    detail:
      "The first message asks for a reply, not a meeting. Follow up because you have something to add, not because a sequence says day four.",
  },
  {
    step: "5. Let the buyer state the need",
    detail:
      "What they need, in their own words — coverage for a site, a second contractor on file, a contract they are unhappy with, a budget cycle coming up.",
  },
  {
    step: "6. Hand it to the people who quote it",
    detail:
      "The site visit, the coverage schedule, the price and the agreement are the contractor's work. Everything before that is what this page is about.",
  },
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "How do commercial HVAC contractors get maintenance contracts?",
    answer:
      "One account at a time. The contractor decides which buildings and operators he wants, finds the person who owns the vendor decision at each, and contacts that person with a real reason. Recurring agreements are rarely won from advertising, because the buyer is not searching — they already have someone, or they have not thought about it this quarter.",
  },
  {
    question: "Is it worth contacting an account that already has an HVAC contractor?",
    answer:
      "Usually it is the only kind worth contacting. A commercial building already has someone. What changes is the people: a new property manager, a new owner, a new site. Asking to be the second contractor on file is a smaller request than asking someone to replace a vendor, and it is the one most buyers can say yes to.",
  },
  {
    question: "How long does it take to win a maintenance agreement this way?",
    answer:
      "Longer than a service call and shorter than a construction bid, and it depends on the account's own budget cycle rather than on how many emails were sent. We do not publish a timeline, because we would be inventing it. What is measurable is activity: accounts researched, decision-makers reached, conversations that happened.",
  },
  {
    question: "Do you write the maintenance proposal or quote the work?",
    answer:
      "No. We research the accounts, reach the decision-makers in your name, and hand over the conversations with what the buyer told us. The site assessment, the coverage schedule, the price and the agreement are yours. We never price, scope or diagnose a building's work — that boundary is enforced in our own code, not just stated here.",
  },
  {
    question: "What is the difference between a service agreement and a one-off repair customer?",
    answer:
      "A repair customer calls when something breaks and may call someone else next time. An agreement is a standing arrangement to cover named equipment on a schedule. The outreach that wins the second is different from the marketing that wins the first, because the buyer is a named person with a vendor list rather than whoever answers the phone.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function CommercialHvacMaintenanceContractsPage() {
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
        eyebrow="Recurring commercial work"
        intro={
          <>
            <p className="text-ink">
              Commercial HVAC maintenance contracts are won one account at a time, not through
              advertising. The contractor picks the buildings he wants, reaches the person who owns
              the vendor decision, and gives that person a reason to start a conversation.
            </p>
            <p>
              That is a different job from getting found. The buyer of a service agreement is
              almost never searching: the building already has a contractor, and the person who
              would change that is a named individual with a vendor list and a budget cycle. This
              page covers how to reach them. It does not cover what the agreement should contain or
              what it should cost, which is your trade, not ours.
            </p>
          </>
        }
      >
        <GuideSection id="why-outbound" title="Why these accounts are contacted, not captured">
          <KeyAnswer>
            A building with no HVAC contractor is rare. A building with a contractor the manager
            has not thought about in a year is common. That is what outreach is for: it reaches
            accounts at the moment something changed, rather than waiting for the small number who
            are actively looking.
          </KeyAnswer>
          <p>
            Advertising works when a buyer is searching. For recurring commercial work, most are
            not. They have someone on file, the equipment is running, and replacing a vendor is
            nobody&rsquo;s priority until a person changes, a building changes hands, or a site is
            added. Those moments are public, and they are the reason to write.
          </p>
          <p>
            It also means the ask matters more than the pitch. &ldquo;Would it help to have a
            second contractor on file?&rdquo; is a question a busy manager can answer today.
            &ldquo;Can we meet to discuss your HVAC needs?&rdquo; asks for a commitment before you
            have earned one.
          </p>
        </GuideSection>

        <GuideSection id="who-buys" title="Which accounts actually buy recurring agreements">
          <GuideTable
            caption="Commercial account types that buy recurring HVAC maintenance, and who decides"
            head={["Account type", "Why an agreement suits them", "Who owns the decision"]}
            rows={whoBuys.map((r) => [
              <span key={r.account} className="font-semibold text-ink">
                {r.account}
              </span>,
              r.why,
              r.decides,
            ])}
          />
          <p>
            The three buyers above behave differently enough to need different first messages. Each
            has its own page:{" "}
            <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
              property managers
            </Link>
            ,{" "}
            <Link href="/hvac-facility-manager-outreach" className="text-accent underline underline-offset-4">
              in-house facility teams
            </Link>{" "}
            and{" "}
            <Link href="/hvac-building-owner-outreach" className="text-accent underline underline-offset-4">
              building owners
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="sequence" title="The sequence, start to handover">
          <div className="space-y-5">
            {sequence.map((s) => (
              <div key={s.step}>
                <p className="font-semibold text-ink">{s.step}</p>
                <p className="mt-1">{s.detail}</p>
              </div>
            ))}
          </div>
          <p>
            Steps 1 to 3 are the research method, written out in full on{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              how to find commercial HVAC accounts
            </Link>
            . Step 3&rsquo;s &ldquo;reason you can show&rdquo; has its own page:{" "}
            <Link href="/commercial-hvac-prospecting-triggers" className="text-accent underline underline-offset-4">
              what counts as a reason to contact an account
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="first-message" title="What the first message can honestly say">
          <p>
            You have not seen the building. You do not know what the equipment is, how old it is,
            or whether the current contractor is doing a good job. So the message brings an
            opportunity and never implies a problem you have not observed.
          </p>
          <ExampleEmail
            label="Example: a first email about coverage, every value a placeholder"
            subject="Second HVAC contractor on file for [building name]?"
            body={[
              "Hi [first name] — I saw that [management company] took over [building name] in [month]. Congratulations on the addition.",
              "We service [equipment type] on [property type] buildings around [area], and we are about [drive time] from that address. A few managers keep us on file as a second contractor for after-hours calls and for the weeks their first call is stretched.",
              "If that would be useful for [building name], I can send a one-page summary of what we cover and what we would need from you. Would that help?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "Reply “stop” and I will not write again.",
            ]}
          />
          <p>
            Every bracket is a value the writer has to know before sending. A message that works
            with the brackets left in is a message that could have gone to anyone, which is the
            definition of the email these managers already delete.
          </p>
          <p>
            The rules behind that example — what belongs in each part, the follow-ups, and what US
            law requires on a commercial email — are on{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              writing a commercial HVAC cold email
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="boundary" title="Where this work stops">
          <KeyAnswer>
            Finding the account, reaching the decision-maker and earning the conversation is one
            job. Assessing the equipment, building the coverage schedule, pricing it and signing it
            is a different one, and it belongs to the contractor.
          </KeyAnswer>
          <p>
            This matters more here than anywhere else on the site, because a maintenance agreement
            is exactly the kind of work someone will offer to &ldquo;handle end to end&rdquo;. Nobody
            who has not stood in the mechanical room can scope it. When we run this for a
            contractor, our own software refuses to let an agency-written message price, size,
            diagnose, scope, negotiate or close the buyer&rsquo;s work — it is a check in code, not
            a promise in a proposal.
          </p>
          <p>
            What we hand over is the conversation and what the buyer said in it. What you do with
            it is the part only you can do.
          </p>
        </GuideSection>

        <GuideSection id="avoid" title="What not to do">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Do not tell a manager their building has a problem. You have not seen it, and they
              know you have not.
            </li>
            <li>
              Do not open by asking to replace their contractor. Ask to be the second name on the
              list; it is a smaller decision and it is the one they can make today.
            </li>
            <li>Do not send the same message to four people at one company. One account, one conversation.</li>
            <li>Do not attach a capabilities brochure to a first email. Offer it, and send it when asked.</li>
            <li>
              Do not measure this by emails sent. Count accounts researched, decision-makers
              reached, and conversations that actually happened.
            </li>
            <li>
              Do not keep writing to someone who asked you to stop — and at a company, one
              person&rsquo;s request covers their colleagues.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="have-it-done" title="Or have the accounts researched and reached for you">
          <p>
            {brandName} runs this for established commercial HVAC contractors: it researches the
            accounts, writes to the decision-makers in the contractor&rsquo;s name from the
            contractor&rsquo;s own mailbox, and hands over the interested ones with the conversation
            attached.{" "}
            <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
              What the service includes
            </Link>
            , and{" "}
            <Link href="/pricing" className="text-accent underline underline-offset-4">
              what it costs
            </Link>
            . The{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free commercial HVAC pipeline audit
            </Link>{" "}
            is this method applied to your own market: 3&ndash;5 researched commercial accounts,
            each with its source link, in writing. No call is required to receive it.
          </p>
          <p>
            The exact wording of what we hand over is published on{" "}
            <Link href="/sample-deliverables" className="text-accent underline underline-offset-4">
              sample deliverables
            </Link>
            , and every term used above is defined on{" "}
            <Link href="/definitions" className="text-accent underline underline-offset-4">
              definitions
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Common questions">
          <div className="divide-y divide-line border-y border-line">
            {pageFaqs.map((f) => (
              <div key={f.question} id={faqSlug(f.question)} className="scroll-mt-20 py-5">
                <h3 className="text-lg font-semibold text-ink">{f.question}</h3>
                <p className="mt-2 leading-7">{f.answer}</p>
              </div>
            ))}
          </div>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
