import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

// tek soru kartı: başlık + 3 şık
export default function QuizStep({ question, index, total, onSelect }) {
  const { tl } = useLanguage();
  return (
    <motion.div
      key={question.key}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.22em] text-sun">{tl(`SORU ${index + 1} / ${total}`)}</span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i < index ? 'w-4 bg-mint' : i === index ? 'w-6 bg-sun' : 'w-4 bg-foreground/15'}`} />
          ))}
        </div>
      </div>
      <h2 className="mt-5 font-display font-bold text-xl md:text-2xl leading-snug">{tl(question.q)}</h2>
      <div className="mt-5 space-y-3">
        {question.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onSelect(o.points)}
            className="w-full text-left rounded-2xl border-2 border-border bg-terminal px-4 py-3.5 text-sm font-semibold hover:border-mint hover:bg-mint hover:text-ink hover:-translate-y-0.5 hover:shadow-sticker transition-all"
          >
            {tl(o.label)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}