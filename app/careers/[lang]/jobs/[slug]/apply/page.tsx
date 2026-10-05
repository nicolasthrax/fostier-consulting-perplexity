import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { adultOptions, commissionOptions, jobs, openJob, publicBase, publicOptions, workAuthorizationOptions } from "@/lib/careers/config";
import { careersCopy, careersLocales, type CareersLocale } from "@/lib/careers/i18n";

type Props = { params: Promise<{ lang: CareersLocale; slug: string }> };

export function generateStaticParams() {
  return careersLocales.flatMap((lang) => jobs.filter((j) => j.open).map((j) => ({ lang, slug: j.slug })));
}
// Closed or unknown listings 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const job = openJob(slug);
  return {
    title: job ? careersCopy[lang].job.applyTitle(job.title[lang]) : careersCopy[lang].careers,
    // The form stays out of search results (the job page is the one to find); its links are followed.
    robots: { index: false, follow: true },
  };
}

/** The application form for one listing, reached from its description's Apply button. */
export default async function ApplyPage({ params }: Props) {
  const { lang, slug } = await params;
  const job = openJob(slug);
  if (!job) notFound();
  const t = careersCopy[lang];
  const listing = `${publicBase(lang)}/jobs/${job.slug}`;

  return (
    <div className="container-site py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href={listing} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="link-underline">{t.job.backToListing}</span>
        </Link>
        <h1 className="h-serif mt-5 text-4xl leading-[1.05] sm:text-5xl">{job.title[lang]}</h1>
        <p className="label mt-3">{job.location[lang]} · {job.type[lang]}</p>
        <div className="envelope mt-8">
          <div className="envelope-inner p-5 sm:p-8">
            <ApplicationForm
              lang={lang}
              noticeHref={`${publicBase(lang)}/privacy`}
              job={{ slug: job.slug, title: job.title[lang] }}
              workAuthorizations={publicOptions(workAuthorizationOptions, lang)}
              commissionOptions={publicOptions(commissionOptions, lang)}
              adultOptions={publicOptions(adultOptions, lang)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
