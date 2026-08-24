// Ping IndexNow (Bing/Yandex + everything downstream of Bing's index, which
// includes ChatGPT search and Copilot) with the site's URLs. Free, no account.
// Run AFTER a production deploy:  node scripts/indexnow-ping.mjs
//
// IndexNow guarantees notification, not indexing — but for a new low-authority
// site it typically cuts Bing discovery from weeks to hours. The key file is
// served from /public/<key>.txt so the endpoint can verify ownership.

// Default MUST match lib/site.ts `siteUrl`. It pointed at the old throwaway
// *.vercel.app hostname long after the brand domain went live, so every ping
// announced URLs on a host we no longer publish.
const HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.b2bleadgrowth.com")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
const KEY = "fa2d37dcda78121e04e0e0748d3bf823";

const urls = [
  "/",
  "/free-pipeline-audit",
  "/pricing",
  "/hvac-lead-generation-new-jersey",
  "/shared-vs-exclusive-hvac-leads",
  "/how-to-choose-a-lead-generation-agency",
  "/privacy",
  "/terms",
].map((p) => `https://${HOST}${p}`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

console.log(`IndexNow response: ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
console.log(`Submitted ${urls.length} URLs for ${HOST}.`);
