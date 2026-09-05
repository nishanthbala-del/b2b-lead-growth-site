import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ClientFeedbackForms from "@/components/client-feedback/ClientFeedbackForms";
import { contactEmail } from "@/lib/site";

// A signed client's own page — reached only via the personal link the review/referral ask sends
// (operating-system repo: scripts/run_review_referral.py), never from the public nav. Gated on a
// token in the URL, not an account: with no token, a random visitor sees a generic message and a
// contact-email fallback instead of a form, so this page can never become "how a stranger submits
// a testimonial claiming to be a client." Never indexed — not registered in lib/pages.ts's
// indexable route list.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Same closed charset as app/refer/page.tsx and app/api/lead/route.ts's `referralToken`.
const TOKEN_RE = /^[A-Za-z0-9_-]{1,40}$/;

export default async function ForClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const token = (t || "").trim();
  const valid = TOKEN_RE.test(token);

  return (
    <PageShell width="wide">
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          For clients
        </p>
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl">
          {valid ? "Leave a review, or send a referral" : "This page is for existing clients"}
        </h1>

        {valid ? (
          <>
            <p className="mt-4 max-w-2xl leading-7 text-subtle">
              Both take a couple of minutes. Neither is required, and nothing you send here goes
              on the website without us checking back with you first.
            </p>
            <div className="mt-10">
              <ClientFeedbackForms token={token} />
            </div>
          </>
        ) : (
          <p className="mt-4 max-w-2xl leading-7 text-subtle">
            If you&rsquo;re a current client, check your email for your personal link — it&rsquo;s
            the fastest way, and it credits you correctly. No link handy? Email{" "}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-accent underline underline-offset-4 hover:text-accent">
              {contactEmail}
            </a>{" "}
            and we&rsquo;ll send one.
          </p>
        )}
      </main>
    </PageShell>
  );
}
