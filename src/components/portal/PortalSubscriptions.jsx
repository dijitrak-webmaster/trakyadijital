import React from 'react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { RefreshCw, CalendarClock, Ban, CheckCircle2 } from 'lucide-react';

const statusOf = (s) => {
  if (s.status === 'cancelled') return { label: 'İptal edildi', cls: 'bg-secondary text-muted-foreground' };
  const days = differenceInCalendarDays(parseISO(s.end_date), new Date());
  if (days < 0) return { label: 'Süre doldu', cls: 'bg-coral text-ink' };
  if (days <= 7) return { label: `${days} gün içinde yenilenir`, cls: 'bg-sun text-ink' };
  return { label: 'Aktif', cls: 'bg-mint text-ink' };
};

export default function PortalSubscriptions({ subs, onAsk }) {
  if (!subs || subs.length === 0) {
    return (
      <div className="border border-border rounded-3xl bg-card/50 p-10 text-center">
        <RefreshCw className="w-10 h-10 text-mint mx-auto" />
        <p className="font-semibold mt-4">Henüz aktif aboneliğiniz yok</p>
        <p className="text-sm text-foreground/60 mt-2">Aylık bakım, barındırma veya SEO abonelikleri için DijiBot'a danışabilir ya da bizimle iletişime geçebilirsiniz.</p>
        <button onClick={onAsk} className="mt-5 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm hover:shadow-sticker transition-shadow">
          DijiBot'a Sor
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subs.map((s) => {
        const st = statusOf(s);
        const cancelled = s.status === 'cancelled';
        const expired = !cancelled && differenceInCalendarDays(parseISO(s.end_date), new Date()) < 0;
        return (
          <div key={s.id} className={`rounded-3xl border border-border bg-card p-5 hover:border-mint/30 transition-colors ${cancelled || expired ? 'opacity-70' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold truncate">{s.item_title}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {s.start_date ? format(parseISO(s.start_date), 'd MMM yyyy') : '—'} → {s.end_date ? format(parseISO(s.end_date), 'd MMM yyyy') : '—'}
                  {s.months > 1 ? ` · ${s.months} aylık` : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl font-bold">{(s.monthly_price || 0).toLocaleString('tr-TR')} ₺<span className="font-body text-xs font-semibold text-muted-foreground"> /ay</span></p>
                <span className={`inline-block mt-1 rounded-full px-3 py-1 font-mono text-[10px] font-bold ${st.cls}`}>{st.label}</span>
              </div>
            </div>
            {s.note && <p className="text-sm text-foreground/60 mt-3 border-t border-border pt-3">{s.note}</p>}
            {cancelled && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground mt-3"><Ban className="w-3.5 h-3.5" /> Bu abonelik iptal edildi.</p>
            )}
            {!cancelled && !expired && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground mt-3"><CheckCircle2 className="w-3.5 h-3.5 text-mint" /> Abonelik düzenli olarak yenilenir; bitişte ekip sizinle iletişime geçer.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}