import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { provinceAverages } from '@/lib/trakyaMapData';

// Dijital harita sayfası için AI bölge analizi kutusu — analizi DijiBot'a
// (sitewide asistan akışı) bağlar; soru, ilçe skorlarıyla birlikte panele gider.
export default function AiRegionInsight({ districts }) {
  const { openAssistant } = useAssistant();
  const avg = provinceAverages(districts);
  const top = [...districts].sort((a, b) => b.score - a.score)[0];

  const ask = () => {
    const lines = districts.map((d) => `${d.name} ${d.score}`).join(', ');
    const provs = avg.map((p) => `${p.name} ${p.score}`).join(', ');
    openAssistant({
      text: `Trakya dijital haritasını analiz et — ilçe skorları: ${lines}. İl ortalamaları: ${provs}. En önde ${top?.name} var. Bu tabloyu yorumla ve işletmelere hangi adımları önerirsin?`,
    });
  };

  return (
    <div className="rounded-3xl border border-mint/40 bg-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-mint" /> DijiBot bölge analizi
        </h2>
        <p className="text-sm text-foreground/70 mt-1.5 leading-relaxed">
          Haritadaki ilçe skorlarını DijiBot'a sorun: bölgenin dijital tablosunu yorumlayıp işletmenize özel adımları sohbette yazsın.
        </p>
      </div>
      <button
        onClick={ask}
        className="shrink-0 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:-translate-y-0.5 hover:shadow-sticker transition-all"
      >
        <MessageCircle className="w-4 h-4" /> DijiBot'a sor
      </button>
    </div>
  );
}