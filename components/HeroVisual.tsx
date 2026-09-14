"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AdvisorMapPill } from "./AdvisorMapPill";
import { WORLD_PATHS } from "@/lib/map-data";

interface HeroVisualProps {
  caption?: string;
  locale?: string;
}

export function HeroVisual({ caption, locale = "fr" }: HeroVisualProps) {
  const reduce = useReducedMotion();

  // Spatial coordinates tuned to map projection window (520 x 340)
  // Paris (France): x: 122, y: 76
  // Hong Kong (HQ Base): x: 386, y: 162
  const PARIS = { x: 122, y: 76 };
  const HK = { x: 386, y: 162 };

  // Primary Great-Circle Arc connecting Paris and Hong Kong
  const arcPath = `M ${PARIS.x} ${PARIS.y} C 200 15, 305 45, ${HK.x} ${HK.y}`;
  // Subdued parallel secondary arc for visual depth
  const arcSecondaryPath = `M ${PARIS.x} ${PARIS.y} C 215 110, 315 130, ${HK.x} ${HK.y}`;

  return (
    <figure className="relative w-full">
      <div
        aria-hidden="true"
        className="relative aspect-[16/11] sm:aspect-[5/4] w-full overflow-hidden rounded-3xl border border-navy-100/20 bg-gradient-to-br from-[#020B24] via-[#05133B] to-[#010619] shadow-lift"
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#0A84FF]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-fred/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-navy/40 blur-3xl pointer-events-none" />

        {/* Map SVG */}
        <svg
          viewBox="0 0 520 340"
          className="absolute inset-0 h-full w-full select-none"
          aria-hidden="true"
        >
          <defs>
            {/* Fine cartographic grid pattern */}
            <pattern
              id="cartoGrid"
              width="26"
              height="26"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 26 0 L 0 0 0 26"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.035"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Glowing route gradient from Paris cyan to Hong Kong red */}
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0A84FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#ED2939" stopOpacity="0.95" />
            </linearGradient>

            {/* Landmass 2.5D gradient */}
            <linearGradient id="landGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E2942" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* France highlight gradient */}
            <linearGradient id="franceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1E2942" stopOpacity="0.95" />
            </linearGradient>

            {/* Hong Kong highlight gradient */}
            <linearGradient id="hkGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ED2939" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1E2942" stopOpacity="0.95" />
            </linearGradient>

            {/* Drop shadow for 2.5D landmass depth */}
            <filter id="landDepth" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow
                dx="2"
                dy="3"
                stdDeviation="2"
                floodColor="#000000"
                floodOpacity="0.7"
              />
            </filter>

            {/* Pulse glow filter */}
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cartographic Background Grid & Vignette */}
          <rect width="520" height="340" fill="url(#cartoGrid)" />

          {/* Curved Longitude/Latitude Graticules (Globe Curvature Effect) */}
          <g stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.6" fill="none">
            <path d="M 0 80 Q 260 110 520 80" />
            <path d="M 0 170 Q 260 200 520 170" />
            <path d="M 0 260 Q 260 290 520 260" />
            <path d="M 130 0 Q 160 170 130 340" />
            <path d="M 260 0 Q 290 170 260 340" />
            <path d="M 390 0 Q 420 170 390 340" />
          </g>

          {/* 2.5D Landmasses (Shadow layer + Realistic Silhouette Surface) */}
          <g filter="url(#landDepth)">
            {Object.entries(WORLD_PATHS).map(([region, pathList]) => {
              const isFrance = region === "france";
              const isHK = region === "hongkong";

              let fillStyle = "url(#landGradient)";
              let strokeStyle = "#334155";
              let strokeWidth = "0.65";
              let strokeOpacity = "0.5";

              if (isFrance) {
                fillStyle = "url(#franceGrad)";
                strokeStyle = "#38BDF8";
                strokeWidth = "1.2";
                strokeOpacity = "0.9";
              } else if (isHK) {
                fillStyle = "url(#hkGrad)";
                strokeStyle = "#ED2939";
                strokeWidth = "1.2";
                strokeOpacity = "0.9";
              }

              return pathList.map((d, i) => (
                <path
                  key={`${region}-${i}`}
                  d={d}
                  fill={fillStyle}
                  stroke={strokeStyle}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                />
              ));
            })}
          </g>

          {/* Subdued Secondary Parallel Connection Route */}
          <path
            d={arcSecondaryPath}
            fill="none"
            stroke="#0A84FF"
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="3 6"
          />

          {/* Primary Curved Great-Circle Arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#0A84FF"
            strokeOpacity="0.25"
            strokeWidth="3.5"
          />
          <motion.path
            d={arcPath}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Traveling Light Pulse from Paris to Hong Kong */}
          {!reduce && (
            <motion.circle
              r="3.5"
              fill="#FFFFFF"
              filter="url(#coreGlow)"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1.5,
              }}
              style={{
                offsetPath: `path('${arcPath}')`,
              }}
            />
          )}

          {/* PARIS MARKER */}
          <g transform={`translate(${PARIS.x}, ${PARIS.y})`}>
            {/* Outer pulsating aura */}
            <circle
              r="14"
              fill="none"
              stroke="#38BDF8"
              strokeOpacity="0.2"
              strokeWidth="1"
              className={reduce ? "" : "animate-ping"}
              style={{ animationDuration: "3.5s" }}
            />
            <circle
              r="8"
              fill="none"
              stroke="#0A84FF"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            {/* Core point */}
            <circle r="3.5" fill="#38BDF8" filter="url(#coreGlow)" />
            <circle r="1.5" fill="#FFFFFF" />
          </g>

          {/* HONG KONG MARKER */}
          <g transform={`translate(${HK.x}, ${HK.y})`}>
            {/* Outer pulsating aura */}
            <circle
              r="16"
              fill="none"
              stroke="#ED2939"
              strokeOpacity="0.25"
              strokeWidth="1"
              className={reduce ? "" : "animate-ping"}
              style={{ animationDuration: "3s", animationDelay: "0.5s" }}
            />
            <circle
              r="9"
              fill="none"
              stroke="#ED2939"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            {/* Core point */}
            <circle r="4" fill="#ED2939" filter="url(#coreGlow)" />
            <circle r="1.8" fill="#FFFFFF" />
          </g>

          {/* CITY LABELS */}
          {/* Paris Label */}
          <g transform={`translate(${PARIS.x - 38}, ${PARIS.y - 18})`}>
            <rect
              x="-4"
              y="-11"
              width="52"
              height="18"
              rx="4"
              fill="#030E2E"
              fillOpacity="0.8"
              stroke="#38BDF8"
              strokeOpacity="0.3"
              strokeWidth="0.75"
            />
            <text
              fill="#F8FAFC"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="sans-serif"
              letterSpacing="1.2"
            >
              PARIS
            </text>
          </g>

          {/* Hong Kong Label */}
          <g transform={`translate(${HK.x - 22}, ${HK.y + 26})`}>
            <rect
              x="-24"
              y="-11"
              width="80"
              height="20"
              rx="4"
              fill="#030E2E"
              fillOpacity="0.85"
              stroke="#ED2939"
              strokeOpacity="0.4"
              strokeWidth="0.75"
            />
            <text
              x="16"
              y="-1"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="sans-serif"
              letterSpacing="1.2"
            >
              HONG KONG
            </text>
            <text
              x="16"
              y="6"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="6.5"
              fontWeight="600"
              fontFamily="sans-serif"
              letterSpacing="0.8"
            >
              HQ BASE
            </text>
          </g>
        </svg>

        {/* Advisor Map Pill overlay */}
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
