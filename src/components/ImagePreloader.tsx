'use client';

import { useEffect } from 'react';

export default function ImagePreloader({ images }: { images: string[] }) {
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return null;
}
