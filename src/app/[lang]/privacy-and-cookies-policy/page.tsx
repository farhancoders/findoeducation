import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates, localePath } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const PATH = "/privacy-and-cookies-policy";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy-and-cookies-policy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.privacyTitle,
    description: dict.meta.privacyDescription,
    alternates: { canonical: localePath(lang, PATH), languages: languageAlternates(PATH) },
    openGraph: { url: localePath(lang, PATH), title: dict.meta.privacyTitle, description: dict.meta.privacyDescription },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy-and-cookies-policy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.privacy;

  return (
    <>
      <PageHero lang={lang} dict={dict} crumb={p.crumb} eyebrow={p.eyebrow} title={p.title} />
      <section className="bg-ivory py-20">
        <div className="container-x max-w-3xl space-y-8 leading-relaxed text-mist [&_h2]:display [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:text-brand-900">
          <p className="rounded-xl border border-accent-500/40 bg-accent-300/20 p-5 text-sm text-brand-900">{p.notice}</p>
          {p.sections.map((s) => (
            <div key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
          <div>
            <h2>{p.contactTitle}</h2>
            <p>
              {p.contactBody}{" "}
              <a className="font-semibold text-brand-900 underline decoration-accent-500 underline-offset-4" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
