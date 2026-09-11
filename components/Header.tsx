"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
    { href: `/${locale}#approche`, label: dict.nav.approach },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/insights`, label: dict.nav.insights },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="header-shell sticky top-0 z-50" data-scrolled={scrolled}>
      <div className={`container-site flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
        <Logo locale={locale} />
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="focus-ring accent-line rounded-sm pb-1 text-sm font-medium text-slate transition-colors hover:text-navy">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} label={dict.nav.languageSwitcher} />
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="container-site border-t border-line py-4 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="focus-ring border-b border-line/60 py-3.5 font-serif text-lg text-ink hover:text-navy">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="pt-4 text-sm text-muted">
            {dict.contact.localNote}{" "}
            <a href={site.phoneHref} className="font-semibold text-navy underline">{site.phoneDisplay}</a>
          </p>
        </div>
      )}
    </header>
  );
}