import { GraduationCap } from "lucide-react";
import { targetUniversities, type TargetUniversity } from "@/lib/careers/universities";

/** Green tags for the highlighted universities (HKU, CUHK, HKUST) a candidate named. */
export function UniversityBadges({ codes }: { codes: TargetUniversity[] }) {
  if (!codes.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-1 align-middle">
      {codes.map((code) => (
        <span
          key={code}
          title={targetUniversities.find((u) => u.code === code)?.name}
          className="inline-flex items-center gap-1 rounded-sm bg-wechat px-1.5 py-0.5 text-[11px] font-semibold leading-none tracking-wide text-white"
        >
          <GraduationCap className="h-3 w-3" aria-hidden="true" />
          {code}
        </span>
      ))}
    </span>
  );
}
