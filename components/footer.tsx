import { SITE } from '@/lib/content'

const socialClass =
  'rounded-full border border-border p-2.5 text-muted transition-colors hover:border-accent hover:text-accent'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-sm font-bold tracking-[0.18em] uppercase">{SITE.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Building scalable, high-performing, user-centric web solutions.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Connect</p>
          {/* Inline SVG rather than remote icons: the old footer pulled its
              GitHub glyph from icons8's CDN on every page load. */}
          <div className="flex gap-3">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialClass}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05A4.16 4.16 0 0 1 17.6 8.7c4 0 4.74 2.5 4.74 5.78V21h-4v-5.7c0-1.36-.03-3.11-1.94-3.11-1.94 0-2.24 1.48-2.24 3.01V21h-4V9Z" />
              </svg>
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={socialClass}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6.01 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-7xl border-t border-border px-5 pt-8 text-center text-xs text-muted">
        &copy; {year} {SITE.name}
      </p>
    </footer>
  )
}
