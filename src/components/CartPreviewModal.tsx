'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface CartPreviewProps {
  show: boolean;
  item: {
    name: string;
    price: number;
    image: string;
  } | null;
  onClose: () => void;
}

function getCartTargetOffset(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 120, y: -280 };
  const buttons = document.querySelectorAll<HTMLElement>('[aria-label="Shopping cart"]');
  const vw = window.innerWidth / 2;
  const vh = window.innerHeight / 2;
  for (const el of buttons) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.top >= 0 && r.top < window.innerHeight) {
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      return { x: cx - vw, y: cy - vh };
    }
  }
  return { x: 120, y: -280 };
}

export default function CartPreviewModal({ show, item, onClose }: CartPreviewProps) {
  const [phase, setPhase] = useState<'entered' | 'exiting'>('entered');
  const [targetOffset, setTargetOffset] = useState({ x: 120, y: -280 });

  useEffect(() => {
    if (show && item) {
      setPhase('entered');
      setTargetOffset(getCartTargetOffset());
      const timer = setTimeout(() => setPhase('exiting'), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, item]);

  const handleFadeComplete = useCallback(() => {
    if (phase === 'exiting') onClose();
  }, [phase, onClose]);

  const driftAmount = 0.75;

  return (
    <AnimatePresence>
      {show && item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: phase === 'exiting' ? 0 : 1,
              scale: phase === 'exiting' ? 0.2 : 1,
              x: phase === 'exiting' ? targetOffset.x * driftAmount : 0,
              y: phase === 'exiting' ? targetOffset.y * driftAmount : 0,
            }}
            transition={
              phase === 'exiting'
                ? {
                    duration: 0.45,
                    ease: [0.32, 0, 0.67, 0],
                  }
                : { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
            }
            onAnimationComplete={handleFadeComplete}
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-[min(calc(100vw-2rem),320px)] w-full origin-center"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-warmgray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-warmgray-800">Added to cart</p>
                <p className="text-warmgray-600 text-xs truncate">{item.name}</p>
              </div>
              <p className="font-bold text-warmgray-800 flex-shrink-0">
                {formatCurrency(item.price)}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
