import type { Metadata } from "next";
import Image from "next/image";
import { newsreader, bricolage } from "@/lib/fonts";
import { site } from "@/lib/site";
import "../globals.css";

/**
 * Unlisted recruitment portal. It has its own root layout so it shares none of the
 * public site's navigation, footer, analytics or structured data, and it is never
 * linked from the site, the sitemap or robots.txt.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: { template: `%s | ${site.name}`, default: `Careers | ${site.name}` },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
};

export const viewport = {
  themeColor: "#002395",
  width: "device-width",
  initialScale: 1,
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${bricolage.variable} font-sans`}>
      <body className="flex min-h-screen flex-col bg-mist">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-navy focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
          Skip to content
        </a>
        <header className="bg-white">
          <div aria-hidden="true" className="par-avion h-1.5" />
          <div className="container-site flex items-center justify-between gap-4 py-4">
            <Image
              src={site.logoPath}
              alt="Fostier Consulting"
              width={2000}
              height={2000}
              priority
              sizes="140px"
              className="h-[46px] w-[96px] object-cover [object-position:50%_36%] sm:h-[54px] sm:w-[112px]"
            />
            <p className="label">Careers</p>
          </div>
          <div className="rule-fine" />
        </header>
        <main id="main" className="flex-1">{children}</main>
        <footer className="border-t border-line bg-white">
          <div className="container-site flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-muted">
            <p>© {new Date().getFullYear()} {site.legalName}, {site.city}</p>
            <p>Your data is used only to assess your application.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
