import React from 'react';
import { stats } from '@/lib/siteData';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

export default function StatsStrip() {
  const { tl } = useLanguage();
  return (
    <Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} text-ink text-center py-7 md:py-9 px-3 rounded-2xl md:rounded-3xl border-2 border-ink`}>
            <div className="font-display font-bold text-5xl md:text-6xl leading-none">{s.value}</div>
            <div className="mt-2 text-sm md:text-base font-medium">{tl(s.label)}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}