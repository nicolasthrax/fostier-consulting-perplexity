import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WeChatContactChip } from "./WeChatContact";
import { site, whatsappUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];
  const legal = [
    { href: `/${locale}/privacy`, label: dict.footer.links.privacy },
    { href: `/${locale}/cookies`, label: dict.footer.links.cookies },
    { href: `/${locale}/terms`, label: dict.footer.links.terms },
    { href: `/${locale}/legal-notice`, label: dict.footer.links.notice },
  ];
  const heading = "font-serif text-lg text-ink";
  const link = "focus-ring link-underline text-[15px] text-slate hover:text-navy";

  return (
    <footer className="bg-white">
      <div aria-hidden="true" className="par-avion h-1.5" />
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_.7fr_1.3fr_1fr]">
        <div className="space-y-5">
          <Logo locale={locale} className="h-[64px] w-[134px]" />
          <p className="max-w-xs text-[15px] leading-relaxed text-slate">{dict.footer.tagline}</p>
          <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
            <MapPin className="h-4 w-4 text-fred" aria-hidden="true" />
            {dict.footer.location}
          </p>
        </div>
        <nav aria-label={dict.footer.navTitle}>
          <h2 className={heading}>{dict.footer.navTitle}</h2>
          <ul className="mt-4 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
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
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={heading}>{dict.footer.contactTitle}</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={site.phoneHref} className="focus-ring link-underline tabular font-semibold text-navy">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.emailHref} className="focus-ring inline-flex items-center gap-2 text-slate hover:text-navy">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="link-underline">{site.email}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 text-slate hover:text-navy"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span className="link-underline">{dict.actions.whatsapp}</span>
              </a>
            </li>
            <li>
              <WeChatContactChip locale={locale} />
            </li>
          </ul>
          <h2 className={`${heading} mt-10`}>{dict.footer.legalTitle}</h2>
          <ul className="mt-4 space-y-3">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-nuit text-white/75">
        <div className="container-site flex flex-col gap-4 py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p className="max-w-3xl text-xs leading-relaxed">{dict.legal.disclaimer}</p>
          <p className="shrink-0 text-xs">{dict.footer.copyright.replace("{year}", String(year))}</p>
        </div>
      </div>
    </footer>
  );
}
