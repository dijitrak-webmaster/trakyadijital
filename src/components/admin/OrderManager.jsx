import React, { useEffect, useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, ShoppingCart, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS = [
  { value: 'new', label: 'Yeni' },
  { value: 'approved', label: 'Onaylandı' },
  { value: 'in_progress', label: 'Süreçte' },
  { value: 'delivered', label: 'Teslim edildi' },
  { value: 'cancelled', label: 'İptal' },
];
const stLabel = (s) => STATUS.find((x) => x.value === s)?.label || s;

const fmt = (n) => (Number(n) || 0).toLocaleString('tr-TR');

export default function OrderManager() {
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [linkDrafts, setLinkDrafts] = useState({});

  const load = () => base44.entities.Order.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const setSt = async (id, s) => {
    setBusyId(id);
    await base44.entities.Order.update(id, { status: s });
    // durum değişikliğini müşteriye bildir (WhatsApp + e-posta)
    base44.functions.invoke('orderNotify', { order_id: id, status: s }).catch(() => {});
    setBusyId(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu sipariş silinsin mi?')) return;
    setBusyId(id);
    await base44.entities.Order.delete(id);
    setBusyId(null);
    load();
  };

  // iyzico panelinden üretilen ödeme linkini siparişe işler
  const saveLink = async (it) => {
    const link = (linkDrafts[it.id] ?? (it.payment_link || '')).trim();
    setBusyId(it.id);
    await base44.entities.Order.update(it.id, { payment_link: link });
    setBusyId(null);
    load();
  };

  // link + bildirimi müşteriye gönderir (WhatsApp + e-posta)
  const sendLink = (id) => {
    setBusyId(id);
    base44.functions.invoke('orderNotify', { order_id: id, status: 'link_sent' })
      .catch(() => {})
      .finally(() => { setBusyId(null); load(); });
  };

  // linkle gelen ödemeyi onaylar: ödendi işareti + anında hizmet başlatma + bildirim
  const markPaid = async (id) => {
    setBusyId(id);
    try {
      await base44.functions.invoke('orderPaid', { order_id: id });
    } catch {
      // fonksiyon erişilemezse ödemeyi yine de işaretle; başlatma sonradan tetiklenir
      await base44.entities.Order.update(id, { payment_status: 'paid', paid_date: new Date().toISOString() });
    }
    setBusyId(null);
    load();
  };

  const shown = (items || []).filter((i) => status === 'all' || i.status === status);
  const totalValue = (items || []).filter((i) => i.status !== 'cancelled').reduce((t, i) => t + (Number(i.total) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[{ value: 'all', label: 'Tümü' }, ...STATUS].map((s) => (
          <button key={s.value} onClick={() => setStatus(s.value)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${status === s.value ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
            {s.value === 'all' ? `${s.label} (${(items || []).length})` : `${s.label} (${(items || []).filter((i) => i.status === s.value).length})`}
          </button>
        ))}
        <span className="font-mono text-xs text-muted-foreground ml-auto">İptal hariç toplam: {fmt(totalValue)} ₺</span>
      </div>

      {items === null ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
      ) : shown.length === 0 ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">
          <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          {items.length === 0 ? 'Henüz market siparişi yok.' : 'Aramanıza uygun sipariş yok.'}
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl">
          {shown.map((it) => {
            let parsed = [];
            try { parsed = JSON.parse(it.items || '[]'); } catch { /* eski kayıt */ }
            const open = openId === it.id;
            return (
              <div key={it.id} className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => setOpenId(open ? null : it.id)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{it.customer_name}</p>
                      {it.discount_code && <span className="font-mono text-[10px] text-mint border border-mint/40 rounded-full px-2">{it.discount_code}</span>}
                      {it.payment_status === 'paid'
                        ? <span className="font-mono text-[10px] text-mint border border-mint/40 rounded-full px-2">Ödendi</span>
                        : <span className="font-mono text-[10px] text-muted-foreground border border-border rounded-full px-2">Ödeme bekliyor</span>}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {[it.email, it.phone].filter(Boolean).join(' · ') || '—'} · {parsed.length} ürün · {fmt(it.total)} ₺{parsed.some((p) => p.billing === 'monthly') ? ' /ay' : ''}
                    </p>
                  </button>
                  <select
                    value={it.status}
                    disabled={busyId === it.id}
                    onChange={(e) => setSt(it.id, e.target.value)}
                    className="rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Sipariş durumu"
                  >
                    {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button onClick={() => setOpenId(open ? null : it.id)} className="p-1.5 hover:text-mint transition-colors" aria-label="Detay">
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(it.id)} disabled={busyId === it.id} className="p-1.5 hover:text-coral transition-colors" aria-label="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {open && (
                  <div className="rounded-xl bg-secondary/40 border border-border p-3 space-y-1.5">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {new Date(it.created_date).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    {parsed.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate">{p.title}</span>
                        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{fmt(p.price)} ₺{p.billing === 'monthly' ? ' /ay' : ''}</span>
                      </div>
                    ))}
                    {Number(it.discount_amount) > 0 && (
                      <div className="flex items-center justify-between gap-3 text-sm text-mint">
                        <span>İndirim ({it.discount_code})</span>
                        <span className="font-mono text-xs">-{fmt(it.discount_amount)} ₺</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Send className="w-3 h-3" /> iyzico ödeme linki
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={linkDrafts[it.id] ?? (it.payment_link || '')}
                          onChange={(e) => setLinkDrafts((d) => ({ ...d, [it.id]: e.target.value }))}
                          placeholder="https://checkout.iyzico.com/..."
                          className="flex-1 min-w-[220px] rounded-lg bg-secondary border border-border px-3 py-1.5 text-sm outline-none focus:border-mint/50"
                        />
                        <button onClick={() => saveLink(it)} disabled={busyId === it.id} className="rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs font-semibold hover:text-mint transition-colors disabled:opacity-50">Kaydet</button>
                        <button onClick={() => sendLink(it.id)} disabled={busyId === it.id || (!(linkDrafts[it.id] ?? (it.payment_link || '')))} className="rounded-lg bg-mint text-ink px-3 py-1.5 text-xs font-semibold disabled:opacity-50">Linki gönder</button>
                        {it.payment_status !== 'paid' && (
                          <button onClick={() => markPaid(it.id)} disabled={busyId === it.id} className="rounded-lg border border-mint/40 text-mint px-3 py-1.5 text-xs font-semibold disabled:opacity-50">Ödemeyi onayla</button>
                        )}
                      </div>
                      {it.payment_link && (
                        <a href={it.payment_link} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-mint hover:underline break-all">{it.payment_link}</a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}