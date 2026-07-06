import { useEffect } from "react"

/* Per-page SEO. React 19 hoists <meta> tags into <head> natively.
   document.title is set via effect for reliable overriding of the
   static title in index.html. */
export default function Seo({ title, description, image, url, jsonLd }) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="SP Raju Infra" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </>
  )
}
