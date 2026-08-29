import { ProjectsCarousel } from '@/components/projects-carousel'
import { SectionHeading } from '@/components/section-heading'

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      {/* Neutral, not tinted: glass needs structure behind it to refract, but
          this is built from the text colour at very low alpha rather than the
          accent, so it adds depth without a colour wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[8%] size-[36rem] rounded-full bg-text/[0.05] blur-[110px]" />
        <div className="absolute right-[6%] bottom-0 size-[32rem] rounded-full bg-text/[0.04] blur-[110px]" />
        <div className="absolute inset-x-0 top-1/3 h-64 -skew-y-6 bg-gradient-to-r from-transparent via-text/[0.035] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <ProjectsCarousel />
      </div>
    </section>
  )
}
