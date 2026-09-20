// LIVE SEO / GEO INVARIANT AUDIT — run against production, not against the repo.
//
//   node scripts/audit-live.mjs                    # audits https://www.b2bleadgrowth.com
//   node scripts/audit-live.mjs --base https://... # audits a preview deployment
//   node scripts/audit-live.mjs --json             # machine-readable, for a monitor
//
// WHY THIS EXISTS. Every other check in this repo reads FILES. `npm test` proves the source
// says the right thing; tests/seo-signals.test.ts proves the registry, the redirects and the
// copy agree with each other. None of them proves the thing a crawler actually received. A
// canonical can be correct in lib/pages.ts and wrong in the response if a build step, a header,
// a platform rewrite or a stale cache intervenes — and the failure is invisible locally.
//
// So this fetches the deployed pages and asserts the invariants on the RESPONSE. The URL list
// is the live sitemap, so the audit cannot drift from what the site publishes: if a page stops
// being announced, it stops being audited, and check 2 catches the disappearance.
//
// Exit 0 = every invariant holds. Exit 1 = at least one FAIL. Exit 2 = the audit itself could
// not run (network, no sitemap), which is not the same as the site being wrong.

const args = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1] ?? true;
};
const BASE = String(flag("base", "https://www.b2bleadgrowth.com")).replace(/\/$/, "");
const JSON_OUT = args.includes("--json");

const results = [];
const ok = (check, detail) => results.push({ level: "PASS", check, detail });
const bad = (check, detail) => results.push({ level: "FAIL", check, detail });
const note = (check, detail) => results.push({ level: "INFO", check, detail });

async function get(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "b2blg-live-audit" } });
  const body = res.status >= 200 && res.status < 300 ? await res.text() : "";
  return { status: res.status, headers: res.headers, body, location: res.headers.get("location") };
}

// ---------------------------------------------------------------- text extraction
const stripTags = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
const unent = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&hellip;/g, "…");
const visible = (h) => unent(stripTags(h)).replace(/\s+/g, " ").trim();
const one = (h, re) => {
  const m = h.match(re);
  return m ? unent(m[1]).trim() : "";
};
const mainOf = (h) => {
  const m = h.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : "";
};
/** A page's own prose: <main> with the "Keep reading" rail (a <nav>) removed. */
const proseOf = (h) => mainOf(h).replace(/<nav\b[\s\S]*?<\/nav>/gi, " ");

// ---------------------------------------------------------------- 1. the sitemap
const smRes = await get(`${BASE}/sitemap.xml`);
if (smRes.status !== 200) {
  console.error(`CANNOT AUDIT: ${BASE}/sitemap.xml -> ${smRes.status}`);
  process.exit(2);
}
const announcedRaw = [...smRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (announcedRaw.length === 0) {
  console.error("CANNOT AUDIT: sitemap lists no URLs");
  process.exit(2);
}
ok("sitemap.xml", `200, ${announcedRaw.length} URLs announced`);

// THE SITEMAP ANNOUNCES ABSOLUTE URLS ON THE CANONICAL HOST, always — it is generated from
// `siteUrl`, so a preview deployment and a local `next start` both announce
// https://www.b2bleadgrowth.com/... The first version of this script fetched those URLs
// verbatim, which meant `--base http://localhost:3199` parsed the LOCAL sitemap and then
// audited PRODUCTION: a local build with four pages missing their WebPage node reported
// "WebPage + BreadcrumbList on all 21", because it had never looked at the local build. An
// audit that silently reports a different deployment than the one asked for is worse than no
// audit. So the announced URLs are reduced to PATHS here, and every fetch below is BASE + path.
const announcedPaths = announcedRaw.map((u) => {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return u;
  }
});
const CANONICAL_HOST = "https://www.b2bleadgrowth.com";
const auditingCanonical = BASE === CANONICAL_HOST;
const offHost = announcedRaw.filter((u) => !u.startsWith(`${CANONICAL_HOST}/`) && u !== CANONICAL_HOST);
if (offHost.length) {
  bad("sitemap announces the canonical host", `${offHost.length} URL(s) elsewhere: ${offHost.slice(0, 3).join(", ")}`);
} else {
  ok("sitemap announces the canonical host", `all ${announcedRaw.length} on ${CANONICAL_HOST}`);
}
if (!auditingCanonical) note("audit target", `${BASE} (paths taken from the sitemap, fetched from this base)`);

// ---------------------------------------------------------------- 2. fetch every page
const pages = [];
for (const p of announcedPaths) {
  const url = `${BASE}${p === "/" ? "/" : p}`;
  const r = await get(url);
  if (r.status !== 200) {
    bad("announced page answers 200", `${p} -> ${r.status}${r.location ? ` (-> ${r.location})` : ""}`);
    continue;
  }
  pages.push({ url, path: p, html: r.body });
}
if (pages.length === announcedPaths.length) {
  ok("announced pages answer 200", `all ${pages.length}`);
} else {
  note("announced pages answer 200", `${pages.length}/${announcedPaths.length} fetched`);
}

// ---------------------------------------------------------------- 3. per-page invariants
const TITLE_BUDGET = 60;
const DESCRIPTION_BUDGET = 155;
const titles = new Map();
const descs = new Map();
for (const p of pages) {
  const t = one(p.html, /<title>([\s\S]*?)<\/title>/i);
  const d = one(p.html, /<meta name="description" content="([^"]*)"/i);
  const canon = one(p.html, /<link rel="canonical" href="([^"]*)"/i);
  const robots = one(p.html, /<meta name="robots" content="([^"]*)"/i);
  const h1s = [...p.html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];

  if (!t) bad("title present", p.path);
  else if (t.length > TITLE_BUDGET) bad("title <= 60", `${p.path} is ${t.length}: ${t}`);
  if (!d) bad("description present", p.path);
  else if (d.length > DESCRIPTION_BUDGET) bad("description <= 155", `${p.path} is ${d.length}`);
  if (h1s.length !== 1) bad("exactly one H1", `${p.path} has ${h1s.length}`);

  // An announced page that tells crawlers not to index it contradicts its own sitemap entry.
  if (/noindex/i.test(robots)) bad("no accidental noindex", `${p.path} is announced AND noindex`);

  // Self-canonical. The homepage may publish with or without the trailing slash.
  // Always the canonical host: a preview build canonicalising to production is CORRECT.
  const c = p.path === "/" ? CANONICAL_HOST : `${CANONICAL_HOST}${p.path}`;
  const want = [c, `${c}/`, c.replace(/\/$/, "")];
  if (!canon) bad("canonical present", p.path);
  else if (!want.includes(canon)) bad("self-canonical", `${p.path} points at ${canon}`);

  if (t) (titles.get(t) ?? titles.set(t, []).get(t)).push(p.path);
  if (d) (descs.get(d) ?? descs.set(d, []).get(d)).push(p.path);
}
const dupT = [...titles].filter(([, v]) => v.length > 1);
const dupD = [...descs].filter(([, v]) => v.length > 1);
if (dupT.length) {
  bad("no duplicate titles", dupT.map(([t, v]) => `"${t}" on ${v.join(", ")}`).join(" | "));
} else {
  ok("no duplicate titles", `${titles.size} distinct`);
}
if (dupD.length) {
  bad("no duplicate descriptions", dupD.map(([, v]) => v.join(", ")).join(" | "));
} else {
  ok("no duplicate descriptions", `${descs.size} distinct`);
}
ok("title/description budgets", `<= ${TITLE_BUDGET} / <= ${DESCRIPTION_BUDGET} on all ${pages.length}`);
ok("one H1 per page", `all ${pages.length}`);
ok("self-canonical", `all ${pages.length}`);

// ---------------------------------------------------------------- 4. structured data
let ldFail = 0;
for (const p of pages) {
  const blocks = [...p.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const b of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(b[1]);
    } catch (e) {
      bad("JSON-LD parses", `${p.path}: ${String(e).slice(0, 70)}`);
      ldFail++;
      continue;
    }
    for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
      for (const n of item["@graph"] ?? [item]) {
        for (const ty of Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]) types.push(ty);
        if (n["@type"] === "BreadcrumbList") {
          const els = n.itemListElement ?? [];
          const pos = els.map((e) => e.position).join(",");
          if (pos !== els.map((_, i) => i + 1).join(",")) {
            bad("breadcrumb positions are 1..n", `${p.path}: ${pos}`);
            ldFail++;
          }
        }
        if (n["@type"] === "FAQPage") {
          for (const q of n.mainEntity ?? []) {
            if (!q?.acceptedAnswer?.text) {
              bad("every FAQ has an answer", `${p.path}: ${String(q?.name).slice(0, 40)}`);
              ldFail++;
            }
          }
        }
      }
    }
  }
  // Every announced page must be a TYPED document with a place in the site.
  for (const req of ["WebPage", "BreadcrumbList"]) {
    if (!types.includes(req)) {
      bad(`${req} on every announced page`, p.path);
      ldFail++;
    }
  }
}
if (ldFail === 0) ok("structured data", `valid, and WebPage + BreadcrumbList on all ${pages.length}`);

// ---------------------------------------------------------------- 5. legacy positioning
// The business is commercial-only (D-025). These words describe the retired residential model
// and must not appear in the indexable corpus at all.
const RESIDENTIAL = [
  [/\bresidential\b/gi, "residential"],
  [/\bhomeowners?\b/gi, "homeowner"],
  [/\breactivat\w*/gi, "reactivation"],
  [/\bunsold\b/gi, "unsold estimate"],
  [/\blapsed\b/gi, "lapsed plan"],
];
// Retired plan names and the retired price (D-028). Allowed ONLY inside a sentence that says so
// — /definitions publishes a retired-name -> current-name table on purpose, and that table is an
// asset: it is how a model that learned the old names resolves them to the current ones.
const RETIRED = [/\$750/g, /\bLead Engine\b/g, /\bOutreach Engine\b/g, /\bAppointment Engine\b/g,
  /\bManaged Pipeline\b/g, /\bQualified Opportunity Engine\b/g, /\bProspecting Engine\b/g];
const RETIREMENT_MARKER = /retired|discontinued|earlier plan name|no current equivalent|was once|once described|→|->|now buys|replaced/i;

let resHits = 0;
let retHits = 0;
for (const p of pages) {
  const text = visible(p.html);
  for (const [re, label] of RESIDENTIAL) {
    const n = (text.match(re) ?? []).length;
    if (n) {
      bad("no residential positioning", `${p.path}: "${label}" x${n}`);
      resHits += n;
    }
  }
  // Sentence-scoped: a retired name needs a retirement marker beside it.
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    for (const re of RETIRED) {
      if (re.test(sentence) && !RETIREMENT_MARKER.test(sentence)) {
        bad("retired offer named without saying it is retired", `${p.path}: ${sentence.slice(0, 110)}`);
        retHits++;
      }
      re.lastIndex = 0;
    }
  }
}
if (resHits === 0) ok("no residential positioning", `0 hits across ${pages.length} pages`);
if (retHits === 0) ok("retired offers only ever labelled as retired", "no unlabelled occurrence");

// ---------------------------------------------------------------- 6. redirects
// Keep in lockstep with `retiredPaths` in lib/pages.ts (tests/seo-signals.test.ts holds that).
const RETIRED_PATHS = [
  ["/hvac-lead-generation-new-jersey", "/commercial-hvac-lead-generation"],
  ["/shared-vs-exclusive-hvac-leads", "/how-to-choose-a-lead-generation-agency"],
  ["/hvac-lead-generation", "/commercial-hvac-lead-generation"],
];
for (const [from, to] of RETIRED_PATHS) {
  const r = await get(`${BASE}${from}`);
  if (r.status !== 301) {
    bad("retired path 301s", `${from} -> ${r.status}`);
    continue;
  }
  const dest = (r.location ?? "").replace(BASE, "");
  if (dest !== to) {
    bad("retired path lands on its successor", `${from} -> ${dest}, expected ${to}`);
    continue;
  }
  const f = await get(`${BASE}${to}`); // one hop only: the destination must be a 200, not another redirect
  if (f.status === 200) {
    ok("retired path 301s in one hop to a 200", `${from} -> ${to}`);
  } else {
    bad("retired path lands on a 200", `${to} -> ${f.status}`);
  }
  // A retired path must not still be announced.
  if (announcedPaths.includes(from)) bad("retired path is not in the sitemap", from);
}

// ---------------------------------------------------------------- 7. one host
// Host canonicalisation is a property of the real deployment; a local server cannot have it,
// and asserting it against one produces a failure that says nothing.
if (!auditingCanonical) {
  note("one host", `not checked: only meaningful against ${CANONICAL_HOST}`);
} else {
  for (const [label, url] of [
    ["apex", "https://b2bleadgrowth.com/"],
    ["platform alias", "https://b2b-lead-growth-site.vercel.app/pricing"],
  ]) {
    try {
      const r = await get(url);
      if ([301, 308].includes(r.status) && (r.location ?? "").startsWith(CANONICAL_HOST)) {
        ok(`one host: ${label}`, `${r.status} -> ${r.location}`);
      } else {
        bad(`one host: ${label}`, `${r.status} -> ${r.location ?? "(no location)"}`);
      }
    } catch {
      note(`one host: ${label}`, "not reachable from here");
    }
  }
}

// ---------------------------------------------------------------- 8. robots + llms
const rb = await get(`${BASE}/robots.txt`);
if (rb.status !== 200) bad("robots.txt", String(rb.status));
else {
  if (/Disallow:\s*\/\s*$/m.test(rb.body)) {
    bad("robots.txt does not disallow the site", "a blanket Disallow: / is present");
  } else {
    ok("robots.txt", "200, no blanket disallow");
  }
  if (rb.body.includes(`${CANONICAL_HOST}/sitemap.xml`)) {
    ok("robots.txt names the sitemap", `${CANONICAL_HOST}/sitemap.xml`);
  } else {
    bad("robots.txt names the sitemap", "absent");
  }
  // AI answer engines are the point of the GEO work; each must stay allowed.
  const missing = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Bingbot"].filter(
    (a) => !rb.body.includes(a),
  );
  if (missing.length) {
    note("AI crawlers named explicitly", `not named: ${missing.join(", ")} (the * rule still allows them)`);
  } else {
    ok("AI crawlers named explicitly", "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bingbot");
  }
}
const lt = await get(`${BASE}/llms.txt`);
if (lt.status === 200 && lt.body.length > 2000) {
  ok("llms.txt", `200, ${lt.body.length} bytes`);
} else {
  bad("llms.txt", `${lt.status}, ${lt.body.length} bytes`);
}

// ---------------------------------------------------------------- 9. internal links
// Editorial links only — the footer and the "Keep reading" rail link everything from
// everything, so counting them would hide exactly the failure this checks for.
const inbound = new Map();
const broken = new Set();
const announced = new Set(pages.map((p) => p.path));
for (const p of pages) {
  for (const m of proseOf(p.html).matchAll(/href="(\/[^"#?]*)/g)) {
    const to = m[1].replace(/\/$/, "") || "/";
    if (to === p.path.replace(/\/$/, "") || to.startsWith("/api/")) continue;
    if (!inbound.has(to)) inbound.set(to, new Set());
    inbound.get(to).add(p.path);
  }
}
for (const [to, from] of inbound) {
  if (announced.has(to) || to === "/") continue;
  const r = await get(`${BASE}${to}`);
  if (r.status >= 400) broken.add(`${to} (${r.status}) linked from ${[...from].join(", ")}`);
  else if (r.status === 301 || r.status === 308)
    broken.add(`${to} is a redirect, linked from ${[...from].join(", ")} — link the destination`);
}
if (broken.size) {
  bad("no broken or redirecting internal links", [...broken].join(" | "));
} else {
  ok("no broken or redirecting internal links", `${inbound.size} distinct editorial targets`);
}

// Orphan / starvation check. A page nothing argues for is a page nothing ranks.
const FLOOR = 3;
const EXEMPT = new Set(["/", "/privacy", "/terms", "/reviews", "/start"]);
const starved = pages
  .filter((p) => !EXEMPT.has(p.path))
  .map((p) => ({ path: p.path, n: (inbound.get(p.path) ?? new Set()).size }))
  .filter((r) => r.n < FLOOR);
if (starved.length) {
  bad(`every content page has >= ${FLOOR} editorial inbound links`, starved.map((r) => `${r.path}: ${r.n}`).join(", "));
} else {
  ok(`every content page has >= ${FLOOR} editorial inbound links`, `min observed across ${pages.length - EXEMPT.size} pages`);
}

// ---------------------------------------------------------------- report
const fails = results.filter((r) => r.level === "FAIL");
if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, audited: pages.length, results, failed: fails.length }, null, 2));
} else {
  console.log(`\nLIVE SEO AUDIT — ${BASE}  (${pages.length} announced pages)\n`);
  for (const r of results) {
    const tag = r.level === "PASS" ? "PASS" : r.level === "FAIL" ? "FAIL" : "INFO";
    console.log(`  [${tag}] ${r.check.padEnd(48)} ${r.detail}`);
  }
  console.log(`\n${fails.length === 0 ? "LIVE SEO AUDIT: OK" : `LIVE SEO AUDIT: ${fails.length} FAILURE(S)`}`);
}
process.exit(fails.length === 0 ? 0 : 1);
