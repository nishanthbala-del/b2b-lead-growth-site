import type { Metadata } from "next";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl, brandName, orgDescription } from "@/lib/site";
import { faqSlug } from "@/lib/content";

const page = getGuidePage("hvac-lead-generation-new-jersey");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "How much do HVAC leads cost in New Jersey?",
    answer:
      "It depends on the channel. As of August 2026: 99Calls advertised exclusive NJ HVAC leads at $54.99 per lead; Angi publishes no dollar figures (its docs say fees vary by task, location, and demand), while third-party estimates such as Housecall Pro's guide put typical Angi leads at $15–$85 per lead; Google Local Services Ads charge per valid lead at prices Google says vary by location, job type, and lead type.",
  },
  {
    question: "What's the difference between buying leads and hiring a lead generation service?",
    answer:
      "Lead sellers charge per homeowner inquiry. A retainer service like ours charges a flat monthly fee to research and contact commercial accounts on your behalf — property managers, building owners, facility teams, multi-site operators — that no marketplace sells at all. On shared marketplaces the same inquiry can go to up to five competing pros (Angi's own published number). Neither model is automatically right. The deciding test is cost per booked job in your own numbers.",
  },
  {
    question: "Do you sell HVAC leads?",
    answer:
      "No — B2B Lead Growth sells no leads at all, shared or exclusive. We are a flat-fee research and outreach service for HVAC contractors that already do commercial work. We research the commercial accounts in your service area from public sources, write to the right person at each in your name, and handle the follow-up. We never contact homeowners, and we do not promise you a number of jobs.",
  },
  {
    question: "What does the free audit contain for an HVAC contractor?",
    answer:
      "What we can honestly build from public data before you share anything: a profile of the commercial accounts worth pursuing for your shop, 3–5 individually vetted commercial accounts in your service area — property managers, building owners, facility teams — each with a named contact, a cited reason they're worth contacting and a source link, and one sample outreach message. It contains no homeowner records, because we never contact homeowners. Your own past accounts and old proposals only enter the picture once you're a client, and only if you choose to send them.",
  },
  {
    question: "Will you work for my competitor down the road?",
    answer:
      "Not while you are a client. A conflict check runs before we accept any engagement, and we work one client per niche per territory. We will not take on a competing shop in your service area while we work for you. Get that scope written into your agreement before you sign, rather than relying on this page.",
  },
  {
    question: "Why do you focus on New Jersey?",
    answer:
      "Because we're based here and one niche done well beats five done thinly. Established HVAC contractors with commercial work in New Jersey are our active focus, so the account research, seasonal timing, and market context in our work is NJ-specific rather than templated across all fifty states.",
  },
  {
    question: "Do you guarantee a number of leads or booked jobs?",
    answer:
      "No. We do not guarantee a number of leads or booked jobs, and you should treat any vendor's guarantee with suspicion. We sell defined activity: researched commercial accounts, personalized outreach, follow-up, and booking on the tiers that include it, reported with verified numbers. Outcomes depend on your market, pricing, references, and speed to answer, which no vendor controls.",
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
    {
      "@type": "Service",
      "@id": `${siteUrl}/${page.slug}#service`,
      name: `${brandName} — HVAC Lead Generation`,
      url: `${siteUrl}/${page.slug}`,
      description: orgDescription,
      serviceType: "Commercial HVAC Lead Generation and Appointment Setting",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: {
        "@type": "State",
        name: "New Jersey",
      },
      // Kept in sync with the audience/serviceOutput shape in lib/pages.ts's
      // serviceJsonLd() (see its comment) — this page needs its own @id (NJ-scoped
      // areaServed differs from the sitewide node), not different facts under it.
      audience: {
        "@type": "BusinessAudience",
        name: "Established HVAC contractors with commercial work",
        audienceType:
          "HVAC contractors that already sell and complete commercial work, have someone who quotes and wins those bids, and have room for more accounts",
      },
      serviceOutput: [
        {
          "@type": "Thing",
          name: "Researched commercial account list — property and facility managers, building owners, multi-site operators — each with a named contact, a cited reason and a public source link",
        },
        {
          "@type": "Thing",
          name: "Managed outreach and follow-up sent in the contractor's name, from the contractor's own mailbox",
        },
        {
          "@type": "Thing",
          name: "Qualified conversations handed off to the contractor's team, measured as qualified conversations started",
        },
        {
          "@type": "Thing",
          name: "Optional: the contractor's own account history (past accounts, unaccepted proposals, lapsed service agreements) cleaned, ranked and worked — only when the contractor exports and approves it",
        },
      ],
    },
  ],
};

export default function HvacNjPage() {
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
        eyebrow="New Jersey · HVAC"
        h1="HVAC lead generation in New Jersey: what leads cost"
        intro={
          <>
            {/* Answer-first. This paragraph is the passage an answer engine quotes, so it
                carries the prices and their attributions in under 40 words and has to make
                sense lifted out of the page. Every figure in it is repeated with its full
                source in the channel table below — nothing is asserted only here. */}
            <p className="text-ink">
              HVAC leads in New Jersey cost $54.99 per exclusive lead (99Calls) and roughly
              $15–$85 per shared Angi lead (a third-party estimate), with Google Local Services
              Ads priced per valid lead at rates Google says vary. Checked August 2026.
            </p>
            <p>
              A fourth option carries no per-lead fee at all, and no marketplace sells it: the
              commercial accounts in your area — property managers, building owners, facility
              teams — researched and written to directly. This page prices all four, with sources.
            </p>
            <p>
              We are {brandName}, a New Jersey lead generation company for established HVAC
              contractors that already do commercial work. We sell the fourth option. We would
              rather show you the whole map than pretend the other three do not exist.
            </p>
          </>
        }
      >
        <GuideSection title="What HVAC leads cost in NJ, by channel">
          <GuideTable
            caption="HVAC lead cost by channel for New Jersey contractors, with sources, checked August 2026"
            head={["Channel", "Published cost", "The catch to price in"]}
            rows={[
              [
                <span key="angi" className="font-semibold text-ink">Angi / shared marketplaces</span>,
                "Angi publishes no dollar figures — fees “change based on task, homeowner location, and demand.” Third-party estimate (Housecall Pro): $15–$85 per lead.",
                "Angi's own docs: each request matched with up to five pros. HomeAdvisor's pro-facing docs go further — you pay for a connected lead whether or not you win the job.",
              ],
              [
                <span key="excl" className="font-semibold text-ink">Exclusive per-lead sellers</span>,
                "99Calls advertised exclusive NJ HVAC leads at a $54.99 flat rate (organic-SEO leads, checked Aug 2026).",
                "Higher per-lead price; volume depends on the seller's local presence. Verify exclusivity in writing.",
              ],
              [
                <span key="lsa" className="font-semibold text-ink">Google Local Services Ads</span>,
                "Pay per valid lead (calls/messages, not clicks); Google says prices vary by location, job type, and lead type.",
                "Requires passing Google's screening and verification; competitive NJ metros bid up lead prices.",
              ],
              [
                <span key="own" className="font-semibold text-ink">Commercial accounts, researched and contacted directly</span>,
                "No per-lead fee — property managers, building owners, facility teams, multi-site operators and referral partners, found from public sources with a cited reason each. Commercial only; homeowners are never contacted.",
                "Requires research and consistent follow-up nobody in a busy shop has time to run. That gap is the actual product we sell.",
              ],
            ]}
          />
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
            ·{" "}
            <a
              href="https://www.housecallpro.com/resources/what-is-angis-list-how-angi-works/"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Housecall Pro Angi cost guide (Feb 2026, third-party estimate)
            </a>{" "}
            ·{" "}
            <a
              href="https://99calls.com/locations/New-Jersey/HVAC-Leads.htm"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              99Calls New Jersey HVAC leads
            </a>{" "}
            ·{" "}
            <a
              href="https://support.google.com/localservices/answer/7195435"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Google Local Services Ads documentation
            </a>
            . All prices belong to their sellers and change; checked August 7, 2026. For the full
            shared-vs-exclusive arithmetic, see{" "}
            <a
              href="/shared-vs-exclusive-hvac-leads"
              className="text-accent underline underline-offset-4"
            >
              our cost-per-job breakdown
            </a>
            .
          </SourceNote>
        </GuideSection>

        <GuideSection title="The fourth option: commercial accounts nobody is selling you">
          <KeyAnswer>
            The commercial accounts an HVAC contractor wants — property managers, building
            owners, facility teams, multi-site operators — never appear on a lead marketplace. A
            homeowner fills in a form when the furnace dies; a facilities director calls whoever
            already holds the account. No per-lead channel reaches them, so nobody is selling
            them to four other shops either. Reaching them takes research and consistent
            follow-up, which a busy shop rarely has time to staff.
          </KeyAnswer>
          <p>
            That gap is what we sell. For an HVAC contractor that already does commercial work we
            research the accounts in your area that fit the categories you approve, name the right
            person at each, and write to them in your name with a cited reason. We run the
            follow-up cadence. On the top tier we qualify interested replies and book them onto
            your calendar. We never contact homeowners, and every account we hand you shows its
            source. If you also have past accounts or old proposals to send, we work those as an
            optional second lane.
          </p>
        </GuideSection>

        <GuideSection title="Why NJ-first matters">
          <p>
            Lead generation templated across fifty states misses what a local shop competes on:
            which property managers hold which portfolios, replacement season, shoulder-season
            maintenance timing, which towns a service area really covers, and which general
            contractors place work. Working New Jersey first, starting with HVAC contractors that
            do commercial work, keeps the research behind every account specific and checkable.
            One niche done well beats five done thinly.
          </p>
        </GuideSection>

        <GuideSection title="What working with us looks like">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-semibold text-ink">Free pipeline audit first.</span> A
              profile of the commercial accounts worth pursuing, 3–5 real commercial accounts in
              your service area, individually vetted, each with a named contact, a cited public
              reason and a source link, and one sample message. Yours to keep, before any
              decision. See{" "}
              <a href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
                what the free HVAC pipeline audit includes
              </a>
              .
            </li>
            <li>
              <span className="font-semibold text-ink">Flat monthly fee if you continue.</span>{" "}
              $750, $1,500, or $2,500 per month, depending on how much you hand off. No setup fee,
              month-to-month, and you keep the work we produced for you if you leave. See{" "}
              <a href="/pricing" className="text-accent underline underline-offset-4">
                our published HVAC lead generation pricing
              </a>
              .
            </li>
            <li>
              <span className="font-semibold text-ink">Verified reporting.</span> Real numbers
              only, never projections. Where we run the outreach, that means what was contacted and
              what came back. At $750 we hand over the researched list and the scripts and you run
              the sending, so the response data is yours. You own the live calls and the close at
              every tier.
            </li>
          </ol>
          <p>
            <span className="text-ink">How the tiers translate for a contractor.</span> Each tier
            caps how many <em>accounts we work per month</em>. Those accounts are the businesses we
            research and cite from public sources — property managers, building owners, facility
            teams, multi-site operators, and the referral partners around them — plus, if you
            choose to send it, your own account history: past accounts, proposals that were never
            accepted, lapsed service agreements. The tier decides how much you hand over, not
            which of the two we work.
          </p>
          {/* A table, not the 144-word paragraph this replaces: fee, ceiling and who sends are
              three attributes of three tiers, which is a grid. The prices and the ~40/100/150
              ceilings are the same ones published on /pricing — this is a summary that links
              there, never a second price list. */}
          <GuideTable
            caption="What each monthly tier covers for a New Jersey HVAC contractor"
            head={["Monthly fee", "Volume per month", "Who runs the sending"]}
            rows={[
              [
                <span key="t750" className="font-semibold text-ink">$750</span>,
                "About 40 researched, cited commercial accounts per batch",
                "You do. We prepare the researched account list, the messaging and the scripts.",
              ],
              [
                <span key="t1500" className="font-semibold text-ink">$1,500</span>,
                "About 100 outreach messages, follow-ups included (roughly 33 accounts)",
                "We do. We write and send the emails and run the follow-up sequence.",
              ],
              [
                <span key="t2500" className="font-semibold text-ink">$2,500</span>,
                "About 150 outreach messages, follow-ups included (roughly 50 accounts)",
                "We do, and we qualify the interested replies and book the conversations.",
              ],
            ]}
          />
          <p>
            Every account is a business, researched from public sources and cited. Homeowners are
            never contacted. Your own account history we can only work once you are a client and
            you choose to share it — which is why the free audit covers the public half, and the
            paid tiers run whether or not you have anything to send.
          </p>
        </GuideSection>

        <GuideSection title="Common questions">
          <p>
            Ask these of any vendor, not only us. The longer checklist is in{" "}
            <a
              href="/how-to-choose-a-lead-generation-agency"
              className="text-accent underline underline-offset-4"
            >
              the seven questions to ask an HVAC lead generation company
            </a>
            .
          </p>
          {/* id + scroll-mt on every answer. The FAQPage markup above publishes the same
              fragment as each Question's url, so a specific answer is citable and linkable.
              faqSlug() is the shared slug rule the homepage already uses; the guide pages
              were the half that rendered the answers with no anchor at all. */}
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
