"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  WECHAT_ID,
  WECHAT_QR_SRC,
  getWeChatStrings,
} from "@/lib/i18n/wechat";

function WeChatIcon({ className }: { className?: string }) {
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

function WeChatContactModal({
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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // While open: focus the dialog, keep Tab inside it, close on Escape, freeze the page
  // behind it, and hand focus back to whatever opened it.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open]);

  if (!open) return null;

  // Portalled to <body> so no transformed or clipped ancestor can trap the fixed overlay.
  return createPortal(
    <div
      className="fade-in fixed inset-0 z-[80] flex items-center justify-center p-4 [animation-duration:.2s]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-nuit/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-sm border-t-4 border-[#07C160] bg-white p-8 text-center shadow-pop"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={s.closeLabel}
          className="focus-ring absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-sm text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-sm bg-[#07C160] text-white">
          <WeChatIcon className="h-7 w-7" />
        </span>
        <h2 id={titleId} className="mt-4 font-serif text-xl font-medium text-ink">
          {s.title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {s.subtitle}
        </p>
        <div className="mt-6 rounded-sm bg-mist p-4">
          <p className="text-xs font-medium text-muted">
            {s.idLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="select-all text-lg font-semibold text-navy">
              {WECHAT_ID}
            </span>
            <button
              type="button"
              onClick={copy}
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-navy/25 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-navy"
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
            className="mx-auto mt-6 h-36 w-36 rounded-sm border border-line object-contain"
            onError={() => setQrOk(false)}
          />
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">{s.scanNote}</p>
      </div>
    </div>,
    document.body,
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
        className={`focus-ring inline-flex ${sizeClassName} items-center justify-center rounded-sm border border-[#07C160] bg-[#07C160] text-white transition-colors hover:border-[#06AD56] hover:bg-[#06AD56]`}
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
        className="focus-ring inline-flex items-center gap-2 rounded-sm text-left text-[15px] text-slate transition-colors hover:text-navy"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#07C160] text-white">
          <WeChatIcon className="h-3 w-3" />
        </span>
        <span>WeChat</span>
      </button>
      <WeChatContactModal open={open} onClose={() => setOpen(false)} locale={locale} />
    </>
  );
}
