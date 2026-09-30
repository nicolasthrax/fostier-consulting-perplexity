import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { caseStudies } from "@/lib/i18n/case-studies";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { Section } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * "Typical situations": composite, illustrative scenarios (not client stories),
 * as a ruled index like the service list. The disclaimer sits under the heading
 * so it is read before the examples.
 */
export function CaseStudies({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = caseStudies[locale] ?? caseStudies.fr;

  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <div>
          <h2 id="situations" className="h-serif scroll-mt-24 text-3xl sm:text-4xl">
            {c.heading}
          </h2>
        </div>
        <div className="min-w-0 max-w-3xl">
          <p className="body-lead">{c.intro}</p>
          <p className="mt-4 border-l-2 border-fred pl-4 text-[15px] leading-relaxed text-muted">{c.disclaimer}</p>

          <ol className="mt-10 border-t border-ink">
            {c.items.map((item, i) => (
              <li key={item.title} className="border-b border-line py-8">
                <Reveal>
                  <div className="grid gap-4 sm:grid-cols-[3rem_1fr] sm:gap-6">
                    <span aria-hidden="true" className="font-serif text-3xl leading-none text-fred">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl leading-snug text-ink">{item.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-slate">{item.situation}</p>

                      <p className="label mt-6">{c.stepsLabel}</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-slate marker:text-fred">
                        {item.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>

                      <p className="label mt-6">{c.servicesLabel}</p>
                      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                        {item.services.map((s) => (
                          <li key={s}>
                            <Link
                              href={`/${locale}/services/${serviceSlugs[s][locale]}`}
                              className="focus-ring link-arrow text-[15px]"
                            >
                              {dict.services.items[s].title}
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
