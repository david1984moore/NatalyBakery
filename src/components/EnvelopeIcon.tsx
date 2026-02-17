/**
 * Two-tone envelope icon for contact button.
 * Body: solid white fill. Flap: brown (matches button).
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
      {/* Envelope flap (triangle) - brown */}
      <path
        d="M2 4l10 6 10-6"
        fill="#8a7160"
      />
    </svg>
  )
}
