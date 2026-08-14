// Registry of the indexable guide pages. Single source of truth: the sitemap,
// footer navigation, per-page metadata, and breadcrumb/article JSON-LD all read
// from here, so a page can't ship half-wired. Dates are real edit dates — never
// bump dateModified without a substantive content change (visible date and
// structured date must always agree; a mismatch is a trust signal against us).

import { siteUrl, brandName } from "@/lib/site";

// Homepage content date for the sitemap — bump ONLY on substantive homepage edits.
// NOTE: when adding a guide page here, also add its URL to scripts/indexnow-ping.mjs
// and public/llms.txt (both carry an explicit URL list).
export const homepageDateModified = "2026-08-08";

export type GuidePage = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  description: string;
  datePublished: string; // ISO yyyy-mm-dd
  dateModified: string; // ISO yyyy-mm-dd
};

export const guidePages: GuidePage[] = [
  {
    slug: "free-pipeline-audit",
    navLabel: "Free Pipeline Audit",
    metaTitle: "Free Pipeline Audit: What's Included and How It Works",
    description:
      "What a legitimate free lead-generation audit should include — and exactly what ours delivers: a sharpened ICP, 3–5 individually vetted prospects with cited reasons, and one sample outreach message. Yours to keep, free.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
  },
  {
    slug: "pricing",
    navLabel: "Pricing",
    metaTitle: "Lead Generation Pricing: $750–$2,500/Month, No Setup Fee",
    description:
      "Transparent B2B lead generation and appointment setting pricing: $750, $1,500, or $2,500 per month, month-to-month, no setup fee — with cited market context on what agencies typically charge.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
  },
  {
    slug: "hvac-lead-generation-new-jersey",
    navLabel: "HVAC Leads in NJ",
    metaTitle: "HVAC Lead Generation in New Jersey: What Leads Cost and Your Options",
    description:
      "What HVAC leads actually cost New Jersey contractors across Angi, Google Local Services Ads, and per-lead sellers — and an honest comparison of the alternatives, from a NJ-first lead generation company.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
  },
  {
    slug: "shared-vs-exclusive-hvac-leads",
    navLabel: "Shared vs. Exclusive Leads",
    metaTitle: "Shared vs. Exclusive HVAC Leads: The Real Cost Per Job",
    description:
      "Shared leads look cheap until you do the cost-per-booked-job math. A neutral, cited comparison of shared and exclusive HVAC leads — including the FTC's case against HomeAdvisor — from a company that sells neither.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
  },
  {
    slug: "how-to-choose-a-lead-generation-agency",
    navLabel: "Choosing an Agency",
    metaTitle: "How to Choose a Lead Generation Agency: Red Flags and Questions to Ask",
    description:
      "The questions that expose a bad lead-gen agency — guaranteed-results promises, data lock-in, hidden fees, long contracts — and our own straight answers to every one of them, including the uncomfortable ones.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
  },
];

export function getGuidePage(slug: string): GuidePage {
  const page = guidePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Guide page not registered in lib/pages.ts: ${slug}`);
  return page;
}

// Article + BreadcrumbList JSON-LD shared by every guide page. FAQPage markup is
// added per-page (only where visible Q&A exists — markup must match visible text).
export function guideJsonLd(page: GuidePage) {
  const url = `${siteUrl}/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: page.metaTitle,
        description: page.description,
        url,
        datePublished: page.datePublished,
        dateModified: page.dateModified,
        author: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: brandName, item: siteUrl },
          { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
        ],
      },
    ],
  };
}
