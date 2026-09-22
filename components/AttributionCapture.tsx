"use client";

import { useEffect } from "react";
import { ATTRIBUTION_STORAGE_KEY, attributionFromVisit } from "@/lib/attribution";
import { MOBILE_MAX_WIDTH_PX } from "@/lib/events";
import { trackEvent } from "@/lib/track";

// Records where THIS VISIT came from, once, on the first page it opens — see
// lib/attribution.ts for exactly what is kept and why. Mounted in the root layout because a
// visitor who arrives on a guide from search and clicks through to the fit check should be
// attributed to the search, not to "/start".
//
// First write wins: a later page never overwrites the landing page's values. Every storage
// call is wrapped, because sessionStorage throws in some private-browsing modes and a
// marketing site must never break over a measurement. Renders nothing.
//
// THE SAME MOMENT IS THE VISIT (2026-09-21). The first write of the attribution is, by
// construction, the first page of this tab's visit, so that is where `visit_start` fires — once,
// after the values it carries are stored (lib/track.ts reads them back). A later page finds the
// key already set and returns before reaching it, so one visit is one event however many pages it
// opens. Without storage there is no first write and no event: counting a visit we cannot
// de-duplicate would count every page as one.
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
      const screen = window.innerWidth <= MOBILE_MAX_WIDTH_PX ? "mobile" : "desktop";
      const record = () => trackEvent("visit_start", { placement: screen });
      // A page the browser prerenders speculatively has not been seen by anyone yet; it is a
      // visit only once it is actually shown.
      const doc = document as Document & { prerendering?: boolean };
      if (doc.prerendering) doc.addEventListener("prerenderingchange", record, { once: true });
      else record();
    } catch {
      // No storage, no attribution. The visit still works.
    }
  }, []);
  return null;
}
