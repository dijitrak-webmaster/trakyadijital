import React from 'react';
import { Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/site/Reveal';
import StarRating from '@/components/market/StarRating';

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Paketleri yan yana karşılaştıran tablo — özellik satırları işaretli. */
export default function CompareTable({ items = [] }) {
  const packs = items.filter((i) => i.category === 'paket');
  if (packs.length < 2) return null;
  const features = Array.from(new Set(packs.flatMap((p) => (p.features || '').split(',').map((f) => f.trim()).filter(Boolean))));

  return (
    <section id="karsilastirma" className="max-w-7xl mx-auto px-5 md:px-6 mt-20 scroll-mt-24">
      <div className="flex items-end justify-between gap-4 pb-5">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">
          Paketleri <span className="text-mint">Karşılaştır</span>
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{packs.length} paket · yan yana</span>
      </div>
      <Reveal>
        <div className="rounded-3xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-5 py-4">Paket</th>
                {packs.map((p) => (
                  <th key={p.id} className="px-5 py-4 text-left">
                    <Link to={`/market/${p.slug || p.id}`} className="inline-block rounded-full bg-sun text-ink px-3 py-1 font-display text-sm font-bold hover:shadow-sticker transition-shadow">{p.title}</Link>
                    {p.rating ? <div className="mt-1.5"><StarRating rating={p.rating} count={p.rating_count} /></div> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-5 py-3 text-muted-foreground">Fiyat</td>
                {packs.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-display text-lg font-bold">
                    {fmt(p.price)} ₺{p.billing === 'monthly' && <span className="font-body text-xs text-muted-foreground"> /ay</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3 text-muted-foreground">Ödeme</td>
                {packs.map((p) => (
                  <td key={p.id} className="px-5 py-3">{p.billing === 'monthly' ? 'Aylık abonelik' : 'Tek seferlik'}</td>
                ))}
              </tr>
              {features.map((f) => (
                <tr key={f}>
                  <td className="px-5 py-3 text-muted-foreground">{f}</td>
                  {packs.map((p) => {
                    const has = (p.features || '').split(',').map((x) => x.trim()).includes(f);
                    return (
                      <td key={p.id} className="px-5 py-3">
                        {has ? <Check className="w-4 h-4 text-mint" /> : <Minus className="w-4 h-4 text-foreground/25" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="px-5 py-4" />
                {packs.map((p) => (
                  <td key={p.id} className="px-5 py-4">
                    <Link to={`/market/${p.slug || p.id}`} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-mint/50 hover:text-mint transition-colors">İncele</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}