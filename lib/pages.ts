// Registry of every indexable page. Single source of truth: the sitemap, the navigation,
// per-page metadata, the visible H1, and the WebPage / Article / BreadcrumbList JSON-LD all
// read from here, so a page can't ship half-wired. Dates are real edit dates — never bump
// dateModified without a substantive content change (the visible date and the structured
// date must always agree; a mismatch is a trust signal against us).

// Relative, not the "@/" alias: tests/ import this module directly under `node --test`,
// which resolves real paths and knows nothing about the bundler's tsconfig aliases.
import {
  siteUrl,
  brandName,
  areaServed,
  orgDescription,
  founderName,
  intakeMinutes,
  legalLastUpdatedISO,
} from "./site.ts";
import { plans, planSlug, terminology } from "./content.ts";

// THE D-027 REWRITE DATE, in one place. On 2026-09-17 every page below was rewritten from
// the retired "Lead / Outreach / Appointment Engine" model to the three levels of
// responsibility (operating-system repo: D-027), two pages were retired behind redirects and
// three were added. A page that was NOT substantively edited that day keeps its own date.
const D027 = "2026-09-17";

// THE COMMERCIAL-SEARCH FOOTPRINT DATE: the three audience pages and the two guides first
// published on 2026-09-18 (see the note above their registry entries).
const SEO_FOOTPRINT = "2026-09-18";

// When adding ANY indexable route, add it to `guidePages`, `standaloneRoutes` or
// `legalRoutes` below and then to scripts/indexnow-ping.mjs, which carries its own explicit
// URL list (a .mjs script run outside the bundler cannot import this registry). /llms.txt is
// generated from this registry (lib/llms.ts) and needs no edit. tests/routes.test.ts and
// tests/pricing-model.test.ts fail if the lists stop agreeing, if a registered route has no
// page file, or if a redirected path is registered.
export const homepageDateModified = D027;

// The homepage's own title, description and H1, in the registry with every other route's.
//
// THE HOMEPAGE AND THE SERVICE PAGE DELIBERATELY DO NOT CHASE THE SAME QUERY. The homepage
// carries the company and the category ("commercial HVAC managed outbound"); the dedicated
// page at /commercial-hvac-lead-generation is the canonical answer to "commercial HVAC lead
// generation". Two pages on one site bidding for one phrase split what little authority a new
// domain has. The price stays out of this snippet for the same reason: /pricing should win a
// pricing query.
export const homepageMetaTitle = "Commercial HVAC Managed Outbound | B2B Lead Growth";
// THE H1 LEADS WITH THE BUYER'S OUTCOME (conversion supplement, "Hero"); the category and the
// buyer — "Managed outbound for commercial HVAC contractors" — are the eyebrow directly above
// it, the first words on the page. Until 2026-09-17 the H1 was the category line itself, which
// told a visitor what we run and nothing about what he gets. The outcome is stated as what the
// service is FOR, not as a promise: "conversations your team can quote" is the handoff, and
// the estimate and the close stay his.
export const homepageH1 = "Turn the commercial accounts in your market into conversations your team can quote.";
export const homepageDescription =
  "For established commercial HVAC contractors: we find commercial accounts, contact the right people in your name, and hand off at the level you choose.";

/** "service" pages describe the service itself; "solution" pages describe how it reaches ONE
 *  kind of commercial buyer and publish a Service node of their own; "guide" pages are
 *  Articles; "about" is the entity page. The kind decides og:type and which JSON-LD graph the
 *  page publishes. */
export type PageKind = "service" | "solution" | "guide" | "about";

/** Which group a page is listed under in the footer and in every page's "Keep reading" list:
 *  the service itself, the commercial buyers it reaches, or the practical guides. */
export type PageSection = "service" | "audience" | "guide";

export const PAGE_SECTIONS: { key: PageSection; label: string }[] = [
  { key: "service", label: "The service" },
  { key: "audience", label: "Who we reach for you" },
  { key: "guide", label: "Guides" },
];

export type GuidePage = {
  slug: string;
  navLabel: string;
  /** Rendered <title>. At most 60 characters — see TITLE_BUDGET. */
  metaTitle: string;
  /** The visible H1. The page passes THIS string to GuideLayout, and Article.headline reads
   *  the same field, so the structured headline and the visible one cannot drift. */
  h1: string;
  /** At most 155 characters. */
  description: string;
  datePublished: string; // ISO yyyy-mm-dd
  dateModified: string; // ISO yyyy-mm-dd
  kind: PageKind;
  /** Absent means "service". */
  section?: PageSection;
};

/** The group a registered page is listed under. */
export function pageSection(page: GuidePage): PageSection {
  return page.section ?? "service";
}

// ORDER IS THE READING ORDER: what the service is → how it runs → what it costs → the free
// sample → how to judge any vendor (us included) → who is behind it. The footer and every
// page's "Keep reading" list render in this order.
export const guidePages: GuidePage[] = [
  {
    slug: "commercial-hvac-lead-generation",
    navLabel: "Commercial HVAC Lead Generation",
    metaTitle: "Commercial HVAC Lead Generation Service",
    h1: "Commercial HVAC lead generation, run as managed outbound",
    description:
      "Commercial HVAC lead generation for established contractors: researched commercial accounts, outreach in your name, and a handoff at the level you choose.",
    datePublished: D027,
    dateModified: D027,
    kind: "service",
  },
  {
    slug: "how-it-works",
    navLabel: "How It Works",
    metaTitle: "How Commercial HVAC Managed Outbound Works",
    h1: "How commercial HVAC managed outbound works",
    description:
      "Step by step: account research, outreach in your name, what happens at genuine interest on each plan, the qualification standard, and the handoff.",
    datePublished: D027,
    dateModified: D027,
    kind: "guide",
  },
  {
    slug: "pricing",
    navLabel: "Pricing",
    metaTitle: "Commercial HVAC Lead Generation Pricing: $750–$2,500/Mo",
    h1: "Commercial HVAC lead generation pricing: $750, $1,500 or $2,500 a month",
    description:
      "Three levels of responsibility: Prospecting $750, Managed Pipeline $1,500, Qualified Opportunity Engine $2,500 a month. No setup fee, month-to-month.",
    datePublished: "2026-08-08",
    // The page was rebuilt around responsibility rather than volume: new plans, a
    // who-owns-what table, the handoff definitions, the boundary and the terminology.
    dateModified: D027,
    kind: "service",
  },
  {
    slug: "free-pipeline-audit",
    navLabel: "Free Pipeline Audit",
    metaTitle: "Free Commercial HVAC Pipeline Audit: What You Get",
    h1: "The Free Pipeline Audit for commercial HVAC contractors",
    description:
      "What the free pipeline audit delivers: an account profile, 3–5 vetted commercial accounts with cited reasons and source links, and a sample message.",
    datePublished: "2026-08-08",
    // New visible text: how the audit relates to the three paid plans, and that nothing is
    // sent to anyone as part of it.
    dateModified: D027,
    kind: "guide",
  },
  {
    slug: "how-to-choose-a-lead-generation-agency",
    navLabel: "Choosing a Partner",
    metaTitle: "How to Choose a Commercial HVAC Lead Generation Partner",
    h1: "How to choose a commercial HVAC lead generation partner: 10 questions, 8 red flags",
    description:
      "Ten questions that expose a weak commercial HVAC lead generation or managed outbound vendor — guarantees, vague qualification, lock-ins — with our answers.",
    datePublished: "2026-08-08",
    // Rewritten for choosing a COMMERCIAL outbound partner; the residential-marketplace
    // material survives only as one labelled, cited contrast.
    dateModified: D027,
    kind: "guide",
    section: "guide",
  },
  {
    slug: "about",
    navLabel: "About",
    metaTitle: "About B2B Lead Growth",
    h1: "About B2B Lead Growth",
    description:
      "B2B Lead Growth LLC is a founder-run commercial HVAC managed outbound company based in New Jersey, serving contractors across the US. Who runs it, and how.",
    datePublished: D027,
    dateModified: D027,
    kind: "about",
  },
  // THE COMMERCIAL-SEARCH FOOTPRINT (2026-09-18). Three pages, one per commercial buyer the
  // service reaches for a contractor — property managers, facility teams, building owners —
  // and two guides that teach the method the service runs on. Each audience page has to earn
  // its URL: a different buyer, a different buying process, different public sources and a
  // different first message. Three copies of one page with the noun swapped would be doorway
  // pages, which is the fastest way for a new domain to lose the little trust it has.
  {
    slug: "hvac-property-manager-outreach",
    navLabel: "Property managers",
    metaTitle: "Property Manager Outreach for Commercial HVAC Contractors",
    h1: "Property manager outreach for commercial HVAC contractors",
    description:
      "How commercial HVAC contractors win property management accounts: who to contact, the public sources that find them, and what a first email should say.",
    datePublished: SEO_FOOTPRINT,
    dateModified: SEO_FOOTPRINT,
    kind: "solution",
    section: "audience",
  },
  {
    slug: "hvac-facility-manager-outreach",
    navLabel: "Facility teams",
    metaTitle: "Facility Manager Outreach for Commercial HVAC Contractors",
    h1: "Facility manager outreach for commercial HVAC contractors",
    description:
      "How commercial HVAC contractors reach in-house facility teams: which facility managers buy outside HVAC help, how to find them, and when they plan work.",
    datePublished: SEO_FOOTPRINT,
    dateModified: SEO_FOOTPRINT,
    kind: "solution",
    section: "audience",
  },
  {
    slug: "hvac-building-owner-outreach",
    navLabel: "Building owners",
    metaTitle: "Building Owner Outreach for Commercial HVAC Contractors",
    h1: "Building owner outreach for commercial HVAC contractors",
    description:
      "How commercial HVAC contractors reach building owners: when to write to the owner rather than the manager, the public records that find them, what to say.",
    datePublished: SEO_FOOTPRINT,
    dateModified: SEO_FOOTPRINT,
    kind: "solution",
    section: "audience",
  },
  {
    slug: "how-to-find-commercial-hvac-accounts",
    navLabel: "Finding commercial accounts",
    metaTitle: "How to Find Commercial HVAC Accounts in Your Service Area",
    h1: "How to find commercial HVAC accounts in your service area",
    description:
      "A commercial HVAC prospecting method: define the account profile, work the public sources, choose the right person, and record why each account fits.",
    datePublished: SEO_FOOTPRINT,
    dateModified: SEO_FOOTPRINT,
    kind: "guide",
    section: "guide",
  },
  {
    slug: "commercial-hvac-cold-email",
    navLabel: "Writing the first email",
    metaTitle: "Commercial HVAC Cold Email: What to Send a Property Manager",
    h1: "Commercial HVAC cold email: what to send a property or facility manager",
    description:
      "How to write a commercial HVAC cold email a property or facility manager will read: the five parts, what to leave out, a template, follow-ups and the law.",
    datePublished: SEO_FOOTPRINT,
    dateModified: SEO_FOOTPRINT,
    kind: "guide",
    section: "guide",
  },
];

// Indexable routes that are neither guides nor legal pages: real destinations with their own
// metadata, linked from the site and from outbound email.
export type StandaloneRoute = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  description: string;
  dateModified: string;
  priority: number;
};

export const standaloneRoutes: StandaloneRoute[] = [
  {
    slug: "start",
    navLabel: "Fit check",
    metaTitle: "Commercial HVAC Fit Check",
    description: `A ${intakeMinutes}-minute fit check for established HVAC contractors with commercial work. A straight answer, including no — and a free pipeline audit if it fits.`,
    // One new question (whether you want opportunities qualified and the site visit
    // coordinated first), new plan names on every result screen.
    dateModified: D027,
    priority: 0.7,
  },
  {
    slug: "reviews",
    navLabel: "Reviews",
    metaTitle: "Client Reviews",
    description:
      "Real reviews from B2B Lead Growth clients, published only with their own words and named consent. Honestly empty until a real one exists.",
    // Unchanged in substance by the D-027 pass, so the date does not move.
    dateModified: "2026-09-05",
    priority: 0.3,
  },
];

export const legalRoutes = [
  {
    slug: "privacy",
    navLabel: "Privacy Policy",
    metaTitle: "Privacy Policy",
    description:
      "How B2B Lead Growth collects, uses, stores and protects the information you share through this website, including the fit check and its attribution fields.",
    dateModified: legalLastUpdatedISO,
  },
  {
    slug: "terms",
    navLabel: "Terms of Service",
    metaTitle: "Terms of Service",
    description:
      "The terms for the B2B Lead Growth website, the free pipeline audit, and the paid monthly plans — fees, billing, cancellation, refunds, and termination.",
    dateModified: legalLastUpdatedISO,
  },
] as const;

// Paths that USED to be pages and now answer with a permanent redirect (next.config.ts).
// Listed here so the tests can prove none of them is still registered, linked to, announced
// to IndexNow or written into llms.txt. Keep in lockstep with `redirects()` in next.config.ts.
export const retiredPaths: { from: string; to: string }[] = [
  { from: "/hvac-lead-generation-new-jersey", to: "/commercial-hvac-lead-generation" },
  { from: "/shared-vs-exclusive-hvac-leads", to: "/how-to-choose-a-lead-generation-agency" },
];

/** Every indexable path on the site, in sitemap order. The drift tests read this. */
export const indexablePaths: string[] = [
  "/",
  ...guidePages.map((p) => `/${p.slug}`),
  ...standaloneRoutes.map((r) => `/${r.slug}`),
  ...legalRoutes.map((r) => `/${r.slug}`),
];

// Google truncates a rendered <title> at roughly 60 characters, and a description at roughly
// 155. One number each, applied by `pageMetadata` and asserted by tests/pricing-model.test.ts,
// so the limit is enforced rather than described.
export const TITLE_BUDGET = 60;
export const DESCRIPTION_BUDGET = 155;

// The ONE social card, described once.
//
// The root `app/opengraph-image.tsx` route renders the 1200x630 image. Naming it explicitly
// is what carries it onto pages that declare their own `openGraph` (see the note on
// `pageMetadata`), and using the SAME array in app/layout.tsx keeps every route publishing
// one og:image URL with a declared type. Social platforms cache og:image BY URL.
//
// `alt` describes the PICTURE, not the page. Keep this wording in step with the `alt` export
// in app/opengraph-image.tsx: lib/ cannot import that module (it pulls in next/og, and tests/
// load this file directly under `node --test`).
const OG_IMAGE_PATH = "/opengraph-image";
const OG_IMAGE_ALT =
  "B2B Lead Growth — commercial HVAC managed outbound: we find the commercial accounts, contact the right people in your name, and hand off at the level you chose";

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

/** The founder as a graph node. Published by the root layout; referenced from /about. */
export function founderNode() {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#founder`,
    name: founderName,
    jobTitle: "Founder",
    worksFor: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/about`,
  };
}

/**
 * The WebPage node the rest of a page's graph hangs off.
 *
 * `dateModified` is optional ON PURPOSE. Structured data may only assert what a reader can
 * see, and only the pages rendered through GuideLayout show a visible "Last updated" line.
 * The homepage does not, so it does not claim one.
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
  /** @id of the node this page is primarily about (its Article, its Service, its FAQPage). */
  mainEntityId,
  /** @id of the page's BreadcrumbList, where it publishes one. */
  breadcrumbId,
  /** Extra schema.org types, e.g. "AboutPage". */
  additionalType,
}: {
  idBase: string;
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  mainEntityId?: string;
  breadcrumbId?: string;
  additionalType?: string;
}) {
  return {
    "@type": additionalType ? ["WebPage", additionalType] : "WebPage",
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
 *   1. `openGraph` does NOT merge field-by-field with the parent. A page that declares its
 *      own `openGraph` REPLACES the root layout's — including its `images`.
 *   2. `twitter` IS inherited wholesale when a page omits it, so a page would carry the
 *      HOMEPAGE's card title and description.
 * Passing both objects explicitly, with the image, is the only way to get this right, so it
 * happens here rather than in every page file.
 */
export function pageMetadata({
  path,
  title,
  description,
  // Only "guide" pages are Articles. Service pages, the about page, the fit check and the
  // legal documents are plain pages, and publishing og:type="article" on them was wrong.
  type = guidePages.some((p) => path === `/${p.slug}` && p.kind === "guide") ? "article" : "website",
}: {
  /** Absolute path, leading slash. */
  path: string;
  title: string;
  description: string;
  type?: "article" | "website";
}) {
  // A title that already names the brand ("About B2B Lead Growth") does not get it twice.
  const namesBrand = title.includes(brandName);
  const socialTitle = namesBrand ? title : `${title} | ${brandName}`;
  // The root layout's "%s | B2B Lead Growth" template silently appends 18 characters to every
  // title that inherits it. So the suffix is applied only while the whole thing still fits
  // the budget. `absolute` is the only way to opt out of an inherited template.
  const renderedTitle = socialTitle.length <= TITLE_BUDGET ? socialTitle : title;
  return {
    title: { absolute: renderedTitle },
    description,
    // Self-canonical: without this the App Router inherits the root layout's "/" and points
    // every page at the homepage.
    alternates: { canonical: path },
    openGraph: { title: socialTitle, description, type, url: path, siteName: brandName, images: ogImages },
    twitter: { card: "summary_large_image" as const, title: socialTitle, description, images: ogImages },
  };
}

/**
 * The ONE Service entity, with its Offers.
 *
 * `/`, `/pricing` and `/commercial-hvac-lead-generation` all publish this node under the
 * same `@id`, from this one builder, so three documents cannot publish three different sets
 * of facts under one identifier. Every figure and every sentence is derived from `plans`, so
 * the markup can only ever say what the plan cards on those pages show.
 */
export function serviceJsonLd() {
  return {
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    name: `${brandName} — Commercial HVAC Managed Outbound`,
    alternateName: "Commercial HVAC Lead Generation",
    url: `${siteUrl}/commercial-hvac-lead-generation`,
    description: orgDescription,
    serviceType: "Commercial HVAC Managed Outbound",
    category: "Commercial HVAC Lead Generation",
    areaServed,
    provider: { "@id": `${siteUrl}/#organization` },
    // Named explicitly so an answer engine can state WHO this is for without having to infer
    // it from marketing copy. The wording is the operating-system repo's core/icp.ONE_SENTENCE.
    audience: {
      "@type": "BusinessAudience",
      name: "Established HVAC contractors with commercial work",
      audienceType:
        "HVAC contractors that already sell and complete commercial work, have someone who quotes and wins those bids, have room to take on more accounts, and have no consistent way to find target accounts and follow up with them",
    },
    // What the service produces, PLAN BY PLAN. The three handoffs are three different things
    // and are named as such: a lower plan's output is never described with a higher plan's
    // noun, here or anywhere else (D-027 §4).
    serviceOutput: [
      {
        "@type": "Thing",
        name: "Researched commercial accounts — property and facility managers, building owners, multi-site operators — each with a named contact, a cited reason and a public source link (every plan)",
      },
      {
        "@type": "Thing",
        name: "First-touch outreach written per account and sent in the contractor's name, from the contractor's own mailbox (every plan)",
      },
      ...plans.map((p) => ({
        "@type": "Thing",
        name: `${p.handoff.label} — ${p.handoff.unit} (${p.name})`,
      })),
    ],
    termsOfService: `${siteUrl}/terms`,
    // ONE AggregateOffer wrapping the three plans. "$750 to $2,500 a month across three
    // plans" is the sentence an answer engine wants to be able to state, and
    // lowPrice/highPrice/offerCount is the only shape that says it.
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
        // A stable identifier per plan, and now the `url` too: every plan card on /pricing
        // carries id={planSlug(name)}, so the fragment lands on the card it describes.
        "@id": `${siteUrl}/pricing#${planSlug(p.name)}`,
        name: p.name,
        description: p.oneLiner,
        // price/priceCurrency are set on the Offer itself as well as in the nested
        // specification: Google reads the former, and an Offer carrying only a nested
        // priceSpecification is treated as having no price at all.
        price: String(p.price),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/pricing#${planSlug(p.name)}`,
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

/**
 * A solution page's own Service node: the service as it reaches ONE kind of commercial buyer.
 *
 * It points at the site-wide Service (`/#service`) with `isRelatedTo` rather than copying it.
 * That node carries the plans and the prices and is built from `plans`; a solution page quotes
 * no price, so its node quotes none either — markup may only say what the page says.
 */
export function solutionServiceJsonLd(page: GuidePage, name: string) {
  const url = `${siteUrl}/${page.slug}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    url,
    description: page.description,
    serviceType: "Commercial HVAC managed outbound",
    category: "Commercial HVAC Lead Generation",
    areaServed,
    provider: { "@id": `${siteUrl}/#organization` },
    isRelatedTo: { "@id": `${siteUrl}/#service` },
    audience: {
      "@type": "BusinessAudience",
      name: "Established HVAC contractors with commercial work",
    },
    termsOfService: `${siteUrl}/terms`,
  };
}

/**
 * The five canonical terms as a DefinedTermSet. Published ONLY by /how-it-works, where each
 * term is rendered with the matching `id="term-<key>"` anchor — markup may only mirror text
 * a visitor can see, at the address it says it is at.
 */
export function definedTermSetJsonLd(pageUrl: string) {
  return {
    "@type": "DefinedTermSet",
    "@id": `${pageUrl}#terminology`,
    name: `${brandName} service terminology`,
    url: `${pageUrl}#terminology`,
    hasDefinedTerm: terminology.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${pageUrl}#term-${t.key}`,
      name: t.term,
      description: t.definition,
      url: `${pageUrl}#term-${t.key}`,
      inDefinedTermSet: { "@id": `${pageUrl}#terminology` },
    })),
  };
}

export function getGuidePage(slug: string): GuidePage {
  const page = guidePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Guide page not registered in lib/pages.ts: ${slug}`);
  return page;
}

export function getStandaloneRoute(slug: string): StandaloneRoute {
  const route = standaloneRoutes.find((r) => r.slug === slug);
  if (!route) throw new Error(`Standalone route not registered in lib/pages.ts: ${slug}`);
  return route;
}

export function getLegalRoute(slug: "privacy" | "terms") {
  const route = legalRoutes.find((r) => r.slug === slug);
  if (!route) throw new Error(`Legal route not registered in lib/pages.ts: ${slug}`);
  return route;
}

function breadcrumbNode(url: string, label: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: brandName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: label, item: url },
    ],
  };
}

// The graph every GuideLayout page shares. FAQPage, Service, Offer and DefinedTermSet nodes
// are added per page, only where the visible content supports them.
//
//   guide   → WebPage + Article + BreadcrumbList   (the page IS an article)
//   service → WebPage + BreadcrumbList             (the page is ABOUT the Service node, which
//                                                   the page adds with serviceJsonLd())
//   about   → WebPage/AboutPage + BreadcrumbList   (the page is about the Organization)
export function guideJsonLd(page: GuidePage) {
  const url = `${siteUrl}/${page.slug}`;
  const mainEntityId =
    page.kind === "guide"
      ? `${url}#article`
      : page.kind === "service"
        ? `${siteUrl}/#service`
        : page.kind === "solution"
          ? `${url}#service`
          : `${siteUrl}/#organization`;

  const graph: Record<string, unknown>[] = [
    webPageJsonLd({
      idBase: url,
      url,
      name: page.metaTitle,
      description: page.description,
      datePublished: page.datePublished,
      // Safe to assert: GuideLayout renders "Last updated: <dateModified>" at the top of
      // every page it wraps, so the structured date and the visible date are one field.
      dateModified: page.dateModified,
      mainEntityId,
      breadcrumbId: `${url}#breadcrumbs`,
      additionalType: page.kind === "about" ? "AboutPage" : undefined,
    }),
    ogImageNode(),
  ];

  if (page.kind === "guide") {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      // The visible H1, from the same registry field the page renders.
      headline: page.h1,
      description: page.description,
      url,
      datePublished: page.datePublished,
      dateModified: page.dateModified,
      // The Organization, matching the visible "Published by B2B Lead Growth" line that
      // GuideLayout renders. No Person byline is claimed, because no page carries one.
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
      image: { "@id": `${siteUrl}/#primaryimage` },
      inLanguage: "en",
      isPartOf: { "@id": `${url}#webpage` },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    });
  }

  graph.push(breadcrumbNode(url, page.navLabel));

  return { "@context": "https://schema.org", "@graph": graph };
}
