'use client'

import { useEffect, useRef } from 'react'

/** Each orb drifts on its own two sine paths, so the field never visibly loops. */
/**
 * Five orbs across a wider hue spread. A single hue reads as one flat wash;
 * spreading toward blue and violet gives the field depth, and the small
 * bright core on each is what makes it look like light rather than a
 * blurred circle. `core` scales the centre stop only.
 */
const ORBS = [
  { hue: 0, radius: 0.58, x: 0.30, y: 0.18, ax: 0.10, ay: 0.08, sx: 0.00007, sy: 0.00011, pull: 0.55, core: 1.35 },
  { hue: 22, radius: 0.46, x: 0.70, y: 0.30, ax: 0.13, ay: 0.07, sx: 0.00009, sy: 0.00006, pull: 0.35, core: 1.0 },
  { hue: 44, radius: 0.40, x: 0.54, y: 0.58, ax: 0.09, ay: 0.11, sx: 0.00005, sy: 0.00013, pull: 0.70, core: 1.15 },
  { hue: 68, radius: 0.32, x: 0.86, y: 0.62, ax: 0.11, ay: 0.09, sx: 0.00012, sy: 0.00008, pull: 0.25, core: 0.9 },
  { hue: -18, radius: 0.26, x: 0.16, y: 0.62, ax: 0.08, ay: 0.10, sx: 0.00014, sy: 0.00009, pull: 0.45, core: 1.5 },
]

// Rendered small and stretched back up. The field is pure soft gradient, so
// the upscale is invisible and it cuts the fill cost by roughly an order of
// magnitude versus painting at device resolution.
const RENDER_SCALE = 0.32

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  if (value.length !== 6) return [79, 187, 211]
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

/** Rotate an RGB triple around the hue wheel, keeping it in the accent family. */
function shiftHue([r, g, b]: [number, number, number], degrees: number): [number, number, number] {
  const angle = (degrees * Math.PI) / 180
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const matrix = [
    0.213 + cos * 0.787 - sin * 0.213,
    0.715 - cos * 0.715 - sin * 0.715,
    0.072 - cos * 0.072 + sin * 0.928,
    0.213 - cos * 0.213 + sin * 0.143,
    0.715 + cos * 0.285 + sin * 0.14,
    0.072 - cos * 0.072 - sin * 0.283,
    0.213 - cos * 0.213 - sin * 0.787,
    0.715 - cos * 0.715 + sin * 0.715,
    0.072 + cos * 0.928 + sin * 0.072,
  ]
  return [
    Math.min(255, Math.max(0, r * matrix[0] + g * matrix[1] + b * matrix[2])),
    Math.min(255, Math.max(0, r * matrix[3] + g * matrix[4] + b * matrix[5])),
    Math.min(255, Math.max(0, r * matrix[6] + g * matrix[7] + b * matrix[8])),
  ]
}

/**
 * Flowing field of soft light. Orbs drift continuously and ease toward the
 * pointer, each at its own rate, so the field bends rather than following the
 * cursor as one mass.
 *
 * Canvas rather than animated DOM gradients: this composites four large
 * radial fills per frame, which the compositor handles far better as a single
 * bitmap than as four blurred layers.
 */
export function Aurora() {
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

    // Target is where the pointer is; current eases toward it, which is what
    // gives the field weight instead of a rigid snap.
    const target = { x: 0.5, y: 0.4 }
    const current = { x: 0.5, y: 0.4 }

    let base: [number, number, number] = [79, 187, 211]
    let isDark = true

    function readTheme() {
      const styles = getComputedStyle(document.documentElement)
      base = hexToRgb(styles.getPropertyValue('--accent').trim())
      isDark = document.documentElement.classList.contains('dark')
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width * RENDER_SCALE))
      height = Math.max(1, Math.floor(rect.height * RENDER_SCALE))
      canvas!.width = width
      canvas!.height = height
    }

    function draw(now: number) {
      if (!start) start = now
      const time = reduced.matches ? 0 : now - start

      current.x += (target.x - current.x) * 0.045
      current.y += (target.y - current.y) * 0.045

      context!.clearRect(0, 0, width, height)
      // Additive on dark so the orbs read as light. Multiply on light: drawn
      // normally they only dilute the ground toward grey, whereas multiplying
      // deepens it into an actual tint of the accent.
      context!.globalCompositeOperation = isDark ? 'lighter' : 'multiply'

      const span = Math.max(width, height)

      for (const orb of ORBS) {
        const driftX = Math.sin(time * orb.sx + orb.hue) * orb.ax
        const driftY = Math.cos(time * orb.sy + orb.hue) * orb.ay

        const pullX = finePointer.matches ? (current.x - 0.5) * orb.pull * 0.55 : 0
        const pullY = finePointer.matches ? (current.y - 0.5) * orb.pull * 0.55 : 0

        const cx = (orb.x + driftX + pullX) * width
        const cy = (orb.y + driftY + pullY) * height
        const r = orb.radius * span

        const [cr, cg, cb] = shiftHue(base, orb.hue)
        const alpha = (isDark ? 0.2 : 0.34) * orb.core

        // Four stops rather than three: the tight inner one gives each orb a
        // hot centre that falls away fast, which is what separates light from
        // a flat disc of colour.
        const gradient = context!.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha})`)
        gradient.addColorStop(0.18, `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha * 0.72})`)
        gradient.addColorStop(0.55, `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha * 0.26})`)
        gradient.addColorStop(1, `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, 0)`)

        context!.fillStyle = gradient
        context!.beginPath()
        context!.arc(cx, cy, r, 0, Math.PI * 2)
        context!.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      target.x = (event.clientX - rect.left) / rect.width
      target.y = (event.clientY - rect.top) / rect.height
    }

    function onPointerLeave() {
      target.x = 0.5
      target.y = 0.4
    }

    readTheme()
    resize()
    frame = requestAnimationFrame(draw)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // The accent and the ground both flip with the theme.
    const themeObserver = new MutationObserver(readTheme)
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
      // Blur softens the low-resolution buffer into continuous light; the mask
      // fades the field out before it reaches the section below.
      className="pointer-events-none absolute inset-0 size-full blur-2xl"
      style={{
        maskImage: 'linear-gradient(to bottom, #000 55%, transparent 92%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 92%)',
      }}
    />
  )
}
