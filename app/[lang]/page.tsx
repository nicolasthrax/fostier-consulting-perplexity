import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { site, whatsappUrl } from "@/lib/site";
import { WeChatContactButton } from "@/components/WeChatContact";
import { AdvisorMapPill } from "@/components/AdvisorMapPill";
import { HeroGlobe } from "@/components/HeroGlobe";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { RiseTitle } from "@/components/RiseTitle";
import { Postmark } from "@/components/Postmark";
import { ServiceIndex } from "@/components/ServiceIndex";
import { StampPortrait } from "@/components/Stamp";
import { DualClock } from "@/components/DualClock";
import { ContactEnvelope } from "@/components/ContactEnvelope";
import { getFounder, FOUNDER_PORTRAIT_SRC } from "@/lib/i18n/founder";

const credentialsLabel: Record<Locale, string> = {
  fr: "Son parcours",
  en: "Background",
  zh: "履历",
};

const credentialsLink: Record<Locale, string> = {
  fr: "Lire son profil complet",
  en: "Read her full profile",
  zh: "查看完整简介",
};

const clockLabel: Record<Locale, string> = {
  fr: "L'heure, en ce moment",
  en: "Local time, right now",
  zh: "此刻时间",
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
  const credentials = [
    ...pastEmployers.map((e) => ({ name: e.company, logo: e.logo })),
    ...founder.education.map((ed) => ({ name: ed.school, logo: ed.logo })),
  ];
  const hkParagraphs: string[] = dict.hongkong.paragraphs;
  const hkQuote = hkParagraphs.length > 1 ? hkParagraphs[hkParagraphs.length - 1] : null;
  const hkBody = hkQuote ? hkParagraphs.slice(0, -1) : hkParagraphs;

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden bg-white">
        <div className="container-site grid items-center gap-14 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
          <div>
            <RiseTitle
              text={dict.hero.title}
              className="h-serif text-[2.6rem] leading-[1.04] sm:text-[3.4rem] xl:text-[4rem]"
            />

            <p className="body-lead fade-in mt-7 max-w-xl [animation-delay:.45s]">{dict.hero.subtitle}</p>

            <div className="fade-in mt-9 flex flex-wrap items-center gap-3 [animation-delay:.6s]">
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {dict.actions.whatsappAdvisor}
              </a>
              <a href={site.phoneHref} aria-label={dict.actions.callLabel} title={dict.actions.callLabel} className="focus-ring btn-icon">
                <Phone className="h-4 w-4" />
              </a>
              <WeChatContactButton locale={lang} />
            </div>

            <div className="fade-in mt-10 flex flex-col gap-4 border-t border-line pt-6 text-[15px] [animation-delay:.75s] sm:flex-row sm:items-center sm:gap-8">
              <Link href={`/${lang}/services`} className="focus-ring link-arrow">
                {dict.actions.discoverServices}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={dict.hero.ufePartnerUrl || site.ufePartnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group inline-flex items-center gap-2.5 text-slate hover:text-navy"
              >
                <Image src="/brand/ufe-logo.svg" alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                <span className="link-underline">{dict.hero.ufePartnerBadge}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="fade-in relative [animation-delay:.2s]">
            <div className="par-avion par-avion-drift rounded-sm p-2">
              <HeroGlobe className="rounded-[1px]">
                <AdvisorMapPill locale={lang} />
              </HeroGlobe>
            </div>
            <Postmark className="absolute -right-3 -top-10 h-24 w-24 rotate-12 sm:-right-8 sm:-top-12 sm:h-32 sm:w-32" />
          </div>
        </div>
      </section>

      {/* ——— Why ——— */}
      <section className="border-t border-line bg-white py-20 sm:py-28">
        <div className="container-site">
          <Reveal>
            <p className="label">{dict.intro.eyebrow}</p>
            <h2 className="h-serif mt-4 max-w-4xl text-4xl leading-[1.08] sm:text-5xl">{dict.intro.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-12 gap-y-6 md:grid-cols-3">
            {dict.intro.paragraphs.map((p: string, i: number) => (
              <Reveal key={p} delay={i * 0.08}>
                <p className={i === 0 ? "text-lg leading-relaxed text-ink" : "text-[17px] leading-relaxed text-slate"}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Services ——— */}
      <section className="bg-white pb-20 sm:pb-28">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-6 border-t-4 border-navy pt-8 md:flex-row md:items-end">
            <div>
              <p className="label">{dict.services.eyebrow}</p>
              <h2 className="h-serif mt-4 max-w-2xl text-4xl leading-[1.08] sm:text-5xl">{dict.services.title}</h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">{dict.services.subtitle}</p>
          </div>
          <div className="mt-14">
            <ServiceIndex locale={lang} dict={dict} />
          </div>
        </div>
      </section>

      {/* ——— Advisor ——— */}
      <section aria-labelledby="advisor-title" className="bg-mist py-20 sm:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
          <Reveal className="mx-auto w-full max-w-[19rem] -rotate-2 lg:max-w-none">
            <StampPortrait
              src={FOUNDER_PORTRAIT_SRC}
              alt={founder.portraitAlt}
              name={founder.name}
              caption={founder.role}
              sizes="(min-width: 1024px) 352px, 304px"
            />
          </Reveal>
          <div>
            <p className="label">{founder.heading}</p>
            <h2 id="advisor-title" className="h-serif mt-4 text-4xl leading-[1.08] sm:text-5xl">
              {founder.name}
            </h2>
            <p className="body-lead mt-6 max-w-2xl">{founder.bio[0]}</p>

            <div className="mt-10">
              <p className="text-sm font-semibold text-ink">{credentialsLabel[lang]}</p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {credentials.map(({ name, logo }) => (
                  <li key={name} className="flex items-center gap-2.5 rounded-sm border border-ink/10 bg-white py-2 pl-2 pr-4 text-sm font-medium text-ink">
                    {logo && <Image src={logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />}
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <Link href={`/${lang}/about#advisor`} className="focus-ring link-arrow mt-9 text-[15px]">
              {credentialsLink[lang]}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Hong Kong ——— */}
      <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
        <div aria-hidden="true" className="par-avion absolute inset-x-0 top-0 h-1.5" />
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-medium text-white/70">{dict.hongkong.eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl">{dict.hongkong.title}</h2>
            {hkBody.map((p) => (
              <p key={p} className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85">
                {p}
              </p>
            ))}
            <div className="mt-12 max-w-md border-t border-white/25 pt-6">
              <p className="mb-4 text-sm text-white/70">{clockLabel[lang]}</p>
              <DualClock />
            </div>
          </Reveal>
          {hkQuote && (
            <Reveal delay={0.1} className="flex items-end">
              <blockquote>
                <span aria-hidden="true" className="mb-5 block font-serif text-[5.5rem] leading-[.55] text-fred">
                  {lang === "zh" ? "“" : "«"}
                </span>
                <p className="font-serif text-3xl leading-[1.25] tracking-[-0.01em] sm:text-[2.6rem]">{hkQuote}</p>
                <footer className="mt-6 text-sm text-white/70">{dict.contact.localNote}</footer>
              </blockquote>
            </Reveal>
          )}
        </div>
      </section>

      <ContactEnvelope locale={lang} dict={dict} />
    </>
  );
}
