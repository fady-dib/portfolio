import { ProjectCard } from '@/components/project-card'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      {/* Horizontal scroll-snap below md, a plain grid above. No resize
          listener, no manual slide chunking.

          The vertical padding is load-bearing: setting overflow-x to auto
          forces overflow-y to auto as well, so the card's hover lift and its
          shadow were being clipped top and bottom. The padding gives them
          room inside the scroll box. */}
      <ul className="relative mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-6 md:grid md:grid-cols-3 md:overflow-visible">
        {projects.map((project) => (
          <li key={project.title} className="flex md:block">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
