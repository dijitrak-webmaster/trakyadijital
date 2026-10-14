import React from 'react';
import { STATUS } from '@/components/admin/leadMeta';

export default function LeadStats({ leads, filter, onFilter }) {
  const items = [{ key: 'all', label: 'Tümü', count: leads.length }, ...Object.entries(STATUS).map(([key, s]) => ({ key, label: s.label, count: leads.filter((l) => (l.status || 'new') === key).length }))];
  // 3+ gündür "yeni" durumunda bekleyen talepler — takip uyarısı
  const stale = leads.filter((l) => (l.status || 'new') === 'new' && Date.now() - new Date(l.created_date).getTime() > 3 * 86400000).length;
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 border border-border rounded-2xl bg-card/50 overflow-hidden">
      {items.map((it) => (
        <button key={it.key} onClick={() => onFilter(it.key)} className={`text-left p-4 border-border border-r border-b md:border-b-0 transition-colors ${filter === it.key ? 'bg-mint text-ink' : 'hover:bg-card'}`}>
          <div className="font-mono text-xs uppercase opacity-70">{it.label}</div>
          <div className="font-display text-3xl font-semibold mt-1">{it.count}</div>
        </button>
      ))}
      <div className={`p-4 border-border border-r border-b md:border-b-0 ${stale > 0 ? 'bg-coral/10' : ''}`}>
        <div className="font-mono text-xs uppercase text-coral">3+ gün yeni</div>
        <div className="font-display text-3xl font-semibold mt-1">{stale}</div>
      </div>
    </div>
  );
}