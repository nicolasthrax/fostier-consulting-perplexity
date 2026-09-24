"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  WECHAT_ID,
  WECHAT_QR_SRC,
  getWeChatStrings,
} from "@/lib/i18n/wechat";

export function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.6 3.6C6 3.6 3 6 3 9.1c0 1.7.9 3.2 2.4 4.2l-.7 2.3 2.6-1.3c.7.2 1.5.3 2.3.3h.5" />
      <path d="M21 14.8c0-2.7-2.2-4.9-5-4.9s-5 2.2-5 4.9 2.2 4.9 5 4.9c.7 0 1.3-.1 1.9-.3l2.3 1.1-.6-2c.9-.6 1.4-1.7 1.4-2.7Z" />
      <circle cx="6.6" cy="8" r=".35" fill="currentColor" stroke="none" />
      <circle cx="12.3" cy="8" r=".35" fill="currentColor" stroke="none" />
    </svg>
  );
}

function useCopyId() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (older browsers) — ID still selectable */
    }
  }, []);
  return { copied, copy };
}

export function WeChatContactModal({
  open,
  onClose,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale | string;
}) {
  const [qrOk, setQrOk] = useState(true);
  const { copied, copy } = useCopyId();
  const s = getWeChatStrings(locale);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="card-base relative w-full max-w-sm p-8 text-center shadow-lift animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label={s.closeLabel}
          className="focus-ring absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07C160] text-white">
          <WeChatIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-serif text-xl font-medium text-ink">
          {s.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {s.subtitle}
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-parchment p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted">
            {s.idLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="select-all text-lg font-semibold text-navy">
              {WECHAT_ID}
            </span>
            <button
              type="button"
              onClick={copy}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-navy/25 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-navy/50"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-fred" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? s.copiedLabel : s.copyLabel}
            </button>
          </div>
        </div>
        {qrOk && (
          <img
            src={WECHAT_QR_SRC}
            alt={s.scanNote}
            className="mx-auto mt-6 h-36 w-36 rounded-xl border border-line object-contain"
            onError={() => setQrOk(false)}
          />
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">{s.scanNote}</p>
      </div>
    </div>
  );
}

export function WeChatContactButton({
  locale,
  sizeClassName = "h-12 w-12",
}: {
  locale: Locale | string;
  sizeClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const s = getWeChatStrings(locale);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={s.buttonLabel}
        title={s.buttonLabel}
        className={`focus-ring inline-flex ${sizeClassName} items-center justify-center rounded-full border border-[#07C160] bg-[#07C160] text-white transition-colors hover:bg-[#06AD56] hover:border-[#06AD56]`}
      >
        <WeChatIcon className="h-5 w-5" />
      </button>
      <WeChatContactModal open={open} onClose={() => setOpen(false)} locale={locale} />
    </>
  );
}

export function WeChatContactChip({ locale }: { locale: Locale | string }) {
  const [open, setOpen] = useState(false);
  const s = getWeChatStrings(locale);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={s.title}
        className="focus-ring inline-flex items-center gap-2 rounded-sm text-left text-sm text-muted transition-colors hover:text-navy"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#07C160] text-white">
          <WeChatIcon className="h-3 w-3" />
        </span>
        <span>WeChat</span>
      </button>
      <WeChatContactModal open={open} onClose={() => setOpen(false)} locale={locale} />
    </>
  );
}
