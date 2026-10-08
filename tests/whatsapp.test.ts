import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n/content";
import { homeFaq } from "@/lib/i18n/faq";
import { site, whatsappUrl } from "@/lib/site";

const locales = ["fr", "en", "zh"] as const;

describe("WhatsApp contact", () => {
  it("links to the WhatsApp Business number as digits only", () => {
    expect(whatsappUrl("Bonjour")).toBe("https://wa.me/8619875878198?text=Bonjour");
  });

  it("keeps the localized pre-filled messages URL-encoded", () => {
    for (const lang of locales) {
      const message = dictionaries[lang].actions.whatsappMessage;
      const url = new URL(whatsappUrl(message));
      expect(url.pathname).toBe("/8619875878198");
      expect(url.searchParams.get("text")).toBe(message);
      expect(whatsappUrl(message)).not.toMatch(/\s/);
    }
  });

  it("shows WhatsApp and voice calls as distinct numbers", () => {
    expect(site.whatsappDisplay).toBe("+86 198 7587 8198");
    expect(site.phoneDisplay).toBe("+852 6537 4439");
    expect(site.phoneHref).toBe("tel:+85265374439");
  });

  it("names both numbers in every locale's contact copy", () => {
    for (const lang of locales) {
      const copy = JSON.stringify([dictionaries[lang].legal, homeFaq[lang]]);
      expect(copy).toContain(site.whatsappDisplay);
      expect(copy).toContain(site.phoneDisplay);
      expect(copy).not.toMatch(/WhatsApp\s*[:：]?\s*\+852|\+852 6537 4439[^"]{0,4}(call or WhatsApp|appel ou WhatsApp|电话或 WhatsApp)/);
    }
  });
});
