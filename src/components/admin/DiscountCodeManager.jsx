import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { input } from '@/components/admin/formKit';

const EMPTY = { code: '', discount_type: 'percent', discount_value: 10, status: 'active', note: '' };

/** Bağımsız indirim kodlarını yönetir (kampanyalardan ayrı, sepette geçerli). */
export default function DiscountCodeManager() {
  const [list, setList] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.DiscountCode.list('-created_date', 100).then(setList);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'discount_value' ? Number(e.target.value) || 0 : e.target.value }));

  const save = async () => {
    if (!form.code.trim()) return;
    setSaving(true);
    const data = { ...form, code: form.code.trim().toUpperCase() };
    if (form.id) await base44.entities.DiscountCode.update(form.id, data);
    else await base44.entities.DiscountCode.create(data);
    setSaving(false); setForm(null); load();
  };

  const toggleStatus = async (c) => {
    await base44.entities.DiscountCode.update(c.id, { status: c.status === 'active' ? 'passive' : 'active' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu kod silinsin mi?')) return;
    await base44.entities.DiscountCode.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">İndirim kodları — sepet adımında girilir, pasif kodlar geçersiz sayılır</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Kod
        </button>
      </div>

      {list === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : list.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz kod yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {list.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold font-mono truncate">{c.code}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {c.discount_type === 'fixed' ? `${(c.discount_value || 0).toLocaleString('tr-TR')} ₺` : `%${c.discount_value}`}{c.note ? ` · ${c.note}` : ''}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${c.status === 'active' ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>
                {c.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
              <button onClick={() => toggleStatus(c)} className="p-2 hover:text-mint transition-colors" aria-label="Durumu değiştir" title="Aktif / Pasif">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setForm({ ...c })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(c.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{form?.id ? 'Kodu düzenle' : 'Yeni indirim kodu'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kod</label>
                <input className={`${input} mt-1 uppercase`} value={form.code} onChange={set('code')} placeholder="HOSGELDIN10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim tipi</label>
                  <select className={`${input} mt-1`} value={form.discount_type} onChange={set('discount_type')}>
                    <option value="percent">Yüzde (%)</option>
                    <option value="fixed">Sabit (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim değeri ({form.discount_type === 'fixed' ? '₺' : '%'})</label>
                  <input className={`${input} mt-1`} type="number" value={form.discount_value} onChange={set('discount_value')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Yönetici notu (opsiyonel)</label>
                <input className={`${input} mt-1`} value={form.note} onChange={set('note')} placeholder="İlk sipariş için" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                  <option value="active">Aktif</option>
                  <option value="passive">Pasif</option>
                </select>
              </div>
              <button onClick={save} disabled={saving || !form.code.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}