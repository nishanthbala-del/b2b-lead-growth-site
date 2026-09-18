import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { guidePages, homepageDateModified, legalRoutes, standaloneRoutes } from "@/lib/pages";

// ONLY canonical, indexable, current URLs — straight from the registry, so a page cannot be
// in the sitemap without being registered, and a retired path cannot linger here.
//
// Deliberately absent: the two redirected guides (lib/pages.ts `retiredPaths`), the
// token-gated /for-clients page and the /refer redirect (both noindex), /api/*, and the
// image and manifest routes. tests/pricing-model.test.ts asserts every entry below is
// registered, has a page file, and is not a redirect source.
//
// Priorities are relative hints, nothing more: the service page and the homepage lead, the
// money pages follow, the fit check and the entity page sit below them, legal last.
const GUIDE_PRIORITY: Record<string, number> = {
  "commercial-hvac-lead-generation": 0.9,
  "how-it-works": 0.8,
  pricing: 0.9,
  "free-pipeline-audit": 0.8,
  "how-to-choose-a-lead-generation-agency": 0.6,
  about: 0.5,
  // The commercial-search footprint (2026-09-18): the three buyers the service reaches, then
  // the two guides that teach its method.
  "hvac-property-manager-outreach": 0.7,
  "hvac-facility-manager-outreach": 0.7,
  "hvac-building-owner-outreach": 0.7,
  "how-to-find-commercial-hvac-accounts": 0.6,
  "commercial-hvac-cold-email": 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const at = (iso: string) => new Date(`${iso}T12:00:00Z`);
  return [
    { url: `${siteUrl}/`, lastModified: at(homepageDateModified), changeFrequency: "weekly", priority: 1 },
    // Every page carries its true content date from the registry, never the build date.
    ...guidePages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: at(p.dateModified),
      changeFrequency: "monthly" as const,
      priority: GUIDE_PRIORITY[p.slug] ?? 0.6,
    })),
    ...standaloneRoutes.map((r) => ({
      url: `${siteUrl}/${r.slug}`,
      lastModified: at(r.dateModified),
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...legalRoutes.map((r) => ({
      url: `${siteUrl}/${r.slug}`,
      lastModified: at(r.dateModified),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
