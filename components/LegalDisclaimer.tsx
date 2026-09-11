import type {Dictionary} from "@/lib/i18n/get-dictionary";
export function LegalDisclaimer({dict,text,className=""}:{dict:Dictionary;text?:string;className?:string}){return <p role="note" className={`max-w-3xl text-xs leading-relaxed text-muted ${className}`}>{text??dict.legal.shortDisclaimer}</p>}
