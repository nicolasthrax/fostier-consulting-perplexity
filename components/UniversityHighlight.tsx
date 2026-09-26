"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UNIVERSITY_HIGHLIGHTS } from "@/lib/i18n/founder";
import type { Locale } from "@/lib/i18n/config";

interface UniversityHighlightProps {
  uniKey: "fudan" | "esg";
  locale: Locale;
  children: React.ReactNode;
  className?: string;
}

const LOGOS = { fudan: "/brand/fudan-logo.svg", esg: "/brand/esg-logo.svg" } as const;

const GAP = 12;
const EDGE = 16;
const MAX_WIDTH = 320;

export function UniversityHighlight({
  uniKey,
  locale,
  children,
  className = "",
}: UniversityHighlightProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const [pos, setPos] = useState({ left: 0, width: MAX_WIDTH });
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  /** Pointer type of the latest press, so a tap toggles while a mouse click just keeps it open. */
  const lastPointer = useRef<string>("mouse");
  const tooltipId = useId();
  const highlight =
    UNIVERSITY_HIGHLIGHTS[locale]?.[uniKey] ?? UNIVERSITY_HIGHLIGHTS.en[uniKey];

  /** Centres the card on the trigger, clamps it to the viewport, and flips it below
   * the text when there is not enough room between the sticky header and the trigger. */
  const updatePosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const width = Math.min(MAX_WIDTH, viewportWidth - EDGE * 2);
    const idealLeft = rect.left + rect.width / 2 - width / 2;
    const clampedLeft = Math.max(EDGE, Math.min(idealLeft, viewportWidth - EDGE - width));
    setPos({ left: clampedLeft - rect.left, width });

    const height = tooltipRef.current?.offsetHeight ?? 0;
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const roomAbove = rect.top - Math.max(headerBottom, 0);
    const roomBelow = window.innerHeight - rect.bottom;
    setPlacement(roomAbove >= height + GAP + 8 || roomAbove >= roomBelow ? "top" : "bottom");
  }, []);

  // Measure once the card is in the DOM so the flip uses its real height.
  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDownOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", onPointerDownOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", onPointerDownOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, updatePosition]);

  const offset = placement === "top" ? 6 : -6;

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onPointerDown={(e) => {
        lastPointer.current = e.pointerType;
      }}
    >
      <span
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => {
          if (lastPointer.current === "mouse") setOpen(true);
          else setOpen((prev) => !prev);
          lastPointer.current = "mouse";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={`focus-ring cursor-pointer rounded-sm underline decoration-navy/25 decoration-1 underline-offset-[5px] transition-colors hover:text-ink hover:decoration-fred/70 ${
          open ? "text-ink decoration-fred/70" : ""
        } ${className}`}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            tabIndex={-1}
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset / 2 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => {
              if (lastPointer.current !== "mouse") setOpen(false);
              lastPointer.current = "mouse";
            }}
            style={{ left: `${pos.left}px`, width: `${pos.width}px` }}
            className={`absolute z-40 block overflow-hidden outline-none rounded-sm border-t-4 border-navy bg-white text-left font-sans not-italic shadow-pop ${
              placement === "top" ? "bottom-[calc(100%+12px)]" : "top-[calc(100%+12px)]"
            }`}
          >
            <span className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <img src={LOGOS[uniKey]} alt="" className="h-6 w-6 shrink-0 object-contain" />
                <span className="truncate font-serif text-base text-ink">
                  {highlight.title}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end leading-none">
                <span className="tabular font-serif text-2xl text-fred">{highlight.stat.value}</span>
                <span className="mt-1 text-[11px] font-medium text-muted">
                  {highlight.stat.label}
                </span>
              </span>
            </span>
            <span className="block bg-mist px-5 py-4 text-[14px] font-normal leading-relaxed text-slate">
              {highlight.text}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
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
