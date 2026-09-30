import Link from "next/link";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WeChatContactChip } from "./WeChatContact";
import { site, whatsappUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { guidesCopy, hasGuides } from "@/lib/guides";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const brLabel: Record<Locale, string> = { fr: "N° BR", en: "BR No.", zh: "商业登记号码" };
const llmsLabel: Record<Locale, string> = { fr: "Infos pour LLMs", en: "LLM info", zh: "AI 助手信息" };

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
    ...(hasGuides() ? [{ href: `/${locale}/guides`, label: guidesCopy[locale].nav }] : []),
  ];
  const legal = [
    { href: `/${locale}/privacy`, label: dict.footer.links.privacy },
    { href: `/${locale}/cookies`, label: dict.footer.links.cookies },
    { href: `/${locale}/terms`, label: dict.footer.links.terms },
    { href: `/${locale}/legal-notice`, label: dict.footer.links.notice },
  ];
  const heading = "font-serif text-lg text-ink";
  // Every footer link is at least 24px tall (WCAG 2.5.8 target size). Text links are
  // inline blocks whose underline sits on an inner inline span, so it still follows
  // each line when a label wraps; icon links are flex rows.
  const target = "focus-ring min-h-6";
  const iconLink = `${target} inline-flex items-center gap-2 text-slate hover:text-navy`;
  const link = `${target} inline-block text-[15px] text-slate hover:text-navy`;

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
        <div>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={site.phoneHref} className={`${target} inline-block tabular font-semibold text-navy`}>
                <span className="link-underline">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={site.emailHref} className={iconLink}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="link-underline">{site.email}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(dict.actions.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLink}
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span className="link-underline">{dict.actions.whatsapp}</span>
              </a>
            </li>
            {/* The chip's button is shared, so the footer sets its minimum height here. */}
            <li className="[&>button]:min-h-6">
              <WeChatContactChip locale={locale} />
            </li>
            <li>
              <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className={iconLink}>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span className="link-underline">LinkedIn</span>
              </a>
            </li>
          </ul>
          <h2 className={`${heading} mt-10`}>{dict.footer.legalTitle}</h2>
          <ul className="mt-4 space-y-3">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  <span className="link-underline">{l.label}</span>
                </Link>
              </li>
            ))}
            {/* Plain-text route, not a page: a regular anchor so Next doesn't try to prefetch it. */}
            <li>
              <a href="/llms.txt" type="text/plain" className={link}>
                <span className="link-underline">{llmsLabel[locale]}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-nuit text-white/75">
        <div className="container-site flex flex-col gap-4 py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p className="max-w-3xl text-sm leading-relaxed">{dict.legal.disclaimer}</p>
          <p className="shrink-0 text-sm">{dict.footer.copyright.replace("{year}", String(year))} · {brLabel[locale]} {site.brn}</p>
        </div>
      </div>
    </footer>
  );
}
