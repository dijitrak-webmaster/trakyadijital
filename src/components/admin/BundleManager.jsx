import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Globe, EyeOff } from 'lucide-react';
import { input, ColorSelect, slugify } from '@/components/admin/formKit';

const EMPTY = { title: '', description: '', item_ids: '', price: 0, badge: '', color: 'bg-coral', status: 'draft' };

/** Bundle paketleri yönetir: birden fazla ürün kombinlenip indirimli tek fiyat belirlenir. */
export default function BundleManager() {
  const [bundles, setBundles] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Bundle.list('-created_date', 100).then(setBundles);
    base44.entities.MarketItem.list('-created_date', 200).then(setItems).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const toggleItem = (id) => setForm((f) => {
    const cur = (f.item_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    return { ...f, item_ids: next.join(',') };
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'price' ? Number(e.target.value) || 0 : e.target.value }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const data = { ...form, slug: form.slug || slugify(form.title) };
    if (form.id) await base44.entities.Bundle.update(form.id, data);
    else await base44.entities.Bundle.create(data);
    setSaving(false); setForm(null); load();
  };

  const togglePublish = async (b) => {
    await base44.entities.Bundle.update(b.id, { status: b.status === 'published' ? 'draft' : 'published' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu bundle silinsin mi?')) return;
    await base44.entities.Bundle.delete(id);
    load();
  };

  const selectedIds = (form?.item_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origOf = (ids) => items.filter((i) => ids.includes(i.id)).reduce((t, i) => t + (i.price || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Bundle paketler — yayında olanlar market landing'de görünür</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Bundle
        </button>
      </div>

      {bundles === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : bundles.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz bundle yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {bundles.map((b) => {
            const ids = (b.item_ids || '').split(',').filter(Boolean);
            return (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className={`w-3 h-10 rounded-full ${b.color || 'bg-coral'} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{b.title}{b.badge ? ` · ${b.badge}` : ''}</p>
                  <p className="font-mono text-xs text-muted-foreground truncate">{ids.length} ürün · {(b.price || 0).toLocaleString('tr-TR')} ₺ (listede {origOf(ids).toLocaleString('tr-TR')} ₺)</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${b.status === 'published' ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>
                  {b.status === 'published' ? 'Yayında' : 'Taslak'}
                </span>
                <button onClick={() => togglePublish(b)} className={`p-2 rounded-xl border border-border transition-colors ${b.status === 'published' ? 'hover:text-coral' : 'hover:text-mint'}`} title={b.status === 'published' ? 'Yayından al' : 'Yayınla'}>
                  {b.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                </button>
                <button onClick={() => setForm({ ...b })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(b.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{form?.id ? 'Bundle düzenle' : 'Yeni bundle'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Paket adı</label>
                  <input className={`${input} mt-1`} value={form.title} onChange={set('title')} placeholder="Başlangıç Bundle'ı" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Rozet (opsiyonel)</label>
                  <input className={`${input} mt-1`} value={form.badge} onChange={set('badge')} placeholder="En Avantajlı" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Açıklama</label>
                <textarea className={`${input} mt-1`} rows={2} value={form.description} onChange={set('description')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Pakete dahil ürünler ({selectedIds.length} seçili)</label>
                <div className="mt-1 max-h-44 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                  {items.map((i) => (
                    <label key={i.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-secondary/50">
                      <input type="checkbox" checked={selectedIds.includes(i.id)} onChange={() => toggleItem(i.id)} className="accent-[hsl(150_78%_58%)]" />
                      <span className="text-sm truncate">{i.title}</span>
                      <span className="ml-auto font-mono text-xs text-muted-foreground">{(i.price || 0).toLocaleString('tr-TR')} ₺</span>
                    </label>
                  ))}
                  {items.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">Önce market ürünü oluşturun.</p>}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Seçilenlerin liste toplamı: {origOf(selectedIds).toLocaleString('tr-TR')} ₺ — bundle fiyatı bunun altında olmalı.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Bundle fiyatı (₺)</label>
                  <input className={`${input} mt-1`} type="number" value={form.price} onChange={set('price')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Renk</label>
                  <div className="mt-1"><ColorSelect value={form.color} onChange={(v) => setForm((f) => ({ ...f, color: v }))} /></div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>
              <button onClick={save} disabled={saving || !form.title.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}