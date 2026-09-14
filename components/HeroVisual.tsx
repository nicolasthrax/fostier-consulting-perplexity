"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AdvisorMapPill } from "./AdvisorMapPill";
import {
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Coins,
  Globe2,
  Building2,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface HeroVisualProps {
  caption?: string;
  locale?: string;
}

const PANEL_TRANSLATIONS: Record<
  string,
  {
    hub: string;
    subtitle: string;
    partnerBadge: string;
    pillars: Array<{
      id: string;
      title: string;
      subtitle: string;
      metric: string;
      tag: string;
    }>;
    connectionLabel: string;
    advisoryNote: string;
  }
> = {
  fr: {
    hub: "PARIS ↔ HONG KONG",
    subtitle: "Ingénierie Patrimoniale Internationale",
    partnerBadge: "Partenaire UFE HK",
    pillars: [
      {
        id: "investment",
        title: "Investissement & Portfolio",
        subtitle: "Diversification & stratégie long terme",
        metric: "+6.8% Cible Horizon",
        tag: "Patrimoine",
      },
      {
        id: "taxation",
        title: "Fiscalité Hong Kong",
        subtitle: "Déclarations & conformité expatriés",
        metric: "SFC & IRD Aligné",
        tag: "Conformité",
      },
      {
        id: "savings",
        title: "Épargne Multi-Devises",
        subtitle: "Solutions structurées EUR / HKD / USD",
        metric: "EUR ⇄ HKD ⇄ USD",
        tag: "Trésorerie",
      },
      {
        id: "protection",
        title: "Assurance & Prévoyance",
        subtitle: "Couverture santé & famille en Asie",
        metric: "Protection 100%",
        tag: "Famille",
      },
    ],
    connectionLabel: "Accompagnement dédié des résidents français en Asie",
    advisoryNote: "Conseil privé & sur mesure",
  },
  en: {
    hub: "PARIS ↔ HONG KONG",
    subtitle: "Cross-Border Wealth Advisory",
    partnerBadge: "UFE HK Partner",
    pillars: [
      {
        id: "investment",
        title: "Investment & Portfolio",
        subtitle: "Long-term growth & asset allocation",
        metric: "Multi-Asset Strategy",
        tag: "Wealth",
      },
      {
        id: "taxation",
        title: "Hong Kong Tax Guidance",
        subtitle: "Filing preparation & compliance",
        metric: "IRD Compliant",
        tag: "Taxation",
      },
      {
        id: "savings",
        title: "Multi-Currency Banking",
        subtitle: "Structured EUR / HKD / USD savings",
        metric: "EUR ⇄ HKD ⇄ USD",
        tag: "Liquidity",
      },
      {
        id: "protection",
        title: "Health & Life Protection",
        subtitle: "Tailored family cover across Asia",
        metric: "Global Cover",
        tag: "Security",
      },
    ],
    connectionLabel: "Dedicated financial advisory for French expats in Asia",
    advisoryNote: "Bespoke private advisory",
  },
  zh: {
    hub: "巴黎 ↔ 香港",
    subtitle: "跨境财富与财务咨询",
    partnerBadge: "UFE 香港合作伙伴",
    pillars: [
      {
        id: "investment",
        title: "投资与资产组合",
        subtitle: "长期资产配置与稳健增值",
        metric: "多资产策略",
        tag: "财富",
      },
      {
        id: "taxation",
        title: "香港税务申报",
        subtitle: "报税准备与税务合规协助",
        metric: "合规保障",
        tag: "税务",
      },
      {
        id: "savings",
        title: "多币种储蓄与银行",
        subtitle: "EUR / HKD / USD 结构化方案",
        metric: "EUR ⇄ HKD ⇄ USD",
        tag: "流动性",
      },
      {
        id: "protection",
        title: "健康与人寿保险",
        subtitle: "为在亚家庭定制全面保障",
        metric: "全面守护",
        tag: "保障",
      },
    ],
    connectionLabel: "服务于居住在亚洲的法国居民",
    advisoryNote: "专属一对一咨询",
  },
};

export function HeroVisual({ caption, locale = "fr" }: HeroVisualProps) {
  const reduce = useReducedMotion();
  const t = PANEL_TRANSLATIONS[locale] || PANEL_TRANSLATIONS.fr;

  return (
    <figure className="relative w-full">
      <div
        aria-hidden="true"
        className="relative aspect-[16/11] sm:aspect-[5/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#020B24] via-[#05143C] to-[#010619] p-4 sm:p-5 shadow-2xl"
      >
        {/* Deep ambient background glows */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#0A84FF]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#ED2939]/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-navy/50 blur-3xl pointer-events-none" />

        {/* Decorative Grid & Finance Chart Graphic Overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="heroGrid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.08"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />

          {/* Ascending wealth sparkline SVG curve */}
          <path
            d="M 20 280 C 120 260, 180 290, 260 210 C 340 130, 420 170, 520 90"
            fill="none"
            stroke="#0A84FF"
            strokeWidth="2"
            strokeOpacity="0.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 20 280 C 120 260, 180 290, 260 210 C 340 130, 420 170, 520 90 L 520 340 L 20 340 Z"
            fill="url(#chartGrad)"
          />
        </svg>

        {/* Panel Main Container */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A84FF]/20 border border-[#0A84FF]/40 text-[#38BDF8]">
                <Globe2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#38BDF8]">
                  {t.hub}
                </span>
                <p className="text-[10px] text-white/70 font-medium leading-none mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.partnerBadge}
              </span>
            </div>
          </div>

          {/* 4 Wealth Advisory Pillars (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 my-auto py-1">
            {/* Pillar 1: Investment */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 sm:p-3 backdrop-blur-md transition-all duration-300 hover:border-[#0A84FF]/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0A84FF]/20 text-[#38BDF8]">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                  {t.pillars[0].tag}
                </span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                {t.pillars[0].title}
              </h4>
              <p className="text-[9.5px] text-white/70 line-clamp-1 mt-0.5 font-normal">
                {t.pillars[0].subtitle}
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-semibold text-[#38BDF8] border-t border-white/10 pt-1">
                <span>{t.pillars[0].metric}</span>
                <ArrowUpRight className="h-3 w-3 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.div>

            {/* Pillar 2: Tax Guidance */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 sm:p-3 backdrop-blur-md transition-all duration-300 hover:border-[#0A84FF]/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                  <FileCheck2 className="h-3.5 w-3.5" />
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                  {t.pillars[1].tag}
                </span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                {t.pillars[1].title}
              </h4>
              <p className="text-[9.5px] text-white/70 line-clamp-1 mt-0.5 font-normal">
                {t.pillars[1].subtitle}
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-semibold text-emerald-400 border-t border-white/10 pt-1">
                <span>{t.pillars[1].metric}</span>
                <CheckCircle2 className="h-3 w-3 opacity-80" />
              </div>
            </motion.div>

            {/* Pillar 3: Multi-Currency Savings */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 sm:p-3 backdrop-blur-md transition-all duration-300 hover:border-[#0A84FF]/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-300">
                  <Coins className="h-3.5 w-3.5" />
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                  {t.pillars[2].tag}
                </span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">
                {t.pillars[2].title}
              </h4>
              <p className="text-[9.5px] text-white/70 line-clamp-1 mt-0.5 font-normal">
                {t.pillars[2].subtitle}
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-semibold text-amber-300 border-t border-white/10 pt-1">
                <span>{t.pillars[2].metric}</span>
                <Sparkles className="h-3 w-3 opacity-80" />
              </div>
            </motion.div>

            {/* Pillar 4: Protection */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 sm:p-3 backdrop-blur-md transition-all duration-300 hover:border-[#0A84FF]/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ED2939]/20 text-[#FF6B7A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/80">
                  {t.pillars[3].tag}
                </span>
              </div>
              <h4 className="text-[11px] sm:text-xs font-semibold text-white group-hover:text-[#FF6B7A] transition-colors leading-snug">
                {t.pillars[3].title}
              </h4>
              <p className="text-[9.5px] text-white/70 line-clamp-1 mt-0.5 font-normal">
                {t.pillars[3].subtitle}
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-semibold text-[#FF6B7A] border-t border-white/10 pt-1">
                <span>{t.pillars[3].metric}</span>
                <Building2 className="h-3 w-3 opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Footer Bar (Shifted right to give space to AdvisorMapPill) */}
          <div className="flex items-center justify-end border-t border-white/10 pt-2 text-right">
            <span className="text-[10px] font-semibold text-[#38BDF8]">
              {t.advisoryNote}
            </span>
          </div>
        </div>

        {/* Advisor Map Pill Overlay */}
        <AdvisorMapPill locale={locale} />
      </div>

      {caption && (
        <figcaption className="mt-3.5 max-w-md text-xs leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
