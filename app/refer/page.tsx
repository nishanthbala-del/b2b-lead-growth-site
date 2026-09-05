import { redirect } from "next/navigation";
import type { Metadata } from "next";

// The referral landing point. A client's review/referral ask hands out
// `<site>/refer?t=<token>` to forward to another business — this page's only job is to carry that
// token into the existing /start fit-check as `?ref=`, exactly like the site's existing `campaign`
// tag (`/start?src=...`). No new funnel, no new page to maintain: it rides the same qualification
// flow and lead-capture API every other inbound lead already uses.
//
// Never indexed: this is a personal link handed out by one client, not a page anyone should find
// by searching. Not registered in lib/pages.ts's indexable route list on purpose.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Same closed charset as `campaign` and `referralToken` in app/api/lead/route.ts — a general
// token shape, not tied to any one minting scheme (scripts/run_review_referral.py in the
// operating-system repo currently mints 8 hex characters, but this must not assume that stays true).
const TOKEN_RE = /^[A-Za-z0-9_-]{1,40}$/;

export default async function ReferPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const token = (t || "").trim();
  // A malformed or missing token still lands on the fit check — the whole page is a
  // convenience redirect, never a gate a real visitor could get stuck behind.
  redirect(TOKEN_RE.test(token) ? `/start?t=${token}` : "/start");
}
