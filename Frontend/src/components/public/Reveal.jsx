import { motion, useReducedMotion } from "framer-motion"

/* Scroll-triggered reveal used across all sections.
   Respects prefers-reduced-motion. */
export default function Reveal({ children, delay = 0, y = 28, className }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
