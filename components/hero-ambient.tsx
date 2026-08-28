import { Aurora } from '@/components/aurora'
import { Motes } from '@/components/motes'

/**
 * Hero ground: a flowing field of light with drifting motes over it.
 *
 * Two layers rather than one, because they want different treatments — the
 * aurora is rendered small and blurred, the motes sharp — so they cannot
 * share a canvas.
 */
export function HeroAmbient() {
  return (
    <div
      aria-hidden="true"
      className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Aurora />
      <Motes />
    </div>
  )
}
