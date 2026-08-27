// Registry of the indexable guide pages. Single source of truth: the sitemap,
// footer navigation, per-page metadata, and breadcrumb/article JSON-LD all read
// from here, so a page can't ship half-wired. Dates are real edit dates — never
// bump dateModified without a substantive content change (visible date and
// structured date must always agree; a mismatch is a trust signal against us).

// Relative, not the "@/" alias: tests/ import this module directly under `node --test`,
// which resolves real paths and knows nothing about the bundler's tsconfig aliases.
// Files inside lib/ therefore import their siblings relatively.
import { siteUrl, brandName, areaServed, orgDescription } from "./site.ts";
import { plans } from "./content.ts";

// Homepage content date for the sitemap — bump ONLY on substantive homepage edits.
//
// When adding ANY indexable route, add it to `guidePages` or `standaloneRoutes` below
// and then to scripts/indexnow-ping.mjs and public/llms.txt, which each carry their own
// explicit URL list (a .mjs script and a static text file cannot import this registry).
// tests/routes.test.ts fails if the three lists stop agreeing, so the note above is now
// enforced rather than merely written down — it had already gone stale once.
export const homepageDateModified = "2026-08-27";

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
    metaTitle: "Free HVAC Pipeline Audit: What's Included and How It Works",
    description:
      "What a legitimate free audit should include for an HVAC company — and exactly what ours delivers: a sharpened job profile, 3–5 vetted referral partners with cited reasons, and one sample outreach message. Yours to keep, free.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-24",
  },
  {
    slug: "pricing",
    // NOT plain "Pricing": the homepage nav item with that exact label scrolls to the
    // on-page #pricing section, and this one navigates to a different document (cited
    // market comparison, billing terms, cancellation). One word, one site, two
    // destinations is a trust cost for no benefit.
    navLabel: "Pricing in detail",
    metaTitle: "HVAC Lead Generation Pricing: $750–$2,500/Mo, No Setup Fee",
    description:
      "Transparent HVAC lead generation and appointment setting pricing: $750, $1,500, or $2,500 per month, month-to-month, no setup fee, never priced per lead — with cited market context on what agencies typically charge.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-24",
  },
  {
    slug: "hvac-lead-generation-new-jersey",
    navLabel: "HVAC Leads in NJ",
    metaTitle: "HVAC Lead Generation in New Jersey: What Leads Cost and Your Options",
    description:
      "What HVAC leads actually cost New Jersey contractors across Angi, Google Local Services Ads, and per-lead sellers — and an honest comparison of the alternatives, from a NJ-first lead generation company.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-24",
  },
  {
    slug: "shared-vs-exclusive-hvac-leads",
    navLabel: "Shared vs. Exclusive Leads",
    metaTitle: "Shared vs. Exclusive HVAC Leads: The Real Cost Per Job",
    description:
      "Shared leads look cheap until you do the cost-per-booked-job math. A neutral, cited comparison of shared and exclusive HVAC leads — including the FTC's case against HomeAdvisor — from a company that sells neither.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-24",
  },
  {
    slug: "how-to-choose-a-lead-generation-agency",
    navLabel: "Choosing a Vendor",
    metaTitle: "How to Choose an HVAC Lead Generation Company: Red Flags and Questions",
    description:
      "The questions that expose a bad HVAC lead-gen vendor — guaranteed-results promises, shared leads, data lock-in, hidden fees, long contracts — and our own straight answers to every one of them, including the uncomfortable ones.",
    datePublished: "2026-08-08",
    dateModified: "2026-08-24",
  },
];

// Indexable routes that are not guides and not legal pages: real destinations with
// their own metadata, linked from the site and from outbound email.
export const standaloneRoutes = [
  { slug: "start", navLabel: "Fit check", dateModified: "2026-08-27", priority: 0.9 },
] as const;

/** Every indexable path on the site, in sitemap order. The drift test reads this. */
export const indexablePaths: string[] = [
  "/",
  ...guidePages.map((p) => `/${p.slug}`),
  ...standaloneRoutes.map((r) => `/${r.slug}`),
  "/privacy",
  "/terms",
];


/**
 * Per-page Metadata, built once so no page can ship a half-configured social card.
 *
 * Two Next.js metadata behaviours bite here, and both bit:
 *   1. `openGraph` does NOT merge field-by-field with the parent. A page that declares
 *      its own `openGraph` REPLACES the root layout's — including its `images`. Every
 *      guide page did exactly that, so /pricing and its four siblings shipped with no
 *      og:image at all.
 *   2. `twitter` IS inherited wholesale when a page omits it. So those same pages
 *      declared `twitter:card = summary_large_image` (from the root layout), pointed it
 *      at the HOMEPAGE's title and description, and gave it no image to show — a blank
 *      large card carrying the wrong headline on every share.
 *
 * Passing both objects explicitly, with the image, is the only way to get this right,
 * so it happens here rather than in eight page files.
 */
export function pageMetadata({
  path,
  title,
  description,
  type = "article",
}: {
  /** Absolute path, leading slash. */
  path: string;
  title: string;
  description: string;
  type?: "article" | "website";
}) {
  // The root `app/opengraph-image.tsx` route renders the 1200x630 card. Naming it
  // explicitly is what carries it onto pages that declare their own openGraph.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${brandName} — ${title}` }];
  const socialTitle = `${title} | ${brandName}`;
  return {
    title,
    description,
    // Self-canonical: without this the App Router inherits the root layout's "/" and
    // points every page at the homepage.
    alternates: { canonical: path },
    openGraph: { title: socialTitle, description, type, url: path, siteName: brandName, images },
    twitter: { card: "summary_large_image" as const, title: socialTitle, description, images },
  };
}


/**
 * The ONE Service entity, with its Offers.
 *
 * Both `/` and `/pricing` publish a Service node under the same `@id`. They were built
 * separately and had drifted: the pricing page's Offers carried only a nested
 * `priceSpecification` and omitted the top-level `price`, `priceCurrency`, `availability`
 * and `url` — and an Offer with no top-level price reads to Google as an Offer with no
 * price at all. Two different documents publishing different facts under one identifier
 * is worse than either version alone, so there is now one builder.
 */
export function serviceJsonLd() {
  return {
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    name: brandName,
    url: siteUrl,
    description: orgDescription,
    serviceType: "HVAC Lead Generation and Appointment Setting",
    areaServed,
    provider: { "@id": `${siteUrl}/#organization` },
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.volume,
      // price/priceCurrency are set on the Offer itself as well as in the nested
      // specification: Google reads the former, and an Offer carrying only a nested
      // priceSpecification is treated as having no price at all.
      price: String(p.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/pricing`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(p.price),
        priceCurrency: "USD",
        // UN/CEFACT code for month — the machine-readable form of unitText.
        unitCode: "MON",
        unitText: "MONTH",
      },
    })),
  };
}

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
