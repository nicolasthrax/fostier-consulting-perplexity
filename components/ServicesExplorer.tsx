"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

function ServiceDetail({ service }: { service: ExplorerService }) {
  return (
    <>
      <p className="border-l-2 border-fred pl-4 text-sm italic leading-relaxed text-slate">
        {service.benefit}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{service.short}</p>
      <p className="mt-6 text-xs leading-relaxed text-muted">{service.disclaimer}</p>
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
  const words = title.split(" ");
  const firstLine = words.slice(0, Math.max(1, Math.ceil(words.length / 2))).join(" ");
  const remainder = words.slice(Math.max(1, Math.ceil(words.length / 2))).join(" ");

  return (
    <span className="font-serif text-lg font-medium leading-snug lg:text-2xl">
      <span
        className={`inline bg-[linear-gradient(#ED2939,#ED2939)] bg-left-bottom bg-no-repeat pb-1.5 transition-[background-size,color] duration-300 ${
          active
            ? "bg-[length:100%_2px] text-navy"
            : "bg-[length:0%_2px] text-ink group-hover:bg-[length:100%_2px] group-hover:text-navy"
        }`}
      >
        {firstLine}
      </span>
      {remainder && <span className="block pt-1.5">{remainder}</span>}
    </span>
  );
}

export function ServicesExplorer({ services }: { services: ExplorerService[] }) {
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
                    <ServiceDetail service={service} />
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
              <h3 className="font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl">
                {current.title}
              </h3>
              <div className="mt-5">
                <ServiceDetail service={current} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
