import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useProjects } from "../hooks/useProjects"
import { optimizedImage } from "../lib/api"
import { residenceJsonLd, SITE_URL } from "../lib/seo"
import Seo from "../components/public/Seo"
import Lightbox from "../components/public/Lightbox"
import Reveal from "../components/public/Reveal"

function Fact({ label, value }) {
  if (!value) return null
  return (
    <div className="border-l-2 border-brass pl-4">
      <dt className="text-xs font-semibold uppercase tracking-widest text-mist">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-white">{value}</dd>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { projects, loading, error } = useProjects()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const project = projects.find((p) => p._id === id)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="mt-6 h-12 w-2/3 rounded bg-white/10" />
        <div className="mt-10 h-96 rounded bg-white/10" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 text-center sm:px-8">
        <h1 className="text-3xl text-white">Project not found</h1>
        <p className="mt-4 text-mist">
          {error
            ? "Projects couldn't be loaded right now. Please try again in a moment."
            : "This project may have been removed or the link is incorrect."}
        </p>
        <Link
          to="/#projects"
          className="mt-8 inline-block rounded-sm bg-brass px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-brass-light"
        >
          Back to all projects
        </Link>
      </div>
    )
  }

  const started =
    project.startMonth || project.startYear
      ? [project.startMonth, project.startYear].filter(Boolean).join(" ")
      : null
  const possession =
    project.possessionMonth || project.possessionYear
      ? [project.possessionMonth, project.possessionYear].filter(Boolean).join(" ")
      : null

  return (
    <>
      <Seo
        title={`${project.title} — SP Raju Infra`}
        description={project.description?.slice(0, 155) || `${project.title} by SP Raju Infra, Rajahmundry.`}
        url={`${SITE_URL}/projects/${project._id}`}
        image={project.images?.[0]}
        jsonLd={residenceJsonLd(project)}
      />

      <article className="bg-ink pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-brass-light"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All projects
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                  project.status === "completed"
                    ? "bg-white/10 text-white"
                    : "bg-brass text-ink"
                }`}
              >
                {project.status}
              </span>
              {project.propertyType && (
                <span className="rounded-sm bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                  {project.propertyType}
                </span>
              )}
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {project.location && (
              <p className="mt-3 flex items-center gap-2 text-mist">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-brass">
                  <path d="M8 1.5a4.7 4.7 0 0 0-4.7 4.7C3.3 9.7 8 14.5 8 14.5s4.7-4.8 4.7-8.3A4.7 4.7 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="6.2" r="1.6" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                {project.location}
              </p>
            )}
          </Reveal>

          {/* Lead image */}
          {project.images?.[0] && (
            <Reveal delay={0.1}>
              <button
                onClick={() => setLightboxIndex(0)}
                className="group mt-10 block w-full overflow-hidden rounded-sm"
                aria-label={`Open ${project.title} gallery`}
              >
                <img
                  src={optimizedImage(project.images[0], 1400)}
                  alt={project.title}
                  className="max-h-[70svh] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </button>
            </Reveal>
          )}

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
            {/* Description */}
            <Reveal>
              <h2 className="text-2xl text-white">About this project</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-mist">
                {project.description}
              </p>
            </Reveal>

            {/* Facts */}
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 rounded-sm border border-white/10 p-6 sm:p-8">
                <Fact label="Configuration" value={project.bhkTypes?.join(" · ")} />
                <Fact label="Area" value={project.sft && `${project.sft} SFT`} />
                <Fact label="Started" value={started} />
                <Fact label="Possession" value={possession} />
              </dl>
              <Link
                to="/#contact"
                className="mt-6 block rounded-sm bg-brass px-7 py-4 text-center text-sm font-semibold uppercase tracking-widest text-ink transition-colors duration-300 hover:bg-brass-light"
              >
                Enquire about {project.title}
              </Link>
            </Reveal>
          </div>

          {/* Gallery */}
          {project.images?.length > 1 && (
            <div className="mt-16">
              <Reveal>
                <h2 className="text-2xl text-white">Gallery</h2>
              </Reveal>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {project.images.map((img, i) => (
                  <Reveal key={img} delay={Math.min(i * 0.05, 0.3)}>
                    <button
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Open photo ${i + 1} of ${project.images.length}`}
                      className="group block w-full overflow-hidden rounded-sm"
                    >
                      <img
                        src={optimizedImage(img, 600)}
                        alt={`${project.title} — photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Lightbox
        images={project.images || []}
        index={lightboxIndex}
        title={project.title}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
