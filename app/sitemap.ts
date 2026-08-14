import type { MetadataRoute } from "next";
import { siteUrl, legalLastUpdatedISO } from "@/lib/site";
import { guidePages, homepageDateModified } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${homepageDateModified}T12:00:00Z`);
  // Legal pages carry their real last-edited date, not the build date.
  const legalModified = new Date(`${legalLastUpdatedISO}T12:00:00Z`);
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    // Guide pages carry their true content dates from the registry.
    ...guidePages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: new Date(`${p.dateModified}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/privacy`, lastModified: legalModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: legalModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
