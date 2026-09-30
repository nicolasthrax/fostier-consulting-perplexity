import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getPageTitles } from "@/lib/i18n/titles";
import { site } from "@/lib/site";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  return {
    title: { absolute: `${getPageTitles(params.lang).notFound} | ${site.name}` },
    robots: { index: false, follow: true },
  };
}

/** Routes unknown paths under a locale to [lang]/not-found so they get the site layout. */
export default function MissingPage() {
  notFound();
}
