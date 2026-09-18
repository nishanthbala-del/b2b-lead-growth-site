// /llms.txt — the plain summary of this site for language models (https://llmstxt.org).
//
// GENERATED, NOT HAND-WRITTEN (2026-09-18). Until then this was public/llms.txt, a static file
// that restated the plans, the prices, the terminology and the page list by hand — and a
// static file cannot import anything, so every one of those facts had a second home with
// nothing holding it to the first. It is now rendered by app/llms.txt/route.ts from:
//
//   * the page registry (lib/pages.ts) — every indexable page, with the same title and
//     description its <head> publishes, grouped the way the footer groups them;
//   * the offer (lib/content.ts) — plan names, prices, one-liners, terms, the boundary;
//   * the site facts (lib/site.ts) — brand, entity, founder, geography, contact.
//
// So a page cannot be registered without being listed here, a retired page cannot linger
// here, and a price cannot change on /pricing without changing here in the same build.
//
// Relative imports with extensions: tests/ load this module directly under `node --test`.

import { audit, boundarySentence, contractorBoundary, offerTerms, plans } from "./content.ts";
import {
  PAGE_SECTIONS,
  guidePages,
  homepageDescription,
  homepageDateModified,
  legalRoutes,
  pageSection,
  standaloneRoutes,
} from "./pages.ts";
import {
  areaServed,
  basedIn,
  brandName,
  contactEmail,
  founderName,
  legalEntityName,
  orgDescription,
  siteUrl,
} from "./site.ts";

/** The latest real content date on the site — never the build date. */
export function llmsLastUpdated(): string {
  const dates = [
    homepageDateModified,
    ...guidePages.map((p) => p.dateModified),
    ...standaloneRoutes.map((r) => r.dateModified),
    ...legalRoutes.map((r) => r.dateModified),
  ];
  return dates.sort().at(-1)!;
}

const link = (label: string, path: string, note: string) => `- [${label}](${siteUrl}${path}): ${note}`;

export function llmsTxt(): string {
  const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
  const lines: string[] = [];

  lines.push(`# ${brandName}`, "");
  lines.push(`> ${orgDescription}`, "");
  lines.push(`Last updated: ${llmsLastUpdated()}`, "");
  lines.push(
    "This file is a plain summary for language models. Every fact below is published, in full and",
    "with its reasoning, on the pages listed further down.",
    "",
  );

  lines.push("## What this is", "");
  lines.push(
    "- Category: commercial HVAC managed outbound, also called commercial HVAC lead generation.",
    "- For: established HVAC contractors that already sell and complete commercial work, have someone who quotes and wins those bids, have room to take on more accounts, and have no consistent way to find target accounts and follow up with them.",
    "- Who it contacts on a contractor's behalf: businesses — property managers, building owners and facility teams, plus multi-site operators and the people responsible for HVAC at offices, industrial sites, schools, healthcare sites, restaurants and retail.",
    "- How: accounts are researched from public sources, each with a named contact, a cited reason and a source link; outreach is email-led and sent from the contractor's own domain and mailbox, in the contractor's name. No cold calls.",
    "- Not a lead seller: no leads are sold, resold or brokered, and nothing is priced per lead.",
    `- Founder-run by ${founderName}. Operated by ${legalEntityName}, based in ${basedIn}, delivered remotely to HVAC contractors across the ${areaServed}.`,
    "- It is new: it has no client results, reviews or case studies to publish yet, and publishes none. It never guarantees revenue, contracts, appointments, site visits or any count of them.",
    "",
  );

  lines.push("## Plans", "");
  for (const p of plans) lines.push(`- ${p.name}, ${usd(p.price)} per month: ${p.oneLiner}`);
  for (const t of offerTerms) lines.push(`- ${t}`);
  lines.push("");

  lines.push("## The boundary, on every plan", "");
  lines.push(`- ${boundarySentence}`);
  lines.push(`- ${brandName} does not: ${contractorBoundary.join("; ")}.`);
  lines.push("");

  lines.push("## How someone starts", "");
  lines.push(
    `- The entry point is the fit check at ${siteUrl}/start. It gives a straight answer on fit, including no.`,
    `- The entry offer is the ${audit.name}, free and delivered in writing: ${audit.includes
      .map((i) => i.title.charAt(0).toLowerCase() + i.title.slice(1))
      .join("; ")}. No call is required to receive it, and nothing is sent to anyone as part of it.`,
    "",
  );

  // The pages, in the footer's groups — one H2 "file list" per group, as the llms.txt format
  // expects — each described by its own registry entry. The homepage leads the first group.
  for (const section of PAGE_SECTIONS) {
    lines.push(`## ${section.label}`, "");
    if (section.key === "service") lines.push(link("Home", "/", homepageDescription));
    for (const p of guidePages.filter((g) => pageSection(g) === section.key)) {
      lines.push(link(p.metaTitle, `/${p.slug}`, p.description));
    }
    lines.push("");
  }

  lines.push("## Optional", "");
  for (const r of standaloneRoutes) lines.push(link(r.metaTitle, `/${r.slug}`, r.description));
  for (const r of legalRoutes) lines.push(link(r.metaTitle, `/${r.slug}`, r.description));
  lines.push("");

  lines.push("## Contact", "", `- Email: ${contactEmail}`, "");

  return lines.join("\n");
}
