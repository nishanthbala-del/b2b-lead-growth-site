import type { Metadata } from "next";
import Link from "next/link";
import ExampleEmail from "@/components/ExampleEmail";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE WRITING STANDARD, WRITTEN OUT.
//
// These are the rules the service's own outbound is written and gated to (operating-system
// repo: D-022 plain language, D-024 an opportunity rather than a diagnosis, D-023 follow-ups
// that add something), restated for a contractor writing his own email. The legal section
// cites two primary sources — the FTC's CAN-SPAM compliance guide and Google's sender
// guidelines — each registered in SOURCES.md with its check date, and it says plainly that it
// is not legal advice.

const page = getGuidePage("commercial-hvac-cold-email");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const fiveParts = [
  {
    part: "A subject line that names the building or the site",
    detail: "\"HVAC service for [building name]\" tells the reader what the email is about before they open it.",
  },
  {
    part: "A first line with the reason you are writing now",
    detail: "A dated fact the reader can check: a new building, a new manager, a sale, a renovation permit.",
  },
  {
    part: "One line about your company that matters there",
    detail: "The equipment you service, the property type you know, how close your technicians are. Only what you can back up.",
  },
  {
    part: "Something small and useful",
    detail: "A second contractor on file, a maintenance proposal, after-hours cover, a written summary of the equipment.",
  },
  {
    part: "One question whose yes is obvious",
    detail: "\"Would that be useful?\" is easy to answer. \"When can we meet?\" asks for a commitment before you have earned one.",
  },
];

const subjectLines = [
  ["HVAC service for [building name]", "Names the building. Says what the email is about."],
  ["[Street address]: a second HVAC contractor on file?", "The offer, in the subject line."],
  ["HVAC support for the [town] site", "For a facility team with more than one site."],
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "How long should a commercial HVAC cold email be?",
    answer:
      "Short enough to read on a phone without scrolling: a subject line, three or four short sentences, and a signature. Everything else can wait for a reply.",
  },
  {
    question: "Should I attach a brochure or a capabilities statement?",
    answer:
      "Not to a first email. An attachment from a stranger is a risk to the reader and a warning sign to their spam filter. Offer to send it, and send it when they ask.",
  },
  {
    question: "Is cold email to businesses legal in the US?",
    answer:
      "Yes, when it follows the CAN-SPAM Act, which the FTC says makes no exception for business-to-business email. That means honest sender details and subject lines, a valid postal address, a clear way to opt out, and opt-outs honored within 10 business days. This is a summary, not legal advice; check your state's rules with your own counsel.",
  },
  {
    question: "Why send from my own domain instead of a separate one?",
    answer:
      "Because the reader should see the company they can look up, and you should be able to read every message in your own sent folder. It also means the domain's reputation is yours to protect, which is why sending should start slowly and stay low.",
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
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function CommercialHvacColdEmailPage() {
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
        eyebrow="Commercial HVAC outreach guide"
        intro={
          <>
            <p className="text-ink">
              A commercial HVAC cold email to a property or facility manager should be about one
              building: why you are writing now, one relevant thing you do, and one easy question.
              Send it from your own domain.
            </p>
            <p>
              These are the rules {brandName} writes to for the contractors it works for. They are
              built for a busy reader who will read the email once, on a phone, between two other
              things.
            </p>
          </>
        }
      >
        <GuideSection id="five-parts" title="The five parts of a first email">
          <ol className="space-y-3">
            {fiveParts.map((p, i) => (
              <li key={p.part} className="border-l-2 border-line pl-4">
                <span className="block font-semibold text-ink">
                  {i + 1}. {p.part}
                </span>
                <span className="block leading-7">{p.detail}</span>
              </li>
            ))}
          </ol>
          <p>
            Then a signature with your name, your company, its postal address and a plain way to
            opt out. The last two are the law, not decoration — see below.
          </p>
        </GuideSection>

        <GuideSection id="plain" title="Write it so it is understood the first time">
          <ul className="list-disc space-y-2 pl-5">
            <li>One idea per sentence.</li>
            <li>
              Name the thing. &ldquo;The rooftop units at [building name]&rdquo;, not
              &ldquo;them&rdquo;.
            </li>
            <li>Use the words the reader uses. Skip the jargon of marketing and of engineering.</li>
            <li>No &ldquo;just checking in&rdquo;, no &ldquo;touching base&rdquo;, no &ldquo;synergy&rdquo;.</li>
            <li>No fake reply lines. A subject that starts &ldquo;Re:&rdquo; on a first email is a trick.</li>
          </ul>
        </GuideSection>

        <GuideSection id="opportunity" title="Bring an opportunity, not a diagnosis">
          <KeyAnswer>
            Never tell a manager or an owner that their building has a problem you have not seen.
            Bring them something useful instead: an observation you can show, and an offer they can
            take or leave.
          </KeyAnswer>
          <GuideTable
            caption="The same first line written as a diagnosis and as an opportunity"
            head={["Written as a diagnosis", "Written as an opportunity"]}
            rows={[
              [
                "\"Your building's HVAC is probably outdated and costing you money.\"",
                "\"I saw that [company] took over management of [building name] in [month].\"",
              ],
              [
                "\"Most facility teams struggle to keep up with maintenance.\"",
                "\"We work alongside in-house teams on [equipment type], and cover calls after hours.\"",
              ],
            ]}
          />
          <p>
            The left column claims to know something about the reader&rsquo;s building. The right
            column states what you saw and what you offer, and lets the reader decide.
          </p>
        </GuideSection>

        <GuideSection id="templates" title="Two templates">
          <ExampleEmail
            label="Template: a property manager"
            subject="HVAC service for [building name]"
            body={[
              "Hi [first name],",
              "I saw on [management company]'s website that you manage [building name] on [street]. We service [equipment type] at [similar buildings] in [area], [distance] from there.",
              "If it would help to have a second HVAC contractor on file for [building name] before [the cooling season], I can send our maintenance terms. Would that be useful?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "If you would rather not hear from us, reply and say so, and we will not write again.",
            ]}
          />
          <ExampleEmail
            label="Template: a facility manager"
            subject="HVAC support for the [town] site"
            body={[
              "Hi [first name],",
              "I read in [source] that [organization] is adding [a second building] at the [town] site.",
              "We work alongside in-house teams on [equipment type], and we cover calls after hours when your technicians are off shift. If it would help to have us on file before [your next budget or shutdown], I can send a one-page summary of what we cover. Would that be useful?",
            ]}
            signoff={[
              "[Your name], [your title], [your company]",
              "[Your company's postal address]",
              "If you would rather not hear from us, reply and say so, and we will not write again.",
            ]}
          />
          <p>
            Fill every bracket with something true, or cut the sentence. A template sent with a
            guess in it is worse than no email. More on each buyer:{" "}
            <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
              property managers
            </Link>
            ,{" "}
            <Link href="/hvac-facility-manager-outreach" className="text-accent underline underline-offset-4">
              facility teams
            </Link>{" "}
            and{" "}
            <Link href="/hvac-building-owner-outreach" className="text-accent underline underline-offset-4">
              building owners
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="subject-lines" title="Subject lines">
          <GuideTable
            caption="Example subject lines for a first commercial HVAC email, and why each works"
            head={["Subject line", "Why it works"]}
            rows={subjectLines.map(([line, why]) => [
              <span key={line} className="font-semibold text-ink">
                {line}
              </span>,
              why,
            ])}
          />
          <p>
            Leave out anything that pretends: a fake &ldquo;Re:&rdquo;, a fake urgency, a question
            the email never answers. The subject line has to match what the email says.
          </p>
        </GuideSection>

        <GuideSection id="follow-ups" title="Follow-ups: add something new, then stop">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Each follow-up adds something the first email did not say: a relevant capability, a
              timing reason, a simpler offer. &ldquo;Bumping this up&rdquo; adds nothing.
            </li>
            <li>Leave several days between messages, and more as the sequence goes on.</li>
            <li>Stop after a few touches. Silence is an answer too.</li>
            <li>Stop at once if anyone asks you to, and never write to that company again.</li>
            <li>
              Read what was said before you write again. A follow-up that ignores a reply, or
              repeats your own last email, tells the reader nobody is reading.
            </li>
          </ul>
        </GuideSection>

        <GuideSection id="rules" title="The rules every commercial email has to follow">
          <KeyAnswer>
            In the US, the CAN-SPAM Act covers the commercial email you send to businesses. The FTC
            says the law makes no exception for business-to-business email.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            <li>The sender details must accurately identify who sent the email.</li>
            <li>The subject line must accurately reflect the content of the message.</li>
            <li>The message must disclose clearly that it is an advertisement; the law allows leeway in how.</li>
            <li>It must include your valid physical postal address.</li>
            <li>It must explain clearly how to opt out, and opt-outs must be honored within 10 business days.</li>
            <li>If someone sends email for you, you are still responsible for it.</li>
          </ul>
          <p>
            Deliverability has rules of its own. Google&rsquo;s sender guidelines require every
            sender to authenticate their mail with SPF or DKIM. Senders of more than 5,000 messages
            a day to Gmail accounts must use SPF, DKIM and DMARC. A contractor writing to a few
            accounts a day is nowhere near that number, but authentication still decides whether the
            email arrives.
          </p>
          <SourceNote>
            Sources:{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC, CAN-SPAM Act: A Compliance Guide for Business
            </a>{" "}
            ·{" "}
            <a
              href="https://support.google.com/mail/answer/81126"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Google, Email sender guidelines
            </a>{" "}
            (both checked September 18, 2026). This is a summary of published rules, not legal
            advice.
          </SourceNote>
        </GuideSection>

        <GuideSection id="have-it-done" title="Or have it written and sent for you">
          <p>
            {brandName} researches the accounts, writes each first email to these rules, and sends
            it from your own mailbox, in your name.{" "}
            <Link href="/how-it-works" className="text-accent underline underline-offset-4">
              How commercial HVAC managed outbound works
            </Link>
            , step by step. The{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free commercial HVAC pipeline audit
            </Link>{" "}
            includes one sample message written for an account in your own market.
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
