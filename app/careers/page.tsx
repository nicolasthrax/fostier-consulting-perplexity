import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { jobs, publicBase } from "@/lib/careers/config";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPortalPage() {
  const open = jobs.filter((j) => j.open);
  return (
    <div className="container-site py-10 sm:py-16">
      <div className="max-w-2xl space-y-5">
        <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">Work with Fostier Consulting</h1>
        <p className="body-lead">
          We advise French residents in Hong Kong on their finances, and companies working between France and China.
          No experience is needed, and students are welcome to apply. Choose an open position below.
        </p>
      </div>
      {open.length ? (
        <ul className="mt-10 border-t border-line bg-white">
          {open.map((job) => (
            <li key={job.slug} className="border-b border-line">
              <Link href={`${publicBase()}/jobs/${job.slug}`} className="wipe-row focus-ring group grid gap-3 px-5 py-6 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-6">
                <div className="min-w-0">
                  <h2 className="wipe-fg font-serif text-2xl text-ink">{job.title}</h2>
                  <p className="wipe-fg mt-1 text-[15px] text-slate">{job.summary}</p>
                </div>
                <p className="wipe-fg text-sm text-muted">{job.location} · {job.type}</p>
                <ArrowRight className="wipe-fg h-5 w-5 text-navy" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="body-lead mt-10">There are no open positions right now.</p>
      )}
      <p className="mt-8 text-sm text-muted">
        Questions? Write to{" "}
        <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
      </p>
    </div>
  );
}
