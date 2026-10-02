import Image from "next/image";
import { BotIdClient } from "botid/client";
import { newsreader, bricolage } from "@/lib/fonts";
import { site } from "@/lib/site";
import { careersCopy, type CareersLocale } from "@/lib/careers/i18n";
import { API_BASE, publicBase } from "@/lib/careers/config";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * Requests BotID checks (botid/server) on: anything not listed here fails the check.
 * Loaded on the portal only, not on the public site.
 */
const botProtected = [
  { path: `${API_BASE}/apply`, method: "POST" },
  { path: `${API_BASE}/admin/login`, method: "POST" },
] as const;

/**
 * Page frame for the unlisted recruitment portal: its own <html>, so it shares none
 * of the public site's navigation, analytics or structured data.
 */
export function CareersShell({
  lang,
  showLanguageSwitch = true,
  children,
}: {
  lang: CareersLocale;
  showLanguageSwitch?: boolean;
  children: React.ReactNode;
}) {
  const t = careersCopy[lang];
  const link = "focus-ring min-h-6 inline-block hover:text-navy";
  return (
    <html lang={t.htmlLang} className={`${newsreader.variable} ${bricolage.variable} font-sans`}>
      <head>
        <BotIdClient protect={[...botProtected]} />
      </head>
      <body className="flex min-h-screen flex-col bg-mist">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-navy focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
          {t.skip}
        </a>
        <header className="bg-white">
          <div aria-hidden="true" className="par-avion h-1.5" />
          <div className="container-site flex items-center justify-between gap-4 py-4">
            <a href={`/${lang}`} className="focus-ring inline-block shrink-0">
              <Image
                src={site.logoPath}
                alt="Fostier Consulting"
                width={2000}
                height={2000}
                priority
                sizes="140px"
                className="h-[46px] w-[96px] object-cover [object-position:50%_36%] sm:h-[54px] sm:w-[112px]"
              />
            </a>
            <div className="flex items-center gap-4">
              <p className="label hidden sm:block">{t.careers}</p>
              {showLanguageSwitch && <LanguageSwitch lang={lang} label={t.switchTo} />}
            </div>
          </div>
          <div className="rule-fine" />
        </header>
        <main id="main" className="flex-1">{children}</main>
        <footer className="border-t border-line bg-white">
          <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 text-sm text-muted">
            <p>© {new Date().getFullYear()} {site.legalName}, {site.city} · {t.footer.brn}</p>
            {showLanguageSwitch && (
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                <li><a href={`${publicBase(lang)}/privacy`} className={link}>{t.footer.notice}</a></li>
                <li><a href={`/${lang}/legal-notice`} className={link}>{t.footer.legal}</a></li>
              </ul>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
