// The first-party conversion events (lib/events.ts), held to what /privacy says about them.
//
// The vocabulary is CLOSED: an event is one of seven names, every string in it is drawn from a
// closed character set, and there is no field a name, an email, an IP address or a user agent
// could travel in. That is the whole privacy claim, so it is tested as a property of the
// sanitizer rather than trusted to the callers. The route tests are source scans, because the
// Next request objects are not worth standing up for a 405.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { EVENT_LABELS, EVENT_NAMES, VISIT_STORAGE_KEY, sanitizeEvent } from "../lib/events.ts";
import { plans } from "../lib/content.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");

describe("the vocabulary is closed", () => {
  test("every event has a plain-English label, and only the seven exist", () => {
    assert.deepEqual([...EVENT_NAMES], ["cta_click", "form_start", "form_step", "form_abandon", "form_complete", "fit_outcome", "booking_opened"]);
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
