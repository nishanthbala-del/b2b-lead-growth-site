# Setup & Operations Guide

This site is a Next.js landing page for the **B2B Lead Growth Agency** with a built-in,
**free** lead-capture and booking flow. This guide gets it live and explains how leads flow in.

> **Cost:** $0. Hosting (Vercel Hobby), storage (Google Sheets), and scheduling
> (Google Calendar appointment schedule) are all free tiers.

---

## What's built

| Piece | Where | What it does |
| --- | --- | --- |
| Landing page | `components/LeadGenerationLanding.tsx` | The marketing site. CTAs point at `/start` or `/pricing`. |
| Fit check | `components/qualification/QualificationFlow.tsx` | The standalone `/start` page: a short question flow (customer history, average job value, biggest pipeline gap, capacity, software in use) that ends in a straight fit verdict — including a real no, with a reason and a reading suggestion instead of a booking link. |
| API route | `app/api/lead/route.ts` | Validates submissions, blocks bots (honeypot + rate limit), saves them. |
| Local storage | `./data/` (gitignored) | `submissions.csv` + `.jsonl` for local dev / self-host. |
| Cloud storage | Google Sheet (via Apps Script) | The durable source of truth in production. |
| Booking | Your scheduler link | Shown only on a fit result, after the free audit is offered — not the default outcome. |

**The conversion flow:**
`/start` fit check → answers submitted (saved to Sheet + CSV) → fit result (booking link
offered) or a disqualifying result (reason + reading suggestion, no booking link).

### What the fit check captures
Business-operations signals used to score fit — customer history and count, average job
value, the single biggest gap in current pipeline (unsold estimates, lapsed maintenance
agreements, thin referral flow, or wanting to buy homeowner leads — the last one is an
automatic disqualifier), current capacity, and whether field-service software is in use.
See `lib/qualification.ts` for the exact question set and scoring rules; it changes
independently of this doc, so treat that file as the source of truth for the current
questions, not this list.

---

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Submit the form once — you'll see a new `data/submissions.csv` appear with your test row.
(That folder is gitignored and is dev-only; see storage notes below.)

Environment variables live in `.env.local` (already created, gitignored). Template: `.env.example`.
**Restart `npm run dev` after editing env values.**

---

## Step 1 — Google Sheets storage (free, ~5 minutes)

Local CSV does **not** persist on Vercel (its filesystem is read-only/ephemeral), so production
leads go to a Google Sheet via a tiny Apps Script "web app". Do this once:

1. Create a new Google Sheet (e.g. "Lead Growth — Leads").
2. **Extensions → Apps Script.** Delete any boilerplate and paste the script below.
3. **Set `SECRET` to a long random string** (e.g. `openssl rand -hex 24`). The deployment is
   public by design — "Who has access: Anyone" is what lets the site POST to it — so the secret
   is the only thing stopping a stranger who finds the `/exec` URL from writing rows into your
   leads Sheet and firing notification emails from your Google account. Also set `NOTIFY_EMAIL`
   to your private inbox to get an email per lead.
4. Click **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy**, authorize, and **copy the Web app URL** (ends in `/exec`).
5. Put that URL in `SHEETS_WEBHOOK_URL` (in `.env.local` for local, and in Vercel for prod),
   and put the same secret in `SHEETS_WEBHOOK_SECRET`.

> **This step is not optional in production.** Vercel's filesystem is ephemeral, so the Sheet is
> the only durable place a lead is written. With `SHEETS_WEBHOOK_URL` unset or wrong, the API
> logs `LEAD ... WAS NOT STORED ANYWHERE`, and the visitor is told their details didn't save and
> pushed to book a time instead (the calendar booking still captures them). Submit the live form
> once after deploying and confirm the row lands.

> Your email stays private — it lives only inside the Apps Script, never on the public site.

### Apps Script code

```javascript
// ---- CONFIG -----------------------------------------------------------------
const SHEET_NAME = 'Leads';
const SECRET = '';        // REQUIRED — set this. Must match SHEETS_WEBHOOK_SECRET.
const NOTIFY_EMAIL = '';  // optional: your private email for new-lead alerts
// -----------------------------------------------------------------------------

// EVERY column app/api/lead/route.ts sends, in its order, plus bookingOpenedAt.
//
// This list was 17 names until 2026-09-05 while route.ts sent 30. The write below is
// BY HEADER NAME, but it used to be `HEADERS.map(...)` positionally, so the 14 names
// missing from this array were discarded with no error and no warning: consent,
// consentAt, and every answer the fit check collects — yearsInBusiness, recordVolume,
// followUpOwner, capacity, exportReadiness, timeline, budget, fitOutcome, fitScore,
// recommendedTier, qualificationSummary, campaign. An owner answered ten questions so
// the reply would be about HIS business and none of it survived the trip, and the one
// record you want if a recipient ever disputes consent (consentAt) was dropped by the
// only durable sink in production.
//
// KEEP IN LOCKSTEP with CSV_COLUMNS in app/api/lead/route.ts. New questions go on the
// END of both — see syncHeader() for why appending is safe and reordering is not.
const HEADERS = [
  'id', 'timestamp', 'status', 'package', 'name', 'email', 'company', 'website',
  'role', 'targetMarket', 'avgDealSize', 'salesGoals', 'currentProspecting',
  'icpNotes', 'source', 'consent', 'consentAt', 'ip', 'yearsInBusiness',
  'recordVolume', 'followUpOwner', 'capacity', 'exportReadiness', 'timeline',
  'budget', 'fitOutcome', 'fitScore', 'recommendedTier', 'qualificationSummary',
  'campaign', 'referralToken', 'bookingOpenedAt'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    // Fail CLOSED. An empty SECRET must reject everything rather than accept
    // everything — this endpoint is deployed as "Anyone", so an unset secret would
    // leave a public write + mail-send endpoint on your Google account.
    if (!SECRET || body.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });

    // Apps Script runs concurrent invocations. Both branches below read the sheet's
    // last row before writing, so without a lock two leads arriving together can
    // append to the same row or stamp the wrong one.
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) return json({ ok: false, error: 'busy' });

    try {
      const sheet = getSheet();
      const header = syncHeader(sheet);

      if (body.action === 'booking_opened') {
        markBookingOpened(sheet, header, body.id, body.timestamp);
        return json({ ok: true });
      }

      // action === 'export' — the operating system's intake poller. Returns every row
      // whose timestamp sorts after `since`, so the OS can pull leads it has not seen
      // without anyone re-typing them. Read-only, and behind the same secret as a write.
      if (body.action === 'export') {
        return json({ ok: true, rows: exportRows(sheet, header, body.since || '') });
      }

      // action === 'submit'. Written BY NAME against the sheet's real header row, so a
      // sheet that predates a column still lands every value under the right label.
      const row = header.map(function (h) {
        if (h === 'bookingOpenedAt') return '';
        return body[h] != null ? body[h] : '';
      });
      // setValues, not appendRow: appendRow re-evaluates leading '=' as a formula,
      // which would undo the site's formula-injection guard.
      sheet.getRange(sheet.getLastRow() + 1, 1, 1, header.length).setValues([row]);
    } finally {
      lock.releaseLock();
    }

    notifyOwner(body);
    confirmToVisitor(body);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Bring an existing sheet up to date WITHOUT touching the rows already in it, and
// return the header actually in force.
//
// Any name in HEADERS that the sheet does not have yet is APPENDED on the right. That
// is why the write must go by name: the old 17-column header had `ip` in column 16,
// where HEADERS now has `consent`, so rewriting row 1 in place would silently relabel
// every historical row's IP address as a consent flag. Appending leaves old rows
// correct under their own labels and lets new rows fill everything.
function syncHeader(sheet) {
  const width = Math.max(sheet.getLastColumn(), 1);
  let header = sheet.getRange(1, 1, 1, width).getValues()[0]
    .map(function (v) { return String(v || ''); })
    .filter(function (v) { return v !== ''; });
  if (!header.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return HEADERS.slice();
  }
  const missing = HEADERS.filter(function (h) { return header.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]);
    header = header.concat(missing);
  }
  return header;
}

function exportRows(sheet, header, since) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const values = sheet.getRange(2, 1, last - 1, header.length).getValues();
  const out = [];
  for (let i = 0; i < values.length; i++) {
    const rec = {};
    for (let c = 0; c < header.length; c++) {
      const v = values[i][c];
      rec[header[c]] = v instanceof Date ? v.toISOString() : String(v == null ? '' : v);
    }
    if (!since || String(rec.timestamp || '') > since) out.push(rec);
  }
  return out;
}

function markBookingOpened(sheet, header, id, ts) {
  if (!id) return;
  const last = sheet.getLastRow();
  if (last < 2) return;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) {
      const rowNum = i + 2;
      sheet.getRange(rowNum, header.indexOf('bookingOpenedAt') + 1)
        .setValue(ts || new Date().toISOString());
      const statusCell = sheet.getRange(rowNum, header.indexOf('status') + 1);
      const cur = statusCell.getValue();
      if (!cur || cur === 'New') statusCell.setValue('Booking opened');
      return;
    }
  }
}

// The alert now leads with the fit verdict. It used to omit `status` and `fitOutcome`
// entirely, so a screened-out visitor and a 14/14 strong fit produced byte-identical
// emails and the only way to tell them apart was to open the Sheet.
function notifyOwner(body) {
  if (!NOTIFY_EMAIL) return;
  const fields = ['status', 'fitOutcome', 'fitScore', 'recommendedTier', 'name', 'email',
    'company', 'website', 'role', 'targetMarket', 'yearsInBusiness', 'recordVolume',
    'followUpOwner', 'capacity', 'exportReadiness', 'avgDealSize', 'timeline', 'budget',
    'salesGoals', 'currentProspecting', 'icpNotes', 'qualificationSummary', 'consentAt'];
  const lines = fields
    .map(function (h) { return h + ': ' + (body[h] != null ? body[h] : ''); })
    .join('\n');
  MailApp.sendEmail(NOTIFY_EMAIL,
    'New lead [' + (body.fitOutcome || '?') + ']: ' + (body.company || 'Unknown'),
    'A new lead came in via the website:\n\n' + lines + '\n\nRef: ' + (body.id || ''));
}

// The receipt. Until 2026-09-05 a visitor answered fifteen questions, read a promise on
// screen that we would send an audit in writing, and then received NOTHING — no thread
// to reply to, no sender to whitelist, no reference they could keep once the tab closed.
// To an owner already burned by a lead seller that is indistinguishable from being
// ignored. MailApp is part of Apps Script, so this needs no new service and no key.
//
// It promises only what is already promised on the site, and it names a real person and
// a real inbox so an unanswered request has somewhere to go.
function confirmToVisitor(body) {
  const to = String(body.email || '').trim();
  if (!to || to.indexOf('@') === -1) return;
  if (body.action && body.action !== 'submit') return;
  const first = String(body.name || '').trim().split(' ')[0] || 'there';
  const ref = body.id || '';
  const msg = [
    'Hi ' + first + ',',
    '',
    'Thanks — your request for a Free Pipeline Audit came through. Reference: ' + ref + '.',
    '',
    'What you get, in writing, within a few business days:',
    '  1. A job profile worth targeting — including the work you would rather turn down.',
    '  2. 3-5 referral partners near you, each with a contact path, a cited reason, and a',
    '     source link you can open.',
    '  3. One sample outreach message, written for one of those partners.',
    '  4. A read on where your work comes from, and the gap most likely costing you jobs.',
    '',
    'It is yours to keep either way, there is no call required, and it contains no',
    'homeowner records — those only ever come from your own list, after you are a client',
    'and have approved the export.',
    '',
    'If you have not heard from us within five business days, just reply to this email —',
    'it reaches a person, not a queue.',
    '',
    'Nishanth Balaji',
    'B2B Lead Growth LLC',
    'nishanth@b2bleadgrowth.com'
  ].join('\n');
  MailApp.sendEmail({
    to: to,
    subject: 'Your Free Pipeline Audit request — ref ' + ref,
    body: msg,
    name: 'Nishanth at B2B Lead Growth',
    replyTo: 'nishanth@b2bleadgrowth.com'
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> **If you change the script later,** re-deploy with **Deploy → Manage deployments → Edit → Version: New version**, or the old code keeps running.

---

## Step 2 — Booking link

Hardcoded in `lib/site.ts` — deliberately NOT an environment variable:

```
export const bookingUrl = "https://calendar.app.google/nvD1n6y2gzRzjeMS7";
```

This link must stay identical to `00_CONTROL_CENTER/sender_identity.yaml -> booking_link` in the
operating-system repo, because that is the link your cold emails carry. It lived in an env var
once and drifted: the deployed site booked into a calendar that appeared nowhere in the OS, while
the code fell back to a retired one. Keeping it in the commit is what makes it checkable.

After a visitor submits the form they get a **"Choose a time"** button that opens this scheduler
in a new tab. (Google's `calendar.app.google` links refuse to load inside an iframe, so opening
in a new tab is the reliable behavior. If you ever switch to **Calendly** or **Cal.com**, the form
will automatically show the scheduler *inline* — no code change needed.)

To change the link, edit `bookingUrl` in `lib/site.ts` — it is intentionally NOT an
environment variable, so the deployed value is always readable from the commit. If
`NEXT_PUBLIC_BOOKING_URL` or `NEXT_PUBLIC_SITE_URL` are still set in Vercel, delete
them: they are ignored now, and a stale value is what previously pointed the live
site at a calendar nobody watched.

---

## Step 3 — Deploy to Vercel (free)

1. Push this repo to GitHub:
   ```bash
   git add -A
   git commit -m "Launch-ready: intake flow + booking + Sheets storage"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to **vercel.com → Add New → Project → Import** your GitHub repo. Framework auto-detects as Next.js.
3. **Before deploying, add Environment Variables** (Settings → Environment Variables).
   Do NOT set `NEXT_PUBLIC_BOOKING_URL` or `NEXT_PUBLIC_SITE_URL` — the code no longer reads
   them, and stale copies are what previously sent live traffic to the wrong calendar and
   kept every canonical URL pointing at the old `*.vercel.app` hostname. Delete them if present.
   | Name | Value |
   | --- | --- |
   | `SHEETS_WEBHOOK_URL` | the Apps Script `/exec` URL from Step 1 |
   | `SHEETS_WEBHOOK_SECRET` | the secret (only if you set one) |
4. **Deploy.** Submit the live form once to confirm a row lands in your Sheet.

> Prefer the CLI? `npm i -g vercel && vercel` (then `vercel --prod`). You'll still set the env
> vars in the dashboard or with `vercel env add`.

---

## Tracking: your Google Sheet is the dashboard

Everything you asked to track lives in the Sheet:

- **Form submissions** → one row each, `status` starts at `New`.
- **Booked calls** → when a lead clicks "Choose a time", the row's `bookingOpenedAt` is
  stamped and `status` flips to `Booking opened`. After the call actually happens, set `status`
  to `Booked` / `Qualified` / `Won` / `Lost` yourself (one dropdown column to manage your pipeline).

Quick counts: `=COUNTIF(C:C,"New")`, `=COUNTA(A:A)-1` (total leads),
`=COUNTIF(C:C,"Booking opened")`. Sort/filter by `package`, `avgDealSize`, or `targetMarket` to
prioritize. Export anytime via **File → Download → CSV**.

> **Why no automatic "call completed" tracking?** Free Google/Calendly scheduling doesn't send
> webhooks, so confirming a *completed* call is a manual one-click status change in the Sheet.
> This is the honest free-tier boundary — no fake numbers.

---

## Notes, limits, and good hygiene

- **Local `./data/` files** are for dev/self-host only and are gitignored. On Vercel they won't
  persist between requests — the Sheet is the source of truth in production. (Submissions never fail
  because of this; local writes are best-effort.)
- **Spam protection:** a hidden honeypot field + a light per-IP rate limit. For higher volume,
  consider adding a captcha later.
- **No fabricated proof:** the site ships without case studies on purpose. Add real ones to the
  "Proof" section once you have client results.
- **Still open:** a captcha for higher volume.
- **Legal identity:** `contactEmail` and `legalEntityName` (`lib/site.ts`) already default to a
  real branded mailbox (`nishanth@b2bleadgrowth.com`) and a real named LLC ("B2B Lead Growth
  LLC", formed in New Jersey) — both are shown on the live privacy policy, not "available on
  request." `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_LEGAL_ENTITY` remain available as env
  overrides if either value needs to change without a code edit; unset, the code defaults apply.
- **Have the privacy policy reviewed.** `app/privacy/page.tsx` describes what this codebase
  genuinely does, but it has not been reviewed by a lawyer against GDPR, CAN-SPAM, CASL, or US
  state privacy law. Do that before running outbound at volume.
