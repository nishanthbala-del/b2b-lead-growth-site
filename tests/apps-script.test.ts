// The canonical Apps Script embedded in SETUP.md is not code this repo runs or type-checks —
// it lives entirely inside Google's Apps Script editor, external to both this repo and the
// operating-system repo. That gap is exactly how it drifted before: HEADERS fell one generation
// behind CSV_COLUMNS in app/api/lead/route.ts TWICE (14 columns silently dropped before
// 2026-09-05, then 8 more — including D-027's preparedOpportunities and all five attribution
// columns — dropped again until 2026-09-18), and a conversion-event POST had no `action` branch
// at all, so it fell through to the 'submit' handler and appended a near-empty row to the LEADS
// sheet on every single event. syncHeader() only ever APPENDS what HEADERS lists, with no error
// for a name it does not carry, so both bugs were permanently silent until someone opened the
// Sheet and counted columns by eye.
//
// These are source scans of SETUP.md's fenced script, the same idiom tests/events.test.ts and
// tests/conversion.test.ts already use for prose/config that isn't imported code. They fail the
// moment either file changes without the other, instead of waiting for a human to notice a
// column is missing three weeks later.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");

// Deliberately matches only within a single line (`[^"\n]` / `[^'\n]`): both source files put
// one array element per line, and several of the surrounding comments contain a bare apostrophe
// (e.g. "an old heading") — an earlier version of this used a quote class that could span
// newlines, so that lone apostrophe paired with one many lines later and swallowed a whole
// multi-line comment PLUS the real array entries inside it into one bogus "match", which never
// failed loudly — it just silently produced the wrong array.
function extractQuotedArray(src: string, marker: string, quote: '"' | "'"): string[] {
  const start = src.indexOf(marker);
  assert.ok(start !== -1, `could not find ${JSON.stringify(marker)}`);
  const close = src.indexOf("]", start);
  assert.ok(close !== -1, `no closing ] for ${JSON.stringify(marker)}`);
  const body = src.slice(start, close);
  const re = quote === '"' ? /"([^"\n]*)"/g : /'([^'\n]*)'/g;
  return [...body.matchAll(re)].map((m) => m[1]);
}

function appsScriptSource(): string {
  const setup = read("SETUP.md");
  const blocks = [...setup.matchAll(/```javascript\n([\s\S]*?)\n```/g)];
  assert.equal(blocks.length, 1, "expected exactly one fenced javascript block in SETUP.md");
  return blocks[0][1];
}

describe("SETUP.md's Apps Script stays in lockstep with the code that calls it", () => {
  test("HEADERS is exactly CSV_COLUMNS (route.ts) plus the script-only bookingOpenedAt", () => {
    const routeColumns = extractQuotedArray(read("app/api/lead/route.ts"), "const CSV_COLUMNS = [", '"');
    const scriptHeaders = extractQuotedArray(appsScriptSource(), "const HEADERS = [", "'");
    assert.ok(routeColumns.length > 30, `sanity: expected >30 CSV_COLUMNS, got ${routeColumns.length}`);
    assert.deepEqual(
      scriptHeaders,
      [...routeColumns, "bookingOpenedAt"],
      "HEADERS drifted from CSV_COLUMNS again — every name in CSV_COLUMNS must appear in " +
        "HEADERS, in the same order, with bookingOpenedAt appended last. syncHeader() only " +
        "appends what HEADERS lists, so a missing name here is a column no row ever gets.",
    );
  });

  test("an 'event' POST is handled before the Leads sheet is even opened, in its own tab", () => {
    const src = appsScriptSource();
    const eventBranch = src.indexOf("body.action === 'event'");
    const leadsSheetOpen = src.indexOf("getSheet(SHEET_NAME, HEADERS)");
    assert.ok(eventBranch !== -1, "no action === 'event' branch — an event POST falls through to 'submit'");
    assert.ok(leadsSheetOpen !== -1);
    assert.ok(
      eventBranch < leadsSheetOpen,
      "the event branch must return before the Leads sheet is opened, or a submit-shaped " +
        "fallthrough can still append an event to Leads",
    );
    // The branch itself must write to its own sheet, never SHEET_NAME ('Leads').
    const branchSlice = src.slice(eventBranch, src.indexOf("return json({ ok: true });", eventBranch));
    assert.match(branchSlice, /EVENTS_SHEET_NAME/);
    assert.doesNotMatch(branchSlice, /\bSHEET_NAME\b/);
  });

  test("EVENT_HEADERS covers every SiteEvent field (lib/events.ts) plus the server's own 'at'", () => {
    const types = read("lib/events.ts");
    const typeBlock = types.slice(types.indexOf("export type SiteEvent = {"), types.indexOf("\n};", types.indexOf("export type SiteEvent = {")));
    const fields = [...typeBlock.matchAll(/^\s*(\w+):\s*[^;]+;/gm)].map((m) => m[1]);
    assert.ok(fields.length >= 10, `sanity: expected >=10 SiteEvent fields, got ${fields.length}`);
    const eventHeaders = extractQuotedArray(appsScriptSource(), "const EVENT_HEADERS = [", "'");
    for (const f of fields) {
      assert.ok(eventHeaders.includes(f), `EVENT_HEADERS is missing SiteEvent field ${JSON.stringify(f)}`);
    }
    assert.ok(eventHeaders.includes("at"), "EVENT_HEADERS must carry the server-stamped 'at' timestamp");
  });

  test("the secret check still fails CLOSED (an empty SECRET rejects, never accepts)", () => {
    assert.match(appsScriptSource(), /if\s*\(!SECRET\s*\|\|\s*body\.secret\s*!==\s*SECRET\)/);
  });

  test("the export action stays behind the same secret and is read-only (never mutates a row)", () => {
    const src = appsScriptSource();
    const exportBranch = src.slice(
      src.indexOf("body.action === 'export'"),
      src.indexOf("\n      }", src.indexOf("body.action === 'export'")),
    );
    assert.match(exportBranch, /exportRows\(/);
    assert.doesNotMatch(exportBranch, /setValues|appendRow|deleteRow/);
  });
});
