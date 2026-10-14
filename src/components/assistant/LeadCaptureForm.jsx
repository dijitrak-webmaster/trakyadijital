import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const field = 'w-full rounded-xl bg-card border-2 border-border px-3 py-3 text-base sm:text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-mint/70 transition-colors';

export default function LeadCaptureForm({ mode, onSubmit }) {
  const [v, setV] = useState({ name: '', phone: '', email: '', company: '', appointment_date: '', appointment_time: '10:00' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // 📅 gerçek dolu saatler — seçilen günün randevu taleplerinden
  const [busySlots, setBusySlots] = useState([]);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const isAppt = mode === 'appointment';

  useEffect(() => {
    if (!isAppt) return;
    if (!v.appointment_date) { setBusySlots([]); return; }
    let alive = true;
    (async () => {
      try {
        const res = await base44.functions.invoke('appointmentSlots', { date: v.appointment_date });
        const taken = (res?.data?.busy || []).map((b) => b.time);
        if (!alive) return;
        setBusySlots(taken);
        if (taken.includes(v.appointment_time)) {
          const free = TIMES.find((t) => !taken.includes(t));
          if (free) setV((p) => ({ ...p, appointment_time: free }));
        }
      } catch { if (alive) setBusySlots([]); }
    })();
    return () => { alive = false; };
  }, [isAppt, v.appointment_date]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const data = Object.fromEntries(Object.entries(v).filter(([k, x]) => x && (isAppt || !k.startsWith('appointment'))));
    try {
      await onSubmit(data);
    } catch {
      setErr('Gönderilemedi, lütfen tekrar deneyin.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2.5 rounded-2xl border-2 border-coral/40 bg-card p-4">
      <input required placeholder="Ad Soyad *" value={v.name} onChange={set('name')} className={field} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input required type="tel" placeholder="Telefon *" value={v.phone} onChange={set('phone')} className={field} />
        <input type="email" placeholder="E-posta" value={v.email} onChange={set('email')} className={field} />
      </div>
      <input placeholder="Firma adı" value={v.company} onChange={set('company')} className={field} />
      {isAppt && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input required type="date" min={new Date().toISOString().slice(0, 10)} value={v.appointment_date} onChange={set('appointment_date')} className={field} />
          <select value={v.appointment_time} onChange={set('appointment_time')} className={field}>
            {TIMES.map((t) => (
              <option key={t} disabled={busySlots.includes(t)}>{t}{busySlots.includes(t) ? ' (dolu)' : ''}</option>
            ))}
          </select>
        </div>
      )}
      {err && <p className="text-sm text-coral">{err}</p>}
      <button disabled={busy} className="w-full rounded-xl border-2 border-ink/20 bg-mint text-ink font-semibold py-2.5 text-sm shadow-sticker hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {isAppt ? 'Randevuyu Onayla' : 'Talebimi Gönder'}
      </button>
    </form>
  );
}