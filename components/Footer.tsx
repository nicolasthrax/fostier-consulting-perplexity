import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { LinkedInLogo, WhatsAppLogo } from "./BrandIcons";
import { WeChatContactLogo } from "./WeChatContact";
import { site, whatsappUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { guidesCopy, hasGuides } from "@/lib/guides";
import { RiskWarning } from "./RiskWarning";
import { publicBase } from "@/lib/careers/config";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const brLabel: Record<Locale, string> = { fr: "N° BR", en: "BR No.", zh: "商业登记号码" };
const careersLabel: Record<Locale, string> = { fr: "Carrières", en: "Careers", zh: "招聘" };
const noticeLabel: Record<Locale, string> = { fr: "Informations importantes", en: "Important information", zh: "重要信息" };

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
    ...(hasGuides() ? [{ href: `/${locale}/guides`, label: guidesCopy[locale].nav }] : []),
    // The recruitment portal is French and English only; Chinese readers get the English pages.
    { href: publicBase(locale === "fr" ? "fr" : "en"), label: careersLabel[locale] },
  ];
  const legal = [
    { href: `/${locale}/privacy`, label: dict.footer.links.privacy },
    { href: `/${locale}/cookies`, label: dict.footer.links.cookies },
    { href: `/${locale}/terms`, label: dict.footer.links.terms },
    { href: `/${locale}/legal-notice`, label: dict.footer.links.notice },
  ];
  const heading = "font-serif text-lg text-ink";
  const subLink = "focus-ring min-h-6 inline-block text-sm text-white/75 hover:text-white focus-visible:outline-white";
  // Every footer link is at least 24px tall (WCAG 2.5.8 target size). Text links are
  // inline blocks whose underline sits on an inner inline span, so it still follows
  // each line when a label wraps; icon links are flex rows.
  const target = "focus-ring min-h-6";
  const iconLink = `${target} inline-flex items-center gap-2 text-slate hover:text-navy`;
  const link = `${target} inline-block text-[15px] text-slate hover:text-navy`;

  return (
    <footer className="bg-white">
      <div aria-hidden="true" className="par-avion h-1.5" />
      {/* Identity and contact details, then the two site indexes. */}
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1.2fr] lg:gap-16">
        <div className="space-y-6 sm:col-span-2 lg:col-span-1">
          <Logo locale={locale} className="h-[64px] w-[134px]" />
          <p className="max-w-xs text-[15px] leading-relaxed text-slate">{dict.footer.tagline}</p>
          <ul className="space-y-3 text-[15px]">
            <li className="flex min-h-6 items-center gap-2 font-medium text-ink">
              <MapPin className="h-4 w-4 text-fred" aria-hidden="true" />
              {dict.footer.location}
            </li>
            <li>
              <a href={site.phoneHref} className={`${target} inline-flex items-center gap-2 tabular font-semibold text-navy`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="link-underline">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={site.emailHref} className={iconLink}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="link-underline">{site.email}</span>
              </a>
            </li>
            {/* Messaging and professional profiles: official logos, grouped on one row. */}
            <li className="flex items-center gap-1 pt-1">
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.actions.whatsapp}
                title="WhatsApp"
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm opacity-90 transition-opacity hover:opacity-100"
              >
                <WhatsAppLogo className="h-6 w-6" />
              </a>
              <WeChatContactLogo locale={locale} />
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm opacity-90 transition-opacity hover:opacity-100"
              >
                <LinkedInLogo className="h-6 w-6" />
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label={dict.footer.navTitle}>
          <h2 className={heading}>{dict.footer.navTitle}</h2>
          <ul className="mt-4 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  <span className="link-underline">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={dict.footer.servicesTitle}>
          <h2 className={heading}>{dict.footer.servicesTitle}</h2>
          <ul className="mt-4 space-y-3">
            {dict.services.items.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/${locale}/services/${serviceSlugs[i][locale]}`} className={link}>
                  <span className="link-underline">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Regulatory-style disclosure: its own labelled band, ahead of the copyright line. */}
      <div className="border-y border-line bg-mist">
        <div className="container-site py-8">
          <RiskWarning locale={locale} variant="footer" />
          <h2 className="mt-6 text-sm font-semibold text-ink">{noticeLabel[locale]}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate">{dict.legal.disclaimer}</p>
        </div>
      </div>

      {/* Copyright and registration on the left, legal documents on the right. */}
      <div className="bg-nuit text-white/75">
        <div className="container-site flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <p className="text-sm">
            {dict.footer.copyright.replace("{year}", String(year))} · {brLabel[locale]} {site.brn}
          </p>
          <nav aria-label={dict.footer.legalTitle}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={subLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
