import LeadGenerationLanding from "@/components/LeadGenerationLanding";
import { faqs, plans } from "@/lib/content";
import { siteUrl, brandName, orgDescription } from "@/lib/site";

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
      areaServed: "United States",
      provider: { "@id": `${siteUrl}/#organization` },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.volume,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(p.price),
          priceCurrency: "USD",
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
