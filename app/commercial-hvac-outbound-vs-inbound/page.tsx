import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE DECISION BEFORE THE VENDOR DECISION.
//
// /how-to-choose-a-lead-generation-agency answers "which vendor, and how do I check them".
// This page answers the question that comes first and had no page at all: should a contractor
// be buying outbound, running ads, hiring someone, or doing it himself. A contractor who has
// not made that decision cannot evaluate a vendor, because he does not yet know what he is
// comparing it to.
//
// THE HONESTY CONSTRAINT THAT MAKES THIS PAGE WORTH PUBLISHING. A comparison page written by
// one of the four options is worthless unless it says plainly when the other three win and
// when its own option is the wrong choice. The "when outbound is the wrong answer" section is
// therefore not a disclaimer at the bottom; it is the reason the page can be believed. It also
// happens to be commercially correct: a contractor with no commercial capability who buys
// outbound becomes a refund and a bad reference, which is why our own fit check declines them.
//
// No cost figures are given for the options we do not sell. We do not know what a contractor
// pays for ads or a salary, and inventing a comparison table of made-up numbers is exactly the
// kind of fake research this site does not publish. What is comparable is the SHAPE of each
// cost, and that is what the table carries.

const page = getGuidePage("commercial-hvac-outbound-vs-inbound");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const options = [
  {
    option: "Inbound and search",
    how: "The buyer finds you when they look. Your site, your listings, your reviews.",
    shape: "Slow to build, then cheap per conversation. Effort now, results later, if at all.",
    fits: "Work people search for at the moment they need it — a breakdown, an emergency call.",
    limit:
      "The buyer of a recurring agreement is usually not searching. They already have someone, and nothing has prompted them to look.",
  },
  {
    option: "Paid ads",
    how: "You pay to appear when someone searches a term you have chosen.",
    shape: "Fast to start, and you stop appearing the day you stop paying.",
    fits: "High-intent searches with enough volume to be worth bidding on.",
    limit:
      "Commercial HVAC search volume is thin, clicks are expensive, and you cannot choose which buildings see it. You are renting attention from whoever is searching.",
  },
  {
    option: "In-house prospecting",
    how: "You, or someone you employ, researches accounts and contacts them.",
    shape: "A salary or your own evenings, plus tools. The cost is fixed whether or not it gets done.",
    fits: "An owner who genuinely has the hours, or a company large enough to keep someone busy.",
    limit:
      "It is the first thing dropped in a busy week. Most contractors who say prospecting does not work have actually done it for three weeks, twice.",
  },
  {
    option: "Managed outbound",
    how: "Someone else researches the accounts and contacts the decision-makers in your name.",
    shape: "A monthly fee, running whether or not you are busy. It does not pause for your season.",
    fits: "A contractor who can already quote and win commercial work, and lacks the time to find it.",
    limit:
      "It cannot create commercial capability you do not have, and it cannot close for you. If nobody at your company quotes commercial work, this is the wrong purchase.",
  },
];

const wrongAnswer = [
  "You do not currently do commercial work. Outbound would reach the right buildings and hand you conversations nobody at your company can quote.",
  "Nobody has time to take the call. Conversations expire. A handover that sits for a week is a handover wasted, and that is on the calendar, not the outreach.",
  "You are already at capacity and want to be busier at a better margin. That is a pricing and scheduling decision first; more accounts will not fix it.",
  "You want the phone to ring this week. Reaching a named decision-maker with a real reason takes as long as it takes, and anyone promising a number is guessing.",
  "You want someone to also estimate, scope or close the work. That is the contractor's trade, and any vendor who agrees to it has not stood in a mechanical room.",
];

// Visible Q&A, mirrored verbatim into the FAQPage markup below.
const pageFaqs = [
  {
    question: "Is outbound or inbound better for commercial HVAC?",
    answer:
      "They answer different questions. Inbound reaches people who are already searching, which for commercial HVAC is a small group, mostly with urgent repairs. Outbound reaches accounts you have chosen, whether or not they are looking, which is how recurring agreements are usually won. Most established contractors need both, and only one of them can be pointed at specific buildings.",
  },
  {
    question: "Should I hire someone in-house instead of using an agency?",
    answer:
      "If you can keep them busy and manage them, in-house is a real option and eventually a cheaper one. The honest comparison is not agency fee versus salary — it is against what actually happens, which for most contractors is that prospecting gets started and dropped twice a year. Compare it to your real alternative, not your intended one.",
  },
  {
    question: "Do Google Ads work for commercial HVAC contractors?",
    answer:
      "They can, for searches with real intent behind them, and they stop the day you stop paying. The structural limit for commercial work is that you cannot choose which buildings see the ad. If your goal is a specific list of property managers and multi-site operators in your area, advertising cannot target that and outreach can.",
  },
  {
    question: "When is managed outbound the wrong choice?",
    answer:
      "When your company does not already sell and complete commercial work, when nobody has time to take the conversations, or when you want the vendor to also estimate, scope or close. Our own fit check declines contractors in the first case rather than selling to them, because outbound would deliver conversations nobody there can act on.",
  },
  {
    question: "Can I do this myself instead of paying for it?",
    answer:
      "Yes, and the full method is published on this site for exactly that reason — the research steps, the public sources, and how to write the first email. Nothing in it is secret. What it costs is continuous hours in a week that already has none, which is the actual thing being bought.",
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

export default function CommercialHvacOutboundVsInboundPage() {
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
        eyebrow="Choosing an approach"
        intro={
          <>
            <p className="text-ink">
              A commercial HVAC contractor has four ways to create account conversations: be found
              in search, pay for ads, prospect in-house, or have outreach run for him. They differ
              in who chooses the buildings — and for recurring commercial work, that is the
              decision that matters.
            </p>
            <p>
              We sell one of the four, so this page is written to be useful even if you pick a
              different one. It says what each approach costs in shape rather than in invented
              numbers, what each is genuinely good at, and — in its own section — when outbound is
              the wrong answer and we would tell you so.
            </p>
          </>
        }
      >
        <GuideSection id="difference" title="The one difference that decides it">
          <KeyAnswer>
            Inbound and ads reach whoever is searching. Outbound reaches accounts you have chosen.
            If the work you want comes from a specific list of buildings and operators — property
            managers, multi-site operators, owners — only one of those approaches can be aimed at
            them.
          </KeyAnswer>
          <p>
            That is not a claim that outreach is better. It is a statement about what each method
            can and cannot target. A building with a working chiller and a contractor on file will
            never search for you, so no amount of search visibility reaches it. Equally, someone
            whose rooftop unit failed this morning is searching right now, and no outreach schedule
            will find them at that moment.
          </p>
        </GuideSection>

        <GuideSection id="compare" title="The four approaches, compared honestly">
          <GuideTable
            caption="How commercial HVAC contractors create account conversations, and what each approach can and cannot do"
            head={["Approach", "How it works", "Shape of the cost", "What it is good at", "Where it stops"]}
            rows={options.map((o) => [
              <span key={o.option} className="font-semibold text-ink">
                {o.option}
              </span>,
              o.how,
              o.shape,
              o.fits,
              o.limit,
            ])}
          />
          <p>
            There are no dollar figures in that table on purpose. We do not know what you would pay
            for clicks in your market or what you would pay someone to prospect, and a comparison
            built on numbers we made up would be worth less than no table at all. What is
            comparable without inventing anything is the shape of each cost — whether it is fixed
            or variable, and whether it keeps working when you stop paying.
          </p>
        </GuideSection>

        <GuideSection id="both" title="Most established contractors need more than one">
          <p>
            These are not mutually exclusive, and treating them as a single choice is how
            contractors end up with neither. A practical split for a company that already does
            commercial work:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-ink">Search and listings</span> so that a manager who has your
              name, or an urgent caller, can find and check you. This is table stakes, not a
              pipeline.
            </li>
            <li>
              <span className="text-ink">Outreach</span> for the accounts you actually want, which
              are not searching and will not find you.
            </li>
            <li>
              <span className="text-ink">Ads</span> only where a search term has real intent and
              enough volume to be worth the click price in your area.
            </li>
          </ul>
          <p>
            The question is rarely &ldquo;which one&rdquo;. It is which one is missing, and for
            most contractors who already win commercial bids when they get them, the missing piece
            is a continuous way of starting conversations with buildings they chose.
          </p>
        </GuideSection>

        <GuideSection id="wrong" title="When outbound is the wrong answer">
          <KeyAnswer>
            Managed outbound cannot create commercial capability you do not have, and it cannot
            close work for you. If any of the five below is true, it is the wrong purchase, and a
            vendor who sells it to you anyway is selling you a refund.
          </KeyAnswer>
          <ul className="list-disc space-y-2 pl-5">
            {wrongAnswer.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p>
            The first of those is the one we act on most. Our{" "}
            <Link href="/start" className="text-accent underline underline-offset-4">
              fit check
            </Link>{" "}
            declines companies that do not already sell and complete commercial work rather than
            taking the money, because outreach would deliver conversations nobody at the company
            could quote. A straight &ldquo;no&rdquo; is one of the possible answers, and it is free.
          </p>
        </GuideSection>

        <GuideSection id="evaluate" title="If you decide to buy it, how to check the vendor">
          <p>
            Deciding on outreach is the first decision; choosing who runs it is a separate one, and
            it is where most of the money is lost.{" "}
            <Link href="/how-to-choose-a-lead-generation-agency" className="text-accent underline underline-offset-4">
              How to choose a commercial HVAC lead generation partner
            </Link>{" "}
            is the ten questions to ask and the eight red flags, written to be used on us as well
            as on anyone else.
          </p>
          <p>
            Two things worth settling before you sign anything: what exactly gets handed to you,
            and what the words in the contract mean.{" "}
            <Link href="/sample-deliverables" className="text-accent underline underline-offset-4">
              Sample deliverables
            </Link>{" "}
            shows the real format of what a client receives, and{" "}
            <Link href="/definitions" className="text-accent underline underline-offset-4">
              definitions
            </Link>{" "}
            states what every term means — including which ones we refuse to use, and why a
            &ldquo;lead&rdquo; is not the same thing as a qualified conversation.
          </p>
        </GuideSection>

        <GuideSection id="do-it-yourself" title="Or run it yourself — the method is published">
          <p>
            If in-house is your answer, nothing here is withheld.{" "}
            <Link href="/how-to-find-commercial-hvac-accounts" className="text-accent underline underline-offset-4">
              How to find commercial HVAC accounts
            </Link>{" "}
            is the research method,{" "}
            <Link href="/commercial-hvac-prospecting-triggers" className="text-accent underline underline-offset-4">
              prospecting triggers
            </Link>{" "}
            is what makes an account worth contacting this week,{" "}
            <Link href="/commercial-hvac-cold-email" className="text-accent underline underline-offset-4">
              commercial HVAC cold email
            </Link>{" "}
            is the message, and{" "}
            <Link href="/commercial-hvac-maintenance-contracts" className="text-accent underline underline-offset-4">
              maintenance contracts
            </Link>{" "}
            is how the recurring work is won. The buyers are covered one page each:{" "}
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
          <p>
            If you would rather it ran without you, that is what {brandName} is:{" "}
            <Link href="/commercial-hvac-lead-generation" className="text-accent underline underline-offset-4">
              what the service includes
            </Link>{" "}
            and{" "}
            <Link href="/pricing" className="text-accent underline underline-offset-4">
              what it costs
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
