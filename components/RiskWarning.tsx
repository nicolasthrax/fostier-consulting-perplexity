import { riskWarning } from "@/lib/i18n/trust";
import type { Locale } from "@/lib/i18n/config";

/** Short risk warning. `footer` sits on the pale footer band; `inline` is the boxed version for service pages. */
export function RiskWarning({ locale, variant = "inline", className = "" }: { locale: Locale; variant?: "inline" | "footer"; className?: string }) {
  const { title, body } = riskWarning[locale];
  if (variant === "footer") {
    return (
      <div role="note" className={className}>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate">{body}</p>
      </div>
    );
  }
  return (
    <aside role="note" aria-label={title} className={`max-w-2xl border-l-2 border-fred bg-mist py-4 pl-5 pr-4 ${className}`}>
      <p className="text-sm leading-relaxed text-slate">
        <strong className="font-semibold text-ink">{title}. </strong>
        {body}
      </p>
    </aside>
  );
}
