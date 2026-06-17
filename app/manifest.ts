import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B2B Lead Growth",
    short_name: "B2B Lead Growth",
    description:
      "B2B lead generation services for qualified sales opportunities — sourcing, outreach, and booked calls.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
