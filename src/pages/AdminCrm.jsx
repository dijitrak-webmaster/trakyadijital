import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCcw, Search } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CrmKpis from '@/components/admin/crm/CrmKpis';
import CrmCharts from '@/components/admin/crm/CrmCharts';
import CrmClientCard from '@/components/admin/crm/CrmClientCard';
import { buildCrmData, SEGMENTS } from '@/lib/crmAnalysis';

/** CRM Analizi — para + memnuniyet ağırlıklı müşteri sağlık panosu. */
export default function AdminCrm() {
  const [data, setData] = useState(null);
  const [segment, setSegment] = useState('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    const [projects, orders, subs, revisions, messages, leads, users] = await Promise.all([
      base44.entities.ClientProject.list('-updated_date', 200),
      base44.entities.Order.list('-created_date', 200),
      base44.entities.Subscription.list('-created_date', 200),
      base44.entities.RevisionRequest.list('-created_date', 200),
      base44.entities.ClientMessage.list('-created_date', 200),
      base44.entities.Lead.list('-created_date', 200),
      base44.entities.User.list(),
    ]);
    setData(buildCrmData({ projects, orders, subs, revisions, messages, leads, users }));
    setBusy(false);
  };

  useEffect(() => { load(); }, []);

  const q = search.trim().toLowerCase();
  const shown = (data?.clients || [])
    .filter((c) => segment === 'all' || c.segment === segment)
    .filter((c) => !q || (c.email + ' ' + c.name).toLowerCase().includes(q));

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-6">
      <AdminPageHeader
        crumb="Yönetim / CRM Analizi"
        title="CRM Analizi"
        subtitle="Müşteri sağlık skoru: %50 para (ciro, MRR, alım tazeliği) + %50 memnuniyet (destek yükü, yanıt performansı, temas tazeliği, momentum)."
        actions={
          <button onClick={load} disabled={busy} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50">
            <RefreshCcw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} /> Yenile
          </button>
        }
      />

      {data === null ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Analiz hesaplanıyor...</div>
      ) : (
        <>
          <CrmKpis kpis={data.kpis} />
          <CrmCharts monthly={data.monthly} segmentDist={data.segmentDist} />

          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSegment('all')} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${segment === 'all' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
                Tümü ({data.clients.length})
              </button>
              {SEGMENTS.map((s) => (
                <button key={s.key} onClick={() => setSegment(s.key)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${segment === s.key ? `${s.cls} text-ink` : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
                  {s.label} ({s.n})
                </button>
              ))}
            </div>
            <div className="relative md:max-w-xs w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Müşteri veya e-posta ara..."
                className="w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 py-2 text-sm outline-none focus:border-mint/50"
              />
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">
              {data.clients.length === 0 ? 'Henüz CRM verisi oluşmadı — müşteri projesi ekleyin.' : 'Bu filtreye uyan müşteri yok.'}
            </div>
          ) : (
            <div className="space-y-2">
              {shown.map((c) => <CrmClientCard key={c.email} client={c} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}