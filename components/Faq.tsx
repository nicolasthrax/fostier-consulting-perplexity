import { ChevronDown, Plus } from "lucide-react";
import type { FaqItem } from "@/lib/i18n/faq";
import { faqJsonLd } from "@/lib/structured-data";

/**
 * Two-level accordion on native <details>: the whole section folds under its heading,
 * and each question folds inside it. Answers are in the HTML and it works without
 * JavaScript. Emits the matching FAQPage JSON-LD.
 */
export function Faq({ id = "faq", title, items }: { id?: string; title: string; items: FaqItem[] }) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }} />
      <details className="faq-section group/section border-y border-ink">
        <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 py-6">
          <h2 id={`${id}-title`} className="h-serif text-3xl sm:text-4xl">
            {title}
          </h2>
          <ChevronDown
            aria-hidden="true"
            className="h-6 w-6 shrink-0 text-navy transition-transform duration-300 group-open/section:rotate-180"
          />
        </summary>
        <div className="border-t border-line">
          {items.map(({ q, a }) => (
            <details key={q} className="faq-item group border-b border-line last:border-b-0">
              <summary className="focus-ring flex cursor-pointer list-none items-start justify-between gap-6 py-5">
                <h3 className="font-serif text-xl leading-snug text-ink group-hover:text-navy">{q}</h3>
                <Plus aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-navy transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-3xl pb-6 text-base leading-relaxed text-slate">{a}</p>
            </details>
          ))}
        </div>
      </details>
    </section>
  );
}
