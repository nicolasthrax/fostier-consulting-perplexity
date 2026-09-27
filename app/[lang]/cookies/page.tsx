import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { pageDescriptions } from "@/lib/i18n/descriptions";
import { LegalArticle } from "@/components/LegalArticle";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  return localizedMetadata({
    locale: params.lang,
    path: "/cookies",
    title: getPageTitles(params.lang).cookies,
    description: pageDescriptions[params.lang].cookies,
  });
}

export default function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  return <LegalArticle page={dict.legal.pages.cookies} dict={dict} />;
}
