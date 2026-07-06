/* JSON-LD structured data builders (schema.org) */

export const SITE_URL = "https://sprajuinfra.com" // update if the public domain differs

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "SP Raju Infra",
    url: SITE_URL,
    logo: `${SITE_URL}/images/sprajulogo.png`,
    telephone: "+91 8008780207",
    email: "sprajuinfra.co@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rajahmundry",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    areaServed: "Rajahmundry, Andhra Pradesh",
  }
}

export function residenceJsonLd(project) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.title,
    description: project.description,
    image: project.images?.[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location || "Rajahmundry",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    ...(project.sft ? { floorSize: { "@type": "QuantitativeValue", value: project.sft, unitText: "SFT" } } : {}),
  }
}
