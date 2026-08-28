import Image from 'next/image'
import type { Project } from '@/lib/content'

/**
 * Back to a server component: no tilt, no travelling gradient ring. The hover
 * state is a border and a hairline, which is what a tool would do.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const body = (
    <>
      <div className="flex h-36 items-center justify-center rounded-inner bg-logo-plate p-6">
        <Image
          src={project.image}
          alt={`${project.title} logo`}
          className="max-h-20 w-auto object-contain"
          loading="lazy"
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </p>
          <p className="mt-1 text-sm font-medium">{project.title}</p>
        </div>

        {project.url ? (
          <span
            aria-hidden="true"
            className="font-mono text-xs text-muted transition-colors duration-200 group-hover:text-accent"
          >
            &#8599;
          </span>
        ) : null}
      </div>
    </>
  )

  const className =
    'group flex h-full w-[16rem] shrink-0 snap-start flex-col rounded-card border border-border bg-surface p-4 transition-colors duration-200 hover:border-accent/60 md:w-auto md:shrink'

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}
