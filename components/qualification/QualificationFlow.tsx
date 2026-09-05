"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BUDGET,
  CAPACITY,
  CURRENT_APPROACH,
  EMPTY_ANSWERS,
  EXPORT_READINESS,
  FOLLOW_UP_OWNER,
  GROWTH_PROBLEM,
  JOB_VALUE,
  RECORD_VOLUME,
  TIMELINE,
  YEARS_IN_BUSINESS,
  evaluateFit,
  type FitResult,
  type QualificationAnswers,
} from "@/lib/qualification";
import { bookingUrl, callLengthMinutes, contactEmail, intakeMinutes } from "@/lib/site";
import { Field, FieldError, Input, OptionCards, Textarea, focusFirstField, focusFirstInvalid } from "./fields";

/* -------------------------------------------------------------------------- */
/*  The qualification flow                                                     */
/* -------------------------------------------------------------------------- */
//
// Four short question steps, then a result. It replaces a two-step form whose only
// possible ending was the same booking link for everyone — including the visitors
// the site's own "not the right fit" list says we cannot help.
//
// The steps map onto the five things worth knowing before a call:
//   1. Company     — who you are, and how to reach you
//   2. Business    — how long, how much history, what a job is worth   (fit criteria)
//   3. Problem     — what you're trying to fix, and how work reaches you today
//   4. Readiness   — capacity, whether the records can be exported, when, what budget
//
// Step 5 is the outcome. `evaluateFit` decides it; the same function runs on the
// server so the record the owner reads is not the one the browser asserted.
//
// This is the site's ONLY conversion surface. It used to be duplicated behind a modal
// on the homepage as well; the modal is gone, so there is one qualification standard,
// at one URL that can be linked from an email or bookmarked mid-decision.

type ContactState = {
  name: string;
  email: string;
  company: string;
  website: string;
  role: string;
  serviceArea: string;
  notes: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  hp_leave_blank: string;
};

const EMPTY_CONTACT: ContactState = {
  name: "",
  email: "",
  company: "",
  website: "",
  role: "",
  serviceArea: "",
  notes: "",
  consent: false,
  hp_leave_blank: "",
};

const STEPS = [
  { n: 1, label: "Your company" },
  { n: 2, label: "Your business" },
  { n: 3, label: "The problem" },
  { n: 4, label: "Readiness" },
] as const;

const LAST_QUESTION_STEP = 4;

type Errors = Partial<Record<string, string>>;

export default function QualificationFlow() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState<ContactState>(EMPTY_CONTACT);
  const [answers, setAnswers] = useState<QualificationAnswers>({ ...EMPTY_ANSWERS });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadId, setLeadId] = useState("");
  // False when the server could not persist the lead anywhere (e.g. the Sheets
  // webhook is misconfigured). The result step then says so plainly rather than
  // thanking someone whose details were dropped.
  const [stored, setStored] = useState(true);
  const [result, setResult] = useState<FitResult | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Campaign tag from the URL (/start?src=hvac-batch-3), so a submission can be traced
  // back to the outreach that produced it. Read from window rather than useSearchParams
  // because the latter forces this page out of static generation for a value that is
  // purely informational. Cookieless, first-party, and never read back to the visitor.
  const [campaign, setCampaign] = useState("");
  // The REFERRAL token, from /start?t=… — a different question from `campaign` and
  // deliberately a separate field. `campaign` traces which outbound batch produced a
  // visit; `referralToken` traces which existing client shared the link. Mapping one
  // from the other would credit every batch-tagged visitor to a referral that never
  // happened, which is a fabricated attribution.
  //
  // The operating system's credit_referrals.py reads this token out of intake_log.csv
  // and matches it against data/referrals/tokens.csv. Until now nothing on this side
  // ever sent one, so that lane could not credit anybody: the flywheel was wired at the
  // far end and open at this one.
  const [referralToken, setReferralToken] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const raw = q.get("src") ?? "";
    // Closed character set: this string ends up in the owner's spreadsheet.
    if (/^[A-Za-z0-9_-]{1,40}$/.test(raw)) setCampaign(raw);
    const ref = q.get("t") ?? q.get("ref") ?? "";
    if (/^[A-Za-z0-9_-]{1,40}$/.test(ref)) setReferralToken(ref);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLParagraphElement>(null);

  const isResult = step > LAST_QUESTION_STEP;

  // A live preview of the fit while the visitor answers, so the result step is never
  // the first time they hear anything. Cheap: `evaluateFit` is pure and synchronous.
  const provisional = useMemo(() => evaluateFit(answers), [answers]);

  // Move focus to the first field of the new step. On the result there are no fields,
  // so focus the step heading instead: a freshly inserted role="status" node is
  // unreliably announced, whereas moving focus reliably says what changed.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (isResult) stepHeadingRef.current?.focus();
      else focusFirstField(rootRef.current);
      // The panel can sit below the fold after a step change on a short screen.
      rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [step, isResult]);

  function setContactField<K extends keyof ContactState>(key: K, value: ContactState[K]) {
    setContact((c) => ({ ...c, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function setAnswer<K extends keyof QualificationAnswers>(key: K, value: QualificationAnswers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function validate(forStep: number): boolean {
    const next: Errors = {};
    if (forStep === 1) {
      if (!contact.name.trim()) next.name = "Please enter your name.";
      if (!contact.email.trim()) next.email = "Please enter your work email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
        next.email = "That doesn't look like a valid email.";
      if (!contact.company.trim()) next.company = "Please enter your company.";
    }
    if (forStep === 2) {
      if (!answers.yearsInBusiness) next.yearsInBusiness = "Pick one so we know what we're working with.";
      if (!answers.recordVolume) next.recordVolume = "This decides whether reactivation can work at all.";
      if (!answers.jobValue) next.jobValue = "Pick the band your typical job falls into.";
      if (!contact.serviceArea.trim()) next.serviceArea = "Tell us where you work and what you want more of.";
    }
    if (forStep === 3) {
      if (!answers.growthProblem) next.growthProblem = "Pick the one that bothers you most.";
      if (!answers.currentApproach) next.currentApproach = "Pick the closest match.";
      if (!answers.followUpOwner) next.followUpOwner = "Pick one — it's the question that decides the tier.";
    }
    if (forStep === 4) {
      if (!answers.capacity) next.capacity = "Pick one.";
      if (!answers.exportReadiness) next.exportReadiness = "Pick one — 'not sure' is a real answer.";
      if (!answers.timeline) next.timeline = "Pick one.";
      if (!answers.budget) next.budget = "Pick one, or tell us you're not sure yet.";
      if (!contact.consent) next.consent = "Please confirm so we can reply to you.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate(LAST_QUESTION_STEP)) {
      focusFirstInvalid(rootRef.current);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", ...contact, ...answers, source: "page", campaign, referralToken }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        id?: string;
        error?: string;
        stored?: boolean;
        fit?: FitResult;
      };
      if (!res.ok || !data.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setLeadId(data.id || "");
      setStored(data.stored !== false);
      // Prefer the server's verdict: it is the one written onto the record, and a
      // result page that disagrees with the owner's copy of it is worse than useless.
      setResult(data.fit ?? evaluateFit(answers));
      setStep(LAST_QUESTION_STEP + 1);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenScheduler() {
    setBookingConfirmed(true);
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "booking_opened", id: leadId }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      {!isResult ? (
        <>
          <StepIndicator step={step} />
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (submitting) return;
              if (step < LAST_QUESTION_STEP) {
                if (validate(step)) setStep(step + 1);
                else focusFirstInvalid(rootRef.current);
              } else {
                void submit();
              }
            }}
          >
            <div className="grid gap-6 py-6">
              {step === 1 ? (
                <>
                  <p className="text-sm leading-6 text-muted">
                    Four short steps, about {intakeMinutes} minutes. At the end you&rsquo;ll get a
                    straight answer on whether this is a fit &mdash; including if it isn&rsquo;t.
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" htmlFor="q-name" error={errors.name} required>
                      <Input
                        id="q-name"
                        value={contact.name}
                        onChange={(v) => setContactField("name", v)}
                        placeholder="Jane Doe"
                        autoComplete="name"
                        invalid={!!errors.name}
                      />
                    </Field>
                    <Field label="Work email" htmlFor="q-email" error={errors.email} required>
                      <Input
                        id="q-email"
                        type="email"
                        inputMode="email"
                        value={contact.email}
                        onChange={(v) => setContactField("email", v)}
                        placeholder="jane@company.com"
                        autoComplete="email"
                        invalid={!!errors.email}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company" htmlFor="q-company" error={errors.company} required>
                      <Input
                        id="q-company"
                        value={contact.company}
                        onChange={(v) => setContactField("company", v)}
                        placeholder="Company name"
                        autoComplete="organization"
                        invalid={!!errors.company}
                      />
                    </Field>
                    <Field label="Website" htmlFor="q-website" hint="optional">
                      <Input
                        id="q-website"
                        inputMode="url"
                        value={contact.website}
                        onChange={(v) => setContactField("website", v)}
                        placeholder="company.com"
                        autoComplete="url"
                      />
                    </Field>
                  </div>
                  <Field label="Your role" htmlFor="q-role" hint="optional">
                    <Input
                      id="q-role"
                      value={contact.role}
                      onChange={(v) => setContactField("role", v)}
                      placeholder="Owner, general manager, service manager"
                      autoComplete="organization-title"
                    />
                  </Field>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <OptionCards
                    name="yearsInBusiness"
                    legend="How long have you been in business?"
                    options={YEARS_IN_BUSINESS}
                    value={answers.yearsInBusiness}
                    onChange={(v) => setAnswer("yearsInBusiness", v as QualificationAnswers["yearsInBusiness"])}
                    error={errors.yearsInBusiness}
                    columns={2}
                  />
                  <OptionCards
                    name="recordVolume"
                    legend="How much customer history do you have?"
                    hint="past customers, estimates, agreements"
                    options={RECORD_VOLUME}
                    value={answers.recordVolume}
                    onChange={(v) => setAnswer("recordVolume", v as QualificationAnswers["recordVolume"])}
                    error={errors.recordVolume}
                  />
                  <OptionCards
                    name="jobValue"
                    legend="What's a typical job worth to you?"
                    options={JOB_VALUE}
                    value={answers.jobValue}
                    onChange={(v) => setAnswer("jobValue", v as QualificationAnswers["jobValue"])}
                    error={errors.jobValue}
                    columns={2}
                  />
                  <Field
                    label="Service area, and the work you want more of"
                    htmlFor="q-area"
                    hint="counties or towns, plus job types"
                    error={errors.serviceArea}
                    required
                  >
                    <Textarea
                      id="q-area"
                      value={contact.serviceArea}
                      onChange={(v) => setContactField("serviceArea", v)}
                      placeholder="e.g. Middlesex and Somerset County NJ — residential replacements and maintenance agreements"
                      rows={2}
                      invalid={!!errors.serviceArea}
                    />
                  </Field>
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <OptionCards
                    name="growthProblem"
                    legend="What bothers you most right now?"
                    options={GROWTH_PROBLEM}
                    value={answers.growthProblem}
                    onChange={(v) => setAnswer("growthProblem", v as QualificationAnswers["growthProblem"])}
                    error={errors.growthProblem}
                  />
                  <OptionCards
                    name="currentApproach"
                    legend="How does new work reach you today?"
                    options={CURRENT_APPROACH}
                    value={answers.currentApproach}
                    onChange={(v) => setAnswer("currentApproach", v as QualificationAnswers["currentApproach"])}
                    error={errors.currentApproach}
                    columns={2}
                  />
                  <OptionCards
                    name="followUpOwner"
                    legend="Who chases the unsold estimates and lapsed agreements today?"
                    options={FOLLOW_UP_OWNER}
                    value={answers.followUpOwner}
                    onChange={(v) => setAnswer("followUpOwner", v as QualificationAnswers["followUpOwner"])}
                    error={errors.followUpOwner}
                    columns={2}
                  />
                </>
              ) : null}

              {step === 4 ? (
                <>
                  <OptionCards
                    name="capacity"
                    legend="Could you take on more work?"
                    options={CAPACITY}
                    value={answers.capacity}
                    onChange={(v) => setAnswer("capacity", v as QualificationAnswers["capacity"])}
                    error={errors.capacity}
                  />
                  <OptionCards
                    name="exportReadiness"
                    legend="Could you export your customer records?"
                    hint="nothing is contacted until you've approved that export"
                    options={EXPORT_READINESS}
                    value={answers.exportReadiness}
                    onChange={(v) => setAnswer("exportReadiness", v as QualificationAnswers["exportReadiness"])}
                    error={errors.exportReadiness}
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <OptionCards
                      name="timeline"
                      legend="When would you want to start?"
                      options={TIMELINE}
                      value={answers.timeline}
                      onChange={(v) => setAnswer("timeline", v as QualificationAnswers["timeline"])}
                      error={errors.timeline}
                    />
                    <OptionCards
                      name="budget"
                      legend="Which monthly fee are you weighing up?"
                      options={BUDGET}
                      value={answers.budget}
                      onChange={(v) => setAnswer("budget", v as QualificationAnswers["budget"])}
                      error={errors.budget}
                    />
                  </div>
                  <Field label="Anything else worth knowing?" htmlFor="q-notes" hint="optional">
                    <Textarea
                      id="q-notes"
                      value={contact.notes}
                      onChange={(v) => setContactField("notes", v)}
                      placeholder="e.g. no oil-to-gas conversions, no rentals, and we'd rather not take service calls outside the county"
                      rows={2}
                    />
                  </Field>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
                    <input
                      type="checkbox"
                      checked={contact.consent}
                      onChange={(e) => setContactField("consent", e.target.checked)}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? "q-consent-error" : undefined}
                      className="mt-1 h-4 w-4 shrink-0 accent-gold-400"
                    />
                    <span>
                      I&apos;m happy to be contacted about this enquiry. No spam, and you can opt
                      out anytime. See our{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gold-200 underline underline-offset-2 hover:text-gold-400"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent ? (
                    <FieldError id="q-consent-error">{errors.consent}</FieldError>
                  ) : null}
                  {/* Told before submitting, not after: nobody should discover on the
                      results page that the honest answer was "we can't help you". */}
                  {provisional.outcome === "not_yet" ? (
                    <p className="rounded-sm border border-amber-400/35 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
                      Heads up: from your answers so far this probably isn&apos;t a fit. Submit
                      anyway and we&apos;ll tell you exactly why, and where to go instead.
                    </p>
                  ) : null}
                </>
              ) : null}

              {submitError ? (
                <p
                  role="alert"
                  className="rounded-sm border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {submitError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold-500/14 pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="-ml-2 inline-flex min-h-11 items-center px-2 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
                >
                  ← Back
                </button>
              ) : (
                <span className="text-xs text-muted">
                  No card, no obligation. About {intakeMinutes} minutes.
                </span>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step < LAST_QUESTION_STEP ? (
                  <>
                    Continue <span aria-hidden="true" className="ml-2">→</span>
                  </>
                ) : submitting ? (
                  "Checking…"
                ) : (
                  "See if we're a fit"
                )}
              </button>
            </div>
          </form>

          {/* Honeypot — visually hidden, off-screen, not announced. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor="hp_leave_blank">Leave this field empty</label>
            <input
              id="hp_leave_blank"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={contact.hp_leave_blank}
              onChange={(e) => setContactField("hp_leave_blank", e.target.value)}
            />
          </div>
        </>
      ) : (
        <ResultStep
          result={result ?? provisional}
          leadId={leadId}
          stored={stored}
          bookingConfirmed={bookingConfirmed}
          onOpenScheduler={handleOpenScheduler}
          headingRef={stepHeadingRef}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Result                                                                      */
/* -------------------------------------------------------------------------- */

// Google's calendar.app.google links refuse to render in an iframe and accept no
// prefill parameters, so for those we lead with a new-tab button. Embed-friendly
// providers (Calendly, Cal.com) also get an inline scheduler — those are the only
// origins next.config.ts allows in frame-src.
const bookingEmbeddable =
  !!bookingUrl && !/calendar\.app\.google|calendar\.google\.com/i.test(bookingUrl);

function ResultStep({
  result,
  leadId,
  stored,
  bookingConfirmed,
  onOpenScheduler,
  headingRef,
}: {
  result: FitResult;
  leadId: string;
  stored: boolean;
  bookingConfirmed: boolean;
  onOpenScheduler: () => void;
  headingRef: React.RefObject<HTMLParagraphElement | null>;
}) {
  const tone =
    result.outcome === "strong"
      ? { border: "border-gold-500/45", chip: "Strong fit", chipClass: "border-gold-500/60 bg-gold-500/12 text-gold-200" }
      : result.outcome === "explore"
        ? { border: "border-gold-500/25", chip: "Likely fit", chipClass: "border-gold-500/35 bg-gold-500/8 text-gold-200" }
        : { border: "border-muted/25", chip: "Not a fit today", chipClass: "border-muted/35 bg-ink-950/60 text-muted" };

  return (
    <div className="grid gap-6 py-6">
      <div>
        <p
          ref={headingRef}
          tabIndex={-1}
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80 outline-none"
        >
          <span className={`rounded-sm border px-2.5 py-1 ${tone.chipClass}`}>{tone.chip}</span>
          {stored && leadId ? <span className="text-muted/70">Ref {leadId}</span> : null}
        </p>
        <h3 className="mt-4 font-display text-3xl leading-tight text-bone sm:text-4xl">
          {result.headline}
        </h3>
      </div>

      {/* The recovery path, and it has to be TRUE.
        *
        * It used to read "Booking a time below is the reliable route — the calendar
        * entry reaches us directly, and we can pick your details up from there."
        * Neither half held. The scheduler is a Google Calendar appointment link, which
        * accepts no prefill parameters (see the note on bookingUrl in lib/site.ts), so
        * nothing but a name and an email transfers; and on the operating-system side an
        * unmatchable booking is logged as "could not be matched to a lead — no brief
        * will be built". The visitor was steered down the one path that guaranteed he
        * would arrive at a 15-minute call and be asked the same ten questions again —
        * the precise experience the fit check exists to prevent.
        *
        * The email route is now the primary one because it is the only one that can
        * actually recover the answers, and the reference is rendered INSIDE it. It was
        * previously shown only when `stored` was true, i.e. hidden in exactly the case
        * where it is the one thing worth keeping. */}
      {!stored ? (
        <p className="rounded-sm border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
          Your answers came through, but we couldn&apos;t confirm they saved on our side.{" "}
          {leadId ? (
            <>
              The reliable fix is one email: send reference{" "}
              <strong className="font-semibold">{leadId}</strong> to{" "}
              <a
                className="underline underline-offset-2"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  `Fit check ref ${leadId}`,
                )}&body=${encodeURIComponent(
                  `My fit check didn't save. Reference: ${leadId}`,
                )}`}
              >
                {contactEmail}
              </a>{" "}
              and we&apos;ll pull the full record.
            </>
          ) : (
            <>
              The reliable fix is one email to{" "}
              <a className="underline underline-offset-2" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              , and we&apos;ll pick it up manually.
            </>
          )}
          {result.offerBooking
            ? " Booking a time below works too, but the calendar only carries your name and email, so we would be starting from scratch on the call."
            : ""}
        </p>
      ) : null}

      {result.reasons.length > 0 ? (
        <div className={`rounded-lg border ${tone.border} bg-ink-950/50 p-5`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/75">
            Why, specifically
          </p>
          <ul className="mt-4 space-y-3">
            {result.reasons.map((reason) => (
              <li key={reason} className="flex gap-3 text-sm leading-6 text-bone/90">
                <span aria-hidden="true" className="mt-0.5 text-gold-200">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.watchouts.length > 0 ? (
        <div className="rounded-lg border border-gold-500/16 bg-ink-950/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {result.outcome === "not_yet" ? "Here's the honest reason" : "What we'd need to confirm"}
          </p>
          <ul className="mt-4 space-y-3">
            {result.watchouts.map((w) => (
              <li key={w} className="flex gap-3 text-sm leading-6 text-muted">
                <span aria-hidden="true" className="mt-0.5 text-muted/70">—</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.recommendedTier ? (
        <p className="text-sm leading-6 text-muted">
          <span className="font-semibold text-gold-200">Where we&rsquo;d probably start: </span>
          {result.recommendedTier}. That&rsquo;s a read from your answers, not a quote &mdash;
          nothing is agreed until you&rsquo;ve seen the audit, and you can move tiers as the
          season changes.{" "}
          <a href="/pricing" className="text-gold-200 underline underline-offset-2 hover:text-gold-400">
            See what each tier covers
          </a>
          .
        </p>
      ) : null}

      <p className="text-base leading-7 text-bone">{result.nextStep}</p>

      {result.offerBooking && bookingUrl ? (
        <>
          {/* The walkthrough is OFFERED here, never required. The canonical offer spec
              (free_pipeline_audit.md §5) names "book a call to receive your free audit"
              as a cold ask wearing a warm label: rungs 0 and 1 are delivered in writing
              and a call is never their price. So the audit is already promised above,
              unconditionally, and this block is the optional next rung. */}
          <div className="rounded-lg border border-gold-500/20 bg-ink-950/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/75">
              Optional, and not a condition
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              If you&rsquo;d rather go through the audit together once it lands, pick a time. It
              is a walkthrough of your own work, not a sales call &mdash; and the audit reaches
              you either way, whether or not you book anything.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onOpenScheduler}
              className="mt-4 inline-flex min-h-12 w-fit items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02]"
            >
              Book the {callLengthMinutes}-minute walkthrough <span aria-hidden="true" className="ml-2">↗</span>
            </a>
          </div>
          {bookingEmbeddable ? (
            <div className="overflow-hidden rounded-sm border border-gold-500/20 bg-ink-950/60">
              <iframe src={bookingUrl} title="Book a call" className="h-[520px] w-full" loading="lazy" />
            </div>
          ) : bookingConfirmed ? (
            // Shown only after the scheduler was actually opened, so it answers the
            // question the visitor now has ("did that work?") instead of pre-empting
            // one they haven't asked.
            <p className="rounded-sm border border-gold-500/20 bg-ink-950/50 px-4 py-3 text-sm leading-6 text-muted">
              The scheduler opened in a new tab. Once you&rsquo;ve picked a time, Google emails you
              the confirmation and the call lands on both calendars &mdash; there&rsquo;s nothing
              else to send us. If the tab didn&rsquo;t open, your browser blocked it; the button
              above will work on a second click.
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted">
              Opens the calendar in a new tab. Nothing to email back and forth &mdash; pick a slot
              and it&rsquo;s booked.
            </p>
          )}
        </>
      ) : null}

      {result.suggestedReading ? (
        <p className="text-sm leading-6 text-muted">
          <span className="font-semibold text-gold-200">Worth reading either way: </span>
          <a
            href={result.suggestedReading.href}
            className="text-gold-200 underline underline-offset-2 hover:text-gold-400"
          >
            {result.suggestedReading.label}
          </a>
        </p>
      ) : null}

      <Link
        href="/"
        className="-ml-2 inline-flex min-h-11 w-fit items-center px-2 text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
      >
        ← Back to the site
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chrome                                                                      */
/* -------------------------------------------------------------------------- */

function StepIndicator({ step }: { step: number }) {
  const current = STEPS.find((s) => s.n === step);
  return (
    <div className="border-b border-gold-500/12 pb-5">
      {/* The dots are decorative; this sentence is what a screen reader gets. */}
      <p className="sr-only">
        Step {step} of {STEPS.length}: {current?.label}.
      </p>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {STEPS.map((s) => (
          <span
            key={s.n}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s.n <= step ? "bg-gold-400" : "bg-gold-500/18"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/75" aria-hidden="true">
        Step {step} of {STEPS.length} · {current?.label}
      </p>
    </div>
  );
}

