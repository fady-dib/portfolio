'use client'

import { useEffect, useRef } from 'react'

/**
 * Ambient hero layer: a drifting grid, two slow blobs, and a light that
 * tracks the pointer.
 *
 * The pointer position is written straight to CSS custom properties inside a
 * rAF, never to React state — this fires on every mousemove, and a setState
 * there would re-render the whole hero sixty times a second.
 */
export function HeroAmbient() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    const section = glow?.parentElement
    if (!glow || !section) return

    // Touch has no hover, so the light would stick wherever it was last tapped.
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      glow.style.setProperty('--mx', `${x}px`)
      glow.style.setProperty('--my', `${y}px`)
    }

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      x = event.clientX - rect.left
      y = event.clientY - rect.top
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onEnter = () => glow.style.setProperty('--glow-opacity', '1')
    const onLeave = () => glow.style.setProperty('--glow-opacity', '0')

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)

    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ambient-grid absolute inset-0 opacity-60" />

      <div className="absolute -top-48 left-1/2 size-[44rem] animate-drift-a rounded-full bg-accent/16 blur-3xl" />
      <div className="absolute -top-24 left-[68%] size-[32rem] animate-drift-b rounded-full bg-accent/10 blur-3xl" />

      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 'var(--glow-opacity, 0)',
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)',
        }}
      />
    </div>
  )
}
