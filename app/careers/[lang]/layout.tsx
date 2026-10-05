import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { careersCopy, careersLocales, isCareersLocale } from "@/lib/careers/i18n";
import { CareersShell } from "@/components/careers/CareersShell";
import { jsonLd, organisationJsonLd } from "@/lib/structured-data";
import "../../globals.css";

/**
 * Recruitment portal, in French (/careers, rewritten to /careers/fr by the
 * middleware) and English (/careers/en). Linked from the site footer; the landing
 * and job pages are indexable and listed in the sitemap, while the application
 * forms and the candidate notice opt out in their own metadata.
 */
export function generateStaticParams() {
  return careersLocales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export const viewport = { themeColor: "#002395", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = careersCopy[isCareersLocale(lang) ? lang : "fr"];
  return {
    metadataBase: new URL(site.baseUrl),
    title: { template: `%s | ${site.name}`, default: `${t.careers} | ${site.name}` },
    robots: { index: true, follow: true },
    referrer: "no-referrer",
  };
}

export default async function CareersLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isCareersLocale(lang)) notFound();
  // Now that the portal is indexable, it carries the same site-wide graph as the public pages.
  return (
    <CareersShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organisationJsonLd(lang)) }} />
      {children}
    </CareersShell>
  );
}
