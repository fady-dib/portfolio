import { HeroAmbient } from '@/components/hero-ambient'
import { HeroStage } from '@/components/hero-stage'
import { SITE } from '@/lib/content'

export function Hero() {
  return (
    <section id="home">
      <HeroStage>
        <HeroAmbient />

        <div className="relative mx-auto max-w-7xl px-5 py-32 md:py-44">
          <h1
            className="max-w-4xl animate-rise text-5xl font-black tracking-tight text-balance md:text-display"
            style={{ animationDelay: '80ms' }}
          >
            {SITE.role} building <span className="text-sweep">fast, durable web products.</span>
          </h1>

          <p
            className="mt-8 max-w-xl animate-rise text-lg text-pretty text-muted"
            style={{ animationDelay: '240ms' }}
          >
            {SITE.tagline}
          </p>

          {/* Visible location carries more weight than the schema does, and
              this is the highest-priority place on the page for it. */}
          <p
            className="mt-5 flex animate-rise items-center gap-2 text-sm text-muted"
            style={{ animationDelay: '300ms' }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Based in {SITE.city}, {SITE.country} &mdash; working with clients worldwide
          </p>

          <div
            className="mt-10 flex animate-rise flex-wrap gap-3"
            style={{ animationDelay: '380ms' }}
          >
            <a
              href="#projects"
              className="group relative overflow-hidden rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40"
            >
              {/* Sheen that crosses the button once per hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative flex items-center gap-2">
                View work
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &#8594;
                </span>
              </span>
            </a>

            <a
              href="#contact"
              className="rounded-full border border-border bg-surface/50 px-7 py-3.5 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>
        </div>
      </HeroStage>
    </section>
  )
}
