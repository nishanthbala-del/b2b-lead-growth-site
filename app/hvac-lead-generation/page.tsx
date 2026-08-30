import type { Metadata } from "next";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl, brandName } from "@/lib/site";

const page = getGuidePage("hvac-lead-generation");

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
      "It depends on the channel. As of August 2026: 99Calls advertised exclusive NJ HVAC leads at $54.99 per lead; Angi publishes no dollar figures (its docs say fees vary by task, location, and demand), while third-party estimates such as Housecall Pro's 2026 guide put typical Angi leads at roughly $15–$85 with high-value trades over $100; Google Local Services Ads charge per valid lead at prices Google says vary by location, job type, and lead type.",
  },
  {
    question: "What's the difference between buying leads and hiring a lead generation service?",
    answer:
      "Lead sellers charge per homeowner inquiry, and on shared marketplaces the same inquiry can go to up to five competing pros (Angi's own published number). A retainer service like ours charges a flat monthly fee to work demand that belongs only to you — your past customers, unclosed estimates, lapsed maintenance plans, and local referral partners. Neither is automatically right; the deciding test is cost per booked job in your own numbers.",
  },
  {
    question: "Do you sell HVAC leads?",
    answer:
      "No. We don't sell leads at all — shared or exclusive. We're a flat-fee research and outreach service: we work the demand you have already generated — unsold estimates, lapsed maintenance agreements, past customers — and research referral partners in your service area. We never cold-scrape homeowners, and we don't promise you a number of jobs.",
  },
  {
    question: "What does the free audit contain for an HVAC contractor?",
    answer:
      "What we can honestly build from public data before you share anything: a sharpened picture of your best-fit demand, 3–5 individually vetted local referral-partner prospects — realtors, property managers, builders, complementary trades — each with a cited reason they're worth contacting, one sample outreach message, and a reactivation framework you can apply to your own past customers and open estimates. We can't see your estimate list before you hire us, and we never cold-scrape homeowners — so the audit works the parts that are public and hands you the method for the part that isn't.",
  },
  {
    question: "Will you work for my competitor down the road?",
    answer:
      "Not while you're a client. A conflict check runs before we accept any engagement, and we work one client per niche per territory — we won't take on a competing shop in your service area while we're working for you. Get the scope you want written into your agreement before you sign rather than relying on this page: after being shared with up to five competitors on a lead marketplace, exclusivity is exactly the thing to pin down in writing.",
  },
  {
    question: "Why do you focus on New Jersey?",
    answer:
      "Because we're based here and one niche done well beats five done thinly. New Jersey home-service contractors — starting with residential HVAC — are our active focus, so the research, seasonal timing, and market context in our work is NJ-specific rather than templated across all fifty states.",
  },
  {
    question: "Do you guarantee a number of leads or booked jobs?",
    answer:
      "No, and you should treat any vendor's guarantee with suspicion. We sell defined activity — researched prospects, personalized outreach, follow-up, and booking on the tiers that include it — reported with verified numbers. Outcomes depend on your market, pricing, reputation, and speed to answer, which no vendor controls.",
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
      serviceType: "Lead generation for HVAC contractors",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: {
        "@type": "State",
        name: "New Jersey",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Residential HVAC contractors and home-service businesses",
      },
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
        h1="HVAC lead generation in New Jersey: what leads cost, and the options nobody itemizes"
        intro={
          <>
            <p>
              A New Jersey HVAC contractor buying leads today picks between shared marketplaces
              (Angi and similar — one homeowner request sold to up to five pros), exclusive per-lead
              sellers (99Calls advertised NJ HVAC leads at $54.99 each as of August 2026), Google
              Local Services Ads (pay per valid lead, price varies by market), or flat-fee services
              that work demand you already own. This page itemizes all four with sources — including
              the one most contractors already paid for and aren&rsquo;t using.
            </p>
            <p>
              We&rsquo;re {brandName}, a NJ-first lead generation shop for established
              residential HVAC companies. We sell the fourth option, we&rsquo;re new, and
              we&rsquo;d rather show you the whole map honestly than pretend the other three
              don&rsquo;t exist.
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
                <span key="angi" className="font-semibold text-bone">Angi / shared marketplaces</span>,
                "Angi publishes no dollar figures — fees “change based on task, homeowner location, and demand.” Third-party estimate (Housecall Pro, Feb 2026): ~$15–$85/lead, $100+ for high-value trades.",
                "Angi's own docs: each request matched with up to five pros. HomeAdvisor's pro-facing docs go further — you pay for a connected lead whether or not you win the job.",
              ],
              [
                <span key="excl" className="font-semibold text-bone">Exclusive per-lead sellers</span>,
                "99Calls advertised exclusive NJ HVAC leads at a $54.99 flat rate (organic-SEO leads, checked Aug 2026).",
                "Higher per-lead price; volume depends on the seller's local presence. Verify exclusivity in writing.",
              ],
              [
                <span key="lsa" className="font-semibold text-bone">Google Local Services Ads</span>,
                "Pay per valid lead (calls/messages, not clicks); Google says prices vary by location, job type, and lead type.",
                "Requires passing Google's screening and verification; competitive NJ metros bid up lead prices.",
              ],
              [
                <span key="own" className="font-semibold text-bone">Demand you already own</span>,
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
              className="text-gold-200 underline underline-offset-4"
            >
              Angi Help Center
            </a>{" "}
            ·{" "}
            <a
              href="https://www.housecallpro.com/resources/what-is-angis-list-how-angi-works/"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              Housecall Pro Angi cost guide (Feb 2026, third-party estimate)
            </a>{" "}
            ·{" "}
            <a
              href="https://99calls.com/locations/New-Jersey/HVAC-Leads.htm"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              99Calls New Jersey HVAC leads
            </a>{" "}
            ·{" "}
            <a
              href="https://support.google.com/localservices/answer/7195435"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              Google Local Services Ads documentation
            </a>
            . All prices belong to their sellers and change; checked August 7, 2026. For the full
            shared-vs-exclusive arithmetic, see{" "}
            <a
              href="/shared-vs-exclusive-hvac-leads"
              className="text-gold-200 underline underline-offset-4"
            >
              our cost-per-job breakdown
            </a>
            .
          </SourceNote>
        </GuideSection>

        <GuideSection title="The demand you already paid for">
          <KeyAnswer>
            Before buying a single lead, look at the demand your shop already generated: estimates
            that never closed, past customers whose systems are old enough to be replacement
            candidates, maintenance plans that quietly lapsed, and the realtors and property
            managers who could be sending referrals. None of it carries a per-lead fee, and unlike
            a shared marketplace lead — matched with up to five pros, per Angi&rsquo;s own help
            center — nobody else is being sold the same contact. What it does take is consistent
            research and follow-up, which is the part a busy shop rarely has time to staff.
          </KeyAnswer>
          <p>
            That is the specific gap we sell into. For an HVAC client we work the audience the shop
            already owns and the referral relationships around it: identifying which past
            customers and open estimates are worth a touch and why (each with a cited reason),
            drafting the personalized outreach, running the follow-up cadence, and — on the top
            tier — qualifying interested replies and booking them onto your calendar. We never
            cold-scrape homeowners, and every prospect record we hand you shows its source.
          </p>
        </GuideSection>

        <GuideSection title="Why NJ-first matters">
          <p>
            Lead generation templated across fifty states misses what a local shop actually
            competes on: seasonal timing (replacement season, shoulder-season maintenance pushes),
            which towns a service area really covers, and which local partners matter. Working NJ
            first — starting with residential HVAC — means the research behind every prospect is
            specific, checkable, and close to home. One niche done well beats five done thinly;
            that focus is a deliberate choice, not a limitation we hide.
          </p>
        </GuideSection>

        <GuideSection title="What working with us looks like">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-semibold text-bone">Free pipeline audit first.</span> A
              sharpened profile of the jobs worth chasing plus 3–5 real referral partners in your
              service area, individually vetted, each with a cited public reason, and one sample
              message —{" "}
              <a href="/free-pipeline-audit" className="text-gold-200 underline underline-offset-4">
                yours to keep, free
              </a>
              , before any decision.
            </li>
            <li>
              <span className="font-semibold text-bone">Flat monthly fee if you continue.</span>{" "}
              $750, $1,500, or $2,500 per month depending on how much you hand off —{" "}
              <a href="/pricing" className="text-gold-200 underline underline-offset-4">
                published in full here
              </a>
              . No setup fee, month-to-month, and you keep the work we produced for you if you
              leave.
            </li>
            <li>
              <span className="font-semibold text-bone">Verified reporting.</span> Real numbers only,
              never projections. On the tiers where we run the outreach, that means what was
              contacted and what came back; at $750 we hand over the researched list and the
              scripts and you run the sending, so the response data is yours. You own the live
              calls and the close at every tier.
            </li>
          </ol>
          <p>
            <span className="text-bone">How the tiers translate for a contractor.</span> The
            published tiers cap how many <em>contacts we work per month</em> — roughly 40, 100, or
            150 — and for an HVAC shop those contacts are a mix of two things: referral-partner
            prospects we research and cite from public sources (realtors, property managers,
            builders, complementary trades), and people from lists you give us, such as past
            customers, unclosed estimates, and lapsed maintenance plans. The tier decides how much
            you hand over, not which of those two we work: $750 means we prepare the list and
            messaging and you send; $1,500 means we run the outreach and follow-up; $2,500 adds
            qualifying the replies and booking the calls. We can only work your own customer and
            estimate data once you are a client and you share it — which is why the free audit
            covers the public half and hands you the method for the rest.
          </p>
        </GuideSection>

        <GuideSection title="Common questions">
          <div className="divide-y divide-gold-500/12 border-y border-gold-500/12">
            {pageFaqs.map((f) => (
              <div key={f.question} className="py-5">
                <h3 className="text-lg font-semibold text-bone">{f.question}</h3>
                <p className="mt-2 leading-7">{f.answer}</p>
              </div>
            ))}
          </div>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
