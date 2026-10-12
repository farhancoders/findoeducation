# Faith Education: website redesign

Redesign of findoeducation.com.au in the original rust-brown brand colours, with 9 languages and an AI concierge. Built with **Next.js 16** (App Router, Turbopack, Cache Components), **React 19**, **TypeScript**, **Tailwind CSS v4** and **Zod**.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/                      routes (kept identical to the old site's URLs for SEO)
    page.tsx                /
    our-services/           /our-services
    who-are-we/             /who-are-we
    contact-us/             /contact-us
    privacy-and-cookies-policy/
    layout.tsx              fonts, global metadata, JSON-LD, header/footer
    sitemap.ts robots.ts manifest.ts not-found.tsx
    icon.png apple-icon.png opengraph-image.png twitter-image.png
  components/
    layout/                 header (client), footer
    sections/               hero, pathways, benefits, team, enquiry-form, ...
    ui/                     icons, reveal (scroll animation), json-ld
  actions/enquiry.ts        server action: validate + send enquiry
  lib/
    site.ts                 ALL site content + contact details (edit here)
    validation.ts           Zod schema for the enquiry form
    structured-data.ts      schema.org JSON-LD builders
public/images/              original photos + recoloured logo variants
scripts/make-brand-assets.py  regenerates logo variants, icons and OG image
```

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for canonical, sitemap, OG |
| `GROQ_API_KEYS` | Comma-separated Groq keys for the chatbot (round-robin + failover). Server-side only |
| `GROQ_MODEL` | Chat model (default `openai/gpt-oss-120b`) |
| `RESEND_API_KEY` | Enables real email delivery of enquiries via Resend (otherwise logged to the server console) |
| `ENQUIRY_TO` / `ENQUIRY_FROM` | Recipient / verified sender |

## Languages & chatbot

- Routes are `/<lang>/...` for `en id ru fr it es zh ja ko`. `src/proxy.ts` redirects `/` and old un-prefixed URLs to the visitor's saved/browser language.
- All copy lives in `src/dictionaries/<lang>.json`. Edit `en.json`, then regenerate the others with `node scripts/translate.mjs [id fr ...]` (uses Groq, review the output).
- The floating language button (bottom-left) switches locale and remembers it in a cookie. hreflang + a multi-language sitemap are generated automatically.
- The chatbot (`src/components/chat`, `src/app/api/chat/route.ts`) streams answers from Groq, grounded in `src/lib/chat-knowledge.ts`, answers in the site language by default (or the language the visitor writes in), is rate-limited per IP and never exposes the API keys to the browser.
- Brand colours are tokens in `src/app/globals.css` (`brand-*`, `accent-*`).

## Before launch (checklist)

- [ ] Replace the placeholder text in `privacy-and-cookies-policy/page.tsx` with the real policy.
- [ ] Confirm Liny Suryati's Jakarta number (old site shows both `...5300` and `...6300`).
- [ ] Add a photo for Ravi S (the old site only had a placeholder silhouette; initials are shown instead).
- [ ] Add registration numbers (MARA / QEAC) to the footer and team bios.
- [ ] Review non-English translations with a native speaker; set `GROQ_API_KEYS` on the host.
- [ ] Set `RESEND_API_KEY`, and serve the domain over valid HTTPS.
- [ ] Add Google Search Console verification and analytics if wanted.

## SEO included

Per-page `<title>`/description/canonical/Open Graph, `sitemap.xml`, `robots.txt`, web manifest, JSON-LD (Organization, WebSite, BreadcrumbList, Person), semantic landmarks, skip link, alt text, optimised `next/image`, `next/font` (no layout shift), static prerendering of every page.
