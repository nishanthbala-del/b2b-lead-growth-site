import type { Metadata } from "next";
import Link from "next/link";
import ExampleEmail from "@/components/ExampleEmail";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, solutionServiceJsonLd } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// WHO WE REACH, 2 OF 3: FACILITY TEAMS.
//
// The buyer on this page works for the organization that occupies the building, often has
// technicians of its own, and buys outside HVAC help for specific jobs. That is a different
// sale from the property manager's vendor list: the opening is specialist equipment, overflow,
// after-hours cover or a planned project, the calendar is a budget year or a shutdown window,
// and the public sources are expansion news, facility job postings and public solicitations.
//
// Nothing here quotes a price, names a plan or counts anything we would deliver.

const page = getGuidePage("hvac-facility-manager-outreach");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const sources = [
  {
    source: "Company news and press releases",
    tells: "A new plant, a new distribution center, an expansion or a relocation — with a site, a date and often a named executive.",
    check: "The date, and that the site is in your service area.",
  },
  {
    source: "Economic development announcements",
    tells: "State and county agencies announce the new facilities they helped bring in, by company and town.",
    check: "An announced project may be a year or more from opening. Time the email to the building, not the headline.",
  },
  {
    source: "Facility job postings",
    tells: "The team, the site, and sometimes the equipment: a posting that asks for chiller or building-automation experience tells you what they run.",
    check: "A posting shows what a team runs. It never shows that something is failing, so never write as if it did.",
  },
  {
    source: "Organization websites",
    tells: "Many list a facilities or operations department, the campus or the sites, and a contact.",
    check: "A departmental inbox is a front door. Look for the named person responsible for the building systems.",
  },
  {
    source: "Public bid and procurement portals",
    tells: "Schools, colleges and local governments post HVAC solicitations with the scope, the contact and the deadline.",
    check: "A posted solicitation is a formal bid. It is your estimator's decision, not a cold email.",
  },
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "Will a facility team with its own technicians hire an outside HVAC contractor?",
    answer:
      "Often, for the work the team does not keep in-house: specialist equipment, overflow when the team is stretched, cover outside working hours, and planned projects such as replacements. The first email should say which of those your company offers. It should never suggest the team is falling short.",
  },
  {
    question: "Should I contact the facility manager or purchasing?",
    answer:
      "Start with the person responsible for the building systems: the facility manager, the director of facilities, or the maintenance manager. Purchasing usually sets up a new vendor after that person wants one. Where an organization says all vendor contact goes through purchasing, follow that.",
  },
  {
    question: "Do you respond to public bids for us?",
    answer:
      "No. A public solicitation is a formal bid: your estimator decides whether to respond and prepares the response. We do not prepare or submit bids, estimates or proposals, on any plan.",
  },
  {
    question: "When do facility teams plan HVAC work?",
    answer:
      "Larger projects are usually planned in the organization's budget cycle, often months before the work. Schools plan around the academic calendar, and plants plan around shutdown windows. The best time to be on a facility team's list is before that planning happens, not when the equipment fails.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    solutionServiceJsonLd(page, "Facility manager outreach for commercial HVAC contractors"),
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

export default function FacilityManagerOutreachPage() {
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
        eyebrow="Who we reach: facility teams"
        intro={
          <>
            <p className="text-ink">
              Facility manager outreach is contacting the in-house teams that run an
              organization&rsquo;s own buildings — plants, warehouses, schools, clinics, campuses —
              and offering the HVAC work they do not keep in-house. {brandName} does this for you,
              in your name.
            </p>
            <p>
              A facility team is a different buyer from a property manager. It works for the
              organization that occupies the building. It often has technicians of its own. It buys
              outside help for the jobs its people cannot do, or cannot fit in.
            </p>
            <p>
              This page covers which facility teams buy outside HVAC help, who to contact, when
              they plan, where to find them, and what a first email should say.
            </p>
          </>
        }
      >
        <GuideSection id="why" title="Which facility teams buy outside HVAC help">
          <KeyAnswer>
            Facility teams usually bring in an outside HVAC contractor in four situations:
            specialist equipment their technicians do not service, overflow when the team is
            stretched, cover outside working hours, and planned projects such as a replacement
            that needs a crew and a schedule.
          </KeyAnswer>
          <p>The organizations that run their own facility teams include:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Manufacturers and distribution centers</span>, where
              process cooling, make-up air and large rooftop equipment keep the operation running.
            </li>
            <li>
              <span className="text-ink">Private schools and colleges</span>, where bigger jobs are
              planned around the academic calendar.
            </li>
            <li>
              <span className="text-ink">Healthcare practices and clinics</span>, where comfort and
              air quality matter to patients and downtime is hard to schedule.
            </li>
            <li>
              <span className="text-ink">Multi-site operators</span> — restaurant groups, retail
              chains, hotels — that need the same standard of service at every location.
            </li>
            <li>
              <span className="text-ink">Companies that own the offices they work in</span>, where
              an operations lead often looks after the building alongside other duties.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="who" title="Who to contact on a facility team">
          <ul className="list-disc space-y-2 pl-5">
            <li>The facility manager or the director of facilities.</li>
            <li>A plant engineer or maintenance manager at a manufacturing site.</li>
            <li>The operations manager at a smaller site with no facility department.</li>
            <li>A regional facilities manager at a multi-site operator.</li>
          </ul>
          <p>
            Write to the person who owns the building systems. Purchasing and accounts payable set
            up vendors; they rarely decide which contractor a facility team wants.
          </p>
        </GuideSection>

        <GuideSection id="timing" title="When facility teams plan HVAC work">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">The budget cycle.</span> Replacements and larger projects
              are usually planned in the organization&rsquo;s budget, often months before the work.
            </li>
            <li>
              <span className="text-ink">Shutdown windows.</span> Plants schedule maintenance
              shutdowns, and schools use the summer and the breaks.
            </li>
            <li>
              <span className="text-ink">Growth.</span> A new building, an addition or a new line
              changes what the site needs and who maintains it.
            </li>
          </ul>
          <p>
            Equipment age matters too, but only the facility team can see it. An email that
            guesses at the age or condition of a site&rsquo;s equipment is a claim you cannot back
            up.
          </p>
          <p>
            Each of those moments has to be visible in a public, dated record before it is a reason
            to write — which ones qualify, and how long each stays fresh, is set out in{" "}
            <Link href="/commercial-hvac-prospecting-triggers" className="text-accent underline underline-offset-4">
              commercial HVAC prospecting triggers
            </Link>
            . Where the goal is the planned-maintenance line of the budget rather than a single
            project, the sequence is on{" "}
            <Link href="/commercial-hvac-maintenance-contracts" className="text-accent underline underline-offset-4">
              commercial HVAC maintenance contracts
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="sources" title="Where to find facility teams: public sources with a date on them">
          <GuideTable
            caption="Public sources for finding facility teams, what each tells you, and what to check before using it"
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

        <GuideSection id="first-email" title="What a first email to a facility manager should say">
          <KeyAnswer>
            Name the site and the dated reason you are writing. Say which of the four openings your
            company fills — specialist equipment, overflow, after-hours cover or a planned project.
            Offer to be on file before the next budget or shutdown, and ask one easy question.
          </KeyAnswer>
          <ExampleEmail
            label="Example: a first email to a facility manager"
            subject="HVAC support for the [town] site"
            body={[
              "Hi [first name],",
              "I read in [source] that [organization] is adding [a second building] at the [town] site this [season].",
              "We work alongside in-house teams on [equipment type], and we cover calls after hours when your technicians are off shift. If it would help to have us on file before [your next budget or shutdown], I can send a one-page summary of what we cover. Would that be useful?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "If you would rather not hear from us, reply and say so, and we will not write again.",
            ]}
          />
          <p>
            Every bracket is filled in only with something true, and anything the email offers is
            your team&rsquo;s to deliver. The rules for subject lines, follow-ups and the law are in{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              what to send a property or facility manager
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="how-we-run-it" title="How we run facility manager outreach for you">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="text-ink">You choose the openings.</span> Which equipment you want
              more of, whether you offer after-hours cover, the site types and the service area. You
              approve them, and the claims we may make, before anything is sent.
            </li>
            <li>
              <span className="text-ink">We research the sites.</span> Organizations with their own
              facility teams in your area, each with the named person responsible for the building
              systems, a dated reason and the source link.
            </li>
            <li>
              <span className="text-ink">We write and send in your name.</span> From your own
              mailbox, one site at a time, timed to the reason rather than to a blast.
            </li>
            <li>
              <span className="text-ink">We hand over at the point your plan sets.</span> Your team
              does the site assessment, the scope, the proposal, the price and the close.
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
            shows where each plan hands over. To see the research on your own market first, the{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free commercial HVAC pipeline audit
            </Link>{" "}
            is delivered in writing.
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
