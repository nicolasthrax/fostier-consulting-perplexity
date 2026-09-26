import Image from "next/image";

// The source PNG is a square with the monogram in a wide middle band;
// object-cover crops the empty margins so the mark reads at header size.
export function Logo({ locale, className = "h-[54px] w-[112px]" }: { locale: string; className?: string }) {
  return (
    <a
      href={`/${locale}`}
      className="focus-ring flex shrink-0 items-center rounded-sm"
      aria-label="Fostier Consulting"
    >
      <Image
        src="/brand/FOSTIER consulting.png"
        alt="Fostier Consulting"
        width={760}
        height={760}
        priority
        sizes="140px"
        className={`object-cover [object-position:50%_36%] ${className}`}
      />
    </a>
  );
}
