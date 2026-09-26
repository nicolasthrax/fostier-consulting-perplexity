import { Fragment } from "react";

/**
 * Splits a headline into words (or clauses, for Chinese) that rise into place one
 * after another. CSS-only, so the text is in the HTML and paints without waiting for JS.
 */
export function RiseTitle({ text, className = "", delay = 0.05, step = 0.06 }: { text: string; className?: string; delay?: number; step?: number }) {
  const spaced = /\s/.test(text);
  const parts = spaced ? text.split(/\s+/) : text.split(/(?<=[，。、])/);
  return (
    <h1 className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span className="rise-line">
            <span style={{ animationDelay: `${delay + i * step}s` }}>{part}</span>
          </span>
          {spaced && i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}
