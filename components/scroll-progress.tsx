'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading-progress line along the bottom edge of the header.
 *
 * Writes scaleX directly to the node rather than through state: this runs on
 * every scroll frame, and a re-render per frame would be wasteful for what is
 * one style property.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0

    const apply = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`
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
    <div
      ref={barRef}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
    />
  )
}
