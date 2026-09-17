"use client";

import { useEffect } from "react";
import { ATTRIBUTION_STORAGE_KEY, attributionFromVisit } from "@/lib/attribution";

// Records where THIS VISIT came from, once, on the first page it opens — see
// lib/attribution.ts for exactly what is kept and why. Mounted in the root layout because a
// visitor who arrives on a guide from search and clicks through to the fit check should be
// attributed to the search, not to "/start".
//
// First write wins: a later page never overwrites the landing page's values. Every storage
// call is wrapped, because sessionStorage throws in some private-browsing modes and a
// marketing site must never break over a measurement. Renders nothing.
export default function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;
      const attribution = attributionFromVisit({
        search: window.location.search,
        pathname: window.location.pathname,
        referrer: document.referrer,
        ownHost: window.location.host,
      });
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // No storage, no attribution. The visit still works.
    }
  }, []);
  return null;
}
