"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { site, whatsappUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const navCopy: Record<Locale, { primary: string; mobile: string }> = {
  fr: { primary: "Navigation principale", mobile: "Menu mobile" },
  en: { primary: "Primary", mobile: "Mobile menu" },
  zh: { primary: "主导航", mobile: "移动端菜单" },
};

export function Header({ locale, dict, guidesLabel }: { locale: Locale; dict: Dictionary; guidesLabel?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const t = navCopy[locale];
  const links = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
    ...(guidesLabel ? [{ href: `/${locale}/guides`, label: guidesLabel }] : []),
  ];
  const isCurrent = (href: string) => (href.startsWith("/") && pathname.startsWith(href) ? "page" : undefined);

  return (
    <header className="header-shell sticky top-0 z-50 bg-white" data-scrolled={scrolled}>
      <div aria-hidden="true" className="par-avion h-1.5" />
      <div className={`container-site flex items-center justify-between gap-4 transition-[padding] duration-300 ${scrolled ? "py-1.5" : "py-3"}`}>
        <Logo locale={locale} />
        <nav aria-label={t.primary} className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href)}
              className="focus-ring link-underline text-[15px] font-medium text-ink transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher current={locale} label={dict.nav.languageSwitcher} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-sm border border-ink/20 text-ink lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <nav aria-label={t.mobile} className="container-site flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(link.href)}
                className="focus-ring border-b border-line py-4 font-serif text-2xl text-ink hover:text-navy aria-[current=page]:text-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="container-site flex flex-wrap gap-3 py-5">
            <a
              href={whatsappUrl(dict.actions.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring btn-primary flex-1 whitespace-nowrap"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {dict.actions.whatsapp}
            </a>
            <a href={site.phoneHref} className="focus-ring btn-outline tabular flex-1 whitespace-nowrap">
              <Phone className="h-4 w-4" />
              {site.phoneDisplay}
            </a>
            <p className="w-full text-sm text-muted">{dict.contact.localNote}</p>
          </div>
        </div>
      )}
    </header>
  );
}
