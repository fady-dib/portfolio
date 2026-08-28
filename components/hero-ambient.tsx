import { Aurora } from '@/components/aurora'

/**
 * Hero ground: a single flowing field of light.
 *
 * The aurora carries both the ambient motion and the pointer interaction, so
 * there is no separate grid, blob, or cursor-glow layer stacked behind it.
 */
export function HeroAmbient() {
  return (
    <div aria-hidden="true" className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden">
      <Aurora />
    </div>
  )
}
