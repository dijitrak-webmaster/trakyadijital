import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, MousePointerClick } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import Reveal from '@/components/site/Reveal';
import TrakyaMap from '@/components/map/TrakyaMap';
import AiRegionInsight from '@/components/map/AiRegionInsight';
import { scoreColor, provinceAverages } from '@/lib/trakyaMapData';
import useDistrictScores from '@/hooks/useDistrictScores';
import { INDEX_NOTE } from '@/lib/trakyaIndexData';

// Trakya Dijital Haritası — interaktif bölge haritası
export default function DigitalMapPage() {
  const mapDistricts = useDistrictScores();
  const ranked = [...mapDistricts].sort((a, b) => b.score - a.score);
  const averages = provinceAverages(mapDistricts);

  useSeo({
    title: 'Trakya Dijital Haritası — İlçe İlçe Dijital Olgunluk | Dijitrak',
    description: 'Edirne\'den Çerkezköy\'e Trakya\'nın 10 ilçesinin dijital olgunluk skorlarını interaktif haritada görün; ilçenize tıklayın, o bölgeye özel hizmet sayfasına ulaşın.',
    path: '/dijital-harita',
  });

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-6 pt-36 md:pt-44 pb-24 space-y-10">
      <header>
        <p className="font-mono text-xs tracking-[0.22em] text-mint">// İNTERAKTİF HARİTA</p>
        <h1 className="font-display font-bold text-3xl md:text-5xl mt-2">Trakya <span className="text-mint">Dijital Haritası</span></h1>
        <p className="text-sm md:text-base text-foreground/70 mt-3 max-w-2xl leading-relaxed">
          Edirne, Kırklareli ve Tekirdağ illerindeki 10 ilçenin dijital olgunluk endeksi, gerçek coğrafi konumlarıyla haritada. Bir düğüme tıklayarak o bölgeye özel hizmet sayfasına gidebilirsiniz.
        </p>
      </header>

      {/* özet göstergeler */}
      <Reveal>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { label: 'Bölge ortalaması', value: Math.round(mapDistricts.reduce((a, d) => a + d.score, 0) / mapDistricts.length), sub: '10 ilçe · 0–100' },
            { label: 'En yüksek', value: ranked[0]?.score, sub: ranked[0]?.name },
            { label: 'En düşük', value: ranked[ranked.length - 1]?.score, sub: ranked[ranked.length - 1]?.name },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-border bg-card p-4 md:p-5 text-center">
              <p className="font-mono text-[10px] md:text-[11px] tracking-widest text-muted-foreground uppercase">{k.label}</p>
              <p className="font-display font-bold text-3xl md:text-4xl mt-1.5" style={{ color: scoreColor(k.value) }}>{k.value}</p>
              <p className="text-[11px] md:text-xs text-foreground/60 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="relative">
          <TrakyaMap />
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3 font-mono">
            <MousePointerClick className="w-3.5 h-3.5" /> İlçelere tıklayın — renk skoru gösterir · 0–100
          </p>
        </div>
      </Reveal>

      {/* gösterge + il ortalamaları */}
      <Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Map className="w-5 h-5 text-mint" /> Skor gösterge</h2>
            <div className="space-y-2.5 mt-4">
              {[
                { c: 'hsl(var(--mint))', t: '55+ — dijitalde önde' },
                { c: 'hsl(var(--sun))', t: '45–54 — gelişiyor' },
                { c: 'hsl(var(--coral))', t: '45 altı — büyük fırsat alanı' },
              ].map((l) => (
                <div key={l.t} className="flex items-center gap-2.5 text-sm text-foreground/75">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: l.c }} /> {l.t}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold text-lg">İl ortalamaları</h2>
            <div className="space-y-3.5 mt-4">
              {averages.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm font-semibold">{p.name}</span>
                  <div className="flex-1 h-4 rounded-full bg-terminal overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: scoreColor(p.score) }} />
                  </div>
                  <span className="font-mono text-sm w-9 text-right" style={{ color: scoreColor(p.score) }}>{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* sıralama listesi */}
      <Reveal>
        <h2 className="font-display text-2xl font-semibold">İlçe sıralaması</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {ranked.map((d, i) => (
            <Link
              key={d.slug}
              to={`/konum/${d.slug}`}
              className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4 hover:border-mint/60 transition-colors group"
            >
              <span className="font-mono text-xs text-muted-foreground w-5">{i + 1}.</span>
              <span className="w-11 h-11 rounded-full shrink-0 grid place-items-center font-mono font-bold text-sm border-2" style={{ borderColor: scoreColor(d.score), color: scoreColor(d.score) }}>
                {d.score}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold truncate">{d.name}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{d.province} ili</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-mint group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <AiRegionInsight districts={mapDistricts} />
      </Reveal>

      <Reveal>
        <div className="rounded-3xl border-2 border-dashed border-mint/40 bg-card p-6 flex flex-col sm:flex-row items-center gap-4">
          <p className="flex-1 text-sm text-foreground/75">
            İşletmeniz haritada nerede? <Link to="/olgunluk-testi" className="text-mint font-semibold hover:underline">Dijital Olgunluk Testi</Link> ile bölge ortalamasını kendi skorunuzla karşılaştırın.
          </p>
          <Link to="/olgunluk-testi" className="rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all">
            Testi Çöz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

      <p className="text-[11px] text-foreground/45 leading-relaxed border-t border-border pt-4">{INDEX_NOTE}</p>
    </div>
  );
}