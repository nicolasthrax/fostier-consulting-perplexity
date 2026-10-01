import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { careersCopy, careersLocales, isCareersLocale } from "@/lib/careers/i18n";
import { CareersShell } from "@/components/careers/CareersShell";
import "../../globals.css";

/**
 * Unlisted recruitment portal, in English (/careers, rewritten to /careers/en by
 * the middleware) and French (/careers/fr). Never linked from the site, the
 * sitemap or robots.txt, and marked noindex.
 */
export function generateStaticParams() {
  return careersLocales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export const viewport = { themeColor: "#002395", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = careersCopy[isCareersLocale(lang) ? lang : "en"];
  return {
    metadataBase: new URL(site.baseUrl),
    title: { template: `%s | ${site.name}`, default: `${t.careers} | ${site.name}` },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    referrer: "no-referrer",
  };
}

export default async function CareersLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isCareersLocale(lang)) notFound();
  return <CareersShell lang={lang}>{children}</CareersShell>;
}
