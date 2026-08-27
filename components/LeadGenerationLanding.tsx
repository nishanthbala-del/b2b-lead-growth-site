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
} from "@/lib/content";
import { brandName, currentFocusArea, founderName, intakeMinutes } from "@/lib/site";
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
  { label: "What you get", href: "#offer" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const steps = [
  {
    title: "You send one export",
    body: "Past customers, open and expired estimates, maintenance agreements, missed calls. Straight out of ServiceTitan, Housecall Pro, Jobber, QuickBooks or a spreadsheet. It does not need to be clean.",
  },
  {
    title: "We agree what a good job looks like",
    body: "Service area, system types, job values you want — and the work you would rather turn down. You correct it. We do not proceed on a definition you have not seen.",
  },
  {
    title: "We rank your list and research your partners",
    body: "Your records deduped, suppression-checked and ranked by how close each one is to a real job. Referral partners near you researched from public sources, each with the source link attached.",
  },
  {
    title: "You approve the messaging and the first batch",
    body: "In your words, before anyone reads them. If you do not respond we hold. Silence is never taken as approval.",
  },
  {
    title: "It goes out from your domain, slowly",
    body: "Five a day for the first three days, then ten, then full volume. Opt-outs are suppressed instantly and permanently. You can open your sent folder and read every message.",
  },
];

// What can honestly be offered as evidence by a company with no clients yet. Every
// item is something a visitor can check for themselves on this site, today. Nothing
// here is a result, a testimonial, or a claim about another company's outcome.
const credibility = [
  {
    title: "The audit is the sample",
    body: "Real work on your company, handed over before any money changes hands. Judge the service on that rather than on anything we say here.",
  },
  {
    title: "Every price is published",
    body: "Three tiers, on this page, with the monthly ceiling each one carries. Nothing is quoted only on a call.",
  },
  {
    title: "Every researched prospect carries its source",
    body: "A public link you can open, plus the specific reason it was picked. No citation means it cannot be contacted at all.",
  },
  {
    title: "No case studies, and we will not borrow any",
    body: "This is a new, founder-led service. There are no client results to show, so there are none on this site.",
  },
];

export default function LeadGenerationLanding() {
  return (
    <div className="min-h-screen bg-ink-950 text-bone">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-gold-500/70 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gold-200"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Hero />
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
      className={`inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.015] ${className}`}
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
      className={`scroll-mt-20 border-t border-gold-500/12 px-5 py-16 sm:px-8 sm:py-20 lg:py-24 ${
        tint ? "bg-ink-900" : "bg-ink-950"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-bone sm:text-4xl">
          {title}
        </h2>
        {intro ? <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{intro}</p> : null}
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
    <header className="border-b border-gold-500/14 bg-ink-950">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="Primary"
      >
        <Link href="/" className="font-display text-lg text-gold-200 sm:text-xl">
          {brandName}
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-gold-200"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={CTA_HREF}
            className="inline-flex min-h-11 shrink-0 items-center rounded-sm border border-gold-500/55 bg-gold-sheen px-4 text-xs font-semibold text-ink-950 sm:text-sm"
          >
            {CTA_LABEL}
          </Link>
          <details className="relative md:hidden">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-sm border border-gold-500/40 text-gold-200 [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ☰
              </span>
            </summary>
            <div className="absolute right-0 top-12 z-20 w-56 rounded-sm border border-gold-500/25 bg-ink-900 p-1 shadow-panel">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center border-b border-gold-500/10 px-3 text-sm text-muted last:border-0 hover:text-gold-200"
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
function Hero() {
  return (
    <section className="border-b border-gold-500/12 bg-ink-950 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/85">
          HVAC lead generation &amp; appointment setting
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-bone sm:text-5xl lg:text-6xl">
          The jobs you already quoted are still sitting in your system.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
          We follow up the unsold estimates, lapsed maintenance agreements and past customers
          inside your own records — and build referral partnerships near you. For established
          residential HVAC companies. Sent from your domain, with your sign-off.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryCta />
          <p className="text-sm leading-6 text-muted">
            {intakeMinutes} minutes · a straight answer either way
          </p>
        </div>
        <p className="mt-6 max-w-2xl border-l-2 border-gold-500/40 pl-4 text-base leading-7 text-bone/85">
          Start with a {audit.name.toLowerCase()}: real work on your company, sent to you in
          writing. No call required, and yours to keep whether or not you hire us.
        </p>
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
          <li key={item.title} className="rounded-lg border border-gold-500/18 bg-ink-950/60 p-5">
            <h3 className="text-lg font-semibold text-bone">{item.title}</h3>
            <p className="mt-2 leading-7 text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 rounded-lg border border-gold-500/18 bg-ink-950/60 p-5 sm:grid-cols-2">
        <p className="leading-7 text-muted">
          <span className="font-semibold text-gold-200">Why it’s free. </span>
          {audit.whyFree}
        </p>
        <p className="leading-7 text-muted">
          <span className="font-semibold text-gold-200">What it is not. </span>
          {audit.guardrail}
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta />
        <Link
          href="/free-pipeline-audit"
          className="text-sm font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
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
        <div className="rounded-lg border border-gold-500/30 bg-ink-900/70 p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
            A strong fit
          </h3>
          <ul className="mt-5 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-bone/90">
                <span aria-hidden="true" className="mt-1 shrink-0 text-gold-200">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gold-500/12 bg-ink-900/40 p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Not a fit
          </h3>
          <ul className="mt-5 space-y-3">
            {notFor.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-muted">
                <span aria-hidden="true" className="mt-1 shrink-0 text-muted/70">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 max-w-2xl leading-7 text-muted">
        Work is done remotely for HVAC companies across the US. Campaigns currently focus on{" "}
        {currentFocusArea}, so that is where the local knowledge is sharpest today.
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
            className="grid gap-4 rounded-lg border border-gold-500/14 bg-ink-950/60 p-5 sm:grid-cols-[auto_1fr]"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold-500/32 text-sm font-semibold text-gold-200"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-bone">{step.title}</h3>
              <p className="mt-2 leading-7 text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 leading-7 text-muted">
        <Link
          href="/pricing#timeline"
          className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
        >
          The full timeline, day by day
        </Link>{" "}
        — including which steps are yours and what sets the start date.
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

// One table, one CTA. It was three large cards with three different buttons, which
// asked a visitor to commit to a tier before anyone had looked at their list.
function PricingSection() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Flat monthly fee. Never priced per lead."
      intro="The tiers differ by how much of the work stays in your office. No setup fee, month-to-month, 14 days’ notice either side, and everything built for you is yours to keep."
    >
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-lg border p-6 ${
              plan.featured
                ? "border-gold-500/60 bg-ink-900"
                : "border-gold-500/16 bg-ink-900/50"
            }`}
          >
            {plan.featured ? (
              <p className="mb-4 w-fit rounded-sm border border-gold-500/45 bg-gold-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-200">
                Most chosen starting point
              </p>
            ) : null}
            <h3 className="font-display text-2xl text-bone">{plan.name}</h3>
            <p className="mt-3 text-3xl font-semibold text-bone">
              ${plan.price.toLocaleString()}
              <span className="text-base font-normal text-muted">/mo</span>
            </p>
            <p className="mt-3 font-semibold text-gold-200">{plan.oneLiner}</p>
            <p className="mt-1 text-sm text-muted">{plan.capacity}</p>
            <p className="mt-4 text-sm leading-6 text-bone/85">{plan.bestFor}</p>
            <ul className="mt-4 space-y-2 border-t border-gold-500/14 pt-4">
              {plan.includes.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-6 text-muted">
                  <span aria-hidden="true" className="mt-0.5 shrink-0 text-gold-200">
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-gold-500/14 pt-4 text-sm leading-6 text-muted/85">
              <span className="font-semibold text-gold-200/90">Stays with you: </span>
              {plan.youKeep}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryCta />
        <p className="text-sm leading-6 text-muted">
          The fit check recommends a tier. Nothing is agreed until you have seen the audit.{" "}
          <Link
            href="/pricing"
            className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
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
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {credibility.map((item) => (
          <div key={item.title} className="rounded-lg border border-gold-500/16 bg-ink-950/60 p-5">
            <h3 className="text-lg font-semibold text-bone">{item.title}</h3>
            <p className="mt-2 leading-7 text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-12 font-display text-2xl text-bone">What makes this different</h3>
      <dl className="mt-5 space-y-5">
        {differentiators.map((item) => (
          <div key={item.title} className="border-l-2 border-gold-500/35 pl-4">
            <dt className="font-semibold text-bone">{item.title}</dt>
            <dd className="mt-1.5 leading-7 text-muted">{item.body}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 rounded-lg border border-gold-500/18 bg-ink-950/60 p-5 leading-7 text-muted">
        <span className="font-semibold text-gold-200">Who runs it. </span>
        The research, writing, follow-up and reply handling are run by an automated system, with{" "}
        {founderName} accountable for it. Every draft is checked against hard gates — citations,
        opt-out suppression, duplicates, daily sending caps — before it can send. There is no
        account manager between you and the person responsible.
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
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/80">
                {group}
              </h3>
              <div className="mt-3 divide-y divide-gold-500/12 border-y border-gold-500/12">
                {inGroup.map((faq) => (
                  <div key={faq.question} id={faqSlug(faq.question)} className="scroll-mt-20 py-5">
                    <h4 className="text-lg font-semibold text-bone">{faq.question}</h4>
                    <p className="mt-2 max-w-3xl leading-7 text-muted">{faq.answer}</p>
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
      intro="Written for contractors weighing up their options, including the ones that aren’t us. Cited throughout, with no form in front of any of it."
      tint
    >
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {guidePages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/${page.slug}`}
              className="flex h-full flex-col rounded-lg border border-gold-500/16 bg-ink-950/60 p-4 transition-colors hover:border-gold-500/40"
            >
              <span className="font-semibold leading-7 text-bone">{page.navLabel}</span>
              <span className="mt-1 text-sm leading-6 text-muted">{page.description}</span>
            </Link>
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
      className="scroll-mt-20 border-t border-gold-500/12 bg-ink-950 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl leading-tight text-bone sm:text-4xl">
          Find out what your list is worth before you pay anything.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
          {intakeMinutes} minutes of questions, then a straight answer. If it is a fit, we build
          your {audit.name.toLowerCase()} and send it over in writing.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryCta />
        </div>
        <p className="mt-4 text-sm text-muted">No card. No call required to get the audit.</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-gold-500/12 bg-ink-950 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl text-sm text-muted">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg text-gold-200">{brandName}</p>
            <p className="mt-2 leading-6">
              HVAC lead generation and appointment setting for established residential HVAC
              companies. Remote across the US, currently focused on {currentFocusArea}.
            </p>
          </div>
          <nav aria-label="Guides and legal" className="md:min-w-56">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/80">
              More
            </p>
            <ul className="mt-1">
              {guidePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-gold-200"
                  >
                    {page.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-gold-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-gold-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-gold-500/12 pt-6 leading-6">
          © {new Date().getFullYear()} {brandName} · We commit to running the system, doing the
          work to the stated standard, and reporting results honestly. We do not promise jobs,
          revenue, customers, or a set number of appointments — whether a homeowner books and buys
          depends on your pricing, your reputation, your timing, and how the visit goes.
        </p>
      </div>
    </footer>
  );
}
