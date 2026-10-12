import type en from "@/dictionaries/en.json";

export const LOCALES = [
  { code: "en", label: "English", html: "en-AU", og: "en_AU" },
  { code: "id", label: "Bahasa Indonesia", html: "id", og: "id_ID" },
  { code: "ru", label: "Русский", html: "ru", og: "ru_RU" },
  { code: "fr", label: "Français", html: "fr", og: "fr_FR" },
  { code: "it", label: "Italiano", html: "it", og: "it_IT" },
  { code: "es", label: "Español", html: "es", og: "es_ES" },
  { code: "zh", label: "中文", html: "zh-Hans", og: "zh_CN" },
  { code: "ja", label: "日本語", html: "ja", og: "ja_JP" },
  { code: "ko", label: "한국어", html: "ko", og: "ko_KR" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export type Dictionary = typeof en;

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale =>
  LOCALES.some((l) => l.code === value);

export const localeMeta = (code: Locale) => LOCALES.find((l) => l.code === code)!;

/** Prefix an internal path with the locale: ("id", "/contact-us#enquiry") -> "/id/contact-us#enquiry" */
export function localePath(lang: Locale, path = "/") {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** hreflang map for every locale of a given path. */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l.html, localePath(l.code, path)])),
    "x-default": localePath(DEFAULT_LOCALE, path),
  };
}
