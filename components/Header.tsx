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

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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

  const links = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];

  return (
    <header className="header-shell sticky top-0 z-50 bg-white" data-scrolled={scrolled}>
      <div aria-hidden="true" className="par-avion h-1.5" />
      <div className={`container-site flex items-center justify-between gap-4 transition-[padding] duration-300 ${scrolled ? "py-1.5" : "py-3"}`}>
        <Logo locale={locale} />
        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className="focus-ring link-underline text-[15px] font-medium text-ink transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} label={dict.nav.languageSwitcher} />
          <a
            href={whatsappUrl(dict.actions.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring btn-primary hidden !py-2.5 text-sm sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {dict.actions.whatsapp}
          </a>
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
          <nav aria-label="Mobile" className="container-site flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring border-b border-line py-4 font-serif text-2xl text-ink hover:text-navy"
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
              className="focus-ring btn-primary flex-1"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {dict.actions.whatsapp}
            </a>
            <a href={site.phoneHref} className="focus-ring btn-outline flex-1">
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
