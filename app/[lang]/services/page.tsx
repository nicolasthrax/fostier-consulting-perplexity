import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHero, Section } from "@/components/SectionHeading";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ServicesExplorer, type ExplorerService } from "@/components/ServicesExplorer";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { pageDescriptions } from "@/lib/i18n/descriptions";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  return localizedMetadata({
    locale: params.lang,
    path: "/services",
    title: getPageTitles(params.lang).services,
    description: pageDescriptions[params.lang].services,
  });
}

export default async function ServicesPage(props: { params: Promise<{ lang: string }> }) {
  const params = (await props.params) as { lang: Locale };
  const dict = getDictionary(params.lang);
  const services: ExplorerService[] = dict.services.items.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    short: s.short,
    benefit: s.benefit,
    disclaimer: s.disclaimer,
    href: `/${params.lang}/services/${serviceSlugs[i][params.lang]}`,
  }));

  return (
    <>
      <PageHero title={dict.services.pageTitle} lead={dict.services.pageIntro} />

      <Section className="!pt-14">
        <ServicesExplorer services={services} moreLabel={dict.actions.learnMore} />
        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>

    </>
  );
}
