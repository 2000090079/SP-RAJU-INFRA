import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Reveal from "./Reveal"

/* Content preserved exactly from the previous site */
const SPECS = [
  { title: "STRUCTURE", content: "R.C.C. Framed Structure." },
  { title: "WALLS", content: "External 9 inch thick wall and internal 4½ inch thick wall using 1st class table moulded red bricks in C.M." },
  { title: "PLASTERING", content: "Smooth plastering for external walls and smooth finish plastering for internal walls with lappam finish." },
  { title: "PAINTING", content: "Internal walls with two coat wall care work and interior emulsion paint. Exterior walls with exterior emulsion paint." },
  { title: "FLOORING", content: "All rooms flooring with vitrified tiles 800x800 mm size of RAK / Aparna / CERA or equivalent brands." },
  { title: "DOORS", content: "Main Door: Teak wood frame and shutter with melamine polishing and designer hardware." },
  { title: "WINDOWS", content: "UPVC sliding windows fitted with float glass and mosquito mesh." },
  { title: "CEILING", content: "Plain designed POP ceilings for all rooms except kitchen and toilets." },
  { title: "ELECTRICAL", content: "Concealed copper wiring with modular switches and A/C points for bedrooms." },
  { title: "KITCHEN", content: "Granite kitchen platform and steel sink with ceramic tiled dado above platform." },
  { title: "SANITARY", content: "Branded sanitary fittings with hot and cold water provision." },
  { title: "PLUMBING", content: "CPVC, UPVC & PVC pipes quality fittings Astral / Ashirwad / Finolex." },
  { title: "LIFT", content: "6 Passenger lift of Johnson or KONE standard make will be provided." },
  { title: "GENERATOR", content: "15 kVA generator of Ashok Leyland, Eicher, Greaves, Kirloskar." },
  { title: "PARKING", content: "Every flat will be provided with one car parking." },
  { title: "CCTV CAMERAS", content: "Security purpose CCTV cameras will be installed." },
]

function SpecItem({ spec, index, open, onToggle }) {
  const reduce = useReducedMotion()
  const panelId = `spec-panel-${index}`
  const buttonId = `spec-button-${index}`
  return (
    <div className="border-b border-white/10">
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 hover:text-brass-light"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
          {spec.title}
        </span>
        <motion.svg
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-brass"
        >
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-mist">
              {spec.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Specifications() {
  const [openItems, setOpenItems] = useState([0])
  const toggle = (i) =>
    setOpenItems((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )

  const half = Math.ceil(SPECS.length / 2)
  const groups = [SPECS.slice(0, half), SPECS.slice(half)]

  return (
    <section id="specifications" className="bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            What goes into every build
          </p>
          <h2 className="max-w-2xl text-3xl text-white sm:text-4xl lg:text-5xl">
            Construction details
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-x-16 lg:grid-cols-2">
          {groups.map((group, g) => (
            <div key={g}>
              {group.map((spec, i) => {
                const index = g * half + i
                return (
                  <SpecItem
                    key={spec.title}
                    spec={spec}
                    index={index}
                    open={openItems.includes(index)}
                    onToggle={() => toggle(index)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
