import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartLine,
  ExternalLink,
  Factory,
  FileText,
  Handshake,
  Landmark,
  Languages,
  MapPin,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { site, whatsappUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { WeChatContactButton } from "@/components/WeChatContact";
import { AdvisorMapPill } from "@/components/AdvisorMapPill";
import { HeroGlobe } from "@/components/HeroGlobe";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getFounder } from "@/lib/i18n/founder";

const serviceIcons: Record<string, LucideIcon> = {
  bank: Landmark,
  chart: ChartLine,
  document: FileText,
  factory: Factory,
  language: Languages,
  partners: Handshake,
  shield: ShieldCheck,
};

const credentialsLabel: Record<Locale, string> = {
  fr: "Le parcours de votre conseillère",
  en: "Your advisor's background",
  zh: "顾问履历",
};

const credentialsLink: Record<Locale, string> = {
  fr: "Voir le profil",
  en: "View profile",
  zh: "查看简介",
};

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  return localizedMetadata({
    locale: params.lang,
    path: "",
    title: getPageTitles(params.lang).home,
    description: getDictionary(params.lang).meta.siteDescription,
  });
}

export default function HomePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const founder = getFounder(lang);
  const pastEmployers = founder.experience.filter((e) => !e.current);

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
                className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full bg-navy px-6 py-4 text-center text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-800"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {dict.actions.whatsappAdvisor}
              </a>

              <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-xs">
                <a
                  href={site.phoneHref}
                  aria-label={dict.actions.callLabel}
                  title={dict.actions.callLabel}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy-50"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <WeChatContactButton locale={lang} sizeClassName="h-10 w-10" />
              </div>
            </div>

            <Link
              href={`/${lang}/services`}
              className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-navy underline-offset-4 hover:underline"
            >
              {dict.actions.discoverServices}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <HeroGlobe>
            <AdvisorMapPill locale={lang} />
          </HeroGlobe>
        </div>
      </section>

      <section aria-label={credentialsLabel[lang]} className="border-y border-line bg-white">
        <div className="container-site flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">
            {credentialsLabel[lang]}
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {pastEmployers.map((e) => (
              <li key={e.company} className="font-serif text-lg font-medium text-slate/80">
                {e.company}
              </li>
            ))}
            {founder.education.map((ed) => (
              <li key={ed.school} className="flex items-center gap-2.5 text-sm font-semibold text-slate/80">
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-line bg-white p-0.5 shadow-xs">
                  <Image src={ed.logo} alt="" width={32} height={32} className="h-full w-full object-contain" />
                </span>
                {ed.school}
              </li>
            ))}
          </ul>
          <Link
            href={`/${lang}/about#advisor`}
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-semibold text-navy underline-offset-4 hover:underline"
          >
            {credentialsLink[lang]}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">{dict.intro.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.intro.title}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            {dict.intro.paragraphs.map((p: string) => (
              <p key={p} className="body-lead mb-5">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-parchment py-20 sm:py-28">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow">{dict.services.eyebrow}</p>
            <h2 className="h-serif mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
              {dict.services.title}
            </h2>
            <p className="body-lead mt-4 max-w-2xl">{dict.services.subtitle}</p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {dict.services.items.map((service, i) => {
              const Icon = serviceIcons[service.icon] ?? ArrowRight;
              return (
                <Reveal key={service.slug} delay={(i % 2) * 0.08}>
                  <Link
                    href={`/${lang}/services/${serviceSlugs[i][lang]}`}
                    className="card-base focus-ring group flex h-full min-h-[180px] flex-col p-7 transition-all hover:-translate-y-[2px] hover:border-navy/25 hover:shadow-lift"
                  >
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-xl font-medium text-ink">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{service.benefit}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-navy">
                      {dict.actions.learnMore}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">{dict.hongkong.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.hongkong.title}</h2>
            <p className="mt-6 flex items-start gap-2 text-sm font-medium text-slate">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fred" />
              {dict.contact.localNote}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {dict.hongkong.paragraphs.map((p: string, i: number) =>
              i === dict.hongkong.paragraphs.length - 1 && i > 0 ? (
                <p
                  key={p}
                  className="mt-8 border-l-2 border-fred pl-5 font-serif text-xl leading-relaxed text-ink sm:text-2xl"
                >
                  {p}
                </p>
              ) : (
                <p key={p} className="body-lead mb-5">
                  {p}
                </p>
              ),
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
