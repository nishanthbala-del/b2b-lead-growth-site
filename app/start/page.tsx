import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getStandaloneRoute, pageMetadata } from "@/lib/pages";
import QualificationFlow from "@/components/qualification/QualificationFlow";
import { ANSWER_KEYS, QUESTION_LABELS } from "@/lib/qualification";
import { brandName, callLengthMinutes, intakeMinutes, siteUrl } from "@/lib/site";

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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${siteUrl}/start#breadcrumbs`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: brandName, item: siteUrl },
    { "@type": "ListItem", position: 2, name: route.navLabel, item: `${siteUrl}/start` },
  ],
};

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
            Fit check · about {intakeMinutes} minutes
          </p>
          {/* Smaller on mobile than the rest of the site's H1s, deliberately. This page is a
              form, not a pitch: every vertical pixel above the first question is a pixel of
              abandonment risk on a phone. */}
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl">
            Let&rsquo;s find out if this is for you.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-subtle sm:text-lg sm:leading-8">
            For established HVAC contractors that already do commercial work and have room for
            more accounts. {QUESTION_COUNT} questions, and you get the answer on the last screen —
            along with the plan your answers point at.
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
              questions. Nothing asks for a customer list, and nothing asks about homeowners — we
              never contact them. We ask:
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
