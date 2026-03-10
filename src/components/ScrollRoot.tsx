'use client';

/**
 * Explicit scroll container so native wheel/trackpad scrolling works on desktop.
 * The document scroll was blocked by layout; this div is the scroll target.
 */
export default function ScrollRoot({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="scroll-root"
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  );
}
