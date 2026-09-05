import Link from "next/link";
import {
  audit,
  differentiators,
  faqGroups,
  faqSlug,
  faqs,
  idealFor,
  notFor,
  plans,
  reviews,
  riskReversal,
} from "@/lib/content";
import {
  auditDeliveryWindow,
  brandName,
  contactEmail,
  currentFocusArea,
  entityFormationState,
  founderName,
  intakeMinutes,
  legalEntityName,
} from "@/lib/site";
import { guidePages } from "@/lib/pages";

/* -------------------------------------------------------------------------- */
/*  The landing page                                                           */
/* -------------------------------------------------------------------------- */
//
// A SERVER component with no JavaScript of its own. It replaced a 2,175-line client
// component carrying Lenis smooth scroll, a GSAP pinned section, framer-motion
// scroll reveals, a custom cursor, magnetic buttons, tilting cards and a count-up
// animation — about 85 kB of script whose entire job was decoration.
//
// That layer was not neutral. It broke every deep link into the page (Lenis rewrote
// the browser's hash scroll; the GSAP pin then moved every anchor below it by ~4,300px),
// it server-rendered every content block at `opacity: 0` so the page was blank without
// JS, and it put a spring-lagged dot between the reader and the text. Deleting it fixed
// all of that by removing the cause rather than working around it.
//
// The page is now nine sections in the order a buyer actually decides in: what it is,
// what you get, whether it is you, how it runs, what it costs, why believe any of it,
// the objections, further reading, and one way to start. There is exactly ONE call to
// action on the page — "See if we're a fit" — pointing at /start.

/** The single primary action, used verbatim everywhere on the site. */
const CTA_LABEL = "See if we’re a fit";
const CTA_HREF = "/start";

// Four nav items. It was seven, which on a page this short is a table of contents for
// a document nobody is going to read end to end.
const navItems = [
  { label: "The free audit", href: "#offer" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const steps = [
  {
    title: "You send one export",
    body: "Past customers, unsold estimates, lapsed agreements, missed calls. Any format: ServiceTitan, Housecall Pro, Jobber, QuickBooks, a spreadsheet. It does not need to be clean.",
  },
  {
    title: "We draft the job profile, you correct it",
    body: "Service area, system types, the jobs you want and the ones you would rather turn down. We never proceed on a definition you have not seen.",
  },
  {
    title: "We rank your list and research your partners",
    body: "Duplicates and opt-outs come out. What is left is ranked by how close each record is to a real job. Referral partners near you are researched from public sources, each with its source link.",
  },
  {
    title: "You approve the messaging and the first batch",
    body: "In your words, before anyone reads them. If you do not respond we hold. Silence is never taken as approval.",
  },
  {
    title: "It goes out from your domain, slowly",
    // The ramp the send gate actually enforces (presend-gate.py WARMUP_RAMP). This read
    // "Five a day for the first three days, then ten" — 5x the real day-one volume.
    body: "One message the first day, two the next, then five, then ten, then full volume from about day six. Opt-outs are suppressed instantly and permanently. You can open your sent folder and read every message.",
  },
];

// What can honestly be offered as evidence by a company with no clients yet. Every
// item is something a visitor can check for themselves on this site, today. Nothing
// here is a result, a testimonial, or a claim about another company's outcome.
const credibility = [
  {
    title: "The audit is the sample",
    body: "Real work on your company, handed over before any money changes hands. Judge us on that, not on anything we say here.",
  },
  {
    title: "Every price is published",
    body: "Three tiers on this page, each with its monthly ceiling. Nothing is quoted only on a call.",
  },
  {
    title: "Every researched prospect carries its source",
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
      <SiteNav />
      <main id="main">
        <Hero />
        <PositioningSection />
        <OfferSection />
        <WhoItsForSection />
        <HowItWorksSection />
        <PricingSection />
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

// Zero-JS navigation. The mobile menu is a <details> disclosure, which is keyboard
// accessible, announced correctly, and works before (or without) hydration — the
// previous version was a React state toggle that needed the whole bundle to open.
function SiteNav() {
  return (
    <header className="border-b border-line bg-paper">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="Primary"
      >
        <Link href="/" className="font-display text-lg text-accent sm:text-xl">
          {brandName}
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-subtle transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={CTA_HREF}
            className="inline-flex min-h-11 shrink-0 items-center rounded-sm border border-accent/45 bg-accent-fill px-4 text-xs font-semibold text-paper sm:text-sm"
          >
            {CTA_LABEL}
          </Link>
          <details className="relative md:hidden">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-sm border border-accent/45 text-accent [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ☰
              </span>
            </summary>
            <div className="absolute right-0 top-12 z-20 w-56 rounded-sm border border-line bg-surface p-1 shadow-card">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center border-b border-line px-3 text-sm text-subtle last:border-0 hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

// The five-second test: what this is, who it is for, the problem, and one action.
// The old hero opened with a 60-word paragraph and three competing buttons.
//
// THE H1 STAYS ON THE BUYER'S PROBLEM, NOT ON THE CATEGORY. Between 2026-08-30 and
// 2026-09-05 this H1 read "HVAC lead generation that starts with the jobs you already
// quoted", moved there so that some heading on the page would contain the primary
// keyword. The SEO reasoning was sound and the wording was not: "HVAC lead generation"
// is what Angi, Thumbtack and every per-lead seller call themselves, so opening with it
// files this business into the one category this buyer has already been burned by,
// before it has earned a sentence. The keyword requirement is real, so it is satisfied
// where it costs nothing — the eyebrow, which is a heading-adjacent line an answer
// engine reads and a skimming owner does not weigh emotionally, and the H2s below.
// The H1 goes back to the line that starts inside the reader's own head.
//
// THE DECK IS D-021'S POSITIONING SENTENCE, VERBATIM. The site hero is one of exactly
// three surfaces that decision sanctions for it (core/offer.POSITIONING["surfaces"] =
// site hero, proposal, reply bridge), and until now it appeared on NONE of them — the
// one sentence written to stop a prospect meeting a different company on the site than
// in the email was live nowhere. Copy it exactly if it changes: the canonical string is
// `core.offer.positioning_sentence()` in the operating-system repo, and the whole point
// of D-021 is that a sixth independent phrasing never gets written. The verb stays on
// the WORK (ours, real today, checkable); the metric is counted after the fact and is
// never promised — that is what makes the sentence shippable at zero clients.
function Hero() {
  return (
    <section className="border-b border-line bg-paper px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          HVAC lead generation for established residential contractors
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
          The jobs you already quoted are still sitting in your system.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-subtle sm:text-xl">
          {brandName} runs the outbound and the follow-up for established HVAC companies, and we
          measure the work by one thing: qualified conversations started. That means your unsold
          estimates, lapsed maintenance agreements and past customers — plus researched referral
          partners near you — worked every week, from your own domain, with your sign-off.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryCta />
          <p className="text-sm leading-6 text-subtle">
            10 questions, {intakeMinutes} minutes · a straight answer either way
          </p>
        </div>
        <p className="mt-6 max-w-2xl border-l-2 border-accent/45 pl-4 text-base leading-7 text-subtle">
          Start with a {audit.name}: 3–5 referral partners near you, each with a source link you
          can open, plus one sample message. No call required. Yours to keep either way.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

// The argument. The page used to go from the H1 straight to being sold a free thing:
// one sentence of problem framing, then the offer, the fit lists, the process and the
// price. Nowhere did it say why the stuff sitting in an HVAC owner's system is worth
// money — which is the whole premise, and the only reason any of the rest matters.
//
// The copy is not new. `20_MARKETING_MY_SERVICES_SYSTEM/website_copy.md` has specified
// this section, headline included, since the site was written; it was simply never
// built. Keep the two in step. The paragraphs below were compressed in the readability
// pass (167 words to ~120): the headline and the argument are unchanged and every fact
// survived, but the wording is now tighter than the source doc's — re-sync there if it
// is ever regenerated.
//
// The discipline that makes it publishable: it invokes the buyer's economics WITHOUT
// asserting a number. "You know what a replacement is worth to you" uses his arithmetic;
// "these are worth $X to you" would be inventing one, and "this will recover N of them"
// would be an outcome promise. Neither belongs here, at any point, ever.
function PositioningSection() {
  return (
    <section className="scroll-mt-20 border-b border-line bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Why this exists
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl">
          The most expensive lead you will ever buy is the one you already bought.
        </h2>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-subtle">
          <p>
            You already paid for every estimate you have written: the ad that brought it in, the
            drive, the hour in somebody&rsquo;s attic. Most did not close. They are still in your
            system, beside the lapsed maintenance agreements, the missed calls, and the customers
            whose systems are now at replacement age.
          </p>
          <p>
            Almost nobody works that list. The techs are on trucks, the office is answering phones,
            and follow-up is the first thing that drops in season.
          </p>
          <p className="text-ink/90">
            We will not tell you what that is worth — you know what a replacement is worth to you
            better than we do. We do not promise that a single one of them will close. What we do
            is work the list every week and show you exactly what went where.
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-accent">
          <li>Your list, cleaned and ranked</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Cited public sources</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Sent from your domain</li>
          <li aria-hidden="true" className="text-accent">·</li>
          <li>Nothing sold per lead</li>
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

// `id="get-audit"` is load-bearing: it is the anchor five guide pages and the client
// service agreement have historically pointed at. Renaming it breaks links we do not
// control.
function OfferSection() {
  return (
    <Section
      id="offer"
      eyebrow="Start here — free"
      title={audit.name}
      intro={audit.tagline}
      tint
    >
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
          What’s in the audit, in full
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
      title="This needs a customer list and room for the work."
      intro="Two lists, so you can rule yourself in or out in about ten seconds."
    >
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6">
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
        <div className="rounded-lg border border-line bg-surface p-6">
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
      {/* Names the base as well as the reach. The homepage said where the work is DELIVERED
          and never where the company IS — a fact the footer and the New Jersey guide both
          state, and the one an answer engine needs to ground the entity. Both halves read
          from config so they cannot drift from the legal footer. */}
      <p className="mt-6 max-w-2xl leading-7 text-subtle">
        {brandName} is a {entityFormationState} company and works remotely with HVAC companies
        across the US. Our market research is focused on {currentFocusArea}, so that is where the
        local knowledge is sharpest today.
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
      title="Five steps. You control three of them."
      intro="Nothing is contacted until your records are imported and you have approved them."
      tint
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
          href="/pricing#timeline"
          className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
        >
          The full timeline, day by day
        </Link>{" "}
        — including which steps are yours and what sets the start date.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

/** "$750, $1,500, $2,500" — derived from `plans` so the headline prices can never drift
 *  from the tier cards directly below them. The section's intro sentence carried no number
 *  at all, which meant the line most likely to be lifted out of this page and quoted did
 *  not contain a price. */
const priceList = plans.map((p) => `$${p.price.toLocaleString()}`).join(", ");

// One list, one CTA. It was three large cards with three different buttons, which
// asked a visitor to commit to a tier before anyone had looked at their list.
function PricingSection() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Flat monthly fee. Never priced per lead."
      intro={`${priceList} a month, by tier. The tiers differ by how much stays in your office: list building, outreach, or appointment setting. No setup fee, month-to-month, and 14 days’ notice either side. Everything built for you is yours to keep.`}
    >
      {/* The unit every price is quoted in, defined before the first number that uses it.
          "Up to ~40 records a month" was on all three cards and the word appeared 33 times
          across the site, but the only definition sat in an FAQ far below the table — so a
          buyer met the price before he could tell whether 40 was a lot. */}
      <p className="mt-6 rounded-lg border border-line bg-surface p-4 leading-7 text-subtle">
        <span className="font-semibold text-accent">One record</span> = one person or business
        to reach out to: a past customer, an unsold estimate, a lapsed agreement, or one referral
        partner.
      </p>
      {/* Three tiers as a LIST of definition lists, not three styled <div>s.

          The price, the monthly ceiling, what is included and what stays with you were
          sibling paragraphs with no stated relationship between them, so the most quotable
          facts on the site were the least machine-readable thing on the page — while other
          companies' prices sat in a real <table> on the guide pages. dt/dd states the pair.

          The visual language is unchanged: the labels a sighted reader does not need are
          sr-only, and only "Included" and "Your side" (which already had an implicit label
          and an inline one) render. Each tier carries a stable id so a specific tier can be
          linked to and cited rather than the pricing block as a whole. */}
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.name}
            id={`plan-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`flex scroll-mt-20 flex-col rounded-lg border p-6 ${
              plan.featured
                ? "border-accent/45 bg-surface"
                : "border-line bg-surface"
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
              <dt className="sr-only">What this tier does</dt>
              <dd className="mt-3 font-semibold text-accent">{plan.oneLiner}</dd>
              <dt className="sr-only">Monthly ceiling</dt>
              <dd className="mt-1 text-sm text-subtle">{plan.capacity}</dd>
              <dt className="sr-only">Best for</dt>
              <dd className="mt-4 text-sm leading-6 text-subtle">{plan.bestFor}</dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Included
              </dt>
              <dd className="mt-3">
                <ul className="space-y-2">
                  {plan.includes.map((line) => (
                    <li key={line} className="flex gap-2 text-sm leading-6 text-subtle">
                      <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
                        ✓
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </dd>
              <dt className="mt-4 border-t border-line pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Your side
              </dt>
              <dd className="mt-2 text-sm leading-6 text-subtle">{plan.youKeep}</dd>
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta />
        <p className="text-sm leading-6 text-subtle">
          The fit check recommends a tier. Nothing is agreed until you have seen the audit.{" "}
          <Link
            href="/pricing"
            className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
          >
            Billing and cancellation terms
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// The proof section for a company that has no proof of the usual kind. Everything
// listed is checkable on this site today; nothing is a client result.
function CredibilitySection() {
  return (
    <Section
      id="why-us"
      eyebrow="Why believe any of this"
      title="No case studies. Here is what you can check instead."
      tint
    >
      {/* Conditional on purpose: this reads true either way. Empty today (no real client has
          left one), and the moment lib/content.ts `reviews` gets its first real, consented entry
          (see scripts/record_review.py in the operating-system repo) this line flips to pointing
          at it — no second content change needed. */}
      <p className="text-sm leading-6 text-muted">
        {reviews.length > 0 ? (
          <>
            What we do have:{" "}
            <Link
              href="/reviews"
              className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
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
              className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
            >
              The reviews page
            </Link>{" "}
            will show real ones, with names and consent on file, the moment they exist.
          </>
        )}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {credibility.map((item) => (
          <div key={item.title} className="rounded-lg border border-line bg-surface p-5">
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

      {/* The risk-reversal stack. Every line is a clause that already binds us — the
          notice period, the refund of an unbegun month, the citation make-good, the
          published-terms floor, work-product ownership, and data deletion. They existed
          in the contract and in the Terms and were marketed nowhere, so a buyer weighing
          a new company with no results had no idea how little he was actually risking.
          Assembling them is the cheapest conversion work available here: nothing new is
          promised, it is only that the promises are finally in one readable place. */}
      <h3 className="mt-12 font-display text-2xl text-ink">What you are actually risking</h3>
      <p className="mt-3 max-w-2xl leading-7 text-subtle">
        Every line below is already in the agreement or the published Terms. None of them is a
        promise about results. Nobody can honestly make you one of those.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {riskReversal.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-line bg-surface p-5"
          >
            <dt className="font-semibold text-ink">{item.title}</dt>
            <dd className="mt-1.5 leading-7 text-subtle">{item.body}</dd>
            <dd className="mt-2 text-xs uppercase tracking-[0.14em] text-accent">
              {item.clause}
            </dd>
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

      <p className="mt-10 rounded-lg border border-line bg-surface p-5 leading-7 text-subtle">
        <span className="font-semibold text-accent">Who runs it. </span>
        The research, writing, follow-up and reply handling run on an automated system, with{" "}
        {founderName} accountable for it. Every draft clears hard gates before it can send:
        citations, opt-out suppression, duplicates, daily sending caps. There is no account
        manager between you and the person responsible.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// Answers render open, always. They must be readable and crawlable without
// interaction, which is also what keeps the FAQPage structured data honest — markup
// may only mirror text a visitor can actually see. Collapsing this is a regression;
// it has been removed for that reason once already.
function FaqSection() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="The questions HVAC owners actually ask."
    >
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
      intro="Written for contractors weighing their options, including the ones that aren’t us. Cited throughout, and no form in front of any of it."
      tint
    >
      {/* The anchor text is the LABEL only. The whole card sat inside the <Link>, so each
          guide's anchor text and accessible name were the label run straight into a
          200-character meta description — "Pricing in detailTransparent HVAC lead generation
          and appointment setting pricing: $750…". The card stays entirely clickable via the
          stretched pseudo-element on the link, so nothing changes for a mouse or a thumb. */}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {guidePages.map((page) => (
          <li
            key={page.slug}
            className="relative flex h-full flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent/45"
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

/* -------------------------------------------------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl text-sm text-subtle">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg text-accent">{brandName}</p>
            <p className="mt-2 leading-6">
              HVAC lead generation and appointment setting for established residential HVAC
              companies. Remote across the US, currently focused on {currentFocusArea}.
            </p>
            {/* A reachable human. The site's single-CTA discipline is right, but it had
                become a rule that there was NO way to contact this business without first
                answering ten questions about your company — and an owner with one question
                ("do you work with Trane dealers?") had nowhere to put it. A named person, a
                real entity and a working mailbox are also the cheapest credibility a company
                with no track record can offer, and all three already existed in config while
                the footer printed none of them. */}
            <p className="mt-4 leading-6">
              <span className="text-ink">{legalEntityName}</span>, a {entityFormationState}{" "}
              limited liability company. Founder-run by {founderName}.
            </p>
            <p className="mt-2 leading-6">
              One question, no form:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
              >
                {contactEmail}
              </a>
            </p>
          </div>
          <nav aria-label="Guides and legal" className="md:min-w-56">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              More
            </p>
            <ul className="mt-1">
              {guidePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-accent"
                  >
                    {page.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* The no-outcome-promise line, halved. The clause explaining WHY nobody can promise a
            result — it depends on the contractor's price, reputation, timing, and how the visit
            goes — is stated in full in the FAQ answer "Do you guarantee jobs, appointments, or
            revenue?", so the footer carries the commitment and the refusal and stops there.
            The refusal itself is load-bearing and must not be trimmed further. "A set number of
            appointments" is deliberate: the Appointment Engine tier DOES book appointments, so a
            blunter "we do not promise appointments" would contradict the product. */}
        <p className="mt-8 border-t border-line pt-6 leading-6">
          © {new Date().getFullYear()} {brandName} · We commit to running the system, doing the
          work to the stated standard, and reporting honestly. We do not promise jobs, revenue,
          customers, or a set number of appointments.
        </p>
      </div>
    </footer>
  );
}
