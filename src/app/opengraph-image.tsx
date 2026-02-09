import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Caramel & Jo - Where caramel dreams become cake'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

async function loadPlayfairDisplay() {
  const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=${encodeURIComponent('Caramel&Jo')}&display=swap`
  const css = await (await fetch(url)).text()
  const match = css.match(/url\((https:\/\/[^)]+)\)\s+format\('([^']+)'\)/)
  if (!match) throw new Error('Failed to extract font URL from Google Fonts CSS')
  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error('Failed to fetch Playfair Display font')
  return await fontRes.arrayBuffer()
}

export default async function Image() {
  const [imageData, fontData] = await Promise.all([
    readFile(join(process.cwd(), 'public/Images/IMG_7616.jpeg'), 'base64'),
    loadPlayfairDisplay(),
  ])
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
          background: '#d4c4a8',
        }}
      >
        {/* Hero image - same as homepage: contain so cake is focal, wood visible at edges */}
        <img
          src={imageSrc}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        {/* Top/bottom gradient fades like homepage hero (no logo strip) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(212,196,168,0.98) 0%, rgba(212,196,168,0.95) 8%, rgba(212,196,168,0.82) 18%, rgba(212,196,168,0.5) 24%, transparent 28%, transparent 72%, rgba(212,196,168,0.5) 76%, rgba(212,196,168,0.82) 82%, rgba(212,196,168,0.95) 92%, rgba(212,196,168,0.98) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Brown footer: slogan + URL only */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, #a08040 0%, #8B6914 100%)',
            padding: '24px 40px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'Playfair Display',
              fontSize: 28,
              fontWeight: 500,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            Where caramel dreams become cake!
          </span>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
            }}
          >
            caramelandjo.onrender.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
