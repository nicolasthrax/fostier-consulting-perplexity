import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/careers/auth";
import { purgeExpired, readApplications, storageSelfTest } from "@/lib/careers/storage";
import { RETENTION_DAYS, commissionOptions, jobs, pipelineStages, workAuthorizationOptions } from "@/lib/careers/config";
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

  const check = await storageSelfTest();
  if (check.ok) await purgeExpired().catch(() => undefined);
  let applications = check.ok ? await readApplications().catch(() => null) : [];
  const storageError = !check.ok
    ? `Storage check failed: ${check.detail} Fix: in Vercel, open Storage → your Blob store (Private) → Connect Project → this project, then redeploy.`
    : applications === null
      ? "The application store couldn't be read."
      : "";
  applications ??= [];
  applications.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <AdminBoard
      initial={applications}
      storageError={storageError}
      storageStatus={check.ok ? check.detail : ""}
      stages={[...pipelineStages]}
      jobs={jobs.map(({ slug, title, open }) => ({ slug, title: title.en, open }))}
      retentionDays={RETENTION_DAYS}
      commissionOptions={commissionOptions}
      workAuthorizations={workAuthorizationOptions}
    />
  );
}
