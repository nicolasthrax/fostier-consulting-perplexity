import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { adultOptions, commissionOptions, jobs, openJob, publicBase, publicOptions, workAuthorizationOptions } from "@/lib/careers/config";
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

export default async function JobPage({ params }: Props) {
  const { lang, slug } = await params;
  const job = openJob(slug);
  if (!job) notFound();
  const t = careersCopy[lang];

  return (
    <div className="container-site py-10 sm:py-16">
      {/* One centred column at a readable measure: the description, then the application form. */}
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="space-y-7">
          <Link href={publicBase(lang)} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="link-underline">{t.job.back}</span>
          </Link>
          <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{job.title[lang]}</h1>
          <p className="font-sans text-base font-medium text-muted">{job.location[lang]} · {job.type[lang]}</p>
          {job.sections[lang].map((sec, i) => (
            <section key={i}>
              {sec.heading && <h2 className="font-serif text-2xl text-ink">{sec.heading}</h2>}
              {sec.body && (
                <p className={`${sec.heading ? "mt-3 " : ""}body-lead`}>{sec.body}</p>
              )}
              {sec.items && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[17px] leading-[1.65] text-slate marker:text-fred sm:text-lg">
                  {sec.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
          <div className="border-t border-line pt-6">
            <h2 className="font-serif text-2xl text-ink">{t.job.termsHeading}</h2>
            <ul className="mt-3 space-y-2 text-base leading-relaxed text-slate sm:text-[17px]">
              {job.terms[lang].map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <p className="text-[15px] leading-relaxed text-muted">{t.equalOpportunity}</p>
          <p className="text-[15px] leading-relaxed text-muted">
            {t.index.questions}{" "}
            <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
          </p>
        </div>
        <div className="envelope">
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
