import { ImageResponse } from "next/og";

// Auto-applied by the App Router to BOTH openGraph.images and twitter.images,
// which satisfies the `summary_large_image` Twitter card declared in layout.tsx.
export const runtime = "edge";
export const alt = "B2B Lead Growth — B2B Lead Generation for Qualified Sales Opportunities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors tailwind.config.ts / icon.svg).
const INK = "#0A0A0B";
const GOLD_400 = "#D4AF37";
const GOLD_200 = "#E8D9A8";
const BRONZE = "#9D7A2B";
const BONE = "#F5F1E8";
const MUTED = "#B8B3A8";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          backgroundImage: `radial-gradient(circle at 78% 8%, rgba(201,162,75,0.22), transparent 55%)`,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top hairline */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundImage: `linear-gradient(90deg, ${GOLD_200}, ${GOLD_400} 45%, ${BRONZE})`,
          }}
        />

        {/* Wordmark with the ascending-bars motif from the favicon */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <div style={{ width: 14, height: 26, borderRadius: 3, backgroundColor: BRONZE }} />
            <div style={{ width: 14, height: 40, borderRadius: 3, backgroundColor: GOLD_400 }} />
            <div style={{ width: 14, height: 56, borderRadius: 3, backgroundColor: GOLD_200 }} />
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: GOLD_200,
              textTransform: "uppercase",
            }}
          >
            B2B Lead Growth
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              color: BONE,
              maxWidth: 980,
            }}
          >
            B2B Lead Generation for Qualified Sales Opportunities
          </div>
          <div style={{ fontSize: 30, color: MUTED, maxWidth: 920, lineHeight: 1.35 }}>
            Best-fit buyers, done-for-you outreach, and qualified calls booked on your calendar.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: INK,
              backgroundImage: `linear-gradient(135deg, ${GOLD_200}, ${GOLD_400} 40%, ${BRONZE})`,
              padding: "12px 26px",
              borderRadius: 4,
            }}
          >
            $500 · $1,000 · $1,500 / mo
          </div>
          <div style={{ fontSize: 22, color: MUTED }}>You approve every message before it sends.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
