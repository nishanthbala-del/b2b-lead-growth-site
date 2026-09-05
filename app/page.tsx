import LeadGenerationLanding from "@/components/LeadGenerationLanding";
import { faqSlug, faqs } from "@/lib/content";
import {
  homepageDescription,
  homepageMetaTitle,
  ogImageNode,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// FAQPage + Service/Offer structured data, built server-side from the same arrays the
// UI renders so the markup always matches the visible text (Google rich-results rule).
//
// Everything now hangs off one WebPage node. The homepage used to publish four
// unconnected assertions — Organization and WebSite from the layout, FAQPage and Service
// from here — none of which named the document they appeared on, so nothing told an
// answer engine they described the same thing.
//
// Each Question carries the SAME fragment its visible answer is anchored at: the FAQ
// list in components/LeadGenerationLanding.tsx already renders id={faqSlug(question)},
// so an individual answer is addressable at its own URL and the markup was the only
// part throwing that away. Re-wording a question changes its slug and therefore changes
// a published URL — see the note on faqSlug in lib/content.ts before editing one.
//
// Deliberately NO dateModified on this WebPage node. Structured data may only assert
// what a reader can see, and the homepage renders no "Last updated" line; the guide
// pages do, so theirs carry one. To claim a date here, render `homepageDateModified`
// (lib/pages.ts) in the footer FIRST, then add it to this node.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    webPageJsonLd({
      idBase: `${siteUrl}/`,
      url: siteUrl,
      name: homepageMetaTitle,
      description: homepageDescription,
      mainEntityId: `${siteUrl}/#faq`,
      breadcrumbId: `${siteUrl}/#breadcrumbs`,
    }),
    ogImageNode(),
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumbs`,
      itemListElement: [{ "@type": "ListItem", position: 1, name: brandName, item: siteUrl }],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      isPartOf: { "@id": `${siteUrl}/#webpage` },
      mainEntity: faqs.map((f) => {
        const anchor = `${siteUrl}/#${faqSlug(f.question)}`;
        return {
          "@type": "Question",
          "@id": anchor,
          url: anchor,
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer, url: anchor },
        };
      }),
    },
    serviceJsonLd(),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <LeadGenerationLanding />
    </>
  );
}
