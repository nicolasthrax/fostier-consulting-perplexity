import type { Locale } from "./config";
import { fr } from "./fr";
import { en } from "./en";

export type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale] ?? dictionaries.fr;
