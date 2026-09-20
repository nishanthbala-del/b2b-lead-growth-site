import type { Metadata } from "next";
import Link from "next/link";
import Figure from "@/components/Figure";
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
  warmHandoffSteps,
} from "@/lib/content";
import { definedTermSetJsonLd, getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

// HOW THE WORK RUNS, and the things a careful buyer needs defined before he trusts any of it
// (D-028): what happens when someone shows interest (it differs by plan), what an accepted
// sales opportunity is (a standard, not an adjective), what the warm handoff does (the same
// eight steps on both plans, at a different point), and when anyone picks up a phone (only
// after genuine engagement; never cold).
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
    question: "What is the difference between a qualified conversation and an accepted sales opportunity?",
    answer:
      "A qualified conversation is a decision-maker at an account that fits your profile who showed genuine interest and agreed to speak with your team, confirmed by a person. That is what Managed Outbound hands over, with a warm introduction. An accepted sales opportunity goes further: the buyer has confirmed a concrete need and a timing, the property, account and buyer information has been gathered, the opportunity has been checked against the acceptance criteria you agreed with us, and a concrete next sales step is set on a date. That is what the Opportunity Engine hands over, with a complete opportunity brief.",
  },
  {
    question: "Does every account go through opportunity validation?",
    answer:
      "No. Validation, acceptance against your criteria and next-step coordination run only on the Opportunity Engine. On Managed Outbound we hand the conversation to your team as soon as the prospect has agreed to speak with you, and your team does the deeper qualification from there. Managed Outbound never quietly includes the Opportunity Engine's work.",
  },
  {
    question: "What happens at the warm handoff?",
    answer:
      "The same eight steps on both plans: we create the handoff record, keep the account, contact, context and whole conversation together, make the warm introduction, coordinate your booking or calendar path when appropriate, notify you, transfer ownership of the conversation to you, mark the opportunity handed off, and keep tracking what happens next where you report it. On the Opportunity Engine the handoff also carries the opportunity brief and the next sales step already set.",
  },
  {
    question: "What triggers a phone call?",
    answer:
      "A call is triggered only by genuine engagement, never by a list. Our cold outreach is email-led and we make no cold calls on any plan. Once a contact has shown genuine interest, a call is appropriate when a live conversation would add something an email cannot — for example, agreeing a site assessment by your team. On the Opportunity Engine we can run that engaged call under your written authorization; on Managed Outbound the call is yours to make.",
  },
  {
    question: "What happens when information is not available?",
    answer:
      "Unavailable information is recorded as unknown and never invented. An opportunity brief marks each unknown plainly, so your estimator knows what was confirmed by the buyer, what was found from a public source, and what nobody has established yet.",
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
              the two plans, how the warm handoff works, the standard an opportunity must meet
              before we hand it over as an accepted sales opportunity, and when a phone call
              happens.
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
            This is the only place the two plans differ. Each one is a different amount of the
            work between &ldquo;someone replied with interest&rdquo; and &ldquo;your estimator is
            in the room&rdquo;.
          </p>
          <Figure
            src="/diagrams/commercial-hvac-qualified-conversation-vs-accepted-opportunity.svg"
            width={720}
            height={600}
            label="Diagram: where each plan hands the opportunity over"
            alt="A flow diagram. Both plans share one starting point: genuine interest, a reply confirmed by a person rather than a keyword match. The flow then splits. Managed Outbound, 1,500 dollars a month, goes straight from qualified interest to a warm handoff and the contractor receives a qualified conversation; it has no validation stage. Opportunity Engine, 2,500 dollars a month, adds a validation stage in which the need, timing and context are confirmed by the buyer and every criterion the contractor agreed is checked, then hands over an accepted sales opportunity with an opportunity brief. On both plans the contractor does the technical discovery, site assessment, estimate, proposal and close."
          >
            The same pipeline runs on both plans until a prospect replies with genuine interest.
            Managed Outbound hands them over as soon as they agree to speak with you. The
            Opportunity Engine first confirms the need, timing and context with the buyer, checks
            every criterion you agreed, and gets a next sales step the buyer confirms &mdash; then
            hands over an accepted sales opportunity with a brief. The technical discovery, site
            assessment, estimate, proposal and close stay with you on both.
          </Figure>
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

        <GuideSection id="warm-handoff" title="The warm handoff, on both plans">
          <p>
            Both plans end the same way: a warm handoff. What differs is the point it happens at —
            on Managed Outbound at qualified interest, on the Opportunity Engine at an accepted
            sales opportunity — and what travels with it. Every handoff runs the same steps:
          </p>
          <ol className="space-y-2">
            {warmHandoffSteps.map((step, i) => (
              <li key={step} className="border-l-2 border-line pl-4">
                <span className="font-semibold text-ink">{i + 1}.</span> {step}
              </li>
            ))}
          </ol>
          <p>
            From the handoff on, the conversation is your team&rsquo;s. We keep the record and
            report what happens next where you tell us, but we never estimate, propose or close.
          </p>
        </GuideSection>

        <GuideSection id="qualification-standard" title="The acceptance standard">
          <KeyAnswer>
            On the Opportunity Engine, an opportunity is handed over as an accepted sales
            opportunity only when seven facts are on record with evidence, and four of them — the
            buyer&rsquo;s agreement to talk, the need, the timing and the next sales step — were
            confirmed by the buyer rather than inferred by us. It is a standard, never a label on a
            reply.
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
            in. This standard applies to the Opportunity Engine only; Managed Outbound hands over
            earlier, at qualified interest, and says so.
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

        <GuideSection id="terminology" title="Terminology: six terms, never interchangeable">
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
