import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2B Lead Growth",
    short_name: "B2B Lead Growth",
    // Was generic B2B copy predating the HVAC repositioning, and it promised "booked
    // calls" as a deliverable. Names the niche and the work instead.
    description:
      "HVAC lead generation and appointment setting for established residential HVAC companies: reactivating your own unsold estimates and lapsed agreements, plus researched referral partners.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
