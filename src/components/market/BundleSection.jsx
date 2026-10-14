import React from 'react';
import { Check, Plus } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Reveal from '@/components/site/Reveal';

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Bundle paketler vitrini — eğik sticker kartlar, içerik parçacıkları ve sepete ekleme. */
export default function BundleSection({ bundles = [], items = [] }) {
  const { add, items: cart } = useCart();
  if (!bundles.length) return null;

  const titleOf = (id) => items.find((i) => i.id === id)?.title;

  return (
    <section id="bundleler" className="max-w-7xl mx-auto px-5 md:px-6 mt-20 scroll-mt-24">
      <div className="flex items-end justify-between gap-4 pb-5">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">
          Bundle <span className="text-sun">Paketler</span>
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{bundles.length} kombin paketi</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b, i) => {
          const bid = `bundle-${b.slug || b.id}`;
          const inCart = cart.some((x) => x.id === bid);
          const parts = (b.item_ids || '').split(',').map((s) => s.trim()).filter(Boolean).map(titleOf).filter(Boolean);
          return (
            <Reveal key={b.id} delay={i * 0.06}>
              <div className={`h-full flex flex-col gap-3 rounded-3xl border-2 border-ink bg-sun text-ink p-6 shadow-sticker ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:rotate-0 transition-transform`}>
                <div className="flex items-center justify-between">
                  {b.badge ? <span className="-rotate-2 rounded-full bg-ink text-foreground px-3 py-1 font-mono text-[10px] font-bold">{b.badge}</span> : <span />}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink/60">Bundle</span>
                </div>
                <h3 className="font-display text-xl font-bold">{b.title}</h3>
                {b.description && <p className="text-sm text-ink/75 leading-relaxed">{b.description}</p>}
                {parts.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {parts.map((p) => (
                      <li key={p} className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-semibold">{p}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center justify-between pt-3 border-t-2 border-dashed border-ink/30">
                  <span className="font-display text-2xl font-bold">{fmt(b.price)} ₺</span>
                  <button
                    onClick={() => !inCart && add({ id: bid, title: `${b.title} (Bundle)`, price: b.price, category: 'paket', billing: 'one_time' })}
                    disabled={inCart}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border-2 border-ink transition-all ${inCart ? 'bg-ink/20 text-ink/60' : 'bg-ink text-foreground hover:shadow-sticker'}`}
                  >
                    {inCart ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Sepete Ekle</>}
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}