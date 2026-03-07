import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AXIONLAB — Engineering for the obsessed.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Top accent line */}
        <div style={{ width: 80, height: 4, background: '#ff1f3d', marginBottom: 40, display: 'flex' }} />

        {/* Brand name */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-0.04em',
          textTransform: 'uppercase' as const,
          lineHeight: 0.9,
          marginBottom: 32,
          display: 'flex',
        }}>
          AXIONLAB
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#666666',
          textTransform: 'uppercase' as const,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          maxWidth: 600,
          display: 'flex',
        }}>
          Engineering for the obsessed.
        </div>

        {/* Bottom domain */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: 80,
          fontSize: 14,
          fontWeight: 800,
          color: '#ff1f3d',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.3em',
          display: 'flex',
        }}>
          axionlab.in
        </div>

        {/* Border line at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: '#ff1f3d',
          display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  )
}
