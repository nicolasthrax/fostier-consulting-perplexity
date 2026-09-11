import {Phone} from "lucide-react";
import {WhatsAppIcon} from "./WhatsAppIcon";
import {site,whatsappUrl} from "@/lib/site";
type Variant="primary"|"outline"|"ghost"|"navy";
const base="focus-ring group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]";
const variants:Record<Variant,string>={primary:"bg-navy text-white shadow-soft hover:bg-navy-800 hover:shadow-lift",navy:"bg-navy-900 text-white shadow-soft hover:bg-navy-800 hover:shadow-lift",outline:"border border-line bg-white text-navy hover:border-navy/40 hover:shadow-soft",ghost:"text-navy underline-offset-4 hover:underline"};
export function WhatsAppButton({label,message,variant="primary",className="",large=false}:{label:string;message:string;variant?:Variant;className?:string;large?:boolean}){return <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]} ${large?"px-8 py-4 text-base":""} ${className}`}><WhatsAppIcon className={large?"h-6 w-6":"h-5 w-5"}/><span>{label}</span></a>}
export function CallButton({label,variant="outline",className="",large=false}:{label:string;variant?:Variant;className?:string;large?:boolean}){return <a href={site.phoneHref} className={`${base} ${variants[variant]} ${large?"px-8 py-4 text-base":""} ${className}`}><Phone className="h-5 w-5" aria-hidden="true"/><span>{label}</span></a>}
