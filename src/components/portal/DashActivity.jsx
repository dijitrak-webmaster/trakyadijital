import React from 'react';
import { FolderKanban, FileText, MessageCircle, Paperclip, CheckCircle2, ArrowRight } from 'lucide-react';

const PROJECT_STATUS = {
  planned: 'Planlamada',
  in_progress: 'Devam ediyor',
  review: 'İncelemede',
  launched: 'Yayında',
};

/** Aktivite akışı — projeler, teklifler, dosyalar ve yanıtlardan türetilmiş olay listesi */
export default function DashActivity({ data, goto }) {
  const { projects, leads, messages, files } = data || {};
  const safe = { projects: projects || [], leads: leads || [], messages: messages || [], files: files || [] };

  const events = [
    ...safe.projects.map((p) => ({ date: p.updated_date, icon: FolderKanban, accent: 'text-mint', text: `Proje güncellendi: ${p.title}`, meta: PROJECT_STATUS[p.status] || '' })),
    ...safe.leads.map((l) => ({ date: l.created_date, icon: FileText, accent: 'text-coral', text: `Teklif: ${l.service || 'Dijital Hizmet'}`, meta: l.estimate || '' })),
    ...safe.files.map((f) => ({ date: f.created_date, icon: Paperclip, accent: 'text-sun', text: `Yeni dosya paylaşıldı: ${f.title}`, meta: '' })),
    ...safe.messages.filter((m) => m.answer).map((m) => ({ date: m.updated_date, icon: MessageCircle, accent: 'text-sage', text: `Sorunuza yanıt geldi`, meta: (m.question || '').slice(0, 40) })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  if (!events.length) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 h-full">
        <h3 className="font-display text-lg font-semibold">Hareketler</h3>
        <div className="mt-4 rounded-xl bg-secondary/40 border border-border p-5 text-center">
          <CheckCircle2 className="w-6 h-6 text-mint mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Henüz bir hareket yok. Proje başladığında tüm gelişmeler burada akacak.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 h-full">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">Son Hareketler</h3>
        <button onClick={() => goto('projects')} className="font-mono text-xs text-mint inline-flex items-center gap-1">
          Tümü <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <ul className="mt-4 space-y-1">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/40 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-secondary/60 border border-border flex items-center justify-center shrink-0">
              <e.icon className={`w-3.5 h-3.5 ${e.accent}`} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug truncate">{e.text}</p>
              {e.meta && <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">{e.meta}</p>}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0 mt-1">
              {new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}