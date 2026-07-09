import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2B Lead Growth",
    short_name: "B2B Lead Growth",
    description:
      "Outbound lead generation for HVAC contractors and B2B teams — prospect research, personalized outreach, and organized follow-up that create new qualified sales opportunities.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
