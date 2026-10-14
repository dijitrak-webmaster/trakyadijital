import React from 'react';
import { Link } from 'react-router-dom';

const KIND = {
  lead: { dot: 'bg-mint', label: 'Talep' },
  order: { dot: 'bg-sun', label: 'Sipariş' },
  revision: { dot: 'bg-coral', label: 'Revizyon' },
  sub: { dot: 'bg-fog', label: 'Abonelik' },
};

const ts = (d) => new Date(d || 0).getTime();
const fmtAgo = (d) => {
  const mins = Math.floor((Date.now() - ts(d)) / 60000);
  if (mins < 1) return 'şimdi';
  if (mins < 60) return `${mins} dk önce`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
};

/** Genel bakış panosundaki birleşik aktivite akışı: talep, sipariş, revizyon, abonelik */
export default function DashActivity({ items }) {
  return (
    <div className="border border-border rounded-2xl bg-card/50 overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <p className="font-mono text-xs uppercase text-mint">Son hareketler</p>
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 && (
          <p className="px-5 py-10 text-center font-mono text-xs text-muted-foreground">Henüz hareket yok.</p>
        )}
        {items.map((it, i) => {
          const k = KIND[it.kind] || KIND.lead;
          return (
            <Link
              key={`${it.kind}-${i}-${it.date}`}
              to={it.to}
              className="flex items-start gap-3 px-5 py-3 hover:bg-card transition-colors"
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${k.dot}`} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-sm truncate">{it.title}</span>
                {it.sub && <span className="block font-mono text-[11px] text-muted-foreground truncate mt-0.5">{it.sub}</span>}
              </span>
              <span className="font-mono text-[10px] text-foreground/40 shrink-0">{fmtAgo(it.date)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}