import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug, plans, serviceTimeline, serviceTimelineDisclaimer } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, serviceJsonLd } from "@/lib/pages";
import { siteUrl, intakeMinutes } from "@/lib/site";

const page = getGuidePage("pricing");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "How much does HVAC appointment setting cost in 2026?",
    answer:
      "B2B Lead Growth charges a flat $750, $1,500, or $2,500 per month, with no setup fee. Published pricing guides we checked in August 2026 put typical agency retainers between roughly $2,000 and $10,000+ per month, and pay-per-appointment rates at about $50 to $500 per booked meeting. Belkins' 2024 guide cites basic retainers around $2,000/month and comprehensive programs at $5,000–$10,000; SalesBread's 2025 guide lists $2,000–$5,000 retainers.",
  },
  {
    question: "Is $750 per month enough for real lead generation?",
    answer:
      "$750 a month buys a defined, capacity-limited slice of work, not a full-service program. You get an agreed job profile, your own history cleaned and ranked, and up to ~40 individually researched, cited prospects a batch, with scripts to work them. You make the calls and send the emails; done-for-you sending starts at the $1,500 tier. No tier at any price honestly buys guaranteed jobs."
  },
  {
    question: "Are there hidden fees, setup costs, or long contracts?",
    answer:
      "No. There is no setup fee, no early-termination fee, and no required tool add-ons. Every tier is month-to-month with 14 days' notice either side. Prices are in US dollars and exclude any applicable tax. If you leave, you keep everything we built: the lists, the scripts, and the trackers.",
  },
  {
    question: "How does billing work, and can I get a refund?",
    answer:
      "Billing is a flat monthly fee, charged in advance, renewing until you cancel on 14 days' written notice by email. The current month is non-refundable and is not prorated, because the fee is earned as that month's work is performed. A period we have not started is refunded in full. We do not refund because a result did not occur, since we never promise one. The full policy is in our Terms of Service.",
  },
  {
    question: "What do the tiers exclude?",
    answer:
      "Lead Engine excludes the outreach: you send. Outreach Engine excludes the sales conversation: you take it, and reply qualification against your criteria is Appointment Engine only. Appointment Engine excludes the in-home visit, the quote, and the close. No tier includes guaranteed reply volume, appointment counts, or revenue. No tier includes homeowner lead sourcing, because we do not do that at any price. No tier includes contractual territorial exclusivity — as standard we work one HVAC company per service area as an operating practice, and enforceable per-metro exclusivity is a separate priced add-on on the order form, quoted before you sign. You always own your pricing, your sending identity, and the customer relationship.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      // Each Question carries the fragment its visible answer is stamped with below, so a
      // specific answer is citable on its own rather than only as part of the page. The
      // anchor and the schema fragment come from the SAME faqSlug() call, so rewording a
      // question moves both together and they cannot drift apart.
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        name: f.question,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    serviceJsonLd(),
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
        h1="HVAC lead generation pricing: $750, $1,500, or $2,500 per month"
        intro={
          <>
            <p>
              B2B Lead Growth charges established HVAC companies a flat monthly fee:{" "}
              <span className="text-bone">$750</span> for Lead Engine (we build and rank your list,
              you do the outreach), <span className="text-bone">$1,500</span> for Outreach Engine
              (we run the outreach, you answer the interested replies), or{" "}
              <span className="text-bone">$2,500</span> for Appointment Engine (we book qualified
              appointments on your calendar). Published, flat, and never priced per lead.
            </p>
            <p>
              No setup fee. Month-to-month with 14 days&rsquo; notice either side. You keep
              everything we build if you leave. All prices are in US dollars and exclude any
              applicable tax.
            </p>
            <p>
              Nothing is priced per lead because we do not sell leads. You pay for work done on
              your own customer history and your own service area, not for a name three other
              contractors also bought.
            </p>
            <p>
              Most full-service agencies we checked quote pricing only on a sales call. This page
              publishes ours, with cited market context to compare it against.
            </p>
          </>
        }
      >
        <GuideSection title="The three tiers, and what each leaves you to do">
          {/* A definition list, not a stack of sibling paragraphs. Monthly ceiling, who it
              suits, what is included and what stays with you are label/value pairs, so a
              reader scanning on a phone — and an answer engine asked "what does the $1,500
              tier include" — gets a labelled value instead of four unlabelled <p> elements.
              The competitors' prices further down this page were already in a real <table>;
              ours were the only pricing on the site with no semantics at all. */}
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.name} className="rounded-lg border border-gold-500/16 bg-ink-900/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl text-bone">{p.name}</h3>
                  <p className="text-xl font-semibold text-gold-200">
                    ${p.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted">/mo</span>
                  </p>
                </div>
                <p className="mt-2 font-semibold text-bone/90">{p.oneLiner}</p>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200/85">
                      Monthly ceiling
                    </dt>
                    <dd className="mt-1 leading-7">{p.capacity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200/85">
                      Best for
                    </dt>
                    <dd className="mt-1 leading-7">{p.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200/85">
                      Included
                    </dt>
                    <dd className="mt-1">
                      <ul className="space-y-1.5">
                        {p.includes.map((line) => (
                          <li key={line} className="flex gap-2 leading-7">
                            <span aria-hidden="true" className="mt-0.5 shrink-0 text-gold-200">✓</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200/85">
                      Your side
                    </dt>
                    <dd className="mt-1 leading-7">{p.youKeep}</dd>
                  </div>
                </dl>
                {/* This page listed all three prices and offered no way to act on any of
                    them: the only CTA was the shared one at the very bottom of the layout,
                    below the market table and the FAQ. A price-shopper who arrived here from
                    search read the number and had nowhere to go. The fit check is the honest
                    next step rather than a buy button — nobody should be able to commit to a
                    tier before anyone has looked at their list. */}
                <Link
                  href="/start"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
                >
                  See if {p.name} fits your office →
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted/80">
            No tier can be bought from this page, deliberately. The {intakeMinutes}-minute fit
            check comes first, because which tier fits depends on what your export contains and
            who in your office has time to work it.
          </p>
        </GuideSection>

        <GuideSection title="What the market typically charges: $2,000 to $10,000+ a month">
          <p>
            Here is what published guides and pricing pages showed when we checked them on
            August 7, 2026, so you can judge our pricing against the field:
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

        <GuideSection title="Why our pricing is lower: smaller volume, not lower standards">
          <p>
            Three things hold the price down. Each tier caps volume — about 40 researched
            prospects a batch on the entry tier, about 100 or 150 outreach messages a month on
            the two sending tiers — and we deliberately cap how many clients we take on. The process is
            email-first, with no paid-ad management and no call centre. And we are a new company
            earning a track record in public, so the pricing says so.
          </p>
          <p>
            Every researched prospect is still cited individually: the lower price buys smaller
            volume, not a discount on quality. It never buys guaranteed replies, appointments,
            jobs, or revenue, here or anywhere. Anyone selling a guarantee is selling the churn
            math behind it.
          </p>
        </GuideSection>

        <GuideSection id="timeline" title="What happens after you sign, and when">
          <p>
            Day 0 is the day the agreement is signed and the first payment clears — no work
            begins before it. From there:
          </p>
          <p className="mt-3">
            <span className="text-bone">Which phases apply depends on your tier.</span> Lead Engine
            ends at handover: you get the agreed job profile, your own history cleaned and ranked,
            the researched and cited partner list, and the scripts, and you run the sending
            yourself. So the mailbox, approval, warm-up, sequence and reply-triage phases below are
            not part of that tier. Outreach Engine and Appointment Engine include all of them.
          </p>
          {/* An ordered sequence, so an <ol>. Tailwind's preflight strips the numbering, so
              this renders exactly as before while reading correctly to a parser.
              TimelinePhase.owner has three values and only "you" was rendered, which left
              "we" and "both" indistinguishable to a reader — the you/we/both split is what
              the paragraph above and the homepage's "you control three of them" both depend
              on, so all three are now labelled. */}
          <ol className="mt-4 space-y-3">
            {serviceTimeline.map((p) => (
              <li key={p.label} className="border-l-2 border-gold-200/30 pl-4">
                <span className="block text-bone">
                  {p.band} — {p.label}
                  <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-200/85">
                    {p.owner === "you" ? "Yours" : p.owner === "we" ? "Ours" : "Both"}
                  </span>
                </span>
                <span className="block text-sm opacity-80">{p.detail}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm opacity-80">{serviceTimelineDisclaimer}</p>
        </GuideSection>

        <GuideSection title="Where your prospects come from: your own records, and partners we research">
          <p>
            Two lanes, kept strictly separate.{" "}
            <span className="text-bone">Homeowners come from you, never from us.</span> We do not,
            and will not, cold-source your buyers. The campaign runs on{" "}
            <span className="text-bone">demand you already own</span>: past customers, open and
            expired estimates, lapsed maintenance agreements, missed calls and prior enquiries,
            exported from your own system. We cannot research, buy or infer those records. Only you
            can send them, and nothing is contacted until they are imported and you have approved
            the list.
          </p>
          <p>
            <span className="text-bone">Referral partners we do research.</span> Builders, general
            contractors, property managers, realtors, plumbers, electricians and home inspectors
            are businesses, not private individuals, so we source those from free public sources.
            Every record carries the public source it came from, a fit reason and a confidence
            note. Nothing without a citation can be contacted.
          </p>
          <p className="text-sm opacity-80">
            This is enforced in code, not by policy: a record claiming to come from your own
            customer base that is not in the list you approved is blocked before it can be
            contacted. Your export also sets your start date, so it is worth starting early.
          </p>
        </GuideSection>

        <GuideSection title="Billing, cancellation, and refunds">
          <p>
            The fee is flat and billed in advance, and the engagement renews monthly until you
            cancel. There is no setup fee, no minimum term, and no early-termination fee. Either
            side can cancel for any reason on 14 days&rsquo; written notice by email.
          </p>
          <p>
            <span className="text-bone">The current month is non-refundable and is not prorated</span>,
            because the fee is earned as that month&rsquo;s research, writing, sending, and
            reporting is performed. If we have not begun work on a period, we refund it in full.
            We do not refund on the basis that a result did not happen, because we never promise
            one. The one make-good we do offer: if a prospect we delivered fails our own
            cited-source verification standard, we replace it at no charge within the same month.
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

        <GuideSection title="When you should not pay us, or anyone">
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
          {/* Each answer gets the stable anchor faqSlug() generates, and the FAQPage markup
              above cites the same fragment — so a specific answer is linkable and quotable on
              its own. Rewording a question changes its anchor, which is a URL change: check
              nothing external deep-links to the old one first. */}
          <div className="divide-y divide-gold-500/12 border-y border-gold-500/12">
            {pageFaqs.map((f) => (
              <div key={f.question} id={faqSlug(f.question)} className="scroll-mt-20 py-5">
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
