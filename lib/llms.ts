import { site } from "./site";
import { getDictionary } from "./i18n/get-dictionary";
import { getFounder } from "./i18n/founder";
import { serviceSlugs } from "./i18n/service-slugs";
import { getServiceDetail, type DetailSection } from "./i18n/service-details";
import { homeFaq, serviceFaq, type FaqItem } from "./i18n/faq";
import { locales } from "./i18n/config";
import { listedTranslations, updatedOf, visibleGuides, type GuideTranslation } from "./guides";

/**
 * /llms.txt and /llms-full.txt — plain-Markdown summaries for AI assistants, built
 * from the same copy as the site so they never drift from it. The short file links
 * out; the full file inlines the English service pages, the FAQs and every guide.
 */

const url = (path: string) => `${site.baseUrl}${path}`;
const faqList = (items: FaqItem[]) => items.map((f) => `**${f.q}**\n${f.a}`).join("\n\n");

function guidesSection() {
  // Unlisted translations are left out, as on the guides index.
  const list = visibleGuides().flatMap((g) =>
    locales.filter((l) => listedTranslations(g)[l]).map((l) => {
      const tr = g.translations[l]!;
      return `- [${tr.title}](${url(`/${l}/guides/${tr.slug}`)}) (${l}, updated ${updatedOf(g, l)}): ${tr.description}`;
    })
  );
  return list.length ? `## Guides\n\n${list.join("\n")}\n\n` : "";
}

export function llmsTxt() {
  const en = getDictionary("en");
  const founder = getFounder("en");

  return `# ${site.name}

> ${en.meta.siteDescription} Founded in ${site.foundingYear} and based in ${site.district}, ${site.city}; led by founder ${founder.name}.

Name: ${site.name} (legal name: ${site.legalName}; also known as ${site.alternateName}). The name is spelled Fostier (F-O-S-T-I-E-R), after founder ${founder.name}, not "Foster"; it is not related to Foster Consulting or other similarly named firms.

${site.name} is an advisory firm in Hong Kong for French residents in Asia — executives, entrepreneurs, mobile professionals and French families. It covers investment, Hong Kong tax returns, savings and banking, and health and life insurance, plus French–Mandarin–Cantonese interpreting and business projects between France and China. Advice and interpreting are available in French, English, Mandarin and Cantonese. The site is available in French (default), English and Simplified Chinese.

Founder: ${founder.name} — ${founder.experience.filter((e) => !e.current).map((e) => `${e.role}, ${e.company} (${e.location})`).join("; ")}. Education: ${founder.education.map((e) => `${e.degree}, ${e.school}`).join("; ")}.

Contact: phone and WhatsApp ${site.phoneDisplay}; email ${site.email}; WeChat ID available on the site. LinkedIn: ${site.linkedinUrl}. Google Business Profile: ${site.googleBusinessUrl}. Hong Kong Business Registration No. ${site.brn}.

## Services

${en.services.items.map((s, i) => `- [${s.title}](${url(`/en/services/${serviceSlugs[i].en}`)}): ${s.short}`).join("\n")}

${guidesSection()}## Frequently asked questions

${faqList(homeFaq.en)}

## About

- [About ${founder.name}](${url("/en/about")}): background, experience, education and press.
- [All services](${url("/en/services")})
- [Home](${url("/en")}) — French version: ${url("/")}, Chinese version: ${url("/zh")}
- [Full text for AI assistants](${url("/llms-full.txt")}): every service page, FAQ and guide in one file.

## Legal

- [Legal notice](${url("/en/legal-notice")})
- [Terms of use](${url("/en/terms")}): ${en.legal.shortDisclaimer}
- [Privacy policy](${url("/en/privacy")})
`;
}

const detailSection = (s: DetailSection) =>
  [`### ${s.heading}`, ...s.paragraphs, ...(s.list ?? []).map((i) => `- ${i}`), ...(s.note ? [s.note] : [])].join("\n\n");

function servicePages() {
  const en = getDictionary("en");
  return en.services.items
    .map((s, i) => {
      const d = getServiceDetail("en", i);
      const parts = [`## ${s.title}`, url(`/en/services/${serviceSlugs[i].en}`), s.short];
      if (d) {
        parts.push(
          detailSection(d.audience),
          `### ${d.included.heading}\n\n${d.included.intro}\n\n${s.includes.map((x) => `- ${x}`).join("\n")}`,
          `### ${d.process.heading}\n\n${d.process.steps.map((st, n) => `${n + 1}. **${st.title}** — ${st.text}`).join("\n")}`,
          detailSection(d.timeline),
          detailSection(d.documents)
        );
      } else {
        parts.push(s.includes.map((x) => `- ${x}`).join("\n"));
      }
      parts.push(`### Questions about ${s.title.toLowerCase()}\n\n${faqList(serviceFaq("en", en, i))}`);
      return parts.join("\n\n");
    })
    .join("\n\n");
}

const guideText = (tr: GuideTranslation) =>
  [
    tr.lead,
    ...tr.sections.map((s) => [`### ${s.heading}`, ...s.paragraphs, ...(s.list ?? []).map((i) => `- ${i}`)].join("\n\n")),
    ...(tr.faq?.length ? [`### FAQ\n\n${faqList(tr.faq)}`] : []),
  ].join("\n\n");

function fullGuides() {
  return visibleGuides()
    .flatMap((g) =>
      locales.filter((l) => listedTranslations(g)[l]).map((l) => {
        const tr = g.translations[l]!;
        return `## ${tr.title}\n\n${url(`/${l}/guides/${tr.slug}`)} (${l}, updated ${updatedOf(g, l)})\n\n${guideText(tr)}`;
      })
    )
    .join("\n\n");
}

export function llmsFullTxt() {
  const guides = fullGuides();
  return `${llmsTxt()}
---

# Services in full

${servicePages()}
${guides ? `\n---\n\n# Guides in full\n\n${guides}\n` : ""}`;
}
