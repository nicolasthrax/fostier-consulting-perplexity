import Image from "next/image";
import { ExternalLink, Newspaper } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getFounder, FOUNDER_PORTRAIT_SRC } from "@/lib/i18n/founder";
import { Section } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { AdvisorArrow } from "@/components/AdvisorArrow";
import { UniversityHighlight, BioWithHighlights } from "@/components/UniversityHighlight";
import type { Locale } from "@/lib/i18n/config";

const advisorArrowLabel: Record<Locale, string> = {
  fr: "Aller à la section « Votre conseillère »",
  en: "Jump to the Your advisor section",
  zh: "跳转到「您的专属顾问」部分",
};

export default function AboutPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  const a = dict.about;
  const f = getFounder(params.lang);

  return (
    <>
      <Section className="bg-gradient-to-b from-parchment to-white">
        <h1 className="h-serif max-w-3xl text-4xl leading-tight sm:text-5xl">
          {a.title}
        </h1>
      </Section>
      <AdvisorArrow label={advisorArrowLabel[params.lang] ?? advisorArrowLabel.en} />
      <Section className="!pt-0">
        <div className="grid gap-16">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              {a.mission.title}
            </h2>
            {a.mission.paragraphs.map((p) => (
              <p key={p} className="body-lead mt-5">
                {p}
              </p>
            ))}
          </Reveal>

          <div className="rule-fine" />

          <div id="advisor" className="scroll-mt-28">
            <Reveal>
              <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {f.heading}
              </h2>
              <div className="card-base mt-8 grid gap-10 p-8 sm:p-12 lg:grid-cols-[280px_1fr]">
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                    <Image
                      src={FOUNDER_PORTRAIT_SRC}
                      alt={f.portraitAlt}
                      fill
                      sizes="(min-width: 1024px) 280px, 100vw"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-medium text-ink">
                    {f.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-navy">{f.role}</p>
                </div>

                <div>
                  {f.bio.map((p, idx) => (
                    <p
                      key={p}
                      className="mt-4 text-sm leading-relaxed text-muted first:mt-0 sm:text-[15px]"
                    >
                      {idx === 1 ? (
                        <BioWithHighlights text={p} locale={params.lang} />
                      ) : (
                        p
                      )}
                    </p>
                  ))}

                  <div className="rule-fine my-8" />

                  <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-slate">
                    {f.experienceTitle}
                  </h3>
                  <ol className="mt-6 space-y-8 border-l-2 border-line">
                    {f.experience.map((e) => (
                      <li key={e.company} className="relative pl-6">
                        <span
                          className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                            e.current ? "bg-fred" : "bg-navy"
                          }`}
                        />
                        <p className="font-serif text-lg font-medium leading-snug text-ink">
                          {e.role}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-navy">
                          {e.company} · {e.location}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {e.detail}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <div className="rule-fine my-8" />

                  <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-slate">
                    {f.educationTitle}
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {f.education.map((ed) => (
                      <div
                        key={ed.school}
                        className="relative rounded-2xl border border-line bg-parchment p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-serif text-base font-medium leading-snug text-ink">
                              {ed.degree}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate">
                              <UniversityHighlight uniKey={ed.key} locale={params.lang}>
                                {ed.school}
                              </UniversityHighlight>
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[.14em] text-muted">
                              {ed.location}
                            </p>
                          </div>
                          {ed.logo && (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white p-1 border border-line shadow-xs">
                              <Image
                                src={ed.logo}
                                alt={ed.school}
                                width={40}
                                height={40}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rule-fine my-8" />

                  <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-slate">
                    {f.pressTitle}
                  </h3>
                  <a
                    href={f.press.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group mt-6 flex items-start gap-4 rounded-2xl border border-line bg-gradient-to-br from-white via-parchment to-navy-50 p-6 transition-all hover:-translate-y-[2px] hover:border-navy/25 hover:shadow-lift"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-navy">
                      <Newspaper className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-serif text-lg font-medium leading-snug text-ink">
                        {f.press.title}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-slate">
                        {f.press.outlet} · {f.press.date}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted">
                        {f.press.text}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                        {f.press.linkLabel}
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <LegalDisclaimer dict={dict} />
        </div>
      </Section>
    </>
  );
}
