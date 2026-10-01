import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { commissionOptions, jobs, openJob, publicBase, workAuthorizationOptions } from "@/lib/careers/config";
import { site } from "@/lib/site";

const publicOptions = (o: typeof workAuthorizationOptions) => o.map(({ value, label }) => ({ value, label }));

export function generateStaticParams() {
  return jobs.filter((j) => j.open).map((j) => ({ slug: j.slug }));
}
// Closed or unknown listings 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const job = openJob((await params).slug);
  return { title: job ? job.title : "Careers" };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = openJob((await params).slug);
  if (!job) notFound();

  return (
    <div className="container-site py-10 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="space-y-5">
          <Link href={publicBase()} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="link-underline">All positions</span>
          </Link>
          <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{job.title}</h1>
          <p className="label">{job.location} · {job.type}</p>
          {job.description.map((p, i) => (
            <p key={i} className={i === 0 ? "body-lead max-w-md" : "max-w-md text-[15px] leading-relaxed text-slate"}>{p}</p>
          ))}
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Questions? Write to{" "}
            <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
          </p>
        </div>
        <div className="envelope">
          <div className="envelope-inner p-5 sm:p-8">
            <ApplicationForm
              job={{ slug: job.slug, title: job.title }}
              workAuthorizations={publicOptions(workAuthorizationOptions)}
              commissionOptions={publicOptions(commissionOptions)}
              staticWebhook={process.env.NEXT_PUBLIC_CAREERS_WEBHOOK_URL || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
