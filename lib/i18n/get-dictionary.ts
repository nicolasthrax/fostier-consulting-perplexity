import type {Locale} from "./config";
import {dictionaries} from "./content";
export type Dictionary=typeof dictionaries.fr;
export const getDictionary=(locale:Locale):Dictionary=>dictionaries[locale]??dictionaries.fr;
