import React from 'react';
import { MapPin, Check, X, Zap } from 'lucide-react';
import { TRAKYA_AGENCIES, DIJITRAK_EDGE } from '@/lib/trakyaCompetitors';
import Reveal from '@/components/site/Reveal';

const threatCls = {
  yüksek: 'bg-coral/15 text-coral border-coral/40',
  orta: 'bg-sun/15 text-sun border-sun/40',
  düşük: 'bg-mint/15 text-mint border-mint/40',
};

export default function RadarAgencies() {
  return (
    <div className="mt-12">
      <header>
        <p className="font-mono text-xs tracking-[0.22em] text-sun">// BÖLGESEL KARŞILAŞTIRMA</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-2">Trakya Ajans Radarı</h2>
        <p className="text-sm text-foreground/70 mt-2 max-w-xl">
          Edirne, Çorlu/Tekirdağ ve Kırklareli hattındaki ajansların Ekim 2026 site taraması.
          Dijitrak'ı rakiplerine karşı konumlandırmak için tasarlandı — rakip firmaların kendi analizi için yukarıdaki radarı kullanın.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {TRAKYA_AGENCIES.map((a, i) => (
          <Reveal key={a.site} delay={i * 0.04}>
            <div className="bg-card rounded-3xl border border-border p-5 h-full flex flex-col hover:border-mint/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-lg leading-tight">{a.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1 break-all">{a.site}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${threatCls[a.threat]}`}>
                  {a.threat} tehdit
                </span>
              </div>
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-mint mt-3">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {a.city}
              </p>
              <p className="text-sm text-foreground/70 mt-1.5">{a.focus}</p>
              <ul className="mt-4 space-y-1.5">
                {a.strong.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs text-foreground/75">
                    <Check className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
                {a.weak.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs text-foreground/60">
                    <X className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <div className="rounded-3xl border-2 border-mint/40 bg-card p-6 md:p-8">
          <h3 className="font-display font-semibold text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-mint" /> Dijitrak'ın eşsiz kombinasyonu
          </h3>
          <p className="text-sm text-foreground/70 mt-2">
            Bu yedi kombinin tamamını bölgede tek bir ajans bile sunmuyor:
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {DIJITRAK_EDGE.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-foreground/80">
                <Check className="w-4 h-4 text-mint shrink-0 mt-0.5" /> {e}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}