import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import DashKpis from '@/components/portal/DashKpis';
import DashActivity from '@/components/portal/DashActivity';
import DashProgressChart from '@/components/portal/DashProgressChart';
import DashBotCard from '@/components/portal/DashBotCard';
import ProjectTimeline from '@/components/portal/ProjectTimeline';
import ProjectLinks from '@/components/portal/ProjectLinks';

const STATUS = {
  planned: { label: 'Planlamada', chip: 'bg-fog text-ink' },
  in_progress: { label: 'Devam ediyor', chip: 'bg-sun text-ink' },
  review: { label: 'İncelemede', chip: 'bg-coral text-ink' },
  launched: { label: 'Yayında', chip: 'bg-mint text-ink' },
};

/** Portal dashboard'ı — KPI'lar, ilerleme grafiği, aktivite akışı ve DijiBot kartı */
export default function PortalOverview({ user, data, goto, onAsk }) {
  const projects = data.projects || [];
  const files = data.files || [];
  const active = projects.filter((p) => p.status !== 'launched');
  const focus = active[0] || projects[0];
  const empty = !projects.length && !(data.leads || []).length;

  return (
    <div className="space-y-6">
      <DashKpis
        projects={data.projects}
        leads={data.leads}
        messages={data.messages}
        subscriptions={data.subscriptions}
      />

      {empty && (
        <div className="bg-card border border-mint/25 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-mint/10 blur-2xl pointer-events-none" />
          <Rocket className="w-8 h-8 text-mint mx-auto" />
          <p className="font-display text-xl font-semibold mt-3">Panele hoş geldiniz!</p>
          <p className="text-sm text-foreground/70 mt-2 max-w-md mx-auto">
            Henüz aktif bir projeniz veya teklifiniz görünmüyor. DijiBot'a ihtiyacınızı anlatabilir ya da bir randevu planlayabilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button onClick={() => onAsk({ intent: 'quote' })} className="rounded-full bg-mint text-ink font-semibold px-6 py-3 text-sm hover:-translate-y-0.5 hover:shadow-sticker transition-all">
              DijiBot ile Başla
            </button>
            <button onClick={() => onAsk({ intent: 'appointment' })} className="rounded-full border border-border text-foreground font-semibold px-6 py-3 text-sm hover:border-mint/60 transition-colors">
              Randevu Al
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {focus && (
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">Öne Çıkan Proje</h3>
                <button onClick={() => goto('projects')} className="font-mono text-xs text-mint inline-flex items-center gap-1">
                  Tümü <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <p className="font-display text-xl font-semibold">{focus.title}</p>
                <span className={`rounded-full px-4 py-1 text-xs font-semibold ${(STATUS[focus.status] || STATUS.planned).chip}`}>
                  {(STATUS[focus.status] || STATUS.planned).label}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-xs text-muted-foreground mb-2">
                  <span>Tamamlanma</span>
                  <span>{focus.progress || 0}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${Math.min(100, Math.max(0, focus.progress || 0))}%` }} />
                </div>
              </div>
              <ProjectTimeline status={focus.status} />
              <ProjectLinks project={focus} />
              {focus.report && (
                <div className="border-l-2 border-mint pl-4 mt-5">
                  <span className="font-mono text-xs uppercase text-mint">Son rapor</span>
                  <p className="text-sm text-foreground/75 mt-1 whitespace-pre-line leading-relaxed line-clamp-4">{focus.report}</p>
                </div>
              )}
            </div>
          )}
          <DashProgressChart projects={projects} goto={goto} />
        </div>

        <div className="space-y-6">
          <DashBotCard data={data} onAsk={onAsk} />
          <DashActivity data={data} goto={goto} />
        </div>
      </div>
    </div>
  );
}