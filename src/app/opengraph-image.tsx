import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Caramel & Jo - Where caramel dreams become cake'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

async function loadPlayfairDisplay() {
  const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&text=${encodeURIComponent('Caramel&JoWheredreamsbecomecake')}&display=swap`
  const css = await (await fetch(url)).text()
  const match = css.match(/url\((https:\/\/[^)]+)\)\s+format\('([^']+)'\)/)
  if (!match) throw new Error('Failed to extract font URL from Google Fonts CSS')
  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error('Failed to fetch Playfair Display font')
  return await fontRes.arrayBuffer()
}

export default async function Image() {
  const [imageData, fontData] = await Promise.all([
    readFile(join(process.cwd(), 'public/Images/new_hero_1.jpeg'), 'base64'),
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
          background: '#8b6b4d',
        }}
      >
        {/* Mobile hero image – full bleed, cover (same as mobile Hero) */}
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
            objectPosition: 'center',
          }}
        />
        {/* Brand name: centered, ~18% from top – matches mobile Hero */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: 'Playfair Display',
              fontSize: 120,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,1), 0 4px 8px rgba(0,0,0,0.95), 0 6px 16px rgba(0,0,0,0.9), 0 10px 28px rgba(0,0,0,0.85)',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            Caramel & Jo
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
        {
          name: 'Playfair Display',
          data: fontData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
