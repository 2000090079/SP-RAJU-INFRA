import { useEffect, useState } from "react"
import { fetchProjects } from "../lib/api"

/* Loads projects from the existing GET /projects endpoint,
   sorted newest-first by startYear (same order as before). */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((data) => {
        if (!alive) return
        setProjects(
          [...data].sort((a, b) => Number(b.startYear) - Number(a.startYear))
        )
      })
      .catch((err) => alive && setError(err))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return { projects, loading, error }
}
