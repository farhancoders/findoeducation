import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Rich } from "@/components/ui/rich";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const h = dict.hero;
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image
        src="/images/banner.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[78%_center] opacity-95 mix-blend-luminosity"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/70 to-brand-900/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-transparent to-brand-950/40" />
      <div className="absolute inset-0 -z-10 bg-brand-800/40 mix-blend-multiply" />

      <div className="container-x pb-28 pt-24 sm:pt-32 lg:pb-36 lg:pt-40">
        <p className="eyebrow !text-accent-400">{h.eyebrow}</p>
        <h1 className="display mt-7 max-w-4xl text-[2.6rem] sm:text-6xl lg:text-[4.75rem]">
          <Rich text={h.title} em="gold-text pr-1 italic" />
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">{h.body}</p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Link href={`${localePath(lang, "/contact-us")}#enquiry`} className="btn btn-accent">
            {h.ctaPrimary} <ArrowRight width={18} height={18} />
          </Link>
          <Link href={localePath(lang, "/our-services")} className="btn btn-ghost">
            {h.ctaSecondary}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 bg-brand-950/60 backdrop-blur-sm">
        <dl className="container-x grid grid-cols-2 gap-y-8 py-9 lg:grid-cols-4">
          {h.stats.map((s) => (
            <div key={s.label} className="lg:border-l lg:border-white/10 lg:pl-8 lg:first:border-0 lg:first:pl-0">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display gold-text block text-5xl">{s.value}</span>
                <span className="mt-1 block max-w-[14rem] text-sm text-white/60">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
