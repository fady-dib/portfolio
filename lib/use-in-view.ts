'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Reports whether an element has ever scrolled into view.
 *
 * The result latches: once true it never goes back to false, and the
 * observer disconnects. That makes a Strict Mode double-invoke idempotent
 * and stops reveal animations from replaying on every scroll past.
 */
export function useInView<T extends Element>(rootMargin = '0px 0px -15% 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    // The observer arrives as the callback's second argument rather than
    // being closed over: an entry can be delivered before the constructor
    // has returned, and the closed-over binding is not initialised yet.
    const observer = new IntersectionObserver(
      (entries, self) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          self.disconnect()
        }
      },
      { rootMargin, threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}
