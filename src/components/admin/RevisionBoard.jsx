import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Clock3, RotateCcw, Search, Reply } from 'lucide-react';
import { input } from '@/components/admin/formKit';

const FILTERS = ['open', 'resolved', 'all'];

/** Tüm projelerin revizyon taleplerini tek ekranda toplayan tabela:
 *  filtreleme, arama, yanıtlama (kapanış e-postasına ve portala gider), yeniden açma. */
export default function RevisionBoard() {
  const [items, setItems] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('open');
  const [q, setQ] = useState('');
  const [replyId, setReplyId] = useState(null);
  const [response, setResponse] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => Promise.all([
    base44.entities.RevisionRequest.list('-created_date', 200),
    base44.entities.ClientProject.list('-updated_date', 200),
  ]).then(([reqs, projs]) => { setItems(reqs); setProjects(projs); });

  useEffect(() => { load(); }, []);

  if (items === null) {
    return <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>;
  }

  const projectName = (id) => projects.find((p) => p.id === id)?.title || 'Proje silinmiş';
  const openCount = items.filter((i) => i.status === 'open').length;
  const resolvedCount = items.length - openCount;

  const query = q.trim().toLowerCase();
  const shown = items
    .filter((i) => filter === 'all' || i.status === filter)
    .filter((i) => !query || [i.text, i.client_email, i.response, projectName(i.project_id)].filter(Boolean).some((v) => v.toLowerCase().includes(query)));

  const resolve = async (item) => {
    setBusy(true);
    const data = { status: 'resolved' };
    if (response.trim()) data.response = response.trim();
    await base44.entities.RevisionRequest.update(item.id, data);
    base44.functions.invoke('portalNotify', { event: 'revision_resolved', revision_id: item.id }).catch(() => {});
    setBusy(false);
    setReplyId(null);
    setResponse('');
    load();
  };

  const reopen = async (id) => {
    await base44.entities.RevisionRequest.update(id, { status: 'open' });
    load();
  };

  const countLabel = (f) => (f === 'open' ? `Beklemede (${openCount})` : f === 'resolved' ? `Çözüldü (${resolvedCount})` : `Tümü (${items.length})`);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${filter === f ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
              {countLabel(f)}
            </button>
          ))}
        </div>
        <div className="relative md:max-w-xs w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Talep, proje veya müşteri ara..."
            className="w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 py-2 text-sm outline-none focus:border-mint/50"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">
          {items.length === 0 ? 'Henüz revizyon talebi yok.' : 'Aramanıza uygun talep yok.'}
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl">
          {shown.map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                {r.status === 'resolved' ? <CheckCircle2 className="w-4 h-4 text-mint mt-0.5 shrink-0" /> : <Clock3 className="w-4 h-4 text-sun mt-0.5 shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm whitespace-pre-line leading-snug">{r.text}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-[10px] text-muted-foreground">
                    <span className="rounded-full bg-secondary/70 px-2 py-0.5 text-foreground/80">{projectName(r.project_id)}</span>
                    <span>{r.client_email}</span>
                    <span>{new Date(r.created_date).toLocaleDateString('tr-TR')}</span>
                    <span className={`rounded-full px-2 py-0.5 ${r.via === 'whatsapp' ? 'bg-sun/15 text-sun' : 'bg-fog/15 text-fog'}`}>
                      {r.via === 'whatsapp' ? 'WHATSAPP' : 'PORTAL'}
                    </span>
                  </div>
                  {r.status === 'resolved' && r.response && (
                    <div className="mt-2 rounded-xl bg-mint/10 border border-mint/30 px-3 py-2 text-xs leading-snug">
                      <span className="font-semibold text-mint">Ekibin yanıtı: </span>
                      <span className="whitespace-pre-line">{r.response}</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {r.status === 'open' ? (
                    replyId !== r.id && (
                      <button onClick={() => { setReplyId(r.id); setResponse(''); }} className="flex items-center gap-1.5 rounded-full bg-mint text-ink px-3.5 py-1.5 text-xs font-semibold">
                        <Reply className="w-3.5 h-3.5" /> Yanıtla
                      </button>
                    )
                  ) : (
                    <button onClick={() => reopen(r.id)} title="Yeniden aç" className="p-2 rounded-lg text-muted-foreground hover:text-sun hover:bg-sun/10 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {replyId === r.id && (
                <div className="pl-6 space-y-2">
                  <textarea
                    rows={2}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Müşteriye verilecek yanıt — portaldan ve kapanış e-postasında görünür (boş bırakılabilir)..."
                    className={input}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => resolve(r)} disabled={busy} className="rounded-full bg-mint text-ink px-4 py-1.5 text-xs font-semibold disabled:opacity-50">
                      {busy ? 'Kaydediliyor...' : 'Yanıtla ve Kapat'}
                    </button>
                    <button onClick={() => { setReplyId(null); setResponse(''); }} className="rounded-full bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground">
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}