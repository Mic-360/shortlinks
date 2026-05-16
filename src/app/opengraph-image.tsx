import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Linkshort — clean, short links'

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background:
          'linear-gradient(135deg, #f4f7f1 0%, #cdd9c2 60%, #a8baa0 100%)',
        fontFamily: 'serif',
        color: '#243121',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28 }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #a8baa0, #5d6f54)',
            display: 'flex',
          }}
        />
        Linkshort
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: '-0.02em' }}
        >
          Quiet links.
        </div>
        <div style={{ fontSize: 84, lineHeight: 1.05, color: '#475a40' }}>
          No trackers.
        </div>
      </div>
      <div style={{ fontSize: 26, color: '#4a4f44' }}>
        Editorial link shortener · REST API · MCP server
      </div>
    </div>,
    { ...size }
  )
}
