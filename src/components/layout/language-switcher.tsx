"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Check, Globe } from "@/components/ui/icons";

function rememberLocale(code: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
}

/** Floating language picker (bottom-left). Swaps the locale segment of the URL and remembers the choice. */
export function LanguageSwitcher() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(code: Locale) {
    setOpen(false);
    if (code === lang) return;
    rememberLocale(code);
    const rest = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "");
    router.push(`/${code}${rest}${window.location.hash}`);
  }

  return (
    <div ref={root} className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6">
      {open && (
        <ul
          role="listbox"
          aria-label={t.language.choose}
          className="absolute bottom-[calc(100%+0.75rem)] left-0 w-52 overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-[0_30px_60px_-20px_rgba(58,16,9,0.45)]"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                lang={l.html}
                onClick={() => choose(l.code)}
                className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors ${
                  l.code === lang ? "bg-brand-900 font-semibold text-white" : "text-ink hover:bg-sand"
                }`}
              >
                {l.label}
                {l.code === lang && <Check width={16} height={16} className="text-accent-400" />}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.language.label}: ${lang.toUpperCase()}`}
        className="grid size-14 place-items-center rounded-full border border-brand-900/10 bg-white text-brand-900 shadow-[0_15px_40px_-12px_rgba(58,16,9,0.5)] transition hover:-translate-y-0.5 hover:border-accent-500"
      >
        <span className="flex flex-col items-center gap-0.5">
          <Globe width={20} height={20} />
          <span className="text-[0.6rem] font-bold tracking-widest">{lang.toUpperCase()}</span>
        </span>
      </button>
    </div>
  );
}
