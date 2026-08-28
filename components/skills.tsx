import { skills } from '@/lib/content'

export function Skills() {
  return (
    <div className="mt-20">
      <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Tools I work with
      </h3>
      <ul className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}
