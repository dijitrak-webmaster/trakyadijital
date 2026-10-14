import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import Reveal from '@/components/site/Reveal';
import { SectorChart, TrendChart } from '@/components/index/IndexCharts';
import { cityScores, highlights, INDEX_NOTE } from '@/lib/trakyaIndexData';

// Trakya Dijital Endeksi — bölgenin dijital adaptasyon panosu
export default function TrakyaIndexPage() {
  useSeo({
    title: 'Trakya Dijital Endeksi — Bölgenin Dijital Adaptasyon Haritası | Dijitrak',
    description: 'Tarımdan turizme Trakya\'nın dijital adaptasyon skorları, il karşılaştırmaları ve çeyreklik eğilimler — Dijitrak gözlemiyle.',
    path: '/trakya-endeks',
  });

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-6 pt-36 md:pt-44 pb-24 space-y-8">
      <header>
        <p className="font-mono text-xs tracking-[0.22em] text-mint">// BÖLGE PANOSU</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">Trakya Dijital <span className="text-mint">Endeksi</span></h1>
        <p className="text-sm text-foreground/70 mt-2 max-w-2xl">
          Bölgedeki sektörlerin dijital dünyaya ne kadar uyum sağladığını tek panoda topladık. Nerede fırsat var, nerede rekabet henüz dijitalde sertleşmedi — hepsi burada.
        </p>
      </header>

      <Reveal className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-lg mb-3">Sektörel Adaptasyon <span className="text-muted-foreground text-xs font-body font-normal">(0–100)</span></h2>
          <SectorChart />
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-lg mb-3">Endeks Eğilimi <span className="text-muted-foreground text-xs font-body font-normal">(2024–2026)</span></h2>
          <TrendChart />
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center justify-between">
            İllere Göre Karşılaştırma
            <Link to="/dijital-harita" className="rounded-full border border-mint/50 text-mint font-mono text-[11px] px-3 py-1.5 hover:bg-mint hover:text-ink transition-colors">→ interaktif harita</Link>
          </h2>
          <div className="space-y-3.5">
            {cityScores.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 inline-flex items-center gap-1 text-sm font-semibold"><MapPin className="w-3.5 h-3.5 text-mint" /> {c.name}</span>
                <div className="flex-1 h-4 rounded-full bg-terminal overflow-hidden">
                  <div className="h-full rounded-full bg-mint" style={{ width: `${c.score}%` }} />
                </div>
                <span className="font-mono text-sm text-mint w-9 text-right">{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <div key={h.title} className="rounded-3xl border border-border bg-card p-5">
              <span className="font-mono text-[10px] text-sun">{`BULGU ${i + 1}`}</span>
              <h3 className="font-display font-semibold mt-1.5">{h.title}</h3>
              <p className="text-sm text-foreground/70 mt-1.5">{h.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-3xl border-2 border-dashed border-mint/40 bg-card p-5 flex flex-col sm:flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-mint shrink-0" />
          <p className="flex-1 text-sm text-foreground/75">
            <Link to="/olgunluk-testi" className="text-mint font-semibold hover:underline">Dijital Olgunluk Testi</Link> ile işletmenizin bu endekse göre nerede durduğunu 2 dakikada ölçün.
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