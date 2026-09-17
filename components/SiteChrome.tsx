import Link from "next/link";
import { guidePages, standaloneRoutes } from "@/lib/pages";
import {
  basedIn,
  brandName,
  contactEmail,
  entityFormationState,
  founderName,
  legalEntityName,
} from "@/lib/site";

// The header and footer every page shares.
//
// Until 2026-09-17 the homepage had its own nav (in-page anchors only) and every other page
// had a header whose single link was "← Back to site". So a visitor who landed on /pricing
// from search had exactly one way onward, and the site's intended path — what the service is
// → how it runs → what it costs → the free audit or the fit check — existed only on the
// homepage. Three copies of a footer had also drifted apart (the legal pages' footers linked
// to neither the service nor the guides). One header, one footer, every page.
//
// Zero JavaScript: the mobile menu is a <details> disclosure, which is keyboard accessible,
// announced correctly, and works before (or without) hydration.

/** The single primary action, used verbatim everywhere on the site. */
export const CTA_LABEL = "See if we’re a fit";
export const CTA_HREF = "/start";

// Short labels in the header, where space is the constraint; the footer and the in-body links
// carry the descriptive anchors ("Commercial HVAC Lead Generation", "How It Works", …).
const headerNav = [
  { label: "What we do", href: "/commercial-hvac-lead-generation" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free audit", href: "/free-pipeline-audit" },
  { label: "About", href: "/about" },
];

export function SiteHeader({ width = "max-w-5xl" }: { width?: string }) {
  return (
    <header className="border-b border-line bg-paper">
      <nav
        className={`mx-auto flex ${width} items-center justify-between gap-4 px-5 py-4 sm:px-8`}
        aria-label="Primary"
      >
        <Link href="/" className="font-display text-lg text-accent sm:text-xl">
          {brandName}
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {headerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-subtle transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={CTA_HREF}
            className="inline-flex min-h-11 shrink-0 items-center rounded-sm border border-accent/45 bg-accent-fill px-4 text-xs font-semibold text-paper sm:text-sm"
          >
            {CTA_LABEL}
          </Link>
          <details className="relative lg:hidden">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-sm border border-accent/45 text-accent [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ☰
              </span>
            </summary>
            <div className="absolute right-0 top-12 z-20 w-56 rounded-sm border border-line bg-surface p-1 shadow-card">
              {headerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center border-b border-line px-3 text-sm text-subtle last:border-0 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter({ width = "max-w-5xl" }: { width?: string }) {
  return (
    <footer className="border-t border-line bg-paper px-5 py-10 sm:px-8">
      <div className={`mx-auto ${width} text-sm text-subtle`}>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg text-accent">{brandName}</p>
            <p className="mt-2 leading-6">
              Commercial HVAC managed outbound for established contractors: we find the commercial
              accounts, contact the right people in your name, and hand each opportunity to your
              team at the level you chose. You estimate and close.
            </p>
            {/* WHERE WE ARE and WHERE WE SERVE, as two facts. The footer used to say
                "currently focused on New Jersey", which turned the founder's address into a
                limit on a service that is delivered remotely. */}
            <p className="mt-4 leading-6">
              <span className="text-ink">{legalEntityName}</span>, a {entityFormationState} limited
              liability company. Founder-run by {founderName}, based in {basedIn}, serving HVAC
              contractors across the United States.
            </p>
            <p className="mt-2 leading-6">
              One question, no form:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-accent underline underline-offset-4 hover:text-accent"
              >
                {contactEmail}
              </a>
            </p>
          </div>
          <nav aria-label="Site" className="md:min-w-56">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The service</p>
            <ul className="mt-1">
              {guidePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-accent"
                  >
                    {page.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Start and legal" className="md:min-w-44">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Start</p>
            <ul className="mt-1">
              {standaloneRoutes.map((route) => (
                <li key={route.slug}>
                  <Link
                    href={`/${route.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-accent"
                  >
                    {route.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/terms#billing" className="inline-flex min-h-11 items-center hover:text-accent">
                  Billing &amp; cancellation
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* The no-outcome-promise line. The refusal is load-bearing and must not be trimmed:
            the top plan COORDINATES a next step or a site visit, so "a set number of" is
            deliberate — a blunter "we do not promise site visits" would contradict the
            product, and a vaguer line would let a reader assume a count. */}
        <p className="mt-8 border-t border-line pt-6 leading-6">
          © {new Date().getFullYear()} {legalEntityName} · We prepare the opportunity; the HVAC
          contractor estimates and closes it. We commit to doing the work to the stated standard
          and reporting it honestly. We do not promise jobs, revenue, contracts, or a set number
          of appointments, site visits or qualified opportunities.
        </p>
      </div>
    </footer>
  );
}
