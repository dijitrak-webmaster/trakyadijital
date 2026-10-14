import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Phone } from 'lucide-react';
import { TYPE } from '@/components/admin/leadMeta';

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/** Yönetim paneli için aylık randevu takvimi — solda ay ızgarası, sağda seçili günün randevuları. */
export default function AppointmentCalendar({ leads }) {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(null);

  const appts = useMemo(() => leads.filter((l) => l.appointment_date), [leads]);

  const byDay = useMemo(() => {
    const map = {};
    appts.forEach((l) => {
      const key = (l.appointment_date || '').slice(0, 10);
      if (key) (map[key] = map[key] || []).push(l);
    });
    return map;
  }, [appts]);

  const view = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + offset);
    return d;
  }, [offset]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const isoOf = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayIso = new Date().toISOString().slice(0, 10);

  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const selectedList = selected
    ? [...(byDay[selected] || [])].sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''))
    : [];

  return (
    <div className="grid lg:grid-cols-[1fr,320px] gap-6">
      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold capitalize">
            {view.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setOffset((o) => o - 1)} className="p-2 rounded-xl border border-border hover:border-mint/50 hover:text-mint transition-colors" aria-label="Önceki ay">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => { setOffset(0); setSelected(null); }} className="px-3 py-2 rounded-xl border border-border font-mono text-xs hover:border-mint/50 hover:text-mint transition-colors">BUGÜN</button>
            <button onClick={() => setOffset((o) => o + 1)} className="p-2 rounded-xl border border-border hover:border-mint/50 hover:text-mint transition-colors" aria-label="Sonraki ay">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-center font-mono text-[10px] uppercase text-muted-foreground">{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((d, i) => {
            if (!d) return <span key={`empty-${i}`} />;
            const iso = isoOf(d);
            const list = byDay[iso] || [];
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className={`aspect-square rounded-xl border p-1.5 flex flex-col items-center justify-center transition-colors ${
                  selected === iso
                    ? 'border-mint bg-mint/15 text-mint'
                    : iso === todayIso
                      ? 'border-mint/50 text-mint'
                      : 'border-border text-foreground/45 hover:border-mint/40'
                } ${list.length ? 'font-semibold !text-current' : ''}`}
              >
                <span className="text-sm leading-none">{d}</span>
                {list.length > 0 && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-coral" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-border p-5">
        <h3 className="font-mono text-xs uppercase text-muted-foreground">
          {selected
            ? new Date(selected).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
            : 'Bir gün seçin'}
        </h3>
        {selectedList.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/55">
            {selected ? 'Bu gün için randevu yok.' : 'Takvimden gün seçtiğinizde randevular burada listelenir.'}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedList.map((l) => (
              <div key={l.id} className="rounded-xl border border-border bg-secondary/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{l.name}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-sun shrink-0">
                    <Clock className="w-3 h-3" />{l.appointment_time || '—'}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {TYPE[l.type]}{l.service ? ` · ${l.service}` : ''}
                </p>
                {l.phone && (
                  <a href={`tel:${l.phone}`} className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-mint hover:underline">
                    <Phone className="w-3 h-3" />{l.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 font-mono text-[10px] text-muted-foreground">TOPLAM RANDEVU: {appts.length}</p>
      </div>
    </div>
  );
}