'use client'

import { useInView } from '@/lib/use-in-view'

export function SectionHeading({ eyebrow, label }: { eyebrow: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="mb-14">
      <div className="mb-3 flex items-center gap-3">
        {/* Rule draws itself out from the eyebrow when the section arrives. */}
        <span
          aria-hidden="true"
          className={`h-px bg-accent transition-all duration-700 ease-out ${
            inView ? 'w-10 opacity-100' : 'w-0 opacity-0'
          }`}
        />
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      </div>

      <h2
        className={`text-4xl font-black tracking-tight transition-all duration-700 ease-out md:text-h2 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: inView ? '120ms' : '0ms' }}
      >
        {label}
      </h2>
    </div>
  )
}
