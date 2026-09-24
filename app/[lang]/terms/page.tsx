import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { LegalArticle } from "@/components/LegalArticle";

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const dict = getDictionary(params.lang);
  const page = dict.legal.pages.terms;
  return localizedMetadata({
    locale: params.lang,
    path: "/terms",
    title: getPageTitles(params.lang).terms,
    description: page.sections[0]?.body ?? dict.meta.siteDescription,
  });
}

export default function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  return <LegalArticle page={dict.legal.pages.terms} dict={dict} />;
}
