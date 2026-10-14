import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Globe, EyeOff } from 'lucide-react';
import { input } from '@/components/admin/formKit';

const EMPTY = { title: '', description: '', code: '', discount_type: 'percent', discount_value: 10, valid_until: '', status: 'draft' };

/** Kampanyaları yönetir: her kampanya sepette geçerli bir indirim kodu taşır. */
export default function CampaignManager() {
  const [list, setList] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.Campaign.list('-created_date', 100).then(setList);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'discount_value' ? Number(e.target.value) || 0 : e.target.value }));

  const save = async () => {
    if (!form.title.trim() || !form.code.trim()) return;
    setSaving(true);
    const data = { ...form, code: form.code.trim().toUpperCase() };
    if (form.id) await base44.entities.Campaign.update(form.id, data);
    else await base44.entities.Campaign.create(data);
    setSaving(false); setForm(null); load();
  };

  const togglePublish = async (c) => {
    await base44.entities.Campaign.update(c.id, { status: c.status === 'published' ? 'draft' : 'published' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu kampanya silinsin mi?')) return;
    await base44.entities.Campaign.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Kampanyalar — yayında olanlar market landing'de koduyla birlikte görünür</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Kampanya
        </button>
      </div>

      {list === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : list.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz kampanya yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {list.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{c.title}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {c.code} · {c.discount_type === 'fixed' ? `${(c.discount_value || 0).toLocaleString('tr-TR')} ₺` : `%${c.discount_value}`}{c.valid_until ? ` · ${new Date(c.valid_until).toLocaleDateString('tr-TR')}` : ''}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${c.status === 'published' ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>
                {c.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
              <button onClick={() => togglePublish(c)} className={`p-2 rounded-xl border border-border transition-colors ${c.status === 'published' ? 'hover:text-coral' : 'hover:text-mint'}`} title={c.status === 'published' ? 'Yayından al' : 'Yayınla'}>
                {c.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </button>
              <button onClick={() => setForm({ ...c })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(c.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{form?.id ? 'Kampanyayı düzenle' : 'Yeni kampanya'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kampanya adı</label>
                <input className={`${input} mt-1`} value={form.title} onChange={set('title')} placeholder="Yeni Sezon İndirimi" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Açıklama</label>
                <textarea className={`${input} mt-1`} rows={2} value={form.description} onChange={set('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim kodu</label>
                  <input className={`${input} mt-1 uppercase`} value={form.code} onChange={set('code')} placeholder="YAZ25" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim tipi</label>
                  <select className={`${input} mt-1`} value={form.discount_type} onChange={set('discount_type')}>
                    <option value="percent">Yüzde (%)</option>
                    <option value="fixed">Sabit (₺)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">İndirim değeri ({form.discount_type === 'fixed' ? '₺' : '%'})</label>
                  <input className={`${input} mt-1`} type="number" value={form.discount_value} onChange={set('discount_value')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Son geçerlilik (opsiyonel)</label>
                  <input className={`${input} mt-1`} type="date" value={form.valid_until || ''} onChange={set('valid_until')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>
              <button onClick={save} disabled={saving || !form.title.trim() || !form.code.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}