import { useState, useEffect, useCallback, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"

/* Existing images from Frontend/public/images — unchanged paths */
const SLIDES = [
  { src: "/images/sp raju grand.jpg", label: "SP Raju Grand" },
  { src: "/images/dhanush emperor.jpg", label: "Dhanush Emperor" },
  { src: "/images/sai residency.jpg", label: "Sai Residency" },
  { src: "/images/dhanush enclave.jpg", label: "Dhanush Enclave" },
  { src: "/images/sp raju greens.jpg", label: "SP Raju Greens" },
  { src: "/images/sai apartments.png", label: "Sai Apartments" },
  { src: "/images/dhanush residency.jpg", label: "Dhanush Residency" },
  { src: "/images/sai dhanush.jpg", label: "Sai Dhanush" },
  { src: "/images/sai dhanush Enclave.jpg", label: "Sai Dhanush Enclave" },
  { src: "/images/sai swarla.png", label: "Sai Swarla" },
]

const SLIDE_MS = 5000

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const touchStartX = useRef(0)

  /* ---------- Scroll parallax ---------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  /* ---------- Slide controls ---------- */
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  )
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  )

  /* Autoplay — always running, disabled only for reduced motion */
  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(next, SLIDE_MS)
    return () => clearInterval(id)
  }, [prefersReducedMotion, next])

  /* Preload the next image so crossfades never flash */
  useEffect(() => {
    const img = new Image()
    img.src = SLIDES[(current + 1) % SLIDES.length].src
  }, [current])

  /* Keyboard navigation */
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next()
    if (e.key === "ArrowLeft") prev()
  }

  /* Touch swipe */
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) next()
    if (dx > 50) prev()
  }

  const slide = SLIDES[current]

  return (
    <section
      ref={sectionRef}
      id="home"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured SP Raju Infra projects"
      className="relative h-svh min-h-[560px] overflow-hidden bg-ink"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ---------- Image layer: crossfade + Ken Burns + parallax ---------- */}
      <motion.div style={{ y: prefersReducedMotion ? 0 : imageY }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <motion.img
              src={slide.src}
              alt=""
              className="h-full w-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: "linear" }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Legibility gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
      </motion.div>

      {/* ---------- Content layer ---------- */}
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : contentY,
          opacity: contentOpacity,
        }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 sm:px-8 md:pb-28 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass"
        >
          <span aria-hidden="true" className="h-px w-10 bg-brass" />
          Rajahmundry · Andhra Pradesh
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-4xl leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Homes built to be
          <span className="text-brass-light"> handed down.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
        >
          Premium apartments, villas and open plots across Rajahmundry —
          designed, built and delivered by SP Raju Infra.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-sm bg-brass px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-ink transition-colors duration-300 hover:bg-brass-light"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:border-brass hover:text-brass-light"
          >
            Enquire now
          </a>
        </motion.div>
      </motion.div>

      {/* ---------- Slider chrome: counter, progress, arrows ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 pb-6 sm:px-8 lg:px-12">
          <p className="font-display text-sm tracking-widest text-white/80">
            <span className="text-brass-light">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="mx-1 text-white/40">/</span>
            {String(SLIDES.length).padStart(2, "0")}
          </p>

          {/* Brass progress line — restarts each slide */}
          <div
            className="h-px flex-1 overflow-hidden bg-white/20"
            aria-hidden="true"
          >
            {!prefersReducedMotion && (
              <motion.div
                key={current}
                className="h-full bg-brass"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </div>

          <p className="hidden text-xs uppercase tracking-[0.25em] text-white/60 sm:block">
            {slide.label}
          </p>

          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brass hover:text-brass-light"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brass hover:text-brass-light"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Screen-reader announcement of current slide */}
      <p className="sr-only" aria-live="polite">
        Slide {current + 1} of {SLIDES.length}: {slide.label}
      </p>
    </section>
  )
}
