import Link from "next/link";
import type { ReactNode } from "react";
import { contactEmail, legalEntityName } from "@/lib/site";

// The header/footer chrome shared by every page that is NOT the animated landing
// page — the guides, /pricing's siblings, and the /start fit check. Server-rendered,
// no animation weight, readable without JavaScript.
//
// It exists because the same header markup and the same six-link legal footer were
// being written out per page. Two copies of a footer is how one of them ends up
// still linking to a route that was retired.

export default function PageShell({
  children,
  width = "prose",
}: {
  children: ReactNode;
  /** `prose` for reading (guides); `wide` for interactive content that needs room. */
  width?: "prose" | "wide";
}) {
  const max = width === "wide" ? "max-w-4xl" : "max-w-3xl";
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className={`mx-auto flex ${max} items-center justify-between px-5 py-5 sm:px-8`}>
          <Link href="/" className="font-display text-lg text-accent">
            B2B Lead Growth
          </Link>
          <Link href="/" className="text-sm text-subtle transition-colors hover:text-accent">
            ← Back to site
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-line px-5 py-8 sm:px-8">
        <div className={`mx-auto flex ${max} flex-col gap-2 text-sm text-subtle`}>
          <p className="leading-7">
            © {new Date().getFullYear()} {legalEntityName} ·{" "}
            <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-accent">
              {contactEmail}
            </a>{" "}
            ·{" "}
            <Link href="/pricing" className="transition-colors hover:text-accent">
              Pricing
            </Link>{" "}
            ·{" "}
            <Link href="/terms#billing" className="transition-colors hover:text-accent">
              Billing &amp; cancellation
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="transition-colors hover:text-accent">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="transition-colors hover:text-accent">
              Terms
            </Link>
          </p>
          <p>
            Lead generation improves prospect quality and pipeline inputs; sales outcomes depend on
            your offer, market demand, outreach execution, follow-up discipline, and closing ability.
          </p>
        </div>
      </footer>
    </div>
  );
}
