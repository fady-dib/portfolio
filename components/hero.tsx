import { HeroAmbient } from '@/components/hero-ambient'
import { HeroStage } from '@/components/hero-stage'
import { SITE, projects, skills } from '@/lib/content'

// Facts, not decoration. A short spec line does more for an engineering
// portfolio than an ornament would.
const SPEC = [
  { label: 'role', value: SITE.role },
  { label: 'stack', value: `${skills.length} technologies` },
  { label: 'shipped', value: `${projects.length} client projects` },
]

export function Hero() {
  return (
    <section id="home">
      <HeroStage>
        <HeroAmbient />

        <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-36">
          <p
            className="mb-8 animate-rise font-mono text-xs tracking-wide text-muted"
            style={{ animationDelay: '40ms' }}
          >
            <span className="text-accent">~/</span>fady-dib
            <span aria-hidden="true" className="animate-caret ml-1 text-accent">
              _
            </span>
          </p>

          <h1
            className="max-w-3xl animate-rise text-[2.75rem] leading-[1.06] font-semibold tracking-tight text-balance md:text-display"
            style={{ animationDelay: '110ms' }}
          >
            {SITE.role} building fast, durable{' '}
            <span className="text-accent">web products</span>.
          </h1>

          <p
            className="mt-7 max-w-lg animate-rise text-lg leading-relaxed text-pretty text-muted"
            style={{ animationDelay: '210ms' }}
          >
            {SITE.tagline}
          </p>

          <div
            className="mt-10 flex animate-rise flex-wrap items-center gap-3"
            style={{ animationDelay: '300ms' }}
          >
            <a
              href="#projects"
              className="group rounded-inner bg-text px-5 py-2.5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
            >
              <span className="flex items-center gap-2">
                View work
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  &#8594;
                </span>
              </span>
            </a>

            <a
              href="#contact"
              className="rounded-inner border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>

          <dl className="mt-16 flex animate-rise flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6" style={{ animationDelay: '400ms' }}>
            {SPEC.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </HeroStage>
    </section>
  )
}
