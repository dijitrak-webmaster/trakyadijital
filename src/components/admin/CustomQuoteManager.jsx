import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Copy, Check, FileSignature, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { input } from '@/components/admin/formKit';

const STATUSES = [
  { value: 'draft', label: 'Taslak' },
  { value: 'sent', label: 'Gönderildi' },
  { value: 'accepted', label: 'Kabul edildi' },
  { value: 'rejected', label: 'Reddedildi' },
];
const stLabel = (s) => STATUSES.find((x) => x.value === s)?.label || s;
const fmt = (n) => (Number(n) || 0).toLocaleString('tr-TR');

const EMPTY = {
  title: '', client_name: '', client_email: '', client_phone: '',
  items: [{ name: '', description: '', price: '', billing: 'one_time' }],
  discount_amount: 0, note: '', valid_until: '', status: 'draft', token: '',
};

// Yönetici: müşteriye özel fiyatlı teklifler oluşturur, paylaşım linkini kopyalar.
export default function CustomQuoteManager() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const load = () => base44.entities.CustomQuote.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setItem = (i, k) => (e) => setForm((f) => {
    const next = [...f.items];
    next[i] = { ...next[i], [k]: e.target.value };
    return { ...f, items: next };
  });
  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { name: '', description: '', price: '', billing: 'one_time' }] }));
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }));

  const draftTotal = form
    ? Math.max(0, form.items.reduce((t, it) => t + (Number(it.price) || 0), 0) - (Number(form.discount_amount) || 0))
    : 0;

  const save = async () => {
    setBusy(true);
    const clean = form.items.filter((it) => it.name.trim());
    const subtotal = clean.reduce((t, it) => t + (Number(it.price) || 0), 0);
    const payload = {
      title: form.title || form.client_name || 'Özel teklif',
      client_name: form.client_name || '',
      client_email: form.client_email || '',
      client_phone: form.client_phone || '',
      items: JSON.stringify(clean.map((it) => ({ name: it.name, description: it.description, price: Number(it.price) || 0, billing: it.billing }))),
      discount_amount: Number(form.discount_amount) || 0,
      total: Math.max(0, subtotal - (Number(form.discount_amount) || 0)),
      note: form.note || '',
      valid_until: form.valid_until || '',
      status: form.status || 'draft',
      token: form.token || Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    };
    if (form.id) await base44.entities.CustomQuote.update(form.id, payload);
    else await base44.entities.CustomQuote.create(payload);
    setBusy(false);
    setForm(null);
    load();
  };

  const shareUrl = (q) => `${window.location.origin}/teklif-onayi/${q.token}`;
  const copyLink = async (q) => {
    try { await navigator.clipboard.writeText(shareUrl(q)); } catch { window.prompt('Teklif linki:', shareUrl(q)); }
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1600);
    // Link paylaşıldıysa teklif otomatik "Gönderildi" olur
    if (q.status === 'draft') {
      await base44.entities.CustomQuote.update(q.id, { status: 'sent' }).catch(() => {});
      load();
    }
  };

  const setSt = async (id, s) => {
    await base44.entities.CustomQuote.update(id, { status: s });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu teklif silinsin mi?')) return;
    await base44.entities.CustomQuote.delete(id);
    load();
  };

  const shown = (items || []).filter((q) => filter === 'all' || q.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[{ value: 'all', label: 'Tümü' }, ...STATUSES].map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${filter === s.value ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
            {s.value === 'all' ? `${s.label} (${(items || []).length})` : `${s.label} (${(items || []).filter((q) => q.status === s.value).length})`}
          </button>
        ))}
        <button onClick={() => setForm({ ...EMPTY })} className="ml-auto inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Özel Teklif
        </button>
      </div>

      {items === null ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
      ) : shown.length === 0 ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">
          <FileSignature className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          {items.length === 0 ? 'Henüz özel teklif yok.' : 'Aramanıza uygun teklif yok.'}
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl">
          {shown.map((q) => {
            let parsed = [];
            try { parsed = JSON.parse(q.items || '[]'); } catch { /* eski kayıt */ }
            return (
              <div key={q.id} className="p-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{q.title}</p>
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {[q.client_name, q.client_email].filter(Boolean).join(' · ') || '—'} · {parsed.length} kalem · {fmt(q.total)} ₺{parsed.some((p) => p.billing === 'monthly') ? ' /ay' : ''}
                  </p>
                </div>
                <select
                  value={q.status}
                  onChange={(e) => setSt(q.id, e.target.value)}
                  className="rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Teklif durumu"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button onClick={() => copyLink(q)} title="Paylaşım linkini kopyala" className="p-2 hover:text-mint transition-colors">
                  {copiedId === q.id ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => setForm({ ...EMPTY, ...q, items: parsed.length ? parsed.map((p) => ({ ...p, price: p.price })) : [{ name: '', description: '', price: '', billing: 'one_time' }] })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(q.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{form?.id ? 'Teklifi düzenle' : 'Yeni özel teklif'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Teklif adı</label>
                  <input className={`${input} mt-1`} value={form.title} onChange={set('title')} placeholder="E-ticaret sitesi paketi" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Geçerlilik bitişi</label>
                  <input className={`${input} mt-1`} type="date" value={form.valid_until} onChange={set('valid_until')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Müşteri adı</label>
                  <input className={`${input} mt-1`} value={form.client_name} onChange={set('client_name')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Müşteri e-postası</label>
                  <input className={`${input} mt-1`} type="email" value={form.client_email} onChange={set('client_email')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Telefon</label>
                  <input className={`${input} mt-1`} value={form.client_phone} onChange={set('client_phone')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                  <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Kalemler (özel fiyat)</label>
                  <button onClick={addItem} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:text-mint transition-colors">
                    <Plus className="w-3 h-3" /> Kalem ekle
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {form.items.map((it, i) => (
                    <div key={i} className="rounded-xl border border-border p-3 space-y-2">
                      <div className="flex gap-2">
                        <input className={input} value={it.name} onChange={setItem(i, 'name')} placeholder="Kalem adı (ör. Kurumsal web sitesi)" />
                        <input className={`${input} w-28`} type="number" value={it.price} onChange={setItem(i, 'price')} placeholder="₺" />
                        <select className={`${input} w-32`} value={it.billing} onChange={setItem(i, 'billing')}>
                          <option value="one_time">Tek seferlik</option>
                          <option value="monthly">Aylık</option>
                        </select>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(i)} className="p-2 hover:text-coral transition-colors" aria-label="Kalemi sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input className={input} value={it.description} onChange={setItem(i, 'description')} placeholder="Kalem açıklaması / kapsam" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim (₺)</label>
                  <input className={`${input} mt-1`} type="number" value={form.discount_amount} onChange={set('discount_amount')} />
                </div>
                <div className="rounded-xl bg-secondary/60 border border-border p-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">Genel toplam</span>
                  <span className="font-display text-lg font-semibold text-mint">{fmt(draftTotal)} ₺</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Müşteriye not / kapsam açıklaması</label>
                <textarea className={`${input} mt-1 min-h-[80px]`} value={form.note} onChange={set('note')} />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setForm(null)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:text-foreground transition-colors">Vazgeç</button>
                <button
                  onClick={save}
                  disabled={busy || !form.client_email.trim() || !form.items.some((it) => it.name.trim())}
                  className="inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {busy ? 'Kaydediliyor...' : 'Teklifi kaydet'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}