import type { MetadataRoute } from "next";
import { LOCALES, languageAlternates, localePath } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/our-services", priority: 0.9 },
  { path: "/who-are-we", priority: 0.8 },
  { path: "/contact-us", priority: 0.8 },
  { path: "/privacy-and-cookies-policy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((r) =>
    LOCALES.map((l) => ({
      url: absoluteUrl(localePath(l.code, r.path)),
      changeFrequency: "monthly" as const,
      priority: r.priority,
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(r.path)).map(([k, v]) => [k, absoluteUrl(v)])),
      },
    })),
  );
}
