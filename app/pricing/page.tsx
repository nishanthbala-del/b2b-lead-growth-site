import type { Metadata } from "next";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { plans, serviceTimeline, serviceTimelineDisclaimer } from "@/lib/content";
import { getGuidePage, guideJsonLd } from "@/lib/pages";
import { siteUrl, brandName, orgDescription } from "@/lib/site";

const page = getGuidePage("pricing");

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: page.metaTitle,
    description: page.description,
    type: "article",
    url: `/${page.slug}`,
  },
};

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "How much does HVAC appointment setting cost in 2026?",
    answer:
      "Published pricing guides we checked in August 2026 put typical agency retainers between roughly $2,000 and $10,000+ per month — Belkins' 2024 guide cites basic retainers around $2,000/month and comprehensive programs at $5,000–$10,000, and SalesBread's 2025 guide lists $2,000–$5,000 retainers — with pay-per-appointment rates from about $50 to $500 per booked meeting. B2B Lead Growth charges a flat $750, $1,500, or $2,500 per month with no setup fee.",
  },
  {
    question: "Is $750 per month enough for real lead generation?",
    answer:
      "It buys a defined, capacity-limited slice of work: an agreed job profile, your own history cleaned and ranked, and up to ~40 individually researched, cited records per month with scripts to work them — you make the calls and send the emails. It does not buy done-for-you sending, and no tier at any price honestly buys guaranteed jobs. If you need someone to run the outreach for you, that is the $1,500 tier.",
  },
  {
    question: "Are there hidden fees, setup costs, or long contracts?",
    answer:
      "No. Every tier is month-to-month with 14 days' notice either side, there is no setup fee, no early-termination fee, and no required tool add-ons. Prices are in US dollars and exclude any applicable tax. If you leave, you keep everything we built — the lists, the scripts, and the trackers.",
  },
  {
    question: "How does billing work, and can I get a refund?",
    answer:
      "The flat monthly fee is billed in advance and renews monthly until you cancel. Cancel any time on 14 days' written notice by email. The current month is non-refundable and is not prorated, because the fee is earned as that month's work is performed; if we have not started work on a period, we refund it in full. We do not refund on the basis that a result did not occur, because we never promise a result. If a prospect we delivered fails our own cited-source verification standard, we replace it at no charge within the same month. The full policy is in our Terms of Service.",
  },
  {
    question: "Why is your pricing lower than the typical retainers you cite?",
    answer:
      "Three reasons: the work is capacity-limited (each tier caps monthly volume, and we deliberately cap how many clients we take on), the process is email-first with no paid-ad management and no call centre, and we are a new company earning a track record in public. Lower price buys smaller volume with the same research standard — it does not buy a discount on quality, and it never buys guaranteed outcomes.",
  },
  {
    question: "What do the tiers exclude?",
    answer:
      "Lead Engine excludes the outreach — you send. Outreach Engine excludes the sales conversation — you take it. Appointment Engine excludes the in-home visit, the quote, and the close. No tier includes guaranteed reply volume, appointment counts, or revenue, and no tier includes homeowner lead sourcing, because we do not do that at any price. You always own your pricing, your sending identity, and the customer relationship.",
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
    // Same Service entity as the homepage, built from the same plans array, so
    // machine-readable pricing stays consistent everywhere it appears.
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: brandName,
      url: siteUrl,
      description: orgDescription,
      serviceType: "B2B Lead Generation Services",
      areaServed: "United States",
      provider: { "@id": `${siteUrl}/#organization` },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.volume,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(p.price),
          priceCurrency: "USD",
          unitText: "MONTH",
        },
      })),
    },
  ],
};

export default function PricingPage() {
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
        eyebrow="Pricing"
        h1="HVAC lead generation pricing: $750, $1,500, or $2,500 per month — published, flat, never per lead"
        intro={
          <>
            <p>
              B2B Lead Growth charges established HVAC companies a flat monthly fee:{" "}
              <span className="text-bone">$750</span> for Lead Engine (your list built and ranked —
              you do the outreach), <span className="text-bone">$1,500</span> for Outreach Engine
              (we run personalized outreach — you answer the interested replies), or{" "}
              <span className="text-bone">$2,500</span> for Appointment Engine (qualified
              appointments booked on your calendar). No setup fee, month-to-month with 14
              days&rsquo; notice, and you keep everything we build if you leave. All prices are in
              US dollars and exclude any applicable tax.
            </p>
            <p>
              Nothing here is priced per lead, because we do not sell leads. You are paying for work
              done on your own customer history and your own service area — not for a name that
              three other contractors also bought.
            </p>
            <p>
              Most of the full-service agencies we checked quote pricing only on a sales call. This
              page publishes ours — and the market context to compare it against, with sources.
            </p>
          </>
        }
      >
        <GuideSection title="The three tiers">
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.name} className="rounded-lg border border-gold-500/16 bg-ink-900/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-2xl text-bone">{p.name}</p>
                  <p className="text-xl font-semibold text-gold-200">
                    ${p.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted">/mo</span>
                  </p>
                </div>
                <p className="mt-2 font-semibold text-bone/90">{p.volume}</p>
                <p className="mt-1 text-sm">{p.capacity}</p>
                <p className="mt-3 leading-7">
                  <span className="font-semibold text-gold-200/90">Includes: </span>
                  {p.includes}
                </p>
                <p className="mt-2 leading-7">
                  <span className="font-semibold text-gold-200/90">Not included — stays with you: </span>
                  {p.guardrails}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="What the market typically charges (with sources)">
          <p>
            So you can judge our pricing against the field, here is what published guides and
            pricing pages showed when we checked them on August 7, 2026:
          </p>
          <GuideTable
            caption="Published lead generation and appointment setting pricing across the market"
            head={["Source", "What it publishes", "Figures"]}
            rows={[
              [
                <a
                  key="belkins"
                  href="https://belkins.io/blog/appointment-setting-costs-pricing-models"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-gold-200 underline underline-offset-4"
                >
                  Belkins pricing guide
                </a>,
                "Market guide (Jan 2024). Belkins published no rate card when we checked in Aug 2026 — its site routes pricing to a booked call",
                "Basic retainers ~$2,000/mo; comprehensive programs $5,000–$10,000/mo; per-appointment $50–$500",
              ],
              [
                <a
                  key="salesbread"
                  href="https://salesbread.com/appointment-setting-services-cost/"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-gold-200 underline underline-offset-4"
                >
                  SalesBread cost guide
                </a>,
                "Market guide (Sept 2025)",
                "Retainers $2,000–$5,000/mo; $75–$500 per scheduled meeting",
              ],
              [
                <a
                  key="cleverly"
                  href="https://www.cleverly.co/blog/linkedin-lead-generation-cost"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-gold-200 underline underline-offset-4"
                >
                  Cleverly
                </a>,
                "Own published range (updated June 2026) — LinkedIn-only specialist",
                "LinkedIn lead-gen agencies $3,000–$25,000/mo; Cleverly's own LinkedIn plans from $397/mo",
              ],
              [
                <a
                  key="cience"
                  href="https://www.cience.com/pricing"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-gold-200 underline underline-offset-4"
                >
                  CIENCE pricing page
                </a>,
                "Own published pricing (checked Aug 2026)",
                "Managed service from $2,000/mo; its only sub-$1,000 tier is software, not service",
              ],
              [
                <a
                  key="callbox"
                  href="https://www.miniloop.ai/blog/callbox-pricing"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-gold-200 underline underline-offset-4"
                >
                  Callbox (third-party reported)
                </a>,
                "No published pricing — quote requires a consultation",
                "Third-party reviews (May 2026) report $5,000–$30,000/mo engagements",
              ],
            ]}
          />
          <SourceNote>
            Figures belong to their sources on the dates shown and change over time; the Callbox
            range is third-party reported, not Callbox-published. We link sources so you can check
            them — the same standard we apply to every prospect we hand you.
          </SourceNote>
          <KeyAnswer>
            Of the major agencies we checked in August 2026, full-service providers either
            don&rsquo;t publish pricing at all (Belkins, Callbox — both quote on a call) or start
            their managed service at $2,000/month (CIENCE). Published tiers under $1,000/month
            exist mainly at single-channel specialists, such as Cleverly&rsquo;s LinkedIn-only
            plans from $397/month. B2B Lead Growth publishes an entry tier at $750/month — a
            researched, cited prospect list you work yourself — and its done-for-you outreach tier
            at $1,500/month. Both prices come from capping monthly volume, not from cutting
            research depth.
          </KeyAnswer>
        </GuideSection>

        <GuideSection title="Why our pricing is lower — and what the lower price buys">
          <p>
            Lower price here buys <span className="text-bone">smaller volume, not lower
            standards</span>. Each tier caps monthly record volume (~40 / ~100 /
            ~150), every researched prospect is cited individually, and we deliberately cap how
            many clients we take on. We are also a new company earning a track record in public — our pricing
            reflects that instead of pretending otherwise. What lower price never buys,
            here or anywhere: guaranteed replies, appointments, jobs, or revenue. Anyone selling a guarantee
            is selling the churn math behind it.
          </p>
        </GuideSection>

        <GuideSection title="What happens after you sign, and when">
          <p>
            Day 0 is the day the agreement is signed and the first payment clears — no work
            begins before it. From there:
          </p>
          <p className="mt-3">
            <span className="text-bone">Which of these apply to you depends on your tier.</span>{" "}
            Lead Engine ends at handover: you receive the agreed job profile, your own history
            cleaned and ranked, the researched and cited partner list, and the scripts — and you run
            the sending yourself, so the mailbox, approval, warm-up, sequence and reply-triage
            phases below are not part of that tier. Outreach Engine and Appointment Engine include
            all of them.
          </p>
          <ul className="mt-4 space-y-3">
            {serviceTimeline.map((p) => (
              <li key={p.label} className="border-l-2 border-gold-200/30 pl-4">
                <span className="block text-bone">
                  {p.band} — {p.label}
                </span>
                <span className="block text-sm opacity-80">{p.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm opacity-80">{serviceTimelineDisclaimer}</p>
        </GuideSection>

        <GuideSection title="Where your prospects come from — read this before you pick a tier">
          <p>
            Two lanes, kept strictly separate, and the difference changes what you have to do.
          </p>
          <p>
            <span className="text-bone">Homeowners come from you, never from us.</span> We do not,
            and will not, cold-source your buyers. Homeowners are private individuals, and a
            homeowner list assembled by a stranger is exactly the kind of list this service exists
            as an alternative to. Instead the campaign runs on{" "}
            <span className="text-bone">demand you already own</span>: past customers, open and
            expired estimates, lapsed maintenance agreements, missed calls and prior enquiries,
            exported from your own system. We cannot research, buy or infer those records — only you
            can send them — and nothing is contacted until they are imported and you have approved
            the list.
          </p>
          <p>
            <span className="text-bone">Referral partners we do research.</span> Builders, general
            contractors, property managers, realtors, plumbers, electricians and home inspectors are
            businesses, not private individuals, so those we source from free public sources for
            you. Every record carries the public source it came from, a fit reason and a confidence
            note, and nothing without a citation can be contacted.
          </p>
          <p className="text-sm opacity-80">
            This is enforced in code, not by policy: a record claiming to come from your own
            customer base that is not in the list you approved is blocked before it can be
            contacted. It is also the step that sets your start date — the export is usually the
            longest pole, so it is worth starting it early.
          </p>
        </GuideSection>

        <GuideSection title="Billing, cancellation, and refunds">
          <p>
            The fee is flat and billed in advance, and the engagement renews monthly until you
            cancel. There is no setup fee, no minimum term, and no early-termination fee. Either
            side can cancel for any reason on 14 days&rsquo; written notice by email.
          </p>
          <p>
            On refunds we would rather be blunt than vague:{" "}
            <span className="text-bone">the current month is non-refundable and is not prorated</span>,
            because the fee is earned as that month&rsquo;s research, writing, sending, and reporting
            is performed. If we have not begun work on a period, we refund it in full. We do not
            refund on the basis that a result did not happen — we never promise one, so there is
            nothing to refund against. The one make-good we do offer: if a prospect we delivered
            fails our own cited-source verification standard, we replace it at no charge within the
            same month.
          </p>
          <p>
            When an engagement ends you keep the work from every period you paid for — the prospect
            research, the scripts, the drafted messages, and the trackers — plus the current
            suppression and opt-out list, handed over within five business days.{" "}
            <a href="/terms#billing" className="text-gold-200 underline underline-offset-4">
              Read the full billing, cancellation, and refund terms
            </a>
            .
          </p>
        </GuideSection>

        <GuideSection title="When you should not pay us — or anyone">
          <p>
            If you have no clear offer, no capacity for new work, or nobody to answer interested
            replies within a business day, fix that before buying pipeline help from any vendor —
            including us. The{" "}
            <a href="/free-pipeline-audit" className="text-gold-200 underline underline-offset-4">
              free pipeline audit
            </a>{" "}
            exists partly for this: sometimes it shows the bottleneck isn&rsquo;t your targeting,
            and you deserve to learn that for free.
          </p>
        </GuideSection>

        <GuideSection title="Pricing questions">
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
