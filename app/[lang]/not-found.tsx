import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getPageTitles } from "@/lib/i18n/titles";
import { site } from "@/lib/site";
import { NotFoundContent } from "@/components/NotFoundContent";

/**
 * The component gets no route params, but the metadata of a not-found boundary is
 * resolved with its segment's params, so the title follows the URL's locale.
 */
export async function generateMetadata({ params }: { params?: Promise<{ lang?: string }> }): Promise<Metadata> {
  const requested = (await params)?.lang ?? "";
  const lang = (locales as readonly string[]).includes(requested) ? (requested as Locale) : "fr";
  return {
    title: { absolute: `${getPageTitles(lang).notFound} | ${site.name}` },
    robots: { index: false, follow: true },
  };
}

/** The copy picks its language from LocaleProvider, set by the [lang] layout. */
export default function NotFound() {
  return <NotFoundContent />;
}
