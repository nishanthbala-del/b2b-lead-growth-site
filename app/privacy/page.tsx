import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How B2B Lead Growth collects, uses, stores, and protects the information you share through this website.",
  // Self-canonical: without this, the App Router inherits the root layout's
  // canonical ("/") and would point this page at the homepage.
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "June 6, 2026";
const brandName = "B2B Lead Growth";

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
        <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

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
            <strong className="text-bone/90">Information collected automatically.</strong> Our
            server records basic technical data with each submission — the date and time and the IP
            address the request came from — to help prevent spam and abuse. This site does{" "}
            <em>not</em> use third-party advertising or cross-site tracking cookies.
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
            We process your information based on the consent you give when you submit the form, and
            on our legitimate interest in responding to business enquiries and operating this site.
            You can withdraw consent or ask us to stop contacting you at any time (see &ldquo;Your
            choices and rights&rdquo; below).
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
            withdraw consent. To make a request, use the{" "}
            <Link href="/#contact" className="text-gold-200 underline-offset-4 hover:underline">
              request form
            </Link>{" "}
            on our site and tell us what you&rsquo;d like — we&rsquo;ll act on verified requests
            within a reasonable time. You can also ask us to stop contacting you and we will.
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

        <Section title="9. Contact">
          <p className="leading-7 text-muted">
            Questions about this policy or your information? Reach us through the{" "}
            <Link href="/#contact" className="text-gold-200 underline-offset-4 hover:underline">
              request form
            </Link>{" "}
            and mention &ldquo;Privacy&rdquo; so we can route it correctly.
          </p>
        </Section>

        <p className="mt-12 rounded-lg border border-gold-500/18 bg-ink-900/70 p-5 text-sm leading-6 text-muted">
          <span className="font-semibold text-gold-200">Note:</span> This policy is a general
          starting point provided with the site, not legal advice. Have it reviewed against the laws
          that apply to your market (for example GDPR, CAN-SPAM, CASL, or US state privacy laws)
          before you rely on it.
        </p>
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
