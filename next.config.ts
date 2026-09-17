import type { NextConfig } from "next";

// Content-Security-Policy.
//
// `script-src` has to allow 'unsafe-inline': Next.js emits inline bootstrap and
// flight-data scripts on every page, and the JSON-LD blocks are inline too. Locking
// that down properly needs nonces, which requires middleware and forces every page
// out of static generation — a real cost for a static marketing site. So this policy
// does not claim to stop inline-script injection. What it does close off is
// everything else an injection would need to be useful: no external script origins,
// no plugins, no <base> rewriting, no posting the form anywhere but here, and no
// framing by another site. That is a meaningful improvement over shipping no CSP,
// and unlike a nonce-based policy it cannot silently break the page.
//
// The specific allowances:
//   style-src 'unsafe-inline'  — framer-motion and GSAP animate via inline styles
//   img-src data:              — the <select> chevron is a data: URI SVG
//   font-src 'self'            — next/font self-hosts the woff2 files at build
//   frame-src (schedulers)     — the booking step iframes Calendly/Cal.com when the
//                                booking URL points at one (Google Calendar links
//                                refuse framing and open in a new tab instead)
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self' https://calendly.com https://*.calendly.com https://cal.com https://*.cal.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// RETIRED PAGES (2026-09-17, D-027). Two guides were built for the residential lead-buying
// conversation — what homeowner leads cost in one state, and shared-versus-exclusive lead
// math — and neither describes the service any more. Each is sent, permanently, to the live
// page that now answers the nearest honest intent:
//
//   /hvac-lead-generation-new-jersey  ->  /commercial-hvac-lead-generation
//       A one-state doorway for a service delivered nationwide. Its successor is the
//       canonical service page, not another geography.
//   /shared-vs-exclusive-hvac-leads   ->  /how-to-choose-a-lead-generation-agency
//       The vendor-evaluation guide keeps the one part of that page that was cited and
//       still useful (how marketplace leads are sold, and the FTC's HomeAdvisor order) as a
//       clearly labelled contrast.
//
// `statusCode: 301` rather than `permanent: true` (which answers 308): both are permanent and
// both pass link equity, but 301 is what every SEO tool and the owner's brief call it.
// ONE hop each, straight to a 200 — never to another redirect. Keep this list in lockstep
// with `retiredPaths` in lib/pages.ts; tests/pricing-model.test.ts compares the two.
const RETIRED_PAGE_REDIRECTS = [
  {
    source: "/hvac-lead-generation-new-jersey",
    destination: "/commercial-hvac-lead-generation",
    statusCode: 301 as const,
  },
  {
    source: "/shared-vs-exclusive-hvac-leads",
    destination: "/how-to-choose-a-lead-generation-agency",
    statusCode: 301 as const,
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework and version to anyone scanning for known CVEs.
  poweredByHeader: false,
  async redirects() {
    return RETIRED_PAGE_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Kept alongside frame-ancestors for browsers that predate CSP Level 2.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // The booking step opens the scheduler with target="_blank"; these keep
          // that tab from getting a handle back into this one.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
