import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

const STEPS = [
  { num: '01', title: 'Keşif Görüşmesi', desc: 'İşletmenizi, hedeflerinizi ve rakiplerinizi tanıyoruz. 45 dakikalık görüşme, tüm yol haritasının temeli.' },
  { num: '02', title: 'Strateji & Tasarım', desc: 'Size özel tasarım konsepti ve içerik planı. Onayınız olmadan tek satır kod yazılmaz.' },
  { num: '03', title: 'Geliştirme & Entegrasyon', desc: 'Site, mağaza veya uygulama; ödeme, kargo ve paneller dahil her şey kurulumuyla teslim.' },
  { num: '04', title: 'Lansman & Büyüme', desc: 'Yayın sonrası SEO, reklam ve raporlamayla büyümeyi birlikte sürdürüyoruz.' },
];

export default function Process() {
  const { tl } = useLanguage();
  return (
    <section>
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs text-coral">{tl('// NASIL ÇALIŞIYORUZ')}</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">{tl('4 adımda dijitale geçiş')}</h2>
        <p className="mt-4 text-foreground/70 text-lg">{tl('İlk telefondan lansman gününe kadar her adım net ve takipli.')}</p>
      </Reveal>
      <div className="mt-6 grid md:grid-cols-4 gap-3 md:gap-5">
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.1}>
            <div className="relative h-full rounded-2xl border-2 border-border bg-terminal p-4 md:p-6 overflow-hidden">
              <span className="absolute -right-2 -top-5 hidden md:block font-display font-bold text-8xl text-foreground/5 select-none">{s.num}</span>
              <div className="relative">
                <span className="font-mono text-sm text-mint">{s.num}</span>
                <h3 className="mt-1 md:mt-2 font-display font-semibold text-base md:text-lg">{tl(s.title)}</h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed max-md:hidden">{tl(s.desc)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}