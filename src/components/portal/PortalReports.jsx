import React from 'react';
import { FolderKanban, Gauge, MessageSquare, RefreshCw, ExternalLink } from 'lucide-react';

const STAGES = [
  { value: 'planned', label: 'Planlandı' },
  { value: 'in_progress', label: 'Süreçte' },
  { value: 'review', label: 'Onayda' },
  { value: 'launched', label: 'Yayında' },
];
const stLabel = (s) => STAGES.find((x) => x.value === s)?.label || s;

/** Müşteri portalında dönemsel performans raporu: projeler, sorular, abonelikler. */
export default function PortalReports({ data }) {
  const { projects = [], messages = [], subscriptions = [] } = data || {};
  const active = projects.filter((p) => p.status !== 'launched');
  const avg = projects.length
    ? Math.round(projects.reduce((t, p) => t + (Number(p.progress) || 0), 0) / projects.length)
    : 0;
  const answered = messages.filter((m) => m.answer).length;
  const pending = messages.filter((m) => !m.answer).length;
  const activeSubs = subscriptions.filter((s) => s.status !== 'cancelled');
  const monthly = activeSubs.reduce((t, s) => t + (Number(s.monthly_price) || 0), 0);
  const empty = !projects.length && !messages.length && !subscriptions.length;

  const KPIS = [
    { icon: FolderKanban, label: 'Aktif proje', value: active.length || '—' },
    { icon: Gauge, label: 'Ortalama ilerleme', value: projects.length ? `%${avg}` : '—' },
    { icon: MessageSquare, label: 'Yanıtlanan soru', value: messages.length ? `${answered}/${messages.length}` : '—' },
    { icon: RefreshCw, label: 'Aylık abonelik', value: activeSubs.length ? `${monthly.toLocaleString('tr-TR')} ₺` : '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <k.icon className="w-4 h-4 text-mint" />
              <span className="font-mono text-[10px] uppercase tracking-widest">{k.label}</span>
            </div>
            <p className="font-display text-2xl font-semibold mt-2">{k.value}</p>
          </div>
        ))}
      </div>

      {empty ? (
        <div className="border border-border rounded-3xl p-12 text-center text-foreground/70">
          Henüz raporlanacak veri yok — proje, soru veya abonelik başladığında burada özetiniz oluşur.
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold">Proje durumları</h3>
            <div className="mt-4 space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-sm truncate">{p.title}</p>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">{stLabel(p.status)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded-full bg-mint" style={{ width: `${Math.min(100, Math.max(0, Number(p.progress) || 0))}%` }} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[11px] text-muted-foreground">%{Number(p.progress) || 0}</p>
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] text-mint hover:underline">
                        <ExternalLink className="w-3 h-3" /> canlı site
                      </a>
                    )}
                  </div>
                  {p.report && <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed border-l-2 border-mint/40 pl-3">{p.report}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">Destek özeti</h3>
              <p className="text-sm text-foreground/70 mt-2">
                {pending === 0 && messages.length > 0
                  ? 'Tüm sorularınız yanıtlandı.'
                  : messages.length
                    ? `${pending} sorunuz yanıtları bekleniyor.`
                    : 'Bu dönemde sorunuz bulunmuyor.'}
              </p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">Abonelikler</h3>
              {activeSubs.length === 0 ? (
                <p className="text-sm text-foreground/70 mt-2">Aktif aboneliğiniz yok.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {activeSubs.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate">{s.item_title}</span>
                      <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{Number(s.monthly_price).toLocaleString('tr-TR')} ₺/ay</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}