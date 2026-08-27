import type { Metadata } from "next";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { siteUrl } from "@/lib/site";

const page = getGuidePage("shared-vs-exclusive-hvac-leads");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

// Visible Q&A — mirrored verbatim into FAQPage JSON-LD below.
const pageFaqs = [
  {
    question: "What is a shared lead?",
    answer:
      "A shared lead is one homeowner request sold to several competing contractors at the same time. On Angi, the company's own help documentation says each homeowner project request is matched with up to five pros. Each contractor who takes the lead is charged for it (in Angi's newer Opportunities flow, once contractor and homeowner both express interest); at most one wins the job.",
  },
  {
    question: "What is an exclusive lead?",
    answer:
      "An exclusive lead is sold to one contractor only. Exclusive leads cost more per lead — for example, 99Calls advertised exclusive New Jersey HVAC leads at $54.99 each when we checked in August 2026 — but you are not racing four other companies to the same homeowner's phone.",
  },
  {
    question: "Why do shared leads cost more than they look?",
    answer:
      "Because the price that matters is cost per booked job, not cost per lead. If five contractors buy the same lead, at most one of them books the job — so a shared lead's real cost is the per-lead price multiplied by every lead you buy and lose. A cheap lead you close 1 time in 8 is more expensive than a pricier lead you close 1 time in 3.",
  },
  {
    question: "What did the FTC's HomeAdvisor case actually involve?",
    answer:
      "In 2023 the FTC finalized an order requiring HomeAdvisor — a company affiliated with Angi that operated Angi Leads — to pay up to $7.2 million to settle allegations that it made false, misleading, or unsubstantiated claims about the quality and source of the leads it sold to service providers, including that leads matched providers' service types and areas when many did not. HomeAdvisor settled by consent order without admitting liability.",
  },
  {
    question: "Is there an option that isn't buying leads at all?",
    answer:
      "Yes — and it's usually the cheapest demand you have: the customers and estimates you already generated. Past customers due for replacement, unclosed estimates, and lapsed maintenance plans are demand you own outright, plus referral relationships with local realtors and property managers. That owned-audience work is what we sell, which is also why we can be neutral about lead sellers: we don't sell leads at all.",
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

export default function SharedVsExclusivePage() {
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
        eyebrow="Contractor's guide"
        h1="Shared vs. exclusive HVAC leads: do the cost-per-job math before you buy"
        intro={
          <>
            <p>
              A shared lead is one homeowner request sold to several contractors at once — on Angi,
              up to five, per Angi&rsquo;s own help documentation. An exclusive lead goes to one
              contractor. Shared leads look cheaper per lead, but the number that decides whether
              you make money is <span className="text-bone">cost per booked job</span>, and sharing
              is exactly what inflates it.
            </p>
            <p>
              One disclosure before the math: <span className="text-bone">we sell neither kind of
              lead</span>. B2B Lead Growth is a flat-fee research and outreach service, so we have
              no per-lead margin riding on which option you pick. That&rsquo;s rare here —
              pages on this question are usually published by companies selling one of the two.
            </p>
          </>
        }
      >
        <GuideSection title="How the two models actually work">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <span className="font-semibold text-bone">Shared (marketplace) leads.</span> Angi&rsquo;s
              help center states each homeowner project request is matched with{" "}
              <em>&ldquo;no more than five pros&rdquo;</em> — and that contractors are charged per
              lead. HomeAdvisor&rsquo;s pro-facing documentation is blunter still: you are charged
              for each lead <em>&ldquo;whether or not you ultimately win the job&rdquo;</em> — and
              even if the homeowner ends up hiring no one at all. (In Angi&rsquo;s
              newer &ldquo;Opportunities&rdquo; flow, the charge applies once you and the homeowner
              both express interest; after that point it applies regardless of outcome.)
            </li>
            <li>
              <span className="font-semibold text-bone">Exclusive leads.</span> Sold to one
              contractor, priced higher. Example with published pricing: 99Calls advertised
              exclusive New Jersey HVAC leads at a $54.99 flat rate per lead from its organic-SEO
              program when we checked in August 2026.
            </li>
            <li>
              <span className="font-semibold text-bone">Pay-per-lead ads (Google Local Services
              Ads).</span> A middle path: Google charges per valid lead (calls or messages, not
              clicks) for home-service categories including HVAC; businesses must pass
              Google&rsquo;s screening and verification, and Google says lead prices vary by
              location, job type, and lead type.
            </li>
          </ul>
          <SourceNote>
            Sources:{" "}
            <a
              href="https://intercom.help/angi/en/articles/6221483-opportunities-and-leads-frequently-asked-questions"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              Angi Help Center
            </a>{" "}
            (updated April 2026) ·{" "}
            <a
              href="https://www.homeadvisor.com/spa/how-it-works"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              HomeAdvisor, How It Works
            </a>{" "}
            ·{" "}
            <a
              href="https://99calls.com/locations/New-Jersey/HVAC-Leads.htm"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              99Calls NJ HVAC pricing
            </a>{" "}
            ·{" "}
            <a
              href="https://support.google.com/localservices/answer/7195435"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              Google, How Local Services leads work
            </a>
            . Prices and policies belong to their owners and change; checked August 7, 2026.
          </SourceNote>
        </GuideSection>

        <GuideSection title="The math: cost per booked job, not cost per lead">
          <p>
            The arithmetic below is illustrative — plug in your own numbers. The structure of it is
            the point: <span className="text-bone">divide what you spend by the jobs you actually
            book</span>. Third-party estimates put typical Angi lead fees at roughly $15–$85, with
            high-value trades over $100 (<a href="https://www.housecallpro.com/resources/what-is-angis-list-how-angi-works/" rel="nofollow noopener" target="_blank" className="text-gold-200 underline underline-offset-4">Housecall Pro&rsquo;s February 2026 guide</a> — Angi itself publishes no dollar figures and says fees vary by task, location, and demand).
          </p>
          <GuideTable
            caption="Illustrative cost-per-booked-job arithmetic for shared vs exclusive leads"
            head={["Scenario (your numbers will differ)", "Arithmetic", "Cost per booked job"]}
            rows={[
              [
                "Shared lead at $60, and with up to five pros competing you close 1 in 8",
                "$60 × 8 leads bought per job won",
                <span key="a" className="font-semibold text-bone">$480</span>,
              ],
              [
                "Same shared lead, closing 1 in 5",
                "$60 × 5",
                <span key="b" className="font-semibold text-bone">$300</span>,
              ],
              [
                "Shared lead at $25 (toward the low end of the cited $15\u2013$85 range), closing 1 in 5",
                "$25 × 5",
                <span key="c" className="font-semibold text-bone">$125</span>,
              ],
              [
                "Exclusive lead at $54.99 (99Calls' published NJ rate), closing 1 in 3",
                "$54.99 × 3",
                <span key="d" className="font-semibold text-bone">~$165</span>,
              ],
              [
                "An unclosed estimate you already paid to generate, revived with follow-up",
                "Your follow-up time",
                <span key="e" className="font-semibold text-bone">Marginal cost ≈ $0 in lead fees</span>,
              ],
            ]}
          />
          <p>
            Notice the third row: cheap shared leads paired with a strong close rate{" "}
            <span className="text-bone">can</span> beat exclusive leads. That is exactly why the
            only number that decides this is your own cost per booked job — not any vendor&rsquo;s
            table, including this one.
          </p>
          <KeyAnswer>
            We are not claiming your close rates — nobody can know them but you. The claim is
            structural: when up to five contractors buy the same homeowner, most buyers of that
            lead lose it by definition, and their lead fees are part of your real cost of winning.
            Exclusive leads and owned-audience follow-up don&rsquo;t carry that built-in loss rate.
          </KeyAnswer>
          <p>
            And one number belongs in this comparison that we can&rsquo;t fill in for you: if you
            pay anyone a flat fee — <span className="text-bone">including us, at $750 to $2,500 a
            month</span> — to run that follow-up, your cost per booked job is the fee divided by
            the jobs it produces. We don&rsquo;t guarantee that beats the per-lead channels; the{" "}
            <a href="/free-pipeline-audit" className="text-gold-200 underline underline-offset-4">
              free audit
            </a>{" "}
            exists so you can judge the work before paying to find out.
          </p>
        </GuideSection>

        <GuideSection title="What the FTC's HomeAdvisor case does — and doesn't — say">
          <p>
            In 2023 the FTC finalized an order requiring HomeAdvisor — a company affiliated with
            Angi that operated Angi Leads — to pay{" "}
            <span className="text-bone">up to $7.2 million</span> to settle charges it used{" "}
            <em>&ldquo;a wide range of deceptive and misleading tactics in selling home improvement
            project leads to service providers.&rdquo;</em> The FTC alleged, among other things,
            that HomeAdvisor represented its leads concerned people ready to hire soon when many
            did not; that providers would receive leads matching their service type and area when
            many did not match; that leads came from consumers who sought HomeAdvisor directly when
            many were bought from third-party affiliates; and that it cited job-conversion rates it
            could not substantiate. HomeAdvisor settled by consent order without admitting
            liability.
          </p>
          <p>
            Worth being precise about: the FTC case was about{" "}
            <span className="text-bone">lead quality and sourcing claims</span> — it did not charge
            HomeAdvisor with selling one lead to multiple contractors. Lead sharing isn&rsquo;t
            hidden; it&rsquo;s the marketplace&rsquo;s published model, per Angi&rsquo;s own help
            center. The lesson for contractors is the same either way: verify what a lead seller
            claims, in writing, before you fund an account.
          </p>
          <SourceNote>
            Sources:{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/01/ftc-order-requires-homeadvisor-pay-72-million-stop-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              FTC press release (Jan 2023)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.ftc.gov/system/files/ftc_gov/pdf/Home%20Advisor%20Part%20III%20Complaint%20Public%20Redacted_0.pdf"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              FTC administrative complaint (public redacted)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/04/ftc-approves-final-order-against-homeadvisor-inc-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-gold-200 underline underline-offset-4"
            >
              FTC final-order announcement (Apr 2023)
            </a>
            . The order was finalized in April 2023; allegations were settled without an admission
            of liability.
          </SourceNote>
        </GuideSection>

        <GuideSection title="The option most contractors skip: demand you already own">
          <p>
            Before buying anyone&rsquo;s leads — shared or exclusive — the cheapest pipeline is
            usually sitting in your own records: past customers with aging systems, estimates that
            never closed, maintenance plans that lapsed, and referral relationships with local
            realtors and property managers. None of it carries a per-lead fee, and none of it is
            being sold to four other shops at the same time. That owned-audience and referral-partner work is the lead generation
            we actually sell to contractors — we never cold-scrape homeowners, and we never sell
            the same prospect twice, because we don&rsquo;t sell prospects at all.
          </p>
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
        </GuideSection>
      </GuideLayout>
    </>
  );
}
