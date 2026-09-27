import { site } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getFounder } from "@/lib/i18n/founder";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { visibleGuides } from "@/lib/guides";
import { locales } from "@/lib/i18n/config";

export const dynamic = "force-static";

/** /llms.txt — a plain-Markdown summary for AI assistants, built from the same copy as the site. */
function guidesSection() {
  const list = visibleGuides().flatMap((g) =>
    locales.filter((l) => g.translations[l]).map((l) => {
      const tr = g.translations[l]!;
      return `- [${tr.title}](${site.baseUrl}/${l}/guides/${tr.slug}) (${l}, updated ${g.updated}): ${tr.description}`;
    })
  );
  return list.length ? `## Guides\n\n${list.join("\n")}\n\n` : "";
}

export function GET() {
  const en = getDictionary("en");
  const founder = getFounder("en");
  const url = (path: string) => `${site.baseUrl}${path}`;

  const body = `# ${site.name}

> ${en.meta.siteDescription} Founded in ${site.foundingYear} and based in ${site.district}, ${site.city}; led by founder ${founder.name}.

${site.name} is an advisory firm in Hong Kong for French residents in Asia — executives, entrepreneurs, mobile professionals and French families. It covers investment, Hong Kong tax returns, savings and banking, and health and life insurance, plus French–Mandarin–Cantonese interpreting and business projects between France and China. Advice and interpreting are available in French, English, Mandarin and Cantonese. The site is available in French (default), English and Simplified Chinese.

Founder: ${founder.name} — ${founder.experience.filter((e) => !e.current).map((e) => `${e.role}, ${e.company} (${e.location})`).join("; ")}. Education: ${founder.education.map((e) => `${e.degree}, ${e.school}`).join("; ")}.

Contact: phone and WhatsApp ${site.phoneDisplay}; email ${site.email}; WeChat ID available on the site. LinkedIn: ${site.linkedinUrl}. Google Business Profile: ${site.googleBusinessUrl}. Hong Kong Business Registration No. ${site.brn}.

## Services

${en.services.items.map((s, i) => `- [${s.title}](${url(`/en/services/${serviceSlugs[i].en}`)}): ${s.short}`).join("\n")}

${guidesSection()}## About

- [About ${founder.name}](${url("/en/about")}): background, experience, education and press.
- [All services](${url("/en/services")})
- [Home](${url("/en")}) — French version: ${url("/fr")}, Chinese version: ${url("/zh")}

## Legal

- [Legal notice](${url("/en/legal-notice")})
- [Terms of use](${url("/en/terms")}): ${en.legal.shortDisclaimer}
- [Privacy policy](${url("/en/privacy")})
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
