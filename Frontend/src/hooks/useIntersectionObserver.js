import { useEffect, useRef, useState } from "react"

/**
 * Thin wrapper around IntersectionObserver.
 * Returns [ref, isIntersecting] — updates every time the element
 * crosses the threshold, not just once.
 *
 * @param {IntersectionObserverInit} options
 */
export function useIntersectionObserver(options = {}) {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.threshold, options.rootMargin])

  return [ref, isIntersecting]
}
