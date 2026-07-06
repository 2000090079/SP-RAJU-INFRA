import Reveal from "./Reveal"
import { Link } from "react-router-dom"

const PILLARS = [
  {
    title: "Built to specification",
    text: "RCC framed structures, branded materials and finishes documented openly — see the full construction details below.",
  },
  {
    title: "On-time possession",
    text: "Two decades of planned delivery across apartments, villas and open plots in Rajahmundry.",
  },
  {
    title: "Transparent dealings",
    text: "Clear titles, clear pricing and direct access to the people who build your home.",
  },
]

export default function About() {
  return (
    <section id="about" className="bg-sand py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <Reveal>
          <div className="relative">
            <img
              src="/images/sp raju grand.jpg"
              alt="SP Raju Grand residential project, Rajahmundry"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-sm object-cover shadow-2xl shadow-navy/20"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-0 hidden h-full w-full border border-brass sm:block"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
              <span aria-hidden="true" className="h-px w-10 bg-brass" />
              About SP Raju Infra
            </p>
            <h2 className="text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
              Twenty years of building Rajahmundry, one address at a time.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-slate-body">
              SP Raju Infra designs and constructs premium residential
              projects — apartments, villas and open plots — across
              Rajahmundry, Andhra Pradesh. Every project is engineered
              in-house and delivered with the materials and workmanship
              we publish in our specifications.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.1 + i * 0.08}>
                <div className="border-l-2 border-brass pl-5">
                  <h3 className="font-body text-base font-semibold text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-body">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35}>
            <Link
              to="/#projects"
              className="mt-10 inline-block rounded-sm bg-navy px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:bg-brass hover:text-ink"
            >
              Explore our projects
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
