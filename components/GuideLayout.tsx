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
  /** Answer-first opening. The FIRST paragraph must be a self-contained answer to the
      page's title question in 40 words or fewer, before any preamble — it is the passage
      an answer engine lifts out, so it has to make sense with no page around it and must
      restate its subject rather than lean on a pronoun. Substantiation goes in the
      paragraphs after it. Set that first <p> to `text-ink` so the lead reads as the
      answer rather than as an introduction. */
  intro: ReactNode;
  children: ReactNode;
}) {
  const otherGuides = guidePages.filter((p) => p.slug !== page.slug);

  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{h1}</h1>
        <p className="mt-4 text-sm text-subtle">
          Last updated: {formatDate(page.dateModified)}
        </p>

        <div className="mt-8 space-y-4 text-lg leading-8 text-subtle">{intro}</div>

        {children}

        {/* ONE call to action, the same one used on every page. This carried three
            competing buttons; a reader at the end of a guide needs a next step, not a
            menu. The two secondary destinations are still linked from the homepage.

            The paragraph is deliberately short. It used to restate the audit's full
            contents on all five guides — 365 words site-wide — and on /free-pipeline-audit
            it restated that page's own premise a screen below the original. A closing CTA
            needs the action and one reason; the deliverable list belongs on the audit page,
            which every guide links to in "Keep reading" below. What must never be dropped
            is "No call is required to receive it": that clause is the offer's rule, and
            tests/offer-integrity.test.ts fails if any page gates the audit behind a call. */}
        <section className="mt-14 rounded-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Find out whether this is a fit — and get the audit either way.
          </h2>
          <p className="mt-4 leading-7 text-subtle">
            {intakeMinutes} minutes of questions, then a straight answer — including
            &ldquo;no&rdquo;. If it is a fit, your free pipeline audit follows in writing. No call
            is required to receive it, and it is yours to keep either way. It shows the quality of
            the work, not a promised result.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/start"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-accent/45 bg-accent-fill px-6 font-semibold text-paper shadow-lift"
            >
              See if we&rsquo;re a fit <span className="ml-3" aria-hidden="true">→</span>
            </Link>
            <span className="text-sm text-subtle">No card. A straight answer either way.</span>
          </div>
        </section>

        {/* Internal links: every guide links to every other guide with a descriptive anchor. */}
        <nav aria-label="More guides" className="mt-12 border-t border-line pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Keep reading
          </p>
          <ul className="mt-4 space-y-3">
            {otherGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${g.slug}`}
                  className="inline-flex min-h-11 items-center text-accent underline underline-offset-4 transition-colors hover:text-accent"
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

export function GuideSection({
  id,
  title,
  children,
}: {
  /** Optional anchor, so another page can deep-link to a specific section. */
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-20">
      <h2 className="font-display text-3xl leading-tight text-ink">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-subtle">{children}</div>
    </section>
  );
}

export function KeyAnswer({ children }: { children: ReactNode }) {
  // A visually distinct, self-contained direct answer near the top of a section —
  // the extractable passage AI search products actually quote.
  return (
    <div className="mt-6 rounded-lg border border-line bg-surface p-5 leading-7 text-ink/90">
      {children}
    </div>
  );
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-subtle">{children}</p>;
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
      className="mt-6 overflow-x-auto rounded-lg border border-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-surface">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold text-accent">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="px-4 py-3 text-left align-top font-normal leading-6 text-subtle"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 align-top leading-6 text-subtle">
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
