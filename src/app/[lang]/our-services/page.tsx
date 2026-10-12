import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Pathways } from "@/components/sections/pathways";
import { Benefits } from "@/components/sections/benefits";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates, localePath } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/structured-data";

const PATH = "/our-services";

export async function generateMetadata({ params }: PageProps<"/[lang]/our-services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.servicesTitle,
    description: dict.meta.servicesDescription,
    alternates: { canonical: localePath(lang, PATH), languages: languageAlternates(PATH) },
    openGraph: { url: localePath(lang, PATH), title: dict.meta.servicesTitle, description: dict.meta.servicesDescription },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/our-services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const s = dict.services;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: localePath(lang) },
          { name: dict.meta.servicesTitle, path: localePath(lang, PATH) },
        ])}
      />
      <PageHero lang={lang} dict={dict} crumb={s.pageCrumb} eyebrow={s.pageEyebrow} title={s.pageTitle} intro={s.pageIntro} />

      <section className="bg-ivory py-24 lg:py-28" aria-label={s.overviewAria}>
        <div className="container-x grid gap-8 md:grid-cols-2">
          {s.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className="rounded-3xl border border-brand-900/10 bg-white p-10 lg:p-12">
              <span className="display text-6xl text-accent-500/50">0{i + 1}</span>
              <h2 className="display mt-4 text-5xl text-brand-900">{item.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-mist">{item.long}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Pathways dict={dict} />
      <Benefits dict={dict} heading={dict.benefits.pageTitle} />
      <CtaBand lang={lang} dict={dict} />
    </>
  );
}
