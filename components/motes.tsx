'use client'

import { useEffect, useRef } from 'react'

/** One mote per this many square pixels, so density holds across viewports. */
const AREA_PER_MOTE = 13000
const MAX_MOTES = 90
const REPEL_RADIUS = 130

type Mote = {
  x: number
  y: number
  r: number
  speed: number
  sway: number
  phase: number
  alpha: number
  ox: number
  oy: number
}

/**
 * Slow drifting points of light over the aurora — dust in a sunbeam rather
 * than a particle grid.
 *
 * Sparse and irregular by design: an even lattice of dots reads as a game HUD,
 * whereas scattered motes at varied size and speed read as atmosphere. They
 * ease away from the pointer and settle back when it leaves.
 */
export function Motes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')

    let width = 0
    let height = 0
    let frame = 0
    let start = 0
    let motes: Mote[] = []
    let rgb: [number, number, number] = [79, 187, 211]
    let isDark = true

    const pointer = { x: -9999, y: -9999 }

    function readAccent() {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim()
        .replace('#', '')
      isDark = document.documentElement.classList.contains('dark')
      if (hex.length === 6) {
        rgb = [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ]
      }
    }

    // Deterministic scatter: a hash rather than Math.random, so a resize
    // redistributes motes without the field visibly reshuffling.
    function seeded(i: number, salt: number) {
      const value = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
      return value - Math.floor(value)
    }

    function build() {
      const count = Math.min(MAX_MOTES, Math.round((width * height) / AREA_PER_MOTE))
      motes = Array.from({ length: count }, (_, i) => ({
        x: seeded(i, 1) * width,
        y: seeded(i, 2) * height,
        r: 0.6 + seeded(i, 3) * 1.4,
        speed: 4 + seeded(i, 4) * 11,
        sway: 8 + seeded(i, 5) * 26,
        phase: seeded(i, 6) * Math.PI * 2,
        alpha: 0.25 + seeded(i, 7) * 0.5,
        ox: 0,
        oy: 0,
      }))
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      context!.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    function draw(now: number) {
      if (!start) start = now
      const seconds = reduced.matches ? 0 : (now - start) / 1000

      context!.clearRect(0, 0, width, height)
      const [r, g, b] = rgb

      for (const mote of motes) {
        // Rise and wrap. Modulo keeps the field continuous with no respawn pop.
        const y = (((mote.y - seconds * mote.speed) % height) + height) % height
        const x = mote.x + Math.sin(seconds * 0.25 + mote.phase) * mote.sway

        let dx = 0
        let dy = 0
        if (finePointer.matches) {
          const distX = x - pointer.x
          const distY = y - pointer.y
          const distance = Math.hypot(distX, distY)
          if (distance < REPEL_RADIUS && distance > 0.001) {
            const push = (1 - distance / REPEL_RADIUS) ** 2 * 34
            dx = (distX / distance) * push
            dy = (distY / distance) * push
          }
        }

        // Ease toward the target offset so motes glide rather than snap.
        mote.ox += (dx - mote.ox) * 0.08
        mote.oy += (dy - mote.oy) * 0.08

        const twinkle = reduced.matches
          ? 1
          : 0.65 + 0.35 * Math.sin(seconds * 1.1 + mote.phase * 2)

        // Fade out toward the bottom so nothing crosses into the next section.
        const depth = 1 - Math.min(y / height, 1) * 0.7

        context!.beginPath()
        context!.arc(x + mote.ox, y + mote.oy, mote.r, 0, Math.PI * 2)
        // The accent is a dark teal in light mode, so the same alpha carries
        // less against a pale ground than it does on near-black.
        const weight = isDark ? 1 : 1.5
        context!.fillStyle = `rgba(${r}, ${g}, ${b}, ${mote.alpha * twinkle * depth * weight})`
        context!.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    function onPointerLeave() {
      pointer.x = -9999
      pointer.y = -9999
    }

    readAccent()
    resize()
    frame = requestAnimationFrame(draw)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(readAccent)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const host = canvas.parentElement ?? canvas
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  )
}
