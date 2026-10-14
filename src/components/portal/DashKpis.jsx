import React from 'react';
import { FolderKanban, TrendingUp, FileText, HelpCircle, Wallet } from 'lucide-react';

export default function DashKpis({ projects, leads, messages, subscriptions }) {
  const active = (projects || []).filter((p) => p.status !== 'launched');
  const avgProgress = projects?.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;
  const openQuotes = (leads || []).filter((l) => l.status === 'new' || l.status === 'contacted').length;
  const pending = (messages || []).filter((m) => !m.answer).length;
  const monthly = (subscriptions || []).filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.monthly_price || 0), 0);

  const kpis = [
    { label: 'Aktif Proje', n: active.length, icon: FolderKanban, accent: 'text-mint', bg: 'bg-mint/10' },
    { label: 'Ortalama İlerleme', n: `${avgProgress}%`, icon: TrendingUp, accent: 'text-sun', bg: 'bg-sun/10' },
    { label: 'Açık Teklif', n: openQuotes, icon: FileText, accent: 'text-coral', bg: 'bg-coral/10' },
    { label: 'Bekleyen Soru', n: pending, icon: HelpCircle, accent: 'text-sage', bg: 'bg-sage/10' },
    { label: 'Aylık Abonelik', n: monthly ? `₺${monthly.toLocaleString('tr-TR')}` : '—', icon: Wallet, accent: 'text-fog', bg: 'bg-fog/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {kpis.map((k) => (
        <div key={k.label} className="bg-card border border-border rounded-2xl p-4 hover:border-mint/30 transition-colors">
          <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
            <k.icon className={`w-[18px] h-[18px] ${k.accent}`} />
          </div>
          <p className="font-display text-2xl font-semibold mt-3">{k.n}</p>
          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
        </div>
      ))}
    </div>
  );
}