import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Analytics } from "@vercel/analytics/next";
import { organisationJsonLd } from "@/lib/structured-data";
import { newsreader, bricolage } from "@/lib/fonts";
import { site } from "@/lib/site";
import { getPageTitles } from "@/lib/i18n/titles";
import { withBrand } from "@/lib/metadata";
import { guidesCopy, hasGuides } from "@/lib/guides";
import "../globals.css";

const skipLinkLabel: Record<Locale, string> = {
  fr: "Aller au contenu",
  en: "Skip to content",
  zh: "跳到主要内容",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Only the three locales exist; anything else 404s before a page can render with it.
export const dynamicParams = false;

export const viewport = {
  themeColor: "#002395",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = (await props.params) as { lang: Locale };
  const dict = getDictionary(params.lang);
  return {
    metadataBase: new URL(site.baseUrl),
    applicationName: site.name,
    title: { template: `%s | ${site.name}`, default: withBrand(getPageTitles(params.lang).home) },
    description: dict.meta.siteDescription,
    keywords: dict.meta.keywords,
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  if (!locales.includes(lang)) notFound();
  const dict = getDictionary(lang);
  const jsonLd = organisationJsonLd(lang);

  return (
    <html lang={dict.htmlLang} className={`${newsreader.variable} ${bricolage.variable} font-sans`}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-navy focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
          {skipLinkLabel[lang]}
        </a>
        <Header locale={lang} dict={dict} guidesLabel={hasGuides() ? guidesCopy[lang].nav : undefined} />
        <main id="main" className="flex-1">
          <LocaleProvider locale={lang}>{children}</LocaleProvider>
        </main>
        <Footer locale={lang} dict={dict} />
        {/* Cookieless audience measurement; only reports on Vercel deployments. */}
        <Analytics />
      </body>
    </html>
  );
}
