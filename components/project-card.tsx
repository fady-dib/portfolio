'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { Project } from '@/lib/content'

const MAX_TILT = 7

/**
 * Project card that tilts toward the pointer and carries a travelling
 * gradient ring on hover.
 *
 * Transform is written to the node inside a rAF rather than to state — this
 * runs on every mousemove over the card.
 */
export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  function handleMove(event: React.PointerEvent<HTMLElement>) {
    const card = cardRef.current
    if (!card) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5

    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      card.style.transform = `perspective(900px) rotateX(${-py * MAX_TILT}deg) rotateY(${px * MAX_TILT}deg) translateY(-6px)`
    })
  }

  function handleLeave() {
    const card = cardRef.current
    if (!card) return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    card.style.transform = ''
  }

  const inner = (
    <div
      ref={cardRef}
      className="ring-spin relative flex h-full flex-col rounded-card border border-border bg-surface p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-500 ease-out will-change-transform group-hover:border-accent/50 group-hover:shadow-2xl group-hover:shadow-accent/10"
    >
      <div className="flex h-40 items-center justify-center rounded-inner bg-logo-plate p-6">
        <Image
          src={project.image}
          alt={`${project.title} logo`}
          className="max-h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-semibold">{project.title}</p>
        {project.url ? (
          <span
            aria-hidden="true"
            className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          >
            &#8599;
          </span>
        ) : null}
      </div>
    </div>
  )

  const shared = 'group block h-full w-[17rem] shrink-0 snap-start md:w-auto md:shrink'

  return project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={shared}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {inner}
    </a>
  ) : (
    <div className={shared} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {inner}
    </div>
  )
}
