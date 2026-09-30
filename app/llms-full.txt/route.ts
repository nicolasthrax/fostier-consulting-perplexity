import { llmsFullTxt } from "@/lib/llms";

export const dynamic = "force-static";

/** /llms-full.txt — llms.txt plus the full text of every service page, FAQ and guide. */
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
