import "server-only";
import type { Dictionary, Locale } from "@/lib/i18n";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  id: () => import("@/dictionaries/id.json").then((m) => m.default as Dictionary),
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default as Dictionary),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default as Dictionary),
  it: () => import("@/dictionaries/it.json").then((m) => m.default as Dictionary),
  es: () => import("@/dictionaries/es.json").then((m) => m.default as Dictionary),
  zh: () => import("@/dictionaries/zh.json").then((m) => m.default as Dictionary),
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default as Dictionary),
  ko: () => import("@/dictionaries/ko.json").then((m) => m.default as Dictionary),
};

export const getDictionary = (lang: Locale) => dictionaries[lang]();
