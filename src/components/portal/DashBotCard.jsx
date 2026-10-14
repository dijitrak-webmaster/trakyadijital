import React from 'react';
import { Bot, Sparkles, CalendarClock, FileText, MessageCircle, TrendingUp } from 'lucide-react';

const STATUS_LABELS = { planned: 'Planlandı', in_progress: 'Devam ediyor', review: 'Onayda', launched: 'Yayında' };

/** DijiBot asistanı — dashboard verisinden beslenen, müşteriye özel sohbet başlatma kartı */
export default function DashBotCard({ data, onAsk }) {
  const projects = data?.projects || [];
  const active = projects.find((p) => p.status === 'in_progress' || p.status === 'review') || projects[0] || null;
  const openQs = (data?.messages || []).filter((m) => !m.answer).length;
  const activeSubs = (data?.subscriptions || []).filter((s) => s.status !== 'cancelled').length;
  const latestLead = (data?.leads || [])[0] || null;

  // sohbete doğrudan gönderilen kişisel sorular — DijiBot müşteri verisiyle yanıt verir
  const chips = [];
  if (active) {
    chips.push({
      icon: MessageCircle,
      label: 'Projem ne durumda?',
      text: `Projem "${active.title}" şu an ne durumda, neler yapıldı ve sırada ne var?`,
    });
  }
  if (active?.report) {
    chips.push({
      icon: TrendingUp,
      label: 'Son raporu özetle',
      text: `Projemin son durum raporunu sade bir dille özetler misin? Rapor şöyle:\n${String(active.report).slice(0, 600)}`,
    });
  }
  if (openQs > 0) {
    chips.push({
      icon: Bot,
      label: `Bekleyen sorularım (${openQs})`,
      text: `Portala yazdığım ${openQs} soru ne durumda?`,
    });
  }
  if (!active || chips.length < 3) {
    chips.push({ icon: FileText, label: 'Yeni teklif al', intent: 'quote' });
  }
  chips.push({ icon: CalendarClock, label: 'Randevu planla', intent: 'appointment' });

  const intro = active
    ? `Merhaba! "${active.title}" projeniz %${active.progress ?? 0} tamamlandı (${STATUS_LABELS[active.status] || 'devam ediyor'}). Durumunuzu sorabilir, son raporu özetletebilir veya hemen randevu planlayabilirsiniz.`
    : 'Merhaba! Henüz aktif bir projeniz görünmüyor. Yeni bir teklif alabilir, randevu planlayabilir veya sorularınızı sorabilirsiniz.';

  return (
    <div className="bg-card border border-mint/25 rounded-3xl p-6 h-full relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-mint/10 blur-2xl pointer-events-none" />
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-mint text-ink flex items-center justify-center shadow-sticker">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">DijiBot</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Proje asistanınız</p>
        </div>
      </div>
      <p className="text-sm text-foreground/70 mt-4 leading-relaxed">{intro}</p>
      {active && (
        <div className="mt-3 rounded-xl bg-secondary/50 border border-border px-3.5 py-2.5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="truncate">{active.title}</span>
            <span className="text-mint">%{active.progress ?? 0}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-ink/40 overflow-hidden">
            <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, active.progress ?? 0))}%` }} />
          </div>
        </div>
      )}
      {activeSubs > 0 && (
        <p className="font-mono text-[10px] text-muted-foreground mt-2">{activeSubs} aktif aboneliğiniz var — yenileme takibini DijiBot'a sorabilirsiniz.</p>
      )}
      {latestLead && (
        <p className="font-mono text-[10px] text-muted-foreground mt-2">Son teklif kaydınız: {latestLead.service || latestLead.type} ({latestLead.status})</p>
      )}
      <div className="mt-4 space-y-2">
        {chips.slice(0, 3).map((c, i) => (
          <button
            key={`${c.label}-${i}`}
            onClick={() => onAsk(c.text ? { text: c.text } : { intent: c.intent })}
            className="w-full flex items-center gap-2.5 rounded-xl bg-secondary/50 border border-border px-3.5 py-2.5 text-sm font-semibold hover:border-mint/60 hover:text-mint transition-colors text-left"
          >
            <c.icon className="w-4 h-4 text-mint shrink-0" /> {c.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => onAsk({ intent: 'question' })}
        className="mt-4 w-full rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all"
      >
        <Sparkles className="w-4 h-4" /> Sohbeti Aç
      </button>
    </div>
  );
}