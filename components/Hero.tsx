"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ExternalLink } from "lucide-react";
import { HeroVisual } from "./HeroVisual";
import { WhatsAppButton, CallButton } from "./ContactActions";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Hero({ locale, dict }: { locale: string; dict: Dictionary }) {
  const reduce = useReducedMotion();
  const fade = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.55,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-parchment via-white to-white">
      <div
        className="h-[3px] w-full bg-gradient-to-r from-navy via-navy-100 to-fred/70"
        aria-hidden="true"
      />
      <div className="container-site grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
        <motion.div {...fade(0)}>
          <a
            href={
              dict.hero.ufePartnerUrl ||
              "https://www.ufehongkong.hk/partenaires/fostier-consulting"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-navy/15 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-navy shadow-xs backdrop-blur-xs transition-all hover:border-navy/30 hover:bg-white hover:shadow-soft"
          >
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-navy/5">
              <img
                src="/brand/ufe-logo.svg"
                alt="UFE"
                className="h-full w-full object-contain"
              />
            </span>
            <span>{dict.hero.ufePartnerBadge}</span>
            <ExternalLink className="h-3.5 w-3.5 text-navy/60 transition-transform group-hover:translate-x-0.5 group-hover:text-navy" />
          </a>

          <motion.h1
            className="h-serif mt-5 text-4xl leading-[1.12] sm:text-5xl lg:text-[3.4rem]"
            {...fade(1)}
          >
            {dict.hero.title}
          </motion.h1>
          <motion.p className="body-lead mt-6 max-w-xl" {...fade(2)}>
            {dict.hero.subtitle}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            {...fade(3)}
          >
            <WhatsAppButton
              label={dict.actions.whatsappAdvisor}
              message={dict.actions.whatsappMessage}
              large
            />
            <CallButton label={dict.actions.callLabel} />
            <Link
              href={`/${locale}/services`}
              className="focus-ring group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-navy underline-offset-4 hover:underline"
            >
              {dict.actions.discoverServices}
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-.5 group-hover:translate-y-.5" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div {...fade(2)}>
          <HeroVisual locale={locale} caption={dict.hero.visualCaption} />
        </motion.div>
      </div>
    </section>
  );
}
