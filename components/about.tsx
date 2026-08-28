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
              <div className="h-full rounded-card border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/60">
                <dd className="font-mono text-4xl font-medium tracking-tight tabular-nums">
                  <CountUp value={stat.number} />
                  <span className="text-accent">+</span>
                </dd>
                <dt className="mt-3 text-sm font-medium">{stat.title}</dt>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </dl>

        <Skills />
      </div>
    </section>
  )
}
