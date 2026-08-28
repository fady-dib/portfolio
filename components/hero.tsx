import { SITE } from '@/lib/content'

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 size-[44rem] animate-drift-a rounded-full bg-accent/16 blur-3xl" />
        <div className="absolute -top-24 left-[65%] size-[32rem] animate-drift-b rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-32 md:py-44">
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

        <div
          className="mt-10 flex animate-rise flex-wrap gap-3"
          style={{ animationDelay: '380ms' }}
        >
          <a
            href="#projects"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-surface shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
