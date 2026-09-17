import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2B Lead Growth",
    short_name: "B2B Lead Growth",
    // Names the category, the buyer and the work (D-027). It used to end "qualified
    // conversations handed to your team", which promised every plan the top plan's noun.
    description:
      "Commercial HVAC managed outbound for established contractors: we find the commercial accounts, contact the right people in your name, and hand each opportunity to your team at the level you chose.",
    start_url: "/",
    display: "standalone",
    // White, matching the site since the 2026-09-05 relight (these were the retired #0A0A0B).
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
