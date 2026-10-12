import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Team } from "@/components/sections/team";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/ui/json-ld";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates, localePath } from "@/lib/i18n";
import { breadcrumbJsonLd, peopleJsonLd } from "@/lib/structured-data";

const PATH = "/who-are-we";

export async function generateMetadata({ params }: PageProps<"/[lang]/who-are-we">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
    alternates: { canonical: localePath(lang, PATH), languages: languageAlternates(PATH) },
    openGraph: { url: localePath(lang, PATH), title: dict.meta.aboutTitle, description: dict.meta.aboutDescription },
  };
}

export default async function WhoAreWePage({ params }: PageProps<"/[lang]/who-are-we">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.team;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: dict.nav.home, path: localePath(lang) },
            { name: dict.meta.aboutTitle, path: localePath(lang, PATH) },
          ]),
          ...peopleJsonLd(),
        ]}
      />
      <PageHero lang={lang} dict={dict} crumb={t.pageCrumb} eyebrow={t.pageEyebrow} title={t.pageTitle} intro={t.pageIntro} />
      <Team dict={dict} />
      <CtaBand lang={lang} dict={dict} />
    </>
  );
}
