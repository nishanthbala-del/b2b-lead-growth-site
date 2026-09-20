import type { Metadata } from "next";
import Link from "next/link";
import ExampleEmail from "@/components/ExampleEmail";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, solutionServiceJsonLd } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// WHO WE REACH, 3 OF 3: BUILDING OWNERS.
//
// The buyer on this page owns the building and approves the capital spend. What is specific
// to him: whether to write to him at all (or to his property manager), the public records that
// name an owner — and the traps in them (an LLC, a registered agent) — and the dated moments
// when an owner looks at his HVAC equipment: a purchase, a renovation, an energy rule.
//
// ONE EXTERNAL FACT IS CITED (the ENERGY STAR definition of a building performance standard),
// registered in SOURCES.md with its check date. Nothing here quotes a price or names a plan.

const page = getGuidePage("hvac-building-owner-outreach");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const sources = [
  {
    source: "County property records",
    tells: "The owner of record, the last sale date, and the building's size and type, by address.",
    check: "The owner of record is often an LLC. The person behind it may be named elsewhere, or not at all.",
  },
  {
    source: "State business registries",
    tells: "The managers or officers of the company that owns the building, where the state publishes them.",
    check: "A registered agent is a paperwork service, not the owner. Never write to a registered agent about HVAC.",
  },
  {
    source: "Commercial real estate news",
    tells: "Sales, acquisitions, refinancings and new developments, with names, addresses and dates.",
    check: "The date, and whether the buyer also brought in a management company.",
  },
  {
    source: "Owner and investor websites",
    tells: "The buildings an owner holds, and often the person responsible for them.",
    check: "A portfolio page is a list, not a reason. Pair it with something dated.",
  },
  {
    source: "Energy benchmarking disclosures",
    tells: "In places that publish them, each large building's reported energy use, by address.",
    check: "The data shows energy use, not the condition of the equipment. Never tell an owner the building performs badly.",
  },
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "Should I contact the building owner or the property manager?",
    answer:
      "Write to the owner when the owner runs the building. Write to the property manager when a management company runs it, because the manager is usually the one who brings a contractor to the owner. Writing to both at the same time reads as going around the manager.",
  },
  {
    question: "How do you find the person behind an LLC that owns a building?",
    answer:
      "Through public records: the deed, the state business registry and the owner's own website often name a managing member or an asset manager. When no person can be identified from a public source, nobody is greeted by name. A guessed name is a made-up contact, and it is sent in your company's name.",
  },
  {
    question: "Do energy benchmarking rules create HVAC work?",
    answer:
      "They can give an owner a reason to look at the HVAC equipment. Some cities and states require large buildings to report their energy use each year, and some set performance levels that buildings must meet. The public data shows energy use, not what is wrong, so an email should never claim that a building performs badly.",
  },
  {
    question: "What do building owners care about in an HVAC contractor?",
    answer:
      "Owners tend to think in years and in the value of the building: what a replacement will cost and when, how long the equipment will last, and whether tenants stay comfortable. A first email that offers a clear written picture of the equipment speaks to that better than a service-call pitch.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    solutionServiceJsonLd(page, "Building owner outreach for commercial HVAC contractors"),
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

export default function BuildingOwnerOutreachPage() {
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
        eyebrow="Who we reach: building owners"
        intro={
          <>
            <p className="text-ink">
              Building owner outreach is contacting the people who own commercial buildings — the
              ones who approve replacements and service contracts — with a specific reason to hear
              from your company. {brandName} does this for you, in your name.
            </p>
            <p>
              Some owners run their buildings themselves. Others hire a property manager to do it.
              Which person to write to first depends on which it is, and that is checkable before
              anyone writes.
            </p>
            <p>
              This page covers when to contact the owner, the moments owners look at their HVAC
              equipment, the public records that name them, and what a first email should say.
            </p>
          </>
        }
      >
        <GuideSection id="owner-or-manager" title="Owner or property manager: who to contact first">
          <KeyAnswer>
            Write to the owner when the owner runs the building: a family that owns a few
            buildings, a local investor, or a business that owns the building it works in. Write to
            the property manager when a management company runs it. Never write to both at once.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Owner-operators</span> own a handful of buildings and run
              them. The owner usually makes the HVAC decision directly.
            </li>
            <li>
              <span className="text-ink">Owner-occupiers</span> are businesses that own the building
              they work in. The owner or an operations lead decides.
            </li>
            <li>
              <span className="text-ink">Investors and funds</span> usually work through a
              management company and an asset manager. The asset manager weighs capital spending
              across the portfolio, and the{" "}
              <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
                property manager
              </Link>{" "}
              is the better first contact.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="moments" title="The moments owners look at their HVAC equipment">
          <p>
            Each moment below is useful only when a public record carries it with a date. The full
            catalogue, with the freshness window for each kind, is on{" "}
            <Link href="/commercial-hvac-prospecting-triggers" className="text-accent underline underline-offset-4">
              commercial HVAC prospecting triggers
            </Link>
            .
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="text-ink">A purchase.</span> A new owner takes on the building&rsquo;s
              equipment, its service contracts and its capital plan all at once. Sales are recorded
              publicly, and larger ones are reported in the local business press.
            </li>
            <li>
              <span className="text-ink">A renovation or a new tenant.</span> A fit-out or a change
              of use can change what the HVAC system has to do. Permits and leasing announcements
              are public and dated.
            </li>
            <li>
              <span className="text-ink">An energy rule.</span> ENERGY STAR describes building
              performance standards as policies that require commercial and multifamily buildings to
              meet certain performance levels, typically for energy use or greenhouse gas emissions.
              Where a city or state has one, owners have a reason to plan HVAC changes.
            </li>
          </ul>
          <SourceNote>
            Source:{" "}
            <a
              href="https://www.energystar.gov/buildings/resources-topic/what-are-building-performance-standards"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              ENERGY STAR, &ldquo;What Are Building Performance Standards?&rdquo;
            </a>{" "}
            (checked September 18, 2026). Which rules apply depends on the city or state; check your
            own market&rsquo;s before you mention one.
          </SourceNote>
        </GuideSection>

        <GuideSection id="sources" title="Where building owners are named in public records">
          <GuideTable
            caption="Public records that name building owners, what each tells you, and what to check before using it"
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
            The full research method is in{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              how to find commercial HVAC accounts in your service area
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="first-email" title="What a first email to a building owner should say">
          <KeyAnswer>
            Tie the email to the dated moment — the purchase, the renovation, the rule — and offer
            the owner a clear written picture of the equipment they have. Never claim the equipment
            is failing or inefficient. You have not seen it.
          </KeyAnswer>
          <ExampleEmail
            label="Example: a first email to a building owner"
            subject="[Building address]: the HVAC equipment you have taken on"
            body={[
              "Hi [first name],",
              "I saw in [publication] on [date] that [company] bought [building address].",
              "We are a commercial HVAC contractor [distance] from the building, and we maintain [similar buildings] in [area]. If a walk-through of the rooftop equipment with a written summary would help your capital plan, our team can set one up. Is that worth a reply?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "If you would rather not hear from us, reply and say so, and we will not write again.",
            ]}
          />
          <p>
            The walk-through, the summary and anything else the email offers are your team&rsquo;s
            work, so offer only what your team will do. More on structure and follow-ups in{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              the commercial HVAC cold email guide
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="how-we-run-it" title="How we run building owner outreach for you">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="text-ink">We check who runs each building.</span> Owner-run buildings
              go to the owner; managed buildings go to the manager. One account, one conversation at
              a time.
            </li>
            <li>
              <span className="text-ink">We name a person only from a public source.</span> An LLC
              with no named person behind it is not greeted by a guessed name.
            </li>
            <li>
              <span className="text-ink">We write to the dated moment, in your name.</span> From your
              own mailbox, inside the claims you approved.
            </li>
            <li>
              <span className="text-ink">We hand over at the point your plan sets.</span> Your team
              walks the building, scopes the work, prices it and closes it.
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
