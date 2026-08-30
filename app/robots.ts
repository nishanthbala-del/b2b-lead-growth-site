import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// The named AI agents are the ones that decide AI-search visibility: ChatGPT search
// reads OAI-SearchBot plus Bing's index, and Perplexity, Claude, and Google's AI
// surfaces each fetch under their own user agent. This is a public marketing site
// with zero proprietary content, so search bots, user-fetch bots, AND training bots
// are all welcome — being quotable is the entire point.
//
// The `*` rule below already permits every one of them, so this group changes no
// bot's behaviour TODAY. It is here to state the intent explicitly and to survive a
// future edit: the failure mode this guards against is someone adding a blanket
// disallow, or a crawler flipping its own default to opt-in, and the site dropping
// out of AI answers with nothing in the repo recording that we wanted to be in them.
//
// Restored from commit 2705c1a, which SEO_GROWTH_PLAN.md §8.5 records as shipped but
// which never reached this branch — the later "restore the guide pages" commit
// (c3c89a5) brought back the plan document without this file's half of the work.
const aiAgents = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    // `host` is deliberately omitted: Google has never supported it, Yandex
    // dropped it in 2021, and an unrecognised directive is noise at best.
    // Canonical URLs (set in layout.tsx) are what actually establish the origin.
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: aiAgents, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
