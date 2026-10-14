import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

/** Müşteri portalı: projesine marketteki (tema kategorisi) bir temayı seçme / değiştirme. */
export default function ThemePicker({ project, onSelected }) {
  const [themes, setThemes] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.entities.MarketItem.filter({ category: 'tema', status: 'published' }).then(setThemes).catch(() => {});
  }, []);

  const pick = async (t) => {
    setBusyId(t.id);
    setError('');
    try {
      const res = await base44.functions.invoke('selectProjectTheme', { project_id: project.id, theme_id: t.id });
      if (res?.data?.ok) onSelected(project.id, t);
      else setError(res?.data?.error || 'Tema seçilemedi.');
    } catch (e) {
      setError(e.message || 'Tema seçilemedi.');
    }
    setBusyId(null);
  };

  if (themes.length === 0) return null;

  return (
    <div className="border-t border-border pt-5 mt-5">
      <p className="font-mono text-xs uppercase text-mint flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Proje Teması</p>
      <p className="text-sm text-foreground/70 mt-1">
        {project.theme_name ? (
          <>Seçili tema: <span className="font-semibold text-foreground">{project.theme_name}</span> — dilediğiniz zaman değiştirebilirsiniz.</>
        ) : (
          'Projeniz için aşağıdaki temalardan birini seçin; tasarım buna göre hazırlanır.'
        )}
      </p>
      <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => pick(t)}
            disabled={busyId === t.id}
            className={`shrink-0 w-40 rounded-2xl border p-2 text-left transition-all ${project.theme_id === t.id ? 'border-mint bg-mint/10' : 'border-border hover:border-mint/50'}`}
          >
            {t.image_url && <Image src={t.image_url} className="h-20 w-full rounded-xl" />}
            <p className="mt-2 text-xs font-semibold truncate">{t.title}</p>
          </button>
        ))}
      </div>
      {busyId && <p className="font-mono text-xs text-muted-foreground mt-2">Kaydediliyor...</p>}
      {error && <p className="text-xs text-coral mt-2">{error}</p>}
    </div>
  );
}