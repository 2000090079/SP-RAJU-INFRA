import { useRef, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver"
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer"

const VIDEO_ID = "KlqlMpw1BHo"
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`

function IconVolume2() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function IconVolumeX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
      aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export default function BrandVideoSection() {
  const reduce = useReducedMotion()
  const playerDivRef = useRef(null)

  /* ── Observer 1: lazy-load — trigger API+player load 300px before view */
  const [sectionRef, shouldLoad] = useIntersectionObserver({
    rootMargin: "300px",
    threshold: 0,
  })

  /* ── Observer 2: play/pause at 50% visibility */
  const [playRef, isVisible] = useIntersectionObserver({ threshold: 0.5 })

  const { ready, muted, autoplayFailed, play, pause, toggleMute, forcePlay } =
    useYouTubePlayer(playerDivRef, VIDEO_ID, shouldLoad)

  useEffect(() => {
    if (!ready) return
    if (isVisible) play()
    else pause()
  }, [ready, isVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
        playRef.current = node
      }}
      aria-label="SP Raju Infra brand story video"
      className="bg-navy py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ── Section header — mirrors every other section ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 sm:mb-16"
        >
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            Our Story
          </p>
          <h2 className="max-w-2xl text-3xl text-white sm:text-4xl lg:text-5xl">
            Discover SP Raju&nbsp;Infra
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
            Two decades of craftsmanship, community and enduring homes — see
            what makes every SP Raju Infra project different.
          </p>
        </motion.div>

        {/* ── Video with gold offset-border frame — same treatment as About photo ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer wrapper: relative + no overflow-clip so the gold frame peeks out */}
          <div className="relative mx-auto max-w-5xl">

            {/* Gold offset border — same -bottom-4 -right-4 pattern as About */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden h-full w-full border border-brass sm:block"
            />

            {/* Video container — overflow hidden for 16:9 */}
            <div
              className="relative z-10 w-full overflow-hidden rounded-sm shadow-2xl shadow-ink/60"
              style={{ aspectRatio: "16 / 9" }}
            >
              {/* Thumbnail placeholder */}
              {!ready && (
                <img
                  src={THUMBNAIL}
                  alt="SP Raju Infra brand story"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Stable React-owned wrapper — YouTube replaces inner div with iframe */}
              <div className="absolute inset-0 h-full w-full">
                <div ref={playerDivRef} className="h-full w-full" />
              </div>

              {/* Loading spinner over thumbnail */}
              {shouldLoad && !ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-brass border-t-transparent" />
                </div>
              )}

              {/* Mobile autoplay fallback */}
              {ready && autoplayFailed && (
                <button
                  onClick={forcePlay}
                  aria-label="Play video"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/60 transition-colors hover:bg-ink/70"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-brass bg-navy text-brass shadow-lg transition-transform hover:scale-105">
                    <IconPlay />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    Tap to play
                  </span>
                </button>
              )}

              {/* Mute/unmute — circular, navy bg, gold icon, subtle brass border */}
              {ready && (
                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className="absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-brass/50 bg-navy text-brass backdrop-blur-sm transition-colors hover:border-brass hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  {muted ? <IconVolumeX /> : <IconVolume2 />}
                </button>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
