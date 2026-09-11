import Image from "next/image";

export function Logo({ locale }: { locale: string }) {
  return (
    <a
      href={`/${locale}`}
      className="focus-ring flex items-center rounded-md"
      aria-label="Fostier Consulting"
    >
      <Image
        src="/brand/FOSTIER-consulting.jpg"
        alt="Fostier Consulting"
        width={760}
        height={760}
        priority
        className="h-12 w-auto object-contain sm:h-14"
      />
    </a>
  );
}
