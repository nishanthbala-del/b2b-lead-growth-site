import { NextRequest } from "next/server";
import { recordEvent } from "@/lib/events-server";

// First-party conversion events (lib/events.ts). Accepts ONE event per request from this site's
// own pages, narrows it to the closed vocabulary, and records it as one structured log line —
// see lib/events-server.ts for where it goes and what it can never contain.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 2048;

export async function POST(req: NextRequest) {
  let raw: unknown = null;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return new Response(null, { status: 413 });
    raw = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const record = await recordEvent(raw);
  return new Response(null, { status: record ? 204 : 400 });
}

/** A GET records nothing — link scanners and prefetchers must not be able to mint events. */
export async function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
