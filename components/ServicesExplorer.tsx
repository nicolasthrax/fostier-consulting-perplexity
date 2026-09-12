"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ServiceIcon } from "@/components/icons";

export type ExplorerService = {
  slug: string;
  title: string;
  short: string;
  benefit: string;
  icon: string;
  includes: string[];
  disclaimer: string;
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ServiceDetail({
  service,
  includesLabel,
}: {
  service: ExplorerService;
  includesLabel: string;
}) {
  return (
    <>
      <p className="border-l-2 border-fred pl-4 text-sm italic leading-relaxed text-slate">
        {service.benefit}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{service.short}</p>
      <h4 className="mt-8 text-xs font-semibold uppercase tracking-[.18em] text-slate">
        {includesLabel}
      </h4>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {service.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-slate"
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
    </>
  );
}

export function ServicesExplorer({
  services,
  includesLabel,
}: {
  services: ExplorerService[];
  includesLabel: string;
}) {
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
                className="focus-ring group flex w-full items-center gap-4 py-5 text-left lg:gap-6 lg:py-7"
              >
                <span className="text-xs font-semibold tracking-[.18em] text-muted">
                  0{i + 1}
                </span>
                <span className="relative pb-1.5">
                  <span
                    className={`font-serif text-lg font-medium leading-snug transition-colors duration-200 lg:text-2xl ${
                      open ? "text-navy" : "text-ink group-hover:text-navy"
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-[2px] bg-fred transition-all duration-300 ${
                      open ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className={`ml-auto h-4 w-4 shrink-0 text-navy transition-transform duration-300 lg:hidden ${
                    open ? "rotate-90" : ""
                  }`}
                />
                <ArrowRight
                  aria-hidden="true"
                  className={`ml-auto hidden h-5 w-5 shrink-0 text-navy transition-all duration-200 lg:block ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </button>
              <div className="faq-panel lg:hidden" data-open={open}>
                <div>
                  <div className="pb-7 pl-9 pr-1">
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-parchment text-navy">
                      <ServiceIcon name={service.icon} className="h-5 w-5" />
                    </span>
                    <ServiceDetail service={service} includesLabel={includesLabel} />
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
              className="card-base p-8 sm:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-parchment text-navy">
                  <ServiceIcon name={current.icon} className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold tracking-[.18em] text-muted">
                  0{active + 1} / 0{services.length}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl">
                {current.title}
              </h3>
              <div className="mt-5">
                <ServiceDetail service={current} includesLabel={includesLabel} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
