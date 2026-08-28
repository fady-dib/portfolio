/**
 * Hero ground: one hairline rule grid, fading out downward.
 *
 * No canvas, no particles, no coloured glow. The grid is drawn in the neutral
 * border colour rather than the accent, so it reads as the faint structure
 * behind a technical document instead of an effect layer.
 */
export function HeroAmbient() {
  return <div aria-hidden="true" className="rule-grid pointer-events-none absolute inset-0" />
}
