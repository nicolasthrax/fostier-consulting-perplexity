import type { Metadata } from "next";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { roleOptions, workAuthorizationOptions } from "@/lib/careers/config";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Apply" };

export default function CareersPortalPage() {
  return (
    <div className="container-site py-10 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="space-y-5">
          <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">Work with Fostier Consulting</h1>
          <p className="body-lead max-w-md">
            We advise French residents in Hong Kong on their finances, and companies working between France and
            China. If you are analytical, careful with detail and comfortable in more than one language, we would
            like to hear from you.
          </p>
          <p className="max-w-md text-[15px] leading-relaxed text-slate">
            The application takes about five minutes. You can review everything before you send it.
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Questions? Write to{" "}
            <a href={site.emailHref} className="focus-ring font-semibold text-navy link-underline">{site.email}</a>.
          </p>
        </div>
        <div className="envelope">
          <div className="envelope-inner p-5 sm:p-8">
            <ApplicationForm
              roles={roleOptions}
              workAuthorizations={workAuthorizationOptions.map(({ value, label }) => ({ value, label }))}
              staticWebhook={process.env.NEXT_PUBLIC_CAREERS_WEBHOOK_URL || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
