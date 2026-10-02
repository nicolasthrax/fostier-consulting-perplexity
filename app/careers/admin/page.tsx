import type { Metadata } from "next";
import { adminEnabled, currentAdmin, namedLogins } from "@/lib/careers/auth";
import { readApplicationsPurged, storageAvailable, storageBackend, storageSelfTest } from "@/lib/careers/storage";
import { RETENTION_DAYS, commissionOptions, jobs, pipelineStages, publicBase, workAuthorizationOptions, type ApplicationRecord } from "@/lib/careers/config";
import { DEFAULT_CAREERS_LOCALE } from "@/lib/careers/i18n";
import { AdminLogin } from "@/components/careers/AdminLogin";
import { AdminBoard } from "@/components/careers/AdminBoard";

export const metadata: Metadata = { title: "Candidates" };
export const dynamic = "force-dynamic";

const STORAGE_FIX = "Fix: in Vercel, open Storage → your Blob store (Private) → Connect Project → this project, then redeploy.";

export default async function CareersAdminPage() {
  if (!adminEnabled()) {
    return (
      <div className="container-site max-w-xl py-16">
        <h1 className="h-serif text-3xl">Admin not configured</h1>
        <p className="body-lead mt-4">
          Set <code className="rounded-sm bg-white px-1.5 py-0.5 text-[15px]">CAREERS_ADMIN_USERS</code> in the server
          environment to enable the candidate dashboard: one login per person, as JSON such as{" "}
          <code className="rounded-sm bg-white px-1.5 py-0.5 text-[15px]">{`{"lucie":"…","nicolas":"…"}`}</code>, with
          passwords of 8+ characters.
        </p>
      </div>
    );
  }
  const admin = await currentAdmin();
  if (!admin) return <AdminLogin named={namedLogins()} />;

  // A plain read costs one simple Blob operation (or a cheap 304). The self-test
  // writes a blob, an advanced operation, so it only runs to explain a failure.
  let applications: ApplicationRecord[] = [];
  let storageError = "";
  if (!storageAvailable()) {
    // On Vercel without a Blob store, local reads "succeed" with nothing in them.
    const check = await storageSelfTest();
    storageError = `Storage check failed: ${check.detail} ${STORAGE_FIX}`;
  } else {
    try {
      // Expired applications are dropped in the same pass (no extra read, and a write only if any expired).
      applications = await readApplicationsPurged();
    } catch (err) {
      const check = await storageSelfTest();
      storageError = check.ok
        ? `The application store couldn't be read: ${(err as Error).message}`
        : `Storage check failed: ${check.detail} ${STORAGE_FIX}`;
    }
  }

  applications.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <AdminBoard
      initial={applications}
      storageError={storageError}
      storageStatus={storageError ? "" : storageBackend() === "blob" ? "Storage: Vercel Blob (private)" : "Storage: local files"}
      adminName={admin}
      stages={[...pipelineStages]}
      jobs={jobs.map(({ slug, title, open }) => ({ slug, title: title.en, open }))}
      retentionDays={RETENTION_DAYS}
      commissionOptions={commissionOptions}
      workAuthorizations={workAuthorizationOptions}
      adminBase={`${publicBase(DEFAULT_CAREERS_LOCALE)}/admin`}
    />
  );
}
