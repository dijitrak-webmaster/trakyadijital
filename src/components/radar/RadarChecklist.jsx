import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { RADAR_FEATURES } from '@/lib/radarData';

const Chip = ({ on, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${on ? 'bg-mint text-ink border-mint shadow-sticker' : 'bg-terminal border-border text-muted-foreground hover:border-mint/60'}`}
  >
    {label}
  </button>
);

// rakip ve kendi sitenizi özellik bazında işaretleyeceğiniz karşılaştırma listesi
export default function RadarChecklist({ marks, onToggle }) {
  const { tl } = useLanguage();
  return (
    <div className="mt-8">
      <h2 className="font-display font-bold text-xl">{tl('Özellik Karşılaştırması')}</h2>
      <p className="text-xs text-foreground/60 mt-1">{tl('İki siteye de hızlıca bakın ve gördüklerinizi işaretleyin.')}</p>
      <div className="mt-4 space-y-2.5">
        {RADAR_FEATURES.map((f) => (
          <div key={f} className="rounded-2xl border border-border bg-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-sm font-semibold">{tl(f)}</span>
            <div className="flex gap-2">
              <Chip on={!!marks[f]?.competitor} label={tl('Rakibimde')} onClick={() => onToggle(f, 'competitor')} />
              <Chip on={!!marks[f]?.self} label={tl('Bizde')} onClick={() => onToggle(f, 'self')} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}