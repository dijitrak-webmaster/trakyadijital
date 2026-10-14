import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import { input, slugify } from '@/components/admin/formKit';
import ImageUpload from '@/components/admin/ImageUpload';
import { THEME_ICON_NAMES, THEME_FONTS, DEFAULT_PALETTE } from '@/lib/demoThemeData';

const EMPTY_FEATURE = () => ({ icon: 'Star', title: '', text: '' });

const EMPTY = {
  id: null, key: '', brand: '',
  heroStyle: 'overlay', head: "'Playfair Display', serif", headClass: '',
  palette: { ...DEFAULT_PALETTE },
  nav: ['', '', '', ''],
  hero: { eyebrow: '', title: '', text: '', cta: '', cta2: '', image: '' },
  featuresTitle: '', features: [EMPTY_FEATURE(), EMPTY_FEATURE(), EMPTY_FEATURE(), EMPTY_FEATURE()],
  about: { title: '', text: '', image: '', stats: [['', ''], ['', ''], ['', '']] },
  quote: { text: '', author: '' },
  contact: { phone: '', address: '', hours: '' },
};

const PALETTE_LABELS = [
  ['bg', 'Arka plan'], ['surface', 'Kart yüzeyi'], ['text', 'Yazı'], ['muted', 'Soluk yazı'],
  ['accent', 'Vurgu'], ['on', 'Vurgu üstü yazı'], ['border', 'Çizgi'],
];

const recordToForm = (rec) => {
  let d = {};
  try { d = JSON.parse(rec.data || '{}'); } catch { d = {}; }
  return {
    ...EMPTY,
    id: rec.id, key: rec.key || '', brand: rec.brand || '',
    heroStyle: d.heroStyle === 'split' ? 'split' : 'overlay',
    head: d.head || EMPTY.head,
    headClass: d.headClass || '',
    palette: { ...EMPTY.palette, ...(d.palette || {}) },
    nav: [...(d.nav || []), '', '', '', ''].slice(0, 4),
    hero: { ...EMPTY.hero, ...(d.hero || {}) },
    featuresTitle: d.featuresTitle || '',
    features: [...(d.features || []), ...Array.from({ length: 4 })]
      .slice(0, 4).map((f) => ({ ...EMPTY_FEATURE(), ...(f || {}) })),
    about: {
      ...EMPTY.about, ...(d.about || {}),
      stats: [...(d.about?.stats || []), ...Array.from({ length: 3 })]
        .slice(0, 3).map((s) => [...(s || []), '', ''].slice(0, 2)),
    },
    quote: { ...EMPTY.quote, ...(d.quote || {}) },
    contact: { ...EMPTY.contact, ...(d.contact || {}) },
  };
};

const formToRecord = (form) => ({
  key: form.key || slugify(form.brand),
  brand: form.brand,
  data: JSON.stringify({
    heroStyle: form.heroStyle, head: form.head, headClass: form.headClass,
    palette: form.palette, nav: form.nav, hero: form.hero,
    featuresTitle: form.featuresTitle, features: form.features,
    about: form.about, quote: form.quote, contact: form.contact,
  }),
});

const Section = ({ title, children }) => (
  <div className="pt-2">
    <p className="font-mono text-xs uppercase text-mint">{title}</p>
    <div className="mt-3 grid gap-3">{children}</div>
  </div>
);

const Label = ({ children }) => (
  <label className="text-xs font-semibold text-muted-foreground">{children}</label>
);

const ColorField = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <input type="color" value={value} onChange={onChange} className="mt-1 h-10 w-full rounded-xl border border-border bg-card cursor-pointer" />
    <p className="font-mono text-[10px] text-muted-foreground mt-1">{value}</p>
  </div>
);

/** Yönetim panelinden canlı demo temaları oluşturur — /demo/<anahtar> adresinde açılır. */
export default function ThemeManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.DemoTheme.list('-created_date', 100).then(setItems);
  useEffect(() => { load(); }, []);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPalette = (k) => (e) => setForm((f) => ({ ...f, palette: { ...f.palette, [k]: e.target.value } }));
  const setHero = (k) => (e) => setForm((f) => ({ ...f, hero: { ...f.hero, [k]: e.target.value } }));
  const setAbout = (k) => (e) => setForm((f) => ({ ...f, about: { ...f.about, [k]: e.target.value } }));
  const setQuote = (k) => (e) => setForm((f) => ({ ...f, quote: { ...f.quote, [k]: e.target.value } }));
  const setContact = (k) => (e) => setForm((f) => ({ ...f, contact: { ...f.contact, [k]: e.target.value } }));
  const setNav = (i) => (e) => setForm((f) => ({ ...f, nav: f.nav.map((n, j) => (j === i ? e.target.value : n)) }));
  const setFeature = (i, k) => (e) => setForm((f) => ({
    ...f, features: f.features.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
  }));
  const setStat = (i, part) => (e) => setForm((f) => ({
    ...f, about: {
      ...f.about, stats: f.about.stats.map((s, j) => (
        j === i ? (part === 0 ? [e.target.value, s[1]] : [s[0], e.target.value]) : s
      )),
    },
  }));

  const save = async () => {
    if (!form.brand.trim()) return;
    setSaving(true);
    const rec = formToRecord(form);
    if (form.id) await base44.entities.DemoTheme.update(form.id, rec);
    else await base44.entities.DemoTheme.create(rec);
    setSaving(false);
    setForm(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu tema silinsin mi?')) return;
    await base44.entities.DemoTheme.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Canlı demo temaları — her tema /demo/&lt;anahtar&gt; adresinde açılır</p>
        <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Yeni Tema
        </button>
      </div>

      {items === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz özel tema yok — hazır demolar: harvest, terminal, sunny, fog.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4">
              <span className="w-10 h-10 rounded-xl shrink-0" style={{ background: (JSON.parse(it.data || '{}').palette || {}).accent || '#d99a1e' }} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{it.brand}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">/demo/{it.key}</p>
              </div>
              <a href={`/demo/${it.key}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl border border-border hover:text-mint transition-colors" aria-label="Önizle">
                <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={() => setForm(recordToForm(it))} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle">
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
            <DialogTitle className="font-display">{form?.id ? 'Temayı düzenle' : 'Yeni tema'}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-2 pt-2">
              <Section title="Temel">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Marka adı</Label>
                    <input className={`${input} mt-1`} value={form.brand} onChange={setField('brand')} placeholder="Ör. Deniz Fener Kafe" />
                  </div>
                  <div>
                    <Label>Demo anahtarı (boş bırakılırsa markadan üretilir)</Label>
                    <input className={`${input} mt-1`} value={form.key} onChange={setField('key')} placeholder="deniz-fener" />
                  </div>
                </div>
              </Section>

              <Section title="Stil">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Hero düzeni</Label>
                    <select className={`${input} mt-1`} value={form.heroStyle} onChange={setField('heroStyle')}>
                      <option value="overlay">Görsel üstüne yazı</option>
                      <option value="split">Yan yana</option>
                    </select>
                  </div>
                  <div>
                    <Label>Başlık yazı tipi</Label>
                    <select className={`${input} mt-1`} value={form.head} onChange={setField('head')}>
                      {THEME_FONTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Başlık stili</Label>
                    <select className={`${input} mt-1`} value={form.headClass} onChange={setField('headClass')}>
                      <option value="">Normal</option>
                      <option value="uppercase tracking-tight">Büyük harf, sıkı</option>
                    </select>
                  </div>
                </div>
              </Section>

              <Section title="Renk paleti">
                <div className="grid grid-cols-4 gap-3">
                  {PALETTE_LABELS.map(([k, l]) => (
                    <ColorField key={k} label={l} value={form.palette[k]} onChange={setPalette(k)} />
                  ))}
                </div>
              </Section>

              <Section title="Menü (4 öğe)">
                <div className="grid grid-cols-4 gap-2">
                  {form.nav.map((n, i) => (
                    <input key={i} className={input} value={n} onChange={setNav(i)} placeholder={['Ana Sayfa', 'Hizmetler', 'Hakkımızda', 'İletişim'][i]} />
                  ))}
                </div>
              </Section>

              <Section title="Hero">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Üst yazı</Label>
                    <input className={`${input} mt-1`} value={form.hero.eyebrow} onChange={setHero('eyebrow')} placeholder="Merkez · 2010'dan beri" />
                  </div>
                  <div>
                    <Label>Büyük başlık</Label>
                    <input className={`${input} mt-1`} value={form.hero.title} onChange={setHero('title')} />
                  </div>
                </div>
                <div>
                  <Label>Açıklama</Label>
                  <textarea className={`${input} mt-1`} rows={2} value={form.hero.text} onChange={setHero('text')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>1. buton</Label>
                    <input className={`${input} mt-1`} value={form.hero.cta} onChange={setHero('cta')} />
                  </div>
                  <div>
                    <Label>2. buton</Label>
                    <input className={`${input} mt-1`} value={form.hero.cta2} onChange={setHero('cta2')} />
                  </div>
                </div>
                <div>
                  <Label>Hero görseli</Label>
                  <div className="mt-1"><ImageUpload value={form.hero.image} onChange={(v) => setForm((f) => ({ ...f, hero: { ...f.hero, image: v } }))} /></div>
                </div>
              </Section>

              <Section title="Özellikler (4 kart)">
                <div>
                  <Label>Bölüm başlığı</Label>
                  <input className={`${input} mt-1`} value={form.featuresTitle} onChange={setField('featuresTitle')} placeholder="Neden biz?" />
                </div>
                {form.features.map((ft, i) => (
                  <div key={i} className="grid grid-cols-[1.2fr_1fr_2fr] gap-2 items-center">
                    <select className={input} value={ft.icon} onChange={setFeature(i, 'icon')}>
                      {THEME_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <input className={input} value={ft.title} onChange={setFeature(i, 'title')} placeholder="Başlık" />
                    <input className={input} value={ft.text} onChange={setFeature(i, 'text')} placeholder="Kısa metin" />
                  </div>
                ))}
              </Section>

              <Section title="Hakkımızda">
                <div>
                  <Label>Başlık</Label>
                  <input className={`${input} mt-1`} value={form.about.title} onChange={setAbout('title')} />
                </div>
                <div>
                  <Label>Metin</Label>
                  <textarea className={`${input} mt-1`} rows={2} value={form.about.text} onChange={setAbout('text')} />
                </div>
                <div>
                  <Label>Görsel</Label>
                  <div className="mt-1"><ImageUpload value={form.about.image} onChange={(v) => setForm((f) => ({ ...f, about: { ...f.about, image: v } }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {form.about.stats.map((s, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <input className={input} value={s[0]} onChange={setStat(i, 0)} placeholder={['1.200', '35+', '14'][i]} />
                      <input className={input} value={s[1]} onChange={setStat(i, 1)} placeholder="İstatistik etiketi" />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Müşteri yorumu">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Yorum</Label>
                    <input className={`${input} mt-1`} value={form.quote.text} onChange={setQuote('text')} />
                  </div>
                  <div>
                    <Label>Kişi</Label>
                    <input className={`${input} mt-1`} value={form.quote.author} onChange={setQuote('author')} placeholder="Ayşe D. — Müdavim" />
                  </div>
                </div>
              </Section>

              <Section title="İletişim">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Telefon</Label>
                    <input className={`${input} mt-1`} value={form.contact.phone} onChange={setContact('phone')} />
                  </div>
                  <div>
                    <Label>Adres</Label>
                    <input className={`${input} mt-1`} value={form.contact.address} onChange={setContact('address')} />
                  </div>
                  <div>
                    <Label>Çalışma saatleri</Label>
                    <input className={`${input} mt-1`} value={form.contact.hours} onChange={setContact('hours')} />
                  </div>
                </div>
              </Section>

              <button onClick={save} disabled={saving || !form.brand.trim()} className="mt-2 rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}