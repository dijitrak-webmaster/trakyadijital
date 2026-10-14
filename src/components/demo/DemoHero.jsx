import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function DemoHero({ theme }) {
  const { hero, headClass } = theme;
  const h1 = `[font-family:var(--d-head)] font-bold leading-[1.05] text-4xl sm:text-5xl lg:text-6xl ${headClass}`;
  const primary = 'inline-flex items-center gap-2 rounded-full bg-[var(--d-accent)] text-[var(--d-on)] px-6 py-3 font-semibold';

  if (theme.heroStyle === 'overlay') {
    return (
      <section id="top" className="relative min-h-[560px] md:min-h-[640px] flex items-end overflow-hidden">
        <Image src={hero.image} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative max-w-6xl mx-auto w-full px-5 pb-14 md:pb-20 text-white">
          <p className="text-sm font-medium tracking-wide opacity-85">{hero.eyebrow}</p>
          <h1 className={`${h1} mt-3 max-w-3xl`}>{hero.title}</h1>
          <p className="mt-5 max-w-xl md:text-lg opacity-85">{hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#ozellikler" className={primary}>{hero.cta} <ArrowRight className="w-4 h-4" /></a>
            <a href="#iletisim" className="inline-flex rounded-full border border-white/60 px-6 py-3 font-semibold">{hero.cta2}</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="top" className="max-w-6xl mx-auto px-5 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="font-mono text-sm font-semibold text-[var(--d-accent)]">{hero.eyebrow}</p>
        <h1 className={`${h1} mt-3`}>{hero.title}</h1>
        <p className="mt-5 md:text-lg text-[var(--d-muted)] leading-relaxed">{hero.text}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#ozellikler" className={primary}>{hero.cta} <ArrowRight className="w-4 h-4" /></a>
          <a href="#iletisim" className="inline-flex rounded-full border border-[var(--d-border)] px-6 py-3 font-semibold">{hero.cta2}</a>
        </div>
      </div>
      <Image src={hero.image} className="w-full aspect-[4/3] rounded-3xl border border-[var(--d-border)]" />
    </section>
  );
}