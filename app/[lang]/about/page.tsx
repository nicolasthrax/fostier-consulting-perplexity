import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getFounder, FOUNDER_PORTRAIT_SRC } from "@/lib/i18n/founder";
import { PageHero, Section } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { AdvisorArrow } from "@/components/AdvisorArrow";
import { UniversityHighlight, BioWithHighlights } from "@/components/UniversityHighlight";
import { StampPortrait } from "@/components/Stamp";
import { ContactEnvelope } from "@/components/ContactEnvelope";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  return localizedMetadata({
    locale: params.lang,
    path: "/about",
    title: getPageTitles(params.lang).about,
    description: getDictionary(params.lang).about.mission.paragraphs[0],
  });
}

const advisorArrowLabel: Record<Locale, string> = {
  fr: "Aller à la section « Votre conseillère »",
  en: "Jump to the Your advisor section",
  zh: "跳转到「您的专属顾问」部分",
};

export default function AboutPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  const a = dict.about;
  const f = getFounder(params.lang);
  const subheading = "font-serif text-2xl text-ink";

  return (
    <>
      <PageHero title={a.title} />
      <AdvisorArrow label={advisorArrowLabel[params.lang] ?? advisorArrowLabel.en} />

      <Section>
        <Reveal className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
          <h2 className="h-serif text-3xl sm:text-4xl">{a.mission.title}</h2>
          <div className="max-w-3xl border-t border-ink pt-6">
            {a.mission.paragraphs.map((p, i) => (
              <p key={p} className={i === 0 ? "font-serif text-2xl leading-snug text-ink sm:text-[1.75rem]" : "body-lead mt-6"}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </Section>

      <section id="advisor" aria-labelledby="advisor-heading" className="scroll-mt-24 bg-mist py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-20">
          <div>
            <div className="lg:sticky lg:top-32">
              <Reveal className="mx-auto w-full max-w-[19rem] -rotate-2 lg:max-w-none">
                <StampPortrait
                  src={FOUNDER_PORTRAIT_SRC}
                  alt={f.portraitAlt}
                  name={f.name}
                  caption={f.role}
                  sizes="(min-width: 1024px) 336px, 304px"
                />
              </Reveal>
            </div>
          </div>

          <div className="min-w-0">
            <p className="label">{f.heading}</p>
            <h2 id="advisor-heading" className="h-serif mt-3 text-4xl leading-[1.05] sm:text-5xl">
              {f.name}
            </h2>
            <p className="mt-3 text-[15px] font-medium text-navy">
              {f.role} · {f.location}
            </p>

            <div className="mt-8 max-w-2xl">
              {f.bio.map((p) => (
                <p key={p} className="body-lead mt-5 first:mt-0">
                  <BioWithHighlights text={p} locale={params.lang} />
                </p>
              ))}
            </div>

            <h3 className={`${subheading} mt-16`}>{f.experienceTitle}</h3>
            <ol className="mt-6 border-t border-ink">
              {f.experience.map((e) => (
                <li key={e.company} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <p className="flex items-center gap-2.5 self-start pt-1 text-[15px] font-semibold text-ink">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 ${e.current ? "bg-fred" : "bg-navy"}`} />
                    {e.company}
                  </p>
                  <div>
                    <p className="font-serif text-xl leading-snug text-ink">{e.role}</p>
                    <p className="mt-0.5 text-sm text-muted">{e.location}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className={`${subheading} mt-16`}>{f.educationTitle}</h3>
            <ul className="mt-6 border-t border-ink">
              {f.education.map((ed) => (
                <li key={ed.school} className="flex items-start justify-between gap-6 border-b border-line py-6">
                  <div>
                    <p className="font-serif text-xl leading-snug text-ink">{ed.degree}</p>
                    <p className="mt-1 text-[15px] font-semibold text-slate">
                      <UniversityHighlight uniKey={ed.key} locale={params.lang}>
                        {ed.school}
                      </UniversityHighlight>
                    </p>
                    <p className="mt-1 text-sm text-muted">{ed.location}</p>
                  </div>
                  {ed.logo && (
                    <Image src={ed.logo} alt="" width={44} height={44} className="h-11 w-11 shrink-0 object-contain" />
                  )}
                </li>
              ))}
            </ul>

            <h3 className={`${subheading} mt-16`}>{f.pressTitle}</h3>
            <a
              href={f.press.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group mt-6 grid gap-5 rounded-sm border-t-4 border-fred bg-white p-6 transition-colors hover:bg-navy sm:grid-cols-[auto_1fr] sm:p-8"
            >
              <Image src="/brand/ufe-logo.svg" alt="UFE" width={48} height={48} className="h-12 w-12 rounded-sm bg-white object-contain p-1" />
              <span>
                <span className="block text-sm font-medium text-muted transition-colors group-hover:text-white/75">
                  {f.press.outlet} · {f.press.date}
                </span>
                <span className="mt-2 block font-serif text-2xl leading-snug text-ink transition-colors group-hover:text-white">
                  {f.press.title}
                </span>
                <span className="mt-3 block text-[15px] leading-relaxed text-slate transition-colors group-hover:text-white/85">
                  {f.press.text}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy transition-colors group-hover:text-white">
                  {f.press.linkLabel}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </a>

            <LegalDisclaimer dict={dict} className="mt-16" />
          </div>
        </div>
      </section>

      <ContactEnvelope locale={params.lang} dict={dict} />
    </>
  );
}
