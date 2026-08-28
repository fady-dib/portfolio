import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/content'

export const alt = `${SITE.name} — ${SITE.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Generated at build time so the social card is a real 1200x630 image.
 * The previous site advertised those dimensions for a 612x408 portrait
 * photo, which is both untrue and below the size a large summary card
 * wants.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0F14',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#F5A524',
            }}
          />
          <div
            style={{
              color: '#8A97A8',
              fontSize: '26px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#E8EDF4',
              fontSize: '86px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            {SITE.role}
          </div>
          <div
            style={{
              color: '#F5A524',
              fontSize: '86px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            building fast, durable web.
          </div>
        </div>

        <div style={{ color: '#8A97A8', fontSize: '30px' }}>www.fadydib.com</div>
      </div>
    ),
    size,
  )
}
