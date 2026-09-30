import type { ReactNode } from "react";
import { Check } from "lucide-react";
import type { DetailSection, ServiceDetail } from "@/lib/i18n/service-details";

const h2 = "h-serif text-3xl leading-tight sm:text-4xl";
const para = "mt-5 max-w-prose text-base leading-relaxed text-slate sm:text-[17px]";

function Block({ id, section, children }: { id: string; section: DetailSection; children?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-16 first:mt-0">
      <h2 id={id} className={h2}>
        {section.heading}
      </h2>
      {section.paragraphs.map((p) => (
        <p key={p} className={para}>
          {p}
        </p>
      ))}
      {children}
      {section.note && <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-muted">{section.note}</p>}
    </section>
  );
}

/** Ruled list with red check marks, as used for the "includes" list. */
function CheckList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={`mt-8 grid border-t border-ink ${columns ? "sm:grid-cols-2 sm:gap-x-10" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 border-b border-line py-4 text-base leading-relaxed text-ink">
          <Check className="mt-1 h-4 w-4 shrink-0 text-fred" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Long-form body of a core service page: who it is for, what is included, the
 * process as numbered steps, timeline and documents. Question-style H2s, steps as H3s.
 */
export function ServiceDetails({ detail, includes }: { detail: ServiceDetail; includes: string[] }) {
  const { audience, included, process, timeline, documents } = detail;
  return (
    <>
      <Block id="audience" section={audience}>
        {audience.list && (
          <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-base leading-relaxed text-slate marker:text-fred sm:text-[17px]">
            {audience.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Block>

      <Block id="included" section={{ heading: included.heading, paragraphs: [included.intro] }}>
        <CheckList items={includes} columns />
      </Block>

      <section aria-labelledby="process" className="mt-16">
        <h2 id="process" className={h2}>
          {process.heading}
        </h2>
        <ol className="mt-8 border-t border-ink">
          {process.steps.map((step, n) => (
            <li key={step.title} className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[3.5rem_1fr]">
              <span aria-hidden="true" className="tabular font-serif text-3xl leading-none text-fred-700">
                {String(n + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-xl leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Block id="timeline" section={timeline} />

      <Block id="documents" section={documents}>
        {documents.list && <CheckList items={documents.list} />}
      </Block>
    </>
  );
}
