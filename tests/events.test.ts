// The first-party conversion events (lib/events.ts), held to what /privacy says about them.
//
// The vocabulary is CLOSED: an event is one of eight names, every string in it is drawn from a
// closed character set, and there is no field a name, an email, an IP address or a user agent
// could travel in. That is the whole privacy claim, so it is tested as a property of the
// sanitizer rather than trusted to the callers. The route tests are source scans, because the
// Next request objects are not worth standing up for a 405.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import {
  EVENT_LABELS,
  EVENT_NAMES,
  MOBILE_MAX_WIDTH_PX,
  VISIT_SCREEN_CLASSES,
  VISIT_STORAGE_KEY,
  sanitizeEvent,
} from "../lib/events.ts";
import { isAutomatedClient, isCrossSitePost } from "../lib/request-guards.ts";
import { legalRoutes } from "../lib/pages.ts";
import { privacyLastUpdatedISO, termsLastUpdatedISO } from "../lib/site.ts";
import { plans } from "../lib/content.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");

describe("the vocabulary is closed", () => {
  test("every event has a plain-English label, and only the eight exist", () => {
    assert.deepEqual([...EVENT_NAMES], ["visit_start", "cta_click", "form_start", "form_step", "form_abandon", "form_complete", "fit_outcome", "booking_opened"]);
    for (const name of EVENT_NAMES) assert.ok(EVENT_LABELS[name].length > 20, name);
    assert.equal(Object.keys(EVENT_LABELS).length, EVENT_NAMES.length);
  });

  test("an unknown name, a non-object, or a name from a different casing is not an event", () => {
    assert.equal(sanitizeEvent(null), null);
    assert.equal(sanitizeEvent("cta_click"), null);
    assert.equal(sanitizeEvent({ name: "page_view" }), null);
    assert.equal(sanitizeEvent({ name: "CTA_CLICK" }), null);
    assert.equal(sanitizeEvent({}), null);
  });

  test("a valid event round-trips, and nothing outside the closed sets survives", () => {
    const e = sanitizeEvent({
      name: "cta_click",
      path: "/pricing",
      placement: "plans",
      step: 0,
      visitId: "a1b2c3d4e5f6g7h8",
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "sept",
      landingPath: "/how-it-works",
      referrerHost: "duckduckgo.com",
    });
    assert.ok(e);
    assert.equal(e.name, "cta_click");
    assert.equal(e.path, "/pricing");
    assert.equal(e.placement, "plans");
    assert.equal(e.visitId, "a1b2c3d4e5f6g7h8");
    assert.equal(e.referrerHost, "duckduckgo.com");
    assert.equal(e.landingPath, "/how-it-works");
  });

  test("free text, query strings, formulas and markup are dropped, never cleaned", () => {
    const e = sanitizeEvent({
      name: "form_abandon",
      path: "/start?email=jane@example.com",
      placement: "=IMPORTXML(\"https://evil.example\",\"//a\")",
      step: "3",
      outcome: "<script>alert(1)</script>",
      plan: "Premium Appointment Engine",
      visitId: "jane@example.com",
      utmSource: "a b c",
      referrerHost: "https://evil.example/path",
      landingPath: "javascript:alert(1)",
      email: "jane@example.com",
      name2: "Jane",
    });
    assert.ok(e);
    assert.equal(e.path, "/", "a path with a query string is replaced, not trimmed");
    assert.equal(e.placement, "");
    assert.equal(e.step, 3);
    assert.equal(e.outcome, "");
    assert.equal(e.plan, "");
    assert.equal(e.visitId, "");
    assert.equal(e.utmSource, "");
    assert.equal(e.referrerHost, "");
    assert.equal(e.landingPath, "");
    // There is no field an email could land in.
    assert.ok(!("email" in e) && !("name2" in e));
    assert.doesNotMatch(JSON.stringify(e), /jane|example\.com|alert/);
  });

  test("the outcome and plan sets are exactly the fit check's and the price ladder's", () => {
    for (const o of ["strong", "explore", "not_yet"]) assert.equal(sanitizeEvent({ name: "fit_outcome", outcome: o })!.outcome, o);
    assert.equal(sanitizeEvent({ name: "fit_outcome", outcome: "maybe" })!.outcome, "");
    for (const p of plans) assert.equal(sanitizeEvent({ name: "fit_outcome", plan: p.name })!.plan, p.name);
  });

  test("a step outside 0-9 reads as 0", () => {
    assert.equal(sanitizeEvent({ name: "form_step", step: 12 })!.step, 0);
    assert.equal(sanitizeEvent({ name: "form_step", step: -1 })!.step, 0);
    assert.equal(sanitizeEvent({ name: "form_step", step: 2.5 })!.step, 0);
  });
});

describe("the routes and the callers", () => {
  test("/api/event accepts only POST, and records through the one server function", () => {
    const src = stripComments(read("app/api/event/route.ts"));
    assert.match(src, /export async function GET\(\)[\s\S]{0,120}status: 405/);
    assert.match(src, /recordEvent\(/);
    assert.doesNotMatch(src, /console\.log/, "the route must not log on its own — lib/events-server.ts is the one writer");
  });

  test("the server records the fit outcome and the scheduler event itself, without a lead id", () => {
    const src = stripComments(read("app/api/lead/route.ts"));
    const fit = src.match(/recordEvent\(\{\s*name: "fit_outcome"[\s\S]*?\}\)/);
    assert.ok(fit, "the submit path records fit_outcome");
    assert.doesNotMatch(fit![0], /\bid\b|email|name: body/, "the fit_outcome event must carry no lead identity");
    assert.match(src, /recordEvent\(\{ name: "booking_opened"/);
  });

  test("the event log never receives a name, an email, an IP or a user agent", () => {
    const src = stripComments(read("lib/events-server.ts"));
    assert.doesNotMatch(src, /user-agent|x-forwarded-for|req\.headers|\.ip\b/i);
    const types = stripComments(read("lib/events.ts"));
    assert.doesNotMatch(types.slice(types.indexOf("export type SiteEvent")), /email|ip:|userAgent/i);
  });

  test("the browser helper is fire-and-forget: it cannot throw and it survives navigation", () => {
    const src = stripComments(read("lib/track.ts"));
    assert.match(src, /sendBeacon/);
    assert.match(src, /keepalive: true/);
    assert.match(src, /try \{[\s\S]*\} catch \{/);
    assert.match(src, /VISIT_STORAGE_KEY/);
    assert.match(VISIT_STORAGE_KEY, /^blg_visit_v\d+$/);
    assert.match(src, /sessionStorage/, "the visit id lives in session storage, never a cookie");
    assert.doesNotMatch(src, /document\.cookie|localStorage/);
  });

  test("the fit check fires start, step, complete and abandon, and the CTA fires cta_click", () => {
    const flow = stripComments(read("components/qualification/QualificationFlow.tsx"));
    for (const name of ["form_start", "form_step", "form_complete", "form_abandon"]) {
      assert.match(flow, new RegExp(`trackEvent\\("${name}"`), name);
    }
    assert.doesNotMatch(flow, /trackEvent\("booking_opened"/, "the scheduler event is recorded by the server, not fired twice");
    assert.match(stripComments(read("components/TrackedLink.tsx")), /trackEvent\("cta_click", \{ placement \}\)/);
  });

  test("/privacy publishes the list from the code, and the CSP lets the beacon reach the site", () => {
    const privacy = read("app/privacy/page.tsx");
    assert.match(privacy, /EVENT_NAMES\.map/);
    assert.match(privacy, /EVENT_LABELS\[name\]/);
    assert.match(read("next.config.ts"), /connect-src 'self'/);
    assert.match(read("SETUP.md"), /EVENTS_WEBHOOK_URL/);
  });
});

// THE DENOMINATOR (2026-09-21). Every event above happens after a visitor has chosen to act, so
// the Events tab could count what converted but never out of how many. `visit_start` is that
// denominator, and it is only worth having if it counts people: once per visit, never a crawler.
describe("visit_start: one per visit, and only people", () => {
  test("it carries the screen class and the visit-origin fields, through the same sanitizer", () => {
    const e = sanitizeEvent({
      name: "visit_start",
      path: "/commercial-hvac-lead-generation",
      placement: "mobile",
      visitId: "a1b2c3d4e5f6g7h8",
      landingPath: "/commercial-hvac-lead-generation",
      referrerHost: "chatgpt.com",
      utmSource: "chatgpt.com",
    });
    assert.ok(e);
    assert.equal(e.name, "visit_start");
    assert.equal(e.placement, "mobile");
    assert.equal(e.referrerHost, "chatgpt.com");
    assert.equal(e.landingPath, "/commercial-hvac-lead-generation");
    assert.deepEqual([...VISIT_SCREEN_CLASSES], ["mobile", "desktop"]);
    // The site's own layout breakpoint (Tailwind md = 768px) decides where "mobile" ends.
    assert.equal(MOBILE_MAX_WIDTH_PX, 767);
  });

  test("it fires where the visit's attribution is FIRST stored — after the guard, after the write", () => {
    const src = stripComments(read("components/AttributionCapture.tsx"));
    const guard = src.indexOf("if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;");
    const write = src.indexOf("window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY");
    const fire = src.indexOf('trackEvent("visit_start"');
    assert.ok(guard > -1 && write > guard, "the first-write guard precedes the write");
    assert.ok(fire > write, "visit_start fires after the attribution it carries is stored");
    assert.equal(src.split('trackEvent("visit_start"').length - 1, 1, "exactly one call site");
    assert.match(src, /placement: screen/);
    assert.match(src, /MOBILE_MAX_WIDTH_PX/);
    // A speculative prerender is not a visit until it is shown.
    assert.match(src, /prerenderingchange/);
    // Nowhere else fires it: a second call site would count one visit twice.
    for (const rel of ["components/TrackedLink.tsx", "components/qualification/QualificationFlow.tsx", "lib/track.ts"]) {
      assert.doesNotMatch(stripComments(read(rel)), /visit_start/, rel);
    }
  });

  test("crawlers that run the page's script are recognised by how they describe themselves", () => {
    const automated = [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
      "Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
      "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "curl/8.7.1",
      "python-requests/2.31.0",
      "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
      "",
    ];
    for (const ua of automated) assert.equal(isAutomatedClient(ua), true, ua || "(empty)");
    assert.equal(isAutomatedClient(null), true, "no self-description at all");
  });

  test("a person's browser is never mistaken for one — including a phone whose name contains 'bot'", () => {
    const people = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
      "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
    ];
    for (const ua of people) assert.equal(isAutomatedClient(ua), false, ua);
  });

  test("another site cannot post events at us; our own pages and header-less clients are not cross-site", () => {
    const h = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });
    assert.equal(isCrossSitePost(h({ "sec-fetch-site": "cross-site" })), true);
    assert.equal(isCrossSitePost(h({ "sec-fetch-site": "same-origin" })), false);
    assert.equal(isCrossSitePost(h({ origin: "https://evil.example", host: "www.b2bleadgrowth.com" })), true);
    assert.equal(isCrossSitePost(h({ origin: "https://www.b2bleadgrowth.com", host: "www.b2bleadgrowth.com" })), false);
    assert.equal(isCrossSitePost(h({ origin: "not a url", host: "www.b2bleadgrowth.com" })), true);
    assert.equal(isCrossSitePost(h({})), false);
  });

  test("/api/event applies both checks BEFORE recording, and hands recordEvent the body alone", () => {
    const src = stripComments(read("app/api/event/route.ts"));
    const cross = src.indexOf("isCrossSitePost(req.headers)");
    const bot = src.indexOf('isAutomatedClient(req.headers.get("user-agent"))');
    const rec = src.indexOf("recordEvent(");
    assert.ok(cross > -1 && bot > -1 && rec > -1);
    assert.ok(cross < rec && bot < rec, "neither check may run after the event is already recorded");
    assert.match(src, /await recordEvent\(raw\)/, "the user agent never travels into the record");
    // A discarded crawler gets the same answer a recorded event does, so it learns nothing.
    assert.match(src, /isAutomatedClient\(req\.headers\.get\("user-agent"\)\)\) return new Response\(null, \{ status: 204 \}\)/);
    // The fit check submission uses the SAME cross-site rule, not a second copy of it.
    const lead = stripComments(read("app/api/lead/route.ts"));
    assert.match(lead, /import \{ isCrossSitePost \} from "@\/lib\/request-guards"/);
    assert.doesNotMatch(lead, /function isCrossSitePost/);
  });
});

// /privacy is a legal statement about what this code records, so what it says is tested against
// the code — including the sentence that was false before visit_start was added.
describe("/privacy says what the site actually records", () => {
  const flat = (s: string) => s.replace(/&rsquo;/g, "'").replace(/\s+/g, " ");

  test("it no longer claims the visit-origin values are never received without a submission", () => {
    const privacy = flat(read("app/privacy/page.tsx"));
    assert.doesNotMatch(privacy, /never receive them/i);
    assert.doesNotMatch(privacy, /is not sent anywhere on its own/i);
    assert.doesNotMatch(privacy, /Until you submit the fit check these values sit only/i);
    assert.match(privacy, /sends them to our own server, and nowhere else, with each of the events listed below/);
  });

  test("it describes the screen class and the crawler filter, and nothing more about the device", () => {
    const privacy = flat(read("app/privacy/page.tsx"));
    assert.match(privacy, /whether the screen was phone-sized/);
    assert.match(privacy, /Requests from automated crawlers are discarded rather than recorded/);
    assert.match(privacy, /does not store it/);
  });

  test("each legal document carries its own date, so one changing does not re-date the other", () => {
    assert.match(read("app/privacy/page.tsx"), /Last updated: \{privacyLastUpdated\}/);
    assert.match(read("app/terms/page.tsx"), /Last updated: \{termsLastUpdated\}/);
    const byslug = Object.fromEntries(legalRoutes.map((r) => [r.slug, r.dateModified]));
    assert.equal(byslug.privacy, privacyLastUpdatedISO);
    assert.equal(byslug.terms, termsLastUpdatedISO);
    // The privacy change on 2026-09-21 did not touch /terms, so its date must not have moved.
    assert.equal(termsLastUpdatedISO, "2026-09-19");
    assert.ok(privacyLastUpdatedISO >= termsLastUpdatedISO);
  });
});
