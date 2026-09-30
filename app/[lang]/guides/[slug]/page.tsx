import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { localizedMetadata } from "@/lib/metadata";
import { formatUpdated } from "@/lib/i18n/dates";
import { faqHeading } from "@/lib/i18n/faq";
import { findGuide, guidePaths, guidesCopy, visibleGuides } from "@/lib/guides";
import { guideJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/site";
import { PageHero, Section } from "@/components/SectionHeading";
import { Faq } from "@/components/Faq";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

type Params = { lang: Locale; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    visibleGuides()
      .filter((g) => g.translations[lang])
      .map((g) => ({ lang, slug: g.translations[lang]!.slug }))
  );
}

export async function generateMetadata(props: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const params = (await props.params) as Params;
  const guide = findGuide(params.lang, params.slug);
  if (!guide) return {};
  const tr = guide.translations[params.lang]!;
  return localizedMetadata({ locale: params.lang, path: guidePaths(guide), title: tr.metaTitle, description: tr.description, type: "article" });
}

export default async function GuidePage(props: { params: Promise<{ lang: string; slug: string }> }) {
  const params = (await props.params) as Params;
  const guide = findGuide(params.lang, params.slug);
  if (!guide) notFound();
  const { lang } = params;
  const tr = guide.translations[lang]!;
  const dict = getDictionary(lang);
  const t = guidesCopy[lang];
  const service = guide.service !== undefined ? dict.services.items[guide.service] : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(lang, guide)) }} />
      <PageHero
        title={tr.title}
        lead={tr.lead}
        before={
          <Link href={`/${lang}/guides`} className="focus-ring link-arrow mb-8 text-[15px]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.back}
          </Link>
        }
        after={
          <p className="mt-6 text-[15px] text-slate">
            {t.by}{" "}
            <Link href={`/${lang}/about#advisor`} className="focus-ring link-underline font-semibold text-navy">
              {site.founder}
            </Link>
          </p>
        }
        note={formatUpdated(lang, guide.updated)}
      />

      <Section className="!pt-14">
        <article className="max-w-prose">
          {tr.sections.map((s) => (
            <section key={s.heading} className="mt-12 first:mt-0">
              <h2 className="h-serif text-3xl leading-tight">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed text-slate sm:text-[17px]">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate marker:text-fred">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {service && guide.service !== undefined && (
          <Link
            href={`/${lang}/services/${serviceSlugs[guide.service][lang]}`}
            className="focus-ring group mt-16 flex max-w-prose items-center justify-between gap-6 rounded-sm border-t-4 border-navy bg-mist p-6 transition-colors hover:bg-navy"
          >
            <span>
              <span className="block text-sm font-medium text-muted group-hover:text-white/75">{t.related}</span>
              <span className="mt-1 block font-serif text-2xl leading-snug text-ink group-hover:text-white">{service.title}</span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-navy group-hover:text-white" />
          </Link>
        )}

        {tr.faq && tr.faq.length > 0 && (
          <div className="mt-20 max-w-4xl">
            <Faq title={faqHeading[lang]} items={tr.faq} />
          </div>
        )}

        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>

    </>
  );
}
