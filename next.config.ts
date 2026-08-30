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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework and version to anyone scanning for known CVEs.
  poweredByHeader: false,
  async redirects() {
    return [
      // 2026-08-29: slug shortened from hvac-lead-generation-new-jersey. Google had
      // already crawled the site under the old path, so a permanent redirect carries
      // that signal forward instead of leaving a 404 behind.
      {
        source: "/hvac-lead-generation-new-jersey",
        destination: "/hvac-lead-generation",
        permanent: true,
      },
    ];
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
