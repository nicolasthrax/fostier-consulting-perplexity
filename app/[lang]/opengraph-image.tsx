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

export default function OpengraphImage({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(taglineLocale(params.lang));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #001a70 0%, #002395 55%, #1d3fb3 100%)",
          color: "white",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "white",
              color: "#002395",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            FC
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 1 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", fontSize: 64, fontWeight: 600, lineHeight: 1.15, maxWidth: 980 }}>
          {dict.hero.title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>{`Hong Kong · FR · EN · ${site.phoneDisplay}`}</div>
          <div style={{ display: "flex", height: 10, width: 180, borderRadius: 5, overflow: "hidden" }}>
            <div style={{ flex: 1, background: "#ffffff" }} />
            <div style={{ flex: 1, background: "#ed2939" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
