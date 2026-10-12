import type { Metadata, Viewport } from "next";
import {
  Lora,
  Manrope,
  Noto_Serif_JP,
  Noto_Serif_KR,
  Noto_Serif_SC,
} from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { I18nProvider } from "@/components/i18n-provider";
import { JsonLd } from "@/components/ui/json-ld";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, hasLocale, languageAlternates, localeMeta } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { SITE } from "@/lib/site";

/* Headings: Lora, a soft, calligraphic serif with gentle curves. Body: Manrope, a smooth modern sans. */
const display = Lora({
  variable: "--font-display-latin",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-body-latin",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

/* CJK serif for headings. Google serves these in unicode-range slices, so only the glyphs a page uses are downloaded. */
const serifSC = Noto_Serif_SC({ variable: "--font-serif-sc", weight: ["500", "600"], display: "swap", preload: false });
const serifJP = Noto_Serif_JP({ variable: "--font-serif-jp", weight: ["500", "600"], display: "swap", preload: false });
const serifKR = Noto_Serif_KR({ variable: "--font-serif-kr", weight: ["500", "600"], display: "swap", preload: false });

export function generateStaticParams() {
  return LOCALES.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE.url),
    title: { default: dict.meta.siteTitle, template: `%s | ${SITE.name}` },
    description: dict.meta.siteDescription,
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
    alternates: { canonical: `/${lang}`, languages: languageAlternates("/") },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: localeMeta(lang).og,
      alternateLocale: LOCALES.filter((l) => l.code !== lang).map((l) => l.og),
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: `/${lang}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
    robots: { index: true, follow: true },
    formatDetection: { telephone: true, email: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#8b3822",
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={localeMeta(lang).html}
      className={`${display.variable} ${sans.variable} ${serifSC.variable} ${serifJP.variable} ${serifKR.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal animations only when JS is available */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider
          lang={lang}
          t={{ nav: dict.nav, form: dict.form, chat: dict.chat, language: dict.language }}
        >
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-accent-500 px-5 py-3 font-semibold text-brand-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {dict.nav.skip}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer lang={lang} dict={dict} />
          <LanguageSwitcher />
          <ChatWidget />
        </I18nProvider>
        <JsonLd data={[organizationJsonLd(dict.meta.siteDescription), websiteJsonLd(lang)]} />
      </body>
    </html>
  );
}
