import { skills } from '@/lib/content'

// Two identical passes: the track scrolls exactly one pass width, so the
// wrap-around is invisible.
const chip =
  'shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent'

export function Skills() {
  return (
    <div className="mt-20">
      <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Tools I work with
      </h3>

      <div className="marquee-mask -mx-5 overflow-hidden px-5">
        <ul className="marquee-track flex w-max gap-2.5 hover:[animation-play-state:paused]">
          {skills.map((skill) => (
            <li key={skill} className={chip}>
              {skill}
            </li>
          ))}
          {skills.map((skill) => (
            <li key={`${skill}-repeat`} aria-hidden="true" className={chip}>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
