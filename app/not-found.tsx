import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PrimaryCta from "@/components/PrimaryCta";

// Without this file Next serves its built-in error page, which emits a second <title> and
// gives a visitor no way back. A mistyped or stale URL is a lost lead, so it gets a real page
// — in the same chrome as every other page, so the header carries them to the service, how it
// works, pricing and the audit.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell>
      <main id="main" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">404</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-subtle">
          The link may be out of date, or the address may have a typo in it. What the service is,
          how it works and what it costs each have a page of their own:
        </p>
        <ul className="mt-6 space-y-2 text-lg">
          <li>
            <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
              Commercial HVAC lead generation
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" className="text-accent underline underline-offset-4">
              How it works
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="text-accent underline underline-offset-4">
              Pricing
            </Link>
          </li>
        </ul>
        {/* Same single call to action as every other page. A 404 that only offers "go home"
            wastes the one visitor who was already looking for something. */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <PrimaryCta placement="not-found" />
          <Link
            href="/"
            className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent"
          >
            Or go to the home page
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
