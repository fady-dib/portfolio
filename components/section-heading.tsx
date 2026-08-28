'use client'

import { useInView } from '@/lib/use-in-view'

export function SectionHeading({ eyebrow, label }: { eyebrow: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="mb-12">
      <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        <span className="text-accent">/</span> {eyebrow}
      </p>

      <h2
        className={`text-3xl font-semibold tracking-tight transition-all duration-500 ease-out md:text-h2 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        {label}
      </h2>
    </div>
  )
}
