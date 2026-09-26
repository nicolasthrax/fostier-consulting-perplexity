import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { site, whatsappUrl } from "@/lib/site";
import { WeChatContactButton } from "./WeChatContact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { CancelWaves, Postmark } from "./Postmark";

const copy: Record<Locale, { lead: string; email: string; to: string }> = {
  fr: {
    lead: "Un premier échange, en français, pour comprendre votre situation. Écrivez-nous sur WhatsApp, appelez-nous ou envoyez un e-mail.",
    email: "Écrire un e-mail",
    to: "Destinataire",
  },
  en: {
    lead: "A first conversation to understand your situation. Message us on WhatsApp, call, or send an email.",
    email: "Send an email",
    to: "To",
  },
  zh: {
    lead: "先聊一聊,了解您的情况。欢迎通过 WhatsApp、电话、微信或电子邮件联系我们。",
    email: "发送电子邮件",
    to: "收件人",
  },
};

/** Closing contact block, drawn as an airmail envelope addressed to the advisor. */
export function ContactEnvelope({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = copy[locale];
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 bg-mist py-20 sm:py-28">
      <div className="container-site">
        <div className="envelope">
          <div className="envelope-inner grid gap-12 px-5 py-8 sm:p-12 lg:grid-cols-[1.25fr_1fr] lg:p-16">
            <div>
              <p className="inline-flex flex-col rounded-sm bg-navy px-3 py-1.5 text-[11px] font-bold leading-tight tracking-[.12em] text-white">
                <span>PAR AVION</span>
                <span className="font-medium opacity-80">BY AIR MAIL</span>
              </p>
              <h2 id="contact-title" className="h-serif mt-8 text-4xl leading-[1.05] sm:text-5xl">
                {dict.contact.title}
              </h2>
              <p className="body-lead mt-5 max-w-lg">{t.lead}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl(dict.actions.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring btn-primary w-full sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {dict.actions.whatsappAdvisor}
                </a>
                <a href={site.emailHref} className="focus-ring btn-outline w-full sm:w-auto">
                  <Mail className="h-4 w-4" />
                  {t.email}
                </a>
                <a href={site.phoneHref} aria-label={dict.actions.callLabel} title={dict.actions.callLabel} className="focus-ring btn-icon">
                  <Phone className="h-4 w-4" />
                </a>
                <WeChatContactButton locale={locale} />
              </div>
            </div>

            <div className="relative flex flex-col justify-end">
              <div aria-hidden="true" className="pointer-events-none absolute -top-2 right-0 hidden items-center sm:flex">
                <CancelWaves className="h-12 w-28 opacity-80" />
                <Postmark className="h-28 w-28 -rotate-12 opacity-90" />
              </div>
              <address className="not-italic lg:mt-40">
                <p className="text-sm font-medium text-muted">{t.to}</p>
                <ul className="mt-3 text-lg text-ink [&>li]:border-b [&>li]:border-dashed [&>li]:border-ink/25 [&>li]:py-2.5">
                  <li className="font-serif text-2xl">{site.founder} — {site.name}</li>
                  <li>
                    <a href={site.phoneHref} className="focus-ring link-underline tabular">{site.phoneDisplay}</a>
                  </li>
                  <li>
                    <a href={site.emailHref} className="focus-ring link-underline break-all">{site.email}</a>
                  </li>
                  <li>{dict.footer.location}</li>
                </ul>
                <p className="mt-4 text-sm text-muted">{dict.contact.localNote}</p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
