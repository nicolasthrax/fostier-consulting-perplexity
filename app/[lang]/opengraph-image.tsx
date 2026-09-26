import { ImageResponse } from "next/og";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** The bundled OG font has no CJK glyphs, so the Chinese card reuses the English tagline. */
const taglineLocale = (lang: Locale): Locale => (lang === "zh" ? "en" : lang);

// Satori has no repeating gradients, so the airmail stripes are an SVG pattern.
const AIRMAIL_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="p" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="24" height="72" fill="#ed2939"/><rect x="24" width="12" height="72" fill="#fff"/><rect x="36" width="24" height="72" fill="#002395"/><rect x="60" width="12" height="72" fill="#fff"/></pattern></defs><rect width="1200" height="630" fill="url(#p)"/></svg>`,
)}`;

export default function OpengraphImage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(taglineLocale(params.lang));

  // Airmail envelope: striped border, white card, title in brand navy.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          padding: 22,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AIRMAIL_SVG} width={1200} height={630} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
            color: "#141a38",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#002395" }}>{site.name}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#002395",
                color: "#ffffff",
                padding: "8px 14px",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              <span>PAR AVION</span>
              <span style={{ fontWeight: 400, opacity: 0.8 }}>BY AIR MAIL</span>
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08, maxWidth: 960, color: "#141a38" }}>
            {dict.hero.title}
          </div>

          <div style={{ display: "flex", fontSize: 26, color: "#5a6082" }}>{`Paris → Hong Kong · ${site.phoneDisplay}`}</div>
        </div>
      </div>
    ),
    size
  );
}
