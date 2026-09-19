import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import {
  alternatives,
  boundarySentence,
  contractorBoundary,
  differentiators,
  faqSlug,
  funnel,
  funnelClose,
  idealFor,
  notFor,
  outcomeMetric,
  plans,
} from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, serviceJsonLd } from "@/lib/pages";
import { basedIn, brandName, siteUrl } from "@/lib/site";

// THE PRIMARY CANONICAL SERVICE PAGE.
//
// The one page on this site whose job is to answer "what is commercial HVAC lead generation,
// and what exactly does B2B Lead Growth do?" — the purpose, the funnel, the two plans, the
// boundary, and how this differs from the other things an HVAC owner can buy. It replaces
// /hvac-lead-generation-new-jersey (a one-state doorway for a nationally delivered service,
// now a 301 to here) as the service's home in search.
//
// KEYWORDS MAP TO PLANS, AND THE PAGE SAYS SO (D-028). "Prospecting", "target-account
// research", "decision-maker outreach", "managed follow-up" and "qualified conversations"
// describe both plans. "Opportunity validation", "next-step coordination" and what some vendors
// call "appointment setting" describe the Opportunity Engine only. A page that let every phrase
// describe every plan would be promising the $2,500 work at $1,500, which is exactly what
// tests/pricing-model.test.ts exists to stop.

const page = getGuidePage("commercial-hvac-lead-generation");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "What is commercial HVAC lead generation?",
    answer:
      "Commercial HVAC lead generation is the work of finding the businesses that buy commercial HVAC service — property managers, building owners, facility teams, multi-site operators — contacting the right person at each, and turning genuine interest into a qualified conversation a contractor's team can act on. It is a business-to-business sale: the buyer is a business, the sale is an account rather than a single job, and nobody sells those accounts on a marketplace.",
  },
  {
    question: "Is this commercial HVAC appointment setting?",
    answer:
      "Only in part, and only on one plan. The Opportunity Engine coordinates a concrete next sales step with an interested buyer — a call or meeting with your estimator or salesperson, or a site assessment by your team — before it hands the opportunity over. Managed Outbound hands over a qualified conversation with a warm introduction, and can share your booking link, but the next step is yours to set. Neither plan promises a number of appointments or site visits.",
  },
  {
    question: "Who do you contact on our behalf?",
    answer:
      "We contact businesses, and only businesses: property and facility managers, building owners, multi-site operators, and the people responsible for HVAC at offices, warehouses, schools, healthcare sites, restaurants and retail. Each contact is a named person chosen because they can take a vendor decision for the building or the portfolio, or route one.",
  },
  {
    question: "Do you cold call?",
    answer:
      "No, we make no cold calls on any plan; our cold outreach is email-led. A call becomes appropriate only after a contact has shown genuine interest, when a live conversation would add something an email cannot. On the Opportunity Engine we can run an engaged call with an interested contact, under your written authorization.",
  },
  {
    question: "Where do you work?",
    answer:
      "We work remotely with established HVAC contractors anywhere in the United States. The account research runs from public sources in whatever area you serve, and the outreach goes out from your own mailbox, so the service does not depend on where we are. The company itself is founder-run and based in New Jersey.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    serviceJsonLd(),
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

export default function CommercialHvacLeadGenerationPage() {
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
        eyebrow="The service"
        intro={
          <>
            <p className="text-ink">
              Commercial HVAC lead generation is finding the businesses that buy commercial HVAC
              service, contacting the right person at each, and turning genuine interest into a
              qualified conversation a contractor&rsquo;s team can act on. {brandName} runs it as a
              managed outbound service.
            </p>
            <p>
              It is for established HVAC contractors that already sell and complete commercial
              work. We find the accounts, contact the right people in your name, and hand your team
              qualified conversations — or, on the Opportunity Engine, accepted sales opportunities
              with the next sales step already set. Your team always does the technical evaluation,
              the estimate, the proposal and the close.
            </p>
            <p>
              It is not a lead marketplace. Everyone we contact is a business — a{" "}
              <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
                property manager
              </Link>
              , a{" "}
              <Link href="/hvac-building-owner-outreach" className="text-accent underline underline-offset-4">
                building owner
              </Link>{" "}
              or a{" "}
              <Link href="/hvac-facility-manager-outreach" className="text-accent underline underline-offset-4">
                facility team
              </Link>{" "}
              — and we sell no leads.
            </p>
          </>
        }
      >
        <GuideSection title="Who it is for">
          <KeyAnswer>
            {brandName} is for an established HVAC contractor that already sells and completes
            commercial work, has someone who quotes and wins those bids, has room to take on more
            accounts, and has no consistent way to find target accounts and follow up with them.
            A contractor with no commercial work yet is not a fit.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            {idealFor.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </GuideSection>

        {/* THE FULL LIST OF DECLINES lives here (moved from the homepage 2026-09-17, which now
            names the four the fit check enforces in a line and links to this). Each entry maps
            to a decline in the operating system's core/icp.DISQUALIFIERS, and the four the fit
            check enforces in code must each appear here — tests/qualification.test.ts holds
            `notFor` to lib/qualification.ts BLOCKS. */}
        <GuideSection id="not-for" title="Who it is not for">
          <KeyAnswer>
            The fit check gives these answers on the spot, before anyone spends anything. None of
            them is a judgement on the business; each is a reason this particular service would not
            earn its fee there.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            {notFor.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection id="funnel" title="The funnel: from your capacity to an opportunity your team can act on">
          <p>
            Both plans run the same six stages. What happens at the last one is the only thing the
            plans change.
          </p>
          <ol className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.stage} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">
                  {i + 1}. {f.stage}
                </span>
                <span className="block leading-7">{f.detail}</span>
              </li>
            ))}
          </ol>
          <p>Then the loop closes:</p>
          <ol className="space-y-3">
            {funnelClose.map((f) => (
              <li key={f.stage} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">{f.stage}</span>
                <span className="block leading-7">{f.detail}</span>
              </li>
            ))}
          </ol>
        </GuideSection>

        <GuideSection id="levels" title="Two plans: how far we carry each opportunity">
          <p>
            These are two different handoff points, not two sizes of one job. You choose how far we
            carry an opportunity before your team takes it.
          </p>
          <GuideTable
            caption="The two B2B Lead Growth plans: price, what we are responsible for, what happens after genuine interest, and what reaches the contractor"
            head={["Plan", "What we are responsible for", "After genuine interest", "What reaches you"]}
            rows={plans.map((p) => [
              <span key={p.name}>
                <span className="block font-semibold text-ink">{p.name}</span>
                <span className="block">${p.price.toLocaleString()}/mo</span>
              </span>,
              p.oneLiner,
              p.afterInterest.join(" → "),
              p.handoff.label,
            ])}
          />
          <p>
            No account is forced through the Opportunity Engine&rsquo;s workflow. If you are on
            Managed Outbound, a qualified conversation is handed to you with a warm introduction as
            soon as the prospect agrees to speak with your team, and the deeper qualification is
            yours from there.{" "}
            <Link href="/pricing#who-owns-what" className="text-accent underline underline-offset-4">
              See who owns what on each plan, line by line
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Prospecting, follow-up and opportunity validation are different jobs">
          <p>
            The phrases people search for do not all describe the same work, and they do not all
            describe both plans.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="text-ink">
                Commercial HVAC prospecting, target-account research, and outreach to property
                managers, facility managers and other commercial decision-makers
              </span>{" "}
              are part of both plans. Finding the account, choosing the contact and making the
              first contact in your name is the base of each.
            </li>
            <li>
              <span className="text-ink">
                Managed follow-up, qualified conversations and an organized commercial HVAC sales
                pipeline
              </span>{" "}
              are part of both plans too. Managed Outbound runs the follow-up sequence, screens
              each interested reply, keeps every open conversation tracked, and hands you each
              prospect who agrees to talk, with a warm introduction.
            </li>
            <li>
              <span className="text-ink">
                Commercial HVAC opportunity validation, acceptance against your criteria, and the
                next-step or site-assessment coordination that some vendors call appointment
                setting
              </span>{" "}
              are Opportunity Engine work, and only that plan&rsquo;s.
            </li>
            <li>
              <span className="text-ink">Maintenance-agreement prospecting</span> is a targeting
              choice rather than a plan: if service agreements are the work you want more of, the
              account profile is built around the buildings and portfolios that buy them.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="How the work is measured">
          <KeyAnswer>{outcomeMetric.oneSentence}</KeyAnswer>
          <p>
            Each plan also counts what it hands over, under its own name: on Managed Outbound,
            qualified conversations handed off; on the Opportunity Engine, accepted sales
            opportunities handed off. A qualified conversation is never labelled an accepted
            sales opportunity.{" "}
            <Link href="/how-it-works#terminology" className="text-accent underline underline-offset-4">
              The six terms are defined on the how-it-works page
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="boundary" title="Where our work stops and yours starts">
          <KeyAnswer>{boundarySentence}</KeyAnswer>
          <p>That holds on both plans, including the Opportunity Engine. We do not:</p>
          <ul className="list-disc space-y-2 pl-5">
            {contractorBoundary.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </GuideSection>

        {/* Differences IN KIND, stated as facts about what we do — written against what an HVAC
            owner has actually been burned by (lib/content.ts `differentiators`). On the homepage
            until 2026-09-17; it belongs on the page whose job is to define the service. */}
        <GuideSection id="different" title="What makes this different">
          <dl className="space-y-5">
            {differentiators.map((item) => (
              <div key={item.title} className="border-l-2 border-accent/45 pl-4">
                <dt className="font-semibold text-ink">{item.title}</dt>
                <dd className="mt-1.5 leading-7">{item.body}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection id="alternatives" title="How this differs from the other ways to buy HVAC growth">
          <p>
            These are differences in kind, not a ranking. We have no client results yet, so we make
            no claim to outperform any of them — and the last column says when the other thing is
            the right tool.
          </p>
          <GuideTable
            caption={`How B2B Lead Growth differs from ${alternatives.map((a) => a.name.toLowerCase()).join(", ")}`}
            head={["Alternative", "What it is", "How this service differs", "When the alternative fits"]}
            rows={alternatives.map((a) => [
              <span key={a.name} className="font-semibold text-ink">
                {a.name}
              </span>,
              a.whatItIs,
              a.difference,
              a.whenItFits,
            ])}
          />
        </GuideSection>

        <GuideSection title="What we do not claim">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              We have no clients, case studies, reviews or results to publish yet, and we publish
              none. The{" "}
              <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
                free pipeline audit
              </Link>{" "}
              is the sample: real work on your market, before any money changes hands.
            </li>
            <li>
              We do not guarantee revenue, contracts, appointments, site visits, qualified
              opportunities, or any count of them, on any plan.
            </li>
            <li>
              We claim no local expertise we do not have. The company is founder-run and based in{" "}
              {basedIn}; the research for your engagement is done in your service area, from
              public sources you can open.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Where to go next">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Link href="/how-it-works" className="text-accent underline underline-offset-4">
                How commercial HVAC managed outbound works
              </Link>{" "}
              — the process, the warm handoff, the acceptance standard, and when a call happens.
            </li>
            <li>
              <Link href="/pricing" className="text-accent underline underline-offset-4">
                Pricing: the two plans and who owns what
              </Link>
              .
            </li>
            <li>
              How the outreach works for each commercial buyer:{" "}
              <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
                property managers
              </Link>
              ,{" "}
              <Link href="/hvac-facility-manager-outreach" className="text-accent underline underline-offset-4">
                facility teams
              </Link>{" "}
              and{" "}
              <Link href="/hvac-building-owner-outreach" className="text-accent underline underline-offset-4">
                building owners
              </Link>
              .
            </li>
            <li>
              <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
                How to find commercial HVAC accounts in your service area
              </Link>{" "}
              — the research method, written out.
            </li>
            <li>
              <Link href="/start" className="text-accent underline underline-offset-4">
                The fit check
              </Link>{" "}
              — a straight answer on whether this is for you, including no.
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
