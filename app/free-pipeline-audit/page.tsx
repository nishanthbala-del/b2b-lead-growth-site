import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, KeyAnswer } from "@/components/GuideLayout";
import { audit, faqSlug, plans } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl, brandName, intakeMinutes, auditDeliveryWindow } from "@/lib/site";

const page = getGuidePage("free-pipeline-audit");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A on this page — FAQPage markup below is built from this same array
// so the structured data always matches the visible text verbatim.
const pageFaqs = [
  {
    question: "Is the free pipeline audit actually free?",
    answer:
      "Yes. The free pipeline audit costs nothing: no charge, no card on file, no obligation. Everything in it is yours to keep whether or not you ever hire us.",
  },
  {
    question: "Is it just a disguised sales pitch?",
    answer:
      "No. The audit is real work product, and you receive every deliverable before any sales conversation. We do offer a short walkthrough afterwards, and yes, if the work is useful we hope you consider a paid plan. The deliverable does not depend on taking that walkthrough or buying anything.",
  },
  {
    question: "Does the audit guarantee leads, appointments, or jobs?",
    answer:
      "No. The free pipeline audit promises no leads, appointments, or jobs, and nothing else we sell does either. It shows the quality of the research and the writing. Whether a job closes depends on your pricing, your reputation, your timing, and how the visit goes, which no honest vendor can guarantee.",
  },
  {
    question: "How long does it take to receive?",
    answer:
      `The audit arrives within ${auditDeliveryWindow}, not instantly. The fit check itself takes about ${intakeMinutes} minutes. Every account is individually researched, cited, and then re-checked against its own source before it can be included. Speed would defeat the point: the deliverable is proof of care, not a bulk list.`,
  },
  {
    question: "Why would a company give this away?",
    answer:
      "Because we are new and say so plainly. There is no wall of client logos to point to yet, so showing the actual work is the only honest proof available. If the free slice is good, every paid plan starts from the same research standard. If it is not good, you have lost nothing and kept the research.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${page.slug}#faq`,
      // Each Question carries the fragment its visible answer is stamped with below, so a
      // specific answer is citable on its own rather than only as part of the page. The
      // anchor and the schema fragment come from the SAME faqSlug() call, so rewording a
      // question moves both together and they cannot drift apart.
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        name: f.question,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
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
      // Every value already exists in the `audit` object above — nothing new is
      // asserted, this just tells a machine reader WHAT the $0 offer actually is.
      itemOffered: {
        "@type": "Service",
        "@id": `${siteUrl}/${page.slug}#audit`,
        name: audit.name,
        description: audit.tagline,
        serviceType: "Commercial HVAC sales pipeline audit",
        provider: { "@id": `${siteUrl}/#organization` },
        audience: { "@type": "BusinessAudience", name: "Established HVAC contractors with commercial work" },
      },
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
        intro={
          <>
            <p className="text-ink">
              A commercial HVAC pipeline audit is a short, concrete review of where your next
              commercial accounts are most likely to come from, and whether anything is going
              after them now. Ours is free, delivered in writing, and yours to keep.
            </p>
            <p>
              Every account in it is a business — a property manager, a building owner, a
              facilities team — researched from public sources, with the source link attached.
            </p>
            <p>
              This page lists exactly what arrives, how the process works, and what a legitimate
              free audit should include from any agency, not just us.
            </p>
          </>
        }
      >
        <GuideSection title="What lands in your inbox">
          {/* The extractable passage. Every other guide page carries one of these and this
              one did not — which mattered more here than anywhere else, because this is the
              page outbound email links to and the one an answer engine would quote to say
              what a "free pipeline audit" is. Deliberately self-contained (it names the
              company, the audience, the four deliverables, the price and the catch without
              needing the surrounding page) and deliberately ~60 words. Every fact in it is
              already stated elsewhere on this page; nothing new is claimed. */}
          <KeyAnswer>
            B2B Lead Growth&rsquo;s {audit.name} is a free, written deliverable for an
            established HVAC contractor with commercial work: a profile of the commercial
            accounts worth pursuing, 3&ndash;5 named commercial accounts in your service area
            each with a cited public source, one sample outreach message, and a read on where
            your commercial work comes from today. No call is required to receive it, and you
            keep it whether or not you hire us. Every account in it is a business, and it promises
            no results.
          </KeyAnswer>
          <ul className="space-y-4">
            {audit.includes.map((item) => (
              <li key={item.title} className="rounded-lg border border-line bg-surface p-5">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-2 leading-7">{item.body}</p>
              </li>
            ))}
          </ul>
          <p>{audit.guardrail}</p>
        </GuideSection>

        <GuideSection title="How the process works, in three steps">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-semibold text-ink">A {intakeMinutes}-minute fit check.</span> You
              tell us your service area, how much of your work is commercial, who quotes it, and
              how commercial work reaches you today. No card, no commitment.
            </li>
            <li>
              <span className="font-semibold text-ink">We research each account individually.</span>{" "}
              The business is real, it operates in your service area, the decision-maker is named,
              and the reason to approach them is cited to a public source you can click. Nothing is
              bulk-scraped, and every account is re-checked against its own cited source before it
              can be included.
            </li>
            <li>
              <span className="font-semibold text-ink">You get the audit, then an optional
              walkthrough.</span> The deliverable arrives in your inbox. If you want it, we go
              through it together and you decide, with the work already in hand, whether a paid
              plan is worth it.
            </li>
          </ol>
        </GuideSection>

        {/* How the free thing relates to the paid things. Without this a reader cannot tell
            whether the audit is a sample of the $750 plan, the $2,500 plan, or a brochure. It
            is a slice of the ACCOUNT RESEARCH that every plan begins with — and it includes
            no outreach at all, so nothing in it can be mistaken for a plan's handoff. */}
        <GuideSection id="audit-and-plans" title="How the audit relates to the three paid plans">
          <p>
            The audit is a free slice of the account research every paid plan begins with: the
            profile, a handful of researched accounts, and one message written for one of them.
            Nothing is sent to anyone as part of it.
          </p>
          <p>
            If you go on to a paid plan, the research standard stays the same and the plan decides
            how far we carry each opportunity before your team takes it:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {plans.map((p) => (
              <li key={p.name}>
                <span className="text-ink">
                  {p.name} (${p.price.toLocaleString()}/mo).
                </span>{" "}
                {p.oneLiner}
              </li>
            ))}
          </ul>
          <p>
            <Link href="/pricing#who-owns-what" className="text-accent underline underline-offset-4">
              Who owns what on each plan
            </Link>{" "}
            is set out line by line on the pricing page, and{" "}
            <Link href="/how-it-works" className="text-accent underline underline-offset-4">
              how the work runs
            </Link>{" "}
            is on its own page.
          </p>
        </GuideSection>

        <GuideSection title="What a legitimate free audit includes, from any agency">
          <p>
            Use this checklist on any agency offering a &ldquo;free audit,&rdquo; including us. A
            legitimate one includes:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Work you can keep.</span> If the &ldquo;audit&rdquo; only
              exists inside a sales call, it is a pitch, not an audit.
            </li>
            <li>
              <span className="text-ink">Named, checkable specifics.</span> Real businesses, real
              roles, real sources — not &ldquo;we found 47 opportunities in your area.&rdquo;
            </li>
            <li>
              <span className="text-ink">The reasoning, not just the list.</span> You should see
              why each account fits and who should be excluded, so the thinking is inspectable.
            </li>
            <li>
              <span className="text-ink">No manufactured urgency.</span> A real audit is just as
              true next week.
            </li>
            <li>
              <span className="text-ink">No guaranteed outcomes.</span> Anyone promising a specific
              number of leads or appointments from a free audit is guessing out loud.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What we will not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>We will not guarantee lead counts, reply rates, appointments, site visits, or revenue — on the audit or on any paid plan.</li>
            <li>We will not hand you a bought list. Every account in the audit is a business we researched ourselves, with its source.</li>
            <li>We will not pad the audit with bulk-scraped contacts to make it look bigger.</li>
            <li>We will not invent testimonials or case studies we do not have. We are new; the audit exists precisely because of that.</li>
            <li>We will not chase you. One deliverable, one optional walkthrough, your decision.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Common questions">
          {/* Each answer gets the stable anchor faqSlug() generates, and the FAQPage markup
              above cites the same fragment — so a specific answer is linkable and quotable on
              its own. Rewording a question changes its anchor, which is a URL change: check
              nothing external deep-links to the old one first. */}
          <div className="divide-y divide-line border-y border-line">
            {pageFaqs.map((f) => (
              <div key={f.question} id={faqSlug(f.question)} className="scroll-mt-20 py-5">
                <h3 className="text-lg font-semibold text-ink">{f.question}</h3>
                <p className="mt-2 leading-7">{f.answer}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-subtle">
            {brandName} is the operating name of this service. The audit shows work quality, not a
            promised result.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
