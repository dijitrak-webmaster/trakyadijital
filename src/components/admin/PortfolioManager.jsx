import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Globe, EyeOff } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { input, ColorSelect } from '@/components/admin/formKit';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY = { title: '', client: '', sector: 'Tarım', summary: '', result: '', image_url: '', color: 'bg-mint', status: 'draft' };

export default function PortfolioManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.PortfolioProject.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (form.id) await base44.entities.PortfolioProject.update(form.id, form);
    else await base44.entities.PortfolioProject.create(form);
    setSaving(false);
    setForm(null);
    load();
  };

  const togglePublish = async (it) => {
    await base44.entities.PortfolioProject.update(it.id, { status: it.status === 'published' ? 'draft' : 'published' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu proje silinsin mi?')) return;
    await base44.entities.PortfolioProject.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Portföy projeleri (ana sayfada görünür)</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Proje
        </button>
      </div>

      {items === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz portföy projesi yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4">
            {it.image_url ? <Image src={it.image_url} className="w-10 h-10 rounded-xl object-cover shrink-0" /> : <div className={`w-3 h-10 rounded-full ${it.color || 'bg-mint'} shrink-0`} />}
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{it.title}</p>
                <p className="font-mono text-xs text-muted-foreground">{it.client} · {it.sector} · {it.result}</p>
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
            <DialogTitle className="font-display">{form?.id ? 'Projeyi düzenle' : 'Yeni portföy projesi'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Proje adı</label>
                  <input className={`${input} mt-1`} value={form.title} onChange={set('title')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Müşteri</label>
                  <input className={`${input} mt-1`} value={form.client} onChange={set('client')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Sektör</label>
                  <input className={`${input} mt-1`} value={form.sector} onChange={set('sector')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Sonuç (metrik)</label>
                  <input className={`${input} mt-1`} value={form.result} onChange={set('result')} placeholder="+%280 satış" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Özet</label>
                <textarea className={`${input} mt-1`} rows={3} value={form.summary} onChange={set('summary')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kapak görseli</label>
                <div className="mt-1"><ImageUpload value={form.image_url || ''} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} /></div>
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