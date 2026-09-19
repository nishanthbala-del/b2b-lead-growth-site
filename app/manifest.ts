import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2B Lead Growth",
    short_name: "B2B Lead Growth",
    // Names the category, the buyer and the work (D-028). "Qualified conversations" is true of
    // BOTH plans under D-028 — it is what Managed Outbound hands over and what the Opportunity
    // Engine develops further — so, unlike under D-027, it promises no plan another's noun.
    description:
      "Commercial HVAC managed outbound for established contractors: we find the commercial accounts, reach the decision-makers in your name, and hand your team qualified conversations.",
    start_url: "/",
    display: "standalone",
    // White, matching the site since the 2026-09-05 relight (these were the retired #0A0A0B).
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
