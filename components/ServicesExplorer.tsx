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
      <p className="border-l-2 border-fred pl-4 text-sm italic leading-relaxed text-slate">
        {service.benefit}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{service.short}</p>
      <p className="mt-6 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
      <Link
        href={service.href}
        className="focus-ring group mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-navy underline-offset-4 hover:underline"
      >
        {moreLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
    <span className="relative inline-block pb-1.5 font-serif text-lg font-medium leading-snug lg:text-2xl">
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
                className="focus-ring group flex w-full py-5 text-left transition-transform duration-300 hover:-translate-y-[3px] lg:py-7"
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
              className="card-base relative overflow-hidden !bg-parchment p-8 sm:p-10"
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy via-navy-100 to-fred/70" />
              <h3 className="font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl">
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
