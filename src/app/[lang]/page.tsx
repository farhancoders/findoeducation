import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Pathways } from "@/components/sections/pathways";
import { Benefits } from "@/components/sections/benefits";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { ArrowRight, Shield } from "@/components/ui/icons";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates, localePath } from "@/lib/i18n";
import { TEAM } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: { absolute: dict.meta.homeTitle },
    description: dict.meta.homeDescription,
    alternates: { canonical: `/${lang}`, languages: languageAlternates("/") },
    openGraph: { url: `/${lang}`, title: dict.meta.homeTitle, description: dict.meta.homeDescription },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const leaders = TEAM.slice(0, 2);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Pathways dict={dict} />

      <section className="bg-sand py-24 lg:py-32" aria-labelledby="services-heading">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{dict.services.eyebrow}</p>
            <h2 id="services-heading" className="display mt-5 text-5xl text-brand-900 sm:text-6xl">
              <Rich text={dict.services.title} />
            </h2>
            <Link href={localePath(lang, "/our-services")} className="btn btn-brand mt-10">
              {dict.services.viewAll} <ArrowRight width={18} height={18} />
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {dict.services.items.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="flex flex-col rounded-3xl bg-white p-9 shadow-[0_30px_60px_-40px_rgba(58,16,9,0.35)]">
                <Shield className="text-accent-600" width={30} height={30} />
                <h3 className="display mt-6 text-4xl text-brand-900">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-mist">{s.short}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Benefits dict={dict} />

      <section className="bg-ivory py-24 lg:py-32" aria-labelledby="leaders-heading">
        <div className="container-x">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{dict.team.teaserEyebrow}</p>
              <h2 id="leaders-heading" className="display mt-5 text-5xl text-brand-900 sm:text-6xl">
                <Rich text={dict.team.teaserTitle} />
              </h2>
            </div>
            <Link href={localePath(lang, "/who-are-we")} className="btn btn-brand">
              {dict.team.meetEveryone} <ArrowRight width={18} height={18} />
            </Link>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {leaders.map((m, i) => {
              const info = dict.team.members[m.slug];
              return (
                <Reveal key={m.slug} delay={i * 100}>
                  <Link
                    href={localePath(lang, "/who-are-we")}
                    className="group flex items-center gap-6 rounded-3xl border border-brand-900/10 bg-white p-5 transition duration-500 hover:-translate-y-1 hover:border-accent-500/60"
                  >
                    <Image src={m.photo!} alt={m.name} width={160} height={200} className="h-40 w-32 shrink-0 rounded-2xl object-cover object-[50%_70%]" />
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent-600">{info.role}</p>
                      <h3 className="display mt-2 text-3xl text-brand-900">{m.name}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-mist">{info.bio}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand lang={lang} dict={dict} />
    </>
  );
}
