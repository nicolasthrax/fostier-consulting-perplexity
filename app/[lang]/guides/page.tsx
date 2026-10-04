import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedMetadata } from "@/lib/metadata";
import { formatUpdated } from "@/lib/i18n/dates";
import { guidesCopy, hasGuides, listedGuidesIn, listedTranslations, updatedOf, visibleGuides } from "@/lib/guides";
import { PageHero, Section } from "@/components/SectionHeading";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  const t = guidesCopy[params.lang];
  return localizedMetadata({ locale: params.lang, path: "/guides", title: t.metaTitle, description: t.description });
}

const row = "focus-ring wipe-row group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-1 py-5 sm:px-4 md:py-6";

/** Guides index. Lists this locale's guides, then guides only available in other languages. Unlisted translations never appear. */
export default async function GuidesPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = (await props.params) as { lang: Locale };
  if (!hasGuides()) notFound();
  const dict = getDictionary(lang);
  const t = guidesCopy[lang];
  const own = listedGuidesIn(lang);
  const others = visibleGuides().filter((g) => {
    const listed = listedTranslations(g);
    return !listed[lang] && locales.some((l) => listed[l]);
  });

  return (
    <>
      <PageHero title={t.title} lead={t.intro} />
      <Section className="!pt-14">
        <ul className="border-t border-ink">
          {own.map((g) => {
            const tr = g.translations[lang]!;
            return (
              <li key={g.id} className="border-b border-line">
                <Link href={`/${lang}/guides/${tr.slug}`} className={row}>
                  <span className="wipe-fg font-serif text-xl leading-snug text-ink sm:text-2xl">{tr.title}</span>
                  <span className="wipe-fg col-start-1 text-[15px] leading-snug text-muted">{formatUpdated(lang, updatedOf(g, lang))}</span>
                  <ArrowRight aria-hidden="true" className="wipe-fg col-start-2 row-span-2 row-start-1 h-5 w-5 text-navy transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ul>

        {others.length > 0 && (
          <>
            <h2 className="h-serif mt-16 text-3xl">{t.otherLanguages}</h2>
            <ul className="mt-6 border-t border-ink">
              {others.map((g) => {
                const listed = listedTranslations(g);
                const l = locales.find((x) => listed[x])!;
                const tr = listed[l]!;
                return (
                  <li key={g.id} className="border-b border-line">
                    <Link href={`/${l}/guides/${tr.slug}`} hrefLang={l} className={row}>
                      <span lang={l} className="wipe-fg font-serif text-xl leading-snug text-ink">{tr.title}</span>
                      <span className="wipe-fg col-start-1 text-[15px] text-muted">{t.languageName[l]}</span>
                      <ArrowRight aria-hidden="true" className="wipe-fg col-start-2 row-span-2 row-start-1 h-5 w-5 text-navy" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Section>
    </>
  );
}
