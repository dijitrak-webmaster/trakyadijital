import React from 'react';
import { format } from 'date-fns';
import { STATUS, TYPE } from '@/components/admin/leadMeta';

export default function LeadTable({ leads, onStatus, onOpen }) {
  if (!leads.length) return <div className="border border-border p-12 text-center font-mono text-sm text-muted-foreground">Henüz talep yok.</div>;
  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full text-sm font-mono">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr className="border-b border-border">
            {['Tarih', 'Teklif No', 'Kişi / Firma', 'İletişim', 'Tip', 'Hizmet · Sektör', 'Tahmin / Randevu', 'Görüntüleme', 'Durum'].map((h) => <th key={h} className="text-left font-medium p-3 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} onClick={() => onOpen(l)} className="border-b border-border last:border-0 hover:bg-card cursor-pointer">
              <td className="p-3 whitespace-nowrap">{format(new Date(l.created_date), 'dd.MM.yy HH:mm')}</td>
              <td className="p-3 whitespace-nowrap text-xs">{l.quote_no || '—'}</td>
              <td className="p-3"><div className="font-body font-semibold">{l.name}</div><div className="text-xs text-muted-foreground">{l.company || '—'}</div></td>
              <td className="p-3 whitespace-nowrap"><div>{l.phone || '—'}</div><div className="text-xs text-muted-foreground">{l.email || ''}</div></td>
              <td className="p-3">{TYPE[l.type] || '—'}</td>
              <td className="p-3">{[l.service, l.sector].filter(Boolean).join(' · ') || '—'}</td>
              <td className="p-3 whitespace-nowrap">{l.appointment_date ? `${l.appointment_date} ${l.appointment_time || ''}` : l.estimate || '—'}</td>
              <td className="p-3 whitespace-nowrap">
                {l.quote_open_count ? (
                  <span className="text-mint font-semibold">{l.quote_open_count}×{l.quote_last_open_at ? <span className="text-xs text-muted-foreground"> · {format(new Date(l.quote_last_open_at), 'dd.MM HH:mm')}</span> : null}</span>
                ) : '—'}
              </td>
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <select value={l.status || 'new'} onChange={(e) => onStatus(l.id, e.target.value)} className={`rounded-full px-3 py-1 text-xs font-semibold outline-none ${STATUS[l.status || 'new'].cls}`}>
                  {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}