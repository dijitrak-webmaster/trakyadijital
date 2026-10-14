import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';
import { Image } from '@/components/ui/image';
import { formatPrice, itemHref } from '@/lib/marketUtils';

const PAIR = {
  tema: ['eklenti', 'nfckart'],
  paket: ['tema', 'eklenti'],
  nfckart: ['tema', 'eklenti'],
  eklenti: ['tema', 'paket'],
};

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Detay sayfası çapraz satış: tamamlayıcı kategorilerden öneriler + toplu sepete ekleme. */
export default function BuyTogether({ item }) {
  const { add, items: cart } = useCart();
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    let on = true;
    const cats = PAIR[item.category] || ['tema'];
    Promise.all(cats.map((c) => base44.entities.MarketItem.filter({ category: c, status: 'published' }, '-created_date', 3).catch(() => [])))
      .then((res) => {
        if (on) setPicks(res.flat().slice(0, 2));
      });
    return () => { on = false; };
  }, [item.id, item.category]);

  if (!picks.length) return null;

  const all = [item, ...picks];
  const allIn = all.every((p) => cart.some((c) => c.id === p.id));
  const total = all.reduce((s, p) => s + (p.price || 0), 0);

  const addAll = () => {
    all.filter((p) => !cart.some((c) => c.id === p.id)).forEach((p) => add(p));
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <h2 className="font-display text-lg font-semibold">Bu ürünle birlikte <span className="text-mint">alınanlar</span></h2>
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        {picks.map((p) => (
          <Link key={p.id} to={itemHref(p)} className="group flex items-center gap-2.5 rounded-2xl border border-border bg-secondary/40 p-2.5 hover:border-mint/50 transition-colors">
            <div className="w-14 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
              {p.image_url ? <Image src={p.image_url} className="w-full h-full" /> : <div className={`w-full h-full ${p.color || 'bg-mint'} opacity-50`} />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate max-w-[140px] group-hover:text-mint transition-colors">{p.title}</p>
              <p className="font-mono text-xs text-muted-foreground">{formatPrice(p.price)}</p>
            </div>
          </Link>
        ))}
        <button
          onClick={addAll}
          disabled={allIn}
          className={`ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${allIn ? 'bg-secondary text-muted-foreground' : 'bg-coral text-ink border-2 border-ink/20 hover:shadow-sticker hover:-translate-y-0.5'}`}
        >
          {allIn ? <><Check className="w-4 h-4" /> Hepsi sepette</> : <><Plus className="w-4 h-4" /> Hepsini Ekle — {fmt(total)} ₺</>}
        </button>
      </div>
    </div>
  );
}