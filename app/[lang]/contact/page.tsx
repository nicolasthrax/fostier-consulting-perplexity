import type { ReactNode } from "react";
import type { Metadata } from "next";
import { CalendarCheck, Languages, Mail, MapPin, Phone } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { contactCopy } from "@/lib/i18n/contact";
import { PageHero, Section } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { WhatsAppLogo } from "@/components/BrandIcons";
import type { Locale } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { pageDescriptions } from "@/lib/i18n/descriptions";
import { contactJsonLd } from "@/lib/structured-data";
import { site, whatsappUrl } from "@/lib/site";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  return localizedMetadata({
    locale: params.lang,
    path: "/contact",
    title: getPageTitles(params.lang).contact,
    description: pageDescriptions[params.lang].contact,
  });
}

/** One labelled line of a details list: label beside the value, or above it when the two lists share the width (lg). */
function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-8 lg:grid-cols-1 lg:gap-1.5 xl:grid-cols-[10rem_1fr] xl:gap-8">
      <dt className="label flex items-center gap-2.5 self-start pt-1">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 font-serif text-xl leading-snug text-ink">{children}</dd>
    </div>
  );
}

export default async function ContactPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = (await props.params) as { lang: Locale };
  const dict = getDictionary(lang);
  const c = contactCopy[lang];
  const whatsapp = whatsappUrl(dict.actions.whatsappMessage);
  const icon = "h-4 w-4 shrink-0 text-fred";
  const valueLink = "focus-ring link-underline [overflow-wrap:anywhere] hover:text-navy";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd(lang)) }} />
      <PageHero
        title={c.title}
        lead={c.lead}
        after={
          <div className="fade-in mt-9 flex flex-col gap-3 [animation-delay:.24s] sm:flex-row sm:flex-wrap">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="focus-ring btn-primary w-full sm:w-auto">
              <WhatsAppIcon className="h-4 w-4" />
              {dict.actions.whatsappAdvisor}
            </a>
            <a href={site.phoneHref} className="focus-ring btn-outline tabular w-full sm:w-auto">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
          </div>
        }
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="h-serif text-3xl sm:text-4xl">{c.reachTitle}</h2>
            <dl className="mt-8 border-t border-ink">
              <Row icon={<Phone className={icon} aria-hidden="true" />} label={c.phone}>
                <a href={site.phoneHref} className={`${valueLink} tabular`}>
                  {site.phoneDisplay}
                </a>
              </Row>
              <Row icon={<WhatsAppLogo className="h-4 w-4 shrink-0" />} label={c.whatsapp}>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${valueLink} tabular`}>
                  {site.whatsappDisplay}
                </a>
              </Row>
              <Row icon={<Mail className={icon} aria-hidden="true" />} label={c.primaryEmail}>
                <a href={site.emailHref} className={valueLink}>
                  {site.email}
                </a>
                <span className="mt-1 block font-sans text-sm text-muted">{site.founder}</span>
              </Row>
              <Row icon={<Mail className={icon} aria-hidden="true" />} label={c.backupEmail}>
                <a href={site.backupContact.emailHref} className={valueLink}>
                  {site.backupContact.email}
                </a>
                <span className="mt-1 block font-sans text-sm text-muted">
                  {site.backupContact.name} · {c.backupNote}
                </span>
              </Row>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="h-serif text-3xl sm:text-4xl">{c.practicalTitle}</h2>
            <dl className="mt-8 border-t border-ink">
              <Row icon={<MapPin className={icon} aria-hidden="true" />} label={c.areaLabel}>
                {c.area}
              </Row>
              <Row icon={<Languages className={icon} aria-hidden="true" />} label={c.languagesLabel}>
                {c.languages}
              </Row>
              <Row icon={<CalendarCheck className={icon} aria-hidden="true" />} label={c.appointmentsLabel}>
                {c.appointments}
              </Row>
            </dl>
          </Reveal>
        </div>

        <LegalDisclaimer dict={dict} className="mt-16" />
      </Section>
    </>
  );
}
