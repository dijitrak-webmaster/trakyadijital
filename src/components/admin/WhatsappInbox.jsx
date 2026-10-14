import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ConversationLog from '@/components/admin/ConversationLog';
import { Search, MessageCircle, ArrowUpRight } from 'lucide-react';
import moment from 'moment';

// CRM'deki WhatsApp yazışmalarını sohbet kutusu görünümünde gösterir.
// Kaynak: Lead entity (referral === 'whatsapp') — webhook zaten her mesajı buraya yazıyor.
const lastLine = (conversation) => {
  const lines = String(conversation || '').split('\n').filter(Boolean);
  if (!lines.length) return '—';
  return lines[lines.length - 1]
    .replace(/^\[[^\]]+\]\s*/, '')
    .replace(/^(DijiBot|Kullanici|Asistan|Ziyaretçi):\s*/, '')
    .slice(0, 64);
};

export default function WhatsappInbox() {
  const [leads, setLeads] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    const { items } = await base44.entities.Lead.filter({ referral: 'whatsapp' }, '-updated_date', 100);
    setLeads(items);
    setActiveId((cur) => cur || (items[0]?.id ?? null));
  };

  useEffect(() => { load(); }, []);

  // canlı: yeni mesaj geldiğinde liste tazelenir
  useEffect(() => {
    const unsub = base44.entities.Lead.subscribe((e) => {
      if (e?.data?.referral === 'whatsapp') load();
    });
    return unsub;
  }, []);

  const list = (leads || []).filter((l) => {
    if (!q.trim()) return true;
    const s = `${l.name || ''} ${l.phone || ''}`.toLowerCase();
    return s.includes(q.trim().toLowerCase());
  });
  const active = list.find((l) => l.id === activeId) || list[0] || null;

  if (leads === null) {
    return <div className="py-16 text-center text-muted-foreground font-mono text-sm">Yükleniyor…</div>;
  }

  return (
    <div className="border border-border bg-card">
      <div className="grid md:grid-cols-[280px,1fr]">
        {/* sol: sohbet listesi */}
        <div className="border-b md:border-b-0 md:border-r border-border">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Numara veya isim ara…"
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-mint/60"
              />
            </div>
          </div>
          <div className="max-h-[420px] md:max-h-[520px] overflow-y-auto">
            {list.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Henüz WhatsApp yazışması yok.
              </div>
            )}
            {list.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveId(l.id)}
                className={`w-full text-left px-3.5 py-3 border-b border-border/60 transition-colors ${active?.id === l.id ? 'bg-mint/10' : 'hover:bg-secondary/50'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{l.name || l.phone}</span>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    {moment(l.updated_date).format('DD MMM HH:mm')}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5 font-mono">{l.phone}</div>
                <div className="text-xs text-foreground/60 truncate mt-1">{lastLine(l.conversation)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* sağ: seçili sohbet */}
        <div className="min-w-0">
          {active ? (
            <>
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-secondary/30">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{active.name || 'WhatsApp Ziyaretçisi'}</div>
                  <div className="font-mono text-xs text-muted-foreground">{active.phone}</div>
                </div>
                <a
                  href={`https://wa.me/${active.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-mint/40 bg-mint/10 px-3 py-1.5 text-xs text-mint shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp'ta aç <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div className="p-4 max-h-[460px] md:max-h-[540px] overflow-y-auto">
                <ConversationLog conversation={active.conversation} />
                {!String(active.conversation || '').trim() && (
                  <div className="text-sm text-muted-foreground text-center py-8">Kayıtlı mesaj yok.</div>
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-muted-foreground text-sm">Sohbet seçin.</div>
          )}
        </div>
      </div>
    </div>
  );
}