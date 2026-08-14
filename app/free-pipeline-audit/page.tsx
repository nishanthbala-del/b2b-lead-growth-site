import type { Metadata } from "next";
import GuideLayout, { GuideSection } from "@/components/GuideLayout";
import { audit } from "@/lib/content";
import { getGuidePage, guideJsonLd } from "@/lib/pages";
import { siteUrl, brandName } from "@/lib/site";

const page = getGuidePage("free-pipeline-audit");

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: page.metaTitle,
    description: page.description,
    type: "article",
    url: `/${page.slug}`,
  },
};

// Visible Q&A on this page — FAQPage markup below is built from this same array
// so the structured data always matches the visible text verbatim.
const pageFaqs = [
  {
    question: "Is the free pipeline audit actually free?",
    answer:
      "Yes. There is no charge, no card on file, and no obligation. You receive the ICP snapshot, the 3–5 individually vetted prospects with cited reasons, and the sample outreach message, and they are yours to keep whether or not you ever hire us.",
  },
  {
    question: "Is it just a disguised sales pitch?",
    answer:
      "The audit is real work product, not a teaser. You get the deliverables before any sales conversation. We do offer a short walkthrough call afterward, and yes — if the work is useful, we hope you consider the paid tiers. But the deliverable does not depend on taking the call or buying anything.",
  },
  {
    question: "Does the audit guarantee leads or meetings?",
    answer:
      "No. The audit shows the quality of the research and writing — it does not promise replies, meetings, or revenue, and nothing we sell does either. Sales outcomes depend on your offer, market, follow-up, and closing, which no honest vendor can guarantee.",
  },
  {
    question: "How long does it take to receive?",
    answer:
      "The intake form takes about two minutes. Every prospect is individually researched, vetted, cited, and human-reviewed before delivery, so the audit arrives within a few business days, not instantly. Speed would defeat the point: the deliverable is proof of care, not a bulk export.",
  },
  {
    question: "Why would a company give this away?",
    answer:
      "Because we are new and say so plainly. There is no wall of client logos to point to yet, so showing the actual work is the only honest proof available. If the free slice is good, the paid engine is the same work at scale. If it is not good, you have lost nothing and kept the research.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "Offer",
      "@id": `${siteUrl}/${page.slug}#offer`,
      name: audit.name,
      description: audit.tagline,
      price: "0",
      priceCurrency: "USD",
      url: `${siteUrl}/${page.slug}`,
      offeredBy: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function FreePipelineAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <GuideLayout
        page={page}
        eyebrow="Start here"
        h1="The Free Pipeline Audit: what it includes and how it works"
        intro={
          <>
            <p>
              A pipeline audit is a short, concrete review of who your best-fit buyers are and
              whether your current targeting actually reaches them. Ours is free and delivered as
              real work product: a sharpened ideal-customer profile, 3–5 real prospects in your
              market, each individually vetted with a cited reason it is worth contacting, and one sample
              outreach message written the way we would actually send it. You keep all of it,
              whether or not you ever pay us anything.
            </p>
            <p>
              This page explains exactly what arrives, how the process works, and — because
              &ldquo;free audit&rdquo; is one of the most abused phrases in marketing — what a
              legitimate free audit should include from anyone, not just us.
            </p>
          </>
        }
      >
        <GuideSection title="What lands in your inbox">
          <ul className="space-y-4">
            {audit.includes.map((item) => (
              <li key={item.title} className="rounded-lg border border-gold-500/14 bg-ink-900/60 p-5">
                <p className="font-semibold text-bone">{item.title}</p>
                <p className="mt-2 leading-7">{item.body}</p>
              </li>
            ))}
          </ul>
          <p>{audit.guardrail}</p>
        </GuideSection>

        <GuideSection title="How the process works">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-semibold text-bone">A 2-minute intake.</span> You tell us your
              market, average deal size, and how you prospect today. No card, no commitment.
            </li>
            <li>
              <span className="font-semibold text-bone">We research each prospect individually.</span> The
              company is real, the buyer path is mapped, and the reason to contact them is cited to
              a public source you can click. Nothing is bulk-scraped, and a human reviews the
              finished audit before it is delivered.
            </li>
            <li>
              <span className="font-semibold text-bone">You get the audit, then an optional
              walkthrough.</span> The deliverable arrives in your inbox. If you want, we walk
              through it together and you decide — with the work in hand — whether running it at
              scale is worth paying for.
            </li>
          </ol>
        </GuideSection>

        <GuideSection title="What a legitimate free audit should include (from anyone)">
          <p>
            Use this checklist on any agency offering a &ldquo;free audit,&rdquo; including us. A
            legitimate one includes:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-bone">Work you can keep.</span> If the &ldquo;audit&rdquo; only
              exists inside a sales call, it is a pitch, not an audit.
            </li>
            <li>
              <span className="text-bone">Named, checkable specifics.</span> Real companies, real
              roles, real sources — not &ldquo;we found 47 opportunities in your market.&rdquo;
            </li>
            <li>
              <span className="text-bone">The reasoning, not just the list.</span> You should see
              why each prospect fits and who should be excluded, so the thinking is inspectable.
            </li>
            <li>
              <span className="text-bone">No manufactured urgency.</span> A real audit is just as
              true next week.
            </li>
            <li>
              <span className="text-bone">No guaranteed outcomes.</span> Anyone promising a specific
              number of leads or meetings from a free audit is guessing out loud.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What we will not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>We will not guarantee lead counts, reply rates, meetings, or revenue — on the audit or on any paid tier.</li>
            <li>We will not pad the audit with bulk-scraped contacts to make it look bigger.</li>
            <li>We will not invent testimonials or case studies we do not have. We are new; the audit exists precisely because of that.</li>
            <li>We will not chase you. One deliverable, one optional walkthrough, your decision.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Common questions">
          <div className="divide-y divide-gold-500/12 border-y border-gold-500/12">
            {pageFaqs.map((f) => (
              <div key={f.question} className="py-5">
                <h3 className="text-lg font-semibold text-bone">{f.question}</h3>
                <p className="mt-2 leading-7">{f.answer}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted/80">
            {brandName} is the operating name of this service. The audit shows work quality, not a
            promised result.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
