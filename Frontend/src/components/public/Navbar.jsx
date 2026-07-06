import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const LINKS = [
  { label: "About", to: "/#about" },
  { label: "Projects", to: "/#projects" },
  { label: "Specifications", to: "/#specifications" },
  { label: "Contact", to: "/#contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  /* Always solid on inner pages; transparent over the hero on home */
  const solid = scrolled || pathname !== "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Close drawer on Escape */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => (document.body.style.overflow = "")
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid
          ? "bg-ink/85 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <Link to="/" aria-label="SP Raju Infra — home" className="flex items-center gap-3">
          <img
            src="/images/sprajulogo.png"
            alt=""
            width="44"
            height="44"
            className="h-11 w-11 rounded-full object-cover"
          />
          <span className="font-display text-lg tracking-wide text-white">
            SP Raju <span className="text-brass-light">Infra</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium tracking-wide text-white/85 transition-colors duration-300 hover:text-brass-light"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            className="rounded-sm border border-brass px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-brass-light transition-colors duration-300 hover:bg-brass hover:text-ink"
          >
            Enquire
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="grid h-11 w-11 place-items-center text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-ink/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-4 font-display text-xl text-white transition-colors hover:text-brass-light"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
