import { Fragment } from "react";

/**
 * Splits a headline into words (or clauses, for Chinese) that rise into place one
 * after another. CSS-only, so the text is in the HTML and paints without waiting for JS.
 * An optional `eyebrow` (e.g. the brand on the home page) sits on its own small line
 * inside the same <h1>, so it counts as part of the heading.
 */
export function RiseTitle({
  text,
  eyebrow,
  className = "",
  delay = 0.05,
  step = 0.06,
}: {
  text: string;
  eyebrow?: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const spaced = /\s/.test(text);
  const parts = spaced ? text.split(/\s+/) : text.split(/(?<=[，。、])/);
  return (
    // The split spans are hidden from assistive tech, which reads the whole title from aria-label.
    <h1 className={className} aria-label={eyebrow ? `${eyebrow} — ${text}` : text}>
      {eyebrow && (
        <>
          <span aria-hidden="true" className="label fade-in mb-5 block leading-normal tracking-normal sm:mb-6">
            {eyebrow}
          </span>
          {/* Keeps the text content ("Brand — title") in step with the aria-label for crawlers. */}
          <span aria-hidden="true" className="sr-only">
            {" — "}
          </span>
        </>
      )}
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="rise-line">
            <span style={{ animationDelay: `${delay + i * step}s` }}>{part}</span>
          </span>
          {spaced && i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}
