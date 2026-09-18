import TrackedLink from "@/components/TrackedLink";
import { CTA_HREF, CTA_LABEL } from "@/components/SiteChrome";

// THE ONE PRIMARY ACTION, everywhere it appears (conversion supplement, "Primary CTA").
//
// One label, one destination, one component — so the homepage, the header, every guide's
// closing block, the reviews page and the 404 page cannot drift into competing next steps,
// and every click is counted the same way (lib/events.ts `cta_click`, tagged with WHERE on
// the site it happened). Secondary links on a page are plain text links, never a second
// button: nothing may compete visually with this.
//
// The label is a tangible deliverable, not an invitation to browse. "See if we're a fit" —
// the label until 2026-09-17 — described the form; this describes what the visitor gets at
// the end of it. It is supportable: the free pipeline audit delivers 3–5 commercial accounts
// (lib/content.ts `audit`), so 3 is the floor, and /start says plainly that the audit follows
// a fit check whose honest answer can be no.
export default function PrimaryCta({
  placement,
  className = "",
}: {
  /** Where on the site this button sits — hero, plans, offer, final, header, guide, 404… */
  placement: string;
  className?: string;
}) {
  return (
    <TrackedLink
      href={CTA_HREF}
      placement={placement}
      className={`inline-flex min-h-12 items-center justify-center rounded-sm border border-accent/45 bg-accent-fill px-6 font-semibold text-paper shadow-lift transition-transform hover:scale-[1.015] ${className}`}
    >
      {CTA_LABEL} <span aria-hidden="true" className="ml-3">→</span>
    </TrackedLink>
  );
}
