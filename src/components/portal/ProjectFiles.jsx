import React, { useState } from 'react';
import { FileDown, Paperclip } from 'lucide-react';
import { signFileUri } from '@/lib/uploadClient';

/** Portalda paylaşılan proje dosyaları — imzalı bağlantıyla indirilir */
export default function ProjectFiles({ files, loading }) {
  const [busy, setBusy] = useState(null);
  const download = async (f) => {
    setBusy(f.id);
    try {
      const { signed_url } = await signFileUri(f.file_uri, 600);
      window.open(signed_url, '_blank');
    } finally {
      setBusy(null);
    }
  };
  return (
    <div>
      <span className="font-mono text-xs uppercase text-mint">Paylaşılan dosyalar</span>
      {loading && (
        <div className="mt-3 space-y-2">
          <div className="h-12 rounded-xl bg-secondary/60 animate-pulse" />
          <div className="h-12 rounded-xl bg-secondary/60 animate-pulse" />
        </div>
      )}
      {!loading && files.length === 0 && (
        <p className="font-mono text-xs text-muted-foreground mt-3">Henüz paylaşılan dosya yok — ekip sizinle dosya paylaştığında burada görünecek.</p>
      )}
      <div className="mt-3 space-y-2">
        {files.map((f) => (
          <div key={f.id} className="flex items-center gap-3 border border-border rounded-xl px-3.5 py-2.5">
            <Paperclip className="w-4 h-4 text-mint shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{f.title}</p>
              {f.note && <p className="font-mono text-xs text-muted-foreground truncate">{f.note}</p>}
            </div>
            <button onClick={() => download(f)} disabled={busy === f.id} className="rounded-full bg-mint text-ink p-2 hover:shadow-sticker transition-shadow disabled:opacity-50" aria-label="İndir">
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}