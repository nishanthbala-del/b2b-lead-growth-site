import type { Metadata } from "next";
import Link from "next/link";
import Figure from "@/components/Figure";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE RESEARCH METHOD, WRITTEN OUT.
//
// This is how the service itself researches accounts — a written profile first, dated public
// sources, a named person chosen down a ladder, a cited reason, a fit/reach/timing rank, and
// one conversation per account — published so a contractor can run it without us. Giving the
// method away is the point: the page is only useful if it is the real one, and a reader who
// runs it learns exactly what the service does and what it costs in time.
//
// No figures are cited, so none needs a source; every rule stated here is one the operating
// system's research and send gates enforce.

const page = getGuidePage("how-to-find-commercial-hvac-accounts");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const sources = [
  {
    source: "Management company portfolios",
    finds: "Property managers and the buildings they run",
    check: "Current, and in your service area",
  },
  {
    source: "Building and leasing websites",
    finds: "The management company behind a building",
    check: "The leasing agent is not the property manager",
  },
  {
    source: "County property records",
    finds: "The owner of record, the sale date, the building's size and type",
    check: "An LLC owner may name no person at all",
  },
  {
    source: "State business registries",
    finds: "The people who manage the company that owns a building",
    check: "A registered agent is never the contact",
  },
  {
    source: "Building permit records",
    finds: "Renovations, fit-outs and mechanical work, by address",
    check: "What the permit covers, and who pulled it",
  },
  {
    source: "Commercial real estate news",
    finds: "Sales, new management, new developments, with dates",
    check: "How recent it is",
  },
  {
    source: "Company news and economic development announcements",
    finds: "New plants, distribution centers, expansions and relocations",
    check: "When the building actually opens",
  },
  {
    source: "Job postings for facility and maintenance roles",
    finds: "Who runs the building systems, and sometimes what equipment",
    check: "A posting shows what they run, never what is broken",
  },
  {
    source: "Public bid and procurement portals",
    finds: "HVAC solicitations from schools, colleges and local governments",
    check: "A solicitation is a formal bid, not an email",
  },
];

// NAMED NATIONAL SOURCES, WITH WHAT EACH ONE DOES NOT PROVE.
//
// The table above names CATEGORIES, which is the method but not a starting point: a reader
// cannot open "county property records". These seven are specific, national, free, and were
// each opened and checked on the date in the source note below. The third column is the
// reason the section exists at all. Every one of these datasets is routinely read as
// evidence of a need — a low benchmarking score as "their HVAC is failing", an expiring
// contract as "they are unhappy" — and that inference is exactly what D-024 forbids and what
// makes a first email read as a guess about a building nobody has seen.
const namedSources: { name: string; href: string; gives: string; limit: string }[] = [
  {
    name: "SAM.gov — Contract Opportunities",
    href: "https://sam.gov/search",
    gives:
      "Open federal solicitations, including HVAC service and replacement at federal sites, filterable by work type and location.",
    limit:
      "A solicitation is a formal bid with its own process. It is not a reason to send a cold email.",
  },
  {
    name: "USAspending.gov",
    href: "https://www.usaspending.gov/",
    gives:
      "Federal contracts already awarded — who holds the maintenance contract at a site today, and when the period of performance ends.",
    limit:
      "An incumbent is not evidence of a problem, and an end date is not evidence of a rebid.",
  },
  {
    name: "ENERGY STAR Portfolio Manager",
    href: "https://www.energystar.gov/buildings/benchmark",
    gives:
      "The benchmarking programme most large commercial buildings report into, and the scoring behind city disclosure datasets.",
    limit:
      "A score describes energy use. It says nothing about whether any equipment needs work.",
  },
  {
    name: "City benchmarking disclosure (New York City shown; many cities publish the same)",
    href: "https://www.nyc.gov/site/buildings/codes/benchmarking.page",
    gives:
      "Named buildings with their owners and annual energy performance, published under local law.",
    limit:
      "A poor grade is a reason to introduce yourself. It is never a diagnosis of the building.",
  },
  {
    name: "ENERGY STAR — Building Performance Standards",
    href: "https://www.energystar.gov/buildings/resources-topic/what-are-building-performance-standards",
    gives:
      "Which cities and states have put commercial buildings on a compliance deadline.",
    limit:
      "It does not say which buildings fall short, or what any one of them needs.",
  },
  {
    name: "State business registries (NASS state-by-state selector)",
    href: "https://www.nass.org/business-services/corporate-registration",
    gives:
      "A route into each official corporate registry — the people behind the LLC named on the deed.",
    limit:
      "A registered agent is never the contact, and an officer is not always who decides.",
  },
  {
    name: "Census Building Permits Survey",
    href: "https://www.census.gov/construction/bps/",
    gives: "Where commercial construction is actually happening, by county and by month.",
    limit:
      "It never names a building. For addresses you need your own jurisdiction's permit portal.",
  },
];

const contactLadder = [
  {
    rung: "A named decision-maker for the building",
    example: "The property manager of record, the director of facilities, the owner who runs the building.",
  },
  {
    rung: "A named person who can route the decision",
    example: "A regional manager, an operations manager, an asset manager.",
  },
  {
    rung: "A named contact whose role is unclear",
    example: "Someone listed on the building's page with no title.",
  },
  {
    rung: "A role inbox",
    example: "facilities@ or maintenance@ at the company's own domain.",
  },
  {
    rung: "A generic front door",
    example: "info@, or the contact form. Nobody in particular reads it for you.",
  },
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "Can I buy a list of commercial property managers instead?",
    answer:
      "You can, and some lists are accurate. Check three things before you send to one: where each contact came from, when it was last verified, and whether it names a person responsible for a building you want. A list that cannot answer those three is a guess, and you would be sending it in your company's name.",
  },
  {
    question: "What counts as a good reason to contact a commercial account?",
    answer:
      "A dated, public fact about the account that connects to work you do: a new building, a new manager, a sale, a renovation permit, a facility role being filled. \"They have a building\" is not a reason. \"They took over management of it last month\" is.",
  },
  {
    question: "Should I contact more than one person at the same company?",
    answer:
      "Not at the same time. Write to the best person you can find, and wait. If another person at the same company writes back, or anyone there asks you to stop, that decides it for the whole company. Two strangers from one contractor writing to one office in the same week looks like a campaign, because it is one.",
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
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function FindCommercialAccountsPage() {
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
        eyebrow="Commercial HVAC prospecting guide"
        intro={
          <>
            <p className="text-ink">
              Find commercial HVAC accounts by working public sources that name a building and the
              person responsible for it: management portfolios, property records, permits, company
              news, facility job postings and public solicitations. Record each account&rsquo;s
              contact, reason and source.
            </p>
            <p>
              This is the method {brandName} uses for the contractors it works for, written out so
              you can run it yourself. It takes time. That is the point: a list you can check is
              worth more than a long one you cannot.
            </p>
          </>
        }
      >
        <GuideSection id="profile" title="Step 1: Write the account profile before you search">
          <KeyAnswer>
            Decide what a good account looks like before you look for one. A profile you can say in
            one sentence — the building types, the equipment, the area and the work you want more
            of — keeps the list from drifting toward whatever is easiest to find.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Building types you already service well:</span> offices,
              retail, industrial, medical office, schools, restaurants, multifamily common systems.
            </li>
            <li>
              <span className="text-ink">Equipment:</span> rooftop units, split systems, chillers,
              boilers, building controls — whatever your technicians are best at.
            </li>
            <li>
              <span className="text-ink">Service area:</span> the drive time your technicians can
              honestly cover for an emergency call.
            </li>
            <li>
              <span className="text-ink">The work you want more of:</span> maintenance agreements,
              service, replacements or planned projects.
            </li>
            <li>
              <span className="text-ink">Exclusions:</span> current customers, companies you have
              worked with before, and anyone you would rather not contact.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="sources" title="Step 2: Work the public sources">
          <p>
            Each source below is free and public. None of them is enough on its own; an account
            usually needs two — one that names the building and the person, and one that gives a
            dated reason to write now.
          </p>
          <GuideTable
            caption="Public sources for commercial HVAC prospecting, what each finds, and the check to run before using it"
            head={["Source", "What it finds", "Check before you use it"]}
            rows={sources.map((s) => [
              <span key={s.source} className="font-semibold text-ink">
                {s.source}
              </span>,
              s.finds,
              s.check,
            ])}
          />
          <h3 className="mt-10 font-display text-2xl text-ink">
            Named sources you can open right now
          </h3>
          <p>
            The table above names categories, which is the method but not a starting point &mdash;
            nobody can open &ldquo;county property records&rdquo;. These seven are specific, free
            and national. The third column matters more than the second: each of these datasets is
            routinely misread as proof that a building needs work, and that inference is what turns
            a reasonable introduction into a guess about a building you have never seen.
          </p>
          <GuideTable
            caption="Named national public sources for commercial HVAC account research, what each gives you, and what it does not prove"
            head={["Source", "What it gives you", "What it does not prove"]}
            rows={namedSources.map((s) => [
              <a
                key={s.name}
                href={s.href}
                rel="nofollow noopener"
                target="_blank"
                className="font-semibold text-accent underline underline-offset-4"
              >
                {s.name}
              </a>,
              s.gives,
              s.limit,
            ])}
          />
          <SourceNote>
            Every source above was opened and checked on September 20, 2026. All are free and
            public. None of them is a mailing list: a record tells you an account exists and gives
            you a dated reason to write, and the person still has to be found and verified
            separately.
          </SourceNote>
          <p>
            Which sources matter most depends on the buyer. The pages on{" "}
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
            </Link>{" "}
            go through each one.
          </p>
        </GuideSection>

        <GuideSection id="contact" title="Step 3: Choose the person, not the inbox">
          <p>
            Work down this ladder only when the rung above it cannot be found. Record which rung
            each account is on, because it changes what the first email can say.
          </p>
          <GuideTable
            caption="The contact ladder: from a named decision-maker down to a generic front door"
            head={["Rung", "What it looks like"]}
            rows={contactLadder.map((c, i) => [
              <span key={c.rung} className="font-semibold text-ink">
                {i + 1}. {c.rung}
              </span>,
              c.example,
            ])}
          />
          <p>
            Two rules hold on every rung. Never greet a person the source does not name. And never
            tell a generic inbox that it belongs to the decision-maker: &ldquo;as the person
            responsible for the building&rdquo; is a claim you cannot make about info@.
          </p>
          <Figure
            src="/diagrams/commercial-hvac-account-stakeholder-map.svg"
            width={720}
            height={512}
            label="Diagram: one commercial account, several stakeholders, and the rules that protect it"
            alt="A two-panel diagram. The left panel, headed One account, several people, grades four people at a single commercial account: a director of facilities and a named property manager are named decision-makers who may be contacted; a maintenance supervisor is a named contact who routes but does not decide; a general info address or main line is a generic front door and is never treated as decision-maker access. The right panel, headed Four rules enforced in code, states that one person opting out suppresses the whole organisation, that an open conversation stops a cold message to a colleague, that message limits are counted across the whole account rather than per person, and that an account is never worked for two contractors at once."
          >
            The ladder above grades one person. A commercial account holds several, and that is
            what makes commercial prospecting different from chasing a contact: reaching one
            person changes what may be sent to the rest. These four rules are the ones we enforce
            in code rather than leave to judgement.
          </Figure>
        </GuideSection>

        <GuideSection id="reason" title="Step 4: Record the reason, with its date and its source">
          <KeyAnswer>
            Every account needs a reason you can show: a public fact, with a link and the date you
            checked it. No source, no contact. An undated page proves the account exists; it is not
            a reason to write this week.
          </KeyAnswer>
          <p>One row per account is enough:</p>
          <GuideTable
            caption="An example account record, with every field a placeholder"
            head={["Field", "Example"]}
            rows={[
              [<span key="a" className="font-semibold text-ink">Account</span>, "[Management company], [building address]"],
              [<span key="c" className="font-semibold text-ink">Contact</span>, "[Name], [role] — rung 1"],
              [<span key="r" className="font-semibold text-ink">Reason</span>, "Took over management of the building on [date]"],
              [<span key="s" className="font-semibold text-ink">Source</span>, "[Link to the announcement]"],
              [<span key="k" className="font-semibold text-ink">Checked</span>, "[The date you opened the link]"],
            ]}
          />
          <p>
            Write the reason as an observation, never as a diagnosis. &ldquo;Took over management
            last month&rdquo; is a fact. &ldquo;Probably has old equipment&rdquo; is a guess about a
            building you have not seen.
          </p>
        </GuideSection>

        <GuideSection id="rank" title="Step 5: Rank the list by fit, reach and timing">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Fit:</span> how closely the account matches your profile —
              the building type, the equipment, the area.
            </li>
            <li>
              <span className="text-ink">Reach:</span> how high on the contact ladder you got.
            </li>
            <li>
              <span className="text-ink">Timing:</span> how recent and how relevant the dated reason
              is.
            </li>
          </ul>
          <p>
            Work the accounts that score on all three first. An account that fits but has no
            reason to write today goes back on the list, not into your outbox.
          </p>
        </GuideSection>

        <GuideSection id="clean" title="Step 6: Keep the list clean">
          <ul className="list-disc space-y-2 pl-5">
            <li>One account, one conversation. Do not write to two people at one company at once.</li>
            <li>
              Keep a do-not-contact list, and check it before every send. Anyone who asks you to
              stop stays stopped — and at a company, one person&rsquo;s request covers their
              colleagues.
            </li>
            <li>Re-open the source before you write. Pages change, and people move on.</li>
            <li>Remove an account the moment its source no longer supports it.</li>
          </ul>
        </GuideSection>

        <GuideSection id="avoid" title="What not to do">
          <ul className="list-disc space-y-2 pl-5">
            <li>Do not send to a list you cannot trace back to a source.</li>
            <li>Do not guess email addresses and names and send to the guesses.</li>
            <li>Do not write to a registered agent, a leasing broker or a listing agent about HVAC.</li>
            <li>Do not tell anyone their building has a problem you have not seen.</li>
            <li>Do not measure the work by how many emails went out.</li>
          </ul>
        </GuideSection>

        <GuideSection id="have-it-done" title="Or have the research done for you">
          <p>
            {brandName} runs this method for established commercial HVAC contractors: it
            researches the accounts, writes to them in the contractor&rsquo;s name and hands over
            the interested ones.{" "}
            <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
              What commercial HVAC lead generation with us includes
            </Link>
            . The{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free commercial HVAC pipeline audit
            </Link>{" "}
            is this method applied to your own market: 3–5 researched accounts, each with its source
            link, in writing.
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
