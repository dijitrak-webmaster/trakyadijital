import React, { useState } from 'react';
import useSeo from '@/hooks/useSeo';
import RadarForm, { RadarTechCard } from '@/components/radar/RadarForm';
import RadarChecklist from '@/components/radar/RadarChecklist';
import RadarReport from '@/components/radar/RadarReport';
import RadarAgencies from '@/components/radar/RadarAgencies';

// Rakip Radarı — canlı erişim ölçümü + özellik karşılaştırması
export default function RadarPage() {
  const [probe, setProbe] = useState(null);
  const [marks, setMarks] = useState({});
  useSeo({
    title: 'Rakip Radarı — Rakibinizi 2 Dakikada Analiz Edin | Dijitrak',
    description: 'Rakibinizin sitesini ölçün, özellik bazında karşılaştırın ve açık verdiğiniz alanları görün — ücretsiz ve kayıtsız.',
    path: '/rakip-radar',
  });

  const toggle = (feature, who) =>
    setMarks((m) => ({ ...m, [feature]: { ...m[feature], [who]: !m[feature]?.[who] } }));

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-36 md:pt-44 pb-24">
      <header className="mb-8">
        <p className="font-mono text-xs tracking-[0.22em] text-coral">// ÜCRETSİZ ARAÇ</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">Rakip <span className="text-mint">Radarı</span></h1>
        <p className="text-sm text-foreground/70 mt-2 max-w-xl">
          Rakibinizin sitesini ölçün, özellik bazında kendinizle karşılaştırın. Açık verdiğiniz alanları net görün — ardından DijiBot ile kapatın.
        </p>
      </header>
      <div className="rounded-3xl border-2 border-border bg-card p-5 md:p-8 shadow-sticker">
        <RadarForm onResult={setProbe} />
        {probe && <RadarTechCard probe={probe} onReset={() => { setProbe(null); setMarks({}); }} />}
        <RadarChecklist marks={marks} onToggle={toggle} />
        <RadarReport marks={marks} />
      </div>
      <RadarAgencies />
    </div>
  );
}