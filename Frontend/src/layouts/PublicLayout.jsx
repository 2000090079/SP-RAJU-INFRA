import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import Navbar from "../components/public/Navbar"
import Footer from "../components/public/Footer"
import "../styles/public.css"

/* Because this layout is lazy-loaded, public.css is only ever
   downloaded on public routes — the admin bundle stays isolated. */

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Allow the section to mount before scrolling to it
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function PublicLayout() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  return (
    <div className="public-site">
      <ScrollManager />
      <Navbar />
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
