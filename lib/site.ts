// Single source of truth for the site's absolute base URL.
// We PIN the stable Vercel production URL as the canonical default. This guarantees
// that canonical/OG/sitemap/robots/JSON-LD always point at the stable production
// origin — never at a per-deployment preview hostname (the long *.vercel.app URL),
// never at localhost, and never at a custom domain we don't own. Canonical URLs are
// supposed to point at production even when rendered from a preview build, so pinning
// is the SEO-correct behavior. An explicit NEXT_PUBLIC_SITE_URL still overrides — set
// it only if a real custom domain is added later.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://b2b-lead-growth-site.vercel.app";

export const brandName = "B2B Lead Growth";

// Canonical organization/service description used in JSON-LD structured data.
export const orgDescription =
  "B2B Lead Growth helps service businesses find researched, verified, ICP-fit prospects and build cleaner sales pipelines.";
