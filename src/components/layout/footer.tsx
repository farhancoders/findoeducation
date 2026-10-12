import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { Mail, Phone, Pin } from "@/components/ui/icons";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const f = dict.footer;
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />
      <div className="container-x grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image src="/images/logo-cream.png" alt="Faith Education" width={190} height={129} className="h-auto w-44" />
          <p className="mt-7 max-w-sm text-sm leading-relaxed">{f.tagline}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow !text-accent-400">{f.explore}</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={localePath(lang, item.href)} className="transition-colors hover:text-accent-300">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(lang, "/privacy-and-cookies-policy")} className="transition-colors hover:text-accent-300">
                {f.privacy}
              </Link>
            </li>
          </ul>
        </nav>

        <address className="space-y-4 text-sm not-italic md:col-span-4">
          <h2 className="eyebrow !text-accent-400">{f.getInTouch}</h2>
          <a href={SITE.phoneHref} className="mt-6 flex items-center gap-3 transition-colors hover:text-accent-300">
            <Phone className="shrink-0 text-accent-400" /> {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 transition-colors hover:text-accent-300">
            <Mail className="shrink-0 text-accent-400" /> {SITE.email}
          </a>
          <p className="flex items-start gap-3">
            <Pin className="mt-0.5 shrink-0 text-accent-400" />
            <span>
              {SITE.address.street}
              <br />
              {SITE.address.city} {SITE.address.region} {SITE.address.postcode}, {f.country}
            </span>
          </p>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            &copy; 2026 {SITE.legalName}. {f.rights}
          </p>
          <p>Sydney &middot; Jakarta</p>
        </div>
      </div>
    </footer>
  );
}
