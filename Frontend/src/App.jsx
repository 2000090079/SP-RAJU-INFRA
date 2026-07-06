import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

/* Every route is lazy-loaded (code splitting):
   - Public visitors never download admin code
   - Admin visitors never download the public site's JS or CSS
   Admin route paths are unchanged. */
const PublicLayout = lazy(() => import("./layouts/PublicLayout"))
const Home = lazy(() => import("./pages/Home"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const Admin = lazy(() => import("./pages/Admin"))
const AdminLogin = lazy(() => import("./pages/AdminLogin"))

/* Neutral splash — inline styles only, since neither the public
   nor admin stylesheet is guaranteed to be loaded yet. */
function Splash() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "#0a1420",
      }}
      aria-label="Loading"
      role="status"
    >
      <img
        src="/images/sprajulogo.png"
        alt="SP Raju Infra"
        width="64"
        height="64"
        style={{ borderRadius: "50%", opacity: 0.9 }}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Splash />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>

          {/* Admin — paths and pages unchanged */}
          <Route path="/sprajuco-login" element={<AdminLogin />} />
          <Route path="/sprajuco-dashboard" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
