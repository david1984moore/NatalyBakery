/**
 * Two-tone envelope icon for mobile headers.
 * Body: solid white fill. Flap: transparent so the brown background shows through.
 */
export default function EnvelopeIcon({
  className = 'w-6 h-6',
  'aria-hidden': ariaHidden,
}: {
  className?: string
  'aria-hidden'?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden={ariaHidden}
    >
      {/* Envelope body - solid white fill */}
      <path
        d="M2 10h20v10H2V10z"
        fill="white"
      />
      {/* Envelope flap (triangle) - transparent, background shows through */}
      <path
        d="M2 4l10 6 10-6"
        fill="transparent"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
