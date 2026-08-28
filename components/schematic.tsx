/**
 * Blueprint annotation layer: dashed guide lines that travel, marker squares
 * that pulse at the intersections, and a few dimension ticks.
 *
 * Pure SVG on a 0-1000 x 0-600 viewBox with `preserveAspectRatio="none"`, so
 * it stretches to whatever the hero is without any measurement in JS.
 */

const H_LINES = [88, 214, 366, 498]
const V_LINES = [128, 372, 636, 872]

const MARKERS = [
  { x: 128, y: 214, delay: 0 },
  { x: 372, y: 88, delay: 0.7 },
  { x: 636, y: 366, delay: 1.4 },
  { x: 872, y: 214, delay: 2.1 },
  { x: 372, y: 498, delay: 2.8 },
]

const BOXES = [
  { x: 596, y: 148, w: 120, h: 78, delay: 0.4 },
  { x: 812, y: 386, w: 84, h: 56, delay: 1.9 },
]

export function Schematic() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full text-accent"
    >
      <g stroke="currentColor" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {H_LINES.map((y, i) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            strokeDasharray="4 10"
            className="schematic-line"
            style={{ opacity: 0.28, animationDelay: `${i * 1.1}s` }}
          />
        ))}

        {V_LINES.map((x, i) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="600"
            strokeDasharray="4 10"
            className="schematic-line"
            style={{ opacity: 0.22, animationDelay: `${i * 0.8 + 0.4}s` }}
          />
        ))}

        {BOXES.map((b) => (
          <rect
            key={`b-${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            strokeDasharray="3 7"
            className="schematic-line"
            style={{ opacity: 0.35, animationDelay: `${b.delay}s` }}
          />
        ))}
      </g>

      <g fill="currentColor">
        {MARKERS.map((m) => (
          <rect
            key={`m-${m.x}-${m.y}`}
            x={m.x - 3}
            y={m.y - 3}
            width="6"
            height="6"
            className="schematic-marker"
            style={{ animationDelay: `${m.delay}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
