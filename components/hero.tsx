import { SITE } from '@/lib/content'

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium tracking-wider text-muted uppercase">
          <span className="size-1.5 rounded-full bg-accent" />
          Available for work
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-balance md:text-display">
          {SITE.role} building{' '}
          <span className="text-accent">fast, durable web products.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-pretty text-muted">{SITE.tagline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
