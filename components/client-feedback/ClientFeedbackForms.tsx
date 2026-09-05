"use client";

import { useState } from "react";
import { Field, Input, Textarea } from "@/components/qualification/fields";

// The two forms behind a client's personal /for-clients?t=<token> link: leave a review, or refer
// a business. Both post to /api/client-feedback, which stages the submission for the owner to
// review — nothing here ever publishes anything (see that route's own comment for why).

function SubmitButton({ submitting, label }: { submitting: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex min-h-12 items-center justify-center rounded-sm border border-accent/45 bg-accent-fill px-6 text-sm font-semibold text-paper shadow-lift transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? "Sending…" : label}
    </button>
  );
}

function Done({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-sm border border-line bg-accent-soft px-4 py-3 text-sm leading-6 text-ink">
      {children}
    </p>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-sm border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-800">
      {children}
    </p>
  );
}

async function submitFeedback(payload: Record<string, unknown>) {
  const res = await fetch("/api/client-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
}

function ReviewForm({ token, hp }: { token: string; hp: string }) {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await submitFeedback({ type: "review", token, quote, name, company, consent, hp_leave_blank: hp });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <Done>Thank you — this is staged for review, and we&rsquo;ll follow up if we&rsquo;d like to use it.</Done>;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5">
      <Field label="Your review" htmlFor="rv-quote" required>
        <Textarea
          id="rv-quote"
          value={quote}
          onChange={setQuote}
          rows={4}
          placeholder="In your own words — what's actually been different since you started?"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="rv-name" hint="optional">
          <Input id="rv-name" value={name} onChange={setName} placeholder="Jane Doe" />
        </Field>
        <Field label="Company" htmlFor="rv-company" hint="optional">
          <Input id="rv-company" value={company} onChange={setCompany} placeholder="Company name" />
        </Field>
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-subtle">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          I&rsquo;m OK with B2B Lead Growth possibly using this quote on their website, credited the
          way I&rsquo;ve named above — they&rsquo;ll check with me before it goes live either way.
        </span>
      </label>
      {error ? <ErrorNote>{error}</ErrorNote> : null}
      <div>
        <SubmitButton submitting={submitting} label="Send review" />
      </div>
    </form>
  );
}

function ReferralForm({ token, hp }: { token: string; hp: string }) {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await submitFeedback({
        type: "referral", token, businessName, contactName, contactEmail, notes,
        hp_leave_blank: hp,
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <Done>Thank you — we&rsquo;ll reach out to them directly, and this is credited to you.</Done>;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5">
      <Field label="Business you're referring" htmlFor="rf-business" required>
        <Input id="rf-business" value={businessName} onChange={setBusinessName} placeholder="Company name" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Contact name" htmlFor="rf-contact-name" hint="optional">
          <Input id="rf-contact-name" value={contactName} onChange={setContactName} placeholder="Who to reach" />
        </Field>
        <Field label="Contact email" htmlFor="rf-contact-email" hint="optional">
          <Input id="rf-contact-email" type="email" inputMode="email" value={contactEmail} onChange={setContactEmail} placeholder="them@company.com" />
        </Field>
      </div>
      <Field label="Anything worth knowing?" htmlFor="rf-notes" hint="optional">
        <Textarea id="rf-notes" value={notes} onChange={setNotes} rows={2} placeholder="e.g. mention you referred them" />
      </Field>
      {error ? <ErrorNote>{error}</ErrorNote> : null}
      <div>
        <SubmitButton submitting={submitting} label="Send referral" />
      </div>
    </form>
  );
}

export default function ClientFeedbackForms({ token }: { token: string }) {
  const [hp, setHp] = useState("");
  return (
    <div className="grid gap-10">
      {/* Honeypot, shared — visually hidden, off-screen, not announced. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="cf-hp">Leave this field empty</label>
        <input id="cf-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <section className="rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl text-ink">Leave a review</h2>
        <p className="mt-2 text-sm leading-6 text-subtle">
          Two minutes, in your own words. We&rsquo;ll only use it with your OK, credited the way you
          name below.
        </p>
        <div className="mt-6">
          <ReviewForm token={token} hp={hp} />
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl text-ink">Refer a business</h2>
        <p className="mt-2 text-sm leading-6 text-subtle">
          Know another company that could use more qualified conversations? We&rsquo;ll reach out
          directly, and it&rsquo;s credited to you.
        </p>
        <div className="mt-6">
          <ReferralForm token={token} hp={hp} />
        </div>
      </section>
    </div>
  );
}
