import LeadGenerationLanding from "@/components/LeadGenerationLanding";
import { faqs, plans } from "@/lib/content";
import { siteUrl, brandName, orgDescription, areaServed } from "@/lib/site";

// FAQPage + Service/Offer structured data, built server-side from the same arrays the
// UI renders so the markup always matches the visible text (Google rich-results rule).
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: brandName,
      url: siteUrl,
      description: orgDescription,
      serviceType: "B2B Lead Generation Services",
      areaServed,
      provider: { "@id": `${siteUrl}/#organization` },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.volume,
        // price/priceCurrency are also set on the Offer itself: Google reads those,
        // and an Offer carrying only a nested priceSpecification is treated as
        // having no price at all.
        price: String(p.price),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: siteUrl,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(p.price),
          priceCurrency: "USD",
          // UN/CEFACT code for month — the machine-readable form of unitText.
          unitCode: "MON",
          unitText: "MONTH",
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LeadGenerationLanding />
    </>
  );
}
