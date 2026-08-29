import { Aurora } from '@/components/aurora'
import { Motes } from '@/components/motes'

/**
 * Hero ground: a colour field, two rotating light beams, drifting motes, and
 * a scrim.
 *
 * The beams carry the motion. Rotation was chosen over anything travelling
 * horizontally because the previous attempt drew curves straight through the
 * headline and cost too much contrast — a beam sweeping around an off-screen
 * centre keeps the movement in the open space to the right.
 *
 * The scrim is what actually protects legibility, and it sits last so it
 * covers every layer above it. Without it, any future effect has the same
 * problem this one was fixing.
 */
export function HeroAmbient() {
  return (
    <div
      aria-hidden="true"
      className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Aurora />

      {/* Centred beyond the right edge, so only the sweep's leading edge
          crosses the visible area. */}
      <div className="absolute top-1/2 left-[72%] size-[80rem] -translate-x-1/2 -translate-y-1/2">
        <div
          className="sweep-a size-full rounded-full opacity-[0.9] blur-3xl dark:opacity-[0.55]"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 55%, transparent) 38deg, transparent 110deg, transparent 360deg)',
          }}
        />
      </div>

      <div className="absolute top-[38%] left-[88%] size-[56rem] -translate-x-1/2 -translate-y-1/2">
        <div
          className="sweep-b size-full rounded-full opacity-70 blur-3xl dark:opacity-40"
          style={{
            background:
              'conic-gradient(from 180deg, transparent 0deg, color-mix(in oklab, var(--accent) 40%, transparent) 52deg, transparent 140deg, transparent 360deg)',
          }}
        />
      </div>

      <Motes />

      {/* Reading ground for the copy: strongest at the left where the text
          sits, gone by the middle so the movement stays visible. */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent md:via-bg/20 dark:from-bg dark:via-bg/70 dark:md:via-bg/45" />
    </div>
  )
}
