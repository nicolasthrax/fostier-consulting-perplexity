import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { adminEnabled, currentAdmin, namedLogins, sessionSecret } from "@/lib/careers/auth";
import { readApplicationListPurged, storageAvailable, storageBackend, storageSelfTest } from "@/lib/careers/storage";
import { RETENTION_DAYS, commissionOptions, jobs, pipelineStages, publicBase, workAuthorizationOptions, type ApplicationSummary } from "@/lib/careers/config";
import { DEFAULT_CAREERS_LOCALE } from "@/lib/careers/i18n";
import { AdminLogin } from "@/components/careers/AdminLogin";
import { AdminBoard } from "@/components/careers/AdminBoard";

export const metadata: Metadata = { title: "Candidates" };
export const dynamic = "force-dynamic";

const STORAGE_FIX = "Fix: in Vercel, open Storage → your Blob store (Private) → Connect Project → this project, then redeploy.";
const NO_SESSION_SECRET =
  "CAREERS_SESSION_SECRET isn't set, so sign-in cookies are signed with your passwords: anyone who copies one could try to guess the password from it. Set it to a random value of 32+ characters (e.g. the output of openssl rand -base64 32) in Vercel → Settings → Environment Variables, then redeploy. Everyone will need to sign in again once.";

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
  let applications: ApplicationSummary[] = [];
  let etag = "";
  let storageError = "";
  if (!storageAvailable()) {
    // On Vercel without a Blob store, local reads "succeed" with nothing in them.
    const check = await storageSelfTest();
    storageError = `Storage check failed: ${check.detail} ${STORAGE_FIX}`;
  } else {
    try {
      // Expired applications are dropped in the same pass (no extra read, and a write only if any expired).
      ({ applications, etag } = await readApplicationListPurged());
    } catch (err) {
      const check = await storageSelfTest();
      storageError = check.ok
        ? `The application store couldn't be read: ${(err as Error).message}`
        : `Storage check failed: ${check.detail} ${STORAGE_FIX}`;
    }
  }

  return (
    <AdminBoard
      initial={applications}
      initialEtag={etag}
      renderId={randomUUID()}
      storageError={storageError}
      storageStatus={storageError ? "" : storageBackend() === "blob" ? "Storage: Vercel Blob (private)" : "Storage: local files"}
      configWarning={sessionSecret() ? "" : NO_SESSION_SECRET}
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
