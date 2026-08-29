'use client'

import { useInView } from '@/lib/use-in-view'

/**
 * Wrapper that rises into view, for cards inside the projects carousel.
 *
 * Renders a div rather than an li now that the slides live inside Swiper,
 * which owns the list structure itself.
 *
 * The hidden state is deliberately md-only. Below that the cards sit in a
 * horizontal carousel, so anything past the first slide never intersects the
 * viewport, IntersectionObserver never fires for it, and it would stay
 * invisible until swiped to. From md the wrapper is laid out as a grid in
 * normal vertical flow, which is where a scroll reveal actually makes sense.
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
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`${className} h-full transition-all duration-700 ease-out ${
        inView ? 'md:translate-y-0 md:opacity-100' : 'md:translate-y-8 md:opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
