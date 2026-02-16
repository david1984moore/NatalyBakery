export const TRANSITIONS = {
  hero: {
    fadeOut: 250,      // Slower (was 180ms)
    fadeIn: 250,       // Slower (was 180ms)
    overlayHold: 450,  // Longer for slower transition
    zoomAmount: 0.92,  // Gentler zoom (was 0.9)
  },
  standard: {
    fadeOut: 60,       // Fast fade before nav (menu ↔ contact)
    fadeIn: 80,
    overlayHold: 120,  // Shorter overlay for standard transitions
    maxWait: 280,      // Don't wait as long for images
  },
  slide: {
    duration: 300,
    distance: '30%',
  },
  overlay: {
    fadeSpeed: 200,
    heroStyle: {
      background: '#FCF7F2',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    },
    standardStyle: {
      background: '#FCF7F2',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    },
  }
} as const;
