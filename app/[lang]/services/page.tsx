import { Check } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/SectionHeading";
import { ServiceIcon } from "@/components/icons";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import type { Locale } from "@/lib/i18n/config";

type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  benefit: string;
  icon: string;
  includes: string[];
  disclaimer: string;
};

const benefitColumnLabel: Record<Locale, string> = {
  fr: "Ce que vous y gagnez",
  en: "What you gain",
  zh: "您能获得什么",
};

export default function ServicesPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  const services: ServiceItem[] = dict.services.items;

  return (
    <>
      <Section className="bg-gradient-to-b from-parchment to-white !pb-10">
        <h1 className="h-serif max-w-3xl text-4xl leading-tight sm:text-5xl">
          {dict.services.pageTitle}
        </h1>
        <p className="body-lead mt-6 max-w-2xl">{dict.services.pageIntro}</p>
      </Section>

      <Section className="!pt-6">
        {/* Desktop table */}
        <div className="card-base hidden overflow-hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-parchment">
                <th scope="col" className="px-8 py-5 text-xs font-semibold uppercase tracking-[.18em] text-slate">
                  {dict.services.eyebrow}
                </th>
                <th scope="col" className="px-8 py-5 text-xs font-semibold uppercase tracking-[.18em] text-slate">
                  {dict.services.includesTitle}
                </th>
                <th scope="col" className="px-8 py-5 text-xs font-semibold uppercase tracking-[.18em] text-slate">
                  {benefitColumnLabel[params.lang]}
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service.slug}
                  id={service.slug}
                  className={`scroll-mt-28 align-top ${index === 0 ? "" : "border-t border-line"}`}
                >
                  <td className="w-[28%] px-8 py-8">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-parchment text-navy">
                      <ServiceIcon name={service.icon} className="h-6 w-6" />
                    </span>
                    <h2 className="mt-4 font-serif text-xl font-medium leading-snug text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{service.short}</p>
                  </td>
                  <td className="w-[46%] px-8 py-8">
                    <ul className="space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
                  </td>
                  <td className="w-[26%] px-8 py-8">
                    <p className="border-l-2 border-fred pl-4 text-sm italic leading-relaxed text-slate">
                      {service.benefit}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="space-y-6 md:hidden">
          {services.map((service) => (
            <article key={service.slug} id={service.slug} className="card-base scroll-mt-28 p-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-parchment text-navy">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-serif text-lg font-medium leading-snug text-ink">{service.title}</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{service.short}</p>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-[.18em] text-slate">
                {dict.services.includesTitle}
              </h3>
              <ul className="mt-3 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-l-2 border-fred pl-4 text-sm italic leading-relaxed text-slate">
                {service.benefit}
              </p>
              <p className="mt-5 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
            </article>
          ))}
        </div>

        <LegalDisclaimer dict={dict} className="mt-12" />
      </Section>
    </>
  );
}
