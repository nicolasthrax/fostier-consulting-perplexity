import Image from "next/image";
import Link from "next/link";

// The source PNG is a square with the monogram in a wide middle band;
// object-cover crops the empty margins so the mark reads at header size.
export function Logo({ locale, className = "h-[46px] w-[96px] sm:h-[54px] sm:w-[112px]" }: { locale: string; className?: string }) {
  return (
    <Link
      href={locale === "fr" ? "/" : `/${locale}`}
      className="focus-ring flex shrink-0 items-center rounded-sm"
      aria-label="Fostier Consulting"
    >
      <Image
        src="/brand/fostier-consulting-logo.png"
        alt="Fostier Consulting"
        width={2000}
        height={2000}
        priority
        sizes="140px"
        className={`object-cover [object-position:50%_36%] ${className}`}
      />
    </Link>
  );
}
