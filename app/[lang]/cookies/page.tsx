import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedMetadata } from "@/lib/metadata";
import { getPageTitles } from "@/lib/i18n/titles";
import { pageDescriptions } from "@/lib/i18n/descriptions";
import { LegalArticle } from "@/components/LegalArticle";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  return localizedMetadata({
    locale: params.lang,
    path: "/cookies",
    title: getPageTitles(params.lang).cookies,
    description: pageDescriptions[params.lang].cookies,
  });
}

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = (await props.params) as { lang: Locale };
  const dict = getDictionary(lang);
  return <LegalArticle page={dict.legal.pages.cookies} dict={dict} />;
}
