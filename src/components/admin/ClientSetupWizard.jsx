import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { input } from '@/components/admin/formKit';
import InviteLinkCard from '@/components/admin/InviteLinkCard';
import { magicLinkUrl } from '@/lib/inviteLink';
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Mail, UserRound, FolderKanban } from 'lucide-react';

// WhatsApp akışıyla aynı formatta numara normalizasyonu (05xx/5xx/10 haneli -> 905xxxxxxxxx)
const normalizePhone = (raw) => {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('90')) return d;
  if (d.length === 11 && d.startsWith('0')) return '90' + d.slice(1);
  if (d.length === 10) return '90' + d;
  return d;
};

const STEPS = [
  { label: 'Bilgiler', icon: UserRound },
  { label: 'Portal Erişimi', icon: Mail },
  { label: 'Projeler', icon: FolderKanban },
];

const PROJECT_STATUS = [
  { value: 'planned', label: 'Planlamada' },
  { value: 'in_progress', label: 'Devam ediyor' },
  { value: 'review', label: 'İncelemede' },
  { value: 'launched', label: 'Yayında' },
];

/** Kapsamlı müşteri kurulum sihirbazı:
 *  1) Müşteri kartı (işletme, yetkili, e-posta, telefon, sektör, not)
 *  2) Portal daveti + magic link paylaşımı
 *  3) Birden fazla proje ekleme + WhatsApp numara eşleştirmesi */
export default function ClientSetupWizard({ open, onClose, onDone, initialEmail = '' }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ business_name: '', contact_name: '', email: '', phone: '', sector: '', note: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState(null); // {email, link} — adım 2 sonucu
  const [projects, setProjects] = useState([{ title: '', status: 'planned' }]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm({ business_name: '', contact_name: '', email: initialEmail || '', phone: '', sector: '', note: '' });
      setError('');
      setBusy(false);
      setInvite(null);
      setProjects([{ title: '', status: 'planned' }]);
    }
  }, [open, initialEmail]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Adım 1 → müşteri kartı kaydedilir (e-posta benzersiz olmalı)
  const saveInfo = async () => {
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!form.business_name.trim() || !email.includes('@')) return;
    setBusy(true);
    try {
      const dup = await base44.entities.Client.filter({ email });
      if (dup.length) {
        setError('Bu e-posta zaten müşteri kayıtlı. Müşteriler sekmesinden düzenleyebilirsiniz.');
        setBusy(false);
        return;
      }
      await base44.entities.Client.create({
        business_name: form.business_name.trim(),
        contact_name: form.contact_name.trim(),
        email,
        phone: form.phone.trim(),
        sector: form.sector.trim(),
        note: form.note.trim(),
      });
      setStep(1);
    } catch (e) {
      setError(e.message || 'Müşteri kaydedilemedi');
    }
    setBusy(false);
  };

  // Adım 2 → portal daveti + tek kullanımlık giriş linki
  useEffect(() => {
    if (step !== 1 || invite || !form.email) return;
    let alive = true;
    setBusy(true);
    (async () => {
      let link = null;
      try {
        await base44.users.inviteUser(form.email.trim(), 'user');
      } catch (e) {
        if (alive) toast({ title: 'Davet gönderilemedi', description: `${e.message || ''} (hesap zaten varsa sorun değil)`.trim() });
      }
      try {
        const res = await base44.functions.invoke('magicLink', { action: 'create', email: form.email.trim().toLowerCase() });
        link = magicLinkUrl(res.data.token);
      } catch {}
      if (alive) setInvite({ email: form.email.trim(), link });
      if (alive) setBusy(false);
    })();
    return () => { alive = false; };
  }, [step]);

  // Adım 3 → projeler + WhatsApp eşleştirme
  const finish = async () => {
    setError('');
    const rows = projects.filter((p) => p.title.trim());
    setBusy(true);
    try {
      if (rows.length) {
        await base44.entities.ClientProject.bulkCreate(
          rows.map((p) => ({ title: p.title.trim(), client_email: form.email.trim(), status: p.status, progress: 0 }))
        );
      }
      if (form.phone.trim()) {
        try {
          await base44.entities.ClientPhone.create({ phone: normalizePhone(form.phone), client_email: form.email.trim() });
        } catch {}
      }
      toast({
        title: 'Müşteri hazır',
        description: `${form.email.trim()} portalına erişebiliyor${rows.length ? ` · ${rows.length} proje eklendi` : ''}.`,
      });
      onDone?.();
      onClose();
    } catch (e) {
      setError(e.message || 'Projeler kaydedilemedi');
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Yeni müşteri</DialogTitle>
        </DialogHeader>

        {/* adım göstergesi */}
        <div className="flex items-center gap-1 pt-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className={`flex-1 h-px ${step >= i ? 'bg-mint' : 'bg-border'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold ${step >= i ? 'bg-mint text-ink' : 'bg-secondary text-muted-foreground'}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === i ? 'text-mint' : 'text-muted-foreground'}`}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {error && <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>}

        {/* Adım 1: müşteri bilgileri */}
        {step === 0 && (
          <div className="grid gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">İşletme adı *</label>
              <input className={`${input} mt-1`} value={form.business_name} onChange={set('business_name')} placeholder="Ör. Trakya Bal Evi" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Yetkili kişi</label>
              <input className={`${input} mt-1`} value={form.contact_name} onChange={set('contact_name')} placeholder="Ör. Ayşe Yılmaz" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">E-posta (portal girişi) *</label>
              <input className={`${input} mt-1`} type="email" value={form.email} onChange={set('email')} placeholder="ornek@isletme.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Telefon</label>
                <input className={`${input} mt-1`} value={form.phone} onChange={set('phone')} placeholder="0532 123 45 67" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Sektör</label>
                <input className={`${input} mt-1`} value={form.sector} onChange={set('sector')} placeholder="Ör. Tarım" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Yönetici notu</label>
              <textarea className={`${input} mt-1`} rows={2} value={form.note} onChange={set('note')} />
            </div>
            <button onClick={saveInfo} disabled={busy || !form.business_name.trim() || !form.email.includes('@')} className="flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Devam Et <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        )}

        {/* Adım 2: portal daveti + magic link */}
        {step === 1 && (
          <div className="grid gap-4 pt-2">
            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Davet hazırlanıyor...
              </div>
            )}
            {invite && (
              <>
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold">{invite.email}</span> portal kullanıcısı olarak davet edildi. Davetli
                  <span className="font-mono text-xs text-mint"> /portal </span> ekranına bu e-postayla giriş yapar.
                </p>
                <InviteLinkCard email={invite.email} link={invite.link} />
              </>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 rounded-full bg-secondary font-semibold py-2.5 px-5 text-sm">
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
              <button onClick={() => setStep(2)} disabled={!invite} className="flex-1 flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold py-2.5 text-sm disabled:opacity-50">
                Projelere Geç <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Adım 3: projeler */}
        {step === 2 && (
          <div className="grid gap-3 pt-2">
            <p className="text-xs text-muted-foreground">Bu müşteriye istediğiniz kadar proje ekleyin — boş satırlar kaydedilmez.</p>
            {projects.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    className={input}
                    value={p.title}
                    onChange={(e) => setProjects((list) => list.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                    placeholder={`Proje ${i + 1} adı`}
                  />
                </div>
                <select
                  className={`${input} w-36`}
                  value={p.status}
                  onChange={(e) => setProjects((list) => list.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))}
                >
                  {PROJECT_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {projects.length > 1 && (
                  <button onClick={() => setProjects((list) => list.filter((_, j) => j !== i))} className="p-2 text-muted-foreground hover:text-coral" aria-label="Satırı kaldır">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setProjects((list) => [...list, { title: '', status: 'planned' }])} className="flex items-center gap-2 text-sm font-semibold text-mint hover:text-mint/80 w-fit">
              <Plus className="w-4 h-4" /> Başka proje ekle
            </button>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 rounded-full bg-secondary font-semibold py-2.5 px-5 text-sm">
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
              <button onClick={finish} disabled={busy} className="flex-1 rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                {busy ? 'Kaydediliyor...' : 'Tamamla'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}