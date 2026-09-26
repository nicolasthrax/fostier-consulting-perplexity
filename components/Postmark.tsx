import { useId } from "react";

/** Circular postal cancellation in red ink; the outer ring of text turns slowly. */
export function Postmark({
  ring = "PARIS ✦ HONG KONG ✦ PARIS ✦ HONG KONG ✦ ",
  center = "HK",
  sub = "FR",
  className = "",
}: {
  ring?: string;
  center?: string;
  sub?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`text-fred ${className}`}>
      <defs>
        <path id={`ring-${id}`} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <g fill="none" stroke="currentColor" opacity=".9">
        <circle cx="60" cy="60" r="57" strokeWidth="2" />
        <circle cx="60" cy="60" r="36" strokeWidth="1.4" />
      </g>
      <g className="spin-slow" style={{ transformOrigin: "60px 60px" }}>
        <text fill="currentColor" fontSize="9.4" fontWeight="600" letterSpacing="1.6" fontFamily="var(--font-sans), sans-serif">
          <textPath href={`#ring-${id}`}>{ring}</textPath>
        </text>
      </g>
      <text x="60" y="63" textAnchor="middle" fill="currentColor" fontSize="22" fontFamily="var(--font-serif), serif">
        {center}
      </text>
      <text x="60" y="78" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="600" letterSpacing="2" fontFamily="var(--font-sans), sans-serif">
        {sub}
      </text>
    </svg>
  );
}

/** Wavy cancellation lines that sit beside a postmark. */
export function CancelWaves({ className = "" }: { className?: string }) {
  const wave = "M0 6 q7.5 -6 15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0";
  return (
    <svg viewBox="0 0 120 40" aria-hidden="true" className={`text-fred ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      {[0, 9, 18, 27].map((y) => (
        <path key={y} d={wave} transform={`translate(0 ${y + 2})`} opacity=".85" />
      ))}
    </svg>
  );
}
