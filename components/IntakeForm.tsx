"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Context: any CTA can call openIntake() to launch the form                  */
/* -------------------------------------------------------------------------- */

type IntakeContextValue = { openIntake: (packageName?: string) => void };

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function useIntake(): IntakeContextValue {
  const ctx = useContext(IntakeContext);
  // Graceful no-op if a CTA is ever rendered outside the provider.
  return ctx ?? { openIntake: () => {} };
}

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [packageName, setPackageName] = useState<string | undefined>(undefined);

  const openIntake = useCallback((name?: string) => {
    setPackageName(name);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openIntake }), [openIntake]);

  return (
    <IntakeContext.Provider value={value}>
      {children}
      <IntakeForm open={open} initialPackage={packageName} onClose={() => setOpen(false)} />
    </IntakeContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form data + options                                                        */
/* -------------------------------------------------------------------------- */

const PACKAGE_OPTIONS = ["Not sure yet", "Lead Engine", "Outreach Engine", "Appointment Engine"];

const DEAL_SIZE_OPTIONS = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $25,000",
  "$25,000 – $100,000",
  "$100,000+",
];

const PROSPECTING_OPTIONS = [
  "No consistent system yet",
  "Cold email",
  "Cold calling",
  "LinkedIn outreach",
  "Referrals / word of mouth",
  "Inbound / content",
  "Paid ads",
  "Bought lead lists",
  "Other",
];

type FormState = {
  package: string;
  name: string;
  email: string;
  company: string;
  website: string;
  role: string;
  targetMarket: string;
  avgDealSize: string;
  salesGoals: string;
  currentProspecting: string;
  icpNotes: string;
  consent: boolean;
  // Honeypot — must stay empty.
  company_website: string;
};

const EMPTY_FORM: FormState = {
  package: "Not sure yet",
  name: "",
  email: "",
  company: "",
  website: "",
  role: "",
  targetMarket: "",
  avgDealSize: "",
  salesGoals: "",
  currentProspecting: "",
  icpNotes: "",
  consent: false,
  company_website: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

// Falls back to the owner's Google Calendar scheduler so the booking step never
// silently disappears if NEXT_PUBLIC_BOOKING_URL is missing from a Vercel build.
// (This is a build-time NEXT_PUBLIC_ var — redeploy after changing it in Vercel.)
const bookingUrl =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
  "https://calendar.app.google/cyDCVBd2XhpuBCvG9";

/* -------------------------------------------------------------------------- */
/*  The modal form                                                            */
/* -------------------------------------------------------------------------- */

function IntakeForm({
  open,
  initialPackage,
  onClose,
}: {
  open: boolean;
  initialPackage?: string;
  onClose: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadId, setLeadId] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Reset to a clean state each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      package: initialPackage && PACKAGE_OPTIONS.includes(initialPackage)
        ? initialPackage
        : "Not sure yet",
    });
    setErrors({});
    setSubmitError("");
    setLeadId("");
    setStep(1);
  }, [open, initialPackage]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Capture the element that opened the modal; restore focus to it on close.
  useEffect(() => {
    if (!open) return;
    openerRef.current = (document.activeElement as HTMLElement) ?? null;
    return () => openerRef.current?.focus?.();
  }, [open]);

  // Move focus to the first field of the current step (deterministic; replaces autoFocus).
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => focusFirstField(panelRef.current));
    return () => cancelAnimationFrame(raf);
  }, [open, step]);

  // Trap Tab/Shift+Tab inside the dialog so focus can't reach the page behind it.
  function handlePanelKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusable = getFocusable(panelRef.current);
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement as HTMLElement | null;
    const inside = !!panelRef.current?.contains(active);
    if (e.shiftKey) {
      if (!inside || active === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (!inside || active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function validateStep1(): boolean {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "That doesn't look like a valid email.";
    if (!form.company.trim()) next.company = "Please enter your company.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2(): boolean {
    const next: Errors = {};
    if (!form.targetMarket.trim()) next.targetMarket = "Tell us who you sell to.";
    if (!form.avgDealSize) next.avgDealSize = "Select an average deal size.";
    if (!form.salesGoals.trim()) next.salesGoals = "Share what success looks like.";
    if (!form.currentProspecting) next.currentProspecting = "Select your current approach.";
    if (!form.consent) next.consent = "Please confirm so we can reply to you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", ...form }),
      });
      const data = (await res.json()) as { ok: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setLeadId(data.id || "");
      setStep(3);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const overlayMotion = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const panelMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.99 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="intake-modal fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-ink-950/85 px-4 py-6 backdrop-blur-md sm:items-center sm:py-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="intake-title"
          {...overlayMotion}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            className="relative w-full max-w-2xl rounded-lg border border-gold-500/25 bg-ink-900 shadow-panel outline-none"
            onClick={(e) => e.stopPropagation()}
            {...panelMotion}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-200/70 to-transparent" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gold-500/14 px-6 py-5 sm:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                  {step === 3 ? "Request received" : "Request a lead strategy call"}
                </p>
                <h2 id="intake-title" className="mt-1 font-display text-2xl text-bone sm:text-3xl">
                  {step === 3 ? "You're in good hands." : "Let's build your pipeline."}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold-500/30 text-gold-200 transition-colors hover:bg-gold-500/10"
              >
                <span aria-hidden="true" className="text-lg leading-none">×</span>
              </button>
            </div>

            {/* Progress */}
            {step !== 3 ? (
              <div className="flex items-center gap-2 px-6 pt-5 sm:px-8" aria-hidden="true">
                <StepDot active={step >= 1} done={step > 1} label="Your business" />
                <span className={`h-px flex-1 ${step > 1 ? "bg-gold-400" : "bg-gold-500/20"}`} />
                <StepDot active={step >= 2} done={false} label="Your pipeline" />
              </div>
            ) : null}

            {/* Body */}
            <div className="px-6 py-6 sm:px-8">
              {step === 1 ? (
                <div className="grid gap-5">
                  <Field label="Which package fits best?" htmlFor="f-package">
                    <Select
                      id="f-package"
                      value={form.package}
                      onChange={(v) => update("package", v)}
                      options={PACKAGE_OPTIONS}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" htmlFor="f-name" error={errors.name} required>
                      <Input
                        id="f-name"
                        value={form.name}
                        onChange={(v) => update("name", v)}
                        placeholder="Jane Doe"
                        autoComplete="name"
                        invalid={!!errors.name}
                      />
                    </Field>
                    <Field label="Work email" htmlFor="f-email" error={errors.email} required>
                      <Input
                        id="f-email"
                        type="email"
                        value={form.email}
                        onChange={(v) => update("email", v)}
                        placeholder="jane@company.com"
                        autoComplete="email"
                        invalid={!!errors.email}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company" htmlFor="f-company" error={errors.company} required>
                      <Input
                        id="f-company"
                        value={form.company}
                        onChange={(v) => update("company", v)}
                        placeholder="Company name"
                        autoComplete="organization"
                        invalid={!!errors.company}
                      />
                    </Field>
                    <Field label="Website" htmlFor="f-website" hint="optional">
                      <Input
                        id="f-website"
                        value={form.website}
                        onChange={(v) => update("website", v)}
                        placeholder="company.com"
                        autoComplete="url"
                      />
                    </Field>
                  </div>
                  <Field label="Your role" htmlFor="f-role" hint="optional">
                    <Input
                      id="f-role"
                      value={form.role}
                      onChange={(v) => update("role", v)}
                      placeholder="Founder, Head of Sales, etc."
                      autoComplete="organization-title"
                    />
                  </Field>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-5">
                  <Field
                    label="Who do you sell to?"
                    htmlFor="f-market"
                    hint="industry, geography, company size"
                    error={errors.targetMarket}
                    required
                  >
                    <Textarea
                      id="f-market"
                      value={form.targetMarket}
                      onChange={(v) => update("targetMarket", v)}
                      placeholder="e.g. NJ-based HVAC contractors, 5–50 employees"
                      rows={2}
                      invalid={!!errors.targetMarket}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Average deal size"
                      htmlFor="f-deal"
                      error={errors.avgDealSize}
                      required
                    >
                      <Select
                        id="f-deal"
                        value={form.avgDealSize}
                        onChange={(v) => update("avgDealSize", v)}
                        options={DEAL_SIZE_OPTIONS}
                        placeholder="Select a range"
                        invalid={!!errors.avgDealSize}
                      />
                    </Field>
                    <Field
                      label="Current prospecting method"
                      htmlFor="f-prospecting"
                      error={errors.currentProspecting}
                      required
                    >
                      <Select
                        id="f-prospecting"
                        value={form.currentProspecting}
                        onChange={(v) => update("currentProspecting", v)}
                        options={PROSPECTING_OPTIONS}
                        placeholder="Select one"
                        invalid={!!errors.currentProspecting}
                      />
                    </Field>
                  </div>
                  <Field
                    label="What would success look like in 90 days?"
                    htmlFor="f-goals"
                    error={errors.salesGoals}
                    required
                  >
                    <Textarea
                      id="f-goals"
                      value={form.salesGoals}
                      onChange={(v) => update("salesGoals", v)}
                      placeholder="e.g. a steady flow of qualified conversations and a cleaner pipeline to work"
                      rows={2}
                      invalid={!!errors.salesGoals}
                    />
                  </Field>
                  <Field
                    label="Ideal customer notes / exclusions"
                    htmlFor="f-icp"
                    hint="optional"
                  >
                    <Textarea
                      id="f-icp"
                      value={form.icpNotes}
                      onChange={(v) => update("icpNotes", v)}
                      placeholder="Anything that makes a prospect a great fit — or one to avoid"
                      rows={2}
                    />
                  </Field>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? "f-consent-error" : undefined}
                      className="mt-1 h-4 w-4 shrink-0 accent-gold-400"
                    />
                    <span>
                      I&apos;m happy to be contacted about this enquiry. No spam, and you can opt out
                      anytime. See our{" "}
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
                    <FieldError id="f-consent-error">{errors.consent}</FieldError>
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <BookingStep leadId={leadId} onClose={onClose} />
              ) : null}

              {submitError ? (
                <p
                  role="alert"
                  className="mt-5 rounded-sm border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {submitError}
                </p>
              ) : null}
            </div>

            {/* Footer / actions */}
            {step !== 3 ? (
              <div className="flex items-center justify-between gap-4 border-t border-gold-500/14 px-6 py-5 sm:px-8">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
                  >
                    ← Back
                  </button>
                ) : (
                  <span className="text-xs text-muted">Takes about 60 seconds.</span>
                )}
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02]"
                  >
                    Continue <span aria-hidden="true" className="ml-2">→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Submit request"}
                  </button>
                )}
              </div>
            ) : null}

            {/* Honeypot — visually hidden, off-screen, not announced. */}
            <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
              <label htmlFor="company_website">Leave this field empty</label>
              <input
                id="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company_website}
                onChange={(e) => update("company_website", e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Booking / success step                                                     */
/* -------------------------------------------------------------------------- */

// Some providers (notably Google's calendar.app.google links) refuse to render
// inside an iframe. For those we lead with a new-tab button; for embed-friendly
// providers (Calendly, Cal.com) we also show an inline scheduler.
const bookingEmbeddable =
  !!bookingUrl && !/calendar\.app\.google|calendar\.google\.com/i.test(bookingUrl);

function BookingStep({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  function handleOpenScheduler() {
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "booking_opened", id: leadId }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/45 bg-gold-500/10 text-gold-200">
          ✓
        </span>
        <p role="status" className="text-sm leading-6 text-muted">
          Thanks — your details are in.{" "}
          {leadId ? (
            <span className="text-bone/80">
              Reference <span className="font-semibold text-gold-200">{leadId}</span>.
            </span>
          ) : null}
        </p>
      </div>

      {bookingUrl ? (
        <>
          <p className="text-base leading-7 text-bone">
            Last step: pick a time for your lead strategy call.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenScheduler}
            className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02]"
          >
            Choose a time <span aria-hidden="true" className="ml-2">↗</span>
          </a>
          {bookingEmbeddable ? (
            <div className="overflow-hidden rounded-sm border border-gold-500/20 bg-ink-950/60">
              <iframe
                src={bookingUrl}
                title="Book a strategy call"
                className="h-[520px] w-full"
                loading="lazy"
              />
            </div>
          ) : (
            <p className="rounded-sm border border-gold-500/16 bg-ink-950/50 px-4 py-3 text-sm leading-6 text-muted">
              The scheduler opens in a new tab. Already booked? You can safely close this window — a
              confirmation will land in your inbox.
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
          >
            Done
          </button>
        </>
      ) : (
        <>
          <p className="text-base leading-7 text-bone">
            We&apos;ll review your details and email you within one business day to schedule your
            lead strategy call.
          </p>
          <p className="rounded-sm border border-gold-500/16 bg-ink-950/50 px-4 py-3 text-sm leading-6 text-muted">
            Keep an eye on your inbox (and spam folder). If you&apos;d like to add anything in the
            meantime, just reply to that email.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 text-sm font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.02]"
          >
            Done
          </button>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small field primitives                                                      */
/* -------------------------------------------------------------------------- */

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
          active
            ? "border-gold-500/60 bg-gold-500/15 text-gold-200"
            : "border-gold-500/20 text-muted"
        }`}
      >
        {done ? "✓" : label === "Your business" ? "1" : "2"}
      </span>
      <span className={`text-xs ${active ? "text-bone" : "text-muted"}`}>{label}</span>
    </span>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200/75"
      >
        {label}
        {required ? <span className="text-gold-400">*</span> : null}
        {hint ? <span className="font-normal normal-case tracking-normal text-muted/70">· {hint}</span> : null}
      </label>
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ describedBy?: string }>, {
            describedBy: errorId,
          })
        : children}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-red-300">
      {children}
    </p>
  );
}

// Shared focus helpers for the dialog's focus trap / managed focus.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

function getFocusable(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.tabIndex < 0) return false; // skips the off-screen honeypot (tabIndex -1)
    if (el.closest('[aria-hidden="true"]')) return false;
    return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
  });
}

function focusFirstField(panel: HTMLElement | null) {
  const focusable = getFocusable(panel);
  const firstField = focusable.find((el) =>
    ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName),
  );
  (firstField ?? focusable[0] ?? panel)?.focus();
}

const inputBase =
  "w-full rounded-sm border bg-ink-950/60 px-4 py-3 text-sm text-bone placeholder:text-muted/70 outline-none transition-colors focus:border-gold-400/70 focus:ring-1 focus:ring-gold-400/40";

function borderClass(invalid?: boolean) {
  return invalid ? "border-red-400/60" : "border-gold-500/22";
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${inputBase} ${borderClass(invalid)}`}
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${inputBase} resize-none ${borderClass(invalid)}`}
    />
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${inputBase} ${borderClass(invalid)} appearance-none bg-[length:18px] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23E8D9A8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
      }}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-ink-900 text-bone">
          {opt}
        </option>
      ))}
    </select>
  );
}
