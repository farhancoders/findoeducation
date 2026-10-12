const FALLBACK_URL = "https://findoeducation.com.au";

/** Resolves the public origin; tolerates empty/invalid env values and falls back to the Vercel URL, then the live domain. */
function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ];
  for (const c of candidates) {
    const value = c?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//.test(value) ? value : `https://${value}`).origin;
    } catch {
      /* try the next candidate */
    }
  }
  return FALLBACK_URL;
}

/** Language-neutral site facts. All translatable copy lives in src/dictionaries/*.json */
export const SITE = {
  name: "Faith Education",
  legalName: "Faith Indo Aust Education Services Pty Ltd",
  url: resolveSiteUrl(),
  email: "findoeducation@gmail.com",
  phone: "+61 422 049 489",
  phoneHref: "tel:+61422049489",
  address: {
    street: "Level 33, 264 George St",
    city: "Sydney",
    region: "NSW",
    postcode: "2000",
    country: "AU",
  },
  /** International format without "+", for wa.me links */
  whatsapp: "61422049489",
  mapsQuery: "Level 33, 264 George St, Sydney NSW 2000, Australia",
} as const;

export const NAV = [
  { href: "/", key: "home" },
  { href: "/our-services", key: "services" },
  { href: "/who-are-we", key: "about" },
  { href: "/contact-us", key: "contact" },
] as const;

export type TeamSlug =
  | "donar-firman-rochmilijar"
  | "liny-suryati"
  | "ares-pasaribu"
  | "eddy-widjaja"
  | "ravi-s";

export type TeamMember = {
  slug: TeamSlug;
  name: string;
  /** English job title, used for structured data. Localised titles come from the dictionary. */
  role: string;
  photo?: string;
  email?: string;
  phone?: string;
  phoneHref?: string;
};

export const TEAM: TeamMember[] = [
  {
    slug: "donar-firman-rochmilijar",
    name: "Donar Firman Rochmilijar",
    role: "CEO & Founder",
    photo: "/images/donar.jpg",
    email: "findoeducation@gmail.com",
    phone: "+61 422 049 489",
    phoneHref: "tel:+61422049489",
  },
  {
    slug: "liny-suryati",
    name: "Liny Suryati",
    role: "General Manager & Qualified Education Agent Counsellor",
    photo: "/images/liny.jpg",
    email: "liny.popo@gmail.com",
    phone: "+62 813 1989 5300",
    phoneHref: "tel:+6281319895300",
  },
  {
    slug: "ares-pasaribu",
    name: "Ares Pasaribu",
    role: "Marketing Manager",
    photo: "/images/ares.jpg",
    phone: "+61 430 124 740",
    phoneHref: "tel:+61430124740",
  },
  {
    slug: "eddy-widjaja",
    name: "Eddy Widjaja",
    role: "Marketing Manager",
    photo: "/images/eddy.jpg",
    email: "findoeducation@gmail.com",
    phone: "+61 422 049 489",
    phoneHref: "tel:+61422049489",
  },
  {
    slug: "ravi-s",
    name: "Ravi S",
    role: "Registered Migration Consultant",
    email: "findoeducation@gmail.com",
    phone: "+61 451 062 824",
    phoneHref: "tel:+61451062824",
  },
];

export const OFFICES = [
  {
    city: "Sydney",
    person: "Donar Firman R",
    phone: "+61 422 049 489",
    phoneHref: "tel:+61422049489",
    email: "donarfirman@yahoo.com.au",
  },
  {
    city: "Jakarta",
    person: "Liny Suryati",
    phone: "+62 813 1989 5300",
    phoneHref: "tel:+6281319895300",
    email: "liny.popo@gmail.com",
  },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString();
}
