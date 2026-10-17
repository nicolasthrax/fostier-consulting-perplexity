"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ExplorerService = {
  slug: string;
  title: string;
  short: string;
  benefit: string;
  disclaimer: string;
  href: string;
};

function ServiceDetail({ service, moreLabel }: { service: ExplorerService; moreLabel: string }) {
  return (
    <>
      <p className="font-serif text-xl leading-snug text-ink">
        {service.benefit}
      </p>
      <p className="mt-4 text-base leading-relaxed text-slate">{service.short}</p>
      <p className="mt-6 text-sm leading-relaxed text-muted">{service.disclaimer}</p>
      <Link
        href={service.href}
        className="focus-ring link-arrow mt-7 text-[15px]"
      >
        {moreLabel}
        <span className="sr-only"> — {service.title}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </>
  );
}

/** Desktop detail panel for the active service: an index card with a ruled link and the disclaimer in a footer band. */
function Panel({ service, moreLabel }: { service: ExplorerService; moreLabel: string }) {
  return (
    <div className="rounded-sm border border-line bg-white">
      <div className="px-9 pb-10 pt-8 sm:px-10">
        <div aria-hidden="true" className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-navy" />
          <span className="h-2.5 w-2.5 rounded-full border border-line bg-white" />
          <span className="h-2.5 w-2.5 rounded-full bg-fred" />
        </div>
        <p className="mt-6 font-serif text-3xl leading-tight tracking-[-0.01em] text-ink sm:text-[2.6rem]">{service.title}</p>
        <p className="mt-5 font-serif text-xl leading-snug text-navy">{service.benefit}</p>
        <p className="mt-5 text-base leading-relaxed text-slate">{service.short}</p>
        <Link
          href={service.href}
          className="focus-ring group mt-9 flex items-center justify-between border-y border-ink py-4 text-[15px] font-semibold text-navy transition-colors hover:text-fred-700"
        >
          <span>
            {moreLabel}
            <span className="sr-only"> — {service.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
      <div className="bg-mist px-9 py-5 sm:px-10">
        <p className="text-[13px] leading-relaxed text-muted">{service.disclaimer}</p>
      </div>
    </div>
  );
}

function ServiceTitle({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [firstLineWidth, setFirstLineWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const updateWidth = () => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rects = Array.from(range.getClientRects());
      if (rects.length > 0) setFirstLineWidth(rects[0].width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [title]);

  return (
    <span className="relative inline-block pb-1.5 font-serif text-xl leading-snug lg:text-[1.65rem]">
      <span
        ref={textRef}
        className={`transition-colors duration-300 ${
          active ? "text-navy" : "text-ink group-hover:text-navy"
        }`}
      >
        {title}
      </span>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-[2px] bg-fred transition-[width] duration-300 ${
          active ? "opacity-100" : "w-0 opacity-100 group-hover:opacity-100"
        }`}
        style={{ width: active ? firstLineWidth ?? 0 : undefined }}
      />
    </span>
  );
}

export function ServicesExplorer({ services, moreLabel }: { services: ExplorerService[]; moreLabel: string }) {
  const [active, setActive] = useState(0);
  const current = services[Math.max(0, active)] ?? services[0];
  // The desktop panel finishes leaving before the newly chosen service comes in (CSS, see .panel-out).
  const [shown, setShown] = useState(current);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  if (current.slug !== shown.slug && phase !== "out") setPhase("out");
  const onPanelAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget || phase !== "out") return;
    setShown(current);
    setPhase("in");
  };

  useEffect(() => {
    const slug = window.location.hash.replace("#", "");
    const idx = services.findIndex((s) => s.slug === slug);
    if (idx >= 0) {
      setActive(idx);
      document.getElementById(slug)?.scrollIntoView({ block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        {services.map((service, i) => {
          const open = i === active;
          return (
            <div
              key={service.slug}
              id={service.slug}
              className="scroll-mt-28 border-t border-line last:border-b lg:last:border-b-0"
            >
              <h2>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={open}
                  className="focus-ring group flex w-full py-5 text-left lg:py-6"
                >
                  <ServiceTitle title={service.title} active={open} />
                </button>
              </h2>
              <div className="faq-panel lg:hidden" data-open={open}>
                <div>
                  <div className="pb-7">
                    <ServiceDetail service={service} moreLabel={moreLabel} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div aria-hidden="true" className="hidden border-t border-line lg:block" />
      </div>

      <div className="relative mt-10 hidden lg:mt-0 lg:block">
        <div className="sticky top-28">
          <div
            key={shown.slug}
            onAnimationEnd={onPanelAnimationEnd}
            className={phase === "out" ? "panel-out" : phase === "in" ? "panel-in" : ""}
          >
            <Panel service={shown} moreLabel={moreLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}
