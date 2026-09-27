"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { useLocale } from "./LocaleProvider";

const copy: Record<Locale, { stamp: string; body: string; home: string; help: string; or: string }> = {
  fr: { stamp: "RETOUR À L'EXPÉDITEUR", body: "Cette page n'existe pas ou a changé d'adresse.", home: "Retour à l'accueil", help: "Besoin d'aide ? Appelez le", or: "ou écrivez à" },
  en: { stamp: "RETURN TO SENDER", body: "This page doesn't exist or has moved.", home: "Back to the home page", help: "Need help? Call", or: "or email" },
  zh: { stamp: "退回寄件人", body: "该页面不存在或已更改地址。", home: "返回首页", help: "需要帮助？请致电", or: "或发送邮件至" },
};

/** Body of the 404 page in the language of the URL it was reached from. */
export function NotFoundContent() {
  const locale = useLocale();
  const t = copy[locale];
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="-rotate-3 rounded-sm border-2 border-fred-700 px-4 py-2 font-sans text-sm font-bold tracking-[.12em] text-fred-700">{t.stamp}</p>
      <h1 className="h-serif mt-8 text-6xl sm:text-7xl">404</h1>
      <p className="body-lead mt-4 max-w-md">{t.body}</p>
      <Link href={`/${locale}`} className="focus-ring btn-primary mt-8">
        {t.home}
      </Link>
      <p id="contact" className="mt-10 text-[15px] text-slate">
        {t.help}{" "}
        <a href={site.phoneHref} className="focus-ring link-underline tabular font-semibold text-navy">{site.phoneDisplay}</a>{" "}
        {t.or}{" "}
        <a href={site.emailHref} className="focus-ring link-underline font-semibold text-navy">{site.email}</a>
      </p>
    </section>
  );
}
