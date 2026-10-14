import React from 'react';
import { motion } from 'framer-motion';
import { useAssistant } from '@/lib/AssistantContext';

export default function SectorHero({ sector }) {
  const { openAssistant } = useAssistant();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${sector.color} text-ink rounded-[2rem] p-8 md:p-14 min-h-[380px] flex flex-col justify-end`}
    >
      <span className="font-mono text-xs uppercase tracking-widest">Sektörel Çözümler / {sector.name}</span>
      <h1 className="mt-4 font-display font-bold text-4xl md:text-6xl leading-[1] max-w-2xl">{sector.title}</h1>
      <p className="mt-5 text-base md:text-lg text-ink/80 max-w-xl">{sector.intro}</p>
      <button onClick={() => openAssistant({ sector: sector.name })} className="mt-8 self-start rounded-full bg-ink text-foreground font-semibold px-7 py-3 hover:-translate-y-0.5 transition-transform">
        Teklif Al
      </button>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [6, 2, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute right-12 top-12 w-44 h-44 rounded-[2.5rem] bg-foreground border-2 border-ink shadow-sticker items-center justify-center"
      >
        <sector.icon className="w-24 h-24 text-ink" strokeWidth={1.6} />
      </motion.div>
    </motion.div>
  );
}