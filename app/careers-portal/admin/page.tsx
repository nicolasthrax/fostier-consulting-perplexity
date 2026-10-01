import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/careers/auth";
import { readApplications } from "@/lib/careers/storage";
import { commissionOptions, jobs, pipelineStages, workAuthorizationOptions } from "@/lib/careers/config";
import { AdminLogin } from "@/components/careers/AdminLogin";
import { AdminBoard } from "@/components/careers/AdminBoard";

export const metadata: Metadata = { title: "Candidates" };
export const dynamic = "force-dynamic";

export default async function CareersAdminPage() {
  if (!adminEnabled()) {
    return (
      <div className="container-site max-w-xl py-16">
        <h1 className="h-serif text-3xl">Admin not configured</h1>
        <p className="body-lead mt-4">
          Set <code className="rounded-sm bg-white px-1.5 py-0.5 text-[15px]">CAREERS_ADMIN_PASSWORD</code> (8+
          characters) in the server environment to enable the candidate dashboard.
        </p>
      </div>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;

  let applications = await readApplications().catch(() => null);
  const storageError = applications === null;
  applications ??= [];
  applications.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <AdminBoard
      initial={applications}
      storageError={storageError}
      stages={[...pipelineStages]}
      jobs={jobs.map(({ slug, title, open }) => ({ slug, title, open }))}
      commissionOptions={commissionOptions}
      workAuthorizations={workAuthorizationOptions}
    />
  );
}
