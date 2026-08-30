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

// Title kept under ~60 characters so Google doesn't truncate it. It leads with the
// NICHE + the service, because "HVAC lead generation" is what the buyer searches and
// "B2B Lead Growth" is a brand nobody is looking for yet. Description under ~155
// characters, and it names the actual mechanism (your own list + referral partners)
// rather than implying we sell homeowner leads, which we do not.
const siteTitle = "HVAC Lead Generation & Appointment Setting | B2B Lead Growth";
const siteDescription =
  "Reactivate the unsold estimates and lapsed agreements already in your system, plus referral-partner outreach. For established HVAC companies. From $750/mo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | B2B Lead Growth" },
  description: siteDescription,
  applicationName: brandName,
  keywords: [
    "HVAC lead generation",
    "HVAC appointment setting",
    "HVAC customer reactivation",
    "HVAC marketing New Jersey",
    "unsold estimate follow-up",
    "HVAC referral partners",
    "HVAC maintenance agreement renewals",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    siteName: brandName,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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
