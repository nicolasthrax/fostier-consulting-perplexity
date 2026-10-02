/** Removes every variable that would make storage.ts pick the Blob backend (or think it runs on Vercel). */
export function clearStorageEnv() {
  for (const k of Object.keys(process.env))
    if (k.startsWith("BLOB_") || k.endsWith("_READ_WRITE_TOKEN") || k.endsWith("_STORE_ID") || k === "VERCEL" || k.startsWith("VERCEL_"))
      delete process.env[k];
}
