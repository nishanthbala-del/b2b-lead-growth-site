import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getStandaloneRoute, pageMetadata, standalonePageJsonLd } from "@/lib/pages";
import QualificationFlow from "@/components/qualification/QualificationFlow";
import { ANSWER_KEYS, QUESTION_LABELS } from "@/lib/qualification";
import { callLengthMinutes, intakeMinutes } from "@/lib/site";

// The standalone home of the fit check.
//
// It needs a real URL of its own: it is the link that goes in an outbound email, the one an
// owner forwards to a partner, and the one someone returns to after thinking it over. A
// qualification step that exists only behind a button on one page cannot be any of those.
//
// INDEXABLE, deliberately. It is the one page that answers "is this service for a company
// like mine?" with a yes or a no, and it says on the server — before any JavaScript runs —
// who it is for, what it asks and what happens next. It is not a thin form page.

const route = getStandaloneRoute("start");

export const metadata: Metadata = pageMetadata({
  path: "/start",
  type: "website",
  title: route.metaTitle,
  description: route.description,
});

// WebPage + BreadcrumbList, from the same registry entry that sets the <title> and the
// canonical, so the structured description of this page cannot drift from its metadata.
const breadcrumbJsonLd = standalonePageJsonLd({
  slug: "start",
  navLabel: route.navLabel,
  metaTitle: route.metaTitle,
  description: route.description,
  dateModified: route.dateModified,
});

/** Read from the form itself, so the number on the page cannot drift from the questions. */
const QUESTION_COUNT = ANSWER_KEYS.length;

// Three short guarantees, shown as one line ABOVE the form, then in full BELOW it.
//
// They used to render as three cards between the intro and the first question, which on a
// 390px phone put the first input 1.6 screens down. The reassurance still has to come before
// the questions to make anyone willing to start, so it does — in a few words each, with the
// full version kept underneath for anyone who wants it.
const promises = [
  {
    short: "A straight answer, including no",
    title: "A straight answer, including no",
    body: "If your answers say we can't help you, the last screen says so and tells you why. It won't offer you a calendar to be polite.",
  },
  {
    short: "Free audit, no call required",
    title: "The audit is free, and no call is required",
    body: "If it is a fit, we build your pipeline audit — an account profile, 3–5 cited commercial accounts, one sample message — and email it to you. You never have to get on a call to receive it.",
  },
  {
    short: `A ${callLengthMinutes}-minute call only if you want one`,
    title: "A call only if you want one",
    body: `If you would rather walk through it together, pick a ${callLengthMinutes}-minute slot on the last screen. Nothing to email back and forth.`,
  },
];

export default function StartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageShell width="wide">
        <main id="main" className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Free pipeline audit · fit check first · about {intakeMinutes} minutes
          </p>
          {/* THE PAGE SAYS WHAT THE BUTTON SAID. Every primary button on the site reads "Get 3
              Commercial Accounts Free", so the first line here is the same deliverable, and the
              second says the one condition plainly: the audit follows a fit check whose honest
              answer can be no. A visitor who clicked for accounts and landed on "let's find out
              if this is for you" had been handed a different offer (conversion supplement,
              "CTA/message mismatch").
              Smaller on mobile than the rest of the site's H1s, deliberately. This page is a
              form, not a pitch: every vertical pixel above the first question is a pixel of
              abandonment risk on a phone. */}
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl">
            Get 3 commercial accounts in your market, free.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-subtle sm:text-lg sm:leading-8">
            Answer {QUESTION_COUNT} short questions. If this is a fit, we research your market and
            email you the free pipeline audit — 3&ndash;5 commercial accounts with a cited reason
            and a source link each, plus one sample message. If it isn&rsquo;t, the last screen
            says so and tells you why. Built for established HVAC contractors that already do
            commercial work.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {promises.map((p) => (
              <li key={p.title} className="flex items-center gap-2 text-sm text-subtle">
                <span aria-hidden="true" className="text-accent">✓</span>
                {p.short}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-line bg-surface px-6 py-2 shadow-card sm:px-8">
            <QualificationFlow />
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {promises.map((p) => (
              <li key={p.title} className="rounded-lg border border-line bg-surface p-5">
                <h2 className="text-sm font-semibold text-ink">{p.title}</h2>
                <p className="mt-2 text-sm leading-6 text-subtle">{p.body}</p>
              </li>
            ))}
          </ul>

          {/* What is asked, in full, before anyone has to start answering. Generated from the
              same labels /privacy publishes, so the two lists cannot describe different forms. */}
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="font-display text-2xl text-ink">What the fit check asks</h2>
            <p className="mt-3 max-w-2xl leading-7 text-subtle">
              Your name, work email, company and service area, then {QUESTION_COUNT} one-tap
              questions, of which the monthly fee is optional. Nothing asks for a customer list
              or an export. We ask:
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-6 text-subtle sm:grid-cols-2">
              {ANSWER_KEYS.map((key) => (
                <li key={key} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">·</span>
                  <span>{QUESTION_LABELS[key]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-subtle">
              Two of those answers decide which plan we suggest: who follows up with commercial
              accounts today, and whether you want opportunities qualified before your estimator
              is involved. How we handle what you send is in the{" "}
              <Link href="/privacy" className="text-accent underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="mt-12 border-t border-line pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Not ready to answer questions?
            </h2>
            <p className="mt-3 leading-7 text-subtle">
              Reasonable. Read what the service is, how the work runs, or what it costs — all of it
              is on the site in full, with no form in front of it.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/commercial-hvac-lead-generation"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line px-6 font-semibold text-accent transition-colors hover:border-line hover:bg-accent-soft"
              >
                Commercial HVAC lead generation
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line px-6 font-semibold text-accent transition-colors hover:border-line hover:bg-accent-soft"
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line px-6 font-semibold text-accent transition-colors hover:border-line hover:bg-accent-soft"
              >
                Pricing, in full
              </Link>
            </div>
          </section>
        </main>
      </PageShell>
    </>
  );
}
