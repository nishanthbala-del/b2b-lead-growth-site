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
