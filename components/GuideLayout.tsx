import Link from "next/link";
import type { ReactNode } from "react";
import PageShell from "@/components/PageShell";
import { guidePages, type GuidePage } from "@/lib/pages";
import { intakeMinutes } from "@/lib/site";

// Server-rendered shell for the guide pages: same ink/gold language as the
// landing page, none of its animation weight. Content pages must stay fast,
// fully static, and readable without JavaScript.

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function GuideLayout({
  page,
  eyebrow,
  h1,
  intro,
  children,
}: {
  page: GuidePage;
  eyebrow: string;
  /** The visible H1 (may differ slightly from the meta title). */
  h1: string;
  /** Answer-first opening: 2–3 sentences that directly answer the page's question. */
  intro: ReactNode;
  children: ReactNode;
}) {
  const otherGuides = guidePages.filter((p) => p.slug !== page.slug);

  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl leading-tight text-bone sm:text-5xl">{h1}</h1>
        <p className="mt-4 text-sm text-muted">
          Last updated: {formatDate(page.dateModified)}
        </p>

        <div className="mt-8 space-y-4 text-lg leading-8 text-muted">{intro}</div>

        {children}

        {/* Conversion path, tiered by intent. A guide reader is mid-research: some are
            ready to be qualified, some want to understand the mechanism first, and some
            only want the number. One button for each, in that order, instead of funnelling
            all three into the same modal and losing the two who weren't ready. */}
        <section className="mt-14 rounded-lg border border-gold-500/20 bg-ink-900/72 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
            Where to go from here
          </p>
          <h2 className="mt-3 font-display text-3xl text-bone">
            Find out whether this is a fit — and get the audit either way.
          </h2>
          <p className="mt-4 leading-7 text-muted">
            {intakeMinutes} minutes of questions and you get a straight answer, including
            &ldquo;no&rdquo; if that&rsquo;s the answer. If it is a fit, we build your free
            pipeline audit and send it over in writing: a sharpened profile of the jobs worth
            chasing, 3–5 real referral partners in your service area with cited reasons to reach
            out, and one sample outreach message. No call is required to receive it, and it&rsquo;s
            yours to keep whether or not you ever hire us. It shows the quality of the work, not a
            promised result — no guaranteed leads, replies, or appointments, and no homeowner list.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/start"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 font-semibold text-ink-950 shadow-gold"
            >
              See if we&rsquo;re a fit <span className="ml-3" aria-hidden="true">→</span>
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/28 px-6 font-semibold text-gold-200 transition-colors hover:border-gold-200/65 hover:bg-gold-500/8"
            >
              See how it works first
            </Link>
            <Link
              href="/pricing"
              className="link-wipe inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
            >
              Just the pricing →
            </Link>
          </div>
        </section>

        {/* Internal links: every guide links to every other guide with a descriptive anchor. */}
        <nav aria-label="More guides" className="mt-12 border-t border-gold-500/14 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
            Keep reading
          </p>
          <ul className="mt-4 space-y-3">
            {otherGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${g.slug}`}
                  className="text-gold-200 underline underline-offset-4 transition-colors hover:text-gold-400"
                >
                  {g.metaTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </PageShell>
  );
}

/* Shared typographic building blocks for guide content. */

export function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl leading-tight text-bone">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-muted">{children}</div>
    </section>
  );
}

export function KeyAnswer({ children }: { children: ReactNode }) {
  // A visually distinct, self-contained direct answer near the top of a section —
  // the extractable passage AI search products actually quote.
  return (
    <div className="mt-6 rounded-lg border border-gold-500/25 bg-ink-900/72 p-5 leading-7 text-bone/90">
      {children}
    </div>
  );
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-muted/80">{children}</p>;
}

export function GuideTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div
      className="mt-6 overflow-x-auto rounded-lg border border-gold-500/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-gold-500/20 bg-ink-900/80">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold text-gold-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gold-500/10 last:border-0">
              {row.map((cell, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="px-4 py-3 text-left align-top font-normal leading-6 text-muted"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 align-top leading-6 text-muted">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
