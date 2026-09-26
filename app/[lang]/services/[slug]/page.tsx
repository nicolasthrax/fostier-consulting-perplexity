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
import { PageHero, Section } from "@/components/SectionHeading";
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
      <PageHero
        title={service.title}
        lead={service.short}
        before={
          <Link href={`/${lang}/services`} className="focus-ring link-arrow mb-8 text-[15px]">
            <ArrowLeft className="h-4 w-4" />
            {t.all}
          </Link>
        }
        after={<p className="fade-in mt-8 max-w-2xl font-serif text-2xl leading-snug text-navy [animation-delay:.2s]">{service.benefit}</p>}
      />

      <Section className="!pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="h-serif text-3xl sm:text-4xl">{dict.services.includesTitle}</h2>
            <ul className="mt-8 grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-line py-4 text-base leading-relaxed text-ink">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-fred" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{service.disclaimer}</p>
          </div>

          <aside className="envelope h-fit lg:sticky lg:top-28">
            <div className="envelope-inner p-7 sm:p-8">
            <h2 className="h-serif text-3xl leading-tight">{dict.contact.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate">{dict.contact.localNote}</p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring btn-primary"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {dict.actions.whatsappAdvisor}
              </a>
              <a
                href={site.emailHref}
                className="focus-ring btn-outline"
              >
                <Mail className="h-4 w-4" />
                {t.email}
              </a>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={site.phoneHref}
                  aria-label={dict.actions.callLabel}
                  title={dict.actions.callLabel}
                  className="focus-ring btn-icon"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <WeChatContactButton locale={lang} />
              </div>
            </div>
            </div>
          </aside>
        </div>

        <div className="rule-fine my-16" />

        <nav aria-label={t.others}>
          <h2 className="h-serif text-3xl">{t.others}</h2>
          <ul className="mt-6 grid border-t border-ink sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
            {dict.services.items.map((s, j) =>
              j === i ? null : (
                <li key={s.slug} className="border-b border-line">
                  <Link
                    href={`/${lang}/services/${serviceSlugs[j][lang]}`}
                    className="focus-ring wipe-row group flex h-full items-center justify-between gap-3 px-2 py-4 font-serif text-lg leading-snug text-ink"
                  >
                    <span className="wipe-fg">{s.title}</span>
                    <ArrowRight className="wipe-fg h-4 w-4 shrink-0 text-navy transition-transform group-hover:translate-x-1" />
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
