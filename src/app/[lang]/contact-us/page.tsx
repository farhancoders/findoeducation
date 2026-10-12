import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { JsonLd } from "@/components/ui/json-ld";
import { Mail, Phone, Pin } from "@/components/ui/icons";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates, localePath } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { OFFICES, SITE } from "@/lib/site";

const PATH = "/contact-us";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact-us">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    alternates: { canonical: localePath(lang, PATH), languages: languageAlternates(PATH) },
    openGraph: { url: localePath(lang, PATH), title: dict.meta.contactTitle, description: dict.meta.contactDescription },
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact-us">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = dict.contact;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed&hl=${lang}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: localePath(lang) },
          { name: dict.meta.contactTitle, path: localePath(lang, PATH) },
        ])}
      />
      <PageHero lang={lang} dict={dict} crumb={c.crumb} eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="space-y-6 lg:col-span-5">
            {OFFICES.map((o) => (
              <article key={o.city} className="rounded-3xl bg-brand-900 p-9 text-white">
                <p className="eyebrow !text-accent-400">{c.offices[o.city]}</p>
                <h2 className="display mt-4 text-4xl">{o.person}</h2>
                <ul className="mt-6 space-y-3 text-white/75">
                  <li>
                    <a href={o.phoneHref} className="inline-flex items-center gap-3 hover:text-accent-300">
                      <Phone className="text-accent-400" /> {o.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${o.email}`} className="inline-flex items-center gap-3 break-all hover:text-accent-300">
                      <Mail className="shrink-0 text-accent-400" /> {o.email}
                    </a>
                  </li>
                </ul>
              </article>
            ))}
            <p className="flex items-start gap-3 px-2 text-mist">
              <Pin className="mt-1 shrink-0 text-accent-600" />
              <span>
                {SITE.address.street}, {SITE.address.city} {SITE.address.region} {SITE.address.postcode}, {dict.footer.country}
              </span>
            </p>
          </div>

          <div id="enquiry" className="scroll-mt-28 lg:col-span-7">
            <div className="rounded-[2rem] border border-brand-900/10 bg-white p-8 shadow-[0_40px_80px_-50px_rgba(58,16,9,0.4)] sm:p-12">
              <p className="eyebrow">{c.formEyebrow}</p>
              <h2 id="enquiry-heading" className="display mt-4 text-4xl text-brand-900 sm:text-5xl">
                {c.formTitle}
              </h2>
              <div className="mt-8">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={c.mapAria} className="bg-brand-950">
        <iframe
          title={c.mapTitle}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[420px] w-full border-0 grayscale-[0.6] contrast-[1.05]"
        />
      </section>
    </>
  );
}
