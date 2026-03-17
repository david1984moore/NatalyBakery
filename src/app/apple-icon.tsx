import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #d6b88a 0%, #c4956a 100%)',
          borderRadius: '36px',
          fontFamily: 'Georgia, serif',
          color: '#fff',
          flexDirection: 'column',
          gap: '0px',
        }}
      >
        <span style={{ fontSize: '72px', fontWeight: 700, lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}>
          C&amp;J
        </span>
      </div>
    ),
    { ...size }
  )
}
