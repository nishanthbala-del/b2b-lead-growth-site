import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/pages";
import QualificationFlow from "@/components/qualification/QualificationFlow";
import { callLengthMinutes, intakeMinutes, siteUrl } from "@/lib/site";

// The standalone home of the fit check.
//
// The same flow runs inside the homepage modal, but it needs a real URL of its own:
// it is the link that goes in an outbound email, the one an owner forwards to a
// partner, and the one someone returns to after thinking it over. A qualification
// step that exists only behind a button on one page cannot be any of those.

export const metadata: Metadata = pageMetadata({
  path: "/start",
  type: "website",
  title: "Fit check for HVAC companies",
  description: `A ${intakeMinutes}-minute fit check for established HVAC companies. Answer ten questions and get a straight answer — including no. If it's a fit, we send your free pipeline audit in writing; the ${callLengthMinutes}-minute walkthrough is optional.`,
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${siteUrl}/start#breadcrumbs`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "B2B Lead Growth", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Fit check", item: `${siteUrl}/start` },
  ],
};

// What the visitor is agreeing to before they start answering. Stated up front
// because the flow asks for real information about their business, and the reason
// it asks is the reason it is worth answering honestly.
// Three short guarantees, shown as one line ABOVE the form, then in full BELOW it.
//
// They used to render as three cards between the intro and the first question, which
// on a 390px phone put the first input 1,353px down — 1.6 screens. A prospect arriving
// from an outbound email saw a headline, a paragraph and three boxes, and no form at
// all, which is the single largest abandonment risk on the page. The reassurance still
// has to come before the questions to make anyone willing to start, so it does — in
// eight words each, with the full version kept underneath for anyone who wants it.
const promises = [
  {
    short: "A straight answer, including no",
    title: "A straight answer, including no",
    body: "If your answers say we can't help you, the last screen says so and tells you why. It won't offer you a calendar to be polite.",
  },
  {
    short: "Free audit, no call required",
    title: "The audit is free, and no call is required",
    body: "If it is a fit, we build your pipeline audit — a job profile, 3–5 cited referral partners, one sample message — and email it to you. You never have to get on a call to receive it.",
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
        <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
            Fit check · about {intakeMinutes} minutes
          </p>
          {/* Smaller on mobile than the rest of the site's H1s, deliberately. This page
              is a form, not a pitch: every vertical pixel above the first question is a
              pixel of abandonment risk on a phone. */}
          <h1 className="font-display text-3xl leading-tight text-bone sm:text-5xl">
            Let&rsquo;s find out if this is for you.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted sm:text-lg sm:leading-8">
            For established residential HVAC companies with real customer history and room for more
            work. Ten questions, and you get the answer on the last screen.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {promises.map((p) => (
              <li key={p.title} className="flex items-center gap-2 text-sm text-bone/85">
                <span aria-hidden="true" className="text-gold-200">✓</span>
                {p.short}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-gold-500/22 bg-ink-900/72 px-6 py-2 shadow-panel sm:px-8">
            <QualificationFlow />
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {promises.map((p) => (
              <li key={p.title} className="rounded-lg border border-gold-500/16 bg-ink-900/60 p-5">
                <h2 className="text-sm font-semibold text-bone">{p.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>

          <section className="mt-12 border-t border-gold-500/14 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
              Not ready to answer questions?
            </p>
            <p className="mt-3 leading-7 text-muted">
              Reasonable. Read how the work actually runs, or go straight to what it costs — both
              are on the site in full, with no form in front of them.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/28 px-6 font-semibold text-gold-200 transition-colors hover:border-gold-200/65 hover:bg-gold-500/8"
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/28 px-6 font-semibold text-gold-200 transition-colors hover:border-gold-200/65 hover:bg-gold-500/8"
              >
                Pricing, in full
              </Link>
              <Link
                href="/#who-its-for"
                className="link-wipe inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
              >
                Who this is and isn&rsquo;t for →
              </Link>
            </div>
          </section>
        </main>
      </PageShell>
    </>
  );
}
