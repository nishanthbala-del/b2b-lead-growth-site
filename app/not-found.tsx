import type { Metadata } from "next";
import Link from "next/link";
import { brandName } from "@/lib/site";

// Without this file Next serves its built-in error page, which injects
// `body{color:#000;background:#fff}` into a dark site, emits a second <title>, and
// gives a visitor no way back. A mistyped or stale URL is a lost lead, so it gets a
// real page pointing at the two things worth doing next.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950 text-bone">
      <header className="border-b border-gold-500/14">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-display text-lg text-gold-200">
            {brandName}
          </Link>
          <Link href="/" className="text-sm text-muted transition-colors hover:text-gold-200">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 sm:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
          404
        </p>
        <h1 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
          The link may be out of date, or the address may have a typo in it. Everything about the
          service — how it works, what&rsquo;s included, and what it costs — is on the home page.
        </p>
        {/* Same single call to action as every other page. A 404 that only offers
            "go home" wastes the one visitor who was already looking for something. */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/start"
            className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 font-semibold text-ink-950 shadow-gold"
          >
            See if we&rsquo;re a fit <span className="ml-3" aria-hidden="true">→</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gold-200 underline underline-offset-4 hover:text-gold-400"
          >
            Or go to the home page
          </Link>
        </div>
      </main>

      <footer className="border-t border-gold-500/12 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-gold-200">{brandName}</p>
          <Link href="/privacy" className="transition-colors hover:text-gold-200">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
