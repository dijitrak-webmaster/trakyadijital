import React from 'react';

const CARDS = [
  { key: 'total', label: 'Toplam Proje', accent: 'border-border' },
  { key: 'active', label: 'Aktif', accent: 'border-mint/50' },
  { key: 'launched', label: 'Yayında', accent: 'border-sun/50' },
  { key: 'avg', label: 'Ort. Tamamlanma', accent: 'border-coral/50' },
];

/** Müşteriler bölümü için genel bakış paneli: KPI kartları ve durum dağılımı. */
export default function ClientStatsPanel({ items }) {
  const total = items.length;
  const byStatus = (vals) => items.filter((i) => vals.includes(i.status)).length;
  const avg = total ? Math.round(items.reduce((s, i) => s + (i.progress || 0), 0) / total) : 0;
  const values = { total, active: byStatus(['in_progress', 'review']), launched: byStatus(['launched']), avg: `${avg}%` };
  const dist = [
    { label: 'Planlamada', n: byStatus(['planned']), cls: 'bg-fog' },
    { label: 'Devam ediyor', n: byStatus(['in_progress']), cls: 'bg-mint' },
    { label: 'İncelemede', n: byStatus(['review']), cls: 'bg-sun' },
    { label: 'Yayında', n: byStatus(['launched']), cls: 'bg-coral' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((c) => (
          <div key={c.key} className={`border ${c.accent} rounded-2xl bg-card p-4`}>
            <p className="font-mono text-xs uppercase text-muted-foreground">{c.label}</p>
            <p className="font-display text-3xl font-semibold mt-1">{values[c.key]}</p>
          </div>
        ))}
      </div>
      <div className="border border-border rounded-2xl bg-card p-4 flex flex-col justify-center gap-3">
        {dist.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${d.cls} shrink-0`} />
            <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full ${d.cls} rounded-full`} style={{ width: total ? `${(d.n / total) * 100}%` : 0 }} />
            </div>
            <span className="font-mono text-xs text-muted-foreground w-28">{d.label} · {d.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}