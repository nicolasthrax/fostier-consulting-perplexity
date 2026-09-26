import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { DrawRule } from "./DrawRule";

/** Services split by what they are for: Hong Kong finances, then France–China work. */
const groups: Record<Locale, { title: string; note: string; from: number; to: number; wipe: string }[]> = {
  fr: [
    { title: "Vos finances à Hong Kong", note: "Investir, déclarer, épargner, protéger.", from: 0, to: 4, wipe: "var(--navy)" },
    { title: "Entre la France et la Chine", note: "Langue, fournisseurs, projets.", from: 4, to: 7, wipe: "var(--fred-700)" },
  ],
  en: [
    { title: "Your finances in Hong Kong", note: "Invest, file, save, protect.", from: 0, to: 4, wipe: "var(--navy)" },
    { title: "Between France and China", note: "Language, suppliers, projects.", from: 4, to: 7, wipe: "var(--fred-700)" },
  ],
  zh: [
    { title: "您在香港的财务", note: "投资、报税、储蓄、保障。", from: 0, to: 4, wipe: "var(--navy)" },
    { title: "连接法国与中国", note: "语言、供应商、项目。", from: 4, to: 7, wipe: "var(--fred-700)" },
  ],
};

export function ServiceIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid gap-16">
      {groups[locale].map((group) => (
        <div key={group.title} className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-12">
          <div>
            <h3 className="font-serif text-2xl leading-tight text-ink">{group.title}</h3>
            <p className="mt-2 text-sm text-muted">{group.note}</p>
          </div>
          <div>
            <DrawRule className="bg-ink" />
            <ul>
              {dict.services.items.slice(group.from, group.to).map((service, k) => {
                const i = group.from + k;
                return (
                  <li key={service.slug} className="border-b border-line">
                    <Link
                      href={`/${locale}/services/${serviceSlugs[i][locale]}`}
                      style={{ ["--wipe" as string]: group.wipe }}
                      className="focus-ring wipe-row group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-1 py-5 sm:px-4 md:grid-cols-[1.1fr_1fr_auto] md:py-6"
                    >
                      <span className="wipe-fg font-serif text-xl leading-snug text-ink sm:text-2xl">{service.title}</span>
                      <span className="wipe-fg col-start-1 text-[15px] leading-snug text-muted md:col-start-2 md:row-start-1">
                        {service.benefit}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="wipe-fg col-start-2 row-span-2 row-start-1 h-5 w-5 text-navy transition-transform duration-300 group-hover:translate-x-1 md:col-start-3 md:row-span-1"
                      />
                    </Link>
                  </li>
                );
            })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
