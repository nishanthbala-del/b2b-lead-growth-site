import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE ONE RULE, ON ITS OWN URL.
//
// The research method page covers finding accounts; the buyer pages each list the public
// sources for one buyer. The rule that governs all of them — a signal is a reason to CONTACT
// an account, never proof that the account needs HVAC work or intends to buy — was stated
// inside those pages and defined in the operating system's vocabulary module, but had no page
// of its own. It is the single most load-bearing idea in the method and the one a contractor
// most often gets wrong, because every prospecting tool on the market sells signals as "intent".
//
// WHY THAT MATTERS COMMERCIALLY, not just ethically: a contractor who reads a permit as proof
// of need writes "I see you're having HVAC problems", which is a guess about a building he has
// not seen. That email is the reason managers stop reading contractors' email at all.
//
// Every trigger listed here is one a person can verify in a public record with a date on it.
// No figures are cited, so none needs a source.

const page = getGuidePage("commercial-hvac-prospecting-triggers");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const triggers = [
  {
    trigger: "A new property manager or management company",
    source: "Management company news, the building's own site, a leasing page, a press release",
    tells: "The person who decides the vendor list has changed, and is forming their own.",
    doesNot: "Say anything about the equipment, or that the previous contractor was a problem.",
  },
  {
    trigger: "A building changes hands",
    source: "County property records, commercial real-estate press",
    tells: "A new owner is reviewing what the building costs to run, usually within the first year.",
    doesNot: "Mean the HVAC is due for anything. Plenty of buildings sell with new equipment.",
  },
  {
    trigger: "A new site, or a portfolio expansion",
    source: "Company announcements, a locations page that gained an address, permits",
    tells: "There is a building with no vendor history, and someone has to choose one.",
    doesNot: "Tell you whether HVAC is already contracted as part of the fit-out.",
  },
  {
    trigger: "A renovation or fit-out permit",
    source: "City or county permit records, searchable by address in many jurisdictions",
    tells: "Work is planned at a known address on a known date, and budgets are open.",
    doesNot: "Mean the mechanical work is available. Read who pulled the permit — it may be an HVAC contractor.",
  },
  {
    trigger: "A facilities or maintenance job posting",
    source: "The company's own careers page, public job boards",
    tells: "The in-house team is short-handed or being rebuilt, and outside cover is often bought meanwhile.",
    doesNot: "Mean they want a contractor. They may be hiring precisely to stop using one.",
  },
  {
    trigger: "A tenant moving in or out of a known space",
    source: "Leasing announcements, the building's availability page",
    tells: "A space is being turned over, which is when equipment gets attention.",
    doesNot: "Identify what that attention needs, or who pays for it.",
  },
];

const notTriggers = [
  "The company exists and is in your service area. That is the account profile, not a reason to write this week.",
  "The building looks old in a street-view photo. You have not seen the roof, and neither has the person reading your email.",
  "Their website is dated. It says something about their marketing and nothing about their mechanical plant.",
  "A vendor sold you a list that says they are “in-market”. You cannot show the buyer what that is based on, so neither can you.",
  "It is the start of the cooling season. That is true of every building in the country on the same day.",
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "What counts as a trigger for contacting a commercial account?",
    answer:
      "A public, dated fact about that specific account that a reader could check for themselves: a new property manager, a building sale, a new site, a permit, a facilities job posting, a tenant change. If you cannot link to it and say when you checked it, it is not a trigger.",
  },
  {
    question: "Does a trigger mean the account needs HVAC work?",
    answer:
      "No, and treating it that way is the most common mistake in commercial prospecting. A signal is a reason to contact an account. It is not proof of an HVAC need and not proof of buying intent. The need exists when the buyer states it in their own words; until then you have a reason to write, nothing more.",
  },
  {
    question: "How old can a trigger be and still be worth writing about?",
    answer:
      "It depends on the event, and the honest test is whether the reader would still consider it current. A management change or a sale stays relevant for months because the consequences take that long. A permit is about a specific dated job. An announcement from two years ago is not a reason to write today.",
  },
  {
    question: "Are intent-data or buyer-signal tools worth buying for this?",
    answer:
      "They are tools, not the work, and most of what they sell as intent cannot be shown to the buyer. The test we apply is simple: if you cannot put the source in the email and have the reader agree it says what you claim, it is not usable. Public records fail that test far less often than scored intent feeds.",
  },
  {
    question: "What do you do when an account fits but nothing has happened at it?",
    answer:
      "It goes back on the list. An account that fits your profile but has no current reason to be written to is not ready, and sending anyway produces the generic email everyone deletes. The list is worked again as events appear, which is why research is continuous rather than a one-time build.",
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
  ],
};

export default function CommercialHvacProspectingTriggersPage() {
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
        eyebrow="The research method"
        intro={
          <>
            <p className="text-ink">
              A prospecting trigger is a public, dated fact about one commercial account that gives
              you a reason to contact it now — a new property manager, a sale, a new site, a permit.
              A trigger is a reason to write. It is not proof the account needs HVAC work.
            </p>
            <p>
              That second sentence is the whole discipline. Every prospecting tool on the market
              sells signals as &ldquo;intent&rdquo;, and a contractor who believes it writes emails
              that diagnose a building he has never entered. This page lists the events that hold
              up, where to verify each one, and what each does and does not tell you.
            </p>
          </>
        }
      >
        <GuideSection id="rule" title="The rule that governs every signal">
          <KeyAnswer>
            A signal is a reason to contact an account — not proof of HVAC need, and not proof of
            buying intent. The need exists when the buyer states it, in their own words. Until
            then, the honest sentence is an observation about something that happened, not a
            conclusion about their equipment.
          </KeyAnswer>
          <p>
            The difference shows up in one line of the email.{" "}
            <span className="text-ink">
              &ldquo;I saw [management company] took over [building] in March&rdquo;
            </span>{" "}
            is a fact the reader can confirm in a second.{" "}
            <span className="text-ink">&ldquo;I saw you&rsquo;re having HVAC issues&rdquo;</span> is
            a guess about a building you have not seen, and the reader knows it is a guess. One
            earns a reply. The other is why commercial managers stopped reading contractor email.
          </p>
          <p>
            This is not only a matter of manners. It is the rule our own system enforces before a
            message is allowed out: a first touch may state what a cited source shows and may not
            assert the reader&rsquo;s capacity, their problems or their intent to buy.
          </p>
        </GuideSection>

        <GuideSection id="triggers" title="Triggers that hold up, and what each one actually tells you">
          <GuideTable
            caption="Publicly verifiable commercial prospecting triggers, their sources, and their limits"
            head={["The event", "Where it is public", "What it tells you", "What it does not tell you"]}
            rows={triggers.map((t) => [
              <span key={t.trigger} className="font-semibold text-ink">
                {t.trigger}
              </span>,
              t.source,
              t.tells,
              t.doesNot,
            ])}
          />
          <SourceNote>
            Availability varies by jurisdiction. Property and permit records are published by
            county and city, and what is searchable online in one area may be a counter visit in
            the next. Check the record yourself before you rely on it — the date you checked is
            part of the evidence.
          </SourceNote>
        </GuideSection>

        <GuideSection id="not-triggers" title="What is not a trigger">
          <p>
            These are the five that most often get mistaken for a reason to write. Each one is
            either true of every account in your area, or a guess dressed as an observation:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {notTriggers.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection id="record" title="How to record one so it survives being checked">
          <p>
            A trigger you cannot produce on request is not evidence. One row per account is enough,
            and the date you checked matters as much as the link:
          </p>
          <GuideTable
            caption="How one trigger is recorded, with every field a placeholder"
            head={["Field", "Example"]}
            rows={[
              [
                <span key="a" className="font-semibold text-ink">
                  Account
                </span>,
                "[Management company], [building address]",
              ],
              [
                <span key="e" className="font-semibold text-ink">
                  Event
                </span>,
                "Took over management of the building on [date]",
              ],
              [
                <span key="s" className="font-semibold text-ink">
                  Source
                </span>,
                "[Link to the announcement or record]",
              ],
              [
                <span key="c" className="font-semibold text-ink">
                  Checked
                </span>,
                "[The date you opened the link]",
              ],
              [
                <span key="w" className="font-semibold text-ink">
                  What it supports
                </span>,
                "A reason to introduce yourself now. Not a claim about the equipment.",
              ],
            ]}
          />
          <p>
            Re-open the source before you write. Pages change and people move on, and a reason that
            has stopped being true is worse than no reason at all. If the source no longer supports
            it, the account goes back on the list.
          </p>
        </GuideSection>

        <GuideSection id="use" title="Turning a trigger into a first sentence">
          <p>
            The trigger belongs in the opening line, stated plainly, with the noun named. Not
            &ldquo;I saw the news&rdquo; — which news, about what. The rest of the message is about
            what you can offer, and the ask is a question whose yes is obvious.
          </p>
          <p>
            Which person you send it to depends on the account:{" "}
            <Link href="/hvac-property-manager-outreach" className="text-accent underline underline-offset-4">
              a property manager
            </Link>
            ,{" "}
            <Link href="/hvac-facility-manager-outreach" className="text-accent underline underline-offset-4">
              an in-house facility team
            </Link>{" "}
            and{" "}
            <Link href="/hvac-building-owner-outreach" className="text-accent underline underline-offset-4">
              a building owner
            </Link>{" "}
            read the same event differently. The full method around this step is{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              how to find commercial HVAC accounts
            </Link>
            , and the message itself is{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              writing a commercial HVAC cold email
            </Link>
            . If what you are after is recurring work, the commercial context is{" "}
            <Link href="/commercial-hvac-maintenance-contracts" className="text-accent underline underline-offset-4">
              how maintenance contracts get won
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="have-it-done" title="Or have the research run for you">
          <p>
            {brandName} does this continuously for established commercial HVAC contractors: it
            researches accounts, records the dated reason with its source, and contacts the
            decision-maker in your name.{" "}
            <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
              What the service includes
            </Link>
            . The{" "}
            <Link href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free commercial HVAC pipeline audit
            </Link>{" "}
            shows it applied to your market: 3&ndash;5 commercial accounts, each with the reason and
            the source link, in writing. No call is required to receive it. You can read the exact
            format on{" "}
            <Link href="/sample-deliverables" className="text-accent underline underline-offset-4">
              sample deliverables
            </Link>
            .
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
