import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pages";
import Link from "next/link";
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
import { plans } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: "Terms of Service",
  description:
    "The terms that govern the B2B Lead Growth website, the free pipeline audit, and our paid monthly services — including fees, billing, cancellation, refunds, and termination.",
});

const priceList = plans.map((p) => `$${p.price.toLocaleString()}`).join(", ");

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-bone">
      {/* Top bar */}
      <header className="border-b border-gold-500/14">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-display text-lg text-gold-200">
            {brandName}
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-gold-200"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
          Legal
        </p>
        <h1 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: {legalLastUpdated}</p>

        <p className="mt-8 leading-7 text-muted">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this website, your request
          for our free pipeline audit, and our paid monthly services. They are an agreement between
          you and {legalEntityName} (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using this site, submitting the request form,
          or paying for a service, you agree to these Terms. If you do not agree, please do not use
          the site or the services.
        </p>

        {/* Skimmable summary. A prospective client, and any payment provider reviewing us,
            should be able to find fees, cancellation, and refunds without reading 18 sections. */}
        <div className="mt-8 rounded-lg border border-gold-500/20 bg-ink-900/70 p-5 text-sm leading-6 text-muted sm:p-6">
          <p className="font-semibold text-gold-200">The short version</p>
          <ul className="mt-3 space-y-2">
            <BulletItem>
              We sell monthly B2B lead research and outreach services at {priceList} per month. No
              setup fee.
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
              We never guarantee leads, replies, meetings, or revenue, and no fee is refundable on
              the basis that a result did not occur.
            </BulletItem>
            <BulletItem>
              If you leave, you keep the work we produced for you in the periods you paid for.
            </BulletItem>
          </ul>
          <p className="mt-4 text-muted/80">
            This summary is for convenience only; the numbered sections below control.
          </p>
        </div>

        <Section title="1. Who we are">
          <p className="leading-7 text-muted">
            {brandName} is the trading name of {legalEntityName}, a limited liability company
            formed in {entityFormationState}, United States. {legalEntityName} is the contracting
            party under these Terms and on every invoice and services agreement. {founderName} is
            the founder and operational lead — the person who does the work and who you deal with
            directly — and any signed services agreement names the contracting party and its
            authorised signatory, who may be a different person. You can reach us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-gold-200 underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            {businessMailingAddress ? <> or by mail at {businessMailingAddress}</> : null}.
          </p>
        </Section>

        <Section title="2. What this site is">
          <p className="leading-7 text-muted">
            This site is informational. It describes our B2B lead-generation and outreach services
            and lets you request a free pipeline audit and an optional walkthrough call. Nothing on
            this site is an offer capable of acceptance, a contract, or a promise of any specific
            outcome. A paid engagement begins only when a separate written services agreement and
            order form are signed by both parties; if that signed agreement conflicts with these
            Terms, the signed agreement controls —{" "}
            <strong className="text-bone/90">
              except on fees, cancellation, and refunds (sections 6 to 8), where whichever document
              is more favourable to you applies.
            </strong>{" "}
            We publish those terms here before you talk to us, and we are not going to advertise one
            deal and hand you a narrower one to sign.
          </p>
        </Section>

        <Section title="3. What we sell">
          <p className="leading-7 text-muted">
            We sell a monthly service, not software, a data licence, or a list of leads. Depending on
            the tier you choose, that service consists of some or all of: defining your ideal
            customer profile; researching and individually vetting prospect companies and buyer
            contacts from public sources, each with a cited reason for contact; where you ask us to, working
            contact lists you supply and are entitled to use — for a home-service contractor that
            usually means past customers, unclosed estimates, and lapsed maintenance plans; scoring and
            prioritising them; writing personalised outreach and follow-up messages; running that
            outreach from a sending identity you own and approve; triaging replies; qualifying
            interested replies against your criteria; booking qualified calls onto your calendar;
            and reporting what was actually done. Each tier&rsquo;s exact inclusions, monthly volume
            cap, and exclusions are published on our{" "}
            <Link href="/pricing" className="text-gold-200 underline-offset-4 hover:underline">
              pricing page
            </Link>
            .
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">What we do not sell:</strong> we do not sell or resell
            leads, shared or exclusive; we do not run paid advertising; we do not make calls on your
            behalf; we do not attend or run your sales calls or close your deals; and we do not fix
            your offer, pricing, or fulfilment. Those are outside scope at every tier.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Delivery.</strong> The work is delivered continuously
            across each monthly period rather than as a single file on a fixed date: prospect
            research and messaging are delivered in batches during the month, up to that
            tier&rsquo;s published volume cap. Written reporting is delivered on the tiers that
            include it — monthly on Outreach Engine, weekly on Appointment Engine; Lead Engine is
            delivered as a batch plus a handoff walkthrough rather than an ongoing report, because
            you run the outreach and hold the response data. The free pipeline audit is delivered
            by email, normally within a few
            business days of your request. Delivery depends on you providing the inputs the tier
            needs: at minimum an agreed ideal customer profile, and on the outreach tiers a sending
            mailbox you control and your approval on messaging.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Who we serve.</strong> We offer these services to
            businesses in the United States, with our active focus on established New Jersey
            residential HVAC companies. This is a business-to-business service; it is not offered
            to consumers.
          </p>
        </Section>

        <Section title="4. No guarantee of results">
          <p className="leading-7 text-muted">
            We provide a service — research, targeting, outreach preparation and sending, follow-up,
            qualification, booking, and reporting — performed with professional, commercially
            reasonable effort.{" "}
            <strong className="text-bone/90">
              We do not guarantee, and you should not rely on any promise of, any revenue, jobs,
              customers, sales, close rate, return on investment, or number of leads, replies, or
              appointments.
            </strong>{" "}
            Lead generation improves prospect quality and pipeline inputs; sales outcomes depend on
            your offer, market demand, outreach execution, follow-up discipline, and closing
            ability. Outcomes also depend on third-party systems we do not control (such as email
            deliverability). What we commit to is the defined activity and the standard it is
            performed to — never the result.
          </p>
        </Section>

        <Section title="5. The free pipeline audit">
          <p className="leading-7 text-muted">
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
          <ul className="space-y-2 leading-7 text-muted">
            <BulletItem>
              <strong className="text-bone/90">Flat monthly fee.</strong> Our published tiers are{" "}
              {priceList} per month. The tier and fee that apply to you are set out in your signed
              order form. There is no setup fee and no required tool add-on.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">Billed in advance.</strong> Each monthly fee is
              payable in advance of the period it covers, on the billing date stated in your order
              form. Fees are stated in US dollars and are exclusive of any applicable taxes.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">Recurring until cancelled.</strong> The engagement is
              month-to-month and renews each month until either party cancels under section 7. There
              is no minimum term and no automatic price increase; we will give at least 30 days&rsquo;
              written notice before any change to your fee, and you may cancel under section 7 if
              you do not accept it.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">Non-payment.</strong> If a payment fails or is not
              made when due, we may pause the work and, if it remains unpaid, terminate under
              section 9. Paused work is not made up retrospectively.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">How payment is taken.</strong> There is no checkout on
              this website and we never take payment details through it. Once a services agreement
              and order form are signed, we invoice you and you pay through the method named in that
              order form. Nothing on this site charges you anything, and requesting the free audit
              never creates a payment obligation.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">Disputes.</strong> If you believe you have been
              charged in error, email{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-gold-200 underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              within 30 days of the charge and we will investigate and respond. Please contact us
              before raising a chargeback so we have the chance to resolve it directly.
            </BulletItem>
          </ul>
        </Section>

        <Section title="7. Cancellation">
          <p className="leading-7 text-muted">
            Either party may cancel the engagement for any reason on{" "}
            <strong className="text-bone/90">
              {cancellationNoticeDays} days&rsquo; written notice
            </strong>{" "}
            by email to the address in section 18. There is no early-termination fee and no penalty.
            On cancellation:
          </p>
          <ul className="mt-4 space-y-2 leading-7 text-muted">
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
          <p className="leading-7 text-muted">
            Fees are billed in advance and are earned as that period&rsquo;s work is performed —
            sourcing, research, drafting, sending, follow-up, qualification, and reporting. Once a
            paid period has begun,{" "}
            <strong className="text-bone/90">that period&rsquo;s fee is non-refundable</strong>, and
            we do not prorate a period you cancel partway through. Because no result is ever
            promised (section 4),{" "}
            <strong className="text-bone/90">
              no fee is refundable on the basis that a result did not occur
            </strong>{" "}
            — including a shortfall in replies, meetings, jobs, or revenue.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Two things we will do.</strong> First, if we have not
            begun work on a period, we will refund that period in full on request. Second, if a
            prospect we delivered fails our own cited-source verification standard — that is, it
            should never have passed our quality check — we will replace that prospect at no charge
            within the same period. Replacement is the sole remedy for a failed quality check; it is
            not a cash refund.
          </p>
          <p className="mt-4 leading-7 text-muted">
            The free pipeline audit involves no payment, so nothing is refundable in connection with
            it.
          </p>
        </Section>

        <Section title="9. Termination">
          <ul className="space-y-2 leading-7 text-muted">
            <BulletItem>
              <strong className="text-bone/90">For convenience.</strong> Either party may terminate
              under the cancellation terms in section 7.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">For breach.</strong> Either party may terminate if
              the other materially breaches these Terms or the signed agreement and does not cure
              the breach within 10 days of written notice.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">Immediately, by us, without refund.</strong> We may
              suspend or terminate immediately, and no refund is due, if you do not pay when due; if
              you direct us to send messaging that is fabricated, deceptive, or non-compliant; if
              you direct outreach to contacts who have opted out or are on a suppression or
              do-not-contact list; if you supply contact data you are not lawfully entitled to use;
              or if you require us to make claims we cannot substantiate. These limits are not
              negotiable — they are the reason our work can be trusted by the people who receive it.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">By us, for fit.</strong> We may decline or end an
              engagement where a conflict of interest arises, or where we conclude we cannot deliver
              to our standard. In that case we will refund any period we have not begun work on.
            </BulletItem>
          </ul>
        </Section>

        <Section id="ownership" title="10. Who owns what, and what happens when an engagement ends">
          <p className="leading-7 text-muted">
            Within 5 business days of the engagement ending we will deliver the client-specific work
            product for the periods you paid for — the prospect research and lists, the outreach
            scripts and drafted messages, and your campaign and tracking records — plus the current
            suppression and opt-out list. Those deliverables are yours to keep and use; ending the
            engagement does not claw them back.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Ownership.</strong> On payment for a period, the
            client-specific work product produced in that period is yours: you own it outright and
            may use, keep, modify, and re-use it without restriction or further payment from you. We
            retain our own underlying methods, templates, scoring logic, and tooling, which are
            licensed to nobody and not transferred.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Deletion, and the one thing we keep.</strong> Within 30
            days of the engagement ending we delete or de-identify your data in our active systems,
            subject to any legal or record-keeping obligation. There is one deliberate exception: we
            permanently retain the suppression and opt-out list — the record of people who asked not
            to be emailed. Deleting it would destroy the only mechanism that guarantees those people
            are never contacted again, so it is kept as a minimal do-not-contact record and used for
            no other purpose. Your data is never used for another client.
          </p>
        </Section>

        <Section title="11. What each side is responsible for">
          <ul className="space-y-2 leading-7 text-muted">
            <BulletItem>
              <strong className="text-bone/90">We are responsible for</strong> research quality and
              sourcing, targeting logic, message drafting, and data organisation — and, on the tiers
              that include them, outreach execution, follow-up, reply qualification, booking, and
              ongoing written reporting.
            </BulletItem>
            <BulletItem>
              <strong className="text-bone/90">You are responsible for</strong> your offer and
              pricing, the accuracy of information and any contact data you give us, your legal
              right to contact the people on lists you provide, the sending mailbox or identity used
              for outreach on the tiers that require one, responding to interested prospects, the
              live sales conversations, and closing. On the entry tier you also run all sending and
              follow-up yourself.
            </BulletItem>
          </ul>
        </Section>

        <Section title="12. Using this site">
          <ul className="space-y-2 leading-7 text-muted">
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
          <p className="leading-7 text-muted">
            When you submit the form, you consent to be contacted about your enquiry. How we handle
            the information you provide is described in our{" "}
            <Link href="/privacy" className="text-gold-200 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            . You can opt out of contact at any time.
          </p>
        </Section>

        <Section title="14. Intellectual property">
          <p className="leading-7 text-muted">
            The content, design, text, and graphics on this site are owned by {legalEntityName} or
            its licensors and are protected by applicable law. You may view and share the site, but
            you may not copy, republish, or use its content for commercial purposes without our
            written permission. Ownership of work produced for a paying client is dealt with in
            section 10.
          </p>
        </Section>

        <Section title="15. Third-party links and tools">
          <p className="leading-7 text-muted">
            This site links to and uses third-party tools — including a scheduling provider for
            booking calls, and third-party sources we cite on our guide pages. We are not
            responsible for the content, policies, pricing, or availability of third-party services,
            and your use of them is subject to their own terms. Third-party figures we cite are
            accurate to the date shown beside them and change without notice.
          </p>
        </Section>

        <Section title="16. Disclaimers and limitation of liability">
          <p className="leading-7 text-muted">
            The site and its content are provided{" "}
            <strong className="text-bone/90">
              &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
            </strong>{" "}
            without warranties of any kind, whether express or implied, including the implied
            warranties of merchantability, fitness for a particular purpose, and non-infringement.
            We do not warrant that the site will be uninterrupted, error-free, or secure.
          </p>
          <p className="mt-4 leading-7 text-muted">
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
          <p className="leading-7 text-muted">
            We may update these Terms from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date above. Your continued use of the site after changes take
            effect means you accept the updated Terms. For an active paid engagement, changes to
            these Terms do not apply to the current paid period, and we will give notice of a
            material change before it takes effect.
          </p>
        </Section>

        <Section title="18. Governing law and contact">
          <p className="leading-7 text-muted">
            These Terms are governed by the laws of the State of {governingLawState}, without regard
            to its conflict-of-laws rules, and the state and federal courts located in{" "}
            {governingLawState} have exclusive jurisdiction. Questions about these Terms, billing, or
            cancellation? Reach us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-gold-200 underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            {businessMailingAddress ? <> or by mail at {businessMailingAddress}</> : null}. We aim to
            reply to billing and cancellation requests within two business days.
          </p>
        </Section>
      </main>

      <footer className="border-t border-gold-500/12 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-gold-200">{legalEntityName}</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-gold-200">
              Home
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-gold-200">
              Pricing
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-gold-200">
              Privacy
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
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
      <h2 className="font-display text-2xl text-bone">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
      <span>{children}</span>
    </li>
  );
}
