import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // `host` is deliberately omitted: Google has never supported it, Yandex
    // dropped it in 2021, and an unrecognised directive is noise at best.
    // Canonical URLs (set in layout.tsx) are what actually establish the origin.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
