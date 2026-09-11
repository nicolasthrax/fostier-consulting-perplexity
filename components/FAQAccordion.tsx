"use client";
import {useState} from "react";
import {Plus} from "lucide-react";
type QA={q:string;a:string};
export function FAQAccordion({items}:{items:QA[]}){const [openIndex,setOpenIndex]=useState<number|null>(0);return <div className="divide-y divide-line border-y border-line">{items.map((item,i)=>{const open=openIndex===i;return <div key={item.q}><h3><button type="button" onClick={()=>setOpenIndex(open?null:i)} aria-expanded={open} aria-controls={`faq-panel-${i}`} className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left"><span className="font-serif text-lg font-medium text-ink">{item.q}</span><Plus className={`h-5 w-5 shrink-0 text-navy transition-transform duration-300 ${open?"rotate-45":""}`}/></button></h3><div id={`faq-panel-${i}`} className="faq-panel" data-open={open} role="region"><div><p className="max-w-3xl pb-6 text-sm leading-relaxed text-muted sm:text-base">{item.a}</p></div></div></div>})}</div>}
