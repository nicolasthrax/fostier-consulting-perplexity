import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/lib/site";
import { trustCopy } from "@/lib/i18n/trust";
import { logoAlt } from "@/lib/i18n/founder";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/** One line for tight spots (service page contact card): who to write to when Lucie is unavailable. */
export function BackupContactLine({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = trustCopy[locale];
  return (
    <p className={`text-sm leading-relaxed text-slate ${className}`}>
      {t.backupShort}{" "}
      <a href={site.backupContact.emailHref} className="focus-ring link-underline font-semibold text-navy">
        {site.backupContact.name}, {site.backupContact.email}
      </a>
    </p>
  );
}

/** Backup contact and UFE Hong Kong partnership, side by side, for the team page. */
export function TrustSignals({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = trustCopy[locale];
  return (
    <section aria-labelledby="trust-heading" className="border-t border-line bg-white py-16 sm:py-20">
      <div className="container-site">
        <h2 id="trust-heading" className="h-serif text-3xl sm:text-4xl">
          {t.title}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border-t-4 border-navy bg-mist p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-ink">{t.backupTitle}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate">{t.backupBody}</p>
            <p className="mt-4 font-serif text-xl text-ink">{site.backupContact.name}</p>
            <a
              href={site.backupContact.emailHref}
              className="focus-ring mt-2 inline-flex min-h-6 items-center gap-2 text-[15px] font-semibold text-navy"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="link-underline">{site.backupContact.email}</span>
            </a>
          </div>
          <div className="border-t-4 border-fred bg-mist p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-ink">{t.partnerTitle}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate">{t.partnerBody}</p>
            <a
              href={dict.hero.ufePartnerUrl || site.ufePartnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group mt-4 inline-flex min-h-6 items-center gap-2.5 text-[15px] font-semibold text-navy"
            >
              <Image src="/brand/ufe-logo.svg" alt={logoAlt(locale, "UFE Hong Kong")} width={22} height={22} className="h-[22px] w-[22px] object-contain" />
              <span className="link-underline">{t.partnerLink}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
