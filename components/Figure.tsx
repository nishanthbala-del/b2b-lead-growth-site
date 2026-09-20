import type { ReactNode } from "react";

/**
 * An original reference diagram, rendered as a real file with its own URL.
 *
 * WHY A FILE AND NOT INLINE SVG. A diagram that explains the method is a reference
 * asset: it should be fetchable, cacheable and citable on its own, not buried in a
 * page's markup. `/diagrams/<descriptive-name>.svg` is the whole point — the filename
 * says what the picture is, which is the only thing an image crawler reads before it
 * decides whether to look.
 *
 * WHY PLAIN <img> AND NOT next/image. Next's optimiser does nothing for SVG, and
 * routing SVG through it requires `images.dangerouslyAllowSVG`, which would let ANY
 * future remote SVG through the optimiser. An <img> referencing a same-origin file is
 * covered by the existing `img-src 'self'` CSP, and a browser will not execute script
 * inside an SVG loaded this way. That is a strictly safer arrangement, so the lint rule
 * below is disabled deliberately rather than worked around.
 *
 * ACCESSIBILITY. Three separate jobs, none of which substitutes for another:
 *   - `alt` is the full description, because an <img> hides the SVG's own <title>/<desc>
 *     from assistive technology. It is long on purpose: the diagram carries real content.
 *   - `<figcaption>` is the VISIBLE explanation, for every reader — the diagram is not
 *     allowed to be the only place a fact appears.
 *   - the scroll region mirrors GuideTable: keyboard-focusable, labelled, and with a
 *     minimum width so the diagram never shrinks to illegibility on a phone.
 */
export default function Figure({
  src,
  alt,
  label,
  children,
  width,
  height,
}: {
  /** Path under /public, e.g. "/diagrams/name.svg". */
  src: string;
  /** The complete description. Assistive technology gets this and nothing else. */
  alt: string;
  /** Short name for the scrollable region, e.g. "Diagram: where each plan hands over". */
  label: string;
  /** The visible caption. Required — a diagram never carries a fact on its own. */
  children: ReactNode;
  /** The SVG's own viewBox size. Required: without it the browser reserves no space, so the
   *  diagram sits at zero height until it loads and the article moves under the reader —
   *  measured that way on 2026-09-20. `tests/reference-assets.test.ts` holds these equal to
   *  the file's actual viewBox, because a declared size that drifts is the same bug. */
  width: number;
  height: number;
}) {
  return (
    <figure className="mt-6">
      <div
        className="overflow-x-auto rounded-lg border border-line bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- see the note above: SVG gains nothing from next/image and would require dangerouslyAllowSVG. */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full min-w-[620px]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-subtle">{children}</figcaption>
    </figure>
  );
}
