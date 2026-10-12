import Image from "next/image";
import Link from "next/link";
import { Rich } from "@/components/ui/rich";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

type PageHeroProps = {
  lang: Locale;
  dict: Dictionary;
  eyebrow: string;
  /** May contain *emphasis* markers. */
  title: string;
  intro?: string;
  crumb: string;
};

export function PageHero({ lang, dict, eyebrow, title, intro, crumb }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pb-20 pt-16 text-white sm:pb-24 sm:pt-24">
      <Image src="/images/banner.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[78%_center] opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950/50" />
      <div className="container-x">
        <nav aria-label={dict.nav.breadcrumb} className="text-xs uppercase tracking-[0.2em] text-white/50">
          <Link href={localePath(lang)} className="hover:text-accent-300">
            {dict.nav.home}
          </Link>
          <span className="mx-3 text-accent-500">/</span>
          <span className="text-accent-300">{crumb}</span>
        </nav>
        <p className="eyebrow mt-10 !text-accent-400">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl text-4xl sm:text-6xl">
          <Rich text={title} em="gold-text not-italic" />
        </h1>
        {intro && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
      </div>
    </section>
  );
}
