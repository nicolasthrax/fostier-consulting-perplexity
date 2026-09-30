import { llmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

/** /llms.txt — a plain-Markdown summary for AI assistants, built from the same copy as the site. */
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
