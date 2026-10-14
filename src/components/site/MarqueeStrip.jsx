import React from 'react';
import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const ITEMS = [
  ['WEB TASARIM', 'text-mint'],
  ['E-TİCARET', 'text-sun'],
  ['SEO', 'text-coral'],
  ['GOOGLE İŞLETME', 'text-sage'],
  ['MOBİL UYGULAMA', 'text-sun'],
  ['OTOMASYON', 'text-fog'],
  ['KURUMSAL KİMLİK', 'text-mint'],
  ['DİJİTAL REKLAM', 'text-coral'],
  ['TURİZM & KONAKLAMA', 'text-sun'],
  ['YEREL TİCARET', 'text-mint'],
  ['GIDA & RESTORAN', 'text-sage'],
];

function Row() {
  const { tl } = useLanguage();
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map(([label, color]) => (
        <React.Fragment key={label}>
          <span className={`font-display font-bold text-lg md:text-2xl leading-none tracking-wide whitespace-nowrap ${color}`}>{tl(label)}</span>
          <Sparkle className="w-3.5 h-3.5 md:w-5 md:h-5 mx-5 md:mx-10 text-foreground/40 shrink-0" />
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden border-y-2 border-border bg-terminal py-4 md:py-5">
      <motion.div className="flex" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}