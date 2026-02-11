import type { SVGProps } from 'react'

/** Old-fashioned wall phone icon – handset (receiver) on cradle. */
export function WallPhoneIcon({ className, strokeWidth = 2, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Cradle */}
      <path d="M6 15h12" />
      {/* Handset: curved receiver (earpiece) down to mouthpiece on cradle */}
      <path d="M8 15c0-4 2-8 4-9s4-1 4 3c0 4 2 6 4 6" />
    </svg>
  )
}
