"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

/** Only the slices of the dictionary that client components need. */
export type ClientDictionary = Pick<Dictionary, "nav" | "form" | "chat" | "language">;

type Ctx = { lang: Locale; t: ClientDictionary };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ lang, t, children }: Ctx & { children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
