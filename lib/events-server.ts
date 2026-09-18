// The server half of lib/events.ts: ONE place an event is recorded, used by /api/event (the
// browser's events) and by /api/lead (the two the server records itself — the fit outcome,
// which comes from the same evaluateFit the visitor saw, and the scheduler being opened).
//
// WHERE IT GOES. `console.log` — on Vercel the deployment's runtime log, searchable by the
// `[event]` prefix — and, when EVENTS_WEBHOOK_URL is set, one POST to that URL (the owner's own
// Sheet, on a tab of its own; SETUP.md). Nothing is sent to any third party, and no event
// carries a name, an email, an IP address or a user agent: `sanitizeEvent` is the only way in,
// and it has no field for any of them.
import { sanitizeEvent, type SiteEvent } from "./events";

export type EventRecord = SiteEvent & { at: string };

/** Narrow, log, forward. Returns the record when `raw` was one of ours, null otherwise. */
export async function recordEvent(raw: unknown): Promise<EventRecord | null> {
  const event = sanitizeEvent(raw);
  if (!event) return null;
  const record: EventRecord = { ...event, at: new Date().toISOString() };
  console.log(`[event] ${JSON.stringify(record)}`);

  const url = process.env.EVENTS_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "event", ...record, secret: process.env.SHEETS_WEBHOOK_SECRET ?? "" }),
        signal: AbortSignal.timeout(2500),
      });
    } catch {
      // The log line above is the record of last resort; a slow sheet never fails a page.
    }
  }
  return record;
}
