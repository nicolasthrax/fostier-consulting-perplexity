import type { Metadata } from "next";
import { publicBase } from "@/lib/careers/config";
import { careersCopy, isCareersLocale } from "@/lib/careers/i18n";
import { CareersNotFound } from "@/components/careers/CareersNotFound";

/** The component gets no route params, but the metadata of a not-found boundary is resolved with its segment's params. */
export async function generateMetadata({ params }: { params?: Promise<{ lang?: string }> }): Promise<Metadata> {
  const requested = (await params)?.lang;
  const t = careersCopy[isCareersLocale(requested) ? requested : "fr"];
  return { title: t.notFound.title, robots: { index: false, follow: true } };
}

/** Unknown or closed listings, inside the portal's frame and in the URL's language. */
export default function NotFound() {
  return <CareersNotFound listings={{ fr: publicBase("fr"), en: publicBase("en") }} />;
}
