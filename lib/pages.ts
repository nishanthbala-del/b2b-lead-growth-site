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
// 2026-09-05: the H1 went back to the buyer's problem and the deck became D-021's
// canonical positioning sentence — a substantive change to the page's lead, so the
// stamp moves with it.
export const homepageDateModified = "2026-09-05";

// The homepage's own title and description, in the registry with every other route's.
// They lived in app/layout.tsx, which made the homepage the only page whose snippet
// could not be reviewed beside the others — and the only one nothing could import in
// order to build its JSON-LD from the same strings it renders.
//
// Title kept under ~60 characters so Google doesn't truncate it. It leads with the
// NICHE + the service, because "HVAC lead generation" is what the buyer searches and
// "B2B Lead Growth" is a brand nobody is looking for yet. Description under ~155
// characters, and it names the actual mechanism (your own list + referral partners)
// rather than implying we sell homeowner leads, which we do not.
//
// The price came OUT of the description on purpose. It read "From $750/mo.", which put
// the homepage in a bidding war with /pricing — the page carrying the cited market
// comparison and the billing terms, and the one that should win a pricing query. The
// homepage still publishes every price in its own tier table; it just stops chasing the
// query in its snippet.
export const homepageMetaTitle = "HVAC Lead Generation & Appointment Setting | B2B Lead Growth";
export const homepageDescription =
  "Reactivate the unsold estimates and lapsed agreements sitting in your own system, plus researched referral partners. For established HVAC companies.";

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
      "What our free HVAC pipeline audit delivers: a sharpened job profile, 3–5 vetted referral partners with cited reasons, and a sample message. Yours to keep.",
    datePublished: "2026-08-08",
    // 2026-08-30: answer-first lead rewritten, and every FAQ answer gained a stable
    // anchor published as its Question @id/url. Real new visible text.
    dateModified: "2026-08-30",
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
      "HVAC lead generation pricing: $750, $1,500, or $2,500 a month. Month-to-month, no setup fee, never priced per lead, with cited market context.",
    datePublished: "2026-08-08",
    // 2026-09-04: tier cards became a labelled <dl>, and the volume unit was corrected
    // to messages-per-month on the two sending tiers.
    dateModified: "2026-09-04",
  },
  {
    slug: "hvac-lead-generation-new-jersey",
    navLabel: "HVAC Leads in NJ",
    metaTitle: "HVAC Lead Generation in New Jersey: What Leads Cost",
    description:
      "What HVAC leads cost New Jersey contractors on Angi, Google Local Services Ads and per-lead sellers — with cited figures and the honest alternatives.",
    datePublished: "2026-08-08",
    // 2026-09-02: answer-first lead, and the tier comparison became a real table.
    dateModified: "2026-09-02",
  },
  {
    slug: "shared-vs-exclusive-hvac-leads",
    navLabel: "Shared vs. Exclusive Leads",
    metaTitle: "Shared vs. Exclusive HVAC Leads: The Real Cost Per Job",
    description:
      "Shared leads look cheap until you do the cost-per-booked-job math. A cited comparison of shared vs. exclusive HVAC leads, from a company selling neither.",
    datePublished: "2026-08-08",
    // 2026-08-30: answer-first lead, and the three-model comparison became a table.
    dateModified: "2026-08-30",
  },
  {
    slug: "how-to-choose-a-lead-generation-agency",
    navLabel: "Choosing a Vendor",
    metaTitle: "How to Choose an HVAC Lead Generation Company: Red Flags",
    description:
      "The seven questions that expose a bad HVAC lead-gen vendor — shared leads, data lock-in, hidden fees, long contracts — and our own answers to each.",
    datePublished: "2026-08-08",
    // 2026-08-30: answer-first lead, and every FAQ answer gained a stable anchor.
    dateModified: "2026-08-30",
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

// Google truncates a rendered <title> at roughly 60 characters. One number, applied by
// `pageMetadata` below, so the limit is enforced rather than described — the comment
// version of this rule had already rotted on five of the six pages that use the helper.
const TITLE_BUDGET = 60;

// The ONE social card, described once.
//
// The root `app/opengraph-image.tsx` route renders the 1200x630 image. Naming it
// explicitly is what carries it onto pages that declare their own `openGraph` (see the
// note on `pageMetadata`), and using the SAME array in app/layout.tsx keeps all nine
// routes publishing one og:image URL with a declared type. Social platforms cache
// og:image BY URL, so a site advertising two different URLs for one picture would, on a
// redesign, refresh some cards and permanently strand the rest.
//
// `alt` describes the PICTURE, not the page. It used to be interpolated per route
// ("B2B Lead Growth — Privacy Policy"), which published nine different descriptions of
// one static image. Keep this wording in step with the `alt` export in
// app/opengraph-image.tsx: lib/ cannot import that module (it pulls in next/og, and
// tests/ load this file directly under `node --test`).
const OG_IMAGE_PATH = "/opengraph-image";
const OG_IMAGE_ALT =
  "B2B Lead Growth — HVAC lead generation and appointment setting: reactivate unsold estimates and lapsed agreements, work your referral partners, book appointments";

export const ogImages = [
  { url: OG_IMAGE_PATH, width: 1200, height: 630, alt: OG_IMAGE_ALT, type: "image/png" },
];

/** The social card as a graph node, so WebPage and Article can reference one image. */
export function ogImageNode() {
  return {
    "@type": "ImageObject",
    "@id": `${siteUrl}/#primaryimage`,
    url: `${siteUrl}${OG_IMAGE_PATH}`,
    contentUrl: `${siteUrl}${OG_IMAGE_PATH}`,
    width: 1200,
    height: 630,
    caption: OG_IMAGE_ALT,
  };
}

/** Stable per-tier fragment, mirroring `faqSlug` in lib/content.ts. */
function planSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The WebPage node the rest of a page's graph hangs off.
 *
 * Without it every page published orphans: an FAQPage, a Service, an Article — none of
 * which named the document they appeared on or the site they belong to, so an answer
 * engine got four disconnected assertions instead of one entity graph.
 *
 * `dateModified` is optional ON PURPOSE. Structured data may only assert what a reader
 * can see, and only the guide pages render a visible "Last updated" line
 * (components/GuideLayout.tsx). The homepage does not, so it does not claim one.
 */
export function webPageJsonLd({
  /** The page's @id base: `${siteUrl}/` for the homepage, `${siteUrl}/<slug>` elsewhere. */
  idBase,
  /** The canonical URL exactly as the page publishes it. */
  url,
  name,
  description,
  datePublished,
  dateModified,
  /** @id of the node this page is primarily about (its Article, or its FAQPage). */
  mainEntityId,
  /** @id of the page's BreadcrumbList, where it publishes one. */
  breadcrumbId,
}: {
  idBase: string;
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  mainEntityId?: string;
  breadcrumbId?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${idBase}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    primaryImageOfPage: { "@id": `${siteUrl}/#primaryimage` },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
    ...(breadcrumbId ? { breadcrumb: { "@id": breadcrumbId } } : {}),
  };
}


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
  // Guides are Articles; everything else here is a plain page. Derived from the registry
  // rather than defaulted to "article", because /privacy and /terms pass no type and so
  // were publishing og:type="article" on two legal documents that are not articles.
  type = guidePages.some((p) => path === `/${p.slug}`) ? "article" : "website",
}: {
  /** Absolute path, leading slash. */
  path: string;
  title: string;
  description: string;
  type?: "article" | "website";
}) {
  const socialTitle = `${title} | ${brandName}`;
  // The root layout's "%s | B2B Lead Growth" template silently appends 18 characters to
  // every title that inherits it, which shipped rendered titles of 72-88 characters on
  // five of the six pages using this helper — and the half Google cut was always the
  // differentiating half, never the brand. So the suffix is applied only while the whole
  // thing still fits the budget. `absolute` is the only way to opt out of an inherited
  // template; the social title keeps the brand either way, where length is not the
  // constraint.
  const renderedTitle = socialTitle.length <= TITLE_BUDGET ? socialTitle : title;
  return {
    title: { absolute: renderedTitle },
    description,
    // Self-canonical: without this the App Router inherits the root layout's "/" and
    // points every page at the homepage.
    alternates: { canonical: path },
    openGraph: { title: socialTitle, description, type, url: path, siteName: brandName, images: ogImages },
    twitter: { card: "summary_large_image" as const, title: socialTitle, description, images: ogImages },
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
    // Named explicitly so an answer engine can state WHO this is for without having to
    // infer it from marketing copy. The niche is the single most important fact about
    // this business and the one most easily lost in summarisation.
    audience: {
      "@type": "BusinessAudience",
      name: "Established residential HVAC companies",
      audienceType: "Residential HVAC contractors with existing customer history",
    },
    // The two lanes, kept separate, because conflating them is the specific
    // misunderstanding that would misrepresent the service: homeowner records are the
    // client's own and are never sourced by us.
    serviceOutput: [
      { "@type": "Thing", name: "Reactivation list built from the client's own customer records" },
      { "@type": "Thing", name: "Researched referral-partner prospects, each with a cited public source" },
    ],
    termsOfService: `${siteUrl}/terms`,
    // ONE AggregateOffer wrapping the three tiers rather than three loose Offers.
    // "$750 to $2,500 a month across three tiers" is the sentence an answer engine wants
    // to be able to state, and lowPrice/highPrice/offerCount is the only shape that says
    // it — three sibling Offers leave it to be inferred. Every figure is derived from
    // `plans`, so it can only ever say what the tier table on / and /pricing shows.
    offers: {
      "@type": "AggregateOffer",
      "@id": `${siteUrl}/#offers`,
      priceCurrency: "USD",
      lowPrice: String(Math.min(...plans.map((p) => p.price))),
      highPrice: String(Math.max(...plans.map((p) => p.price))),
      offerCount: plans.length,
      url: `${siteUrl}/pricing`,
      offers: plans.map((p) => ({
        "@type": "Offer",
        // A stable identifier per tier, so a specific tier can be cited rather than the
        // price list as a whole. It is an @id and NOT yet the `url`: the tier cards on
        // /pricing and on the homepage carry no matching `id` attribute, and pointing a
        // `url` at a fragment that lands nowhere is a broken link we would be publishing
        // knowingly. Add id={planSlug(p.name)} to both card lists and `url` can follow.
        "@id": `${siteUrl}/pricing#${planSlug(p.name)}`,
        name: p.name,
        description: p.oneLiner,
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
    },
  };
}

export function getGuidePage(slug: string): GuidePage {
  const page = guidePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Guide page not registered in lib/pages.ts: ${slug}`);
  return page;
}

// WebPage + Article + BreadcrumbList JSON-LD shared by every guide page. FAQPage markup
// is added per-page (only where visible Q&A exists — markup must match visible text).
export function guideJsonLd(page: GuidePage) {
  const url = `${siteUrl}/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageJsonLd({
        idBase: url,
        url,
        name: page.metaTitle,
        description: page.description,
        datePublished: page.datePublished,
        // Safe to assert here, unlike on the homepage: GuideLayout renders
        // "Last updated: <dateModified>" at the top of every guide, so the structured
        // date and the visible date are the same field rendered twice.
        dateModified: page.dateModified,
        mainEntityId: `${url}#article`,
        breadcrumbId: `${url}#breadcrumbs`,
      }),
      ogImageNode(),
      {
        "@type": "Article",
        "@id": `${url}#article`,
        // This is the rendered <title>, which is NOT the visible H1 — every guide passes
        // its own H1 to GuideLayout as a literal. Google asks headline to match the
        // visible headline, so the real fix is an `h1` field on GuidePage that both this
        // and the page read from, plus a test. Copying the H1 string here instead would
        // give the site two copies with nothing checking them, and it would go stale the
        // first time a heading is reworded.
        headline: page.metaTitle,
        description: page.description,
        url,
        datePublished: page.datePublished,
        dateModified: page.dateModified,
        // Author stays the Organization deliberately: no guide renders a visible byline,
        // and a Person author that nothing on the page attributes would be a claim the
        // reader cannot check. Add the byline to GuideLayout first, then point this at
        // `${siteUrl}/#founder`.
        author: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        image: { "@id": `${siteUrl}/#primaryimage` },
        inLanguage: "en",
        isPartOf: { "@id": `${url}#webpage` },
        mainEntityOfPage: { "@id": `${url}#webpage` },
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
