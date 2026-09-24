import type { Locale } from "./config";

/**
 * Localised URL slugs for each service page, in the same order as
 * `services.items` in the dictionaries. Kept separate from the dictionary so
 * the (client-side) language switcher can map slugs without bundling all copy.
 */
export const serviceSlugs: Record<Locale, string>[] = [
  { fr: "investissement", en: "investment", zh: "investment" },
  { fr: "fiscalite", en: "tax", zh: "tax" },
  { fr: "epargne", en: "savings", zh: "savings" },
  { fr: "assurance", en: "insurance", zh: "insurance" },
  { fr: "interprete", en: "interpreter", zh: "interpreter" },
  { fr: "fournisseur-chinois", en: "chinese-suppliers", zh: "chinese-suppliers" },
  { fr: "partenaire-francais", en: "french-partner", zh: "french-partner" },
];

export const serviceIndex = (locale: Locale, slug: string) =>
  serviceSlugs.findIndex((s) => s[locale] === slug);

/** Maps a pathname to its equivalent in another locale, translating service slugs. */
export function localizePath(pathname: string, target: Locale): string {
  const match = pathname.match(/^\/(fr|en|zh)(\/.*)?$/);
  if (!match) return `/${target}`;
  const [, from, rest = ""] = match;
  const service = rest.match(/^\/services\/([^/]+)(.*)$/);
  if (service) {
    const i = serviceIndex(from as Locale, service[1]);
    if (i >= 0) return `/${target}/services/${serviceSlugs[i][target]}${service[2]}`;
  }
  return `/${target}${rest}`;
}
