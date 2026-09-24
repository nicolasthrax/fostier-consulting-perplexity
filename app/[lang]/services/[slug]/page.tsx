import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { serviceIndex, serviceSlugs } from "@/lib/i18n/service-slugs";
import { getPageTitles, serviceTitles } from "@/lib/i18n/titles";
import { localizedMetadata } from "@/lib/metadata";
import { serviceJsonLd } from "@/lib/structured-data";
import { site, whatsappUrl } from "@/lib/site";
import { Section } from "@/components/SectionHeading";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { WeChatContactButton } from "@/components/WeChatContact";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

type Params = { lang: Locale; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => serviceSlugs.map((s) => ({ lang, slug: s[lang] })));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const i = serviceIndex(params.lang, params.slug);
  if (i < 0) return { title: { absolute: getPageTitles(params.lang).notFound } };
  const service = getDictionary(params.lang).services.items[i];
  return localizedMetadata({
    locale: params.lang,
    path: Object.fromEntries(locales.map((l) => [l, `/services/${serviceSlugs[i][l]}`])) as Record<Locale, string>,
    title: serviceTitles[params.lang][i],
    description: service.short,
  });
}

const labels: Record<Locale, { all: string; others: string; email: string }> = {
  fr: { all: "Tous nos services", others: "Autres services", email: "Écrire un e-mail" },
  en: { all: "All services", others: "Other services", email: "Send an email" },
  zh: { all: "全部服务", others: "其他服务", email: "发送电子邮件" },
};

export default function ServicePage({ params }: { params: Params }) {
  const i = serviceIndex(params.lang, params.slug);
  if (i < 0) notFound();
  const { lang } = params;
  const dict = getDictionary(lang);
  const service = dict.services.items[i];
  const t = labels[lang];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(lang, i)) }}
      />
      <Section className="bg-gradient-to-b from-parchment to-white !pb-10">
        <Link
          href={`/${lang}/services`}
          className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-navy underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.all}
        </Link>
        <h1 className="h-serif mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">{service.title}</h1>
        <p className="body-lead mt-6 max-w-2xl">{service.short}</p>
        <p className="mt-6 max-w-2xl border-l-2 border-fred pl-4 text-base italic leading-relaxed text-slate">
          {service.benefit}
        </p>
      </Section>

      <Section className="!pt-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              {dict.services.includesTitle}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="card-base flex items-start gap-3 p-5 text-sm leading-relaxed text-slate">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fred" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">{service.disclaimer}</p>
          </div>

          <aside className="card-base h-fit p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl font-medium text-ink">{dict.contact.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{dict.contact.localNote}</p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-800"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {dict.actions.whatsappAdvisor}
              </a>
              <a
                href={site.emailHref}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-navy/25 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-navy/50"
              >
                <Mail className="h-4 w-4" />
                {t.email}
              </a>
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href={site.phoneHref}
                  aria-label={dict.actions.callLabel}
                  title={dict.actions.callLabel}
                  className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full border border-navy/25 bg-white text-navy transition-colors hover:border-navy/50"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <WeChatContactButton locale={lang} />
              </div>
            </div>
          </aside>
        </div>

        <div className="rule-fine my-16" />

        <nav aria-label={t.others}>
          <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-slate">{t.others}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dict.services.items.map((s, j) =>
              j === i ? null : (
                <li key={s.slug}>
                  <Link
                    href={`/${lang}/services/${serviceSlugs[j][lang]}`}
                    className="card-base focus-ring group flex h-full items-center justify-between gap-3 p-5 text-sm font-semibold text-ink transition-all hover:-translate-y-[2px] hover:border-navy/25 hover:text-navy hover:shadow-lift"
                  >
                    {s.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-navy transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>
    </>
  );
}
