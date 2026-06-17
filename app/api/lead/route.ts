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
  company_website?: string;
};

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

function genId(): string {
  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LG-${ymd}-${rand}`;
}

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

async function ensureCsvHeader(): Promise<void> {
  try {
    await fs.access(CSV_FILE);
  } catch {
    await fs.writeFile(CSV_FILE, CSV_COLUMNS.join(",") + "\n", "utf8");
  }
}

async function appendLocal(record: Record<string, unknown>): Promise<void> {
  // Local persistence is for dev / self-host. On serverless (e.g. Vercel) the
  // filesystem is read-only/ephemeral, so this is best-effort — the Google
  // Sheet is the durable source of truth there.
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await ensureCsvHeader();
    const row = CSV_COLUMNS.map((c) => csvEscape(record[c])).join(",") + "\n";
    await fs.appendFile(CSV_FILE, row, "utf8");
    await fs.appendFile(JSONL_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.warn("[lead] local persistence skipped:", (err as Error).message);
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
): Promise<{ forwarded: boolean; ok?: boolean }> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { forwarded: false };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: process.env.SHEETS_WEBHOOK_SECRET ?? "" }),
      signal: AbortSignal.timeout(10_000),
    });
    return { forwarded: true, ok: res.ok };
  } catch (err) {
    console.error("[lead] Sheets forward failed:", (err as Error).message);
    return { forwarded: true, ok: false };
  }
}

export async function POST(req: NextRequest) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
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
  if (body.company_website) {
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
  const required: Array<[keyof LeadPayload, string]> = [
    ["name", "Name"],
    ["email", "Work email"],
    ["company", "Company"],
    ["targetMarket", "Target market"],
    ["avgDealSize", "Average deal size"],
    ["salesGoals", "Sales goals"],
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
  const record: Record<string, string> = {
    id,
    timestamp,
    status: "New",
    package: String(body.package ?? "Not specified").slice(0, 60),
    name: String(body.name).trim().slice(0, 120),
    email: String(body.email).trim().slice(0, 160),
    company: String(body.company).trim().slice(0, 160),
    website: String(body.website ?? "").trim().slice(0, 200),
    role: String(body.role ?? "").trim().slice(0, 120),
    targetMarket: String(body.targetMarket).trim().slice(0, 400),
    avgDealSize: String(body.avgDealSize).trim().slice(0, 80),
    salesGoals: String(body.salesGoals).trim().slice(0, 800),
    currentProspecting: String(body.currentProspecting).trim().slice(0, 800),
    icpNotes: String(body.icpNotes ?? "").trim().slice(0, 1500),
    source: "website",
    ip,
  };

  await appendLocal(record);
  const sheet = await forwardToSheets({ action: "submit", ...record });

  return Response.json({ ok: true, id, sheets: sheet.forwarded });
}
