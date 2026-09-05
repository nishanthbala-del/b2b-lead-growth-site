"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Option } from "@/lib/qualification";

/* -------------------------------------------------------------------------- */
/*  Form primitives shared by the qualification flow                            */
/* -------------------------------------------------------------------------- */
// The controls the fit check is built from. They live here rather than inline so the
// accessibility behaviour (labelling, error association, focus management) is defined
// once instead of per field.

export function Field({
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
        className="mb-2 flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
      >
        {label}
        {required ? <span className="text-accent">*</span> : null}
        {hint ? (
          <span className="font-normal normal-case tracking-normal text-subtle">· {hint}</span>
        ) : null}
      </label>
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ describedBy?: string; required?: boolean }>, {
            describedBy: errorId,
            // The visual asterisk in the label is decorative; this is what actually
            // reaches assistive tech.
            required,
          })
        : children}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  // role="alert" so the message is announced the moment validation inserts it —
  // the aria-describedby link alone only helps once focus reaches the control.
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-700">
      {children}
    </p>
  );
}

// `text-base` (16px) on small screens is deliberate: iOS Safari zooms the whole
// page whenever a focused input's font-size is below 16px, and it never zooms back
// out — which on a phone leaves the rest of the form scrolled off-screen mid-way
// through filling it in. Back to 14px from `sm:` up, where no such rule applies.
const inputBase =
  "w-full rounded-sm border bg-surface px-4 py-3 text-base text-ink placeholder:text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm";

// `control`, NOT `line`. An interactive boundary has to clear 3:1 (WCAG 1.4.11);
// `line` is the decorative hairline between blocks and measures 1.31:1 against the
// page. The previous dark build had exactly this bug in its own palette — text
// inputs with a 1.02:1 fill and a 1.45:1 boundary, so an empty field on the site's
// ONLY conversion form was very nearly invisible — and the mechanical re-light would
// have carried it straight over, because a field and a divider had been sharing one
// colour. That is the whole reason `control` exists as its own token.
//
// The invalid state stays a distinct hue rather than a darker bronze: an error that
// is a shade of the brand accent is not an error anyone reads as one.
function borderClass(invalid?: boolean) {
  return invalid ? "border-red-500" : "border-control";
}

export function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  invalid,
  describedBy,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "url" | "tel";
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      className={`${inputBase} ${borderClass(invalid)}`}
    />
  );
}

export function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  invalid,
  describedBy,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
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
      aria-required={required || undefined}
      className={`${inputBase} resize-none ${borderClass(invalid)}`}
    />
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  describedBy,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly Option[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
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
        <option key={opt.value} value={opt.value} className="bg-surface text-ink">
          {opt.hint ? `${opt.label} — ${opt.hint}` : opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * A single-choice question rendered as tappable cards.
 *
 * Real `<input type="radio">` elements inside a `<fieldset>`, visually hidden but
 * present: arrow-key navigation, the browser's own required/validity handling, and
 * label-click targeting all come free, and the group is announced with its question
 * rather than as a row of unlabelled buttons. A div-and-onClick version of this looks
 * identical and is unusable with a keyboard.
 *
 * Cards rather than a <select> because these are the questions that decide the
 * outcome: on a phone, a native select hides every option but one behind a tap, and
 * an option nobody reads is an answer nobody chose deliberately.
 */
export function OptionCards({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
  columns = 1,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: readonly Option[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  columns?: 1 | 2;
}) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined}>
      <legend className="mb-3 flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {legend}
        <span className="text-accent">*</span>
        {hint ? (
          <span className="font-normal normal-case tracking-normal text-subtle">· {hint}</span>
        ) : null}
      </legend>
      <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 transition-colors ${
                selected
                  ? "border-accent/45 bg-accent-soft"
                  : error
                    ? "border-red-500 hover:border-accent hover:bg-accent-soft"
                    : "border-control hover:border-accent hover:bg-accent-soft"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {/* Mirrors the radio's state visually. aria-hidden because the real
                  input above already carries it. */}
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-accent bg-accent" : "border-accent/45"
                }`}
              >
                {selected ? <span className="h-1.5 w-1.5 rounded-full bg-paper" /> : null}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-sm leading-6 ${selected ? "text-ink" : "text-subtle"}`}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="mt-0.5 block text-xs leading-5 text-subtle">{opt.hint}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*  Focus helpers                                                               */
/* -------------------------------------------------------------------------- */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

export function getFocusable(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.tabIndex < 0) return false; // skips the off-screen honeypot (tabIndex -1)
    if (el.closest('[aria-hidden="true"]')) return false;
    // `sr-only` radios have no layout box but must stay reachable, so a
    // size-based visibility check on its own would drop the whole group.
    if (el instanceof HTMLInputElement && el.type === "radio") return true;
    return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
  });
}

export function focusFirstField(panel: HTMLElement | null) {
  const focusable = getFocusable(panel);
  const firstField = focusable.find((el) => ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName));
  (firstField ?? focusable[0] ?? panel)?.focus();
}

// Send focus to the first control that failed validation, so the error next to it
// is read out and the caret lands where the fix has to happen. A radio group carries
// aria-invalid on the <fieldset>, which is not focusable — so fall through to the
// first radio inside it.
export function focusFirstInvalid(panel: HTMLElement | null) {
  const invalid = panel?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!invalid) return;
  if (invalid.tagName === "FIELDSET") {
    invalid.querySelector<HTMLInputElement>("input")?.focus();
    invalid.scrollIntoView({ block: "center", behavior: "smooth" });
    return;
  }
  invalid.focus();
}
