import type { Metadata } from "next";
import Link from "next/link";
import ExampleEmail from "@/components/ExampleEmail";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, solutionServiceJsonLd } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// WHO WE REACH, 1 OF 3: PROPERTY MANAGERS.
//
// The buyer on this page runs buildings for someone else. What makes the page worth its own
// URL is what is specific to that buyer: a portfolio you can see before you write, a vendor
// list you are trying to get onto, work that repeats, and an owner (or a board) above the
// manager for the big decisions. The facility-team and building-owner pages cover buyers with
// a different buying process, different public sources and a different first message.
//
// Nothing here quotes a price, names a plan or counts anything we would deliver: the plans are
// described on /pricing, and this page links there rather than restating them.

const page = getGuidePage("hvac-property-manager-outreach");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const sources = [
  {
    source: "Management company websites",
    tells: "The buildings a firm manages, the property types, and often the manager or the regional team for each.",
    check: "The page is current. A portfolio page with no date shows what they run, not a reason to write this week.",
  },
  {
    source: "Building and leasing websites",
    tells: "The management company behind a building, and sometimes the on-site office.",
    check: "A leasing agent is not the property manager. Find the person who runs the building.",
  },
  {
    source: "News and press releases",
    tells: "A firm taking over the management of a building, or a building changing hands, with a date and names.",
    check: "The date. A new manager or a new owner is a reason to write now; an announcement from two years ago is not.",
  },
  {
    source: "Building permit records",
    tells: "Mechanical permits, renovations and tenant fit-outs, by address. Many cities and counties publish them online.",
    check: "What the permit covers and who pulled it. A permit pulled by another HVAC contractor means the work is taken.",
  },
  {
    source: "Job postings",
    tells: "A management company hiring a maintenance technician or a building engineer: which buildings, and who the role reports to.",
    check: "A hiring notice shows what they run. It never shows that something is broken, so never write as if it did.",
  },
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "Do property managers choose HVAC contractors, or do building owners?",
    answer:
      "Both, depending on the building and the size of the job. A property manager commonly picks the vendors for service calls and routine maintenance, inside a budget the owner sets. A large repair or a replacement usually goes to the owner for approval, often on the manager's recommendation. That is why the first email goes to the manager: the manager is usually the one who can put your company on the list.",
  },
  {
    question: "What if the property manager already has an HVAC contractor?",
    answer:
      "Many do. The first email does not ask them to replace anyone. It offers a second contractor on file — useful when the current one cannot come out, or when the owner wants a second bid on a big job.",
  },
  {
    question: "What does a property manager need before adding a new HVAC vendor?",
    answer:
      "It varies by company, but most ask for proof of insurance before a first job, and many also ask for a W-9, license details and a signed vendor agreement. Having those ready shortens the step from a reply to a first work order. That paperwork comes from your company, not from us.",
  },
  {
    question: "Can you target particular management companies, or leave some out?",
    answer:
      "Yes. You approve the building types, the service area and the exclusions before anything is sent. You can leave out a current customer, a company you have worked with before, or anyone else you name.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    solutionServiceJsonLd(page, "Property manager outreach for commercial HVAC contractors"),
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function PropertyManagerOutreachPage() {
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
        eyebrow="Who we reach: property managers"
        intro={
          <>
            <p className="text-ink">
              Property manager outreach is contacting the people who run commercial buildings for
              their owners, with a specific reason to add your company to their HVAC vendor list.{" "}
              {brandName} does this for you, in your name.
            </p>
            <p>
              A property manager is usually the first person to hear that a tenant has no cooling.
              The manager decides who gets that call, who runs the maintenance, and whose
              proposal goes to the owner when a unit needs replacing. One management company can
              run many buildings.
            </p>
            <p>
              This page covers which property managers to contact, where to find them, and what a
              first email should say. It is written for established HVAC contractors that already
              sell and complete commercial work.
            </p>
          </>
        }
      >
        <GuideSection id="why" title="Why property managers are worth reaching">
          <KeyAnswer>
            A property manager runs the day-to-day operation of buildings owned by someone else:
            tenants, maintenance, vendors and budgets. For HVAC, that usually means choosing who
            answers service calls, who handles preventive maintenance, and which contractor
            prices the replacement the owner is asked to approve.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">One relationship can cover several buildings.</span>{" "}
              Management companies publish their portfolios, so you can see what they run before
              you write.
            </li>
            <li>
              <span className="text-ink">The work repeats.</span> Preventive maintenance, seasonal
              start-ups and service calls come back every year, building by building.
            </li>
            <li>
              <span className="text-ink">They need a contractor who answers.</span> When a tenant
              calls about heat or cooling, the manager is the one who has to find somebody.
            </li>
            <li>
              <span className="text-ink">Big decisions go up a level.</span> A replacement usually
              needs the owner&rsquo;s approval. The manager is often the person who brings the
              proposal to the owner.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="who" title="Which property managers to contact">
          <p>
            Start with the kinds of buildings your company already services well. The management
            companies that run them fall into a few groups:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Commercial management firms</span> running office, retail,
              medical office and industrial buildings for owners and investors.
            </li>
            <li>
              <span className="text-ink">Multifamily management companies</span> running apartment
              communities, where the common areas, the central plant and the leasing office are
              commercial work.
            </li>
            <li>
              <span className="text-ink">Owners with their own management arm</span>, where the
              property manager works for the owner directly.
            </li>
          </ul>
          <p>Inside each company, the right person is usually one of these:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>The property manager named for a specific building.</li>
            <li>A senior or regional property manager responsible for a group of buildings.</li>
            <li>A director of property management, operations or maintenance.</li>
            <li>A chief engineer or building engineer at a larger building.</li>
          </ul>
          <p>
            Write to a named person. A generic office inbox is a front door, not a decision-maker,
            and an email that greets a name the public record does not support is a guess sent in
            your company&rsquo;s name.
          </p>
        </GuideSection>

        <GuideSection id="sources" title="Where to find them: public sources that name the building and the manager">
          <p>
            Every account we research for a contractor comes from sources like these, and carries
            the link. You can use the same list yourself.
          </p>
          <GuideTable
            caption="Public sources for finding property managers, what each tells you, and what to check before using it"
            head={["Source", "What it tells you", "Check before you use it"]}
            rows={sources.map((s) => [
              <span key={s.source} className="font-semibold text-ink">
                {s.source}
              </span>,
              s.tells,
              s.check,
            ])}
          />
          <p>
            The full method, including how to rank the accounts you find, is in{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              how to find commercial HVAC accounts in your service area
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="first-email" title="What a first email to a property manager should say">
          <KeyAnswer>
            Bring the manager something useful about one building, not a claim that the building
            has a problem. Name the building and why you are writing now, say one thing about your
            company that matters there, offer something small, and ask one easy question.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            <li>Name the building, or the portfolio, and the dated reason you are writing.</li>
            <li>
              Say what your company does that fits that building: the equipment, the property type,
              how close your technicians are.
            </li>
            <li>
              Offer a second contractor on file, a maintenance proposal, or after-hours cover — only
              what your team will actually deliver.
            </li>
            <li>Ask one question the manager can answer with a yes.</li>
            <li>Never tell a manager their building has a fault you have not seen.</li>
          </ul>
          <ExampleEmail
            label="Example: a first email to a property manager"
            subject="HVAC service for [building name]"
            body={[
              "Hi [first name],",
              "I saw on [management company]'s website that you manage [building name] on [street]. We service [equipment type] at [similar buildings] in [area], [distance] from there, and we keep a technician on call after hours.",
              "If it would help to have a second HVAC contractor on file for [building name] before [the cooling season], I can send our maintenance terms. Would that be useful?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "If you would rather not hear from us, reply and say so, and we will not write again.",
            ]}
          />
          <p>
            Every bracket is filled in only with something true. For subject lines, follow-ups and
            the rules every commercial email has to follow, see{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              what to send a property or facility manager
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="how-we-run-it" title="How we run property manager outreach for you">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="text-ink">You approve the envelope.</span> The building types, the
              service area, the exclusions, the claims we may make about your company, and the
              mailbox it goes out from.
            </li>
            <li>
              <span className="text-ink">We research the accounts.</span> Management companies and
              the buildings they run in your area, each with a named contact, the reason it fits,
              and the public source link.
            </li>
            <li>
              <span className="text-ink">We write and send in your name.</span> Each first email is
              written for its building and goes out from your own mailbox, so you can read every
              message.
            </li>
            <li>
              <span className="text-ink">We hand over at the point your plan sets.</span> When a
              manager shows genuine interest, the conversation comes to your team with its
              context. Your team does the site walk, the proposal, the price and the close.
            </li>
          </ol>
          <p>
            <Link href="/how-it-works" className="text-accent underline underline-offset-4">
              How commercial HVAC managed outbound works
            </Link>{" "}
            covers each step, and{" "}
            <Link href="/pricing" className="text-accent underline underline-offset-4">
              commercial HVAC lead generation pricing
            </Link>{" "}
            shows where each plan hands over.
          </p>
        </GuideSection>

        <GuideSection title="What we will not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>We make no cold calls. The outreach is email-led.</li>
            <li>We do not buy or blast lists. Every account is researched and cited.</li>
            <li>We do not tell a manager their building has a problem. We have not seen it.</li>
            <li>
              We do not promise that any manager will reply, meet or sign. We commit to the
              research and the writing, done to a published standard.
            </li>
          </ul>
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
