import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, EyeOff, Trash2 } from 'lucide-react';

/** Blog yorumlarını yönetir: onaylama, gizleme ve silme. */
export default function CommentManager() {
  const [items, setItems] = useState(null);

  const load = () => base44.entities.BlogComment.list('-created_date', 300).then(setItems);
  useEffect(() => { load(); }, []);

  const setStatus = async (it) => {
    await base44.entities.BlogComment.update(it.id, { status: it.status === 'approved' ? 'pending' : 'approved' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu yorum silinsin mi?')) return;
    await base44.entities.BlogComment.delete(id);
    load();
  };

  const pending = (items || []).filter((i) => i.status === 'pending').length;

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground">
        Blog yorumları{items ? ` — ${pending} onay bekliyor` : ''}
      </p>

      {items === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz yorum yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-start gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">
                  {it.author_name}
                  <span className="font-mono text-xs text-muted-foreground ml-2">/blog/{it.blog_slug}</span>
                </p>
                <p className="text-sm text-foreground/70 mt-1 whitespace-pre-line">{it.text}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${it.status === 'approved' ? 'bg-mint text-ink' : 'bg-sun/15 text-sun'}`}>
                {it.status === 'approved' ? 'Yayında' : 'Onay bekliyor'}
              </span>
              <button
                onClick={() => setStatus(it)}
                title={it.status === 'approved' ? 'Yayından al' : 'Onayla ve yayınla'}
                className="p-2 rounded-xl border border-border hover:text-mint transition-colors shrink-0"
              >
                {it.status === 'approved' ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </button>
              <button onClick={() => remove(it.id)} className="p-2 hover:text-coral transition-colors shrink-0" aria-label="Sil">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}