import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, KeyAnswer } from "@/components/GuideLayout";
import {
  boundarySentence,
  callingPolicy,
  contextFields,
  contractorBoundary,
  faqSlug,
  funnel,
  funnelClose,
  outcomeMetric,
  plans,
  qualificationStandard,
  sendingCadence,
  terminology,
} from "@/lib/content";
import { definedTermSetJsonLd, getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

// HOW THE WORK RUNS, and the four things a careful buyer needs defined before he trusts any
// of it: what happens when someone shows interest (it differs by plan), what "qualified"
// means (a standard, not an adjective), what a handoff contains (three different things), and
// when anyone picks up a phone (only after genuine engagement; never cold).
//
// Everything rendered here comes from lib/content.ts, which mirrors the operating-system
// repo's core/offer.py — so the definition a prospect reads here is the one the proposal, the
// call brief and the contract carry.

const page = getGuidePage("how-it-works");
const pageUrl = `${siteUrl}/${page.slug}`;

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "What counts as genuine interest?",
    answer:
      "Genuine interest is a relevant contact at an in-profile commercial account replying with real openness to continuing the conversation, and a person — not a keyword match — confirming it. An out-of-office reply, a bounce, a referral to a general inbox, a request to be removed, or a polite no is not interest, and is never counted as an interested prospect.",
  },
  {
    question: "What is the difference between screened interest and a qualified opportunity?",
    answer:
      "Screened interest means the basic relevance and intent of an interested reply have been checked: the account fits, the reply is genuine, and the person can take a vendor decision or has routed us to who does. A qualified opportunity goes further: the buyer has confirmed a concrete need, a timing and their agreement to hear from your team, and the useful property, buyer and scope context has been gathered. Screened interest is what Managed Pipeline hands over. A qualified opportunity is reserved for Qualified Opportunity Engine.",
  },
  {
    question: "Does every account go through qualification?",
    answer:
      "No. Qualification runs only on Qualified Opportunity Engine, and no account is forced through that workflow on another plan. Your plan decides which handling runs when a contact shows genuine interest, and a lower plan never quietly includes a higher plan's work.",
  },
  {
    question: "What triggers a phone call?",
    answer:
      "A call is triggered only by genuine engagement, never by a list. Our cold outreach is email-led and we make no cold calls on any plan. Once a contact has shown genuine interest, a call is appropriate when a live conversation would add something an email cannot — for example, agreeing a site visit. On Qualified Opportunity Engine we can run that engaged call under your written authorization; on the other two plans the call is yours to make.",
  },
  {
    question: "What happens when information is not available?",
    answer:
      "Unavailable information is recorded as unknown and never invented. A qualified opportunity handoff marks each unknown plainly, so your estimator knows what was confirmed by the buyer, what was found from a public source, and what nobody has established yet.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    definedTermSetJsonLd(pageUrl),
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        "@id": `${pageUrl}#${faqSlug(f.question)}`,
        url: `${pageUrl}#${faqSlug(f.question)}`,
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function HowItWorksPage() {
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
        eyebrow="How it works"
        intro={
          <>
            <p className="text-ink">
              Commercial HVAC managed outbound works in six stages: your capacity, suitable
              commercial accounts, the relevant contact, outreach in your name, genuine engagement,
              and then handling that depends on the plan you chose. Your team always estimates and
              closes.
            </p>
            <p>
              This page sets out each stage, what happens when a contact shows interest on each of
              the three plans, the standard an opportunity must meet before we call it qualified,
              what each handoff contains, and when a phone call happens.
            </p>
          </>
        }
      >
        <GuideSection id="process" title="The process, stage by stage">
          <p>The first five stages are identical on every plan.</p>
          <ol className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.stage} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">
                  {i + 1}. {f.stage}
                </span>
                <span className="block leading-7">{f.detail}</span>
              </li>
            ))}
          </ol>
          <p>After a handoff, the loop closes:</p>
          <ol className="space-y-3">
            {funnelClose.map((f) => (
              <li key={f.stage} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">{f.stage}</span>
                <span className="block leading-7">{f.detail}</span>
              </li>
            ))}
          </ol>
        </GuideSection>

        <GuideSection id="after-interest" title="What happens at genuine interest, plan by plan">
          <p>
            This is the only place the three plans differ. Each one is a different amount of the
            work between &ldquo;someone replied with interest&rdquo; and &ldquo;your estimator is
            in the room&rdquo;.
          </p>
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.name} id={`after-interest-${p.key.replace(/_/g, "-")}`} className="scroll-mt-20 rounded-lg border border-line bg-surface p-5">
                <h3 className="font-display text-2xl text-ink">
                  {p.name}{" "}
                  <span className="text-base font-normal text-subtle">
                    ${p.price.toLocaleString()}/mo
                  </span>
                </h3>
                <p className="mt-2 font-semibold text-ink/90">{p.afterInterest.join(" → ")}</p>
                <p className="mt-2 leading-7">{p.oneLiner}</p>
                <p className="mt-2 leading-7">
                  <span className="text-ink">Your side: </span>
                  {p.youKeep}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection id="qualification-standard" title="The qualification standard">
          <KeyAnswer>
            On Qualified Opportunity Engine, an opportunity is called qualified only when seven
            facts are on record with evidence, and three of them — the need, the timing, and the
            agreement to hear from your team — were confirmed by the buyer rather than inferred by
            us. It is a standard, never a label on a reply.
          </KeyAnswer>
          <ol className="space-y-3">
            {qualificationStandard.map((q, i) => (
              <li key={q.fact} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">
                  {i + 1}. {q.fact}
                  {q.buyerConfirmed ? (
                    <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                      Buyer-confirmed
                    </span>
                  ) : null}
                </span>
                <span className="block leading-7">{q.detail}</span>
              </li>
            ))}
          </ol>
          <h3 className="mt-8 font-display text-2xl text-ink">The context we gather, where it can honestly be obtained</h3>
          <ul className="mt-4 list-disc space-y-1.5 pl-5">
            {contextFields.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            Any of these may come back unknown. An unknown is recorded as unknown and never filled
            in. This standard applies to Qualified Opportunity Engine only; the other two plans
            hand over earlier, and say so.
          </p>
        </GuideSection>

        <GuideSection id="handoffs" title="Handoff definitions">
          <dl className="space-y-4">
            {plans.map((p) => (
              <div key={p.name} className="rounded-lg border border-line bg-surface p-5">
                <dt className="font-semibold text-ink">
                  {p.handoff.label} — {p.name}
                </dt>
                <dd className="mt-2 leading-7">{p.handoff.definition}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection id="calls" title="When a call happens">
          <ul className="list-disc space-y-2 pl-5">
            {callingPolicy.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection id="sending" title="How the sending is controlled">
          <dl className="space-y-4">
            {sendingCadence.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold text-ink">{c.title}</dt>
                <dd className="mt-1 leading-7">{c.body}</dd>
              </div>
            ))}
          </dl>
          <p>
            The onboarding before the first message — the intake, the account profile, your
            sign-off — is set out day by day in{" "}
            <Link href="/pricing#timeline" className="text-accent underline underline-offset-4">
              the timeline after you sign
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="measurement" title="How the work is measured">
          <KeyAnswer>{outcomeMetric.oneSentence}</KeyAnswer>
        </GuideSection>

        <GuideSection id="terminology" title="Terminology: five terms, never interchangeable">
          <dl className="space-y-4">
            {terminology.map((t) => (
              <div key={t.key} id={`term-${t.key}`} className="scroll-mt-20">
                <dt className="font-semibold text-ink">{t.term}</dt>
                <dd className="mt-1 leading-7">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection id="boundary" title="What we never do, on any plan">
          <KeyAnswer>{boundarySentence}</KeyAnswer>
          <p>We do not:</p>
          <ul className="list-disc space-y-2 pl-5">
            {contractorBoundary.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>
            <Link href="/pricing#who-owns-what" className="text-accent underline underline-offset-4">
              Who owns what on each plan
            </Link>{" "}
            is set out line by line on the pricing page.
          </p>
        </GuideSection>

        <GuideSection title="Common questions">
          <div className="divide-y divide-line border-y border-line">
            {pageFaqs.map((f) => (
              <div key={f.question} id={faqSlug(f.question)} className="scroll-mt-20 py-5">
                <h3 className="text-lg font-semibold text-ink">{f.question}</h3>
                <p className="mt-2 leading-7">{f.answer}</p>
              </div>
            ))}
          </div>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
