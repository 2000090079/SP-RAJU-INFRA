import { useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { optimizedImage } from "../../lib/api"

/* Full-screen lightbox gallery.
   Keyboard: ← → navigate, Escape closes. Backdrop click closes.
   Body scroll locks while open. */
export default function Lightbox({ images, index, onClose, onNavigate, title }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const open = index !== null

  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  )
  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, next, prev, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-brass hover:text-brass-light"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
            className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-brass hover:text-brass-light sm:left-6"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={optimizedImage(images[index], 1400)}
              alt={`${title} — photo ${index + 1} of ${images.length}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85svh] max-w-full rounded-sm object-contain shadow-2xl"
            />
          </AnimatePresence>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
            className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-brass hover:text-brass-light sm:right-6"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p aria-live="polite" className="absolute bottom-5 font-display text-sm tracking-widest text-white/80">
            <span className="text-brass-light">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1 text-white/40">/</span>
            {String(images.length).padStart(2, "0")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
