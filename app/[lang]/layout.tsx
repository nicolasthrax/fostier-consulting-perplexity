import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { organisationJsonLd } from "@/lib/structured-data";
import { playfair, inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport = {
  themeColor: "#002395",
  width: "device-width",
  initialScale: 1,
};

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const dict = getDictionary(params.lang);
  return {
    metadataBase: new URL(site.baseUrl),
    applicationName: site.name,
    title: { template: "%s — Fostier Consulting", default: dict.meta.siteTitle },
    description: dict.meta.siteDescription,
    keywords: dict.meta.keywords,
    robots: { index: true, follow: true },
  };
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  if (!locales.includes(lang)) notFound();
  const dict = getDictionary(lang);
  const jsonLd = organisationJsonLd(lang);

  return (
    <html lang={dict.htmlLang} className={`${playfair.variable} ${inter.variable} font-sans`}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
          {lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <Header locale={lang} dict={dict} />
        <main id="main" className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
        <FloatingWhatsApp dict={dict} />
      </body>
    </html>
  );
}