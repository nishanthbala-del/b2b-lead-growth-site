"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/track";

/** A link that records ONE first-party `cta_click` (lib/events.ts) and then navigates exactly
 *  as a plain link would. If the script never loads it is still a working link. */
export default function TrackedLink({
  href,
  placement,
  className,
  children,
}: {
  href: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent("cta_click", { placement })}>
      {children}
    </Link>
  );
}
