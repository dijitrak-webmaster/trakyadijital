import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Globe, EyeOff } from 'lucide-react';
import { input, ColorSelect, slugify } from '@/components/admin/formKit';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY = { title: '', slug: '', category: 'paket', description: '', features: '', price: 0, billing: 'one_time', image_url: '', preview_url: '', badge: '', rating: '', rating_count: '', color: 'bg-mint', status: 'draft' };
const CATS = [['tema', 'Tema'], ['paket', 'Paket'], ['nfckart', 'NFC Kart'], ['eklenti', 'Eklenti']];

/** Market ürünlerini (tema/paket/NFC kart/eklenti) yönetir. */
export default function MarketManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.MarketItem.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'price' ? Number(e.target.value) || 0 : e.target.value }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const data = { ...form, slug: form.slug || slugify(form.title) };
    if (form.id) await base44.entities.MarketItem.update(form.id, data);
    else await base44.entities.MarketItem.create(data);
    setSaving(false);
    setForm(null);
    load();
  };

  const togglePublish = async (it) => {
    await base44.entities.MarketItem.update(it.id, { status: it.status === 'published' ? 'draft' : 'published' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu ürün silinsin mi?')) return;
    await base44.entities.MarketItem.delete(id);
    load();
  };

  const catLabel = (c) => (CATS.find(([k]) => k === c) || [])[1] || c;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Market ürünleri — yayında olanlar /market sayfasında görünür</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Ürün
        </button>
      </div>

      {items === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz ürün yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4">
              <div className={`w-3 h-10 rounded-full ${it.color || 'bg-mint'} shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{it.title}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">{catLabel(it.category)} · {(it.price || 0).toLocaleString('tr-TR')} ₺{it.billing === 'monthly' ? ' /ay · Abonelik' : ''}{it.badge ? ` · ${it.badge}` : ''}{it.rating ? ` · ${it.rating}/5` : ''}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${it.status === 'published' ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>
                {it.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
              <button
                onClick={() => togglePublish(it)}
                title={it.status === 'published' ? 'Yayından al' : 'Yayınla'}
                className={`p-2 rounded-xl border border-border transition-colors ${it.status === 'published' ? 'hover:text-coral' : 'hover:text-mint'}`}
              >
                {it.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </button>
              <button onClick={() => setForm({ ...it })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(it.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{form?.id ? 'Ürünü düzenle' : 'Yeni ürün'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Ürün adı</label>
                  <input className={`${input} mt-1`} value={form.title} onChange={set('title')} placeholder="NFC İşletme Kartı (50 adet)" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Kategori</label>
                  <select className={`${input} mt-1`} value={form.category} onChange={set('category')}>
                    {CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Açıklama</label>
                <textarea className={`${input} mt-1`} rows={3} value={form.description} onChange={set('description')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Özellikler (virgülle ayır)</label>
                <input className={`${input} mt-1`} value={form.features} onChange={set('features')} placeholder="Ön yüz baskı, NFC çip, kurulum desteği" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Fiyat (₺)</label>
                  <input className={`${input} mt-1`} type="number" value={form.price} onChange={set('price')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Rozet (opsiyonel)</label>
                  <input className={`${input} mt-1`} value={form.badge} onChange={set('badge')} placeholder="Popüler" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Puan (0-5, boşsa yıldız gizli)</label>
                  <input
                    className={`${input} mt-1`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value === '' ? '' : Number(e.target.value) }))}
                    placeholder="4.8"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Değerlendirme sayısı</label>
                  <input
                    className={`${input} mt-1`}
                    type="number"
                    min="0"
                    value={form.rating_count ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, rating_count: e.target.value === '' ? '' : Number(e.target.value) }))}
                    placeholder="32"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kapak görseli</label>
                <div className="mt-1"><ImageUpload value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} /></div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Canlı önizleme adresi (opsiyonel)</label>
                <input className={`${input} mt-1`} value={form.preview_url || ''} onChange={set('preview_url')} placeholder="/demo/harvest veya https://demo.ornek.com" />
                <p className="text-[11px] text-muted-foreground mt-1">Doluysa detay sayfasında masaüstü / tablet / mobil önizleme açılır. Ürününün linkini (https://...) direkt yapıştırabilirsin — o sitenin iframe içinde gösterilmeye izin vermesi gerekir. Hazır demolar: /demo/harvest, /demo/terminal, /demo/sunny, /demo/fog</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Renk</label>
                  <div className="mt-1"><ColorSelect value={form.color} onChange={(v) => setForm((f) => ({ ...f, color: v }))} /></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                  <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                    <option value="draft">Taslak</option>
                    <option value="published">Yayında</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Faturalandırma</label>
                <select className={`${input} mt-1`} value={form.billing} onChange={set('billing')}>
                  <option value="one_time">Tek seferlik</option>
                  <option value="monthly">Aylık abonelik</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">Aylık seçilirse fiyat aylık tutar sayılır ve müşteriye abonelik tanımlanabilir.</p>
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