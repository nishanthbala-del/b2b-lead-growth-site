import type { Metadata } from "next";
import Link from "next/link";
import {
  brandName,
  contactEmail,
  legalEntity,
  legalEntityName,
  legalLastUpdated,
} from "@/lib/site";

const PAGE_TITLE = "Privacy Policy";
const PAGE_DESCRIPTION =
  "How B2B Lead Growth collects, uses, stores, and protects the information you share through this website.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  // Self-canonical: without this, the App Router inherits the root layout's
  // canonical ("/") and would point this page at the homepage.
  alternates: { canonical: "/privacy" },
  // openGraph is NOT inherited field-by-field: declaring it in the root layout and
  // omitting it here made this page share as the homepage, with the homepage's
  // title, description and og:url.
  openGraph: {
    title: `${PAGE_TITLE} | B2B Lead Growth`,
    description: PAGE_DESCRIPTION,
    type: "article",
    url: "/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | B2B Lead Growth`,
    description: PAGE_DESCRIPTION,
  },
};



export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: {legalLastUpdated}</p>

        <p className="mt-8 leading-7 text-muted">
          This Privacy Policy explains how {brandName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, stores, and protects information when you visit this
          website or submit our lead strategy request form. We keep data collection to the minimum
          needed to respond to you and deliver our service.
        </p>

        <Section title="1. Information we collect">
          <p className="leading-7 text-muted">
            <strong className="text-bone/90">Information you give us.</strong> When you submit the
            request form, we collect the details you choose to provide: your name, work email,
            company, website, role, target market, average deal size, sales goals, current
            prospecting method, and any ideal-customer notes. Please share only what you&rsquo;re
            comfortable providing.
          </p>
          <p className="mt-4 leading-7 text-muted">
            <strong className="text-bone/90">Information collected automatically.</strong> When you
            submit the form, our server records the date and time and the IP address the request
            came from, to prevent spam and abuse. Be aware that the IP address is stored alongside
            your submission for as long as we keep the submission, not just for the moment of the
            check. If you click &ldquo;Choose a time&rdquo; on the booking step, we also record that
            you reached that step, so we know which enquiries went on to book. This site does{" "}
            <em>not</em> use third-party advertising, analytics, or cross-site tracking cookies, and
            it sets no cookies of its own.
          </p>
        </Section>

        <Section title="2. How we use your information">
          <ul className="space-y-2 leading-7 text-muted">
            <BulletItem>Respond to your enquiry and schedule a lead strategy call.</BulletItem>
            <BulletItem>
              Assess fit and, if we work together, plan and deliver the agreed service.
            </BulletItem>
            <BulletItem>Maintain records of requests and protect against spam or misuse.</BulletItem>
            <BulletItem>Improve our website and the relevance of what we offer.</BulletItem>
          </ul>
          <p className="mt-4 leading-7 text-muted">
            We do not sell your personal information, and we do not use it for unrelated
            advertising.
          </p>
        </Section>

        <Section title="3. Consent and legal basis">
          <p className="leading-7 text-muted">
            The tick-box on the form is your consent to be <em>contacted</em> about your enquiry,
            and you can withdraw it at any time (see &ldquo;Your choices and rights&rdquo; below).
            Withdrawing it stops us contacting you; it does not by itself erase the record of your
            enquiry, which we keep on the basis of our legitimate interest in responding to
            business enquiries, running this website, and keeping records of who we have dealt
            with. You can ask us to delete that record too, and we will.
          </p>
        </Section>

        <Section title="3a. Information about prospects we research for clients">
          <p className="leading-7 text-muted">
            Separately from this website, our service researches business contacts on behalf of our
            clients. That information comes from freely available public sources, is limited to
            business-context details, and always records the source it came from. If you have been
            contacted as a result of that work and want to be removed, tell us and we will add you
            to a suppression list immediately and permanently — you will not be contacted again for
            that client. This policy covers our own handling of that data; the client on whose
            behalf the outreach is sent is responsible for their own compliance obligations as the
            sender.
          </p>
        </Section>

        <Section title="4. How we store and share it">
          <p className="leading-7 text-muted">
            Form submissions are stored in our own records and in Google Workspace (Google Sheets).
            This website is hosted on Vercel, and scheduling is handled through Google Calendar.
            These providers process data on our behalf so we can run the service; we don&rsquo;t
            share your information with anyone else except where required by law. We limit access to
            your information to people who need it to respond to you or deliver the service.
          </p>
        </Section>

        <Section title="5. Data retention">
          <p className="leading-7 text-muted">
            We keep request information for as long as needed to respond to you, deliver any agreed
            service, and meet legal or record-keeping obligations. When it&rsquo;s no longer needed,
            we delete it or remove identifying details. You can ask us to delete your information
            sooner at any time.
          </p>
        </Section>

        <Section title="6. Your choices and rights">
          <p className="leading-7 text-muted">
            Depending on where you live, you may have the right to access, correct, delete, or
            restrict the use of your personal information, to object to certain processing, and to
            withdraw consent. To make a request, contact us using the details in section 9 below
            and tell us what you&rsquo;d like — we&rsquo;ll act on verified requests within a
            reasonable time and won&rsquo;t charge you for it. You can also ask us to stop
            contacting you and we will. We will not treat you differently for exercising any of
            these rights.
          </p>
        </Section>

        <Section title="7. Children's privacy">
          <p className="leading-7 text-muted">
            This is a business-to-business service and is not directed to children. We do not
            knowingly collect personal information from anyone under 16.
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p className="leading-7 text-muted">
            We may update this policy from time to time. When we do, we&rsquo;ll revise the
            &ldquo;Last updated&rdquo; date above. Material changes will be reflected on this page.
          </p>
        </Section>

        <Section title="9. Who we are, and how to contact us">
          <p className="leading-7 text-muted">
            {legalEntity ? (
              <>
                {brandName} is operated by {legalEntity}, which is responsible for the information
                described in this policy.
              </>
            ) : (
              <>
                {brandName} is the trading name of {legalEntityName}, a limited liability company
                formed in the United States, which is responsible for the information described in
                this policy. Full registered business details are available on request.
              </>
            )}
          </p>
          <p className="mt-4 leading-7 text-muted">
            For anything to do with this policy or your information — including access, correction,
            deletion, or asking us to stop contacting you —{" "}
            {contactEmail ? (
              <>
                email{" "}
                <a
                  href={`mailto:${contactEmail}?subject=Privacy%20request`}
                  className="text-gold-200 underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                . You do not need to fill in any form, and we will not ask you for more information
                than we need to find your record and verify the request.
              </>
            ) : (
              <>
                use the{" "}
                <Link href="/#contact" className="text-gold-200 underline-offset-4 hover:underline">
                  request form
                </Link>{" "}
                and write &ldquo;Privacy&rdquo; in the notes. Only your name and email are needed to
                identify your record — you don&rsquo;t have to answer the questions about your
                business, and we will not use a privacy request as a reason to contact you about
                our services.
              </>
            )}
          </p>
        </Section>
      </main>

      <footer className="border-t border-gold-500/12 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-gold-200">{brandName}</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-gold-200">
              Home
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
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
