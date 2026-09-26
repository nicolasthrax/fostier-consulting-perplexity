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
    <section className="container-site flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="-rotate-3 rounded-sm border-2 border-fred-700 px-4 py-2 font-sans text-sm font-bold tracking-[.12em] text-fred-700">
        RETOUR À L&apos;EXPÉDITEUR
      </p>
      <h1 className="h-serif mt-8 text-6xl sm:text-7xl">404</h1>
      <p className="body-lead mt-4 max-w-md">
        Cette page n&apos;existe pas ou a changé d&apos;adresse. — This page could not be found.
      </p>
      <Link href="/fr" className="focus-ring btn-primary mt-8">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
