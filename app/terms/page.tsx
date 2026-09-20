import type { Metadata } from "next";
import { getLegalRoute, pageMetadata, standalonePageJsonLd } from "@/lib/pages";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  brandName,
  legalEntityName,
  founderName,
  businessMailingAddress,
  contactEmail,
  governingLawState,
  entityFormationState,
  legalLastUpdated,
  cancellationNoticeDays,
} from "@/lib/site";
import { boundarySentence, callingPolicy, contractorBoundary, plans } from "@/lib/content";

// WHAT CHANGED ON 2026-09-18 (D-028): the same service-description passages now name the TWO
// plans (Managed Outbound, Opportunity Engine), the warm handoff each ends in, and who takes the
// conversation from there; the $750 plan is retired. §4's list of things we never guarantee now
// names qualified conversations and accepted sales opportunities. The not-changed list below
// still holds.
//
// WHAT CHANGED ON 2026-09-17, AND WHAT DID NOT (D-027).
//
// CHANGED — the passages that DESCRIBE THE SERVICE: the short version, §2's one-line
// description, §3 (what we sell, what we do not, delivery, who we serve), the activity lists
// inside §4 and §8, and §11. They now name the three plans, say what each one makes us
// responsible for (rendered from lib/content.ts `plans`, so the Terms cannot drift from the
// pricing page), state the calling policy as it actually is, and describe a service
// delivered across the United States rather than in one state.
//
// NOT CHANGED — every clause whose wording carries legal weight of its own: fees and billing
// (§6), cancellation (§7), the refund rule itself (§8's operative sentences), termination
// (§9), ownership and deletion (§10), disclaimers and the limitation of liability (§16),
// governing law and dispute resolution (§18), and the liability sentence in §5. If one of
// those needs to move to match D-027, that is a decision for counsel, not a copy edit.

const terms = getLegalRoute("terms");

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: terms.metaTitle,
  description: terms.description,
});

// WebPage + BreadcrumbList, built from the same registry entry as the metadata above. A legal
// page a crawler cannot type is a page it cannot place in the site; both of these are linked
// from every page's footer and both are in the sitemap.
const pageJsonLd = standalonePageJsonLd({
  slug: "terms",
  navLabel: terms.navLabel,
  metaTitle: terms.metaTitle,
  description: terms.description,
  dateModified: terms.dateModified,
});

const priceList = plans.map((p) => `$${p.price.toLocaleString()}`).join(", ");
const planNames = plans.map((p) => p.name).join(" and ");

export default function TermsPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main" className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Legal
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-subtle">Last updated: {legalLastUpdated}</p>

        <p className="mt-8 leading-7 text-subtle">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this website, your request
          for our free pipeline audit, and our paid monthly services. They are an agreement between
          you and {legalEntityName} (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using this site, submitting the request form,
          or paying for a service, you agree to these Terms. If you do not agree, please do not use
          the site or the services.
        </p>

        {/* Skimmable summary. A prospective client, and any payment provider reviewing us,
            should be able to find fees, cancellation, and refunds without reading 18 sections. */}
        <div className="mt-8 rounded-lg border border-line bg-surface p-5 text-sm leading-6 text-subtle sm:p-6">
          <p className="font-semibold text-accent">The short version</p>
          <ul className="mt-3 space-y-2">
            <BulletItem>
              We sell a monthly commercial HVAC managed outbound service as two plans —{" "}
              {planNames} — at {priceList} per month. No setup fee, and no per-lead,
              per-opportunity or performance fee.
            </BulletItem>
            <BulletItem>
              On both plans, your team does the technical evaluation, the estimate, the proposal,
              the price and the close.
            </BulletItem>
            <BulletItem>
              The free pipeline audit is genuinely free — no card, no obligation, nothing to cancel.
            </BulletItem>
            <BulletItem>
              Month-to-month. Either side can cancel on {cancellationNoticeDays} days&rsquo; written
              notice. No early-termination fee.
            </BulletItem>
            <BulletItem>
              Fees are billed in advance and are earned as that month&rsquo;s work is performed, so
              the current month is non-refundable — see section 8 for the full policy and the one
              make-good we do offer.
            </BulletItem>
            <BulletItem>
              We never guarantee leads, replies, meetings, site visits, qualified conversations,
              accepted sales opportunities, contracts, or revenue, and no fee is refundable on the
              basis that a result did not occur.
            </BulletItem>
            <BulletItem>
              If you leave, you keep the work we produced for you in the periods you paid for.
            </BulletItem>
            <BulletItem>
              Disputes on a paid engagement go to individual arbitration rather than court, with no
              class actions — small claims and injunctions excepted, and we pay the arbitration fees
              on claims of $10,000 or less. Section 18 has the detail.
            </BulletItem>
          </ul>
          <p className="mt-4 text-subtle">
            This summary is for convenience only; the numbered sections below control.
          </p>
        </div>

        <Section title="1. Who we are">
          <p className="leading-7 text-subtle">
            {brandName} is the trading name of {legalEntityName}, a limited liability company
            formed in {entityFormationState}, United States. {legalEntityName} is the contracting
            party under these Terms and on every invoice and services agreement. {founderName} is
            the founder and operational lead — the person who does the work and who you deal with
            directly — and any signed services agreement names the contracting party and its
            authorised signatory, who may be a different person. You can reach us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            {businessMailingAddress ? <> or by mail at {businessMailingAddress}</> : null}.
          </p>
        </Section>

        <Section title="2. What this site is">
          <p className="leading-7 text-subtle">
            This site is informational. It describes our commercial HVAC managed outbound service
            and lets you request a free pipeline audit and an optional walkthrough call. Nothing on
            this site is an offer capable of acceptance, a contract, or a promise of any specific
            outcome. A paid engagement begins only when a separate written services agreement and
            order form are signed by both parties; if that signed agreement conflicts with these
            Terms, the signed agreement controls —{" "}
            <strong className="text-ink/90">
              except on fees, cancellation, and refunds (sections 6 to 8), where whichever document
              is more favourable to you applies.
            </strong>{" "}
            We publish those terms here before you talk to us, and we are not going to advertise one
            deal and hand you a narrower one to sign.
          </p>
        </Section>

        <Section title="3. What we sell">
          <p className="leading-7 text-subtle">
            We sell a monthly service, not software, a data licence, or a list of leads. It is a
            commercial HVAC managed outbound service, sold as two plans. The plan that applies to
            you is the one named in your signed order form, and Managed Outbound never includes the
            Opportunity Engine&rsquo;s work:
          </p>
          <ul className="mt-4 space-y-3 leading-7 text-subtle">
            {plans.map((p) => (
              <BulletItem key={p.name}>
                <strong className="text-ink/90">
                  {p.name} (${p.price.toLocaleString()} per month).
                </strong>{" "}
                {p.oneLiner} We are responsible for: {p.owns.join(", ")}. The handoff point is{" "}
                {p.handoffPoint}. {p.youKeep}
              </BulletItem>
            ))}
          </ul>
          <p className="mt-4 leading-7 text-subtle">
            On every plan the accounts we research are businesses — for an HVAC contractor,
            commercial accounts such as property and facility managers, building owners and
            multi-site operators — found from public sources, each with a cited reason for contact,
            and the outreach is sent from a sending identity you own and approve. Where your order
            form says so, we also work contact lists you supply and are entitled to use — for
            example, your own past commercial accounts; that is optional and is never a
            precondition. Each plan&rsquo;s exact inclusions, capacity
            limit, and exclusions are published on our{" "}
            <Link href="/pricing" className="text-accent underline-offset-4 hover:underline">
              pricing page
            </Link>
            , and the standard an opportunity must meet before we hand it over as an accepted sales
            opportunity is published on our{" "}
            <Link
              href="/how-it-works#qualification-standard"
              className="text-accent underline-offset-4 hover:underline"
            >
              how-it-works page
            </Link>
            .
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">What we do not do, on any plan.</strong>{" "}
            {boundarySentence} We do not: {contractorBoundary.join("; ")}. We also do not sell or
            resell leads, shared or exclusive; we do not run paid advertising; we do not attend or
            run your sales calls or close your deals; and we do not fix your offer, pricing, or
            fulfilment.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Calls.</strong> {callingPolicy.join(" ")}
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Delivery.</strong> The work is delivered continuously
            across each monthly period rather than as a single file on a fixed date, up to that
            plan&rsquo;s published capacity limit. Written reporting is delivered monthly on
            Managed Outbound and weekly on the Opportunity Engine. The free
            pipeline audit is delivered by email, normally within a few business days of your
            request. Delivery depends on you providing the inputs the plan needs: an agreed account
            profile, a sending mailbox you control, and your sign-off on the account categories,
            service area, exclusions, permitted claims and sending identity.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Who we serve.</strong> We offer these services to
            businesses in the United States: established HVAC contractors that already sell and
            complete commercial work. The work is delivered remotely. The people we contact on a
            client&rsquo;s behalf are businesses; we do not contact consumers on anyone&rsquo;s
            behalf. This is a business-to-business service; it is not offered to consumers.
          </p>
        </Section>

        <Section title="4. No guarantee of results">
          <p className="leading-7 text-subtle">
            We provide a service — research, targeting, outreach, follow-up, interest screening,
            the warm handoff and reporting, and, where your plan includes them, need validation,
            acceptance against your agreed criteria, and next-step or site-visit coordination —
            performed with professional, commercially reasonable effort.{" "}
            <strong className="text-ink/90">
              We do not guarantee, and you should not rely on any promise of, any revenue, jobs,
              customers, contracts, sales, close rate, return on investment, or number of leads,
              replies, appointments, site visits, qualified conversations, or accepted sales
              opportunities.
            </strong>{" "}
            Lead generation improves prospect quality and pipeline inputs; sales outcomes depend on
            your offer, market demand, outreach execution, follow-up discipline, and closing
            ability. Outcomes also depend on third-party systems we do not control (such as email
            deliverability). What we commit to is the defined activity and the standard it is
            performed to — never the result.
          </p>
        </Section>

        <Section title="5. The free pipeline audit">
          <p className="leading-7 text-subtle">
            The free pipeline audit is provided at no charge. There is no card required, no
            obligation, and nothing to cancel or refund. You may keep and use the deliverables
            whether or not you ever become a client. We may decline a request — for example where we
            already work with a direct competitor in your service area, where the request is
            outside the markets we serve, or where we cannot research the market to our own
            standard. Because it is free, the audit is provided &ldquo;as is&rdquo; and the
            disclaimers in section 16 apply to it in full. Since you pay nothing for the audit, our
            total liability in connection with it is limited to $100 rather than to fees paid.
          </p>
        </Section>

        <Section id="billing" title="6. Fees and billing">
          <ul className="space-y-2 leading-7 text-subtle">
            <BulletItem>
              <strong className="text-ink/90">Flat monthly fee.</strong> Our published tiers are{" "}
              {priceList} per month. The tier and fee that apply to you are set out in your signed
              order form. There is no setup fee and no required tool add-on.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">Billed in advance.</strong> Each monthly fee is
              payable in advance of the period it covers, on the billing date stated in your order
              form. Fees are stated in US dollars and are exclusive of any applicable taxes.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">Recurring until cancelled.</strong> The engagement is
              month-to-month and renews each month until either party cancels under section 7. There
              is no minimum term and no automatic price increase; we will give at least 30 days&rsquo;
              written notice before any change to your fee, and you may cancel under section 7 if
              you do not accept it.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">Non-payment.</strong> If a payment fails or is not
              made when due, we may pause the work and, if it remains unpaid, terminate under
              section 9. Paused work is not made up retrospectively.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">How payment is taken.</strong> There is no checkout on
              this website and we never take payment details through it. Once a services agreement
              and order form are signed, we invoice you and you pay through the method named in that
              order form. Nothing on this site charges you anything, and requesting the free audit
              never creates a payment obligation.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">Disputes.</strong> If you believe you have been
              charged in error, email{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              within 30 days of the charge and we will investigate and respond. Please contact us
              before raising a chargeback so we have the chance to resolve it directly.
            </BulletItem>
          </ul>
        </Section>

        <Section title="7. Cancellation">
          <p className="leading-7 text-subtle">
            Either party may cancel the engagement for any reason on{" "}
            <strong className="text-ink/90">
              {cancellationNoticeDays} days&rsquo; written notice
            </strong>{" "}
            by email to the address in section 18. There is no early-termination fee and no penalty.
            On cancellation:
          </p>
          <ul className="mt-4 space-y-2 leading-7 text-subtle">
            <BulletItem>
              The engagement continues to the end of the current paid period, and that period is not
              prorated. If fewer than {cancellationNoticeDays} days remain in it when you give
              notice, we work out the rest of the notice window at no additional charge — cancelling
              late never triggers another billed month.
            </BulletItem>
            <BulletItem>No further periods are billed after the current one ends.</BulletItem>
            <BulletItem>
              In-flight outreach stops, and we hand over the current suppression and opt-out list so
              that you can continue to honour it. We will not contact those people again; once the
              list is in your hands, respecting it is your responsibility.
            </BulletItem>
          </ul>
        </Section>

        <Section title="8. Refunds">
          <p className="leading-7 text-subtle">
            Fees are billed in advance and are earned as that period&rsquo;s work is performed —
            the research, writing, sending and reporting, and the follow-up, screening,
            qualification and coordination your plan includes. Once a
            paid period has begun,{" "}
            <strong className="text-ink/90">that period&rsquo;s fee is non-refundable</strong>, and
            we do not prorate a period you cancel partway through. Because no result is ever
            promised (section 4),{" "}
            <strong className="text-ink/90">
              no fee is refundable on the basis that a result did not occur
            </strong>{" "}
            — including a shortfall in replies, meetings, jobs, or revenue.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Two things we will do.</strong> First, if we have not
            begun work on a period, we will refund that period in full on request. Second, if a
            prospect we delivered fails our own cited-source verification standard — that is, it
            should never have passed our quality check — we will replace that prospect at no charge
            within the same period. Replacement is the sole remedy for a failed quality check; it is
            not a cash refund.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            The free pipeline audit involves no payment, so nothing is refundable in connection with
            it.
          </p>
        </Section>

        <Section title="9. Termination">
          <ul className="space-y-2 leading-7 text-subtle">
            <BulletItem>
              <strong className="text-ink/90">For convenience.</strong> Either party may terminate
              under the cancellation terms in section 7.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">For breach.</strong> Either party may terminate if
              the other materially breaches these Terms or the signed agreement and does not cure
              the breach within 10 days of written notice.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">Immediately, by us, without refund.</strong> We may
              suspend or terminate immediately, and no refund is due, if you do not pay when due; if
              you direct us to send messaging that is fabricated, deceptive, or non-compliant; if
              you direct outreach to contacts who have opted out or are on a suppression or
              do-not-contact list; if you supply contact data you are not lawfully entitled to use;
              or if you require us to make claims we cannot substantiate. These limits are not
              negotiable — they are the reason our work can be trusted by the people who receive it.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">By us, for fit.</strong> We may decline or end an
              engagement where a conflict of interest arises, or where we conclude we cannot deliver
              to our standard. In that case we will refund any period we have not begun work on.
            </BulletItem>
          </ul>
        </Section>

        <Section id="ownership" title="10. Who owns what, and what happens when an engagement ends">
          <p className="leading-7 text-subtle">
            Within 5 business days of the engagement ending we will deliver the client-specific work
            product for the periods you paid for — the prospect research and lists, the outreach
            scripts and drafted messages, and your campaign and tracking records — plus the current
            suppression and opt-out list. Those deliverables are yours to keep and use; ending the
            engagement does not claw them back.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Ownership.</strong> On payment for a period, the
            client-specific work product produced in that period is yours: you own it outright and
            may use, keep, modify, and re-use it without restriction or further payment from you. We
            retain our own underlying methods, templates, scoring logic, and tooling, which are
            licensed to nobody and not transferred.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            <strong className="text-ink/90">Deletion, and the one thing we keep.</strong> Within 30
            days of the engagement ending we delete or de-identify your data in our active systems,
            subject to any legal or record-keeping obligation. There is one deliberate exception: we
            permanently retain the suppression and opt-out list — the record of people who asked not
            to be emailed. Deleting it would destroy the only mechanism that guarantees those people
            are never contacted again, so it is kept as a minimal do-not-contact record and used for
            no other purpose. Your data is never used for another client.
          </p>
        </Section>

        <Section title="11. What each side is responsible for">
          <ul className="space-y-2 leading-7 text-subtle">
            <BulletItem>
              <strong className="text-ink/90">We are responsible for</strong> research quality and
              sourcing, targeting logic, contact selection, message drafting, first-touch outreach
              sent in your name, reading replies, the follow-up sequence, interest screening,
              conversation and pipeline organisation, the warm handoff, data organisation, and
              written reporting — and, on the Opportunity Engine, need validation, context
              gathering, acceptance against the criteria you agreed with us, next-step or
              site-visit coordination, and the opportunity brief.
            </BulletItem>
            <BulletItem>
              <strong className="text-ink/90">You are responsible for</strong> your offer and
              pricing, the accuracy of information and any contact data you give us, your legal
              right to contact the people on lists you provide, the sending mailbox or identity used
              for outreach, responding to the opportunities we hand over, the technical evaluation,
              the estimate, the proposal, the price, the live sales conversations, and closing. On
              Managed Outbound you take over each conversation at the warm handoff, once the
              prospect has agreed to speak with your team; on the Opportunity Engine you take over
              each accepted sales opportunity at its coordinated next step.
            </BulletItem>
          </ul>
        </Section>

        <Section title="12. Using this site">
          <ul className="space-y-2 leading-7 text-subtle">
            <BulletItem>Use the site only for lawful, personal or business purposes.</BulletItem>
            <BulletItem>
              Do not attempt to disrupt the site, bypass security, scrape it at scale, or submit
              false, automated, or malicious form data.
            </BulletItem>
            <BulletItem>
              Provide accurate information in the request form, and only information you are
              authorized to share.
            </BulletItem>
          </ul>
        </Section>

        <Section title="13. The request form and your data">
          <p className="leading-7 text-subtle">
            When you submit the form, you consent to be contacted about your enquiry. How we handle
            the information you provide is described in our{" "}
            <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            . You can opt out of contact at any time.
          </p>
        </Section>

        <Section title="14. Intellectual property">
          <p className="leading-7 text-subtle">
            The content, design, text, and graphics on this site are owned by {legalEntityName} or
            its licensors and are protected by applicable law. You may view and share the site, but
            you may not copy, republish, or use its content for commercial purposes without our
            written permission. Ownership of work produced for a paying client is dealt with in
            section 10.
          </p>
        </Section>

        <Section title="15. Third-party links and tools">
          <p className="leading-7 text-subtle">
            This site links to and uses third-party tools — including a scheduling provider for
            booking calls, and third-party sources we cite on our guide pages. We are not
            responsible for the content, policies, pricing, or availability of third-party services,
            and your use of them is subject to their own terms. Third-party figures we cite are
            accurate to the date shown beside them and change without notice.
          </p>
        </Section>

        <Section title="16. Disclaimers and limitation of liability">
          <p className="leading-7 text-subtle">
            The site and its content are provided{" "}
            <strong className="text-ink/90">
              &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
            </strong>{" "}
            without warranties of any kind, whether express or implied, including the implied
            warranties of merchantability, fitness for a particular purpose, and non-infringement.
            We do not warrant that the site will be uninterrupted, error-free, or secure.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            To the fullest extent permitted by law, {legalEntityName} will not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or for any lost
            profits, revenue, business, or data, arising out of or related to this site, the free
            audit, or the services. To the fullest extent permitted by law, our total liability
            arising out of or related to a paid engagement is limited to the fees you paid us in the
            three months before the event giving rise to the claim; where a signed services
            agreement states a different cap, that agreement controls. For any claim that does not
            arise from a paid engagement — including the free pipeline audit and general use of this
            site — our total liability is limited to one hundred US dollars. Nothing in these Terms limits
            liability that cannot be limited by law.
          </p>
        </Section>

        <Section title="17. Changes to these Terms">
          <p className="leading-7 text-subtle">
            We may update these Terms from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date above. Your continued use of the site after changes take
            effect means you accept the updated Terms. For an active paid engagement, changes to
            these Terms do not apply to the current paid period, and we will give notice of a
            material change before it takes effect.
          </p>
        </Section>

        {/* DISPUTE RESOLUTION IS PUBLISHED HERE ON PURPOSE.
          *
          * Until 2026-09-05 this section said New Jersey courts had "exclusive
          * jurisdiction" and the word arbitration appeared nowhere on the page — while
          * §14.6 of the services agreement a client actually signs provides for binding
          * individual AAA arbitration with a class-action waiver. Section 2 of these Terms
          * says the signed agreement controls on conflict EXCEPT on fees, cancellation and
          * refunds, and dispute resolution is outside that carve-out, so the published
          * document was quietly the weaker one — on a page that promises in the next
          * breath that we will not "advertise one deal and hand you a narrower one to
          * sign". That is the single contradiction most likely to be found at the
          * signature block, by the buyer least willing to forgive it.
          *
          * Publishing it costs nothing and buys something, because the real clause is
          * unusually buyer-friendly: we pay the AAA fees under $10,000, small claims stays
          * open, and injunctions stay in court. Keep this in lockstep with CSA §14.5-14.6. */}
        <Section title="18. Governing law, disputes, and contact">
          <p className="leading-7 text-subtle">
            These Terms are governed by the laws of the State of {governingLawState}, without regard
            to its conflict-of-laws rules. For anything arising from this website or the free
            pipeline audit, the state and federal courts located in {governingLawState} have
            jurisdiction.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            For a <strong className="font-semibold text-ink/90">paid engagement</strong>, the signed
            services agreement sets the process, and we would rather you read it here than find it
            above a signature line: first a good-faith attempt to resolve things for 30 days, then
            binding arbitration before the American Arbitration Association, seated in{" "}
            {governingLawState}, before a single arbitrator — on an individual basis only, with no
            class, collective, or representative actions. Two carve-outs stay open to you: either of
            us may bring a qualifying individual claim in small-claims court instead, and either of
            us may go to court for an injunction to protect confidential information or intellectual
            property. For any claim of $10,000 or less we pay the AAA filing fees, the
            administrative fees and the arbitrator&rsquo;s compensation, so arbitration cannot cost
            you more than small claims would have — which covers the claim sizes an engagement at
            these prices realistically produces.
          </p>
          <p className="mt-4 leading-7 text-subtle">
            Questions about these Terms, billing, or cancellation? Reach us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            {businessMailingAddress ? <> or by mail at {businessMailingAddress}</> : null}. We aim to
            reply to billing and cancellation requests within two business days.
          </p>
        </Section>
      </main>
    </PageShell>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </li>
  );
}
