import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, FolderKanban, FileText, MessageCircle, Paperclip } from 'lucide-react';

const PROJECT_STATUS = {
  planned: 'Planlamada',
  in_progress: 'Devam ediyor',
  review: 'İncelemede',
  launched: 'Yayında',
};

/** Bildirim merkezi — zil ikonu ve son bildirimler listesi */
export default function NotificationCenter({ data, goto }) {
  const [open, setOpen] = useState(false);
  const { projects, leads, messages, files } = data || {};
  const safe = { projects: projects || [], leads: leads || [], messages: messages || [], files: files || [] };

  const items = [
    ...safe.projects.map((p) => ({ date: p.updated_date, icon: FolderKanban, accent: 'text-mint', title: `Proje güncellendi: ${p.title}`, meta: PROJECT_STATUS[p.status] || '', tab: 'projects' })),
    ...safe.files.map((f) => ({ date: f.created_date, icon: Paperclip, accent: 'text-sun', title: `Yeni dosya: ${f.title}`, meta: '', tab: 'projects' })),
    ...safe.messages.filter((m) => m.answer).map((m) => ({ date: m.updated_date, icon: MessageCircle, accent: 'text-sage', title: 'Sorunuza yanıt geldi', meta: (m.question || '').slice(0, 50), tab: 'questions' })),
    ...safe.leads.map((l) => ({ date: l.created_date, icon: FileText, accent: 'text-coral', title: `Teklif hazır: ${l.service || 'Dijital Hizmet'}`, meta: l.estimate || '', tab: 'quotes' })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const count = items.filter((i) => new Date(i.date).getTime() > weekAgo).length;

  const openTab = (tab) => {
    setOpen(false);
    goto?.(tab);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-foreground/70 hover:text-mint hover:border-mint/50 transition-colors" aria-label="Bildirimler">
          <Bell className="w-[18px] h-[18px]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-coral text-ink font-mono text-[10px] font-bold flex items-center justify-center px-1">{count}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="font-display text-sm font-semibold">Bildirimler</p>
          {count > 0 && <span className="font-mono text-[10px] text-coral">{count} yeni (7 gün)</span>}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length ? items.slice(0, 8).map((n, i) => (
            <button key={i} onClick={() => openTab(n.tab)} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 last:border-0">
              <span className="w-8 h-8 rounded-lg bg-secondary/60 border border-border flex items-center justify-center shrink-0">
                <n.icon className={`w-3.5 h-3.5 ${n.accent}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-snug truncate">{n.title}</span>
                {n.meta && <span className="block font-mono text-[10px] text-muted-foreground truncate mt-0.5">{n.meta}</span>}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground shrink-0 mt-1">
                {new Date(n.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </span>
            </button>
          )) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Henüz bildiriminiz yok.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}