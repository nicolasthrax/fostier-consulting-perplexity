# Fostier Consulting — SEO / GEO / UX audit

_Audited 27 Sep 2026 at commit `e65eed1` (branch `redesign/editorial-french`). Audit only: no source files were changed._

## How the audit was done

- **Stack:** Next.js 14.2 App Router, TypeScript, Tailwind 3, Framer Motion. Hosted on Vercel (`vercel.json`, region `hkg1`). All routes are statically generated (SSG). `middleware.ts` redirects unprefixed paths to `/fr`.
- **Routes (14 × 3 locales = 42 indexable URLs):** `/{fr,en,zh}`, `/services`, `/services/[slug]` (7 localised slugs, `lib/i18n/service-slugs.ts`), `/about`, `/privacy`, `/cookies`, `/terms`, `/legal-notice`, plus `opengraph-image`, `robots.txt`, `sitemap.xml`, `icon.png`, `apple-icon.png`, and a noindex catch-all 404 (`app/[lang]/[...missing]`).
- **SEO config:** `app/robots.ts`, `app/sitemap.ts`, `lib/metadata.ts` (canonical, hreflang, OG, Twitter), `app/[lang]/layout.tsx` (base metadata, `<html lang>`, Organization JSON-LD), `lib/structured-data.ts`, `lib/i18n/titles.ts`.
- **Verification:**
  1. Ran `next build` and `next start`, then crawled all 42 sitemap URLs to extract titles, descriptions, canonicals, robots, headings, hreflang, OG/Twitter tags and JSON-LD (checked that it parses), and to test every internal link.
  2. Ran Lighthouse 12 (mobile, simulated throttling) on `/en`, `/en/about`, `/en/services`, `/en/services/tax` and `/zh`.
  3. Used headless Chrome to check horizontal overflow at 375, 768 and 1280 px, touch-target sizes, line length, keyboard tab order and focus rings, rendering with JavaScript turned off, and where the homepage CTA sits relative to the fold.
  4. Computed WCAG contrast ratios for the design tokens.
  5. Sent live requests to `https://www.fostierconsulting.com` using AI-crawler user agents, and checked headers, redirects and the 404 page.

---

## Summary scores

Scoring: PASS = 1, PARTIAL = 0.5, FAIL = 0, over applicable items.

| Category | Score | Headline |
| --- | --- | --- |
| **SEO** | **8 / 11 (73%)** | The technical base is strong: sitemap, hreflang, canonicals, valid JSON-LD, no broken links. **Core Web Vitals fail.** Lab LCP is 5.9–6.4 s on EN pages and 15.9 s on ZH, mostly because the Chinese font CSS blocks rendering on every page. |
| **GEO** | **4.5 / 9 (50%)** | Crawlers can reach everything and all content is in the server-rendered HTML. What's missing: an FAQ, question-style headings, a Person schema, concrete track-record facts, a full address, and `llms.txt`. Some content also contradicts itself across languages. |
| **UX** | **4.5 / 7 (64%)** | The value proposition is clear, the CTA is above the fold at every tested width, there is no overflow, and focus rings are good. Gaps: no contact entry in the desktop header, 15 px body copy, long lines on legal and service pages, a few contrast and label issues, and few trust signals (no testimonials or case studies). |

### Lighthouse (mobile, local production build)

| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/en` | 70 | 96 | 100 | 100 | 2.6 s | **6.4 s** | 160 ms | 0 |
| `/en/about` | 74 | 100 | 100 | 100 | 2.6 s | **6.2 s** | 0 ms | 0 |
| `/en/services` | 75 | 100 | 100 | 92 | 2.6 s | **5.9 s** | 0 ms | 0 |
| `/en/services/tax` | 75 | 100 | 100 | 100 | 2.6 s | **5.9 s** | 0 ms | 0 |
| `/zh` | 70 | 96 | 96 | 100 | 2.0 s | **15.9 s** | 170 ms | 0 |

On every page, LCP is almost entirely **render delay** (5.4–6.0 s). The LCP element is text, so no image is involved. The render delay is driven by roughly 128 KB (gzipped) of render-blocking CSS, about 99% of it unused. That CSS is 406 `@font-face` rules for Noto Serif SC and Noto Sans SC. On top of that, the text rise/fade animations start from hidden.

---

## Checklist

### SEO

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| S1 | robots.txt exists and doesn't block important pages | **PASS** | `app/robots.ts:6-7` → `User-Agent: * / Allow: /` plus a `Sitemap:` line. The live file is identical. |
| S2 | XML sitemap exists, is referenced in robots.txt, lists all public pages | **PASS** | `app/sitemap.ts:6-29` lists all 42 URLs with `xhtml:link` alternates for fr/en/zh plus x-default. Minor: `lastModified: now` (`sitemap.ts:17`) stamps every URL with the build time, so `lastmod` carries no signal. |
| S3 | Unique title ≤60, unique description ≤160, canonical, no stray noindex | **PARTIAL** | **Titles:** all 42 unique and ≤60 chars (`lib/i18n/titles.ts`). **Canonicals:** self-referencing absolute URLs on every page (`lib/metadata.ts:21,34`). **Robots:** `index, follow` everywhere; `noindex` only on the 404 (`not-found.tsx:8`, `[...missing]/page.tsx:10`). **Descriptions fail on several counts:** (a) duplicates: `/fr` = `/fr/about` and `/en` = `/en/about`, because `about/page.tsx:22` uses `about.mission.paragraphs[0]`, which is the same string as `meta.siteDescription`. (b) Over 160 chars: `/fr/services` (263), `/fr/services/partenaire-francais` (194), `/en/services` (191), `/fr/privacy` (190), `/en/privacy` (189), `/fr/cookies` (189), `/fr/services/interprete` (189). (c) Too thin: `/en/legal-notice` (45), `/fr/legal-notice` (40), and most ZH pages at 21–67 characters (e.g. `/zh/services/tax` = 21). Legal pages reuse the first section body as the description (`privacy/page.tsx:15` and siblings). |
| S4 | Exactly one H1; logical nesting | **PARTIAL** | One H1 on all 42 pages. **`/services` (all locales) skips h1 → h3.** Service titles are `<button>`s rather than headings (`components/ServicesExplorer.tsx:111-120`), and the desktop panel title is an `<h3>` (`:146`). Legal h2s read as "§1Data controller" because the § number is inline with no space in the accessible name (`components/LegalArticle.tsx:5`). |
| S5 | Descriptive lowercase hyphenated URLs; no broken internal links | **PASS** | FR slugs are ASCII (`fiscalite`, `fournisseur-chinois`); EN and ZH use English slugs. All 42 distinct internal link targets return 200. |
| S6 | Images: alt, modern formats, width/height, lazy below fold | **PARTIAL** | Alt text is good: the portrait says "Portrait of Lucie Fostier, founder of Fostier Consulting" (`lib/i18n/founder.ts:133`), and decorative logos use `alt=""`. `next/image` gives explicit sizes, lazy loading and the `priority` logo, but it serves **WebP only, no AVIF** (`next.config.mjs` sets no `images.formats`). Raw `<img>` tags skip optimisation: the WeChat QR is a 184 KB PNG (`components/WeChatContact.tsx:156`) and there are university logos in the tooltip (`UniversityHighlight.tsx:144`). Both are CSS-sized, so they cause no layout shift. File names aren't descriptive: `89EE7D74-…_a.jpeg` (`founder.ts:9-10`), `Screenshot 2026-09-12 at 12.39.24.png` (`lib/i18n/wechat.ts:6`), `FOSTIER consulting.png` (contains a space). |
| S7 | Open Graph + Twitter cards on all pages | **PASS** | Every page has 10 `og:*` and 7 `twitter:*` tags (`lib/metadata.ts:35-44`). The OG image renders at 1200×630 for each locale. Minor: the ZH OG card shows English text (`app/[lang]/opengraph-image.tsx:15`), and `og:image:alt` is just "Fostier Consulting". |
| S8 | JSON-LD: Organization (+ Service/FAQPage/Person) and valid syntax | **PARTIAL** | All blocks parse. `FinancialService` (a subtype of LocalBusiness and Organization) has name, logo, url, telephone, email, contactPoint, areaServed, founder, OfferCatalog (`lib/structured-data.ts:18-56`). Service pages add `Service` and `BreadcrumbList` (`:58-85`). **Gaps:** `sameAs` lists only the UFE partner page (`:39`), with no LinkedIn or Google Business Profile. `address` has locality only (`:31`); Google expects `streetAddress` for LocalBusiness. `founder` is a bare name (`:38`), and the About page has no `Person` with `alumniOf`, `worksFor`, `image`, `sameAs` or `knowsLanguage`. There is **no FAQPage** (the site has no FAQ content), and no `WebSite` node. |
| S9 | Multilingual: lang attributes, hreflang, x-default | **PASS** | `<html lang>` is `fr`/`en`/`zh-CN` (`layout.tsx:56`). Every page has reciprocal hreflang for fr/en/zh plus x-default → FR, both in `<head>` (`lib/metadata.ts:22-25`) and in the sitemap, with localised slugs mapped correctly. Notes: hreflang `zh` could be `zh-Hans`. The 404 page is French-only for all locales (`not-found.tsx:14-26`). The ZH "French partner" page describes a *different* service from FR/EN (see G3), which weakens the hreflang equivalence. |
| S10 | Core Web Vitals risks | **FAIL** | Lab **LCP 5.9–6.4 s (EN) and 15.9 s (ZH)**; CLS 0 everywhere; TBT 0–170 ms. Causes: **(1)** `lib/fonts.ts:23-34` loads Noto Serif SC and Noto Sans SC through `next/font` in the shared layout. That puts 282 KB + 94 KB of raw `@font-face` CSS in render-blocking stylesheets on **every** FR/EN page (Lighthouse estimates 1.5–1.8 s of savings). **(2)** Three fonts are preloaded, 356 KB in total, including **Newsreader italic (147 KB), which is never used** (`lib/fonts.ts:8`; no italic anywhere in `app/` or `components/`). **(3)** The hero H1 and leads animate in from hidden (`app/globals.css:64-68`, `.rise-line` and `.fade-in`). **(4)** On ZH, the LCP candidate ends up being the rotating postmark SVG text, and 2.6 s of main-thread work delays it. **(5)** The globe canvas redraws on every animation frame while visible (`components/HeroGlobe.tsx:265-297`). Framer Motion adds about 50 KB to first-load JS on the homepage (151 KB total). |
| S11 | HTTPS enforced; 404 page exists | **PASS** | Live: `http→https` 308, apex → `www` 308, `strict-transport-security: max-age=63072000`. `/en/does-not-exist` returns **404** with the site layout and noindex. Minor: file-like paths (e.g. `/foo.txt`) skip the middleware and hit Next's bare default 404 without the site layout. No security headers such as CSP, `X-Content-Type-Options` or `Referrer-Policy` (`next.config.mjs`). |

### GEO

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| G1 | robots/hosting don't block GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended | **PASS** (with caveat) | robots.txt allows all. Live `/en` returned **200 with the full HTML (120 KB, founder name present)** for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Googlebot, Bingbot, CCBot, Bytespider and Applebot-Extended. There is no Cloudflare; hosting is Vercel. _Caveat: see "Couldn't verify"._ |
| G2 | Key content in server-rendered HTML | **PASS** | All pages are SSG, and all copy, including every service's detail text, is in the initial HTML. Caveat: 7 homepage blocks (intro, advisor stamp, Hong Kong section) are served with inline `opacity:0` by `components/Reveal.tsx:4` and stay invisible without JavaScript. Crawlers still read the text. |
| G3 | Name, services, location, founder stated explicitly; acronyms spelled out | **PARTIAL** | Good: "Fostier Consulting", "Hong Kong", "Lucie Fostier, founder" and all seven services are named in full; "we" always follows a named referent. **Issues:** (a) "UFE" is not spelled out on the homepage (`content.ts` → `hero.ufePartnerBadge`); it's expanded only in the About press block. "KYC/AML" (savings disclaimer) and "RNCP" (tooltip) are never expanded. (b) **Contradictory language claims:** `contact.localNote` says "Support in French and English" in all three locales, including on the Chinese site. Meanwhile the schema lists French, English and Chinese (`structured-data.ts:13`), and the interpreting service offers Mandarin and Cantonese. (c) **ZH "French partner" is a different service:** FR/EN say "helping French entrepreneurs import Chinese goods into France", while ZH says "helping Chinese companies bring products into the French market". |
| G4 | Service pages open with a concise "what / who for" answer | **PARTIAL** | Each service page opens with H1 + a 1–2 sentence lead (`services/[slug]/page.tsx:57-67`, using `service.short`). Investment, interpreting, suppliers and French-partner name their audience. **Tax, savings and insurance don't say who they're for** (e.g. EN tax: "Careful support with preparing your tax file and filing your Hong Kong tax return."). |
| G5 | Question-style headings + FAQ with FAQPage schema | **FAIL** | No FAQ content or FAQPage schema anywhere. Headings are declarative ("What this includes", "Our mission"). The `.faq-panel` CSS class exists but is used for the services accordion. |
| G6 | Concrete facts: credentials, years, markets, results, case studies, with dates | **PARTIAL** | Present: AIA Senior Wealth Management Manager, HSBC Paris, Fudan (QS #26, 2027), ESG (RNCP 6–7), UFE talk dated Feb 2026, markets (HK, Macau, mainland China). Missing: **years of experience, dates for each role, founding year, client numbers, results, case studies**. |
| G7 | Consistent name / address / phone / email across pages and schema | **PARTIAL** | Phone, email and name come from one source (`lib/site.ts`) and are identical in the header, footer, contact block, legal pages and JSON-LD. There is **no street address anywhere**: the footer, schema and legal notice all say just "Hong Kong". The email is a personal Hotmail address (`site.ts:12`) that doesn't match the business name. Language claims are inconsistent (see G3). |
| G8 | Author/about page (E-E-A-T); visible "last updated" dates | **PARTIAL** | Strong About page: bio, experience, education and an external press link (`app/[lang]/about/page.tsx`). But there is no `Person` schema, no LinkedIn or other `sameAs`, no licence or registration details, and no company registration number in the legal notice. **"Last updated" appears only on the four legal pages** (`LegalArticle.tsx:5`), not on service or About content. |
| G9 | /llms.txt (optional) | **FAIL** | `https://www.fostierconsulting.com/llms.txt` → 404. |

### UX

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| U1 | Clear value proposition + primary CTA above the fold | **PASS** | H1 "Wealth advice for French residents of Hong Kong." + subtitle + "Message us on WhatsApp" (`app/[lang]/page.tsx:68-89`). CTA bottom edge measured at 453–481 px at 375×667, 390×844 and 1280×800 in all locales, so it's above the fold. |
| U2 | Navigation: ≤7 items, current page indicated, works on mobile | **PARTIAL** | Two items plus a language switcher (`components/Header.tsx:32-35`). Desktop sets `aria-current` with an underline (`:47`), and the language switcher marks the current locale. The mobile menu works (hamburger, Esc closes). But **the mobile menu doesn't show the current page** (`:71-79`), the nav `aria-label`s are hard-coded English ("Primary", "Mobile", `:42,70`) on FR/ZH pages, and there is no "Contact" item. |
| U3 | Contact/booking reachable within one click from every page | **PARTIAL** | The footer on every page lists phone, email, WhatsApp and WeChat (`components/Footer.tsx:62-90`), but you have to scroll to reach it. The mobile menu has WhatsApp + phone. **The desktop header has no contact entry** (the WhatsApp button was removed in `e65eed1`). Legal pages don't render the `ContactEnvelope`. There is no booking or calendar link. |
| U4 | Accessibility (WCAG 2.2 AA) | **PARTIAL** | Good: skip link, `header/nav/main/footer` landmarks, visible 2 px red focus ring on every tab stop (tested 16 stops), WeChat modal with a focus trap, Esc to close and focus returned to the opener, reduced-motion handling, Lighthouse a11y 96–100. **Issues:** (a) The "Hong Kong" globe chip is white on `#ED2939` at 11 px, **4.22:1** (`HeroGlobe.tsx:329`); Lighthouse flags it. (b) WeChat buttons: white icon on `#07C160` is **2.38:1**, below the 3:1 non-text minimum (`WeChatContact.tsx:187,207`). (c) ZH footer WeChat chip: visible text "WeChat" but `aria-label="添加我们的微信"`, which fails WCAG 2.5.3 Label in Name (`WeChatContact.tsx:204`). (d) Two identical "Learn more" links on `/services` with no service context (`ServicesExplorer.tsx:27-33`). (e) Content hidden without JS (G2). Touch targets: all ≥24 px or covered by the spacing exception (header and footer links are 20 px tall with ≥12 px spacing). No forms, so no label issues. |
| U5 | Responsive at 375 / 768 / 1280, no horizontal scroll | **PASS** | `scrollWidth − clientWidth = 0` on 10 pages (EN/FR/ZH home, services, service detail, about, privacy) at all three widths. The hamburger appears below `lg`. |
| U6 | Forms: minimal fields, inline validation, success/error states | **N/A** | The site has no forms by design. Contact is via WhatsApp, email, phone and WeChat. The WeChat "Copy ID" shows "Copied!" on success but fails silently when the clipboard is unavailable (`WeChatContact.tsx:40-42`). |
| U7 | Readable typography (body ≥16 px, ~60–80 chars/line); consistent style | **PARTIAL** | Lead copy is 17–18 px and legal body 16 px, but much running text is **15 px** (`text-[15px]`: services explorer, experience details, contact notes, footer), and disclaimers are 12 px. **Line length reaches about 88–96 characters** on legal pages and service detail pages at ≥768 px (`LegalArticle.tsx:5` `max-w-3xl`; `services/[slug]` `max-w-2xl` at 18 px). The visual style is consistent and documented in `DESIGN.md`. |
| U8 | Trust signals: testimonials, client logos, privacy policy, cookie consent | **PARTIAL** | Present: privacy, cookie and terms pages and legal notice, with dated revisions; UFE partner badge and press article; employer and university logos. Cookie consent is **not required**: no `Set-Cookie` locally or live, and the cookie policy says only strictly necessary cookies are used. Missing: **testimonials, case studies, client logos**, business-domain email, company registration number, and licence status (the terms say insurance status is disclosed before subscription). Showing AIA and HSBC logos could read as endorsement; the label "Background" helps. |

---

## Prioritised fix list

Effort: **S** < 1 h, **M** a few hours, **L** a day or more, or blocked on business input.

### High impact

| # | Fix | Effort | Files | Suggested change |
| --- | --- | --- | --- | --- |
| H1 | **Stop shipping the Chinese font CSS on every page** | S | `lib/fonts.ts:21-34`, `app/[lang]/layout.tsx:8,56`, `tailwind.config.ts` (fontFamily) | Drop the `Noto_Serif_SC` and `Noto_Sans_SC` `next/font` loaders. Put system CJK fonts in the Tailwind stacks instead (`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC"`, plus `"Songti SC", "Noto Serif CJK SC"` for serif). This removes about 128 KB gzipped of render-blocking CSS; Lighthouse estimates 1.5–1.8 s off LCP. If the web font is essential, load it only on ZH, through a separate layout or route group or a `<link>` rendered only when `lang === "zh"`. |
| H2 | **Remove the unused italic face** | S | `lib/fonts.ts:8` | `style: ["normal"]` saves a 147 KB preload on every page. |
| H3 | **Fix meta descriptions** | S | `lib/i18n/content.ts` (add per-page `metaDescription`), `about/page.tsx:22`, `services/page.tsx:17`, `privacy|cookies|terms|legal-notice/page.tsx:15`, `services/[slug]/page.tsx:33` | Write a unique 120–155 character description for each page and locale. Give About its own description. Cut the seven that run over 160. Replace the 40-character legal-notice descriptions. Write ZH descriptions of about 60–80 characters. |
| H4 | **Add an FAQ with FAQPage schema** | M | New `faq` entries in `content.ts` (per service + home), a new `components/Faq.tsx`, `lib/structured-data.ts` (add `faqJsonLd`) | 4–6 real client questions per service as question headings, e.g. "Do I need to file a Hong Kong tax return as a French resident?" and "Can you help me open a bank account before I arrive?". Emit matching `FAQPage` JSON-LD. This is the largest GEO gain available. |
| H5 | **Make the language claims and service scope consistent** | S | `content.ts` → `contact.localNote` (fr/en/zh), ZH `services.items[6]`, `lib/structured-data.ts:13` | State the real languages, e.g. "French, English, Mandarin and Cantonese", in every locale and in the schema. Decide whether the ZH "French partner" page is the same service as FR/EN. If not, give it its own slug and don't hreflang-pair it. |
| H6 | **Show hero and above-the-fold text without waiting for the animation** | M | `app/globals.css:64-68`, `components/SectionHeading.tsx:5`, `components/Reveal.tsx:4` | Keep the H1 painted from the first frame: animate a decorative underline or clip instead of hiding the text, or cut the delay to ≤150 ms. For `Reveal`, avoid SSR `opacity:0` by using a CSS-only reveal gated on a `.js` class or `@media (scripting: enabled)`. Re-run Lighthouse after H1 and H2 to measure what remains. |

### Medium impact

| # | Fix | Effort | Files | Suggested change |
| --- | --- | --- | --- | --- |
| M1 | Enrich structured data (Person, sameAs, WebSite) | S | `lib/structured-data.ts:38-39`, `app/[lang]/about/page.tsx` | Add a `Person` node for Lucie Fostier: `jobTitle`, `worksFor: {@id org}`, `alumniOf` Fudan University and ESG, `image`, `knowsLanguage`, `sameAs` (LinkedIn). Reference it from `founder`. Add LinkedIn and Google Business Profile URLs to the Organization `sameAs`. Add a `WebSite` node. |
| M2 | Address / NAP | M (needs business input) | `lib/site.ts`, `lib/structured-data.ts:31`, `components/Footer.tsx:33-36`, legal notice in `content.ts` | Publish a business or correspondence address, or at least a district, with `streetAddress` and `postalCode` in the schema. Create a Google Business Profile with the identical name, phone and address. Add the Business Registration number to the legal notice. |
| M3 | Contact entry in the desktop header | S | `components/Header.tsx:32-35` | Add a quiet "Contact" text link to `#contact` (or the phone number) in the primary nav. This avoids bringing back the WhatsApp button that was deliberately removed. Render `ContactEnvelope` on legal pages too, or at least link to it. |
| M4 | Services page heading structure | S | `components/ServicesExplorer.tsx:111-120,146` | Wrap each service button in an `<h2>` (the button stays inside the heading). Make the desktop panel title an `<h2>` or a non-heading element. This removes the h1 → h3 skip. |
| M5 | Concrete track record and dates | M (content) | `lib/i18n/founder.ts`, `content.ts` | Add years for each role, total years of experience, the Fostier Consulting founding year, and 2–3 anonymised case studies ("French family relocating from Paris, 2025: …"). |
| M6 | Visible "last updated" on content pages | S | `app/[lang]/about/page.tsx`, `services/[slug]/page.tsx`, `lib/structured-data.ts` | Show "Updated: {date}" under each H1 and add `dateModified` to the Service and Person JSON-LD. |
| M7 | Spell out acronyms and state the audience | S | `content.ts` → `hero.ufePartnerBadge`, savings disclaimer, ESG tooltip in `founder.ts:268-296`; `services.items[1..3].short` | Use "Official partner of UFE Hong Kong (Union des Français de l'Étranger)", "KYC/AML (identity and anti-money-laundering checks)", "RNCP (French national qualifications register)". Add "for French residents of Hong Kong" to the tax, savings and insurance leads. |
| M8 | A11y fixes | S | `HeroGlobe.tsx:329`, `WeChatContact.tsx:187,204-210`, `ServicesExplorer.tsx:27-33`, `Header.tsx:42,70,71-79` | Use `bg-fred-700` for the HK chip (5.74:1). Darken the WeChat green to `#059447` (3.94:1) or `#058A42` (4.45:1). Localise the chip's visible text ("微信") and start the aria-label with it, or drop the aria-label. Give "Learn more" links a visually hidden service name. Localise nav aria-labels and add `aria-current` to mobile menu links. |
| M9 | Trust signals | L (content, compliance) | Home page, About page | Add 2–3 client testimonials (with consent; check they comply with any insurance-intermediary rules). Show licence status clearly if a licence is held (e.g. Insurance Authority number). Move to an email address on the business domain (`lib/site.ts:12`). |

### Low impact

| # | Fix | Effort | Files | Suggested change |
| --- | --- | --- | --- | --- |
| L1 | Add `/llms.txt` | S | `public/llms.txt` (or `app/llms.txt/route.ts` built from the dictionary) | A short Markdown summary: who (Lucie Fostier, Fostier Consulting, Hong Kong), the seven services with URLs, languages, contact details, and the key About and legal URLs. |
| L2 | AVIF + image hygiene | S | `next.config.mjs`, `founder.ts:9`, `wechat.ts:6`, `Logo.tsx:14` | `images: { formats: ["image/avif", "image/webp"] }`. Rename files descriptively (`lucie-fostier-portrait.jpg`, `wechat-qr-lucie-fostier.png`, `fostier-consulting-logo.png`). Serve the QR through `next/image`. |
| L3 | Real `lastmod` in sitemap | S | `app/sitemap.ts:17` | Use a per-route content date (e.g. the legal `updated` date, or a constant bumped when content changes) instead of `new Date()`. |
| L4 | Localised 404 and bare 404s | S | `app/[lang]/not-found.tsx`, add `app/not-found.tsx` + root layout if needed | Read the locale from the path (via `headers()` / middleware header) to render FR/EN/ZH copy. Give file-like 404s the site chrome. |
| L5 | ZH OG image in Chinese | M | `app/[lang]/opengraph-image.tsx:15` | Load a subset CJK font (just the tagline glyphs) into `ImageResponse` so the Chinese card isn't in English. |
| L6 | Typography comfort | M (design) | `app/globals.css`, `LegalArticle.tsx:5`, service pages | Raise running text from 15 → 16 px. Cap long-form measure at `max-w-prose` / about 68ch. |
| L7 | Reduce idle main-thread work | M | `HeroGlobe.tsx:265-297`, `AdvisorMapPill.tsx:51-69`, `Postmark.tsx:25` | Stop the globe's animation loop after the intro plus a few sway cycles, or throttle it to about 30 fps. Stop the pill pulse loop when it isn't hovered. This helps INP and battery on low-end phones. |
| L8 | Redirect codes | S | `middleware.ts:17` | Use 308 for unprefixed paths that map to real routes (`/services`, `/about`, …). Keep 307/404 for unknown paths. |
| L9 | Security headers | S | `next.config.mjs` (`headers()`) | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a CSP with `frame-ancestors 'self'`. |
| L10 | Legal heading names | S | `components/LegalArticle.tsx:5` | Mark the `§n` span `aria-hidden`, or add a space, so headings read "Data controller". |
| L11 | Chinese variant targeting | S (tag) / L (content) | `lib/i18n/config.ts`, `lib/metadata.ts:22-25`, `app/sitemap.ts:24` | Use hreflang `zh-Hans` to match the Simplified content. For the Hong Kong market, consider a Traditional Chinese (`zh-Hant-HK`) version later. |

---

## Couldn't verify

| Item | Why |
| --- | --- |
| **Vercel Firewall / Bot Protection / "AI bots" managed rules** | This needs the Vercel dashboard, and I didn't check it. My bot tests spoofed user agents from a residential IP. Real crawlers come from their own IP ranges, which Vercel's bot verification may treat differently. **Check: Vercel → Project → Firewall → Bot Management / managed rulesets.** |
| **Field Core Web Vitals (CrUX / Search Console)** | Only lab data was collected. Lighthouse ran against local `next start` on this Mac with simulated mobile throttling, not against Vercel's CDN, so live TTFB and caching will differ. The render-blocking CSS and fonts apply in production too. |
| **Google Rich Results / Schema.org validator** | JSON-LD was checked for JSON syntax and reviewed by hand against schema.org and Google's requirements. It was not run through Google's Rich Results Test, which needs a browser session on Google's side. |
| **Search Console indexing and coverage** | No access. |
| **Screen-reader behaviour** | Checks were Lighthouse/axe plus a keyboard tab-order test. No VoiceOver or NVDA pass was done. |
| **Regulatory claims and licensing** | Not a legal review. The trust and E-E-A-T notes point out what's missing from the page; they don't say what's legally required. |
| **Every page at every width** | 10 representative pages (all templates, all three locales) were tested at 375, 768 and 1280 px. Legal and service templates are shared, so the other pages should behave the same. |

---

## Fix status — first pass (27 Sep 2026)

Verified on a fresh production build: 42/42 pages crawled with unique titles and descriptions and no heading skips; JSON-LD parses on every page; no broken links; 0 px horizontal overflow at 375, 768 and 1280 px; nothing hidden with JavaScript turned off; the localised 404 checked in a browser.

**Lighthouse (mobile), before → after**

| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/en` | 70 → **92** | 96 → **100** | 100 | 100 | 2.6 → **0.9 s** | 6.4 → **3.3 s** | 160 → **0 ms** |
| `/en/about` | 74 → **88** | 100 | 100 | 100 | 2.6 → **0.9 s** | 6.2 → **4.0 s** | 0 |
| `/en/services` | 75 → **90** | 100 | 100 | 92 → **100** | 2.6 → **0.9 s** | 5.9 → **3.6 s** | 0 |
| `/en/services/tax` | 75 → **92** | 100 | 100 | 100 | 2.6 → **0.9 s** | 5.9 → **3.3 s** | 0 |
| `/zh` | 70 → **87** | 96 → **100** | 96 → **100** | 100 | 2.0 → **0.9 s** | 15.9 → **4.1 s** | 170 → **0 ms** |

| Item | Status | Notes |
| --- | --- | --- |
| H1 CJK font CSS | Done | System CJK stacks. CSS went from 4 files (414 KB raw) to 1 file (37.5 KB). |
| H2 Italic face | Done | |
| H3 Meta descriptions | Done | `lib/i18n/descriptions.ts`: 42 unique descriptions, 120–155 chars in FR/EN. |
| H4 FAQ + FAQPage | Done | `components/Faq.tsx` and `lib/i18n/faq.ts`, on the home page and all 21 service pages. Answers only restate existing site copy. Google now shows FAQ rich results mainly for government and health sites; the value here is for AI answer engines. |
| H5 Language consistency | Done | French, English, Mandarin and Cantonese everywhere: contact note, legal notice, FAQ, schema and `llms.txt`. The ZH "French partner" page now describes the same service as FR/EN (helping French entrepreneurs), with a new title, lead, list, description and FAQ. |
| H6 Hero animation / Reveal | Partly done | `Reveal` is now CSS-only and visible without JS, which also removes Framer Motion from the home page (151 → 110 KB first-load JS). The hero animation wasn't the remaining LCP cause (see below). |
| M1 Structured data | Done | Site-wide `@graph` with WebSite, FinancialService and Person; ProfilePage on About; WebPage + `dateModified` on services. `sameAs` = LinkedIn, Google Business Profile, UFE; `hasMap`, `foundingDate` 2015, and the BRN as `identifier`. |
| M3 Header contact | Done | "Contact" nav link to `#contact`, which every template now has (legal pages gained the contact envelope). |
| M4 Services headings | Done | |
| M6 Updated dates | Done | `site.contentUpdated`, shown under the H1 on About and service pages. |
| M7 Acronyms / audience | Done | UFE, KYC/AML and RNCP spelled out; tax, savings and insurance leads now name their audience. |
| M8 A11y | Done | HK chip at 5.74:1; WeChat green `#058A42` (4.45:1); ZH label-in-name fixed; "Learn more" links carry the service name; localised nav labels; `aria-current` in the mobile menu. |
| L1 llms.txt | Done | `app/llms.txt/route.ts`, built from the dictionary. |
| L2 AVIF + file names | Done | Images renamed descriptively; the QR goes through `next/image` (184 KB PNG → 28 KB AVIF). |
| L3 Sitemap lastmod | Done | |
| L4 Localised 404 | Done | The copy follows the URL's locale. See the open issue below. |
| L5 ZH OG image | Done | CJK glyph subset fetched at build time, falling back to English. |
| L6 Typography | Partly done | Running text at 16 px; legal pages at `max-w-prose`. |
| L7 Globe redraw | Done | Redraws at ~30 fps. The map-pill pulse still redraws every frame. |
| L8 Redirects | Done | 308 for real unprefixed pages. |
| L9 Security headers | Done | nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors`. There's no script CSP: that would need nonces for Next's inline scripts. |
| L10 Legal headings | Done | |
| L11 hreflang | Done | `zh-Hans` in `<html lang>`, hreflang and the sitemap. |
| M2 Address / NAP | Done | "Central, Hong Kong" in the footer, contact block, legal notice and schema (district only, to match the service-area Google Business Profile). BR No. 38375423 in the legal notice and the footer. LinkedIn link in the footer. |
| M5 Track record | Partly done | Founded in 2015, shown in the bio, the About timeline ("Since 2015"), the FAQ and the schema. **Still needed:** dates for the AIA and HSBC roles, case studies. |
| M9 Trust signals | **Partly done** | Business-domain email (`lucie@fostierconsulting.com`) now used site-wide; company registration number shown. Still needed: testimonials, licence status. |

**Open issues found during this pass**

1. **LCP is still 3.3–4.1 s in the lab.** After FCP (0.9 s) the text repaints when the Latin web fonts arrive (Newsreader 132 KB with its optical-size axis, Bricolage 77 KB), and that repaint becomes the LCP. The fixes change the typography, so they need a design decision: `display: "optional"` (no swap on a slow first visit), dropping the `opsz` axes (smaller files, no optical sizing), or static 400/500 weights only.
2. **The 404 body is rendered client-side (this predates the fixes; the live site does it too).** The status is a correct 404 with `noindex`, but the HTML shell is `__next_error__` and the content only appears after JavaScript loads. The cause is Next 14 not catching `notFound()` inside a dynamic root segment (`app/[lang]/layout.tsx` with no `app/layout.tsx`). Fixing it means restructuring the root layout.
