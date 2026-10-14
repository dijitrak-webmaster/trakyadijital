import React from 'react';

/** Genel bakış panosunun KPI kartları */
export default function DashKpis({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((it) => (
        <div key={it.label} className="border border-border rounded-2xl p-4 bg-card/50">
          <div className="font-mono text-[10px] uppercase text-muted-foreground">{it.label}</div>
          <div className="font-display text-3xl font-semibold mt-1">{it.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}