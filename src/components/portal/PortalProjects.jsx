import React from 'react';
import { FolderKanban, Rocket, Wrench } from 'lucide-react';
import ProjectCard from '@/components/portal/ProjectCard';

/** Portal 'Projelerim' ekranı — özet şeridi ve sekmeli proje kartları */
export default function PortalProjects({ projects, onAsk, email }) {
  const active = projects.filter((p) => p.status !== 'launched').length;
  const launched = projects.filter((p) => p.status === 'launched').length;

  if (!projects.length) {
    return (
      <div className="bg-card border border-mint/25 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-mint/10 blur-2xl pointer-events-none" />
        <div className="w-14 h-14 rounded-2xl bg-mint text-ink flex items-center justify-center mx-auto shadow-sticker">
          <FolderKanban className="w-6 h-6" />
        </div>
        <p className="font-display text-xl font-semibold mt-5">Henüz aktif bir projeniz görünmüyor</p>
        <p className="text-sm text-foreground/70 mt-2 max-w-md mx-auto">
          Yeni bir proje başlatmak için DijiBot'a ihtiyacınızı anlatabilir, teklif hazırlayabilirsiniz.
        </p>
        <button onClick={() => onAsk({ intent: 'quote' })} className="mt-6 rounded-full bg-mint text-ink font-semibold px-8 py-3 hover:-translate-y-0.5 hover:shadow-sticker transition-all">
          Proje Başlat
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: FolderKanban, accent: 'text-sun', value: active, label: 'Aktif proje' },
          { icon: Rocket, accent: 'text-mint', value: launched, label: 'Yayında' },
          { icon: Wrench, accent: 'text-coral', value: projects.length, label: 'Toplam proje' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.accent} shrink-0`} />
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold leading-none">{s.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} email={email} onAsk={onAsk} />
      ))}
    </div>
  );
}