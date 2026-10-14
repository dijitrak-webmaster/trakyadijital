import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import popConfetti from '@/lib/popConfetti';

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Ürünlerin altındaki bilet/kapon stili kampanyalar bölümü. */
export default function CampaignsSection({ campaigns = [] }) {
  const [copied, setCopied] = useState('');
  if (!campaigns.length) return null;

  const copy = (code, e) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    popConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    setTimeout(() => setCopied(''), 2000);
  };

  const [first, ...rest] = campaigns;

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-6 mt-20">
      <div className="flex items-end justify-between gap-4 pb-5">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">
          Güncel <span className="text-coral">Kampanyalar</span>
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{campaigns.length} aktif fırsat</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* ana kupon — bilet görünümü */}
        <Reveal className="md:col-span-2">
          <div className="relative h-full rounded-3xl border-2 border-ink bg-coral text-ink shadow-sticker overflow-hidden">
            {/* bilet yırtık delikleri */}
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
            <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
            <span className="absolute top-4 bottom-4 left-1/2 border-l-2 border-dashed border-ink/40" />

            <div className="flex flex-col sm:flex-row items-center h-full">
              <div className="flex-1 p-7 flex flex-col items-center justify-center gap-1 text-center sm:text-left sm:items-start">
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-ink/60">SÜPER FIRSAT</span>
                <span className="font-display text-5xl md:text-6xl font-bold leading-none">
                  {first.discount_type === 'fixed' ? `${fmt(first.discount_value)} ₺` : `%${first.discount_value}`}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-ink/60">İNDİRİM</span>
              </div>
              <div className="flex-1 p-7 flex flex-col gap-2.5">
                <h3 className="font-display text-xl font-bold">{first.title}</h3>
                {first.description && <p className="text-sm text-ink/75 leading-relaxed">{first.description}</p>}
                <div className="mt-auto flex items-center gap-3 flex-wrap">
                  <button
                    onClick={(e) => copy(first.code, e)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink text-foreground px-5 py-2.5 font-mono text-sm font-bold tracking-widest hover:shadow-sticker transition-shadow"
                  >
                    {copied === first.code ? <><Check className="w-4 h-4 text-mint" /> KOPYALANDI</> : <><Copy className="w-4 h-4" /> {first.code}</>}
                  </button>
                  {first.valid_until && (
                    <span className="font-mono text-[10px] text-ink/60">{new Date(first.valid_until).toLocaleDateString('tr-TR')} tarihine kadar</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* diğer kampanyalar */}
        {rest.map((c, i) => (
          <Reveal key={c.id} delay={0.08 * (i + 1)}>
            <div className="h-full rounded-3xl border border-border bg-card p-6 flex flex-col gap-2.5 hover:-translate-y-1 hover:shadow-sticker transition-all">
              <span className="font-display text-3xl font-bold text-coral leading-none">
                {c.discount_type === 'fixed' ? `${fmt(c.discount_value)} ₺` : `%${c.discount_value}`}
              </span>
              <h3 className="font-display text-base font-semibold">{c.title}</h3>
              {c.description && <p className="text-sm text-foreground/60 leading-relaxed">{c.description}</p>}
              <button
                onClick={(e) => copy(c.code, e)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs font-bold tracking-widest hover:border-coral/60 hover:text-coral transition-colors"
              >
                {copied === c.code ? <><Check className="w-3.5 h-3.5 text-mint" /> Kopyalandı</> : <><Copy className="w-3.5 h-3.5" /> {c.code}</>}
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}