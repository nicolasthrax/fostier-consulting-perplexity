"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {locales,localeLabels,type Locale} from "@/lib/i18n/config";
export function LanguageSwitcher({current,label}:{current:Locale;label:string}){const pathname=usePathname()??"/fr";const targetPath=(locale:Locale)=>pathname.replace(/^\/(fr|en)(?=\/|$)/,`/${locale}`);return <nav aria-label={label} className="flex items-center rounded-full border border-line bg-white/70 p-.5 text-xs font-semibold">{locales.map(locale=><Link key={locale} href={targetPath(locale)} lang={locale} hrefLang={locale} aria-current={locale===current?"true":undefined} className={`focus-ring rounded-full px-2.5 py-1 transition-colors ${locale===current?"bg-navy text-white":"text-muted hover:text-navy"}`}>{localeLabels[locale]}</Link>)}</nav>}
