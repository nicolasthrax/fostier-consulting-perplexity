import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { site, whatsappUrl } from "@/lib/site";
import { WeChatContactButton } from "@/components/WeChatContact";
import { AdvisorMapPill } from "@/components/AdvisorMapPill";
import { HeroGlobe } from "@/components/HeroGlobe";


export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  return localizedMetadata({
    locale: params.lang,
    path: "",
    title: getPageTitles(params.lang).home,
    description: getDictionary(params.lang).meta.siteDescription,
  });
}

export default function HomePage({ params: { lang } }: { params: { lang: "fr" | "en" } }) {
  const dict = getDictionary(lang);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-parchment via-white to-white">
        <div className="h-[3px] bg-gradient-to-r from-navy via-navy-100 to-fred/70" />

        <div className="container-site grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <a
              href={dict.hero.ufePartnerUrl || "https://www.ufehongkong.hk/partenaires/fostier-consulting"}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-navy/15 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-navy shadow-xs backdrop-blur-xs transition-all hover:border-navy/30 hover:bg-white hover:shadow-soft"
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-navy/5">
                <Image
                  src="/brand/ufe-logo.svg"
                  alt="UFE"
                  width={20}
                  height={20}
                  className="h-full w-full object-contain"
                />
              </span>
              <span>{dict.hero.ufePartnerBadge}</span>
              <ExternalLink className="h-3.5 w-3.5 text-navy/60 transition-transform group-hover:translate-x-0.5 group-hover:text-navy" />
            </a>

            <h1 className="h-serif mt-5 text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">
              {dict.hero.title}
            </h1>

            <p className="body-lead mt-6 max-w-xl">{dict.hero.subtitle}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center justify-center rounded-full bg-navy px-6 py-4 text-center text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-800"
              >
                {dict.actions.whatsappAdvisor}
              </a>

              <a
                href={site.phoneHref}
                aria-label={dict.actions.callLabel}
                title={dict.actions.callLabel}
                className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full border border-navy/25 bg-white text-navy transition-colors hover:border-navy/50"
              >
                <Phone className="h-4 w-4" />
              </a>

              <WeChatContactButton locale={lang} />

              <Link
                href={`/${lang}/services`}
                className="focus-ring inline-flex items-center justify-center gap-1.5 px-1 py-2 text-sm font-semibold text-navy underline-offset-4 hover:underline"
              >
                {dict.actions.discoverServices}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <HeroGlobe>
            <AdvisorMapPill locale={lang} />
          </HeroGlobe>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">{dict.intro.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.intro.title}</h2>
          </div>

          <div>
            {dict.intro.paragraphs.map((p: string) => (
              <p key={p} className="body-lead mb-5">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-20 sm:py-28">
        <div className="container-site">
          <p className="eyebrow">{dict.services.eyebrow}</p>
          <h2 className="h-serif mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
            {dict.services.title}
          </h2>
          <p className="body-lead mt-4 max-w-2xl">{dict.services.subtitle}</p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {dict.services.items.map((service: { slug: string; title: string; benefit: string }) => (
              <Link
                key={service.slug}
                href={`/${lang}/services#${service.slug}`}
                className="card-base focus-ring group flex min-h-[180px] flex-col p-7 transition-all hover:-translate-y-[2px] hover:border-navy/25 hover:shadow-lift"
              >
                <h3 className="font-serif text-xl font-medium text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.benefit}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-navy">
                  {dict.actions.learnMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">{dict.hongkong.eyebrow}</p>
          <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.hongkong.title}</h2>

          {dict.hongkong.paragraphs.map((p: string) => (
            <p key={p} className="body-lead mt-5">
              {p}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
