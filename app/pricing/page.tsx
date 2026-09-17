import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import {
  boundarySentence,
  callingPolicy,
  contractorBoundary,
  faqSlug,
  offerTerms,
  planSlug,
  plans,
  responsibilityMatrix,
  sendingCadence,
  serviceTimeline,
  serviceTimelineDisclaimer,
  stepUps,
  terminology,
} from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata, serviceJsonLd } from "@/lib/pages";
import { siteUrl, intakeMinutes } from "@/lib/site";

// THE PRICING PAGE IS ABOUT RESPONSIBILITY, NOT VOLUME (D-027 §1, mandate §9).
//
// Until 2026-09-17 this page led with three tiers whose visible difference was a "monthly
// ceiling" — ~40 accounts, ~100 messages, ~150 messages — so the honest reading of the table
// was "the same thing, in three sizes". That is not what is sold. The three plans are three
// different answers to one question: how far do we carry an opportunity before your team
// takes it? So the page now opens with the three one-liners, then a who-owns-what table
// (every row a responsibility, every cell "we do" or "you do"), then what reaches you at the
// handoff, then the boundary that holds on all three. Capacity limits still appear — a plan
// quoted without its limit reads as unlimited — but as the supporting facts they are, under
// their own heading, with the sentence that says they are never the reason a plan costs more.

const page = getGuidePage("pricing");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "How much does commercial HVAC lead generation cost with B2B Lead Growth?",
    answer:
      "B2B Lead Growth charges a flat $750, $1,500 or $2,500 a month, with no setup fee. $750 is Prospecting: we find and contact suitable commercial accounts, and you take over at interest. $1,500 is Managed Pipeline: we run outreach and follow-up, screen genuine interest, and organize the handoff. $2,500 is Qualified Opportunity Engine: we qualify the opportunity, gather the relevant context, coordinate the next step or site visit, and prepare your team to estimate and close.",
  },
  {
    question: "What is the difference between the three plans?",
    answer:
      "The three plans differ by how far we carry an opportunity before your team takes it, never by the message count. Prospecting hands you an interested prospect the moment one appears. Managed Pipeline hands you screened interest, with a structured handoff. Qualified Opportunity Engine hands you a qualified opportunity, prepared for your estimator. On all three, your team does the technical evaluation, the estimate and the close.",
  },
  {
    question: "Is $750 a month enough for real commercial prospecting?",
    answer:
      "$750 a month buys a defined piece of work, not a full sales function. We build the account profile with you, research commercial accounts from public sources with a cited reason each, write a first-touch message per account, send it in your name, and read every reply. When a contact shows genuine interest, the conversation is yours. It suits a shop where someone already works replies; if nobody does, the $1,500 plan is the honest starting point.",
  },
  {
    question: "Are there setup fees, per-lead fees, per-opportunity fees or long contracts?",
    answer:
      "No. There is no setup fee, no per-lead charge, no per-opportunity fee, no acceptance fee, no commission and no early-termination fee. There is one flat price per plan, month-to-month, with 14 days' notice either side. Prices are in US dollars and exclude any applicable tax. If you leave, you keep everything we built for you.",
  },
  {
    question: "How does billing work, and can I get a refund?",
    answer:
      "Billing is a flat monthly fee, charged in advance, renewing until you cancel on 14 days' written notice by email. The current month is non-refundable and is not prorated, because the fee is earned as that month's work is performed. A period we have not started is refunded in full. We do not refund because a result did not occur, since we never promise one. The full policy is in our Terms of Service.",
  },
  {
    question: "What does no plan include?",
    answer:
      "No plan includes technical inspection, equipment diagnosis or specification, final scope, the estimate, the price, negotiation or the close — those are the contractor's on every plan. No plan includes cold calls, paid advertising, homeowner lead sourcing or contacting homeowners. No plan includes a guaranteed number of replies, appointments, site visits, qualified opportunities, contracts or revenue. No plan includes contractual territorial exclusivity: as standard we work one HVAC company per service area as an operating practice, and enforceable per-metro exclusivity is a separate priced add-on on the order form, quoted before you sign.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      // Each Question carries the fragment its visible answer is stamped with below. The
      // anchor and the schema fragment come from the SAME faqSlug() call, so rewording a
      // question moves both together.
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

const OWNER_LABEL = { we: "We do", you: "You do" } as const;

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
        intro={
          <>
            <p className="text-ink">
              B2B Lead Growth charges established commercial HVAC contractors a flat monthly fee at
              one of three levels of responsibility: $750 for Prospecting, $1,500 for Managed
              Pipeline, or $2,500 for Qualified Opportunity Engine.
            </p>
            <p>
              The price follows how far we carry each opportunity before your team takes it — not
              how many messages we send. No setup fee. Month-to-month with 14 days&rsquo; notice
              either side. All prices are in US dollars and exclude any applicable tax.
            </p>
            <p>
              Nothing is priced per lead or per opportunity, because we sell neither. You pay for
              work done in your name, on the account types and service area you approve.
            </p>
          </>
        }
      >
        <GuideSection title="The three plans, in one line each">
          {/* id={planSlug(name)} on every card: the Offer nodes in serviceJsonLd() publish
              /pricing#<slug> as each plan's url, and a fragment that lands nowhere is a broken
              link we would be publishing knowingly. */}
          <div className="space-y-4">
            {plans.map((p) => (
              <div
                key={p.name}
                id={planSlug(p.name)}
                className={`scroll-mt-20 rounded-lg border bg-surface p-5 ${
                  p.featured ? "border-accent/45" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl text-ink">{p.name}</h3>
                  <p className="text-xl font-semibold text-accent">
                    ${p.price.toLocaleString()}
                    <span className="text-sm font-normal text-subtle">/mo</span>
                  </p>
                </div>
                <p className="mt-2 text-lg font-semibold leading-7 text-ink/90">{p.oneLiner}</p>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      We own
                    </dt>
                    <dd className="mt-1 leading-7">{p.owns.join(" → ")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      You keep
                    </dt>
                    <dd className="mt-1 leading-7">{p.youKeep}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      Best for
                    </dt>
                    <dd className="mt-1 leading-7">{p.bestFor}</dd>
                  </div>
                </dl>
                <Link
                  href="/start"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-accent transition-colors hover:text-accent"
                >
                  See if {p.name} fits your team →
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-subtle">
            No plan can be bought from this page, deliberately. The {intakeMinutes}-minute fit
            check comes first, because the right plan depends on who on your team works an
            interested reply, and on whether someone quotes and wins commercial bids.
          </p>
        </GuideSection>

        <GuideSection id="who-owns-what" title="Who owns what on each plan">
          <p>
            Read a row across. Every responsibility is either ours or yours on a given plan, and a
            lower plan never quietly includes a higher plan&rsquo;s work. The last row is yours on
            all three: that row is the boundary.
          </p>
          <GuideTable
            caption="Who is responsible for each part of the work on Prospecting, Managed Pipeline and Qualified Opportunity Engine"
            head={["Responsibility", ...plans.map((p) => `${p.name} ($${p.price.toLocaleString()})`)]}
            rows={responsibilityMatrix.map((row) => [
              row.responsibility,
              ...row.owner.map((o, i) => (
                <span key={i} className={o === "we" ? "font-semibold text-ink" : "text-subtle"}>
                  {OWNER_LABEL[o]}
                </span>
              )),
            ])}
          />
        </GuideSection>

        <GuideSection id="handoffs" title="What reaches your team, and what it is called">
          <p>
            The three plans hand over three different things, and we never call one by
            another&rsquo;s name. An interested prospect is not screened interest, and screened
            interest is not a qualified opportunity.
          </p>
          <dl className="space-y-4">
            {plans.map((p) => (
              <div key={p.name} className="rounded-lg border border-line bg-surface p-5">
                <dt className="font-semibold text-ink">
                  {p.name}: {p.handoff.label}
                </dt>
                <dd className="mt-2 leading-7">{p.handoff.definition}</dd>
                <dd className="mt-2 text-sm text-subtle">
                  Counted on your report as: {p.handoff.unit}. {p.reportCadence} reporting.
                </dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection title="What each step up buys">
          <div className="space-y-4">
            {stepUps.map((s) => (
              <div key={s.to} className="border-l-2 border-accent/45 pl-4">
                <p className="font-semibold text-ink">
                  {s.from} → {s.to}{" "}
                  <span className="font-normal text-subtle">({s.delta})</span>
                </p>
                <p className="mt-1.5 leading-7">{s.body}</p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection id="boundary" title="What stays with you on every plan">
          <KeyAnswer>{boundarySentence}</KeyAnswer>
          <p>On no plan, at any price, do we:</p>
          <ul className="list-disc space-y-2 pl-5">
            {contractorBoundary.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="The words on this page, defined">
          <p>
            Five terms, used the same way on every page of this site and in every report. They are
            never interchangeable.
          </p>
          <dl className="space-y-4">
            {terminology.map((t) => (
              <div key={t.key}>
                <dt className="font-semibold text-ink">{t.term}</dt>
                <dd className="mt-1 leading-7">{t.definition}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-subtle">
            The full{" "}
            <Link href="/how-it-works#terminology" className="text-accent underline underline-offset-4">
              terminology and the qualification standard
            </Link>{" "}
            are on the how-it-works page.
          </p>
        </GuideSection>

        <GuideSection id="capacity" title="Capacity limits, as supporting facts">
          <p>
            Each plan has a monthly limit, stated in outreach messages because that is the unit our
            sending controls enforce. A limit is a supporting fact.{" "}
            <span className="text-ink">
              Message counts are never the reason one plan costs more than another
            </span>{" "}
            — the responsibility in the table above is.
          </p>
          <dl className="space-y-3">
            {plans.map((p) => (
              <div key={p.name}>
                <dt className="font-semibold text-ink">{p.name}</dt>
                <dd className="mt-1 leading-7">{p.capacity}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection title="The terms, in five lines">
          <ul className="list-disc space-y-2 pl-5">
            {offerTerms.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="What the market typically charges: $2,000 to $10,000+ a month">
          <p>
            Here is what published guides and pricing pages showed when we checked them on
            August 7, 2026, so you can judge our pricing against the field. These are general
            B2B outbound and appointment-setting agencies, not HVAC specialists:
          </p>
          <GuideTable
            caption="Published outbound and appointment setting pricing across the market"
            head={["Source", "What it publishes", "Figures"]}
            rows={[
              [
                <a
                  key="belkins"
                  href="https://belkins.io/blog/appointment-setting-costs-pricing-models"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-accent underline underline-offset-4"
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
                  className="text-accent underline underline-offset-4"
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
                  className="text-accent underline underline-offset-4"
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
                  className="text-accent underline underline-offset-4"
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
                  className="text-accent underline underline-offset-4"
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
            them — the same standard we apply to every account we research for you.
          </SourceNote>
          <KeyAnswer>
            Of the agencies we checked in August 2026, full-service providers either do not publish
            pricing at all (Belkins, Callbox — both quote on a call) or start their managed service
            at $2,000/month (CIENCE). B2B Lead Growth publishes all three of its prices: $750,
            $1,500 and $2,500 a month. Ours are lower for three plain reasons: each plan has a
            stated capacity limit, the process is email-led with no call center and no paid-ad
            management, and we are a new, founder-run company earning a track record in public.
            The lower price never buys a guarantee of replies, appointments, contracts or revenue,
            here or anywhere.
          </KeyAnswer>
        </GuideSection>

        <GuideSection id="timeline" title="What happens after you sign, and when">
          <p>
            Day 0 is the day the agreement is signed and the first payment clears — no work begins
            before it. The onboarding below is the same on every plan:
          </p>
          {/* An ordered sequence, so an <ol>. All three owner values are labelled: the
              you/we/both split is what "nothing is sent until you have signed off" depends on. */}
          <ol className="mt-4 space-y-3">
            {serviceTimeline.map((p) => (
              <li key={p.label} className="border-l-2 border-line pl-4">
                <span className="block text-ink">
                  {p.band} — {p.label}
                  <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {p.owner === "you" ? "Yours" : p.owner === "we" ? "Ours" : "Both"}
                  </span>
                </span>
                <span className="block text-sm opacity-80">{p.detail}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm opacity-80">{serviceTimelineDisclaimer}</p>
          <h3 className="mt-8 font-display text-2xl text-ink">Once sending starts</h3>
          <dl className="mt-4 space-y-4">
            {sendingCadence.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold text-ink">{c.title}</dt>
                <dd className="mt-1 leading-7">{c.body}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 font-display text-2xl text-ink">When a call happens</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {callingPolicy.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection title="Where your accounts come from">
          <p>
            <span className="text-ink">The accounts we contact in your name are businesses we
            research.</span>{" "}
            Property and facility managers, building owners, multi-site operators, offices,
            warehouses, schools, healthcare, restaurants, retail. All of them are organizations,
            not private individuals, so we find them from free public sources. Every account
            carries the public source it came from, a fit reason, and a named person to reach.
            Nothing without a citation can be contacted.
          </p>
          <p>
            <span className="text-ink">Homeowners are never on the list.</span> We do not, and will
            not, contact consumers on anyone&rsquo;s behalf — not from research, not from a
            purchased file, not at any price. That is why a residential-only shop is not a fit,
            and why the fit check says so before you spend anything.
          </p>
        </GuideSection>

        <GuideSection title="Billing, cancellation, and refunds">
          <p>
            The fee is flat and billed in advance, and the engagement renews monthly until you
            cancel. There is no setup fee, no minimum term, and no early-termination fee. Either
            side can cancel for any reason on 14 days&rsquo; written notice by email.
          </p>
          <p>
            <span className="text-ink">The current month is non-refundable and is not prorated</span>,
            because the fee is earned as that month&rsquo;s work is performed. If we have not begun
            work on a period, we refund it in full. We do not refund on the basis that a result did
            not happen, because we never promise one. The one make-good we do offer: if an account
            we delivered fails our own cited-source verification standard, we replace it at no
            charge within the same month.
          </p>
          <p>
            When an engagement ends you keep the work from every period you paid for — the account
            research, the drafted messages, and the trackers — plus the current suppression and
            opt-out list, handed over within five business days.{" "}
            <Link href="/terms#billing" className="text-accent underline underline-offset-4">
              Read the full billing, cancellation, and refund terms
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="When you should not pay us, or anyone">
          <p>
            If you have no clear offer, no room for another account, nobody who quotes and wins
            commercial bids, or nobody to answer an interested reply within a business day, fix
            that before buying pipeline help from any vendor — including us. The{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free pipeline audit
            </Link>{" "}
            exists partly for this: sometimes it shows the bottleneck isn&rsquo;t your targeting,
            and you deserve to learn that for free.
          </p>
        </GuideSection>

        <GuideSection title="Pricing questions">
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
