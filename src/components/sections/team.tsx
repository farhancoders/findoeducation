import Image from "next/image";
import { TEAM, type TeamMember } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { Mail, Phone } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function Portrait({ member, label, priority }: { member: TeamMember; label: string; priority?: boolean }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={label}
        width={640}
        height={800}
        priority={priority}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="size-full object-cover object-[50%_70%] transition duration-700 group-hover:scale-105"
      />
    );
  }
  return (
    <div role="img" aria-label={label} className="grid size-full place-items-center bg-gradient-to-br from-brand-800 to-brand-950">
      <span className="display gold-text text-8xl">{initials(member.name)}</span>
    </div>
  );
}

export function Team({ dict }: { dict: Dictionary }) {
  const t = dict.team;
  return (
    <section className="bg-ivory py-24 lg:py-32" aria-labelledby="team-heading">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="team-heading" className="display mt-5 text-5xl text-brand-900 sm:text-6xl">
            <Rich text={t.title} />
          </h2>
        </Reveal>

        <div className="mt-16 space-y-24">
          {TEAM.map((m, i) => {
            const info = t.members[m.slug];
            return (
              <Reveal key={m.slug}>
                <article
                  className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
                >
                  <div className="group relative aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] bg-brand-900 lg:col-span-5">
                    <Portrait member={m} label={`${m.name}, ${info.role}`} priority={i === 0} />
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-accent-500/30" />
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-accent-600">{info.role}</p>
                    <h3 className="display mt-3 text-4xl text-brand-900 sm:text-5xl">{m.name}</h3>
                    <p className="mt-6 max-w-2xl leading-relaxed text-mist">{info.bio}</p>
                    <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-brand-800">
                      {m.phone && (
                        <li>
                          <a href={m.phoneHref} className="inline-flex items-center gap-2 hover:text-accent-600">
                            <Phone width={17} height={17} className="text-accent-600" /> {m.phone}
                          </a>
                        </li>
                      )}
                      {m.email && (
                        <li>
                          <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 hover:text-accent-600">
                            <Mail width={17} height={17} className="text-accent-600" /> {m.email}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
