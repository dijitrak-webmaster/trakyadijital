import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { formatPrice, itemHref } from '@/lib/marketUtils';

export default function RelatedList({ item }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let on = true;
    base44.entities.MarketItem.filter({ category: item.category, status: 'published' }, '-created_date', 6)
      .then((r) => { if (on) setList(r.filter((x) => x.id !== item.id).slice(0, 4)); })
      .catch(() => {});
    return () => { on = false; };
  }, [item.id, item.category]);

  if (!list.length) return null;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <h2 className="font-display text-lg font-semibold">Benzer ürünler</h2>
      <div className="mt-4 space-y-3">
        {list.map((r) => (
          <Link key={r.id} to={itemHref(r)} className="group flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-2.5 hover:border-mint/50 transition-colors">
            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-border">
              {r.image_url ? <Image src={r.image_url} className="w-full h-full" /> : <div className={`w-full h-full ${r.color || 'bg-mint'} opacity-50`} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate group-hover:text-mint transition-colors">{r.title}</p>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">{formatPrice(r.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}