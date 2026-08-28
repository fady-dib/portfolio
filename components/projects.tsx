import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { projects, type Project } from '@/lib/content'

const cardClass =
  'group flex h-full w-[17rem] shrink-0 snap-start flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-400 ease-out hover:-translate-y-1.5 hover:border-accent hover:shadow-xl hover:shadow-accent/10 md:w-auto md:shrink'

function CardBody({ project }: { project: Project }) {
  return (
    <>
      {/* Light plate in both themes: several client logos are dark artwork
          on a transparent background and disappear on a dark card. */}
      <div className="flex h-40 items-center justify-center rounded-xl bg-logo-plate p-6">
        <Image
          src={project.image}
          alt={`${project.title} logo`}
          className="max-h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-semibold">{project.title}</p>
        {project.url ? (
          <span aria-hidden="true" className="text-muted transition-colors group-hover:text-accent">
            &#8599;
          </span>
        ) : null}
      </div>
    </>
  )
}

export function Projects() {
  return (
    <section id="projects" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Work" label="Projects I contributed to" />
      </div>

      {/* Horizontal scroll-snap below md, a plain grid above. No JavaScript,
          no resize listener, no manual slide chunking. */}
      <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {projects.map((project) => (
          <li key={project.title} className="flex md:block">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                <CardBody project={project} />
              </a>
            ) : (
              <div className={cardClass}>
                <CardBody project={project} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
