import { Link } from "react-router-dom"

const LINKS = [
  { label: "About", to: "/#about" },
  { label: "Projects", to: "/#projects" },
  { label: "Specifications", to: "/#specifications" },
  { label: "Contact", to: "/#contact" },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/sprajulogo.png"
                alt=""
                width="40"
                height="40"
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display text-lg text-white">
                SP Raju <span className="text-brass-light">Infra</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              Premium apartments, villas and open plots in Rajahmundry,
              Andhra Pradesh.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm text-mist transition-colors duration-300 hover:text-brass-light"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-mist">
            <p>
              <a href="tel:+918008780207" className="transition-colors hover:text-brass-light">
                +91 8008780207
              </a>
            </p>
            <p className="mt-1">
              <a href="mailto:sprajuinfra.co@gmail.com" className="transition-colors hover:text-brass-light">
                sprajuinfra.co@gmail.com
              </a>
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-mist">
          © 2026 SP Raju Infra. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
