import type { Metadata } from "next";
import { Check, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedMetadata } from "@/lib/metadata";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { FAQAccordion } from "@/components/FAQAccordion";
import { InsightsCard } from "@/components/InsightsCard";
import { HkMapElement } from "@/components/HkMapElement";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { WhatsAppButton, CallButton } from "@/components/ContactActions";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const dict = getDictionary(params.lang);
  return localizedMetadata({
    locale: params.lang,
    path: "",
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
  });
}

export default function HomePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);

  return (
    <>
      <Hero locale={lang} dict={dict} />

      {/* Trust strip */}
      <Section className="border-y border-line bg-white !py-10">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.trust.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-50">
                  <Check className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-slate">{item.title}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Intro */}
      <Section className="bg-white">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{dict.intro.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.intro.title}</h2>
            {dict.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="body-lead mt-5">{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            {/* Editorial placeholder — replace with a quiet architectural image via next/image */}
            <div
              role="img"
              aria-label={dict.intro.imageAlt}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy-50 via-white to-parchment shadow-soft"
            >
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <g stroke="#002395" strokeOpacity="0.14" strokeWidth="1" fill="none">
                  <path d="M60 300V90l40-22v232" />
                  <path d="M130 300V40l52 26v234" />
                  <path d="M212 300V120l44-18v198" />
                  <path d="M286 300V60l54 30v210" />
                </g>
                <path d="M0 250 C 120 228, 280 270, 400 238" stroke="#ED2939" strokeOpacity="0.5" strokeWidth="1.2" fill="none" className="map-line" strokeDasharray="4 8" />
              </svg>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Services */}
      <Section className="bg-parchment">
        <SectionHeading eyebrow={dict.services.eyebrow} title={dict.services.title} subtitle={dict.services.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2">
          {dict.services.items.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.08} className="h-full">
              <ServiceCard service={service} locale={lang} learnMore={dict.actions.learnMore} />
            </Reveal>
          ))}
        </div>
        <LegalDisclaimer dict={dict} className="mt-10" />
      </Section>

      {/* Who we serve */}
      <Section className="bg-white">
        <SectionHeading eyebrow={dict.serve.eyebrow} title={dict.serve.title} subtitle={dict.serve.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.serve.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="h-full">
              <div className="card-base h-full p-7 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lift">
                <Users className="h-5 w-5 text-fred" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Approach / process */}
      <Section id="approche" className="border-y border-line bg-parchment">
        <SectionHeading eyebrow={dict.process.eyebrow} title={dict.process.title} />
        <ProcessTimeline steps={dict.process.steps} />
        <Reveal className="mt-14 flex justify-center">
          <WhatsAppButton label={dict.actions.whatsappCta} message={dict.actions.whatsappMessage} />
        </Reveal>
      </Section>

      {/* Hong Kong expertise */}
      <Section className="bg-white">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{dict.hongkong.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl leading-tight sm:text-4xl">{dict.hongkong.title}</h2>
            {dict.hongkong.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="body-lead mt-5">{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <HkMapElement label={dict.hongkong.mapLabel} />
          </Reveal>
        </div>
      </Section>

      {/* Insights */}
      <Section className="bg-parchment">
        <SectionHeading eyebrow={dict.insights.eyebrow} title={dict.insights.title} subtitle={dict.insights.subtitle} />
        <div className="grid gap-6 md:grid-cols-3">
          {dict.insights.items.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.08} className="h-full">
              <InsightsCard article={article} locale={lang} readMore={dict.insights.readMore} cmsNote={dict.insights.cmsNote} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
        <FAQAccordion items={dict.faq.items} />
      </Section>

      {/* Final contact */}
      <Section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-navy/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-fred/15 blur-3xl" aria-hidden="true" />
        <div className="container-site relative text-center">
          <Reveal>
            <p className="eyebrow !text-white/70">{dict.contact.eyebrow}</p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
              {dict.contact.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              {dict.contact.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <WhatsAppButton label={dict.actions.startWhatsapp} message={dict.actions.whatsappMessage} variant="primary" large className="!bg-white !text-navy hover:!bg-parchment" />
              <CallButton label={dict.actions.callLabel} large className="!border-white/30 !bg-transparent !text-white hover:!border-white/60" />
            </div>
            <LegalDisclaimer dict={dict} className="mx-auto mt-10 !text-white/50" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
