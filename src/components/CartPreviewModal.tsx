'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
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

export default function CartPreviewModal({ show, item, onClose }: CartPreviewProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Auto-close after 2.5s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && item && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 safe-bottom safe-x"
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
      )}
    </AnimatePresence>
  );
}
