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
      // The hidden state is desktop-only. On mobile these sit in a
      // horizontal scroller, so cards further along never intersect the
      // viewport and would stay invisible until scrolled to — and the
      // translate added vertical overflow to a box that must not have any.
      className={`${className} transition-all duration-700 ease-out ${
        inView ? 'md:translate-y-0 md:opacity-100' : 'md:translate-y-8 md:opacity-0'
      }`}
    >
      {children}
    </li>
  )
}
