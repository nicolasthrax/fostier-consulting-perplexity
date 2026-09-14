"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AdvisorMapPill } from "./AdvisorMapPill";
import {
  Globe2,
  FileCheck2,
  Coins,
  TrendingUp,
  Award,
  ShieldCheck,
  Landmark,
  Building2,
  Sparkles,
  Heart,
  Scale,
  BadgePercent,
} from "lucide-react";

interface HeroVisualProps {
  caption?: string;
  locale?: string;
}

interface TileItem {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge?: string;
  color: string; // Tailored accent color
  bgGlow: string;
}

const TILE_TRANSLATIONS: Record<
  string,
  TileItem[]
> = {
  fr: [
    {
      id: "hub",
      icon: Globe2,
      title: "Paris ⇄ Hong Kong",
      subtitle: "Ingénierie Patrimoniale",
      badge: "Hub Expat",
      color: "text-[#38BDF8]",
      bgGlow: "from-[#0A84FF]/20 to-transparent",
    },
    {
      id: "taxation",
      icon: FileCheck2,
      title: "Fiscalité HK & IRD",
      subtitle: "Déclarations & conformité",
      badge: "Conformité",
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/20 to-transparent",
    },
    {
      id: "currency",
      icon: Coins,
      title: "EUR ⇄ HKD ⇄ USD",
      subtitle: "Épargne Multi-Devises",
      badge: "Trésorerie",
      color: "text-amber-300",
      bgGlow: "from-amber-500/20 to-transparent",
    },
    {
      id: "growth",
      icon: TrendingUp,
      title: "+6.8% Performance",
      subtitle: "Allocation multi-actifs",
      badge: "Portfolio",
      color: "text-cyan-300",
      bgGlow: "from-cyan-500/20 to-transparent",
    },
    {
      id: "ufe",
      icon: Award,
      title: "Partenaire UFE HK",
      subtitle: "Union des Français de l'Étranger",
      badge: "Officiel",
      color: "text-[#FF6B7A]",
      bgGlow: "from-[#ED2939]/20 to-transparent",
    },
    {
      id: "protection",
      icon: ShieldCheck,
      title: "Assurance & Santé",
      subtitle: "Couverture famille en Asie",
      badge: "Protection",
      color: "text-rose-400",
      bgGlow: "from-rose-500/20 to-transparent",
    },
    {
      id: "retirement",
      icon: Landmark,
      title: "Retraite Expatriés",
      subtitle: "Solutions MPF & Assurance-Vie",
      badge: "Prévoyance",
      color: "text-indigo-400",
      bgGlow: "from-indigo-500/20 to-transparent",
    },
    {
      id: "realestate",
      icon: Building2,
      title: "Immobilier France",
      subtitle: "Structuring & gestion locative",
      badge: "Actifs",
      color: "text-sky-300",
      bgGlow: "from-sky-500/20 to-transparent",
    },
    {
      id: "advisory",
      icon: Sparkles,
      title: "Conseil Privé",
      subtitle: "Accompagnement dédié",
      badge: "Sur-Mesure",
      color: "text-purple-300",
      bgGlow: "from-purple-500/20 to-transparent",
    },
    {
      id: "wellness",
      icon: Heart,
      title: "Prévoyance Santé",
      subtitle: "Rapatriement & Hospitalisation",
      badge: "Sérénité",
      color: "text-pink-400",
      bgGlow: "from-pink-500/20 to-transparent",
    },
    {
      id: "law",
      icon: Scale,
      title: "Succession & Droit",
      subtitle: "Optimisation transfrontalière",
      badge: "Juridique",
      color: "text-violet-300",
      bgGlow: "from-violet-500/20 to-transparent",
    },
    {
      id: "optim",
      icon: BadgePercent,
      title: "Optimisation Fiscale",
      subtitle: "Convention France - HK",
      badge: "SFC Aligné",
      color: "text-teal-300",
      bgGlow: "from-teal-500/20 to-transparent",
    },
  ],
  en: [
    {
      id: "hub",
      icon: Globe2,
      title: "Paris ⇄ Hong Kong",
      subtitle: "Cross-Border Wealth",
      badge: "Expat Hub",
      color: "text-[#38BDF8]",
      bgGlow: "from-[#0A84FF]/20 to-transparent",
    },
    {
      id: "taxation",
      icon: FileCheck2,
      title: "HK Tax & Compliance",
      subtitle: "IRD & SFC filing guidance",
      badge: "Taxation",
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/20 to-transparent",
    },
    {
      id: "currency",
      icon: Coins,
      title: "EUR ⇄ HKD ⇄ USD",
      subtitle: "Multi-Currency Banking",
      badge: "Liquidity",
      color: "text-amber-300",
      bgGlow: "from-amber-500/20 to-transparent",
    },
    {
      id: "growth",
      icon: TrendingUp,
      title: "+6.8% Target Return",
      subtitle: "Multi-asset strategy",
      badge: "Portfolio",
      color: "text-cyan-300",
      bgGlow: "from-cyan-500/20 to-transparent",
    },
    {
      id: "ufe",
      icon: Award,
      title: "UFE HK Partner",
      subtitle: "French Overseas Association",
      badge: "Official",
      color: "text-[#FF6B7A]",
      bgGlow: "from-[#ED2939]/20 to-transparent",
    },
    {
      id: "protection",
      icon: ShieldCheck,
      title: "Health & Life Cover",
      subtitle: "Family protection in Asia",
      badge: "Security",
      color: "text-rose-400",
      bgGlow: "from-rose-500/20 to-transparent",
    },
    {
      id: "retirement",
      icon: Landmark,
      title: "Expat Retirement",
      subtitle: "MPF & Life Insurance Solutions",
      badge: "Pension",
      color: "text-indigo-400",
      bgGlow: "from-indigo-500/20 to-transparent",
    },
    {
      id: "realestate",
      icon: Building2,
      title: "French Real Estate",
      subtitle: "Structuring & Rental Management",
      badge: "Assets",
      color: "text-sky-300",
      bgGlow: "from-sky-500/20 to-transparent",
    },
    {
      id: "advisory",
      icon: Sparkles,
      title: "Private Advisory",
      subtitle: "Bespoke wealth management",
      badge: "Custom",
      color: "text-purple-300",
      bgGlow: "from-purple-500/20 to-transparent",
    },
    {
      id: "wellness",
      icon: Heart,
      title: "Medical & Health",
      subtitle: "Repatriation & Global Cover",
      badge: "Wellness",
      color: "text-pink-400",
      bgGlow: "from-pink-500/20 to-transparent",
    },
    {
      id: "law",
      icon: Scale,
      title: "Estate & Inheritance",
      subtitle: "Cross-border estate planning",
      badge: "Legal",
      color: "text-violet-300",
      bgGlow: "from-violet-500/20 to-transparent",
    },
    {
      id: "optim",
      icon: BadgePercent,
      title: "Tax Optimization",
      subtitle: "France - HK Tax Treaty",
      badge: "Aligned",
      color: "text-teal-300",
      bgGlow: "from-teal-500/20 to-transparent",
    },
  ],
  zh: [
    {
      id: "hub",
      icon: Globe2,
      title: "巴黎 ⇄ 香港",
      subtitle: "跨境财富管理",
      badge: "离岸枢纽",
      color: "text-[#38BDF8]",
      bgGlow: "from-[#0A84FF]/20 to-transparent",
    },
    {
      id: "taxation",
      icon: FileCheck2,
      title: "香港税务合规",
      subtitle: "IRD 与 SFC 报税指导",
      badge: "税务",
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/20 to-transparent",
    },
    {
      id: "currency",
      icon: Coins,
      title: "EUR ⇄ HKD ⇄ USD",
      subtitle: "多币种资产管理",
      badge: "流动性",
      color: "text-amber-300",
      bgGlow: "from-amber-500/20 to-transparent",
    },
    {
      id: "growth",
      icon: TrendingUp,
      title: "+6.8% 目标收益",
      subtitle: "多元化资产配置",
      badge: "组合",
      color: "text-cyan-300",
      bgGlow: "from-cyan-500/20 to-transparent",
    },
    {
      id: "ufe",
      icon: Award,
      title: "UFE 香港合作伙伴",
      subtitle: "法国海外居民协会",
      badge: "官方认证",
      color: "text-[#FF6B7A]",
      bgGlow: "from-[#ED2939]/20 to-transparent",
    },
    {
      id: "protection",
      icon: ShieldCheck,
      title: "健康与人寿保险",
      subtitle: "在亚家庭全面保障",
      badge: "保障",
      color: "text-rose-400",
      bgGlow: "from-rose-500/20 to-transparent",
    },
    {
      id: "retirement",
      icon: Landmark,
      title: "侨民养老规划",
      subtitle: "MPF 与人寿保险方案",
      badge: "退休",
      color: "text-indigo-400",
      bgGlow: "from-indigo-500/20 to-transparent",
    },
    {
      id: "realestate",
      icon: Building2,
      title: "法国房产投资",
      subtitle: "结构化与租赁管理",
      badge: "资产",
      color: "text-sky-300",
      bgGlow: "from-sky-500/20 to-transparent",
    },
    {
      id: "advisory",
      icon: Sparkles,
      title: "私人专属咨询",
      subtitle: "量身定制理财策略",
      badge: "一对一",
      color: "text-purple-300",
      bgGlow: "from-purple-500/20 to-transparent",
    },
    {
      id: "wellness",
      icon: Heart,
      title: "医疗与健康保障",
      subtitle: "全球救助与住院医疗",
      badge: "安心",
      color: "text-pink-400",
      bgGlow: "from-pink-500/20 to-transparent",
    },
    {
      id: "law",
      icon: Scale,
      title: "遗产与继承规划",
      subtitle: "跨境法律与继承安排",
      badge: "法律",
      color: "text-violet-300",
      bgGlow: "from-violet-500/20 to-transparent",
    },
    {
      id: "optim",
      icon: BadgePercent,
      title: "税务协同优化",
      subtitle: "法港双边协定",
      badge: "合规",
      color: "text-teal-300",
      bgGlow: "from-teal-500/20 to-transparent",
    },
  ],
};

export function HeroVisual({ caption, locale = "fr" }: HeroVisualProps) {
  const reduce = useReducedMotion();
  const tiles = TILE_TRANSLATIONS[locale] || TILE_TRANSLATIONS.fr;

  // Organize 12 tiles into 4 columns x 3 rows with staggered vertical offset for odd columns
  const columns = [
    [tiles[0], tiles[4], tiles[8]],  // Col 1
    [tiles[1], tiles[5], tiles[9]],  // Col 2 (shifted down)
    [tiles[2], tiles[6], tiles[10]], // Col 3
    [tiles[3], tiles[7], tiles[11]], // Col 4 (shifted down)
  ];

  return (
    <figure className="relative w-full">
      <div
        aria-hidden="true"
        className="relative aspect-[16/11] sm:aspect-[5/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#020B24] via-[#05143C] to-[#010619] p-4 sm:p-6 shadow-2xl flex items-center justify-center"
      >
        {/* Deep background glows */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#0A84FF]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#ED2939]/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-navy/50 blur-3xl pointer-events-none" />

        {/* Fine background Grid overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-15 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="tileGrid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.08"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tileGrid)" />
        </svg>

        {/* Staggered Grid Container */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-xl mx-auto items-start pt-2 pb-14">
          {columns.map((colTiles, colIdx) => {
            // Apply staggered vertical offset to even index columns (Col 2 and Col 4)
            const isStaggered = colIdx % 2 === 1;
            // Hide 4th column on smallest mobile screens to prevent crowding
            const isFourthCol = colIdx === 3;

            return (
              <div
                key={`col-${colIdx}`}
                className={`flex flex-col gap-2.5 sm:gap-3.5 transition-transform duration-500 ${
                  isStaggered ? "translate-y-3 sm:translate-y-4" : ""
                } ${isFourthCol ? "hidden sm:flex" : "flex"}`}
              >
                {colTiles.map((tile, rowIdx) => {
                  const Icon = tile.icon;
                  return (
                    <motion.div
                      key={tile.id}
                      initial={
                        reduce
                          ? {}
                          : { opacity: 0, y: 12, scale: 0.95 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.05 * (colIdx * 3 + rowIdx),
                        ease: "easeOut",
                      }}
                      whileHover={
                        reduce
                          ? {}
                          : {
                              scale: 1.04,
                              y: -3,
                              transition: { duration: 0.2 },
                            }
                      }
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-2.5 sm:p-3 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-[#0A84FF]/10"
                    >
                      {/* Subtle hover background radial glow */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tile.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                      />

                      {/* Top row: Icon & Tag */}
                      <div className="flex items-center justify-between gap-1 mb-2 relative z-10">
                        <div
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 ${tile.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        {tile.badge && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-medium text-white/80 backdrop-blur-sm">
                            {tile.badge}
                          </span>
                        )}
                      </div>

                      {/* Content: Title & Subtitle */}
                      <div className="relative z-10">
                        <h4 className="text-[11px] sm:text-xs font-semibold text-white leading-tight group-hover:text-white transition-colors">
                          {tile.title}
                        </h4>
                        <p className="text-[9px] sm:text-[9.5px] text-white/70 font-normal leading-tight mt-0.5 line-clamp-1">
                          {tile.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Floating CTA Overlay */}
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
