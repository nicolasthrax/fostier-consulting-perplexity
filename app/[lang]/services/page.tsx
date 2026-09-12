import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/SectionHeading";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ServicesExplorer, type ExplorerService } from "@/components/ServicesExplorer";
import type { Locale } from "@/lib/i18n/config";

export default function ServicesPage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  const services: ExplorerService[] = dict.services.items;

  return (
    <>
      <Section className="bg-gradient-to-b from-parchment to-white !pb-10">
        <h1 className="h-serif max-w-3xl text-4xl leading-tight sm:text-5xl">
          {dict.services.pageTitle}
        </h1>
        <p className="body-lead mt-6 max-w-2xl">{dict.services.pageIntro}</p>
      </Section>

      <Section className="!pt-6">
        <ServicesExplorer services={services} />
        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>
    </>
  );
}
