import type { Metadata } from "next";
import GuideLayout, { GuideSection, GuideTable, KeyAnswer, SourceNote } from "@/components/GuideLayout";
import { faqSlug } from "@/lib/content";
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
      "A shared lead is one homeowner request sold to several competing contractors at the same time. Angi's own help documentation says each homeowner project request is matched with up to five pros. Each contractor who takes the lead is charged for it; at most one wins the job. In Angi's newer Opportunities flow, the charge lands once contractor and homeowner both express interest.",
  },
  {
    question: "What is an exclusive lead?",
    answer:
      "An exclusive lead is sold to one contractor only. It costs more per lead: 99Calls advertised exclusive New Jersey HVAC leads at $54.99 each when we checked in August 2026. You are not racing four other companies to the same homeowner's phone.",
  },
  {
    question: "Why do shared leads cost more than they look?",
    answer:
      "Shared leads cost more than they look because the price that matters is cost per booked job, not cost per lead. If five contractors buy the same lead, at most one of them books the job. A shared lead's real cost is the per-lead price multiplied by every lead you buy and lose. A cheap lead you close 1 time in 8 is more expensive than a pricier lead you close 1 time in 3.",
  },
  {
    question: "What did the FTC's HomeAdvisor case actually involve?",
    answer:
      "In 2023 the FTC finalized an order requiring HomeAdvisor to pay up to $7.2 million. HomeAdvisor is a company affiliated with Angi that operated Angi Leads. The order settled allegations that it made false, misleading, or unsubstantiated claims about the quality and source of the leads it sold to service providers, including that leads matched providers' service types and areas when many did not. HomeAdvisor settled by consent order without admitting liability.",
  },
  {
    question: "Is there an option that isn't buying leads at all?",
    answer:
      "Yes — the cheapest demand is the customers and estimates you already generated. Past customers due for replacement, unclosed estimates, and lapsed maintenance plans are demand you own outright, plus referral relationships with local realtors and property managers. That owned-audience work is what we sell, which is also why we can be neutral about lead sellers: we do not sell leads at all.",
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
        // Same fragment the visible answer is stamped with below, so an answer engine can
        // cite one answer rather than the page.
        "@id": `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
        url: `${siteUrl}/${page.slug}#${faqSlug(f.question)}`,
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
        h1="Shared vs. exclusive HVAC leads: the real cost per booked job"
        intro={
          <>
            {/* Answer-first. Both terms defined and the deciding number named in under 40
                words, because this paragraph is what an answer engine lifts out of the page.
                The Angi "up to five" citation stays in the lead — it is the fact the whole
                comparison rests on. */}
            <p className="text-ink">
              A shared HVAC lead goes to several contractors at once — up to five on Angi, per
              Angi&rsquo;s help documentation. An exclusive lead goes to one. The cost that matters
              is cost per booked job, not cost per lead.
            </p>
            <p>
              One disclosure before the math: <span className="text-ink">we sell neither kind of
              lead</span>. B2B Lead Growth charges a flat monthly fee, so no per-lead margin rides
              on which option you pick. Pages on this question are usually published by a company
              selling one of the two.
            </p>
          </>
        }
      >
        <GuideSection title="How the two models work">
          {/* A table, not three bullets: this is an X-vs-Y comparison, and how-it-works /
              what-you-pay are the two axes a buyer and an answer engine both read it on.
              Every quoted phrase below is the source's own wording and must stay verbatim. */}
          <GuideTable
            caption="Shared marketplace leads, exclusive leads and pay-per-lead ads compared, with sources, checked August 2026"
            head={["Model", "How it works", "What you pay"]}
            rows={[
              [
                <span key="shared" className="font-semibold text-ink">
                  Shared (marketplace) leads
                </span>,
                <span key="shared-how">
                  Angi&rsquo;s help center states each homeowner project request is matched with{" "}
                  <em>&ldquo;no more than five pros&rdquo;</em>.
                </span>,
                <span key="shared-pay">
                  Charged per lead. HomeAdvisor&rsquo;s pro-facing documentation is blunter still:
                  you are charged for each lead{" "}
                  <em>&ldquo;whether or not you ultimately win the job&rdquo;</em> — and even if the
                  homeowner ends up hiring no one at all. (In Angi&rsquo;s newer
                  &ldquo;Opportunities&rdquo; flow, the charge applies once you and the homeowner
                  both express interest; after that point it applies regardless of outcome.)
                </span>,
              ],
              [
                <span key="excl" className="font-semibold text-ink">
                  Exclusive leads
                </span>,
                "Sold to one contractor.",
                "Priced higher per lead. Example with published pricing: 99Calls advertised exclusive New Jersey HVAC leads at a $54.99 flat rate per lead from its organic-SEO program when we checked in August 2026.",
              ],
              [
                <span key="lsa" className="font-semibold text-ink">
                  Pay-per-lead ads (Google Local Services Ads)
                </span>,
                <span key="lsa-how">
                  A middle path. Google charges for valid leads (calls or messages, not clicks) in
                  home-service categories including HVAC, and businesses must pass Google&rsquo;s
                  screening and verification.
                </span>,
                "Per valid lead. Google says lead prices vary by location, job type, and lead type.",
              ],
            ]}
          />
          <SourceNote>
            Sources:{" "}
            <a
              href="https://intercom.help/angi/en/articles/6221483-opportunities-and-leads-frequently-asked-questions"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Angi Help Center
            </a>{" "}
            (updated April 2026) ·{" "}
            <a
              href="https://www.homeadvisor.com/spa/how-it-works"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              HomeAdvisor, How It Works
            </a>{" "}
            ·{" "}
            <a
              href="https://99calls.com/locations/New-Jersey/HVAC-Leads.htm"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              99Calls NJ HVAC pricing
            </a>{" "}
            ·{" "}
            <a
              href="https://support.google.com/localservices/answer/7195435"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              Google, How Local Services leads work
            </a>
            . Prices and policies belong to their owners and change; checked August 7, 2026. For
            these same channels priced out for one market, see{" "}
            <a
              href="/hvac-lead-generation-new-jersey"
              className="text-accent underline underline-offset-4"
            >
              what HVAC leads cost in New Jersey, by channel
            </a>
            .
          </SourceNote>
        </GuideSection>

        <GuideSection title="The math: cost per booked job, not cost per lead">
          <p>
            The arithmetic below is illustrative. Plug in your own numbers; the structure is the
            point: <span className="text-ink">divide what you spend by the jobs you actually
            book</span>. Third-party estimates put typical Angi lead fees at $15–$85 per lead
            (<a href="https://www.housecallpro.com/resources/what-is-angis-list-how-angi-works/" rel="nofollow noopener" target="_blank" className="text-accent underline underline-offset-4">Housecall Pro&rsquo;s guide</a> — Angi itself publishes no dollar figures and says fees vary by task, location, and demand).
          </p>
          <GuideTable
            caption="Illustrative cost-per-booked-job arithmetic for shared vs exclusive leads"
            head={["Scenario (your numbers will differ)", "Arithmetic", "Cost per booked job"]}
            rows={[
              [
                "Shared lead at $60, and with up to five pros competing you close 1 in 8",
                "$60 × 8 leads bought per job won",
                <span key="a" className="font-semibold text-ink">$480</span>,
              ],
              [
                "Same shared lead, closing 1 in 5",
                "$60 × 5",
                <span key="b" className="font-semibold text-ink">$300</span>,
              ],
              [
                "Shared lead at $25 (toward the low end of the cited $15\u2013$85 range), closing 1 in 5",
                "$25 × 5",
                <span key="c" className="font-semibold text-ink">$125</span>,
              ],
              [
                "Exclusive lead at $54.99 (99Calls' published NJ rate), closing 1 in 3",
                "$54.99 × 3",
                <span key="d" className="font-semibold text-ink">~$165</span>,
              ],
              [
                "An unclosed estimate you already paid to generate, revived with follow-up",
                "Your follow-up time",
                <span key="e" className="font-semibold text-ink">Marginal cost ≈ $0 in lead fees</span>,
              ],
            ]}
          />
          <p>
            Notice the third row: cheap shared leads paired with a strong close rate{" "}
            <span className="text-ink">can</span> beat exclusive leads. That is exactly why the
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
            One number in this comparison we cannot fill in for you. If you pay anyone a flat fee to
            run that follow-up — <span className="text-ink">including us, at $750 to $2,500 a
            month</span> — your cost per booked job is that fee divided by the jobs it produces. We
            do not guarantee that beats the per-lead channels. The{" "}
            <a href="/free-pipeline-audit" className="text-accent underline underline-offset-4">
              free pipeline audit
            </a>{" "}
            exists so you can judge the work before paying to find out, and{" "}
            <a href="/pricing" className="text-accent underline underline-offset-4">
              our published monthly pricing
            </a>{" "}
            shows what each fee covers.
          </p>
        </GuideSection>

        <GuideSection title="What the FTC's HomeAdvisor case does and does not say">
          <p>
            In 2023 the FTC finalized an order requiring HomeAdvisor — a company affiliated with
            Angi that operated Angi Leads — to pay{" "}
            <span className="text-ink">up to $7.2 million</span> to settle charges it used{" "}
            <em>&ldquo;a wide range of deceptive and misleading tactics in selling home improvement
            project leads to service providers.&rdquo;</em>
          </p>
          <p>The FTC alleged, among other things:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              that HomeAdvisor represented its leads concerned people ready to hire soon when many
              did not;
            </li>
            <li>
              that providers would receive leads matching their service type and area when many did
              not match;
            </li>
            <li>
              that leads came from consumers who sought HomeAdvisor directly when many were bought
              from third-party affiliates;
            </li>
            <li>that it cited job-conversion rates it could not substantiate.</li>
          </ul>
          <p>HomeAdvisor settled by consent order without admitting liability.</p>
          <p>
            Worth being precise about: the FTC case was about{" "}
            <span className="text-ink">lead quality and sourcing claims</span>. It did not charge
            HomeAdvisor with selling one lead to multiple contractors. Lead sharing is not hidden;
            it is the marketplace&rsquo;s published model, per Angi&rsquo;s own help center. The
            lesson is the same either way: verify what a lead seller claims, in writing, before you
            fund an account. The{" "}
            <a
              href="/how-to-choose-a-lead-generation-agency"
              className="text-accent underline underline-offset-4"
            >
              seven questions to ask an HVAC lead generation company
            </a>{" "}
            are the ones that get it in writing.
          </p>
          <SourceNote>
            Sources:{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/01/ftc-order-requires-homeadvisor-pay-72-million-stop-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC press release (Jan 2023)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.ftc.gov/system/files/ftc_gov/pdf/Home%20Advisor%20Part%20III%20Complaint%20Public%20Redacted_0.pdf"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC administrative complaint (public redacted)
            </a>{" "}
            ·{" "}
            <a
              href="https://www.ftc.gov/news-events/news/press-releases/2023/04/ftc-approves-final-order-against-homeadvisor-inc-deceptively-marketing-its-leads-home-improvement"
              rel="nofollow noopener"
              target="_blank"
              className="text-accent underline underline-offset-4"
            >
              FTC final-order announcement (Apr 2023)
            </a>
            . The order was finalized in April 2023; allegations were settled without an admission
            of liability.
          </SourceNote>
        </GuideSection>

        <GuideSection title="The option most contractors skip: the unsold estimates you already own">
          <p>
            Before buying anyone&rsquo;s leads, the cheapest pipeline is usually sitting in your own
            records: past customers with aging systems, estimates that never closed, maintenance
            plans that lapsed, and referral relationships with local realtors and property managers.
            None of it carries a per-lead fee. None of it is being sold to four other shops at the
            same time.
          </p>
          <p>
            That owned-audience and referral-partner work is the lead generation we sell to
            contractors. We never cold-scrape homeowners, and we never sell the same prospect twice,
            because we do not sell prospects at all. What the paid channels cost instead is itemized
            in{" "}
            <a
              href="/hvac-lead-generation-new-jersey"
              className="text-accent underline underline-offset-4"
            >
              our New Jersey HVAC lead cost breakdown
            </a>
            .
          </p>
        </GuideSection>

        <GuideSection title="Common questions">
          {/* id + scroll-mt on every answer, mirroring the fragment each Question node
              publishes as its url — so a specific answer can be cited and deep-linked. */}
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
