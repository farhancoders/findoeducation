import Link from "next/link";
import { Rich } from "@/components/ui/rich";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n";

// Rendered for unknown URLs inside a locale (the proxy redirects un-prefixed URLs to a locale first).
export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LOCALE);
  const n = dict.notFound;
  return (
    <section className="grid min-h-[60vh] place-items-center bg-brand-950 px-6 py-24 text-center text-white">
      <div>
        <p className="eyebrow justify-center !text-accent-400">{n.eyebrow}</p>
        <h1 className="display mt-5 text-6xl sm:text-8xl">
          <Rich text={n.title} em="gold-text not-italic" />
        </h1>
        <p className="mx-auto mt-6 max-w-md text-white/65">{n.body}</p>
        <Link href={localePath(DEFAULT_LOCALE)} className="btn btn-accent mt-10">
          {n.back}
        </Link>
      </div>
    </section>
  );
}
