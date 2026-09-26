import Image from "next/image";

/** The advisor portrait as a perforated postage stamp. */
export function StampPortrait({
  src,
  alt,
  name,
  caption,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  name: string;
  caption: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`stamp ${className}`}>
      <div className="relative aspect-[1076/1012] overflow-hidden bg-white">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        <span aria-hidden="true" className="absolute right-2 top-2 font-serif text-lg leading-none text-navy">
          HK
        </span>
      </div>
      <figcaption className="mt-3 flex items-end justify-between gap-3 border-t border-ink/10 pt-2.5">
        <span className="font-serif text-lg leading-tight text-ink">{name}</span>
        <span className="text-right text-xs font-medium text-muted">{caption}</span>
      </figcaption>
    </figure>
  );
}
