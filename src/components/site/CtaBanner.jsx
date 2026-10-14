import React from 'react';
import { ArrowRight, Bot, Tractor, Flower2 } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import Sticker from '@/components/site/Sticker';
import Reveal from '@/components/site/Reveal';

export default function CtaBanner() {
  const { openAssistant } = useAssistant();
  const { tl } = useLanguage();

  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl bg-mint text-ink border-2 border-ink shadow-sticker px-6 py-14 md:py-20 text-center">
        <Sticker icon={Tractor} tile="bg-sun" size="md" rotate={-10} delay={0.1} className="hidden md:block left-[4%] top-8" />
        <Sticker icon={Flower2} tile="bg-coral" size="md" rotate={12} delay={0.25} className="hidden md:block right-[4%] bottom-8" />
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <p className="font-mono text-xs font-semibold">{tl('// HAZIR MISINIZ')}</p>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-6xl leading-tight">{tl('Projenizi konuşalım, birlikte büyütelim')}</h2>
          <p className="mt-4 text-lg font-medium text-ink/75">{tl('İlk görüşme ücretsiz. 24 saat içinde size özel yol haritasıyla dönüyoruz.')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => openAssistant({ intent: 'quote' })} className="group inline-flex items-center gap-2 rounded-full bg-ink text-foreground font-semibold px-7 py-3 hover:-translate-y-0.5 transition-all">
              {tl('Hemen Teklif Al')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => openAssistant()} className="inline-flex items-center gap-2 rounded-full border-2 border-ink font-semibold px-7 py-2.5 hover:bg-sun transition-colors">
              <Bot className="w-4 h-4" /> {tl('AI Danışmana Sor')}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}