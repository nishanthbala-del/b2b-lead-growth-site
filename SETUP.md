# Setup & Operations Guide

This site is a Next.js landing page for the **B2B Lead Growth Agency** with a built-in,
**free** lead-capture and booking flow. This guide gets it live and explains how leads flow in.

> **Cost:** $0. Hosting (Vercel Hobby), storage (Google Sheets), and scheduling
> (Google Calendar appointment schedule) are all free tiers.

---

## What's built

| Piece | Where | What it does |
| --- | --- | --- |
| Landing page | `components/LeadGenerationLanding.tsx` | The marketing site. Every CTA opens the intake form. |
| Intake form | `components/IntakeForm.tsx` | On-brand multi-step modal: business basics → pipeline/qualification → booking. |
| API route | `app/api/lead/route.ts` | Validates submissions, blocks bots (honeypot + rate limit), saves them. |
| Local storage | `./data/` (gitignored) | `submissions.csv` + `.jsonl` for local dev / self-host. |
| Cloud storage | Google Sheet (via Apps Script) | The durable source of truth in production. |
| Booking | Your scheduler link | Shown right after a successful submission. |

**The conversion flow:**
CTA → intake form → qualification questions → submit (saved to Sheet + CSV) → booking step → call booked.

### What the intake form captures
Contact basics (name, work email, company, website, role) **plus the six business-operations
fields** you asked for:
1. **Lead package** selected (pre-filled when a visitor clicks a specific plan)
2. **Target market**
3. **ICP notes** (ideal-customer notes / exclusions)
4. **Average deal size**
5. **Sales goals** ("what does success look like in 90 days?")
6. **Current prospecting method**

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
3. (Optional but recommended) set `NOTIFY_EMAIL` to your private inbox to get an email per lead,
   and set `SECRET` to any random string.
4. Click **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy**, authorize, and **copy the Web app URL** (ends in `/exec`).
5. Put that URL in `SHEETS_WEBHOOK_URL` (in `.env.local` for local, and in Vercel for prod).
   If you set `SECRET`, also set `SHEETS_WEBHOOK_SECRET` to the same value.

> Your email stays private — it lives only inside the Apps Script, never on the public site.

### Apps Script code

```javascript
// ---- CONFIG -----------------------------------------------------------------
const SHEET_NAME = 'Leads';
const SECRET = '';        // optional: must match SHEETS_WEBHOOK_SECRET if set
const NOTIFY_EMAIL = '';  // optional: your private email for new-lead alerts
// -----------------------------------------------------------------------------

const HEADERS = [
  'id', 'timestamp', 'status', 'package', 'name', 'email', 'company', 'website',
  'role', 'targetMarket', 'avgDealSize', 'salesGoals', 'currentProspecting',
  'icpNotes', 'source', 'ip', 'bookingOpenedAt'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (SECRET && body.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });

    const sheet = getSheet();

    if (body.action === 'booking_opened') {
      markBookingOpened(sheet, body.id, body.timestamp);
      return json({ ok: true });
    }

    // action === 'submit'
    const row = HEADERS.map(function (h) {
      if (h === 'bookingOpenedAt') return '';
      return body[h] != null ? body[h] : '';
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      const lines = ['package', 'name', 'email', 'company', 'website', 'role',
        'targetMarket', 'avgDealSize', 'salesGoals', 'currentProspecting', 'icpNotes']
        .map(function (h) { return h + ': ' + (body[h] || ''); }).join('\n');
      MailApp.sendEmail(NOTIFY_EMAIL,
        'New lead: ' + (body.company || 'Unknown') + ' (' + (body.package || 'n/a') + ')',
        'A new lead came in via the website:\n\n' + lines + '\n\nRef: ' + (body.id || ''));
    }

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

function markBookingOpened(sheet, id, ts) {
  if (!id) return;
  const last = sheet.getLastRow();
  if (last < 2) return;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) {
      const rowNum = i + 2;
      sheet.getRange(rowNum, HEADERS.indexOf('bookingOpenedAt') + 1)
        .setValue(ts || new Date().toISOString());
      const statusCell = sheet.getRange(rowNum, HEADERS.indexOf('status') + 1);
      const cur = statusCell.getValue();
      if (!cur || cur === 'New') statusCell.setValue('Booking opened');
      return;
    }
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> **If you change the script later,** re-deploy with **Deploy → Manage deployments → Edit → Version: New version**, or the old code keeps running.

---

## Step 2 — Booking link

Already wired to your Google Calendar appointment schedule in `.env.local`:

```
NEXT_PUBLIC_BOOKING_URL=https://calendar.app.google/cyDCVBd2XhpuBCvG9
```

After a visitor submits the form they get a **"Choose a time"** button that opens this scheduler
in a new tab. (Google's `calendar.app.google` links refuse to load inside an iframe, so opening
in a new tab is the reliable behavior. If you ever switch to **Calendly** or **Cal.com**, the form
will automatically show the scheduler *inline* — no code change needed.)

To change the link, edit `NEXT_PUBLIC_BOOKING_URL` and restart dev (or update it in Vercel).

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
3. **Before deploying, add Environment Variables** (Settings → Environment Variables):
   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_BOOKING_URL` | `https://calendar.app.google/cyDCVBd2XhpuBCvG9` |
   | `SHEETS_WEBHOOK_URL` | the Apps Script `/exec` URL from Step 1 |
   | `SHEETS_WEBHOOK_SECRET` | the secret (only if you set one) |
   | `NEXT_PUBLIC_SITE_URL` | your final Vercel URL (e.g. `https://your-site.vercel.app`) |
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
- **Privacy:** no public email address is shown (by design) — all contact runs through the form.
  Add a privacy note/policy link before heavy outbound if your market requires it.
- **No fabricated proof:** the site ships without case studies on purpose. Add real ones to the
  "Proof" section once you have client results.
- **Optional polish later:** a custom social-share (OG) image, a privacy policy page, and a captcha.
