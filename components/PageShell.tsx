import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

// The chrome shared by every page that is NOT the landing page — the service pages, the
// guides, the fit check, the legal documents and the 404. Server-rendered, no animation
// weight, readable without JavaScript.
//
// It is a thin wrapper on purpose: the header and footer themselves live in SiteChrome so the
// landing page uses the very same ones. Two copies of a footer is how one of them ends up
// still linking to a route that was retired.

export default function PageShell({
  children,
  width = "prose",
}: {
  children: ReactNode;
  /** `prose` for reading (guides, legal); `wide` for interactive content that needs room. */
  width?: "prose" | "wide";
}) {
  const max = width === "wide" ? "max-w-4xl" : "max-w-3xl";
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-accent/45 focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent"
      >
        Skip to content
      </a>
      <SiteHeader width={max} />
      <div className="flex-1">{children}</div>
      <SiteFooter width={max} />
    </div>
  );
}
