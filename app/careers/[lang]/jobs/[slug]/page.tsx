import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { jobs, openJob, publicBase } from "@/lib/careers/config";
import { careersCopy, careersLocales, type CareersLocale } from "@/lib/careers/i18n";
import { site } from "@/lib/site";

type Props = { params: Promise<{ lang: CareersLocale; slug: string }> };

export function generateStaticParams() {
  return careersLocales.flatMap((lang) => jobs.filter((j) => j.open).map((j) => ({ lang, slug: j.slug })));
}
// Closed or unknown listings 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const job = openJob(slug);
  return { title: job ? job.title[lang] : careersCopy[lang].careers };
}

/** The job description; its Apply button leads to the application form (./apply). */
export default async function JobPage({ params }: Props) {
  const { lang, slug } = await params;
  const job = openJob(slug);
  if (!job) notFound();
  const t = careersCopy[lang];

  return (
    <div className="container-site py-10 sm:py-16">
      <div className="max-w-2xl space-y-5">
        <Link href={publicBase(lang)} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="link-underline">{t.job.back}</span>
        </Link>
        <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{job.title[lang]}</h1>
        <p className="label">{job.location[lang]} · {job.type[lang]}</p>
        {job.sections[lang].map((sec, i) => (
          <section key={i}>
            {sec.heading && <h2 className="font-serif text-xl text-ink">{sec.heading}</h2>}
            {sec.body && (
              <p className={`${sec.heading ? "mt-2 " : ""}${i === 0 ? "body-lead" : "text-[15px] leading-relaxed text-slate"}`}>{sec.body}</p>
            )}
            {sec.items && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate marker:text-fred">
                {sec.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
        <div className="border-t border-line pt-5">
          <h2 className="font-serif text-xl text-ink">{t.job.termsHeading}</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate">
            {job.terms[lang].map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="pt-3">
          <Link href={`${publicBase(lang)}/jobs/${job.slug}/apply`} className="btn-primary focus-ring">
            {t.job.apply}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-sm leading-relaxed text-muted">{t.equalOpportunity}</p>
        <p className="text-sm leading-relaxed text-muted">
          {t.index.questions}{" "}
          <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
        </p>
      </div>
    </div>
  );
}
