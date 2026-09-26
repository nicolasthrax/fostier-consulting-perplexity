"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {locales,localeLabels,type Locale} from "@/lib/i18n/config";
import {localizePath} from "@/lib/i18n/service-slugs";
export function LanguageSwitcher({current,label}:{current:Locale;label:string}){const pathname=usePathname()??"/fr";return <nav aria-label={label} className="flex items-center text-[13px] font-semibold">{locales.map((locale,i)=><span key={locale} className="flex items-center">{i>0&&<span aria-hidden="true" className="px-1 text-line">/</span>}<Link href={localizePath(pathname,locale)} lang={locale} hrefLang={locale} aria-current={locale===current?"true":undefined} className={`focus-ring rounded-sm px-1.5 py-1.5 transition-colors ${locale===current?"text-fred-700":"text-muted hover:text-navy"}`}>{localeLabels[locale]}</Link></span>)}</nav>}
