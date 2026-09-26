import {PageHero,Section} from "./SectionHeading";
import {LegalDisclaimer} from "./LegalDisclaimer";
import type {Dictionary} from "@/lib/i18n/get-dictionary";
type LegalPage={title:string;updated:string;sections:{heading:string;body:string}[]};
export function LegalArticle({page,dict}:{page:LegalPage;dict:Dictionary}){return <><PageHero title={page.title} after={<p className="mt-5 text-sm text-muted">{page.updated}</p>}/><Section className="!pt-14"><div className="max-w-3xl"><div className="space-y-10">{page.sections.map((section,i)=><section key={section.heading} className="border-t border-line pt-6"><h2 className="font-serif text-2xl text-ink"><span className="mr-3 font-sans text-sm font-semibold text-fred-700">§{i+1}</span>{section.heading}</h2><p className="mt-3 text-base leading-relaxed text-slate">{section.body}</p></section>)}</div><div className="rule-fine mt-14"/><LegalDisclaimer dict={dict} className="mt-8"/></div></Section></>}
