import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, KeyAnswer } from "@/components/GuideLayout";
import { boundarySentence, positioningSentence } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import {
  basedIn,
  brandName,
  contactEmail,
  entityFormationState,
  founderName,
  legalEntityName,
} from "@/lib/site";

// WHO IS BEHIND THIS, stated plainly and checkably.
//
// A new company with no client results has exactly one kind of authority available to it:
// being identifiable. A named legal entity, a named founder, a working mailbox on the brand's
// own domain, and an honest account of how the work is done are all true today and all
// checkable — and until 2026-09-17 they were scattered across a footer, a Terms clause and a
// paragraph on the homepage, with no page an answer engine could cite for "who is B2B Lead
// Growth?".
//
// TWO RULES THIS PAGE LIVES UNDER.
//   * No fabricated proof. Nothing here claims a client, a result, an award, a rating or a
//     team size. tests/offer-integrity.test.ts scans this file like every other.
//   * Founder attribution is NOT a claim of ownership or signing authority. The founder is
//     named as the founder and operational lead — the person who does the work. The
//     contracting party is the LLC, and a signed agreement names its authorised signatory,
//     who may be a different person. Keep that wording in step with /terms §1.

const page = getGuidePage("about");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const structuredData = guideJsonLd(page);

const principles = [
  {
    title: "Cited or cut",
    body: "Every account we contact carries a public source you can open and the reason it was picked. An account with no citation cannot be contacted at all.",
  },
  {
    title: "Never homeowners",
    body: "Everyone we contact is a business. Homeowners are never researched, bought, inferred or contacted, on anyone's behalf, at any price.",
  },
  {
    title: "No promised outcomes",
    body: "We commit to the work and the standard it is done to. We do not promise revenue, contracts, appointments, site visits or a count of anything.",
  },
  {
    title: "Opt-outs are honored immediately",
    body: "Anyone who asks us to stop is suppressed in code, at once and permanently — even while a campaign is paused.",
  },
  {
    title: "Nothing invented",
    body: "No fabricated company, contact, reply, review or result, ever. Where information is not available, it is recorded as unknown.",
  },
];

export default function AboutPage() {
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
        eyebrow="About"
        intro={
          <>
            <p className="text-ink">
              {brandName} is a founder-run commercial HVAC managed outbound company. It is operated
              by {legalEntityName}, a {entityFormationState} limited liability company, is based in{" "}
              {basedIn}, and works remotely with established HVAC contractors across the United
              States.
            </p>
            <p>{positioningSentence}</p>
            <p>{boundarySentence}</p>
          </>
        }
      >
        <GuideSection title="Who runs it">
          <p>
            {founderName} is the founder and operational lead — the person who does the work and
            the person you deal with directly. There is no account manager between you and the
            person responsible.
          </p>
          <p>
            {legalEntityName} is the contracting party on every services agreement and every
            invoice. A signed agreement names the contracting party and its authorised signatory,
            who may be a different person from the founder.
          </p>
          <p>
            You can reach a person, without a form, at{" "}
            <a href={`mailto:${contactEmail}`} className="text-accent underline underline-offset-4">
              {contactEmail}
            </a>
            .
          </p>
        </GuideSection>

        <GuideSection title="One niche, on purpose">
          <KeyAnswer>
            {brandName} serves one kind of company: an established HVAC contractor that already
            sells and completes commercial work, has someone who quotes and wins those bids, has
            room to take on more accounts, and has no consistent way to find target accounts and
            follow up with them.
          </KeyAnswer>
          <p>
            A residential-only shop is not a fit, and the{" "}
            <Link href="/start" className="text-accent underline underline-offset-4">
              fit check
            </Link>{" "}
            says so on screen rather than after a call. One niche done carefully is the whole
            strategy: the research standard, the account types and the language are built for
            commercial HVAC and nothing else.
          </p>
        </GuideSection>

        <GuideSection title="How the work is actually done">
          <p>
            The research, the writing, the sending and the reply handling run on an automated
            system, with {founderName} accountable for it. Software does the repetitive, checkable
            parts; a person is accountable for the judgement and answers for the result.
          </p>
          <p>
            Every message has to clear automated checks before it can be sent: the account&rsquo;s
            citation, opt-out suppression, duplicate detection, daily sending caps, and a
            compliance content scan. Sending, suppression and opt-out handling are performed by
            code rather than left to memory. Outreach goes out from the client&rsquo;s own domain
            and mailbox, so a client can open the sent folder and read every message.
          </p>
          <p>
            <Link href="/how-it-works" className="text-accent underline underline-offset-4">
              How commercial HVAC managed outbound works, step by step
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="What we can show you, and what we cannot">
          <p>
            This is a new company. It started in 2026, and it has no client results, case studies
            or reviews to publish yet — so this site publishes none, and will not borrow or invent
            any. When a client leaves a real review, with their own words and named consent on
            file, it will appear on the{" "}
            <Link href="/reviews" className="text-accent underline underline-offset-4">
              reviews page
            </Link>
            .
          </p>
          <p>What you can check today, without talking to anyone:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Link href="/pricing" className="text-accent underline underline-offset-4">
                Every price, and who owns what on each plan
              </Link>
              . Nothing is quoted only on a call.
            </li>
            <li>
              <Link href="/terms" className="text-accent underline underline-offset-4">
                The full terms
              </Link>{" "}
              — fees, cancellation, refunds and dispute resolution — before any sales conversation.
            </li>
            <li>
              <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
                The free pipeline audit
              </Link>
              : real research on your own market, delivered in writing, yours to keep.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="The rules we work to">
          <dl className="space-y-4">
            {principles.map((p) => (
              <div key={p.title} className="border-l-2 border-accent/45 pl-4">
                <dt className="font-semibold text-ink">{p.title}</dt>
                <dd className="mt-1 leading-7">{p.body}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection title="How this site is written">
          <p>
            Every page on this site is published by {brandName} and carries the date it was last
            substantively changed. Where a page cites someone else&rsquo;s figure, the source is
            linked and the date we checked it is stated beside it; third-party estimates are
            labelled as estimates. Nothing here is written to rank for a place we do not work in
            or a service we do not provide.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
