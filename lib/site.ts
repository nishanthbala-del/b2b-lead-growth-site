// Single source of truth for the site's absolute base URL.
// Priority: explicit NEXT_PUBLIC_SITE_URL  →  Vercel's injected production URL  →  localhost.
// This keeps OG/canonical/sitemap/robots URLs correct even if NEXT_PUBLIC_SITE_URL
// is forgotten in the Vercel dashboard (a far better default than localhost).
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const brandName = "B2B Lead Growth";
