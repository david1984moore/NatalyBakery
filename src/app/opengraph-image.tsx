import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Caramel & Jo - Where caramel dreams become cake'
export const size = { width: 1200, height: 630 }
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
        {/* Brand name - Playfair Display to match site, Caramel above & Jo centered */}
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
            fontFamily: 'Playfair Display',
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
        {/* Brown/gold bar at bottom with slogan */}
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
              fontFamily: 'Playfair Display',
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
