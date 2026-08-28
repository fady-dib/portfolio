'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/lib/use-in-view'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const DURATION_MS = 1600

export function CountUp({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const reduced = usePrefersReducedMotion()
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return

    let frame = 0
    let start: number | null = null

    const tick = (now: number) => {
      start ??= now
      const progress = Math.min((now - start) / DURATION_MS, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  // Derived rather than assigned in an effect: with reduced motion the final
  // value is simply what we render, so there is no state to synchronise.
  const display = reduced && inView ? value : animated

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
