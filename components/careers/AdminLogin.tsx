"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { API_BASE } from "@/lib/careers/config";

/** `named`: several people have their own login (CAREERS_ADMIN_USERS), so ask who is signing in. */
export function AdminLogin({ named = false }: { named?: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: named ? name : "", password }),
    }).catch(() => null);
    if (res?.ok) return router.refresh();
    setBusy(false);
    setError(((await res?.json().catch(() => null)) as { error?: string } | null)?.error || "Sign-in failed.");
  };

  return (
    <div className="container-site flex justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-sm rounded-sm border border-line bg-white p-6 sm:p-8">
        <Lock className="h-6 w-6 text-navy" aria-hidden="true" />
        <h1 className="h-serif mt-4 text-3xl">Candidate dashboard</h1>
        {named && (
          <>
            <label htmlFor="admin-name" className="mt-6 block text-[15px] font-semibold text-ink">Name</label>
            <input
              id="admin-name"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "admin-password-error" : undefined}
              className="focus-ring mt-2 block w-full rounded-sm border border-line px-3.5 py-3 text-[15px] text-ink aria-[invalid=true]:border-fred-700"
              required
            />
          </>
        )}
        <label htmlFor="admin-password" className={`${named ? "mt-4" : "mt-6"} block text-[15px] font-semibold text-ink`}>Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "admin-password-error" : undefined}
          className="focus-ring mt-2 block w-full rounded-sm border border-line px-3.5 py-3 text-[15px] text-ink aria-[invalid=true]:border-fred-700"
          required
        />
        {error && <p id="admin-password-error" role="alert" className="mt-1.5 text-sm font-medium text-fred-700">{error}</p>}
        <button type="submit" className="btn-primary focus-ring mt-6 w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Sign in
        </button>
      </form>
    </div>
  );
}
