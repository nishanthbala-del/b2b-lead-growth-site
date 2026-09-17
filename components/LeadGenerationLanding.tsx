import Link from "next/link";
import { CTA_HREF, CTA_LABEL, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  audit,
  boundarySentence,
  contractorBoundary,
  differentiators,
  faqGroups,
  faqSlug,
  faqs,
  idealFor,
  notFor,
  planSlug,
  plans,
  reviews,
  riskReversal,
} from "@/lib/content";
import { guidePages, homepageH1 } from "@/lib/pages";
import { ANSWER_KEYS } from "@/lib/qualification";
import { auditDeliveryWindow, basedIn, brandName, founderName, intakeMinutes } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  The landing page                                                           */
/* -------------------------------------------------------------------------- */
//
// A SERVER component with no JavaScript of its own. It replaced a 2,175-line client
// component carrying Lenis smooth scroll, a GSAP pinned section, framer-motion scroll
// reveals, a custom cursor, magnetic buttons, tilting cards and a count-up animation — about
// 85 kB of script whose entire job was decoration, and which broke every deep link into the
// page and server-rendered every content block at `opacity: 0`.
//
// REBUILT 2026-09-17 FOR D-027. The order is the order a commercial HVAC owner decides in:
// what this is and who it is for · how an account becomes an opportunity · why the work exists
// · the three levels of responsibility · where our work stops and yours starts · the free
// audit · whether it is you · how it runs · why believe any of it · the objections · further
// reading · one way to start. There is exactly ONE call to action — "See if we're a fit".
//
// Two things this page must never do, both held by tests/pricing-model.test.ts:
//   * imply that appointment setting, site visits or Qualified Opportunities come with every
//     plan — they are the top plan's work, and no plan promises a count of them;
//   * describe a plan in a sentence that gives it a higher plan's responsibility.

/** The count is read from the form itself, so the promise cannot drift from the questions. */
const QUESTION_COUNT = ANSWER_KEYS.length;

// The progression, in the mandate's own four moves. Deliberately plan-neutral: step 3 says
// the plan decides and names no plan, so nothing here can be read as "every plan qualifies".
const progression = [
  {
    title: "Find the commercial accounts",
    body: "Businesses in your service area that fit your profile — property managers, building owners, facility teams, multi-site operators — researched from public sources, each with a cited reason and a named contact.",
  },
  {
    title: "Create engagement",
    body: "A message written for that account, sent in your name from your own domain and mailbox. Every reply is read the same day, and genuine interest is confirmed by a person.",
  },
  {
    title: "Handle the opportunity to the level you chose",
    body: "Hand it over at first interest, screen it and organize a structured handoff, or qualify it and prepare it for your estimator. Your plan decides which, and a lower plan never quietly includes a higher plan’s work.",
  },
  {
    title: "Transfer it to your team",
    body: "With the conversation and the reason we wrote. Your team does the technical evaluation, the estimate and the close — on every plan.",
  },
];

// The five steps a buyer controls or watches, in delivery order. A compression of the
// onboarding phases in lib/content.ts `serviceTimeline` (a verbatim rendering of the
// operating-system repo's core/timeline.py) plus `sendingCadence` — same order, same facts,
// shorter words. If either changes, this list must be re-read against it.
const steps = [
  {
    title: "You tell us who you want",
    body: "The account types — property managers, offices, warehouses, schools, healthcare, retail — the areas you serve, the work and the accounts to screen out, and who on your team takes an interested reply. About 30 minutes. No customer list required.",
  },
  {
    title: "We draft the account profile, you correct it",
    body: "Who we should be reaching, and the bad-fit work we screen out. We never proceed on a definition you have not seen.",
  },
  {
    title: "We research the accounts and pick the contact",
    body: "Accounts in your area that fit the categories you approved: who they are, why they fit you, and a named person to reach, each with a source link you can open.",
  },
  {
    title: "You sign off the profile and the sending setup, once",
    body: "The account categories, the service area, the exclusions, the claims we may make, and the sending identity. After that we work inside that envelope. Silence is never taken as approval.",
  },
  {
    title: "We contact them in your name, slowly, and hand off at the level you chose",
    // The ramp the send gate actually enforces (presend-gate.py WARMUP_RAMP).
    body: "One message the first day, two the next, then five, then ten, then full volume from about day six. Opt-outs are suppressed instantly and permanently. You can open your sent folder and read every message.",
  },
];

// What can honestly be offered as evidence by a company with no clients yet. Every item is
// something a visitor can check for themselves on this site, today. Nothing here is a result,
// a testimonial, or a claim about another company's outcome.
const credibility = [
  {
    title: "The audit is the sample",
    body: "Real work on your company, handed over before any money changes hands. Judge us on that, not on anything we say here.",
  },
  {
    title: "Every price is published",
    body: "Three plans on this page, each with what we own and what stays with you. Nothing is quoted only on a call.",
  },
  {
    title: "Every researched account carries its source",
    body: "A public link you can open, plus the reason it was picked. No citation, no contact.",
  },
  {
    title: "No case studies, and we will not borrow any",
    body: "This is a new, founder-led service. There are no client results to show, so this site shows none.",
  },
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
        <ProgressionSection />
        <PositioningSection />
        <PlansSection />
        <BoundarySection />
        <OfferSection />
        <WhoItsForSection />
        <HowItWorksSection />
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

/** The primary call to action. One label, one destination, whole site. */
function PrimaryCta({ className = "" }: { className?: string }) {
  return (
    <Link
      href={CTA_HREF}
      className={`inline-flex min-h-12 items-center justify-center rounded-sm border border-accent/45 bg-accent-fill px-6 font-semibold text-paper shadow-lift transition-transform hover:scale-[1.015] ${className}`}
    >
      {CTA_LABEL} <span aria-hidden="true" className="ml-3">→</span>
    </Link>
  );
}

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
      className={`scroll-mt-20 border-t border-line px-5 py-16 sm:px-8 sm:py-20 lg:py-24 ${
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

/* -------------------------------------------------------------------------- */

// The five-second test: what this is, who it is for, and one action.
//
// THE H1 NAMES THE CATEGORY AND THE BUYER (D-027 mandate §10). It used to stay on the buyer's
// problem ("Commercial accounts rarely call first…") because the only category label then
// available was "HVAC lead generation" — the phrase every residential per-lead seller uses
// for itself. "Managed outbound for established commercial HVAC contractors" is not their
// phrase: it says what we run, and for whom, in the first line a visitor or an answer engine
// reads. The searched phrase, "commercial HVAC lead generation", is in the eyebrow and is the
// subject of its own page.
//
// THE DECK IS THE ONE POSITIONING SENTENCE, VERBATIM, AS LITERAL TEXT. The site hero is one of
// exactly three surfaces the operating system sanctions for it (core/offer.POSITIONING
// "surfaces" = site hero, proposal, reply bridge), and scripts/check_cross_repo.py in that
// repo reads THIS FILE for the words — so they are typed here, not imported, and
// tests/pricing-model.test.ts holds them equal to `positioningSentence` in lib/content.ts.
// Do not put a tag, an expression or a comment inside the sentence.
function Hero() {
  return (
    <section className="border-b border-line bg-paper px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Commercial HVAC lead generation · managed outbound
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
          For established HVAC contractors that already sell and complete commercial work,
          anywhere in the United States. The accounts are property managers, building owners and
          facility teams in the areas you serve — never homeowners.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryCta />
          <p className="text-sm leading-6 text-subtle">
            {QUESTION_COUNT} questions, {intakeMinutes} minutes · a straight answer either way
          </p>
        </div>
        <p className="mt-6 max-w-2xl border-l-2 border-accent/45 pl-4 text-base leading-7 text-subtle">
          Start with a {audit.name}: 3–5 commercial accounts near you, each with a source link
          you can open, plus one sample message. No call required. Yours to keep either way.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ProgressionSection() {
  return (
    <Section
      id="progression"
      eyebrow="What we do"
      title="Find the accounts. Create engagement. Carry it as far as you chose. Hand it to your team."
      intro="One progression, the same on every plan until someone shows genuine interest. What happens after that is the only thing the plans change."
      tint
    >
      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        {progression.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-line bg-paper p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 leading-7 text-subtle">
        <Link
          href="/commercial-hvac-lead-generation"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          Commercial HVAC lead generation, explained in full
        </Link>{" "}
        — who we contact, the whole funnel, and how this differs from buying leads.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// The argument: why the work is worth money at all.
//
// The discipline that makes it publishable: it invokes the buyer's economics WITHOUT
// asserting a number, and it describes how the MARKET works, never the state of the reader's
// own shop (D-024): "nobody in a busy shop has the hours" is a fact about busy shops, not a
// diagnosis of his.
function PositioningSection() {
  return (
    <section className="scroll-mt-20 border-t border-line bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Why this exists
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl">
          The property manager you want as an account already has a contractor. Until someone
          writes to them.
        </h2>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-subtle">
          <p>
            Commercial work is won differently from residential. The buyer is a property manager,
            a building owner, a facilities director, a general contractor. They do not search for
            an HVAC company when a rooftop unit fails; they call whoever holds the account. The
            account changes hands when somebody else has been in touch, with a reason.
          </p>
          <p>
            Almost nobody in a busy shop has the hours for that. Researching which buildings and
            portfolios are worth pursuing, finding the right person at each, and writing to them
            with a reason is a job in itself, and it is the first thing that drops in season.
          </p>
          <p className="text-ink/90">
            We will not tell you what an account is worth — you know what a service agreement
            across a portfolio is worth to you better than we do. We do not promise that a single
            one will sign. What we do is find them, contact the right person in your name, carry
            each opportunity as far as your plan says, and show you exactly what went where.
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-accent">
          <li>Accounts researched, not bought</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Cited public sources</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Sent from your domain</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Never homeowners</li>
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** "$750, $1,500, $2,500" — derived from `plans` so the headline prices can never drift
 *  from the plan cards directly below them. */
const priceList = plans.map((p) => `$${p.price.toLocaleString()}`).join(", ");

// THREE LEVELS OF RESPONSIBILITY, NOT THREE SIZES. Each card leads with the one sentence that
// says what we become responsible for, then the chain we own, what reaches the contractor and
// under what name, and what stays with him. The capacity limit is the LAST line and is
// labelled as a limit, because a message count must never read as the reason a plan costs
// more (D-027 §1). `id="pricing"` is kept: it is an anchor outbound email has linked to.
function PlansSection() {
  return (
    <Section
      id="pricing"
      eyebrow="Three levels of responsibility"
      title="You choose how far we carry each opportunity. The price follows that, not the message count."
      intro={`${priceList} a month — flat, with no setup fee, month-to-month, and 14 days’ notice either side. Never priced per lead or per opportunity.`}
    >
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
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
              <dd className="mt-4 text-sm leading-6 text-subtle">{plan.bestFor}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                We own
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.owns.join(" → ")}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                What reaches you
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.handoff.label}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Your side
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.youKeep}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
                Capacity limit
              </dt>
              <dd className="mt-2 text-xs leading-5 text-subtle">{plan.capacity}</dd>
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta />
        <p className="text-sm leading-6 text-subtle">
          The fit check suggests a plan from your answers. Nothing is agreed until you have seen
          the audit.{" "}
          <Link
            href="/pricing#who-owns-what"
            className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
          >
            Who owns what on each plan, line by line
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// The boundary that holds on every plan, given its own section so it is never inferred from
// an absence. The list is core/offer.CONTRACTOR_BOUNDARY, rendered from the one array.
function BoundarySection() {
  return (
    <Section id="boundary" eyebrow="Where our work stops" title={boundarySentence} tint>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-subtle">
        That is true on every plan, including the top one. We carry an opportunity as far as your
        plan says and no further. On no plan do we:
      </p>
      <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {contractorBoundary.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-subtle">
            <span aria-hidden="true" className="mt-1 shrink-0 text-subtle">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 leading-7 text-subtle">
        <Link
          href="/how-it-works"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          How it works, step by step
        </Link>{" "}
        — including the qualification standard, the handoff definitions, and when a call happens.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// `id="get-audit"` is load-bearing: it is the anchor guide pages and the client service
// agreement have historically pointed at. Renaming it breaks links we do not control.
function OfferSection() {
  return (
    <Section id="offer" eyebrow="Start here — free" title={audit.name} intro={audit.tagline}>
      <div id="get-audit" className="scroll-mt-20" />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {audit.includes.map((item) => (
          <li key={item.title} className="rounded-lg border border-line bg-surface p-5">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-2">
        <p className="leading-7 text-subtle">
          <span className="font-semibold text-accent">Why it’s free. </span>
          {audit.whyFree}
        </p>
        <p className="leading-7 text-subtle">
          <span className="font-semibold text-accent">What it is not. </span>
          {audit.guardrail}
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta />
        <Link
          href="/free-pipeline-audit"
          className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          What’s in the free pipeline audit, in full
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
      title="This needs commercial work already on the books, and room for more of it."
      intro="Two lists, so you can rule yourself in or out in about ten seconds."
      tint
    >
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            A strong fit
          </h3>
          <ul className="mt-5 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-ink/90">
                <span aria-hidden="true" className="mt-1 shrink-0 text-accent">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-paper p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
            Not a fit
          </h3>
          <ul className="mt-5 space-y-3">
            {notFor.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-subtle">
                <span aria-hidden="true" className="mt-1 shrink-0 text-subtle">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Where the company IS and where it SERVES, as two facts — both read from config so
          they cannot drift from the legal footer. */}
      <p className="mt-6 max-w-2xl leading-7 text-subtle">
        {brandName} is a founder-run company based in {basedIn}. The work is done remotely, so we
        serve established HVAC contractors anywhere in the United States: the account research
        runs in your service area, not ours.
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
      title="Five steps. Nothing is sent until you have signed off."
      intro="You confirm the account profile, the exclusions, the claims we may make and the sending identity before the first message goes out."
    >
      <ol className="mt-10 space-y-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-[auto_1fr]"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-sm font-semibold text-accent"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 leading-7 text-subtle">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 leading-7 text-subtle">
        <Link
          href="/how-it-works"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          How commercial HVAC managed outbound works, in full
        </Link>{" "}
        — and{" "}
        <Link
          href="/pricing#timeline"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          the timeline after you sign, day by day
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// The proof section for a company that has no proof of the usual kind. Everything listed is
// checkable on this site today; nothing is a client result.
function CredibilitySection() {
  return (
    <Section
      id="why-us"
      eyebrow="Why believe any of this"
      title="No case studies. Here is what you can check instead."
      tint
    >
      {/* Conditional on purpose: this reads true either way. Empty today, and the moment
          lib/content.ts `reviews` gets its first real, consented entry this line flips to
          pointing at it — no second content change needed. */}
      <p className="text-sm leading-6 text-subtle">
        {reviews.length > 0 ? (
          <>
            What we do have:{" "}
            <Link
              href="/reviews"
              className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
            >
              real client reviews
            </Link>
            , published only with the client&rsquo;s own words and named consent.
          </>
        ) : (
          <>
            As of this page, there are no client reviews yet — this is a young company and we said
            so above rather than inventing any.{" "}
            <Link
              href="/reviews"
              className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
            >
              The reviews page
            </Link>{" "}
            will show real ones, with names and consent on file, the moment they exist.
          </>
        )}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {credibility.map((item) => (
          <div key={item.title} className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 leading-7 text-subtle">{item.body}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-12 font-display text-2xl text-ink">What makes this different</h3>
      <dl className="mt-5 space-y-5">
        {differentiators.map((item) => (
          <div key={item.title} className="border-l-2 border-accent/45 pl-4">
            <dt className="font-semibold text-ink">{item.title}</dt>
            <dd className="mt-1.5 leading-7 text-subtle">{item.body}</dd>
          </div>
        ))}
      </dl>

      {/* The risk-reversal stack. Every line is a clause that already binds us. Assembling
          them is the cheapest conversion work available: nothing new is promised, it is only
          that the promises are finally in one readable place. */}
      <h3 className="mt-12 font-display text-2xl text-ink">What you are actually risking</h3>
      <p className="mt-3 max-w-2xl leading-7 text-subtle">
        Every line below is already in the agreement or the published Terms. None of them is a
        promise about results. Nobody can honestly make you one of those.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {riskReversal.map((item) => (
          <div key={item.title} className="rounded-lg border border-line bg-paper p-5">
            <dt className="font-semibold text-ink">{item.title}</dt>
            <dd className="mt-1.5 leading-7 text-subtle">{item.body}</dd>
            <dd className="mt-2 text-xs uppercase tracking-[0.14em] text-accent">{item.clause}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm leading-6 text-subtle">
        Read them yourself in the{" "}
        <Link
          href="/terms"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          Terms of Service
        </Link>{" "}
        before you talk to us, not after.
      </p>

      <p className="mt-10 rounded-lg border border-line bg-paper p-5 leading-7 text-subtle">
        <span className="font-semibold text-accent">Who runs it. </span>
        The research, the writing, the sending and the reply handling run on an automated system,
        with {founderName} accountable for it. Every message clears hard gates before it can
        send: citations, opt-out suppression, duplicates, daily sending caps. There is no account
        manager between you and the person responsible.{" "}
        <Link
          href="/about"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          About {brandName}
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// Answers render open, always. They must be readable and crawlable without interaction,
// which is also what keeps the FAQPage structured data honest — markup may only mirror text
// a visitor can actually see. Collapsing this is a regression.
function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="The questions commercial HVAC owners actually ask.">
      <div className="mt-10 space-y-10">
        {faqGroups.map((group) => {
          const inGroup = faqs.filter((f) => f.group === group);
          if (inGroup.length === 0) return null;
          return (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {group}
              </h3>
              <div className="mt-3 divide-y divide-line border-y border-line">
                {inGroup.map((faq) => (
                  <div key={faq.question} id={faqSlug(faq.question)} className="scroll-mt-20 py-5">
                    <h4 className="text-lg font-semibold text-ink">{faq.question}</h4>
                    <p className="mt-2 max-w-3xl leading-7 text-subtle">{faq.answer}</p>
                  </div>
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
      {/* The anchor text is the LABEL only; the card stays entirely clickable via the
          stretched pseudo-element on the link. */}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {guidePages.map((page) => (
          <li
            key={page.slug}
            className="relative flex h-full flex-col rounded-lg border border-line bg-paper p-4 transition-colors hover:border-accent/45"
          >
            <Link
              href={`/${page.slug}`}
              className="font-semibold leading-7 text-ink after:absolute after:inset-0 after:content-['']"
            >
              {page.navLabel}
            </Link>
            <span className="mt-1 text-sm leading-6 text-subtle">{page.description}</span>
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
          {intakeMinutes} minutes of questions, then a straight answer either way. If it is a fit,
          we build your {audit.name.toLowerCase()} and email it within {auditDeliveryWindow}.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryCta />
        </div>
        <p className="mt-4 text-sm text-subtle">No card, and no call required to get the audit.</p>
      </div>
    </section>
  );
}
