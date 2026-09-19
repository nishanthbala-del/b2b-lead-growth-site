import Link from "next/link";
import PrimaryCta from "@/components/PrimaryCta";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  audit,
  boundarySentence,
  faqGroups,
  faqSlug,
  faqs,
  idealFor,
  planSlug,
  plans,
  productExample,
  reviews,
  riskReversal,
} from "@/lib/content";
import { guidePages, homepageH1 } from "@/lib/pages";
import { ANSWER_KEYS } from "@/lib/qualification";
import { auditDeliveryWindow, brandName, founderName, intakeMinutes } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  The landing page                                                           */
/* -------------------------------------------------------------------------- */
//
// A SERVER component with no JavaScript of its own beyond the tracked primary button. It
// replaced a 2,175-line client component carrying Lenis smooth scroll, a GSAP pinned section,
// framer-motion scroll reveals, a custom cursor, magnetic buttons, tilting cards and a
// count-up animation — about 85 kB of script whose entire job was decoration, and which broke
// every deep link into the page and server-rendered every content block at `opacity: 0`.
//
// COMPRESSED 2026-09-17 (conversion supplement). The D-027 rebuild earlier the same day was
// correct and complete, and read like it: twelve sections, the offer stated four times, the
// company's newness stated three times, the send gate's warm-up ramp on the sales page, all
// twenty-five FAQs open, and a "See if we're a fit" button that described the form rather than
// what a visitor gets. The order is now the order a buyer decides in —
//
//   headline (the outcome) → value proposition (the one positioning sentence) → proof (a
//   real account, in the format the audit delivers) → how it works → the three levels and
//   the price → the free audit → who it is for → what can be checked → the questions →
//   one way to start
//
// — with ONE call to action, "Get 3 Commercial Accounts Free" (components/PrimaryCta.tsx),
// and everything a buyer needs only after deciding — the who-owns-what grid, capacity limits,
// the sending cadence, the full boundary list, the terminology, every clause — one link deeper
// on /pricing, /how-it-works and /commercial-hvac-lead-generation. Nothing was deleted from
// the site: what left this page moved to the page it belongs on.
//
// Two things this page must never do, both held by tests/pricing-model.test.ts:
//   * imply that appointment setting, site visits or Qualified Opportunities come with every
//     plan — they are the top plan's work, and no plan promises a count of them;
//   * describe a plan in a sentence that gives it a higher plan's responsibility.
// And tests/conversion.test.ts holds the compression: one CTA label, the example's provenance
// line, the newness of the company stated once, and no sending mechanics on this page.

/** The count is read from the form itself, so the promise cannot drift from the questions. */
const QUESTION_COUNT = ANSWER_KEYS.length;

// How an account becomes an opportunity, in four moves. This merges what were two sections
// (the mandate's four-move progression and a five-step onboarding list) into the one sequence
// a buyer actually needs on the sales page. Deliberately plan-neutral: step 3 says the plan
// decides and names no plan, so nothing here can be read as "every plan qualifies". The
// onboarding detail, the pacing of the sending and the day-by-day timeline are on
// /how-it-works and /pricing#timeline, where someone who has decided goes to check them.
const howItWorks = [
  {
    title: "We find the commercial accounts",
    body: "Property managers, building owners, facility teams and multi-site operators in the areas you serve, researched from public sources — each with a cited reason to write and a named contact.",
  },
  {
    title: "We reach the right buyer, in your name",
    body: "A message written for that account, sent from your own domain and mailbox. Nothing goes out until you have signed off the account profile, the exclusions and the claims we may make.",
  },
  {
    title: "We confirm genuine interest and carry it as far as you chose",
    body: "Every reply is read the same day, and interest is confirmed by a person. Then your plan decides: hand over at first interest, screen it and organize a structured handoff, or qualify it and prepare it for your estimator.",
  },
  {
    title: "Your team quotes and closes",
    body: "The handoff reaches the person you named, with the conversation, the context and the reason we wrote. The technical evaluation, the estimate and the close are yours on every plan.",
  },
];

// What can honestly be offered as evidence by a company with no clients yet. Every item is
// something a visitor can check for themselves on this site, today. Nothing here is a result,
// a testimonial, or a claim about another company's outcome.
const checkable = [
  {
    title: "The audit is the sample",
    body: "Real work on your market, handed over before any money changes hands. Judge the service on that.",
  },
  {
    title: "Every price is published",
    body: "Three plans, each with what we own and what stays with you. Nothing is quoted only on a call.",
  },
  {
    title: "Every account carries its source",
    body: "A public link you can open, plus the reason it was picked. No citation, no contact.",
  },
];

// The three commitments a buyer weighs before the first month, from the seven the agreement
// already makes (lib/content.ts `riskReversal`). The full list, each with its clause, is on
// /pricing#commitments; every line is a delivery, terms or ownership commitment, never a
// result.
const RISK_ON_HOMEPAGE = [
  "No setup fee, no contract length, no exit fee",
  "A month we have not started is refunded in full",
  "Everything built for you stays yours",
];

// The four disqualifiers the fit check enforces in code, in a few words each. The published
// reasons, in full, are on /commercial-hvac-lead-generation#not-for.
const notForShort = [
  "contractors with no commercial work yet",
  "anyone wanting to buy leads",
  "companies at capacity year-round",
  "shops that already run in-house outbound",
];

export default function LeadGenerationLanding() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-accent/45 focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ExampleSection />
        <HowItWorksSection />
        <PlansSection />
        <OfferSection />
        <WhoItsForSection />
        <CredibilitySection />
        <FaqSection />
        <GuidesSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tint = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-line px-5 py-14 sm:px-8 sm:py-16 lg:py-20 ${
        tint ? "bg-surface" : "bg-paper"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {intro ? <p className="mt-4 max-w-2xl text-lg leading-8 text-subtle">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

const textLink = "font-semibold text-accent underline underline-offset-4 hover:text-accent";

/* -------------------------------------------------------------------------- */

// The five-second test: the category and the buyer (eyebrow), the outcome (H1), the value
// proposition (deck), who it is for, and one action.
//
// THE DECK IS THE ONE POSITIONING SENTENCE, VERBATIM, AS LITERAL TEXT. The site hero is one of
// exactly three surfaces the operating system sanctions for it (core/offer.POSITIONING
// "surfaces" = site hero, proposal, reply bridge), and scripts/check_cross_repo.py in that
// repo reads THIS FILE for the words — so they are typed here, not imported, and
// tests/pricing-model.test.ts holds them equal to `positioningSentence` in lib/content.ts.
// Do not put a tag, an expression or a comment inside the sentence.
//
// Nothing operational lives here: no ramp, no cadence, no gate, no question count beyond the
// one line under the button. A buyer who wants those finds them one link down.
function Hero() {
  return (
    <section className="border-b border-line bg-paper px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Managed outbound for commercial HVAC contractors
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
          {homepageH1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-subtle sm:text-xl">
          We find the commercial accounts worth pursuing, contact the right people in your name,
          and hand each opportunity to your team at the level you chose — from first interest to
          a prepared opportunity your estimator can act on. We measure the work by one thing:
          interested prospects.
        </p>
        <p className="mt-4 max-w-2xl leading-7 text-subtle">
          For established HVAC contractors that already do commercial work, anywhere in the
          United States. Every account we contact is a business: a property manager, a building
          owner or a facility team.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryCta placement="hero" />
          <p className="text-sm leading-6 text-subtle">
            3–5 commercial accounts near you, with source links, plus one sample message. No
            call, no card.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

// SHOW THE PRODUCT. One real account in the exact shape every account in the audit arrives
// in, rendered from lib/content.ts `productExample`, where its provenance is documented. The
// disclosure line is part of the content, not decoration: it says what is real, what is
// withheld, and why.
function ExampleSection() {
  const rows = [
    productExample.account,
    productExample.fit,
    productExample.buyer,
    productExample.reason,
    productExample.approach,
  ];
  return (
    <Section
      id="example"
      eyebrow="What you get"
      title="One real account, in the format every account in your audit arrives in."
      intro="Not a description of research — the research. Prepared from public sources, with the reason to write and the way to write it."
      tint
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <dl className="divide-y divide-line rounded-lg border border-line bg-paper px-5">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:pt-1">
                {row.label}
              </dt>
              <dd className="leading-7 text-ink/90">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-lg border border-line bg-paper p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {productExample.source.label}
          </p>
          <p className="mt-2 leading-7 text-ink/90">{productExample.source.value}</p>
          <ul className="mt-3 space-y-2">
            {productExample.source.quotes.map((q) => (
              <li key={q} className="border-l-2 border-accent/45 pl-3 text-sm leading-6 text-subtle">
                &ldquo;{q}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-6 text-subtle">{productExample.disclosure}</p>
      <p className="mt-4 leading-7 text-subtle">
        <Link href="/free-pipeline-audit" className={textLink}>
          What the free pipeline audit contains, in full
        </Link>
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Four moves, the same on every plan until someone shows genuine interest."
      intro="What happens after that is the only thing the plans change."
    >
      <ol className="mt-8 grid gap-4 sm:grid-cols-2">
        {howItWorks.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 leading-7 text-subtle">
        <Link href="/how-it-works" className={textLink}>
          How it works, step by step
        </Link>{" "}
        — the qualification standard, what each handoff contains, when a call happens, and how
        the sending is paced.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

/** "$750, $1,500, $2,500" — derived from `plans` so the headline prices can never drift
 *  from the plan cards directly below them. */
const priceList = plans.map((p) => `$${p.price.toLocaleString()}`).join(", ");

// THREE LEVELS OF RESPONSIBILITY, NOT THREE SIZES. Each card is the one sentence that says
// what we become responsible for, who it is for, what reaches the contractor and under what
// name, and what stays with him. The responsibility chain, the capacity limits and the
// step-up explanations are on /pricing: a message count must never read as the reason a
// plan costs more (D-027 §1), so it is not on the sales card at all.
// `id="pricing"` and the `plan-<slug>` ids are kept: outbound email has linked to them.
function PlansSection() {
  return (
    <Section
      id="pricing"
      eyebrow="Three levels of responsibility"
      title="Choose how far we carry each opportunity. The price follows that."
      intro={`${priceList} a month, flat. No setup fee, month-to-month, 14 days’ notice either side. Never priced per lead or per opportunity.`}
    >
      <ul className="mt-8 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.name}
            id={`plan-${planSlug(plan.name)}`}
            className={`flex scroll-mt-20 flex-col rounded-lg border p-6 ${
              plan.featured ? "border-accent/45 bg-surface" : "border-line bg-surface"
            }`}
          >
            {plan.featured ? (
              <p className="mb-4 w-fit rounded-sm border border-accent/45 bg-accent-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Where we suggest starting
              </p>
            ) : null}
            <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
            <dl>
              <dt className="sr-only">Price</dt>
              <dd className="mt-3 text-3xl font-semibold text-ink">
                ${plan.price.toLocaleString()}
                <span className="text-base font-normal text-subtle">/mo</span>
              </dd>
              <dt className="sr-only">What we are responsible for</dt>
              <dd className="mt-3 font-semibold text-accent">{plan.oneLiner}</dd>
              <dt className="sr-only">Best for</dt>
              <dd className="mt-3 text-sm leading-6 text-subtle">{plan.bestFor}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                What reaches you
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.handoff.label}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Your side
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.youKeep}</dd>
            </dl>
          </li>
        ))}
      </ul>
      {/* The boundary that holds on every plan, stated once, here, where the plans are — so
          it is never inferred from an absence. The full list of what we do not do is on
          /pricing#boundary. */}
      <p id="boundary" className="mt-6 max-w-3xl scroll-mt-20 leading-7 text-ink/90">
        <span className="font-semibold">{boundarySentence}</span> That holds on every plan,
        including the top one.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta placement="plans" />
        <p className="text-sm leading-6 text-subtle">
          The fit check suggests a plan from your answers.{" "}
          <Link href="/pricing#who-owns-what" className={textLink}>
            Who owns what on each plan, line by line
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// `id="get-audit"` is load-bearing: it is the anchor guide pages and the client service
// agreement have historically pointed at. Renaming it breaks links we do not control.
function OfferSection() {
  return (
    <Section id="offer" eyebrow="Start here — free" title={audit.name} intro={audit.tagline} tint>
      <div id="get-audit" className="scroll-mt-20" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {audit.includes.map((item) => (
          <li key={item.title} className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-2xl leading-7 text-subtle">
        Nothing is sent to anyone as part of it, and no call is required to receive it. If it is
        useful, we talk. If not, you keep it and owe nothing.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta placement="offer" />
        <Link href="/free-pipeline-audit" className={`text-sm ${textLink}`}>
          What&rsquo;s in the free pipeline audit, in full
        </Link>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function WhoItsForSection() {
  return (
    <Section
      id="who-its-for"
      eyebrow="Who it’s for"
      title="Commercial work already on the books, and room for more of it."
    >
      <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {idealFor.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-ink/90">
            <span aria-hidden="true" className="mt-1 shrink-0 text-accent">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {/* WHO WE WRITE TO, one link per buyer (2026-09-18): each has a page of its own. */}
      <p className="mt-6 max-w-3xl leading-7 text-subtle">
        <span className="font-semibold text-ink/90">Who we write to for you:</span>{" "}
        <Link href="/hvac-property-manager-outreach" className={textLink}>
          property managers
        </Link>
        ,{" "}
        <Link href="/hvac-building-owner-outreach" className={textLink}>
          building owners
        </Link>{" "}
        and{" "}
        <Link href="/hvac-facility-manager-outreach" className={textLink}>
          facility teams
        </Link>
        . Businesses only, each found from public sources with a cited reason.
      </p>
      <p className="mt-4 max-w-3xl leading-7 text-subtle">
        <span className="font-semibold text-ink/90">Not a fit:</span> {notForShort.join(" · ")}.
        The fit check says so on the spot, before you spend anything.{" "}
        <Link href="/commercial-hvac-lead-generation#not-for" className={textLink}>
          Every reason, in full
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// The proof section for a company that has no proof of the usual kind. Everything listed is
// checkable on this site today; nothing is a client result. THE COMPANY'S NEWNESS IS STATED
// HERE, ONCE, on the whole page (tests/conversion.test.ts): a young service says so plainly
// one time, then shows what can be checked instead of repeating it.
function CredibilitySection() {
  const commitments = riskReversal.filter((r) => RISK_ON_HOMEPAGE.includes(r.title));
  return (
    <Section
      id="why-us"
      eyebrow="Why believe any of this"
      title="What you can check before you spend anything."
      tint
    >
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {checkable.map((item) => (
          <div key={item.title} className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{item.body}</p>
          </div>
        ))}
      </div>
      {/* Conditional on purpose: this reads true either way. Empty today, and the moment
          lib/content.ts `reviews` gets its first real, consented entry this line flips to
          pointing at it — no second content change needed. */}
      <p className="mt-6 max-w-3xl leading-7 text-subtle">
        {brandName} is a founder-led service
        {reviews.length > 0 ? (
          <>
            , and what we do have is{" "}
            <Link href="/reviews" className={textLink}>
              real client reviews
            </Link>
            , published only with the client&rsquo;s own words and named consent.
          </>
        ) : (
          <>
            {" "}
            without published client results yet, and this site invents none. The audit is the
            proof; the{" "}
            <Link href="/reviews" className={textLink}>
              reviews page
            </Link>{" "}
            will show real ones, with names and consent on file, the moment they exist.
          </>
        )}
      </p>

      <h3 className="mt-10 font-display text-2xl text-ink">What you are actually risking</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {commitments.map((item) => (
          <li key={item.title} className="rounded-lg border border-line bg-paper p-4">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-accent">{item.clause}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-subtle">
        Every commitment is a clause that already binds us; none is a promise about results.{" "}
        <Link href="/pricing#commitments" className={textLink}>
          All seven, with their clauses
        </Link>
        , and the{" "}
        <Link href="/terms" className={textLink}>
          Terms of Service
        </Link>{" "}
        they come from.
      </p>

      <p className="mt-8 max-w-3xl leading-7 text-subtle">
        <span className="font-semibold text-accent">Who runs it. </span>
        The research, the writing, the sending and the reply handling run on an automated system
        with {founderName} accountable for it, and every message clears hard checks — citations,
        opt-out suppression, duplicates, sending caps — before it can send. There is no account
        manager between you and the person responsible.{" "}
        <Link href="/about" className={textLink}>
          About {brandName}
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// Eight questions open, the rest one tap away, all of them in the page. Every answer stays in
// the DOM as readable text — inside a native <details>, which needs no script and is what the
// FAQPage markup in app/page.tsx mirrors — so nothing was removed from the site or from the
// structured data. The homepage just stopped being a FAQ archive: the questions that decide
// whether to act are open; the rest are there for the reader who has a specific one.
function FaqSection() {
  const featured = faqs.filter((f) => f.featured);
  return (
    <Section id="faq" eyebrow="FAQ" title="The questions commercial HVAC owners actually ask.">
      <div className="mt-8 divide-y divide-line border-y border-line">
        {featured.map((faq) => (
          <div key={faq.question} id={faqSlug(faq.question)} className="scroll-mt-20 py-5">
            <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
            <p className="mt-2 max-w-3xl leading-7 text-subtle">{faq.answer}</p>
          </div>
        ))}
      </div>
      <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Everything else
      </h3>
      <div className="mt-3 space-y-6">
        {faqGroups.map((group) => {
          const inGroup = faqs.filter((f) => f.group === group && !f.featured);
          if (inGroup.length === 0) return null;
          return (
            <div key={group}>
              <p className="text-sm font-semibold text-ink">{group}</p>
              <div className="mt-1 divide-y divide-line border-y border-line">
                {inGroup.map((faq) => (
                  <details key={faq.question} id={faqSlug(faq.question)} className="group scroll-mt-20">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span aria-hidden="true" className="shrink-0 text-accent transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-3xl pb-5 leading-7 text-subtle">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function GuidesSection() {
  return (
    <Section
      id="guides"
      eyebrow="Read first"
      title="Not ready to answer questions?"
      intro="Everything about the service is published in full, with no form in front of any of it."
      tint
    >
      <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {guidePages.map((page) => (
          <li key={page.slug} className="leading-7">
            <Link href={`/${page.slug}`} className={textLink}>
              {page.navLabel}
            </Link>
            <span className="text-subtle"> — {page.description}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-line bg-paper px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          See the work before you pay anything.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-subtle">
          {QUESTION_COUNT} questions, about {intakeMinutes} minutes, then a straight answer either
          way. If it is a fit, we build your {audit.name.toLowerCase()} and email it within{" "}
          {auditDeliveryWindow}.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryCta placement="final" />
        </div>
        <p className="mt-4 text-sm text-subtle">No card, and no call required to get the audit.</p>
      </div>
    </section>
  );
}
