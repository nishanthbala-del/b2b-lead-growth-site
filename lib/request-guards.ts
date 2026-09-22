// Two cheap checks for the site's own POST endpoints. Neither is a security boundary — neither
// endpoint writes authenticated state — they keep what reaches the owner's Sheet readable.
//
// Nothing here imports Next: the routes pass their request headers in, and tests/events.test.ts
// calls these directly with plain objects.

type HeaderReader = { get(name: string): string | null };

/**
 * Reject obvious cross-site posts. `Sec-Fetch-Site` is set by the browser and cannot be forged
 * from page JavaScript, so it is the reliable signal; the Origin check is the fallback for the
 * handful of clients that don't send it. It cheaply blocks the "embed a form on another site and
 * post at them" pattern that CORS never prevents. A request with neither header (curl, an uptime
 * check) is not cross-site by this test — each route decides what else to do with it.
 *
 * Moved here unchanged from app/api/lead/route.ts on 2026-09-21 so /api/event applies the same
 * rule instead of a second copy of it.
 */
export function isCrossSitePost(headers: HeaderReader): boolean {
  const site = headers.get("sec-fetch-site");
  if (site) return site === "cross-site";
  const origin = headers.get("origin");
  if (!origin) return false; // non-browser client (curl, uptime check) — allowed
  try {
    return new URL(origin).host !== headers.get("host");
  } catch {
    return true;
  }
}

// WHY /api/event DISCARDS CRAWLERS. Googlebot, Bingbot and several AI crawlers render pages with
// JavaScript, and a rendering pass that sends the site's own beacon would be counted as a visit.
// On a site whose whole question is "does anyone arrive, and from where?", a crawler counted as a
// visitor is a false answer. They are matched on how they describe themselves — the only thing a
// crawler reliably says about itself — and the description is read for this one decision and
// never stored.
//
// "bot" counts only when it ends a product token (Googlebot/2.1, AdsBot-Google, GPTBot/1.1), so a
// phone whose model name merely contains the letters (an Android "CUBOT X30") is still a person.
const AUTOMATED_CLIENT =
  /bot(?:[/\-;)]|$)|crawl|spider|slurp|headless|lighthouse|pagespeed|inspectiontool|mediapartners|apis-google|feedfetcher|preview|externalhit|externalagent|phantomjs|selenium|puppeteer|playwright|curl\/|wget\/|python|httpclient|okhttp|go-http-client|java\/|node-fetch|axios\/|undici/i;

/** True for a client that is not a person's browser: no self-description at all, or one that
 *  names a crawler, a headless browser, a page-speed tester or an HTTP library. */
export function isAutomatedClient(userAgent: string | null): boolean {
  const ua = (userAgent ?? "").trim();
  if (!ua) return true;
  return AUTOMATED_CLIENT.test(ua);
}
