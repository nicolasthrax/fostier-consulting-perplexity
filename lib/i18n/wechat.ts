import type { Locale } from "@/lib/i18n/config";

export const WECHAT_ID = "LucieFostier";

/** Lucie's WeChat QR, uploaded to the site. */
export const WECHAT_QR_SRC = "/brand/Screenshot 2026-09-12 at 12.39.24.png";

export interface WeChatStrings {
  buttonLabel: string;
  title: string;
  subtitle: string;
  idLabel: string;
  copyLabel: string;
  copiedLabel: string;
  scanNote: string;
  closeLabel: string;
}

const strings: Record<string, WeChatStrings> = {
  fr: {
    buttonLabel: "Discuter sur WeChat",
    title: "Nous écrire sur WeChat",
    subtitle: "Ajoutez-nous grâce à l'identifiant ci-dessous, ou scannez le QR code dans l'application.",
    idLabel: "Identifiant WeChat",
    copyLabel: "Copier",
    copiedLabel: "Copié !",
    scanNote: "Sur ordinateur : ouvrez WeChat sur votre téléphone et scannez le code.",
    closeLabel: "Fermer",
  },
  en: {
    buttonLabel: "Message us on WeChat",
    title: "Chat with us on WeChat",
    subtitle: "Add us with the ID below, or scan the QR code in the WeChat app.",
    idLabel: "WeChat ID",
    copyLabel: "Copy",
    copiedLabel: "Copied!",
    scanNote: "On a computer? Open WeChat on your phone and scan the code.",
    closeLabel: "Close",
  },
  zh: {
    buttonLabel: "微信咨询",
    title: "添加我们的微信",
    subtitle: "请使用下方微信号添加好友，或在微信中扫描二维码。",
    idLabel: "微信号",
    copyLabel: "复制",
    copiedLabel: "已复制！",
    scanNote: "如在电脑上浏览，请用手机微信扫描上方二维码。",
    closeLabel: "关闭",
  },
};

export const getWeChatStrings = (locale: Locale | string): WeChatStrings =>
  strings[locale as string] ?? strings.en;
