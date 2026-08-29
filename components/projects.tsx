import { ProjectCard } from '@/components/project-card'
import { RevealItem } from '@/components/reveal-item'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      {/* Neutral, not tinted: glass needs structure behind it to refract, but
          this is built from the text colour at very low alpha rather than the
          accent, so it adds depth without a colour wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[8%] size-[36rem] rounded-full bg-text/[0.05] blur-[110px]" />
        <div className="absolute bottom-0 right-[6%] size-[32rem] rounded-full bg-text/[0.04] blur-[110px]" />
        <div className="absolute inset-x-0 top-1/3 h-64 -skew-y-6 bg-gradient-to-r from-transparent via-text/[0.035] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      {/* Horizontal scroll-snap below md, a plain grid above. No resize
          listener, no manual slide chunking.

          Two paddings are load-bearing here. The vertical one: setting
          overflow-x to auto forces overflow-y to auto as well, so the card's
          hover lift and shadow were clipped top and bottom. And scroll-px,
          because snap-start aligns a card to the snapport, which defaults to
          the padding box — without it the browser scrolls by exactly
          padding-left and the first card ends up flush against the edge.

          touch-pan-x is what keeps the page scrollable on a phone. Since
          overflow-x forces overflow-y to auto, this box was vertically
          scrollable by a few pixels, so a downward swipe over it was captured
          here, consumed, and never reached the page. Restricting it to
          horizontal panning hands vertical gestures back. */}
      <ul className="relative mx-auto flex max-w-7xl touch-pan-x snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto overscroll-x-contain px-5 py-6 md:grid md:grid-cols-3 md:touch-auto md:overflow-visible">
        {projects.map((project, index) => (
          <RevealItem
            key={project.title}
            className="flex md:block"
            // Stagger within a row of three rather than across all nineteen —
            // a linear delay would leave the last card waiting well over a
            // second after the first.
            delay={(index % 3) * 90}
          >
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </ul>
    </section>
  )
}
