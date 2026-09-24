import type { Metadata } from "next";
import Link from "next/link";
import { pageTitles } from "@/lib/i18n/titles";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${pageTitles.fr.notFound} | ${site.name}` },
  robots: { index: false, follow: true },
};

/** not-found receives no route params in Next 14 — FR is the default language. */
export default function NotFound() {
  return (
    <section className="container-site flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-serif text-7xl text-navy">404</h1>
      <p className="mt-4 text-sm text-muted">Page introuvable — Page not found.</p>
      <Link
        href="/fr"
        className="focus-ring mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
