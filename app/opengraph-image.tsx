import { ImageResponse } from "next/og";

// Auto-applied by the App Router to BOTH openGraph.images and twitter.images,
// which satisfies the `summary_large_image` Twitter card declared in layout.tsx.
//
// No `runtime = "edge"`: this card is completely static, and declaring the edge
// runtime opted the route out of static generation, so every scrape by every social
// crawler re-rendered the same PNG on demand. On the Node runtime it is generated
// once at build and served from the CDN.
export const alt =
  "B2B Lead Growth — HVAC lead generation and appointment setting: reactivate unsold estimates and lapsed agreements, work your referral partners, book appointments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette — mirrors tailwind.config.ts, and it has to. This card is the first
// thing anyone sees of the brand when the link is pasted into a Slack or a text, and
// until 2026-09-05 it rendered the retired near-black-and-gold scheme, so a shared link
// previewed one company and opened another. Relit with the same semantic tokens the
// site uses; the comment above was already claiming this and was simply untrue.
const PAPER = "#FFFFFF";
const SURFACE = "#F8F7F4";
const INK = "#15151A";
const SUBTLE = "#56565F";
const ACCENT = "#8A6A23";
const ACCENT_LIGHT = "#96742A";
const LINE = "#E4E1DA";

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
          backgroundColor: PAPER,
          // A whisper of the accent in one corner instead of the old gold bloom: enough to
          // stop a pure-white card disappearing into a white chat background, not enough
          // to tint the headline sitting over it.
          backgroundImage: `radial-gradient(circle at 88% 6%, ${SURFACE}, transparent 60%)`,
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
            backgroundImage: `linear-gradient(90deg, ${ACCENT_LIGHT}, ${ACCENT} 60%, ${ACCENT})`,
          }}
        />

        {/* Wordmark with the ascending-bars motif from the favicon */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <div style={{ width: 14, height: 26, borderRadius: 3, backgroundColor: LINE }} />
            <div style={{ width: 14, height: 40, borderRadius: 3, backgroundColor: ACCENT_LIGHT }} />
            <div style={{ width: 14, height: 56, borderRadius: 3, backgroundColor: ACCENT }} />
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: ACCENT,
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
              color: INK,
              maxWidth: 980,
            }}
          >
            HVAC lead generation, done the honest way
          </div>
          <div style={{ fontSize: 30, color: SUBTLE, maxWidth: 920, lineHeight: 1.35 }}>
            Reactivate the estimates and agreements already in your system. Work your referral
            partners. Book appointments.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: PAPER,
              backgroundImage: `linear-gradient(180deg, ${ACCENT_LIGHT}, ${ACCENT})`,
              padding: "12px 26px",
              borderRadius: 4,
            }}
          >
            $750 · $1,500 · $2,500 / mo
          </div>
          <div style={{ fontSize: 22, color: SUBTLE }}>
            No setup fee · Month-to-month · Never sold per lead
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
