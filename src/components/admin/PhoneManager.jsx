import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Phone } from 'lucide-react';
import { input } from '@/components/admin/formKit';

// Türkiye odaklı numara normalizasyonu: 05xx / 5xx / 905xx -> 905xxxxxxxxx
const normalizePhoneTr = (raw) => {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('90')) return d;
  if (d.length === 11 && d.startsWith('0')) return '90' + d.slice(1);
  if (d.length === 10) return '90' + d;
  return d;
};

export default function PhoneManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ phone: '', client_email: '', note: '' });
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.ClientPhone.list('-created_date', 100).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.phone.trim() || !form.client_email.trim()) return;
    setSaving(true);
    await base44.entities.ClientPhone.create({
      phone: normalizePhoneTr(form.phone),
      client_email: form.client_email.trim().toLowerCase(),
      note: form.note.trim(),
    });
    setForm({ phone: '', client_email: '', note: '' });
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu eşleştirme silinsin mi?')) return;
    await base44.entities.ClientPhone.delete(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-2xl bg-card/50 p-5 space-y-3">
        <p className="text-sm text-foreground/70">
          <Phone className="w-4 h-4 inline mr-1 text-mint" />
          WhatsApp numarasını bir müşteri e-postasına eşleştirin; eşleşen numara WhatsApp'tan yazdığında <strong className="text-mint">müşteri hizmetleri asistanı</strong> (proje durumu, revizyon talebi, abonelik bilgisi, destek) cevap verir. Eşleşmeyen numaralar satış asistanına düşer.
        </p>
        <div className="grid md:grid-cols-[1fr_1.2fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">WhatsApp numarası</label>
            <input className={`${input} mt-1`} placeholder="0532 123 45 67" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Müşteri e-postası</label>
            <input className={`${input} mt-1`} type="email" placeholder="musteri@firma.com" value={form.client_email} onChange={set('client_email')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Not (opsiyonel)</label>
            <input className={`${input} mt-1`} value={form.note} onChange={set('note')} />
          </div>
          <button onClick={save} disabled={saving || !form.phone.trim() || !form.client_email.trim()} className="flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm disabled:opacity-50">
            <Plus className="w-4 h-4" /> Eşleştir
          </button>
        </div>
      </div>
      {items === null ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">Henüz telefon eşleştirmesi yok.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-mono font-semibold">{it.phone}</p>
                <p className="font-mono text-xs text-muted-foreground">{it.client_email}{it.note ? ` · ${it.note}` : ''}</p>
              </div>
              <button onClick={() => remove(it.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}