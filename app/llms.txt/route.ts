import { llmsTxt } from "@/lib/llms";

// /llms.txt, rendered at build time from the page registry and the offer (see lib/llms.ts).
// Static: it changes only when the content it is built from changes, which is a deploy.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
