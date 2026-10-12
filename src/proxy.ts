import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, hasLocale, type Locale } from "@/lib/i18n";

/**
 * English is always the default. The only exception is a language the visitor
 * chose themselves with the language button (saved in a cookie); the browser's
 * Accept-Language header is intentionally ignored.
 */
function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return saved && hasLocale(saved) ? saved : DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPrefix = LOCALES.some((l) => pathname === `/${l.code}` || pathname.startsWith(`/${l.code}/`));
  if (hasPrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, sitemap.xml, robots.txt, ...)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
