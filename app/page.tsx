import LeadGenerationLanding from "@/components/LeadGenerationLanding";
import { faqs } from "@/lib/content";
import { serviceJsonLd } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

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
