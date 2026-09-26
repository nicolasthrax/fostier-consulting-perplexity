import type {ReactNode} from "react";
import {Postmark} from "./Postmark";
export function Section({children,className=""}:{children:ReactNode;className?:string}){return <section className={`py-20 sm:py-28 ${className}`}><div className="container-site">{children}</div></section>}
/** Top of an inner page: title and lead on a mist band, with the red postmark at the edge. */
export function PageHero({title,lead,before,after}:{title:string;lead?:string;before?:ReactNode;after?:ReactNode}){return <section className="relative overflow-hidden bg-mist"><div className="container-site relative pb-14 pt-12 sm:pb-20 sm:pt-16">{before}<h1 className="h-serif fade-in max-w-4xl text-[2.6rem] leading-[1.04] sm:text-6xl">{title}</h1>{lead&&<p className="body-lead fade-in mt-6 max-w-2xl [animation-delay:.12s]">{lead}</p>}{after}<Postmark className="absolute -bottom-10 right-8 hidden h-40 w-40 -rotate-12 opacity-80 lg:block"/></div></section>}
