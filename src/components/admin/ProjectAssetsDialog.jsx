import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, CheckCircle2, Clock3, Trash2, Reply, FileDown } from 'lucide-react';
import { input } from '@/components/admin/formKit';
import { uploadWithProgress, signFileUri } from '@/lib/uploadClient';

/** Yönetici paneli: projeye dosya yükleme (müşteri portalına gider) ve revizyon taleplerini yönetme */
export default function ProjectAssetsDialog({ project, onClose, onChanged }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [progress, setProgress] = useState(0);
  const abortRef = React.useRef(null);
  const [assets, setAssets] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const [response, setResponse] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => Promise.all([
    base44.entities.ProjectFile.filter({ project_id: project.id }, '-created_date', 100),
    base44.entities.RevisionRequest.filter({ project_id: project.id }, '-created_date', 100),
  ]).then(([files, requests]) => setAssets({ files, requests }));

  useEffect(() => {
    if (project?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const upload = async () => {
    if (!file || !title.trim() || uploading) return;
    const abort = new AbortController();
    abortRef.current = abort;
    setUploading(true);
    setUploadError('');
    setProgress(0);
    try {
      const { file_uri } = await uploadWithProgress(file, {
        onProgress: setProgress,
        signal: abort.signal,
      });
      const rec = await base44.entities.ProjectFile.create({ project_id: project.id, client_email: project.client_email, title: title.trim(), file_uri });
      base44.functions.invoke('portalNotify', { event: 'file_added', file_id: rec.id }).catch(() => {});
      setTitle('');
      setFile(null);
      onChanged?.();
      load();
    } catch (e) {
      setUploadError(e?.message || 'Yükleme başarısız oldu — dosya çok büyük olabilir, tekrar deneyin.');
    } finally {
      setUploading(false);
      setProgress(0);
      abortRef.current = null;
    }
  };

  const cancelUpload = () => abortRef.current?.abort();

  const [downloading, setDownloading] = useState(null);
  const downloadFile = async (f) => {
    setDownloading(f.id);
    try {
      const { signed_url } = await signFileUri(f.file_uri, 600);
      window.open(signed_url, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  const removeFile = async (id) => {
    await base44.entities.ProjectFile.delete(id);
    onChanged?.();
    load();
  };

  const resolve = async (r) => {
    setBusy(true);
    const data = { status: 'resolved' };
    if (response.trim()) data.response = response.trim();
    await base44.entities.RevisionRequest.update(r.id, data);
    base44.functions.invoke('portalNotify', { event: 'revision_resolved', revision_id: r.id }).catch(() => {});
    setBusy(false);
    setReplyId(null);
    setResponse('');
    load();
  };

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{project?.title} — Dosyalar & Revizyonlar</DialogTitle>
        </DialogHeader>
        {!assets && (
          <div className="space-y-3 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-secondary/60 animate-pulse" />
            ))}
            <p className="font-mono text-xs text-muted-foreground">Dosyalar ve revizyonlar yükleniyor…</p>
          </div>
        )}
        {assets && (
          <div className="space-y-6 pt-2">
            <div>
              <p className="font-mono text-xs uppercase text-mint">Paylaşılan dosyalar</p>
              <div className="mt-3 space-y-2">
                {assets.files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 border border-border rounded-xl px-3.5 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{f.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{new Date(f.created_date).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <button onClick={() => downloadFile(f)} disabled={downloading === f.id} className="rounded-full bg-mint text-ink p-2 hover:shadow-sticker transition-shadow disabled:opacity-50" aria-label="İndir">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeFile(f.id)} className="p-1.5 hover:text-coral" aria-label="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {assets.files.length === 0 && <p className="font-mono text-xs text-muted-foreground">Henüz dosya yok.</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dosya başlığı..." className={`${input} flex-1`} />
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className={`${input} flex-1 py-1.5`} />
                <button onClick={upload} disabled={uploading || !file || !title.trim()} className="rounded-full bg-mint text-ink px-4 py-2 text-sm font-semibold shrink-0 disabled:opacity-50">
                  <Upload className="w-4 h-4 inline mr-1.5" />{uploading ? `%${progress}` : 'Yükle'}
                </button>
              </div>
              {uploading && (
                <div className="mt-2 flex items-center gap-2.5">
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-mint transition-all duration-150" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="font-mono text-[11px] text-mint shrink-0">Özel depoya yükleniyor…</span>
                  <button onClick={cancelUpload} className="font-mono text-[11px] text-muted-foreground hover:text-coral shrink-0">İptal</button>
                </div>
              )}
              {uploadError && <p className="mt-2 font-mono text-xs text-coral">{uploadError}</p>}
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-mint">Revizyon talepleri</p>
              <div className="mt-3 space-y-2">
                {assets.requests.map((r) => (
                  <div key={r.id} className="border border-border rounded-xl px-3.5 py-2.5 space-y-2">
                    <div className="flex items-start gap-2.5">
                      {r.status === 'resolved' ? <CheckCircle2 className="w-4 h-4 text-mint mt-0.5 shrink-0" /> : <Clock3 className="w-4 h-4 text-sun mt-0.5 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm whitespace-pre-line leading-snug">{r.text}</p>
                        <span className="font-mono text-[10px] text-muted-foreground">{r.status === 'resolved' ? 'Çözüldü' : 'Beklemede'}{r.via === 'whatsapp' ? ' · WhatsApp' : ''}</span>
                        {r.status === 'resolved' && r.response && (
                          <div className="mt-1.5 rounded-lg bg-mint/10 border border-mint/30 px-2.5 py-1.5 text-xs leading-snug">
                            <span className="font-semibold text-mint">Yanıt: </span>
                            <span className="whitespace-pre-line">{r.response}</span>
                          </div>
                        )}
                      </div>
                      {r.status === 'open' && replyId !== r.id && (
                        <button onClick={() => { setReplyId(r.id); setResponse(''); }} className="flex items-center gap-1 rounded-full bg-mint text-ink px-3 py-1.5 text-xs font-semibold shrink-0">
                          <Reply className="w-3 h-3" /> Yanıtla
                        </button>
                      )}
                    </div>
                    {replyId === r.id && (
                      <div className="space-y-2">
                        <textarea rows={2} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Müşteriye yanıt (opsiyonel)..." className={input} />
                        <div className="flex gap-2">
                          <button onClick={() => resolve(r)} disabled={busy} className="rounded-full bg-mint text-ink px-3.5 py-1.5 text-xs font-semibold disabled:opacity-50">
                            {busy ? 'Kaydediliyor...' : 'Yanıtla ve Kapat'}
                          </button>
                          <button onClick={() => { setReplyId(null); setResponse(''); }} className="rounded-full bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground">
                            İptal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {assets.requests.length === 0 && <p className="font-mono text-xs text-muted-foreground">Revizyon talebi yok.</p>}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}