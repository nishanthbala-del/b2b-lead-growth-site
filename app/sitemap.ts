import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// `new Date()` at build time would tell crawlers both pages changed on every single
// deploy, including deploys that touched neither. Repeatedly claiming a change that
// didn't happen trains crawlers to stop trusting the signal, so these are pinned and
// updated by hand when the page content genuinely changes.
const HOME_LAST_MODIFIED = "2026-08-06";
const PRIVACY_LAST_MODIFIED = "2026-08-06";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: HOME_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: PRIVACY_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
