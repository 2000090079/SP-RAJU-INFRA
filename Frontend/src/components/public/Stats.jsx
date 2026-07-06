import { useEffect, useRef, useState } from "react"
import { useInView, animate, useReducedMotion } from "framer-motion"
import Reveal from "./Reveal"

/* Figures preserved exactly from the previous site */
const STATS = [
  { value: 25, suffix: "+", text: "Residential & Commercial Projects Delivered" },
  { value: 20, suffix: "+", text: "Years of Industry Experience" },
  { value: 150000, suffix: "+", text: "Square Feet Completed" },
  { value: 20000, suffix: "+", text: "Square Feet Under Development" },
  { value: 200, suffix: "K+", text: "Square Feet Planned" },
]

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="font-display text-4xl text-brass-light sm:text-5xl">
      {(reduce ? value : display).toLocaleString("en-IN")}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section aria-label="Company statistics" className="bg-ink py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            Our impact
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.text} delay={i * 0.08}>
              <div className="border-l border-white/10 pl-4">
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-2 text-sm leading-snug text-mist">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
