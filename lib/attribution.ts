// First-party visit attribution: which channel a fit-check submission actually came from.
//
// WHY THIS EXISTS. The site could already tell an outbound batch apart (`/start?src=…`) and a
// client referral (`?t=…`), and nothing else — so a submission from Google, from Bing, from an
// AI assistant's citation, or from a link in someone's newsletter all looked identical, and
// "which channel produces fit companies?" could not be answered from the Sheet at all.
//
// WHAT IT RECORDS, and nothing more:
//   * the five standard UTM tags, if the landing URL carried them
//   * the PATH of the first page seen this visit (never the query string, which can carry
//     anything a third party chose to put in a link)
//   * the HOST of the referring site, if it was a different site (never the full referring
//     URL, which can carry a search query or another site's private path)
//
// HOW. On the first page of a visit, components/AttributionCapture.tsx reads those values
// and keeps them in the browser's sessionStorage — first-party, not a cookie, never sent
// anywhere on its own, and gone when the tab closes. The fit check includes them in its one
// submission. No third-party script, no analytics vendor, no cross-site identifier.
//
// Nothing here imports React or Next, so the browser flow, the API route and the tests all
// use the SAME sanitizer: the server never trusts what the browser says it stored.

export const ATTRIBUTION_KEYS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "landingPath",
  "referrerHost",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Record<AttributionKey, string>;

export const EMPTY_ATTRIBUTION: Attribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  landingPath: "",
  referrerHost: "",
};

/** The query-string name each UTM field is read from. */
export const UTM_PARAMS: Record<string, AttributionKey> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

/** Versioned, so a future change of shape cannot be misread from an old tab. */
export const ATTRIBUTION_STORAGE_KEY = "blg_attribution_v1";

/**
 * Plain-English name for each field. Read by /privacy, so the published list of what we
 * record is generated from what the code records — the same discipline as QUESTION_LABELS.
 */
export const ATTRIBUTION_LABELS: Record<AttributionKey, string> = {
  utmSource: "the campaign source tag in the link you arrived on (utm_source), if it had one",
  utmMedium: "the campaign medium tag (utm_medium), if it had one",
  utmCampaign: "the campaign name tag (utm_campaign), if it had one",
  utmContent: "the campaign content tag (utm_content), if it had one",
  utmTerm: "the campaign term tag (utm_term), if it had one",
  landingPath: "the path of the first page you opened on this site during the visit",
  referrerHost: "the domain name of the site that linked you here, if there was one",
};

// CLOSED CHARACTER SETS. Every one of these values ends up in a spreadsheet cell, so each is
// matched against a whitelist rather than scrubbed of a blacklist. A value that does not
// match is dropped whole: a partial attribution is worse than none.
const UTM_RE = /^[A-Za-z0-9 _.+~:-]{1,80}$/;
const PATH_RE = /^\/[A-Za-z0-9\-._~/]{0,119}$/;
const HOST_RE = /^[A-Za-z0-9.-]{1,120}$/;

function clean(value: unknown, re: RegExp): string {
  const s = String(value ?? "").trim();
  return re.test(s) ? s : "";
}

/** Keep only well-formed values. Used by the browser before storing AND by the server. */
export function sanitizeAttribution(raw: Partial<Record<string, unknown>> | null | undefined): Attribution {
  const r = raw ?? {};
  return {
    utmSource: clean(r.utmSource, UTM_RE),
    utmMedium: clean(r.utmMedium, UTM_RE),
    utmCampaign: clean(r.utmCampaign, UTM_RE),
    utmContent: clean(r.utmContent, UTM_RE),
    utmTerm: clean(r.utmTerm, UTM_RE),
    landingPath: clean(r.landingPath, PATH_RE),
    referrerHost: clean(String(r.referrerHost ?? "").toLowerCase(), HOST_RE),
  };
}

/**
 * Build the attribution for the FIRST page of a visit. Pure: everything it needs is passed
 * in, so it is testable without a browser.
 *
 * `referrer` is reduced to its host, and only when that host is a DIFFERENT site — an
 * internal navigation is not a referral, and recording it would overwrite nothing useful
 * with our own domain.
 */
export function attributionFromVisit({
  search,
  pathname,
  referrer,
  ownHost,
}: {
  search: string;
  pathname: string;
  referrer: string;
  ownHost: string;
}): Attribution {
  const out: Record<string, string> = { ...EMPTY_ATTRIBUTION };
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    params = new URLSearchParams();
  }
  for (const [param, key] of Object.entries(UTM_PARAMS)) {
    out[key] = params.get(param) ?? "";
  }
  out.landingPath = pathname;
  try {
    const host = referrer ? new URL(referrer).host : "";
    out.referrerHost = host && host !== ownHost ? host : "";
  } catch {
    out.referrerHost = "";
  }
  return sanitizeAttribution(out);
}
