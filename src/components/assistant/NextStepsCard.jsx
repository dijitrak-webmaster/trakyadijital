import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

// ✅ form gönderildikten sonraki "şimdi ne olacak?" kartı — sticker dilinde
const STEPS = {
  tr: [
    { title: 'Talebin alındı', desc: 'Dijitrak ekibi detayları inceliyor' },
    { title: '24 saat içinde dönüş', desc: 'Telefon veya e-posta ile' },
    { title: 'Net teklif + takvim', desc: 'Ücretsiz keşif görüşmesinden sonra' },
  ],
  en: [
    { title: 'Request received', desc: 'The Dijitrak team is reviewing it' },
    { title: 'Reply within 24 hours', desc: 'By phone or e-mail' },
    { title: 'Final quote + timeline', desc: 'After a free discovery call' },
  ],
};

export default function NextStepsCard() {
  const { lang } = useLanguage();
  const steps = STEPS[lang] || STEPS.tr;
  return (
    <motion.ol
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="mt-2 rounded-2xl border-2 border-sun/40 bg-card p-4"
    >
      <li className="font-mono text-[10px] uppercase tracking-wider font-semibold text-sun">
        {lang === 'en' ? 'Next steps' : 'Sonraki adımlar'}
      </li>
      {steps.map((s, i) => (
        <li key={s.title} className="mt-2.5 first:mt-3 flex items-start gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-mint/50 bg-mint/10 font-mono text-[10px] font-bold text-mint">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground leading-tight">{s.title}</p>
            <p className="text-[11px] text-muted-foreground leading-tight">{s.desc}</p>
          </div>
        </li>
      ))}
    </motion.ol>
  );
}