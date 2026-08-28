import { ProjectCard } from '@/components/project-card'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'

export function Projects() {
  return (
    <section id="projects" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      {/* Horizontal scroll-snap below md, a plain grid above. No resize
          listener, no manual slide chunking. */}
      <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {projects.map((project, index) => (
          <li key={project.title} className="flex md:block">
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ul>
    </section>
  )
}
