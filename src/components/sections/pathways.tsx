import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { Check } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n";

export function Pathways({ dict }: { dict: Dictionary }) {
  const p = dict.pathways;
  return (
    <section id="pathways" className="bg-ivory py-24 lg:py-32" aria-labelledby="pathways-heading">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 id="pathways-heading" className="display mt-5 text-5xl text-brand-900 sm:text-6xl">
            <Rich text={p.title} />
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mist">{p.intro}</p>
        </Reveal>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-brand-900/10 bg-brand-900/10 md:grid-cols-2 lg:grid-cols-4">
          {p.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 90}
              className="group relative flex flex-col bg-ivory p-8 transition-colors duration-500 hover:bg-brand-900 lg:p-9"
            >
              <span className="display text-7xl text-accent-500/40 transition-colors duration-500 group-hover:text-accent-400/60">
                0{i + 1}
              </span>
              <span className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-600 group-hover:text-accent-400">
                {item.tag}
              </span>
              <h3 className="display mt-2 text-4xl text-brand-900 transition-colors duration-500 group-hover:text-white">
                {item.title}
              </h3>
              <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-mist transition-colors duration-500 group-hover:text-white/70">
                {item.body}
              </p>
              <ul className="mt-7 space-y-2.5 border-t border-brand-900/10 pt-6 text-sm font-medium text-brand-800 transition-colors duration-500 group-hover:border-white/15 group-hover:text-white/90">
                {item.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5">
                    <Check width={16} height={16} className="shrink-0 text-accent-600 group-hover:text-accent-400" /> {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
