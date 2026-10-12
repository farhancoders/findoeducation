"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";
import { localePath } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Close, Menu } from "@/components/ui/icons";

export function Header() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    const full = localePath(lang, href);
    return href === "/" ? pathname === full : pathname.startsWith(full);
  };

  const cta = localePath(lang, "/contact-us") + "#enquiry";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
        scrolled || open
          ? "border-brand-900/10 bg-ivory/90 shadow-[0_10px_30px_-20px_rgba(58,16,9,0.45)] backdrop-blur-xl"
          : "border-brand-900/10 bg-ivory"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Link href={localePath(lang)} aria-label={t.nav.homeAria} className="flex items-center gap-3">
          <Image src="/images/mark-brand.png" alt="" width={44} height={44} className="h-11" style={{ width: "auto" }} priority />
          <span className="leading-none">
            <span className="block font-display text-2xl font-semibold tracking-[0.14em] text-brand-800">FAITH</span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-brand-700">
              Education
            </span>
          </span>
        </Link>

        <nav aria-label={t.nav.primary} className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localePath(lang, item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`group relative py-2 text-sm font-medium tracking-wide transition-colors ${
                isActive(item.href) ? "text-brand-700" : "text-ink/75 hover:text-brand-800"
              }`}
            >
              {t.nav[item.key]}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand-700 transition-transform duration-500 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href={cta} className="btn btn-brand !py-2.5">
            {t.nav.cta}
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 text-brand-900 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close width={26} height={26} /> : <Menu width={26} height={26} />}
        </button>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-brand-900/10 bg-ivory md:hidden">
        <nav aria-label={t.nav.mobile} className="container-x flex h-[calc(100dvh-5rem)] flex-col gap-1 py-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localePath(lang, item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`border-b border-brand-900/10 py-5 font-display text-3xl ${
                isActive(item.href) ? "text-brand-700" : "text-brand-900"
              }`}
            >
              {t.nav[item.key]}
            </Link>
          ))}
          <Link href={cta} onClick={() => setOpen(false)} className="btn btn-brand mt-8">
            {t.nav.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
