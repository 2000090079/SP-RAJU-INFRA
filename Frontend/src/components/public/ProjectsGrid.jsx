import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useProjects } from "../../hooks/useProjects"
import { optimizedImage } from "../../lib/api"
import Reveal from "./Reveal"

const FILTERS = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
]

const PAGE_SIZE = 6

/* Responsive column count for the JS masonry layout */
function useColumns() {
  const get = () =>
    typeof window === "undefined"
      ? 3
      : window.innerWidth >= 1024
        ? 3
        : window.innerWidth >= 640
          ? 2
          : 1
  const [cols, setCols] = useState(get)
  useEffect(() => {
    const onResize = () => setCols(get())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return cols
}

function ProjectCard({ project, index }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="group block overflow-hidden rounded-sm bg-white shadow-md shadow-navy/5 transition-shadow duration-500 hover:shadow-xl hover:shadow-navy/15"
      >
        <div className="relative overflow-hidden">
          <img
            src={optimizedImage(project.images?.[0], 600)}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span
            className={`absolute left-4 top-4 rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
              project.status === "completed"
                ? "bg-navy text-white"
                : "bg-brass text-ink"
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-xl text-navy transition-colors duration-300 group-hover:text-brass">
            {project.title}
          </h3>

          {project.location && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-body">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-brass">
                <path d="M8 1.5a4.7 4.7 0 0 0-4.7 4.7C3.3 9.7 8 14.5 8 14.5s4.7-4.8 4.7-8.3A4.7 4.7 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="6.2" r="1.6" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              {project.location}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {project.propertyType && (
              <span className="rounded-sm bg-sand px-2.5 py-1 text-xs font-medium text-navy">
                {project.propertyType}
              </span>
            )}
            {project.bhkTypes?.length > 0 && (
              <span className="rounded-sm bg-sand px-2.5 py-1 text-xs font-medium text-navy">
                {project.bhkTypes.join(" · ")}
              </span>
            )}
            {project.sft && (
              <span className="rounded-sm bg-sand px-2.5 py-1 text-xs font-medium text-navy">
                {project.sft} SFT
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard({ h }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-sm bg-white shadow-md">
      <div className="bg-navy/10" style={{ height: h }} />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-navy/10" />
        <div className="h-4 w-1/2 rounded bg-navy/10" />
      </div>
    </div>
  )
}

export default function ProjectsGrid() {
  const { projects, loading, error } = useProjects()
  const [filter, setFilter] = useState("all")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const cols = useColumns()

  const filtered = useMemo(
    () =>
      projects.filter((p) => (filter === "all" ? true : p.status === filter)),
    [projects, filter]
  )
  const shown = filtered.slice(0, visible)

  /* Round-robin distribution into masonry columns */
  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => [])
    shown.forEach((p, i) => out[i % cols].push({ p, i }))
    return out
  }, [shown, cols])

  return (
    <section id="projects" className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            Portfolio
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl text-navy sm:text-4xl lg:text-5xl">
              Our projects
            </h2>

            {/* Filter tabs */}
            <div
              role="tablist"
              aria-label="Filter projects by status"
              className="flex gap-1 rounded-sm border border-navy/15 p-1"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => {
                    setFilter(f.key)
                    setVisible(PAGE_SIZE)
                  }}
                  className={`relative rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    filter === f.key ? "text-white" : "text-navy hover:text-brass"
                  }`}
                >
                  {filter === f.key && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-sm bg-navy"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [260, 340, 300, 320, 280, 360].map((h, i) => (
              <SkeletonCard key={i} h={h} />
            ))}

          {!loading &&
            columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {col.map(({ p, i }) => (
                    <ProjectCard key={p._id} project={p} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            ))}
        </div>

        {/* States */}
        {!loading && error && (
          <p className="mt-12 text-center text-slate-body">
            Projects couldn't be loaded right now. Please refresh the page or
            try again in a moment.
          </p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="mt-12 text-center text-slate-body">
            No {filter === "all" ? "" : filter + " "}projects to show yet.
          </p>
        )}

        {/* Load more */}
        {!loading && visible < filtered.length && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-sm border border-navy px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
            >
              View more projects
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
