"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FRANCE_POINTS, LAND_MASK, SPHERE_POINTS } from "./globeDots";

type Vec = [number, number, number];

const RAD = Math.PI / 180;
const BLUE = "#5B82FF"; // brand blue, lifted so it reads on the night panel
const RED = "#ED2939";
const PARIS: Vec = toVec(48.86, 2.35);
const HK: Vec = toVec(22.32, 114.17);
const ROUTE = buildRoute(PARIS, HK, 72, 0.3);

// Face the midpoint of the route, tipped south so the lifted arc visibly curves.
const MID = normalize([PARIS[0] + HK[0], PARIS[1] + HK[1], PARIS[2] + HK[2]]);
const TARGET_YAW = Math.atan2(MID[1], MID[0]);
const TARGET_PITCH = Math.asin(MID[2]) - 24 * RAD;

const INTRO_MS = 2600;
const DASH = 9;
const DASH_PERIOD = 26;
const ARC_START_MS = 1900;
const ARC_MS = 1500;

function toVec(lat: number, lon: number): Vec {
  const φ = lat * RAD;
  const λ = lon * RAD;
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
}

function normalize([x, y, z]: Vec): Vec {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
}

// Great-circle path between a and b, lifted off the surface by up to `lift` of the radius.
function buildRoute(a: Vec, b: Vec, steps: number, lift: number): Vec[] {
  const ω = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const ka = Math.sin((1 - t) * ω) / Math.sin(ω);
    const kb = Math.sin(t * ω) / Math.sin(ω);
    const r = 1 + lift * Math.sin(Math.PI * t);
    return [(ka * a[0] + kb * b[0]) * r, (ka * a[1] + kb * b[1]) * r, (ka * a[2] + kb * b[2]) * r];
  });
}

function decodeLand(): { land: Float32Array; france: Float32Array } {
  const bits = atob(LAND_MASK);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const at = (i: number) => {
    const z = 1 - (2 * (i + 0.5)) / SPHERE_POINTS;
    const r = Math.sqrt(1 - z * z);
    return [r * Math.cos(i * golden), r * Math.sin(i * golden), z];
  };
  const land: number[] = [];
  for (let i = 0; i < SPHERE_POINTS; i++) {
    if (bits.charCodeAt(i >> 3) & (1 << (i & 7))) land.push(...at(i));
  }
  return { land: new Float32Array(land), france: new Float32Array(FRANCE_POINTS.flatMap(at)) };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

export function HeroGlobe({ children, className = "" }: { children?: ReactNode; className?: string }) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parisRef = useRef<HTMLSpanElement>(null);
  const hkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!figure || !canvas || !ctx) return;

    const { land, france } = decodeLand();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;
    let dragYaw = 0;
    let dragging: { x: number; yaw: number } | null = null;

    const resize = () => {
      const rect = figure.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(Infinity);
    };

    const draw = (t: number) => {
      const intro = reduced ? 1 : easeOutCubic(t / INTRO_MS);
      const sway = reduced || t < INTRO_MS ? 0 : 9 * RAD * Math.sin((t - INTRO_MS) / 4000);
      const yaw = TARGET_YAW - (1 - intro) * 150 * RAD + sway + dragYaw;
      const pitch = TARGET_PITCH + (1 - intro) * 14 * RAD;
      const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);

      const R = Math.min(w, h) * 0.43;
      const cx = w * 0.5;
      const cy = h * 0.5;

      // Returns [screenX, screenY, depth]; depth > 0 faces the viewer.
      const project = (x: number, y: number, z: number): Vec => {
        const x1 = x * cy0 + y * sy0;
        const east = -x * sy0 + y * cy0;
        return [cx + R * east, cy - R * (-x1 * sp + z * cp), x1 * cp + z * sp];
      };
      const shown = ([sx, sy, d]: Vec) => d > 0 || Math.hypot(sx - cx, sy - cy) > R;

      ctx.clearRect(0, 0, w, h);

      const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.3);
      halo.addColorStop(0, "rgba(91,130,255,.18)");
      halo.addColorStop(1, "rgba(91,130,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#1a2a78");
      body.addColorStop(1, "#060d33");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(255,255,255,.07)";
      ctx.beginPath();
      const line = (pts: Vec[]) => {
        let pen = false;
        for (const [x, y, z] of pts) {
          const p = project(x, y, z);
          if (p[2] > 0 && pen) ctx.lineTo(p[0], p[1]);
          else if (p[2] > 0) ctx.moveTo(p[0], p[1]);
          pen = p[2] > 0;
        }
      };
      for (let lat = -60; lat <= 60; lat += 30) line(Array.from({ length: 91 }, (_, i) => toVec(lat, i * 4)));
      for (let lon = 0; lon < 180; lon += 30) line(Array.from({ length: 91 }, (_, i) => toVec(i * 4 - 180, lon)));
      ctx.stroke();

      const buckets: number[][] = [[], [], [], []];
      for (let i = 0; i < land.length; i += 3) {
        const p = project(land[i], land[i + 1], land[i + 2]);
        if (p[2] > 0.02) buckets[Math.min(3, Math.floor(p[2] * 4))].push(p[0], p[1]);
      }
      buckets.forEach((pts, b) => {
        const r = 0.75 + b * 0.18;
        ctx.fillStyle = `rgba(255,255,255,${0.14 + b * 0.12})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i += 2) {
          ctx.moveTo(pts[i] + r, pts[i + 1]);
          ctx.arc(pts[i], pts[i + 1], r, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      ctx.save();
      ctx.shadowColor = BLUE;
      ctx.shadowBlur = 8;
      ctx.fillStyle = BLUE;
      ctx.beginPath();
      for (let i = 0; i < france.length; i += 3) {
        const p = project(france[i], france[i + 1], france[i + 2]);
        if (p[2] <= 0) continue;
        ctx.moveTo(p[0] + 1.5, p[1]);
        ctx.arc(p[0], p[1], 1.5, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();

      const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, "rgba(91,130,255,.7)");
      rim.addColorStop(0.5, "rgba(255,255,255,.25)");
      rim.addColorStop(1, "rgba(237,41,57,.6)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1;
      ctx.stroke();

      const route = ROUTE.map(([x, y, z]) => project(x, y, z));
      const stroke = (from: number, to: number) => {
        const i0 = Math.floor(from * (route.length - 1));
        const i1 = Math.floor(to * (route.length - 1));
        ctx.beginPath();
        let pen = false;
        for (let i = Math.max(0, i0); i <= i1; i++) {
          const p = route[i];
          if (shown(p) && pen) ctx.lineTo(p[0], p[1]);
          else if (shown(p)) ctx.moveTo(p[0], p[1]);
          pen = shown(p);
        }
        ctx.stroke();
      };

      // The route is drawn like an airmail border: white thread, then red and blue
      // dashes marching from Paris towards Hong Kong once the flight has landed.
      const arc = reduced ? 1 : easeInOut(Math.min(1, Math.max(0, (t - ARC_START_MS) / ARC_MS)));
      if (arc > 0) {
        const march = reduced ? 0 : -((t - ARC_START_MS) / 45) % DASH_PERIOD;
        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,255,255,.92)";
        ctx.shadowColor = "rgba(255,255,255,.35)";
        ctx.shadowBlur = 6;
        stroke(0, arc);
        ctx.shadowBlur = 0;
        ctx.setLineDash([DASH, DASH_PERIOD - DASH]);
        ctx.strokeStyle = RED;
        ctx.lineDashOffset = march;
        stroke(0, arc);
        ctx.strokeStyle = "#2F5BFF";
        ctx.lineDashOffset = march - DASH_PERIOD / 2;
        stroke(0, arc);
        ctx.restore();
      }

      const marker = (v: Vec, color: string, size: number, label: HTMLSpanElement | null, delay: number) => {
        const [x, y, d] = project(...v);
        const alpha = Math.min(1, Math.max(0, d * 5));
        if (label) {
          label.style.opacity = String(alpha);
          label.style.transform = `translate(${x}px, ${y}px)`;
        }
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (!reduced) {
          const ping = ((t + delay) % 2400) / 2400;
          ctx.beginPath();
          ctx.arc(x, y, size * (1.4 + ping * 2.6), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha * 0.35 * (1 - ping);
          ctx.fill();
          ctx.globalAlpha = alpha;
        }
        ctx.beginPath();
        ctx.arc(x, y, size * 1.9, 0, Math.PI * 2);
        ctx.fillStyle = "#060d33";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };
      marker(PARIS, BLUE, 3.2, parisRef.current, 0);
      marker(HK, RED, 3.8, hkRef.current, 1200);
    };

    const loop = (now: number) => {
      if (!dragging) dragYaw *= 0.94;
      draw(now - start);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(figure);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduced) frame = requestAnimationFrame(loop);
    });
    io.observe(figure);

    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      dragging = { x: e.clientX, yaw: dragYaw };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) dragYaw = dragging.yaw - (e.clientX - dragging.x) * 0.5 * RAD;
    };
    const onUp = () => {
      dragging = null;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    if (!reduced) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const chip =
    "pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform [&>span]:absolute [&>span]:whitespace-nowrap [&>span]:rounded-sm [&>span]:px-2 [&>span]:py-1 [&>span]:text-[11px] [&>span]:font-semibold [&>span]:tracking-[.08em]";

  return (
    <figure
      ref={figureRef}
      className={`relative aspect-[25/17] overflow-hidden bg-nuit ${className}`}
    >

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />

      <span ref={parisRef} aria-hidden="true" className={chip}>
        <span className="-translate-x-1/2 -translate-y-[calc(100%+12px)] bg-white text-navy">Paris</span>
      </span>
      <span ref={hkRef} aria-hidden="true" className={chip}>
        <span className="-translate-x-1/2 translate-y-[14px] bg-fred text-white">Hong Kong</span>
      </span>

      {children}
    </figure>
  );
}
