/* ============================================================
   API LAYER — endpoints and field names are the EXISTING ones.
   Do not rename anything here without changing the backend
   (which we are not doing).
   ============================================================ */

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://sp-raju-infra.onrender.com"

/**
 * GET /projects — existing endpoint, unchanged.
 * Returns: [{ _id, title, description, status, startMonth, startYear,
 *   possessionMonth, possessionYear, bhkTypes[], propertyType, sft,
 *   location, images[], createdAt, updatedAt }]
 */
export async function fetchProjects() {
  const res = await fetch(`${BASE_URL}/projects`)
  if (!res.ok) throw new Error("Failed to fetch projects")
  return res.json()
}

/**
 * POST /send-enquiry — existing endpoint, unchanged.
 * Body: { name, email, message }
 */
export async function sendEnquiry({ name, email, message }) {
  const res = await fetch(`${BASE_URL}/send-enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || "Failed to send enquiry")
  return data
}

/**
 * Cloudinary on-the-fly resize — same technique the current site
 * uses (`/upload/` → `/upload/w_600,q_auto,f_auto/`), centralized.
 * Non-Cloudinary URLs (e.g. old local uploads) pass through untouched,
 * so every existing uploaded image keeps working.
 */
export function optimizedImage(url, width = 800) {
  if (!url) return "/no-image.png"
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`)
  }
  return url
}
