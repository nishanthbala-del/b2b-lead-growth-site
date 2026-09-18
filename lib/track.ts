"use client";

// The browser half of lib/events.ts. One function, fire-and-forget, never throws, never blocks
// navigation: measurement that can break a click is worse than no measurement.
import { ATTRIBUTION_STORAGE_KEY, sanitizeAttribution } from "@/lib/attribution";
import { VISIT_STORAGE_KEY, type EventName } from "@/lib/events";

function visitId(): string {
  try {
    const existing = window.sessionStorage.getItem(VISIT_STORAGE_KEY);
    if (existing) return existing;
    const bytes = new Uint8Array(9);
    window.crypto.getRandomValues(bytes);
    const id = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16);
    window.sessionStorage.setItem(VISIT_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function attribution(): Record<string, string> {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function trackEvent(
  name: EventName,
  props: { placement?: string; step?: number; outcome?: string; plan?: string } = {},
): void {
  try {
    const a = attribution();
    const body = JSON.stringify({
      name,
      path: window.location.pathname,
      placement: props.placement ?? "",
      step: props.step ?? 0,
      outcome: props.outcome ?? "",
      plan: props.plan ?? "",
      visitId: visitId(),
      utmSource: a.utmSource ?? "",
      utmMedium: a.utmMedium ?? "",
      utmCampaign: a.utmCampaign ?? "",
      landingPath: a.landingPath ?? "",
      referrerHost: a.referrerHost ?? "",
    });
    // sendBeacon survives the navigation a CTA click starts; fetch+keepalive is the fallback.
    const blob = new Blob([body], { type: "application/json" });
    if (!(navigator.sendBeacon && navigator.sendBeacon("/api/event", blob))) {
      void fetch("/api/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* measurement never breaks the page */
  }
}
