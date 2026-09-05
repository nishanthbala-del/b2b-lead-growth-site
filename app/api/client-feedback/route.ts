import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Where a client's review or referral submission lands (/for-clients?t=<token>). Modeled directly
// on app/api/lead/route.ts's safety rails — same honeypot, rate limit, cross-site check, and
// formula-injection guard, because the failure modes are identical: this also writes free text
// into a spreadsheet a human opens.
//
// WHAT THIS NEVER DOES: publish anything. A submission here lands in the Sheet's Feedback tab (or
// the local dev CSV) for the owner to review — nothing on the live site changes as a result.
// Publishing a real review is always a separate, reviewed code change (see lib/content.ts's
// `reviews` comment and the operating-system repo's scripts/record_review.py) — the deliberate gap
// between "submitted" and "consented and live" that CSA §14.2 / FTC 16 CFR Part 255 require.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FeedbackPayload = {
  type?: "review" | "referral";
  token?: string;
  // review fields
  quote?: string;
  name?: string;
  company?: string;
  consent?: boolean;
  // referral fields
  businessName?: string;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
  hp_leave_blank?: string;
};

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = path.join(process.cwd(), "data");
const CSV_FILE = path.join(DATA_DIR, "feedback.csv");
const JSONL_FILE = path.join(DATA_DIR, "feedback.jsonl");

// APPEND ONLY — same discipline as app/api/lead/route.ts's CSV_COLUMNS, for the same reason: a
// reorder silently shifts every future row into the wrong Sheet column.
const CSV_COLUMNS = [
  "id", "timestamp", "type", "token", "quote", "name", "company", "consent",
  "businessName", "contactName", "contactEmail", "notes", "ip",
] as const;

// Same closed charset as app/api/lead/route.ts's `referralToken` / `campaign`.
const TOKEN_RE = /^[A-Za-z0-9_-]{1,40}$/;

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Same guard as app/api/lead/route.ts, for the same reason: every field here is attacker-controlled
// free text that lands in a spreadsheet.
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function genId(): string {
  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let rand = "";
  for (const b of bytes) rand += ID_ALPHABET[b % ID_ALPHABET.length];
  return `FB-${ymd}-${rand}`;
}

function getIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const hops = req.headers.get("x-forwarded-for")?.split(",") ?? [];
  const last = hops[hops.length - 1]?.trim();
  return last || "unknown";
}

function isCrossSitePost(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "cross-site";
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
}

const hits = new Map<string, number[]>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
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

const CSV_HEADER = CSV_COLUMNS.join(",");

async function ensureCsvHeader(): Promise<void> {
  let existing: string;
  try {
    existing = await fs.readFile(CSV_FILE, "utf8");
  } catch {
    await fs.writeFile(CSV_FILE, CSV_HEADER + "\n", "utf8");
    return;
  }
  if ((existing.split("\n", 1)[0] ?? "") === CSV_HEADER) return;
  const archived = CSV_FILE.replace(/\.csv$/, `.superseded-${Date.now()}.csv`);
  await fs.rename(CSV_FILE, archived);
  await fs.writeFile(CSV_FILE, CSV_HEADER + "\n", "utf8");
}

async function appendLocal(record: Record<string, unknown>): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await ensureCsvHeader();
    const row = CSV_COLUMNS.map((c) => csvEscape(record[c])).join(",") + "\n";
    await fs.appendFile(CSV_FILE, row, "utf8");
    await fs.appendFile(JSONL_FILE, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch (err) {
    console.warn("[client-feedback] local persistence skipped:", (err as Error).message);
    return false;
  }
}

async function forwardToSheets(payload: Record<string, unknown>): Promise<{ ok: boolean }> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("[client-feedback] SHEETS_WEBHOOK_URL is not set — feedback NOT forwarded");
    return { ok: false };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: process.env.SHEETS_WEBHOOK_SECRET ?? "" }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.text().catch(() => "");
    let accepted = false;
    try {
      accepted = (JSON.parse(body) as { ok?: boolean }).ok === true;
    } catch {
      accepted = false;
    }
    return { ok: accepted };
  } catch (err) {
    console.error("[client-feedback] Sheets forward failed:", (err as Error).message);
    return { ok: false };
  }
}

const MAX_BODY_BYTES = 8_000;

export async function POST(req: NextRequest) {
  if (isCrossSitePost(req)) {
    return Response.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  let body: FeedbackPayload;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as FeedbackPayload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const ip = getIp(req);
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a moment." },
      { status: 429 },
    );
  }
  if (body.hp_leave_blank) {
    return Response.json({ ok: true, id: genId() }); // silent bot discard, same as the lead route
  }

  const token = String(body.token ?? "").trim();
  if (!TOKEN_RE.test(token)) {
    return Response.json({ ok: false, error: "Missing or invalid link — use the personal link we sent you." }, { status: 400 });
  }

  const field = (value: unknown, max: number): string =>
    neutralizeFormula(String(value ?? "").trim().slice(0, max));

  const type = body.type === "referral" ? "referral" : "review";
  const id = genId();
  const timestamp = new Date().toISOString();
  const record: Record<string, string> = {
    id, timestamp, type, token,
    quote: "", name: "", company: "", consent: "",
    businessName: "", contactName: "", contactEmail: "", notes: "",
    ip: neutralizeFormula(ip),
  };

  if (type === "review") {
    const quote = field(body.quote, 1200);
    if (!quote) {
      return Response.json({ ok: false, error: "Please write a short review before submitting." }, { status: 400 });
    }
    if (body.consent !== true) {
      return Response.json(
        { ok: false, error: "Please confirm you're OK with us possibly using this on our site." },
        { status: 400 },
      );
    }
    record.quote = quote;
    record.name = field(body.name, 120);
    record.company = field(body.company, 160);
    record.consent = "true";
  } else {
    const businessName = field(body.businessName, 160);
    if (!businessName) {
      return Response.json({ ok: false, error: "Please tell us who you're referring." }, { status: 400 });
    }
    record.businessName = businessName;
    record.contactName = field(body.contactName, 120);
    record.contactEmail = field(body.contactEmail, 160);
    record.notes = field(body.notes, 500);
  }

  const localOk = await appendLocal(record);
  const sheet = await forwardToSheets({ action: "client_feedback", ...record });
  const stored = sheet.ok === true || (localOk && !IS_SERVERLESS);

  return Response.json({ ok: true, id, stored });
}
