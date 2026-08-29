import { skills } from '@/lib/content'

const chip =
  'shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent'

// Split rather than duplicated, so the two rows never show the same word
// alongside itself.
// Three copies: the track travels one, so two always remain on screen.
const PASSES = [0, 1, 2]

const half = Math.ceil(skills.length / 2)
const rows = [skills.slice(0, half), skills.slice(half)]

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="marquee-mask -mx-5 overflow-hidden px-5">
      {/* Two identical passes: the track travels exactly one pass width, so
          the wrap-around is invisible. */}
      <ul
        className={`flex w-max gap-2.5 hover:[animation-play-state:paused] ${
          reverse ? 'marquee-track-reverse' : 'marquee-track'
        }`}
      >
        {PASSES.map((pass) =>
          items.map((skill) => (
            <li
              key={`${skill}-${pass}`}
              // Only the first pass is announced; the rest are duplicates
              // that exist purely so the loop has something to scroll into.
              aria-hidden={pass > 0 ? 'true' : undefined}
              className={chip}
            >
              {skill}
            </li>
          )),
        )}
      </ul>
    </div>
  )
}

export function Skills() {
  return (
    <div className="mt-20">
      <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Tools I work with
      </h3>

      {/* Opposite directions: two rows drifting against each other read as
          considerably more alive than one, at no extra cost. */}
      <div className="flex flex-col gap-2.5">
        <Row items={rows[0]} />
        <Row items={rows[1]} reverse />
      </div>
    </div>
  )
}
