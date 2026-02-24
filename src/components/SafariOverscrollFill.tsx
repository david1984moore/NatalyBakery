'use client';

export default function SafariOverscrollFill() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 pointer-events-none md:hidden"
      style={{
        top: '-100vh',
        height: '100vh',
        backgroundColor: '#d6b88a',
        zIndex: 1,
      }}
    />
  );
}
