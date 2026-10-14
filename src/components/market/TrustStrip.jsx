import React from 'react';
import { Wrench, Eye, Bot, Zap } from 'lucide-react';
import Reveal from '@/components/site/Reveal';

const TRUST = [
  { icon: Wrench, label: 'Kurulum ve yayına alma dahil', color: 'bg-mint' },
  { icon: Eye, label: 'Canlı önizleme ile önceden dene', color: 'bg-sun' },
  { icon: Bot, label: 'DijiBot ile 7/24 destek', color: 'bg-coral' },
  { icon: Zap, label: '24 saatte teklif dönüşü', color: 'bg-sage' },
];

/** Hero ile ürünler arasındaki güven/avantaj şeridi. */
export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-6 mt-14">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TRUST.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.05}>
            <div className="h-full flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
              <span className={`grid place-items-center w-9 h-9 shrink-0 rounded-xl ${t.color} text-ink`}>
                <t.icon className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold leading-snug">{t.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}