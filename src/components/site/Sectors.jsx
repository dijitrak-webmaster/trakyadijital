import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sectors } from '@/lib/siteData';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

// kompakt sektör şeridi: kart duvarı yerine tek sıralık, oyuncak çipler
export default function Sectors() {
  const { tl } = useLanguage();
  return (
    <section id="sektorler" className="scroll-mt-28">
      <Reveal className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-center lg:text-left">
        <p className="font-mono text-xs text-sun">{tl('// SEKTÖREL ÇÖZÜMLER')}</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl">{tl('Her sektöre özel çözüm')}</h2>
      </Reveal>
      <div className="mt-5 flex flex-wrap gap-2 justify-center lg:justify-start">
        {sectors.map((s) => (
          <Link
            key={s.slug}
            to={`/sektor/${s.slug}`}
            className={`group inline-flex items-center gap-2 rounded-full ${s.color} text-ink border-2 border-ink px-4 py-2 text-sm font-semibold hover:-rotate-2 hover:-translate-y-0.5 transition-transform`}
          >
            <s.icon className="w-4 h-4" strokeWidth={1.8} />
            {tl(s.name)}
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}