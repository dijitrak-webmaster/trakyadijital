import React from 'react';
import { motion } from 'framer-motion';

const SIZES = {
  sm: ['w-12 h-12', 'w-6 h-6'],
  md: ['w-14 h-14 md:w-16 md:h-16', 'w-7 h-7 md:w-8 md:h-8'],
  lg: ['w-20 h-20 md:w-28 md:h-28', 'w-10 h-10 md:w-14 md:h-14'],
};

export default function Sticker({ icon: Icon, tile = 'bg-sun', size = 'md', rotate = 0, delay = 0, className = '' }) {
  const [box, ico] = SIZES[size];
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 25 }}
      animate={{ opacity: 1, scale: 1, rotate, y: [0, -12, 0] }}
      transition={{ delay, type: 'spring', stiffness: 120, y: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <div className={`${box} ${tile} rounded-2xl border-2 border-ink flex items-center justify-center shadow-sticker`}>
        <Icon className={`${ico} text-ink`} strokeWidth={2.2} />
      </div>
    </motion.div>
  );
}