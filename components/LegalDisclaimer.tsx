import type {Dictionary} from "@/lib/i18n/get-dictionary";
export function LegalDisclaimer({dict,className=""}:{dict:Dictionary;className?:string}){return <p role="note" className={`max-w-3xl text-xs leading-relaxed text-muted ${className}`}>{dict.legal.shortDisclaimer}</p>}
