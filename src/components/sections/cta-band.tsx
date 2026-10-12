import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

export function CtaBand({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.cta;
  return (
    <section className="bg-sand py-24" aria-labelledby="cta-heading">
      <Reveal className="container-x text-center">
        <p className="eyebrow justify-center">{c.eyebrow}</p>
        <h2 id="cta-heading" className="display mx-auto mt-5 max-w-3xl text-5xl text-brand-900 sm:text-6xl">
          <Rich text={c.title} />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-mist">{c.body}</p>
        <Link href={`${localePath(lang, "/contact-us")}#enquiry`} className="btn btn-brand mt-10">
          {c.button} <ArrowRight width={18} height={18} />
        </Link>
      </Reveal>
    </section>
  );
}
