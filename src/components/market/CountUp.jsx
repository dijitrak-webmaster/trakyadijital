import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

/** Sayfa göründüğünde 0'dan hedefe sayan animasyonlu sayaç. */
export default function CountUp({ value, className = '' }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('tr-TR'));

  useEffect(() => {
    const controls = animate(mv, value || 0, { duration: 1.4, ease: 'easeOut' });
    return () => controls.stop();
  }, [value]);

  return <motion.span className={className}>{text}</motion.span>;
}