"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, Upload, X } from "lucide-react";
import {
  API_BASE,
  labelFor,
  validateCvMeta,
  validateFields,
  type ApplicationInput,
  type Option,
} from "@/lib/careers/config";

type Field = keyof ApplicationInput;
type Errors = Partial<Record<Field | "cv" | "consent", string>>;

const steps = [
  { title: "Basic info", fields: ["fullName", "email", "phone", "linkedinUrl", "portfolioUrl"] as Field[] },
  { title: "CV", fields: [] as Field[] },
  { title: "Screening", fields: ["workAuthorization", "commissionOnly"] as Field[] },
  { title: "Review", fields: [] as Field[] },
];

const empty: ApplicationInput = {
  fullName: "", email: "", phone: "", linkedinUrl: "", portfolioUrl: "",
  workAuthorization: "", commissionOnly: "",
};

const inputClass =
  "focus-ring mt-2 block w-full rounded-sm border border-line bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/70 hover:border-muted aria-[invalid=true]:border-fred-700";

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[15px] font-semibold text-ink">
      {children}
      {optional ? <span className="font-normal text-muted"> (optional)</span> : <span className="sr-only"> (required)</span>}
    </label>
  );
}

export function ApplicationForm({
  job,
  workAuthorizations,
  commissionOptions,
  staticWebhook,
}: {
  job: { slug: string; title: string };
  workAuthorizations: Option[];
  commissionOptions: Option[];
  /** Used only when the site is hosted statically and the local API is missing. */
  staticWebhook: string;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ApplicationInput>(empty);
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  // Move focus to the step heading so screen readers announce the new step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, doneId]);

  const set = (name: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => document.getElementById(fid(first === "cv" ? "cv-button" : first))?.focus());
  };

  const validateStep = (i: number): Errors => {
    const all = validateFields(values);
    const errs: Errors = {};
    for (const f of steps[i].fields) if (all[f]) errs[f] = all[f];
    if (i === 1) {
      const e = cv ? validateCvMeta(cv.name, cv.size) : "Upload your CV to continue.";
      if (e) errs.cv = e;
    }
    if (i === 3 && !consent) errs.consent = "Please confirm you agree before submitting.";
    return errs;
  };

  const next = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    const e = validateCvMeta(file.name, file.size);
    setErrors((er) => ({ ...er, cv: e ?? undefined }));
    setCv(e ? null : file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitToWebhook = async () => {
    await fetch(staticWebhook, {
      method: "POST",
      // no-cors: Apps Script and most free relays don't send CORS headers. The response is opaque.
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        source: "fostier-careers-portal",
        application: { ...values, jobSlug: job.slug, jobTitle: job.title, submittedAt: new Date().toISOString() },
        cv: cv ? { name: cv.name, type: cv.type, base64: await toBase64(cv) } : null,
      }),
    });
    return "sent";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) return next();
    // Re-check every step: a user could have reached Review with stale answers.
    for (let i = 0; i < steps.length; i++) {
      const errs = validateStep(i);
      if (Object.keys(errs).length) {
        setErrors(errs);
        if (i !== step) setStep(i);
        return focusFirstError(errs);
      }
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const body = new FormData();
      for (const [k, v] of Object.entries(values)) body.append(k, v.trim());
      body.append("job", job.slug);
      body.append("cv", cv!);
      body.append("consent", "yes");
      body.append("company_website", honeypot);
      let res: Response | null = null;
      try {
        res = await fetch(`${API_BASE}/apply`, { method: "POST", body });
      } catch {
        res = null;
      }
      // Static hosting: no API route exists, so fall back to the configured webhook.
      if ((!res || res.status === 404 || res.status === 405) && staticWebhook) {
        setDoneId(await submitToWebhook());
        return;
      }
      if (!res) throw new Error("We couldn't reach the server. Check your connection and try again.");
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string; errors?: Errors };
      if (!res.ok) {
        if (data.errors && Object.keys(data.errors).length) {
          setErrors(data.errors);
          const i = steps.findIndex((s) => s.fields.some((f) => data.errors![f]));
          if (i >= 0) setStep(i);
          focusFirstError(data.errors);
        }
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setDoneId(data.id ?? "sent");
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (doneId) {
    return (
      <div className="space-y-5 py-6" role="status">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-navy text-white">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="h-serif text-3xl outline-none">Application sent</h2>
        <p className="body-lead">
          Thank you, {values.fullName.split(" ")[0]}. Your application for {job.title} is with us. We read every application and will reply by email to{" "}
          <strong className="font-semibold text-ink">{values.email}</strong>, usually within two weeks.
        </p>
        {doneId !== "sent" && <p className="label tabular">Reference: {doneId}</p>}
      </div>
    );
  }

  const err = (name: keyof Errors) =>
    errors[name] ? (
      <p id={fid(`${name}-error`)} className="mt-1.5 text-sm font-medium text-fred-700">
        {errors[name]}
      </p>
    ) : null;
  const a11y = (name: Field, hint?: boolean) => ({
    id: fid(name),
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": [errors[name] && fid(`${name}-error`), hint && fid(`${name}-hint`)].filter(Boolean).join(" ") || undefined,
  });

  const reviewRows: { step: number; items: [string, string][] }[] = [
    {
      step: 0,
      items: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["LinkedIn", values.linkedinUrl],
        ["Portfolio / GitHub", values.portfolioUrl || "—"],
      ],
    },
    { step: 1, items: [["CV", cv ? `${cv.name} (${formatSize(cv.size)})` : "—"]] },
    {
      step: 2,
      items: [
        ["Work authorisation", labelFor(workAuthorizations, values.workAuthorization)],
        ["Commission-only pay", labelFor(commissionOptions, values.commissionOnly)],
      ],
    },
  ];

  return (
    <form onSubmit={submit} aria-label={`Apply for ${job.title}`} noValidate aria-describedby={submitError ? fid("submit-error") : undefined}>
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Application steps">
        {steps.map((s, i) => (
          <li key={s.title} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1 rounded-sm ${i <= step ? "bg-navy" : "bg-line"}`} aria-hidden="true" />
            <span className={`mt-2 block text-xs sm:text-sm ${i === step ? "font-semibold text-ink" : "text-muted"}`}>
              <span className="sr-only">Step {i + 1} of {steps.length}: </span>
              {s.title}
              {i < step && <span className="sr-only"> (completed)</span>}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="h-serif mb-6 text-2xl outline-none sm:text-3xl">
        {["About you", "Your CV", "A few questions", "Check your application"][step]}
      </h2>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <Label htmlFor={fid("fullName")}>Full name</Label>
            <input {...a11y("fullName")} className={inputClass} autoComplete="name" value={values.fullName} onChange={set("fullName")} required />
            {err("fullName")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor={fid("email")}>Email</Label>
              <input {...a11y("email")} type="email" className={inputClass} autoComplete="email" value={values.email} onChange={set("email")} required />
              {err("email")}
            </div>
            <div>
              <Label htmlFor={fid("phone")}>Phone number</Label>
              <input {...a11y("phone")} type="tel" className={`${inputClass} tabular`} autoComplete="tel" placeholder="+852 6123 4567" value={values.phone} onChange={set("phone")} required />
              {err("phone")}
            </div>
          </div>
          <div>
            <Label htmlFor={fid("linkedinUrl")}>LinkedIn profile URL</Label>
            <input {...a11y("linkedinUrl")} type="url" className={inputClass} placeholder="https://www.linkedin.com/in/…" value={values.linkedinUrl} onChange={set("linkedinUrl")} required />
            {err("linkedinUrl")}
          </div>
          <div>
            <Label htmlFor={fid("portfolioUrl")} optional>Portfolio or GitHub URL</Label>
            <input {...a11y("portfolioUrl")} type="url" className={inputClass} placeholder="https://" value={values.portfolioUrl} onChange={set("portfolioUrl")} />
            {err("portfolioUrl")}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files[0]);
            }}
            className={`rounded-sm border-2 border-dashed px-5 py-10 text-center transition-colors ${
              dragging ? "border-navy bg-mist" : errors.cv ? "border-fred-700" : "border-line"
            }`}
          >
            <Upload className="mx-auto h-8 w-8 text-navy" aria-hidden="true" />
            <p className="mt-3 text-[15px] text-ink">
              <span className="hidden sm:inline">Drag your CV here, or </span>
              <button
                type="button"
                id={fid("cv-button")}
                onClick={() => fileInputRef.current?.click()}
                aria-describedby={[fid("cv-hint"), errors.cv && fid("cv-error")].filter(Boolean).join(" ")}
                className="focus-ring font-semibold text-navy link-underline"
              >
                choose a file
              </button>
            </p>
            <p id={fid("cv-hint")} className="mt-1 text-sm text-muted">PDF or Word (.docx), 5 MB maximum</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>
          {err("cv")}
          {cv && (
            <div className="mt-4 flex items-center gap-3 rounded-sm border border-line bg-mist px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">{cv.name}</p>
                <p className="text-sm text-muted tabular">{formatSize(cv.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => setCv(null)}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm text-slate hover:bg-white hover:text-fred-700"
                aria-label={`Remove ${cv.name}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <Label htmlFor={fid("workAuthorization")}>Work authorisation in Hong Kong</Label>
            <select {...a11y("workAuthorization")} className={inputClass} value={values.workAuthorization} onChange={set("workAuthorization")} required>
              <option value="">Select…</option>
              {workAuthorizations.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {err("workAuthorization")}
          </div>
          <fieldset
            aria-invalid={!!errors.commissionOnly}
            aria-describedby={errors.commissionOnly ? fid("commissionOnly-error") : undefined}
          >
            <legend className="text-[15px] font-semibold text-ink">
              Are you comfortable with commission-only pay, with no base salary?
              <span className="sr-only"> (required)</span>
            </legend>
            <div className="mt-3 space-y-2">
              {commissionOptions.map((o, i) => (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 text-[15px] text-ink transition-colors hover:border-muted has-[:checked]:border-navy has-[:checked]:bg-mist ${errors.commissionOnly ? "border-fred-700" : "border-line"}`}
                >
                  <input
                    type="radio"
                    name="commissionOnly"
                    id={i === 0 ? fid("commissionOnly") : undefined}
                    value={o.value}
                    checked={values.commissionOnly === o.value}
                    onChange={set("commissionOnly")}
                    className="focus-ring mt-1 h-4 w-4 shrink-0 accent-navy"
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {err("commissionOnly")}
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          {reviewRows.map((group) => (
            <section key={group.step} aria-labelledby={fid(`review-${group.step}`)} className="border-t border-line pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 id={fid(`review-${group.step}`)} className="font-serif text-lg text-ink">{steps[group.step].title}</h3>
                <button type="button" onClick={() => setStep(group.step)} className="focus-ring text-sm font-semibold text-navy link-underline">
                  Edit<span className="sr-only"> {steps[group.step].title}</span>
                </button>
              </div>
              <dl className="mt-3 space-y-2.5">
                {group.items.map(([k, v]) => (
                  <div key={k} className="grid gap-0.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="whitespace-pre-line break-words text-[15px] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <div className="border-t border-line pt-5">
            <label className="flex items-start gap-3 text-[15px] leading-relaxed text-slate">
              <input
                id={fid("consent")}
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setErrors((er) => ({ ...er, consent: undefined }));
                }}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? fid("consent-error") : undefined}
                className="focus-ring mt-1 h-4 w-4 shrink-0 accent-navy"
              />
              <span>
                I confirm these details are accurate and agree that Fostier Consulting may store and use them to assess
                my application. They are kept no longer than 12 months.
              </span>
            </label>
            {err("consent")}
          </div>
        </div>
      )}

      {submitError && (
        <p id={fid("submit-error")} role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-fred/5 px-4 py-3 text-sm font-medium text-fred-700">
          {submitError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn-outline focus-ring">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button type="submit" className="btn-primary focus-ring">
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" className="btn-primary focus-ring" disabled={submitting} aria-busy={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {submitting ? "Sending…" : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}
