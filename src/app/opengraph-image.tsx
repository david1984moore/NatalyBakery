import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Caramel & Jo - Where caramel dreams become cake'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const imagePath = join(process.cwd(), 'public/Images/IMG_7616.jpeg')
  const imageData = await readFile(imagePath, 'base64')
  const imageSrc = `data:image/jpeg;base64,${imageData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <img
          src={imageSrc}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Dark gradient overlay for brand name readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        />
        {/* Brand name - centered, Caramel above & Jo, no hamburger in share preview */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: 'Georgia, serif',
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            textShadow: '4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.5)',
            letterSpacing: '0.03em',
          }}
        >
          <span>Caramel</span>
          <span>& Jo</span>
        </div>
        {/* Tagline bar at bottom - warm brown like current design */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, #a08040 0%, #8B6914 100%)',
            padding: '24px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 32,
              fontWeight: 500,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            Where caramel dreams become cake
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
