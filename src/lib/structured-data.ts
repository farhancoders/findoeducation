import { SITE, TEAM, absoluteUrl } from "@/lib/site";
import { localeMeta, type Locale } from "@/lib/i18n";

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "ProfessionalService"],
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    legalName: SITE.legalName,
    description,
    url: SITE.url,
    logo: absoluteUrl("/images/logo.png"),
    image: absoluteUrl("/og.png"),
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postcode,
      addressCountry: SITE.address.country,
    },
    areaServed: ["AU", "ID"],
    knowsLanguage: ["en", "id", "ru", "fr", "it", "es", "zh", "ja", "ko"],
    founder: {
      "@type": "Person",
      name: TEAM[0].name,
      jobTitle: TEAM[0].role,
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Student agent and study planning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Australian visa and migration consultancy" } },
    ],
  };
}

export function websiteJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl(`/${lang}#website`),
    url: absoluteUrl(`/${lang}`),
    name: SITE.name,
    inLanguage: localeMeta(lang).html,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function peopleJsonLd() {
  return TEAM.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role,
    worksFor: { "@id": absoluteUrl("/#organization") },
    ...(p.photo ? { image: absoluteUrl(p.photo) } : {}),
  }));
}
