import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, FolderKanban, ExternalLink } from 'lucide-react';
import { SEGMENTS } from '@/lib/crmAnalysis';

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—');

const MiniBar = ({ label, value, cls }) => (
  <div>
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-muted-foreground">{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
      <div className={`h-full rounded-full ${cls}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

/** Tek müşterinin CRM karnesi — skor, gelir özeti, skor kırılımı ve uyarılar. */
export default function CrmClientCard({ client }) {
  const [open, setOpen] = useState(false);
  const seg = SEGMENTS.find((s) => s.key === client.segment);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/40 transition-colors">
        <div className={`w-12 h-12 rounded-xl ${seg.cls} text-ink font-display font-bold flex items-center justify-center shrink-0`}>
          {client.score}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{client.name}</p>
          <p className="font-mono text-xs text-muted-foreground truncate">{client.email}</p>
        </div>
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <div className="text-right">
            <p className="text-muted-foreground">MRR</p>
            <p className="text-mint font-semibold">₺{client.mrr.toLocaleString('tr-TR')}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">LTV</p>
            <p className="text-sun font-semibold">₺{client.ltv.toLocaleString('tr-TR')}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Son temas</p>
            <p>{fmtDate(client.lastContact)}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${seg.cls} text-ink shrink-0 hidden sm:block`}>{seg.label}</span>
        {client.flags.length > 0 && <span className="rounded-full bg-coral text-ink font-mono text-[10px] font-bold px-2 py-0.5 shrink-0">{client.flags.length}</span>}
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border p-4 grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Para (%50) · skor {client.scores.money}</p>
            <MiniBar label="Geçmiş ciro" value={client.scores.ltv} cls="bg-mint" />
            <MiniBar label="Yinelenen gelir" value={client.scores.mrr} cls="bg-mint" />
            <MiniBar label="Son alım tazeliği" value={client.scores.purchaseRecency} cls="bg-mint" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground pt-2">Memnuniyet (%50) · skor {client.scores.satisfaction}</p>
            <MiniBar label="Destek yükü (açık revizyon)" value={client.scores.support} cls="bg-sun" />
            <MiniBar label="Yanıt performansı" value={client.scores.response} cls="bg-sun" />
            <MiniBar label="Temas tazeliği" value={client.scores.contact} cls="bg-sun" />
            <MiniBar label="Proje momentumu" value={client.scores.momentum} cls="bg-sun" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-muted-foreground">Proje</p><p className="font-semibold mt-0.5">{client.projectCount}</p></div>
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-muted-foreground">Sipariş</p><p className="font-semibold mt-0.5">{client.orderCount}</p></div>
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-muted-foreground">Aktif abonelik</p><p className="font-semibold mt-0.5">{client.subCount}</p></div>
              <div className="rounded-xl bg-secondary/60 p-3"><p className="text-muted-foreground">Açık revizyon</p><p className="font-semibold mt-0.5">{client.openRevisions}</p></div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Uyarılar</p>
              {client.flags.length === 0 ? (
                <p className="text-sm text-mint">Belirgin bir uyarı yok.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {client.flags.map((f, i) => (
                    <span key={i} className="rounded-full border border-coral/60 text-coral px-3 py-1 text-xs">{f}</span>
                  ))}
                </div>
              )}
            </div>
            <Link to="/admin/musteriler?tab=projects" className="inline-flex items-center gap-2 rounded-full border border-mint text-mint font-semibold px-4 py-2 text-xs hover:bg-mint/10 transition-colors">
              <FolderKanban className="w-3.5 h-3.5" /> Projeyi Yönet <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}