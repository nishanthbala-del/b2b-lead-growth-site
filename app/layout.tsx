import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import {
  siteUrl,
  brandName,
  orgDescription,
  areaServed,
  founderName,
  contactEmail,
  organizationProfiles,
} from "@/lib/site";
import { homepageMetaTitle, homepageDescription, ogImages } from "@/lib/pages";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// The homepage's title and description now sit in lib/pages.ts alongside every other
// route's, so one file holds the whole site's metadata and app/page.tsx can build its
// WebPage node from the exact strings this file renders. The reasoning behind the two
// strings — the ~60/~155 character budgets, why the niche leads, and why the price was
// taken out of the snippet — is recorded there.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // The template is a safety net for any future page that sets a bare string title.
  // Every page today goes through `pageMetadata`, which opts out of it on purpose: the
  // 18 characters it appends were pushing five rendered titles past what Google shows.
  title: { default: homepageMetaTitle, template: "%s | B2B Lead Growth" },
  description: homepageDescription,
  applicationName: brandName,
  // No `keywords` meta tag. Google has ignored it since 2009 and Bing reads a stuffed
  // one as a spam signal, so its only real effect here was publishing our target-phrase
  // list to competitors on all nine routes. What this company actually knows about is
  // asserted in `knowsAbout` on the Organization node below, which engines do read.
  alternates: { canonical: "/" },
  openGraph: {
    title: homepageMetaTitle,
    description: homepageDescription,
    type: "website",
    siteName: brandName,
    url: "/",
    // The same array every other route uses, so all nine advertise one og:image URL with
    // a declared type. The homepage was getting the file-convention URL and the other
    // eight a bare one — and social platforms cache og:image by URL, so a redesign would
    // have refreshed one card and stranded the rest.
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: homepageMetaTitle,
    description: homepageDescription,
    images: ogImages,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0B",
};

// Organization + WebSite structured data (FAQPage + Offers live on the landing page,
// built from the same source arrays so the markup always matches the visible text).
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: brandName,
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description: orgDescription,
      areaServed: areaServed,
      // A monitored inbox on the brand's own domain. Cheap, true, and one of the few
      // machine-checkable signals a brand-new organisation can offer that it is real.
      email: contactEmail,
      founder: { "@type": "Person", name: founderName },
      // Renders ONLY once real owned profiles exist (see lib/site.ts). An empty array
      // emits no sameAs at all rather than an empty one.
      ...(organizationProfiles.length > 0 ? { sameAs: organizationProfiles } : {}),
      // What this company is competent in, stated plainly for answer engines.
      knowsAbout: [
        "HVAC customer reactivation",
        "Unsold estimate follow-up",
        "Lapsed maintenance agreement renewals",
        "HVAC referral partner outreach",
        "B2B appointment setting",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: brandName,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
