import Seo from "../components/public/Seo"
import Hero from "../components/public/Hero"
import Stats from "../components/public/Stats"
import About from "../components/public/About"
import ProjectsGrid from "../components/public/ProjectsGrid"
import Specifications from "../components/public/Specifications"
import Contact from "../components/public/Contact"
import { organizationJsonLd, SITE_URL } from "../lib/seo"

export default function Home() {
  return (
    <>
      <Seo
        title="SP Raju Infra — Premium Apartments, Villas & Plots in Rajahmundry"
        description="SP Raju Infra builds premium residential apartments, villas and open plots in Rajahmundry, Andhra Pradesh. 25+ projects delivered over 20+ years."
        url={SITE_URL}
        image={`${SITE_URL}/images/sp raju grand.jpg`}
        jsonLd={organizationJsonLd()}
      />
      <Hero />
      <Stats />
      <About />
      <ProjectsGrid />
      <Specifications />
      <Contact />
    </>
  )
}
