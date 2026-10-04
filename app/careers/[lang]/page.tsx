import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { jobs, publicBase } from "@/lib/careers/config";
import { careersCopy, careersLocales, type CareersLocale } from "@/lib/careers/i18n";
import { withBrand } from "@/lib/metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ lang: CareersLocale }> };

/**
 * The layout's title template only applies to child segments, not to this page,
 * so the brand is added here ("Careers | Fostier Consulting").
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = careersCopy[lang].index;
  return {
    title: { absolute: withBrand(t.metaTitle) },
    description: t.metaDescription,
    alternates: {
      canonical: publicBase(lang),
      languages: {
        ...Object.fromEntries(careersLocales.map((l) => [l, publicBase(l)])),
        "x-default": publicBase("fr"),
      },
    },
  };
}

export default async function CareersIndexPage({ params }: Props) {
  const { lang } = await params;
  const t = careersCopy[lang];
  const open = jobs.filter((j) => j.open);
  return (
    <div className="container-site py-10 sm:py-16">
      <div className="max-w-2xl space-y-5">
        <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{t.index.title}</h1>
        <p className="body-lead">{t.index.intro}</p>
      </div>
      {open.length ? (
        <ul className="mt-10 border-t border-line bg-white">
          {open.map((job) => (
            <li key={job.slug} className="border-b border-line">
              <Link href={`${publicBase(lang)}/jobs/${job.slug}`} className="wipe-row focus-ring group grid gap-3 px-5 py-6 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-6">
                <div className="min-w-0">
                  <h2 className="wipe-fg font-serif text-2xl text-ink">{job.title[lang]}</h2>
                  <p className="wipe-fg mt-1 text-[15px] text-slate">{job.summary[lang]}</p>
                </div>
                <p className="wipe-fg text-sm text-muted">{job.location[lang]} · {job.type[lang]}</p>
                <ArrowRight className="wipe-fg h-5 w-5 text-navy" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-lead mt-10">{t.index.none}</p>
      )}
      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{t.equalOpportunity}</p>
      <p className="mt-4 text-sm text-muted">
        {t.index.questions}{" "}
        <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
      </p>
    </div>
  );
}
