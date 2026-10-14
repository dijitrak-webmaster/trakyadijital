import React, { useEffect, useState } from 'react';
import { Clock3, FolderOpen, Wrench, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProjectTimeline from '@/components/portal/ProjectTimeline';
import ProjectLinks from '@/components/portal/ProjectLinks';
import ProjectFiles from '@/components/portal/ProjectFiles';
import RevisionRequests from '@/components/portal/RevisionRequests';
import ThemePicker from '@/components/portal/ThemePicker';

const STATUS = {
  planned: { label: 'Planlamada', chip: 'bg-fog text-ink' },
  in_progress: { label: 'Devam ediyor', chip: 'bg-sun text-ink' },
  review: { label: 'İncelemede', chip: 'bg-coral text-ink' },
  launched: { label: 'Yayında', chip: 'bg-mint text-ink' },
};

const BAR = { planned: 'bg-fog', in_progress: 'bg-sun', review: 'bg-coral', launched: 'bg-mint' };

/** Tek proje kartı — sekmeli düzen (Genel Bakış / Dosyalar / Revizyonlar) */
export default function ProjectCard({ project, email, onAsk }) {
  const [tab, setTab] = useState('genel');
  const [assets, setAssets] = useState({ files: [], requests: [] });
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [themeNames, setThemeNames] = useState({});

  useEffect(() => {
    if (!email) { setLoadingAssets(false); return; }
    setLoadingAssets(true);
    Promise.all([
      base44.entities.ProjectFile.filter({ client_email: email, project_id: project.id }, '-created_date', 100).catch(() => []),
      base44.entities.RevisionRequest.filter({ client_email: email, project_id: project.id }, '-created_date', 100).catch(() => []),
    ]).then(([files, requests]) => {
      setAssets({ files, requests });
      setLoadingAssets(false);
    });
  }, [email, project.id, project.updated_date]);

  const meta = STATUS[project.status] || STATUS.planned;
  const progress = Math.min(100, Math.max(0, project.progress || 0));
  const openRevisions = assets.requests.filter((r) => r.status !== 'resolved').length;

  const tabs = [
    { id: 'genel', label: 'Genel Bakış', icon: Info },
    { id: 'files', label: 'Dosyalar', icon: FolderOpen, count: assets.files.length },
    { id: 'revisions', label: 'Revizyonlar', icon: Wrench, count: openRevisions },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden hover:border-mint/30 transition-colors">
      {/* üst şerit: durum rengi */}
      <div className={`h-1.5 ${BAR[project.status] || BAR.planned}`} />

      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}>{meta.label}</span>
              {project.theme_name && (
                <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[10px] text-muted-foreground">{project.theme_name}</span>
              )}
            </div>
            <h3 className="font-display text-2xl font-semibold mt-2.5 leading-tight">{project.title}</h3>
            <p className="font-mono text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <Clock3 className="w-3 h-3" />
              Son güncelleme: {new Date(project.updated_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-3xl font-bold text-mint leading-none">{progress}<span className="text-lg">%</span></p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Tamamlanma</p>
          </div>
        </div>

        <div className="mt-4 h-2.5 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full rounded-full ${BAR[project.status] || BAR.planned} transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-5">
          <ProjectTimeline status={project.status} />
        </div>

        {/* sekmeler */}
        <div className="mt-6 flex gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-mint text-mint' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count > 0 && (
                <span className={`rounded-full px-1.5 min-w-[18px] h-[18px] font-mono text-[10px] font-bold flex items-center justify-center ${tab === t.id ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-5">
          {tab === 'genel' && (
            <div className="space-y-5">
              {project.description && <p className="text-sm text-foreground/75 leading-relaxed">{project.description}</p>}
              {project.report && (
                <div className="border-l-2 border-mint pl-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Son rapor</span>
                  <p className="text-sm text-foreground/75 mt-1 whitespace-pre-line leading-relaxed">{project.report}</p>
                </div>
              )}
              <ProjectLinks project={project} />
              <ThemePicker
                project={{ ...project, theme_name: themeNames[project.id] || project.theme_name }}
                onSelected={(id, t) => setThemeNames((m) => ({ ...m, [id]: t.title }))}
              />
            </div>
          )}

          {tab === 'files' && <ProjectFiles files={assets.files} loading={loadingAssets} />}

          {tab === 'revisions' && (
            <RevisionRequests
              projectId={project.id}
              requests={assets.requests}
              email={email}
              loading={loadingAssets}
              onAdded={(rec) => setAssets((a) => ({ ...a, requests: [rec, ...a.requests] }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}