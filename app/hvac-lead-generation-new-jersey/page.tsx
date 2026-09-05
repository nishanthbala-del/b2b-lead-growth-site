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
      "Lead sellers charge per homeowner inquiry. A retainer service like ours charges a flat monthly fee to work demand that belongs only to you: past customers, unclosed estimates, lapsed maintenance plans, and local referral partners. On shared marketplaces the same inquiry can go to up to five competing pros (Angi's own published number). Neither model is automatically right. The deciding test is cost per booked job in your own numbers.",
  },
  {
    question: "Do you sell HVAC leads?",
    answer:
      "No — B2B Lead Growth sells no leads at all, shared or exclusive. We are a flat-fee research and outreach service. We work the demand you already generated (unsold estimates, lapsed maintenance agreements, past customers) and research referral partners in your service area. We never cold-scrape homeowners, and we do not promise you a number of jobs.",
  },
  {
    question: "What does the free audit contain for an HVAC contractor?",
    answer:
      "What we can honestly build from public data before you share anything: a sharpened picture of your best-fit demand, 3–5 individually vetted local referral-partner prospects — realtors, property managers, builders, complementary trades — each with a cited reason they're worth contacting, and one sample outreach message. We can't see your estimate list before you hire us, and we never cold-scrape homeowners — so the audit works the parts that are public. Your own unsold estimates and lapsed agreements only enter the picture once you're a client and have approved that export.",
  },
  {
    question: "Will you work for my competitor down the road?",
    answer:
      "Not while you are a client. A conflict check runs before we accept any engagement, and we work one client per niche per territory. We will not take on a competing shop in your service area while we work for you. Get that scope written into your agreement before you sign, rather than relying on this page.",
  },
  {
    question: "Why do you focus on New Jersey?",
    answer:
      "Because we're based here and one niche done well beats five done thinly. Established residential HVAC companies in New Jersey are our active focus, so the research, seasonal timing, and market context in our work is NJ-specific rather than templated across all fifty states.",
  },
  {
    question: "Do you guarantee a number of leads or booked jobs?",
    answer:
      "No. We do not guarantee a number of leads or booked jobs, and you should treat any vendor's guarantee with suspicion. We sell defined activity: researched prospects, personalized outreach, follow-up, and booking on the tiers that include it, reported with verified numbers. Outcomes depend on your market, pricing, reputation, and speed to answer, which no vendor controls.",
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
      serviceType: "HVAC Lead Generation and Appointment Setting",
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
        name: "Established residential HVAC companies",
        audienceType: "Residential HVAC contractors with existing customer history",
      },
      serviceOutput: [
        { "@type": "Thing", name: "Reactivation list built from the client's own customer records" },
        { "@type": "Thing", name: "Researched referral-partner prospects, each with a cited public source" },
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
              A fourth option carries no per-lead fee at all: the estimates, past customers and
              lapsed maintenance plans already in your system. This page prices all four, with
              sources.
            </p>
            <p>
              We are {brandName}, a New Jersey lead generation company for established residential
              HVAC companies. We sell the fourth option. We would rather show you the whole map
              than pretend the other three do not exist.
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
                <span key="own" className="font-semibold text-ink">Demand you already own</span>,
                "No per-lead fee — past customers, unclosed estimates, lapsed maintenance plans, referral partners.",
                "Requires consistent follow-up nobody in a busy shop has time to run. That gap is the actual product we sell.",
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

        <GuideSection title="The demand you already paid for: unsold estimates and lapsed agreements">
          <KeyAnswer>
            The cheapest demand in your shop is demand you already paid for: unsold estimates, past
            customers whose systems are old enough to replace, maintenance plans that quietly
            lapsed, and the realtors and property managers who could be sending referrals. None of
            it carries a per-lead fee. A shared marketplace lead is matched with up to five pros,
            per Angi&rsquo;s own help center; these contacts are sold to nobody but you. What it
            takes is consistent research and follow-up, which a busy shop rarely has time to staff.
          </KeyAnswer>
          <p>
            That gap is what we sell. For an HVAC client we work the audience the shop already owns
            and the referral relationships around it. We pick which past customers and open
            estimates are worth a touch, each with a cited reason. We draft the personalized
            outreach and run the follow-up cadence. On the top tier we qualify interested replies
            and book them onto your calendar. We never cold-scrape homeowners, and every prospect
            record we hand you shows its source.
          </p>
        </GuideSection>

        <GuideSection title="Why NJ-first matters">
          <p>
            Lead generation templated across fifty states misses what a local shop competes on:
            replacement season, shoulder-season maintenance timing, which towns a service area
            really covers, and which local partners matter. Working New Jersey first, starting with
            residential HVAC, keeps the research behind every prospect specific and checkable. One
            niche done well beats five done thinly.
          </p>
        </GuideSection>

        <GuideSection title="What working with us looks like">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-semibold text-ink">Free pipeline audit first.</span> A
              sharpened profile of the jobs worth chasing, 3–5 real referral partners in your
              service area, individually vetted, each with a cited public reason, and one sample
              message. Yours to keep, before any decision. See{" "}
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
            caps how many <em>contacts we work per month</em>. Those contacts are a mix of two
            things: referral-partner prospects we research and cite from public sources, and people
            from lists you give us, such as past customers, unclosed estimates, and lapsed
            maintenance plans. The tier decides how much you hand over, not which of the two we
            work.
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
                "About 40 prospects per batch",
                "You do. We prepare the researched list, the messaging and the scripts.",
              ],
              [
                <span key="t1500" className="font-semibold text-ink">$1,500</span>,
                "About 100 outreach messages, follow-ups included (roughly 33 prospects)",
                "We do. We run the outreach and the follow-up sequence.",
              ],
              [
                <span key="t2500" className="font-semibold text-ink">$2,500</span>,
                "About 150 outreach messages, follow-ups included (roughly 50 prospects)",
                "We do, and we qualify the interested replies and book the calls.",
              ],
            ]}
          />
          <p>
            Referral partners are realtors, property managers, builders and complementary trades,
            researched from public sources. Your own customer and estimate data we can only work
            once you are a client and you share it — which is why the free audit covers the public
            half and hands you the method for the rest.
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
