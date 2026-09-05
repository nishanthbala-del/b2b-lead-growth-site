import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/pages";
import { reviews } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Real reviews only, and EMPTY on purpose today — see lib/content.ts's own comment on `reviews`
// and README.md's house rule ("no case studies, testimonials, logos, or performance numbers on
// purpose"). This page renders honestly either way: an empty state that says so plainly, or the
// real reviews once scripts/record_review.py (operating-system repo) has recorded named, quoted
// consent and someone has added the entry to lib/content.ts by hand — the deliberate publish step.

export const metadata: Metadata = pageMetadata({
  path: "/reviews",
  type: "website",
  title: "Client reviews",
  description:
    "Real reviews from B2B Lead Growth clients, published only with their own words and named consent. Honestly empty until a real one exists — we do not invent them.",
});

const reviewJsonLd =
  reviews.length > 0
    ? {
        "@context": "https://schema.org",
        "@graph": reviews.map((r) => ({
          "@type": "Review",
          itemReviewed: { "@id": `${siteUrl}/#organization` },
          author: { "@type": "Person", name: r.name },
          reviewBody: r.quote,
        })),
      }
    : null;

export default function ReviewsPage() {
  return (
    <>
      {reviewJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <PageShell width="prose">
        <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
            Reviews
          </p>
          <h1 className="font-display text-3xl leading-tight text-bone sm:text-5xl">
            {reviews.length > 0 ? "What clients say" : "No reviews yet — on purpose, not by accident"}
          </h1>

          {reviews.length > 0 ? (
            <ul className="mt-10 space-y-6">
              {reviews.map((r) => (
                <li key={r.contentHash} className="rounded-lg border border-gold-500/16 bg-ink-900/60 p-6">
                  <p className="text-lg leading-8 text-bone">&ldquo;{r.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-semibold text-gold-200">{r.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 space-y-5 leading-7 text-muted">
              <p>
                This is a young, founder-led company, and there is no real client review to show
                yet. We would rather say that plainly than invent one, or borrow someone else&rsquo;s.
              </p>
              <p>
                The moment a client leaves a real review — their own words, with their named
                consent on file — it goes here, with nothing else changed about this page.
              </p>
              <p>
                In the meantime,{" "}
                <Link href="/#why-us" className="font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400">
                  here is what you can check instead
                </Link>
                : the published price, the contract terms, and the process itself.
              </p>
            </div>
          )}

          <div className="mt-12 border-t border-gold-500/14 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
              Already a client?
            </p>
            <p className="mt-3 leading-7 text-muted">
              If you got a personal link from us, use it to leave a review or refer another
              business — it is the fastest way, and it credits you correctly. No link handy? Email
              us and we will send one.
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/start"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02]"
            >
              See if we&rsquo;re a fit <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </main>
      </PageShell>
    </>
  );
}
