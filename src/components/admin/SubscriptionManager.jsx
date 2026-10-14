import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { addMonths, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { Plus, Trash2, Ban, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { input } from '@/components/admin/formKit';

const today = () => format(new Date(), 'yyyy-MM-dd');

const statusOf = (s) => {
  if (s.status === 'cancelled') return { label: 'İptal', cls: 'bg-secondary text-muted-foreground' };
  const days = differenceInCalendarDays(parseISO(s.end_date), new Date());
  if (days < 0) return { label: 'Süre doldu', cls: 'bg-coral text-ink' };
  if (days <= 7) return { label: `${days} gün sonra bitiyor`, cls: 'bg-sun text-ink' };
  return { label: 'Aktif', cls: 'bg-mint text-ink' };
};

/** Müşteriye süreli (aylık) abonelik tanımlama ve yönetimi. */
export default function SubscriptionManager() {
  const [subs, setSubs] = useState(null);
  const [items, setItems] = useState([]);
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => base44.entities.Subscription.list('-created_date', 200).then(setSubs);
  useEffect(() => {
    load();
    base44.entities.MarketItem.filter({ billing: 'monthly' }, '-created_date', 100)
      .then((rows) => setItems(rows))
      .catch(() => setItems([]));
    base44.entities.ClientProject.list('-updated_date', 200)
      .then((rows) => setEmails([...new Set(rows.map((r) => r.client_email).filter(Boolean))]))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.client_email.trim() || !form.item_id || !form.start_date) {
      setError('Müşteri e-postası, ürün ve başlangıç tarihi gerekli.');
      return;
    }
    setSaving(true);
    setError('');
    const item = items.find((i) => i.id === form.item_id);
    const rec = await base44.entities.Subscription.create({
      client_email: form.client_email.trim().toLowerCase(),
      item_id: item?.id || '',
      item_title: item?.title || 'Abonelik',
      monthly_price: item?.price || 0,
      months: Number(form.months) || 1,
      start_date: form.start_date,
      end_date: format(addMonths(parseISO(form.start_date), Number(form.months) || 1), 'yyyy-MM-dd'),
      note: form.note || '',
      status: 'active',
    });
    if (rec?.id) base44.functions.invoke('portalNotify', { event: 'subscription_created', subscription_id: rec.id }).catch(() => {});
    setSaving(false);
    setForm(null);
    load();
  };

  const toggleCancel = async (s) => {
    await base44.entities.Subscription.update(s.id, { status: s.status === 'cancelled' ? 'active' : 'cancelled' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu abonelik kaydı silinsin mi?')) return;
    await base44.entities.Subscription.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">Aylık abonelikler — müşteri portalında &quot;Aboneliklerim&quot; bölümünde görünür</p>
        <button onClick={() => setForm({ client_email: '', item_id: items[0]?.id || '', months: 12, start_date: today(), note: '' })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-sm hover:shadow-sticker transition-shadow">
          <Plus className="w-4 h-4" /> Abonelik Tanımla
        </button>
      </div>

      {subs === null ? (
        <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground mt-4">Yükleniyor...</div>
      ) : subs.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground mt-4">Henüz abonelik tanımlanmamış.</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl mt-4">
          {subs.map((s) => {
            const st = statusOf(s);
            return (
              <div key={s.id} className="flex items-center gap-4 p-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{s.item_title} · <span className="font-mono text-xs text-muted-foreground">{s.client_email}</span></p>
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {(s.monthly_price || 0).toLocaleString('tr-TR')} ₺/ay · {s.start_date} → {s.end_date} · {s.months} ay{s.note ? ` · ${s.note}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${st.cls}`}>{st.label}</span>
                <button
                  onClick={() => toggleCancel(s)}
                  title={s.status === 'cancelled' ? 'Yeniden aktifleştir' : 'İptal et'}
                  className="p-2 rounded-xl border border-border transition-colors hover:text-sun"
                >
                  {s.status === 'cancelled' ? <RotateCcw className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(s.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Aylık abonelik tanımla</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Müşteri e-postası (portal girişi)</label>
                <input className={`${input} mt-1`} type="email" list="subEmails" value={form.client_email} onChange={set('client_email')} placeholder="musteri@ornek.com" />
                <datalist id="subEmails">{emails.map((e) => <option key={e} value={e} />)}</datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Aylık ürün</label>
                <select className={`${input} mt-1`} value={form.item_id} onChange={set('item_id')}>
                  {items.length === 0 && <option value="">Aylık ürün yok — önce markette tanımlayın</option>}
                  {items.map((i) => <option key={i.id} value={i.id}>{i.title} — {(i.price || 0).toLocaleString('tr-TR')} ₺/ay</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Başlangıç</label>
                  <input className={`${input} mt-1`} type="date" value={form.start_date} onChange={set('start_date')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Süre (ay)</label>
                  <input className={`${input} mt-1`} type="number" min="1" value={form.months} onChange={set('months')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Not (müşteriye görünür)</label>
                <input className={`${input} mt-1`} value={form.note} onChange={set('note')} placeholder="Örn. Aylık bakım + barındırma" />
              </div>
              {error && <p className="text-xs text-coral">{error}</p>}
              <button onClick={save} disabled={saving} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Aboneliği Oluştur'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}