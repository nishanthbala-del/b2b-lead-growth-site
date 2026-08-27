"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import QualificationFlow from "./qualification/QualificationFlow";
import { getFocusable } from "./qualification/fields";
import { pauseSmoothScroll } from "@/lib/smooth-scroll";

/* -------------------------------------------------------------------------- */
/*  Context: any CTA can call openIntake() to launch the qualification flow     */
/* -------------------------------------------------------------------------- */
//
// This file is the modal SHELL only — dialog semantics, scroll lock, focus trap.
// The questions, the fit rules and the result live in components/qualification/,
// shared verbatim with the standalone /start page. Two hosts, one flow: a copy of
// the form that drifts is a second, unpublished qualification standard.
//
// NOTE: scripts/check_cross_repo.py in the operating-system repo scans this file
// and lib/site.ts for the canonical booking link. It lives in lib/site.ts and the
// flow imports it from there; the check is deliberately file-agnostic about which
// of the two surfaces carries it.

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
      <IntakeModal open={open} initialTier={packageName} onClose={() => setOpen(false)} />
    </IntakeContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  The modal                                                                   */
/* -------------------------------------------------------------------------- */

function IntakeModal({
  open,
  initialTier,
  onClose,
}: {
  open: boolean;
  initialTier?: string;
  onClose: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [dirty, setDirty] = useState(false);
  const [onResult, setOnResult] = useState(false);
  // Remounts the flow on every open so a previous submission's answers can never be
  // shown to the next visitor on a shared office machine.
  const [instance, setInstance] = useState(0);

  useEffect(() => {
    if (!open) return;
    setInstance((n) => n + 1);
    setDirty(false);
    setOnResult(false);
  }, [open]);

  // Lock background scroll while open. `overflow: hidden` alone is not enough —
  // Lenis drives window scroll from its own wheel/touch listeners and ignores it —
  // so the smooth-scroll instance is parked for the duration too.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseSmoothScroll(true);
    return () => {
      document.body.style.overflow = prev;
      pauseSmoothScroll(false);
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

  const handleStepChange = useCallback((_step: number, isResult: boolean) => {
    setOnResult(isResult);
  }, []);

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
          // A backdrop click closes an UNTOUCHED form only. Once anything has been
          // answered — and on mobile the backdrop is most of the screen — a stray tap
          // would silently destroy the whole submission, so it is ignored; Esc and the
          // × button remain the deliberate ways out.
          onClick={() => {
            if (!dirty) onClose();
          }}
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

            {/* Sticky: the flow is four steps tall, and on a laptop the panel scrolls
                inside the overlay. With a static header the title, the step indicator and
                the × Close button all scrolled off the top, leaving a mid-form visitor
                with no visible way out and no idea which step they were on. */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-lg border-b border-gold-500/14 bg-ink-900/95 px-6 py-5 backdrop-blur sm:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                  {onResult ? "Your result" : "Fit check"}
                </p>
                <h2 id="intake-title" className="mt-1 font-display text-2xl text-bone sm:text-3xl">
                  {onResult ? "Here's where you stand." : "Let's see if this is for you."}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold-500/30 text-gold-200 transition-colors hover:bg-gold-500/10"
              >
                <span aria-hidden="true" className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="px-6 sm:px-8">
              <QualificationFlow
                key={instance}
                variant="modal"
                initialTier={initialTier}
                onClose={onClose}
                onStepChange={handleStepChange}
                onDirtyChange={setDirty}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
