import { useRef, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver"
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer"

const VIDEO_ID = "KlqlMpw1BHo"
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`

/* Inline SVG: speaker with waves (unmuted) */
function IconVolume2() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

/* Inline SVG: speaker muted (X) */
function IconVolumeX() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

/* Inline SVG: play triangle */
function IconPlay() {
  return (
    <svg
      width="28" height="28" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export default function BrandVideoSection() {
  const reduce = useReducedMotion()
  const playerDivRef = useRef(null)

  /* ── Observer 1: lazy-load — start loading API+player 300 px before view */
  const [sectionRef, shouldLoad] = useIntersectionObserver({
    rootMargin: "300px",
    threshold: 0,
  })

  /* ── Observer 2: play/pause — fire at 50 % visibility */
  const [playRef, isVisible] = useIntersectionObserver({ threshold: 0.5 })

  /* ── YouTube player — initialises once shouldLoad becomes true */
  const { ready, muted, autoplayFailed, play, pause, toggleMute, forcePlay } =
    useYouTubePlayer(playerDivRef, VIDEO_ID, shouldLoad)

  /* ── Drive play / pause from viewport visibility ───────────────────── */
  useEffect(() => {
    if (!ready) return
    if (isVisible) {
      play()
    } else {
      pause()
    }
  }, [ready, isVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
        playRef.current = node
      }}
      aria-label="SP Raju Infra brand story video"
      className="relative bg-navy py-16 sm:py-24 overflow-hidden"
    >
      {/* Subtle brass accent line at top */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-brass/20"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">

        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-14 text-center"
        >
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            Our Story
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
          </p>
          <h2 className="text-3xl text-white sm:text-4xl lg:text-5xl">
            Discover SP Raju&nbsp;Infra
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-sm leading-relaxed text-mist sm:text-base">
            Two decades of craftsmanship, community and enduring homes — see
            what makes every SP Raju Infra project different.
          </p>
        </motion.div>

        {/* ── Video container ──────────────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 16:9 aspect-ratio wrapper */}
          <div
            className="relative w-full overflow-hidden rounded-sm shadow-2xl shadow-ink/60"
            style={{ aspectRatio: "16 / 9" }}
          >
            {/* Thumbnail placeholder — shown until player is ready */}
            {!ready && (
              <img
                src={THUMBNAIL}
                alt="SP Raju Infra brand story video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* Stable outer div owned by React — YouTube replaces the
                inner div with an <iframe>; React never touches it directly */}
            <div className="absolute inset-0 w-full h-full">
              <div ref={playerDivRef} className="w-full h-full" />
            </div>

            {/* Loading shimmer over thumbnail while player initialises */}
            {shouldLoad && !ready && (
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-2 border-brass border-t-transparent animate-spin" />
              </div>
            )}

            {/* Mobile autoplay-failed overlay — centered play button */}
            {ready && autoplayFailed && (
              <button
                onClick={forcePlay}
                aria-label="Play video"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/50 text-white transition-colors hover:bg-ink/60"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brass/90 text-ink shadow-lg transition-transform hover:scale-105">
                  <IconPlay />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  Tap to play
                </span>
              </button>
            )}

            {/* Mute / unmute — bottom-right, always visible when player ready */}
            {ready && (
              <button
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white backdrop-blur-sm transition-colors hover:bg-brass hover:text-ink focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                {muted ? <IconVolumeX /> : <IconVolume2 />}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Subtle brass accent line at bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-px bg-brass/20"
        aria-hidden="true"
      />
    </section>
  )
}
