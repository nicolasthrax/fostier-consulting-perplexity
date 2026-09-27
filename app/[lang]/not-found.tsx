import type { Metadata } from "next";
import { pageTitles } from "@/lib/i18n/titles";
import { site } from "@/lib/site";
import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: { absolute: `${pageTitles.fr.notFound} | ${site.name}` },
  robots: { index: false, follow: true },
};

/** not-found receives no route params in Next 14; the copy picks its language from LocaleProvider. */
export default function NotFound() {
  return <NotFoundContent />;
}
