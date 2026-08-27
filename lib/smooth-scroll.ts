// A tiny bridge between the landing page's Lenis smooth-scroll instance and the
// intake modal, which lives in a different component tree.
//
// Why this is needed: Lenis binds wheel/touch listeners on the document and drives
// window scroll itself. The modal's `document.body.style.overflow = "hidden"` lock
// does not stop it — so with the dialog open, wheeling over the dialog scrolls the
// page behind it, and on a short viewport the dialog's own content never scrolls,
// leaving the submit button unreachable.
//
// The bridge lives in its own module (rather than being exported from the landing
// page) so the modal does not have to import the page that renders it.

let pauseHandler: ((paused: boolean) => void) | null = null;

/** Called by the smooth-scroll hook to publish its stop/start controls. */
export function registerSmoothScroll(handler: ((paused: boolean) => void) | null): void {
  pauseHandler = handler;
}

/** Called by the modal. No-ops when smooth scrolling isn't running at all. */
export function pauseSmoothScroll(paused: boolean): void {
  pauseHandler?.(paused);
}

/* -------------------------------------------------------------------------- */
/*  Jumping to an element while Lenis owns the scroll position                 */
/* -------------------------------------------------------------------------- */
//
// Lenis drives `window.scroll` from its own rAF loop, so an external
// `scrollIntoView` is overwritten on the very next frame — the page visibly does
// nothing. Deep links were landing every visitor at the top of the page because of
// this: `/#pricing` from the 404 page, from a guide, or from an outbound email put
// them on the hero with no indication anything had been missed.
//
// The second trap is `behavior: "auto"`. It does NOT mean "jump": per spec it means
// "use the CSS `scroll-behavior`", and globals.css sets `scroll-behavior: smooth` on
// <html>. Only `"instant"` actually forces an immediate jump.

let scrollToHandler: ((target: HTMLElement) => void) | null = null;

/** Published by the smooth-scroll hook so jumps go through Lenis when it is running. */
export function registerScrollTo(handler: ((target: HTMLElement) => void) | null): void {
  scrollToHandler = handler;
}

/**
 * Jump to an element immediately, whether or not smooth scrolling is active.
 * Falls back to the native call on touch devices and under reduced motion, where
 * Lenis deliberately never starts.
 */
export function scrollToInstant(target: HTMLElement): void {
  if (scrollToHandler) scrollToHandler(target);
  else target.scrollIntoView({ behavior: "instant", block: "start" });
}
