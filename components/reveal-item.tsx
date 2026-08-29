'use client'

import { useInView } from '@/lib/use-in-view'

/**
 * A list item that rises into view.
 *
 * Renders the <li> itself rather than wrapping one, so it stays the direct
 * child of the scroll container — scroll-snap alignment and the grid both
 * depend on that relationship.
 */
export function RevealItem({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLLIElement>()

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`${className} transition-all duration-700 ease-out ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {children}
    </li>
  )
}
