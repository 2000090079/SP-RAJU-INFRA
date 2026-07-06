import { useState } from "react"
import { sendEnquiry } from "../../lib/api"
import Reveal from "./Reveal"

/* All contact details, map embed and WhatsApp link preserved
   exactly from the previous site. */
const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.335839088364!2d81.8083386!3d17.007189099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a3c3ea7a174f%3A0x4deae3aa92df5bdf!2sSP%20RAJU%20INFRA%20Head%20office!5e0!3m2!1sen!2sin!4v1773479573238!5m2!1sen!2sin"

const WHATSAPP_HREF =
  "https://wa.me/917337245453?text=Hello%20SP%20Raju%20Infra%2C%20I%20would%20like%20to%20enquire%20about%20your%20projects."

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  if (!values.email.trim()) errors.email = "Enter your email address."
  else if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address."
  if (!values.message.trim()) errors.message = "Enter a message."
  else if (values.message.trim().length < 10)
    errors.message = "Message should be at least 10 characters."
  return errors
}

const inputClass = (invalid) =>
  `w-full rounded-sm border bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-body/50 transition-colors duration-300 focus:border-brass focus:outline-none ${
    invalid ? "border-red-500" : "border-navy/15"
  }`

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("idle") // idle | sending | success | error

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    if (errors[e.target.name])
      setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) return

    setStatus("sending")
    try {
      await sendEnquiry(values) // POST /send-enquiry — unchanged endpoint
      setStatus("success")
      setValues({ name: "", email: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-px w-10 bg-brass" />
            Get in touch
          </p>
          <h2 className="text-3xl text-navy sm:text-4xl lg:text-5xl">
            Plan your next address
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Info + map */}
          <div className="space-y-8">
            <Reveal>
              <address className="space-y-4 not-italic">
                {[
                  { label: "Phone", value: "+91 8008780207", href: "tel:+918008780207" },
                  { label: "Alternate", value: "+91 9989245453", href: "tel:+919989245453" },
                  { label: "Email", value: "sprajuinfra.co@gmail.com", href: "mailto:sprajuinfra.co@gmail.com" },
                  { label: "Address", value: "Rajahmundry, Andhra Pradesh" },
                ].map((row) => (
                  <p key={row.label} className="flex flex-wrap items-baseline gap-x-3">
                    <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-brass">
                      {row.label}
                    </span>
                    {row.href ? (
                      <a
                        href={row.href}
                        className="font-medium text-navy transition-colors hover:text-brass"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="font-medium text-navy">{row.value}</span>
                    )}
                  </p>
                ))}
              </address>

              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.6.4.1.2.1.7-.1 1.3Z" />
                </svg>
                Chat on WhatsApp
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <iframe
                src={MAP_SRC}
                title="SP Raju Infra Head Office location on Google Maps"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full rounded-sm border-0 shadow-md shadow-navy/10"
              />
            </Reveal>
          </div>

          {/* Enquiry form */}
          <Reveal delay={0.15}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-sm bg-white p-6 shadow-lg shadow-navy/10 sm:p-8"
            >
              <h3 className="font-body text-lg font-semibold text-navy">
                Send an enquiry
              </h3>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="enq-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-body">
                    Name
                  </label>
                  <input
                    id="enq-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={onChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "enq-name-error" : undefined}
                    className={inputClass(errors.name)}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="enq-name-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="enq-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-body">
                    Email
                  </label>
                  <input
                    id="enq-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={onChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "enq-email-error" : undefined}
                    className={inputClass(errors.email)}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p id="enq-email-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="enq-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-body">
                    Message
                  </label>
                  <textarea
                    id="enq-message"
                    name="message"
                    rows="5"
                    value={values.message}
                    onChange={onChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "enq-message-error" : undefined}
                    className={inputClass(errors.message)}
                    placeholder="Tell us which project you're interested in"
                  />
                  {errors.message && (
                    <p id="enq-message-error" role="alert" className="mt-1.5 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 w-full rounded-sm bg-brass px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-ink transition-colors duration-300 hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </button>

              <div aria-live="polite">
                {status === "success" && (
                  <p className="mt-4 rounded-sm bg-green-50 px-4 py-3 text-sm text-green-800">
                    Enquiry sent. We'll get back to you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-800">
                    The enquiry couldn't be sent. Please try again, or reach us
                    directly at +91 8008780207.
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
