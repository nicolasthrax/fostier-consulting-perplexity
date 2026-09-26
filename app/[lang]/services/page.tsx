import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHero, Section } from "@/components/SectionHeading";
import { ContactEnvelope } from "@/components/ContactEnvelope";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ServicesExplorer, type ExplorerService } from "@/components/ServicesExplorer";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { serviceSlugs } from "@/lib/i18n/service-slugs";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  return localizedMetadata({
    locale: params.lang,
    path: "/services",
    title: getPageTitles(params.lang).services,
    description: getDictionary(params.lang).services.pageIntro,
  });
}

export default function ServicesPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  const services: ExplorerService[] = dict.services.items.map((s, i) => ({
    ...s,
    href: `/${params.lang}/services/${serviceSlugs[i][params.lang]}`,
  }));

  return (
    <>
      <PageHero title={dict.services.pageTitle} lead={dict.services.pageIntro} />

      <Section className="!pt-14">
        <ServicesExplorer services={services} moreLabel={dict.actions.learnMore} />
        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>

      <ContactEnvelope locale={params.lang} dict={dict} />
    </>
  );
}
