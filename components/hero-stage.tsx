'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll-driven frame for the hero.
 *
 * As the visitor scrolls the first screen, the hero contracts from full-bleed
 * into a rounded, bordered panel — the page ground opening up around it. The
 * progress value is written to the node as CSS custom properties inside a
 * rAF, never to React state, since this runs on every scroll frame.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const apply = () => {
      frame = 0
      const travel = window.innerHeight * 0.85
      const progress = Math.min(Math.max(window.scrollY / travel, 0), 1)
      // Ease out, so most of the movement happens early in the scroll.
      const eased = 1 - Math.pow(1 - progress, 2)
      stage.style.setProperty('--stage', eased.toFixed(4))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-stage relative overflow-hidden">
      {children}
    </div>
  )
}
