export default function Footer() {
  return (
    <footer className="bg-ink">
      {/* Brass accent line */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-brass to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-xs text-mist">
            © 2026 SP Raju Infra. All Rights Reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-sm bg-navy px-3.5 py-1.5 text-xs text-white/80 shadow-sm">
            Designed & developed by
            <a
              href="https://www.linkedin.com/in/pendurthi-sri-teja-71778b20b/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[13px] tracking-wide text-brass-light transition-colors hover:text-white"
            >
              Pendurthi Sri Teja
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
