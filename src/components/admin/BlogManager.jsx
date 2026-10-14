import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Globe, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Image } from '@/components/ui/image';
import { slugify, input, ColorSelect } from '@/components/admin/formKit';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY = { title: '', slug: '', category: 'Rehber', author: '', excerpt: '', content: '', image_url: '', meta_title: '', meta_description: '', tags: '', color: 'bg-mint', status: 'draft' };

export default function BlogManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const { toast } = useToast();

  // AI blog taslağı: başlıktan özet + gövde üretir; AI kapalıysa uyarı verir
  const aiDraft = async () => {
    setAiBusy(true);
    try {
      const res = await base44.functions.invoke('aiBlogDraft', { title: form.title, category: form.category });
      if (res?.data?.content) {
        setForm((f) => ({ ...f, excerpt: f.excerpt || res.data.excerpt, content: res.data.content }));
        toast({ title: 'AI taslağı forma eklendi', description: 'Düzenleyip kaydedebilirsiniz.' });
      }
    } catch (e) {
      toast({ title: 'AI şu an kullanılamıyor', description: 'Entegrasyon kredileri yenilendiğinde çalışacak; metni elle girebilirsiniz.' });
    }
    setAiBusy(false);
  };

  const load = () => base44.entities.BlogPost.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const data = { ...form, slug: form.slug.trim() || slugify(form.title) };
    if (form.id) await base44.entities.BlogPost.update(form.id, data);
    else await base44.entities.BlogPost.create(data);
    setSaving(false);
    setForm(null);
    load();
  };

  const togglePublish = async (it) => {
    await base44.entities.BlogPost.update(it.id, { status: it.status === 'published' ? 'draft' : 'published' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu yazı silinsin mi?')) return;
    await base44.entities.BlogPost.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Blog yazıları</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Yazı
        </button>
      </div>

      {items === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz yazı yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4">
            {it.image_url ? <Image src={it.image_url} className="w-10 h-10 rounded-xl object-cover shrink-0" /> : <div className={`w-3 h-10 rounded-full ${it.color || 'bg-mint'} shrink-0`} />}
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{it.title}</p>
                <p className="font-mono text-xs text-muted-foreground">{it.category} · /blog/{it.slug}</p>
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
            <DialogTitle className="font-display">{form?.id ? 'Yazıyı düzenle' : 'Yeni yazı'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Başlık</label>
                <input className={`${input} mt-1`} value={form.title} onChange={set('title')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Kategori</label>
                  <input className={`${input} mt-1`} value={form.category} onChange={set('category')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Adres (boşsa başlıktan üretilir)</label>
                  <input className={`${input} mt-1`} value={form.slug} onChange={set('slug')} placeholder="ornek-yazi" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Yazar (boşsa Dijitrak)</label>
                <input className={`${input} mt-1`} value={form.author || ''} onChange={set('author')} placeholder="ör. Merve Yıldız" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kısa özet</label>
                <textarea className={`${input} mt-1`} rows={2} value={form.excerpt} onChange={set('excerpt')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">SEO başlığı (boşsa yazı başlığı)</label>
                  <input className={`${input} mt-1`} value={form.meta_title || ''} onChange={set('meta_title')} maxLength={60} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Etiketler (virgülle)</label>
                  <input className={`${input} mt-1`} value={form.tags || ''} onChange={set('tags')} placeholder="e-ticaret, seo, trakya" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">SEO açıklaması (boşsa özet kullanılır)</label>
                <textarea className={`${input} mt-1`} rows={2} value={form.meta_description || ''} onChange={set('meta_description')} maxLength={160} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Kapak görseli</label>
                <div className="mt-1"><ImageUpload value={form.image_url || ''} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} /></div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">İçerik (paragraflar boş satırla ayrılır; '## ' ile alt başlık eklenir)</label>
                <textarea className={`${input} mt-1`} rows={10} value={form.content} onChange={set('content')} />
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
              <div className="grid grid-cols-2 gap-3">
                <button onClick={aiDraft} disabled={aiBusy || !form.title.trim()} className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/50 text-mint font-semibold py-2.5 text-sm disabled:opacity-50">
                  <Sparkles className="w-4 h-4" /> {aiBusy ? 'AI yazıyor...' : 'AI taslak'}
                </button>
                <button onClick={save} disabled={saving || !form.title.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}