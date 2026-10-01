import type { Metadata } from "next";
import { site } from "@/lib/site";
import { CareersShell } from "@/components/careers/CareersShell";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: { template: `%s | ${site.name}`, default: `Candidates | ${site.name}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport = { themeColor: "#002395", width: "device-width", initialScale: 1 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <CareersShell lang="en" showLanguageSwitch={false}>{children}</CareersShell>;
}
