'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/nav'
import { SITE } from '@/lib/content'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    // Lock the page behind the overlay so it does not scroll under it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] flex size-10 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-accent hover:text-accent"
      >
        {/* Two bars that rotate into an X, rather than swapping icons. */}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span aria-hidden="true" className="relative block h-4 w-5">
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
              open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5'
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
              open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0.5'
            }`}
          />
        </span>
      </button>

      {/* Kept mounted rather than conditionally rendered, so the links stay
          in the served markup and the panel can transition out. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] transition-[opacity,visibility] duration-[400ms] ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-bg/85 backdrop-blur-xl"
        />

        <nav
          aria-label="Mobile"
          className="relative flex h-full flex-col justify-center px-8"
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${120 + index * 70}ms` : '0ms' }}
                  className={`group flex items-baseline gap-4 py-3 text-4xl font-black tracking-tight transition-all duration-500 ease-out hover:text-accent ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {/* Decorative, and hidden so the link's accessible name
                      stays exactly the label. */}
                  <span aria-hidden="true" className="text-xs font-medium text-muted tabular-nums">
                    0{index + 1}
                  </span>
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="ml-auto text-2xl text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    &#8594;
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? '420ms' : '0ms' }}
            className={`mt-12 flex flex-col gap-3 border-t border-border pt-8 transition-all duration-500 ease-out ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Connect</p>
            <div className="flex gap-5 text-sm text-muted">
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                LinkedIn
              </a>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                GitHub
              </a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
