import { CountUp } from '@/components/count-up'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Skills } from '@/components/skills'
import { stats } from '@/lib/content'

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="About" label="Building both sides of the web" />

        <div className="max-w-3xl space-y-5 text-lg text-pretty text-muted">
          <Reveal>
            <p>
              I am a <strong className="font-semibold text-text">Full Stack Web Developer</strong>{' '}
              focused on building and managing both the front-end and back-end of websites and web
              applications, contributing to the overall success of the product.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              Feel free to connect or follow me on LinkedIn and GitHub. I am open to roles where I
              can contribute, learn, and grow.
            </p>
          </Reveal>
        </div>

        {/* dd before dt: the number is the value and leads visually, the
            label is the term. Valid, and it keeps the pair associated. */}
        <dl className="mt-16 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.title} delay={index * 100}>
              <div className="group relative h-full overflow-hidden rounded-card border border-glass-edge bg-glass p-7 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <dd className="relative text-5xl font-black tracking-tight text-accent">
                  <CountUp value={stat.number} />+
                </dd>
                <dt className="relative mt-3 font-semibold">{stat.title}</dt>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </dl>

        <Skills />
      </div>
    </section>
  )
}
