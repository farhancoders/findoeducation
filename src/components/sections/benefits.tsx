import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Compass, Eye, Gift, Plane, Refresh, Sim } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n";

const ICONS = [Compass, Eye, Plane, Gift, Sim, Refresh];

export function Benefits({ dict, heading }: { dict: Dictionary; heading?: string }) {
  const b = dict.benefits;
  return (
    <section className="relative overflow-hidden bg-brand-900 py-24 text-white lg:py-32" aria-labelledby="benefits-heading">
      <Image src="/images/grads.png" alt="" fill sizes="100vw" className="object-cover opacity-[0.08]" />
      <div className="container-x relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow !text-accent-400">{b.eyebrow}</p>
          <h2 id="benefits-heading" className="display mt-5 text-5xl sm:text-6xl">
            {heading ?? b.title}
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {b.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 3) * 90}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 transition duration-500 hover:-translate-y-1 hover:border-accent-500/50 hover:bg-white/[0.07]"
              >
                <span className="grid size-12 place-items-center rounded-full border border-accent-500/40 text-accent-400">
                  <Icon />
                </span>
                <h3 className="display mt-6 text-3xl">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">{item.body}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
