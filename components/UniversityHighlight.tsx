"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UNIVERSITY_HIGHLIGHTS } from "@/lib/i18n/founder";
import type { Locale } from "@/lib/i18n/config";

interface UniversityHighlightProps {
  uniKey: "fudan" | "esg";
  locale: Locale;
  children: React.ReactNode;
  className?: string;
}

export function UniversityHighlight({
  uniKey,
  locale,
  children,
  className = "",
}: UniversityHighlightProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isCoarsePointer = useRef<boolean>(false);
  const highlight =
    UNIVERSITY_HIGHLIGHTS[locale]?.[uniKey] ?? UNIVERSITY_HIGHLIGHTS.en[uniKey];

  useEffect(() => {
    if (typeof window !== "undefined") {
      isCoarsePointer.current =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => {
        if (!isCoarsePointer.current) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!isCoarsePointer.current) {
          setOpen(false);
        }
      }}
    >
      <span
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className={`cursor-pointer underline decoration-dotted decoration-navy decoration-2 underline-offset-4 transition-colors hover:text-navy hover:decoration-navy-700 ${className}`}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-50 mb-2.5 w-[calc(100vw-3rem)] max-w-xs -translate-x-1/2 rounded-xl border border-white/20 bg-[#002395]/65 p-3.5 text-xs text-white shadow-xl backdrop-blur-md sm:w-72"
          >
            <span className="block font-serif text-sm font-semibold text-white">
              {highlight.title}
            </span>
            <span className="mt-1 block leading-relaxed text-slate-100">
              {highlight.text}
            </span>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/20 bg-[#002395]/65 backdrop-blur-md"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function renderFrenchFlagText(text: string) {
  const target = "Fostier Consulting";
  const index = text.indexOf(target);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const after = text.slice(index + target.length);

  return (
    <>
      {before}
      <span className="inline-flex items-baseline font-semibold">
        <span className="text-navy">Fos</span>
        <span className="text-slate-700">tier&nbsp;</span>
        <span className="text-fred">Consulting</span>
      </span>
      {after}
    </>
  );
}

export function BioWithHighlights({
  text,
  locale,
}: {
  text: string;
  locale: Locale;
}) {
  let fudanText = "Fudan University (Shanghai)";
  let esgText = "ESG Group (Paris)";

  if (locale === "fr") {
    fudanText = "Université Fudan (Shanghai)";
    esgText = "Groupe ESG (Paris)";
  } else if (locale === "zh") {
    fudanText = "复旦大学（上海）";
    esgText = "ESG 集团（巴黎）";
  }

  const styledText = renderFrenchFlagText(text);

  if (typeof styledText === "string") {
    const parts = text.split(fudanText);
    if (parts.length < 2) return <>{text}</>;
    const [beforeFudan, rest] = parts;
    const esgParts = rest.split(esgText);
    if (esgParts.length < 2) return <>{text}</>;
    const [between, afterEsg] = esgParts;

    return (
      <>
        {beforeFudan}
        <UniversityHighlight uniKey="fudan" locale={locale}>
          {fudanText}
        </UniversityHighlight>
        {between}
        <UniversityHighlight uniKey="esg" locale={locale}>
          {esgText}
        </UniversityHighlight>
        {afterEsg}
      </>
    );
  }

  const indexFudan = text.indexOf(fudanText);
  if (indexFudan !== -1) {
    const indexEsg = text.indexOf(esgText);
    if (indexEsg !== -1) {
      const beforeFudan = text.slice(0, indexFudan);
      const between = text.slice(indexFudan + fudanText.length, indexEsg);
      const afterEsg = text.slice(indexEsg + esgText.length);

      return (
        <>
          {renderFrenchFlagText(beforeFudan)}
          <UniversityHighlight uniKey="fudan" locale={locale}>
            {fudanText}
          </UniversityHighlight>
          {renderFrenchFlagText(between)}
          <UniversityHighlight uniKey="esg" locale={locale}>
            {esgText}
          </UniversityHighlight>
          {renderFrenchFlagText(afterEsg)}
        </>
      );
    }
  }

  return styledText;
}
