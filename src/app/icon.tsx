import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '6px',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        C
      </div>
    ),
    { ...size }
  )
}
