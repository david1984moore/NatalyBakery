'use client';

export default function SafariOverscrollFill() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 pointer-events-none md:hidden"
      style={{
        height: 'calc(env(safe-area-inset-top, 0px) + 100px)',
        backgroundColor: '#d6b88a',
        zIndex: 2147483646,
        transform: 'translateY(-1px)', // Slight overlap to prevent subpixel gaps
      }}
    />
  );
}
