"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ExplorerService = {
  slug: string;
  title: string;
  short: string;
  benefit: string;
  icon: string;
  includes: string[];
  disclaimer: string;
  href: string;
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ServiceDetail({ service, moreLabel }: { service: ExplorerService; moreLabel: string }) {
  return (
    <>
      <p className="font-serif text-xl leading-snug text-ink">
        {service.benefit}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-slate">{service.short}</p>
      <p className="mt-6 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
      <Link
        href={service.href}
        className="focus-ring link-arrow mt-7 text-[15px]"
      >
        {moreLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </>
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative overflow-hidden rounded-sm bg-mist p-8 pt-10 sm:p-10 sm:pt-12"
            >
              <div aria-hidden="true" className="par-avion par-avion-drift absolute inset-x-0 top-0 h-2" />
              <h3 className="font-serif text-3xl leading-tight tracking-[-0.01em] text-navy sm:text-4xl">
                {current.title}
              </h3>
              <div className="mt-5">
                <ServiceDetail service={current} moreLabel={moreLabel} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
